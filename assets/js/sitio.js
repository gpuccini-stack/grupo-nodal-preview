/* =============================================================================
   GRUPO NODAL (v4) · COMPORTAMIENTO DEL SITIO
   - Tapiz visual parallax multi-capa + red nodal flotante en Canvas
   - Juego interactivo en el panel X ("Termómetro Nodal") con diagnóstico express
   - Datos centralizados (datos.js), buscador del árbol, diálogo y formularios
   ============================================================================= */
(function () {
  "use strict";
  var D = window.NODAL || {};
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var WA_SALUDO = "Hola, les escribo desde el sitio web de Grupo Nodal.";
  var DIAG = "diagnostico-express";

  function waUrl(texto) {
    var n = (D.whatsapp || "").replace(/\D/g, "");
    return "https://wa.me/" + n + (texto ? "?text=" + encodeURIComponent(texto) : "");
  }
  function mailUrl(asunto, cuerpo) {
    return "mailto:" + (D.correo || "") + "?subject=" + encodeURIComponent(asunto || "") + (cuerpo ? "&body=" + encodeURIComponent(cuerpo) : "");
  }
  function sinTildes(s) { return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  function escapar(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* 1. Datos de contacto desde datos.js ------------------------------------ */
  if (D.modoRevision) doc.documentElement.classList.add("revision");
  $$("[data-correo]").forEach(function (a) {
    if (!D.correo) return;
    var asunto = a.getAttribute("data-correo");
    a.href = mailUrl(asunto || "Consulta desde el sitio web");
    if (a.hasAttribute("data-correo-texto")) a.textContent = D.correo;
  });
  $$("[data-wa]").forEach(function (a) {
    if (!D.whatsapp) { a.closest("li") ? a.closest("li").hidden = true : a.hidden = true; return; }
    var t = a.getAttribute("data-wa");
    a.href = waUrl(t ? WA_SALUDO + " " + t : WA_SALUDO + " Quisiera hacer una consulta.");
    a.target = "_blank"; a.rel = "noopener";
  });
  $$("[data-tel]").forEach(function (a) {
    if (!D.telefono) return;
    a.href = "tel:" + D.telefono.replace(/[^\d+]/g, "");
    if (a.hasAttribute("data-tel-texto")) a.textContent = D.telefonoVisible || D.telefono;
  });
  $$("[data-dato]").forEach(function (el) {
    var v = D[el.getAttribute("data-dato")];
    if (v) el.textContent = v;
  });
  $$("[data-linkedin]").forEach(function (a) {
    if (D.linkedin) { a.href = D.linkedin; a.target = "_blank"; a.rel = "noopener"; a.closest("li") && (a.closest("li").hidden = false); }
  });

  /* 2. Encabezado, barra de lectura y sección actual ----------------------- */
  var cab = $(".cabecera");
  var barraProgreso = $(".cabecera__progreso");
  var actualizarScrollUI = function () {
    var y = window.scrollY || 0;
    if (cab) cab.classList.toggle("con-borde", y > 8);
    if (barraProgreso) {
      var max = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
      barraProgreso.style.width = Math.min(100, (y / max) * 100).toFixed(2) + "%";
    }
  };
  actualizarScrollUI();
  window.addEventListener("scroll", actualizarScrollUI, { passive: true });

  var navLinks = $$('.nav a[href^="#"]');
  if (navLinks.length && "IntersectionObserver" in window) {
    var porId = {};
    navLinks.forEach(function (a) { porId[a.getAttribute("href").slice(1)] = a; });
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting && porId[e.target.id]) {
          navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          porId[e.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-42% 0px -52% 0px" });
    Object.keys(porId).forEach(function (id) { var s = doc.getElementById(id); if (s) obs.observe(s); });
  }

  $$(".menu-movil").forEach(function (m) {
    $$("a", m).forEach(function (a) { a.addEventListener("click", function () { m.removeAttribute("open"); }); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.open) { m.removeAttribute("open"); $("summary", m).focus(); } });
  });

  /* 3. Revelado suave de bloques al scrollear ------------------------------ */
  var revEls = $$(".revelar");
  if (revEls.length && !reduceMotion && "IntersectionObserver" in window) {
    var obsRev = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); obsRev.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    revEls.forEach(function (el) { obsRev.observe(el); });
  } else {
    revEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* 4. Tapiz visual parallax + red nodal moderna sobre las escenas --------- */
  var mural = $(".tapiz__mural");
  var canvas = $(".tapiz__canvas");
  if (mural && canvas) {
    var ctx = canvas.getContext("2d");
    var cw = 0, ch = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var scrollYActual = window.scrollY || 0;
    var scrollYSuave = scrollYActual;
    var mouseX = -9999, mouseY = -9999;

    var coloresNodo = ["#C38B42", "#6B8E77", "#C01D2E", "#6C7A86", "#1F303E"];
    // Nodos distribuidos a lo largo del recorrido vertical virtual (y en proporción a la altura del mural)
    var nodosRed = [
      { xr: 0.07, yr: 0.04, r: 4.5, c: 0 }, { xr: 0.22, yr: 0.11, r: 3.5, c: 2 }, { xr: 0.88, yr: 0.06, r: 5, c: 1 },
      { xr: 0.94, yr: 0.15, r: 3.5, c: 3 }, { xr: 0.12, yr: 0.22, r: 4.5, c: 3 }, { xr: 0.34, yr: 0.19, r: 3, c: 4 },
      { xr: 0.78, yr: 0.24, r: 4.5, c: 2 }, { xr: 0.92, yr: 0.31, r: 4, c: 0 }, { xr: 0.08, yr: 0.36, r: 5, c: 1 },
      { xr: 0.26, yr: 0.42, r: 3.5, c: 2 }, { xr: 0.84, yr: 0.44, r: 4.5, c: 3 }, { xr: 0.95, yr: 0.52, r: 3.5, c: 1 },
      { xr: 0.10, yr: 0.55, r: 4.5, c: 0 }, { xr: 0.28, yr: 0.61, r: 3.5, c: 4 }, { xr: 0.80, yr: 0.63, r: 5, c: 2 },
      { xr: 0.91, yr: 0.72, r: 4, c: 1 }, { xr: 0.11, yr: 0.76, r: 4.5, c: 3 }, { xr: 0.31, yr: 0.82, r: 3.5, c: 0 },
      { xr: 0.86, yr: 0.84, r: 4.5, c: 2 }, { xr: 0.94, yr: 0.93, r: 4, c: 1 }, { xr: 0.14, yr: 0.94, r: 4.5, c: 2 }
    ];
    var aristas = [
      [0, 1], [1, 4], [1, 5], [2, 3], [2, 6], [3, 6], [4, 5], [4, 8], [5, 6], [6, 7],
      [7, 10], [8, 9], [9, 12], [10, 11], [10, 14], [11, 14], [12, 13], [13, 16], [14, 15],
      [15, 18], [16, 17], [17, 20], [18, 19], [9, 10], [13, 14], [17, 18]
    ];

    function ajustarCanvas() {
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ajustarCanvas();
    window.addEventListener("resize", ajustarCanvas, { passive: true });
    window.addEventListener("scroll", function () { scrollYActual = window.scrollY || 0; }, { passive: true });
    if (!reduceMotion) {
      window.addEventListener("mousemove", function (e) { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
    }

    function dibujarCuadro(t) {
      if (!reduceMotion) {
        scrollYSuave += (scrollYActual - scrollYSuave) * 0.12;
      } else {
        scrollYSuave = scrollYActual;
      }
      var docMax = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
      var progreso = Math.min(1, Math.max(0, scrollYSuave / docMax));

      // 1) Desplazar el mural panorámico a distinta velocidad que el scroll
      var muralH = mural.offsetHeight || 4200;
      var recorridoMural = Math.max(0, muralH - ch);
      var offsetMural = -progreso * recorridoMural;
      mural.style.transform = "translate3d(-50%, " + offsetMural.toFixed(1) + "px, 0)";

      // 2) Red vectorial moderna con nodos a velocidad parallax intermedia
      ctx.clearRect(0, 0, cw, ch);
      var redAltura = Math.max(ch * 3.1, muralH * 0.78);
      var offsetRed = -progreso * (redAltura - ch);
      var tiempo = (t || 0) * 0.00045;

      var pts = nodosRed.map(function (n, idx) {
        var swayX = reduceMotion ? 0 : Math.sin(tiempo + idx * 1.1) * 7;
        var swayY = reduceMotion ? 0 : Math.cos(tiempo * 0.8 + idx * 0.9) * 5;
        return {
          x: n.xr * cw + swayX,
          y: n.yr * redAltura + offsetRed + swayY,
          r: n.r,
          col: coloresNodo[n.c]
        };
      });

      // Líneas conectoras sutiles
      ctx.lineWidth = 1;
      for (var i = 0; i < aristas.length; i++) {
        var a = pts[aristas[i][0]], b = pts[aristas[i][1]];
        if ((a.y < -120 && b.y < -120) || (a.y > ch + 120 && b.y > ch + 120)) continue;
        ctx.strokeStyle = "rgba(15, 46, 54, 0.14)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        // Pulso de luz delicado viajando por algunas líneas
        if (!reduceMotion && i % 2 === 0) {
          var p = (tiempo * 0.55 + i * 0.23) % 1;
          var px = a.x + (b.x - a.x) * p;
          var py = a.y + (b.y - a.y) * p;
          ctx.fillStyle = "rgba(42, 157, 150, 0.52)";
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Nodos y reacción sutil al puntero
      for (var j = 0; j < pts.length; j++) {
        var pt = pts[j];
        if (pt.y < -60 || pt.y > ch + 60) continue;
        var dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
        var cerca = dist < 170;

        if (cerca) {
          ctx.strokeStyle = "rgba(42, 157, 150, " + (0.28 * (1 - dist / 170)).toFixed(2) + ")";
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }

        // Halo externo
        ctx.strokeStyle = pt.col;
        ctx.globalAlpha = cerca ? 0.55 : 0.25;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r + (cerca ? 6 : 3.5), 0, Math.PI * 2);
        ctx.stroke();

        // Círculo del nodo + núcleo claro
        ctx.globalAlpha = cerca ? 0.9 : 0.65;
        ctx.fillStyle = pt.col;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.9;
        ctx.fillStyle = "#F6F4EF";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r * 0.36, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (!reduceMotion) requestAnimationFrame(dibujarCuadro);
    }

    if (reduceMotion) {
      dibujarCuadro(0);
      window.addEventListener("scroll", function () { dibujarCuadro(0); }, { passive: true });
    } else {
      requestAnimationFrame(dibujarCuadro);
    }
  }

  /* 5. MOTOR INTERACTIVO ALEATORIO EN PORTADA (#panel-x) ------------------- */
  var panelX = $("#panel-x");
  if (panelX && window.NodalMotor) {
    window.NodalMotor.iniciar({
      root: panelX,
      onClaim: function (mensaje) {
        abrirDialogo(panelX, DIAG, "Diagnóstico express gratuito", mensaje);
      }
    });
  }

  /* 6. Árbol de servicios: abrir una rama desde "De un vistazo" ------------ */
  function abrirRama(id, enfocar) {
    var r = doc.getElementById(id);
    if (!r || r.tagName !== "DETAILS") return false;
    r.open = true;
    r.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (enfocar) { var s = $("summary", r); s && s.focus({ preventScroll: true }); }
    return true;
  }
  $$('a[href^="#area-"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1);
      if (abrirRama(id, true)) { e.preventDefault(); history.replaceState(null, "", "#" + id); }
    });
  });
  if (/^#area-/.test(location.hash)) abrirRama(location.hash.slice(1), false);

  var ramas = $$(".rama");
  $$("[data-arbol]").forEach(function (b) {
    b.hidden = false;
    b.addEventListener("click", function () {
      var abrir = b.getAttribute("data-arbol") === "abrir";
      ramas.forEach(function (r) { if (!r.classList.contains("oculta")) r.open = abrir; });
    });
  });

  /* 7. Buscador ------------------------------------------------------------ */
  var buscador = $(".buscador");
  if (buscador && ramas.length) {
    buscador.hidden = false;
    var input = $("input", buscador), estado = $(".buscador__estado", buscador), espera;
    var hojas = $$(".hoja");
    hojas.forEach(function (h) {
      var t = $("h4", h);
      h._titulo = t; h._original = t.innerHTML;
      h._texto = sinTildes(h.textContent);
    });
    ramas.forEach(function (r) { r._nombre = sinTildes($(".rama__titulo", r).textContent); });
    var filtrar = function () {
      var q = sinTildes(input.value.trim());
      var total = 0, areas = 0;
      hojas.forEach(function (h) { h._titulo.innerHTML = h._original; });
      if (q.length < 2) {
        hojas.forEach(function (h) { h.classList.remove("oculta"); });
        ramas.forEach(function (r) { r.classList.remove("oculta"); if (r._porBusqueda) { r.open = false; r._porBusqueda = false; } });
        estado.textContent = q.length ? "Escriba al menos dos letras." : "";
        return;
      }
      var palabras = q.split(/\s+/);
      ramas.forEach(function (r) {
        var areaCoincide = palabras.every(function (p) { return r._nombre.indexOf(p) > -1; });
        var n = 0;
        $$(".hoja", r).forEach(function (h) {
          var ok = areaCoincide || palabras.every(function (p) { return h._texto.indexOf(p) > -1; });
          h.classList.toggle("oculta", !ok);
          if (ok) {
            n++;
            var plano = h._titulo.textContent, base = sinTildes(plano);
            var p0 = palabras[0], k = base.indexOf(p0);
            if (k > -1 && !areaCoincide) {
              h._titulo.innerHTML = escapar(plano.slice(0, k)) + '<mark class="coincide">' + escapar(plano.slice(k, k + p0.length)) + "</mark>" + escapar(plano.slice(k + p0.length));
            }
          }
        });
        r.classList.toggle("oculta", n === 0);
        if (n) { areas++; total += n; if (!r.open) { r.open = true; r._porBusqueda = true; } }
      });
      estado.textContent = total
        ? total + (total === 1 ? " servicio" : " servicios") + " en " + areas + (areas === 1 ? " área." : " áreas.")
        : "No hay servicios con esa búsqueda. Puede describir su necesidad en el formulario de presupuesto.";
    };
    input.addEventListener("input", function () { clearTimeout(espera); espera = setTimeout(filtrar, 200); });
    input.addEventListener("search", filtrar);
  }

  /* 8. Formularios --------------------------------------------------------- */
  function leer(form) {
    var g = function (n) { var el = form.elements[n]; return el ? (el.value || "").trim() : ""; };
    var sel = form.elements.area;
    var areaTxt = sel && sel.selectedIndex > 0 ? sel.options[sel.selectedIndex].text : "";
    var pers = form.elements.personas;
    return {
      nombre: g("nombre"), empresa: g("empresa"), correo: g("correo"), telefono: g("telefono"), localidad: g("localidad"),
      area: g("area"), areaTxt: areaTxt, servicio: g("servicio"),
      personas: pers && pers.selectedIndex > 0 ? pers.options[pers.selectedIndex].text : "",
      mensaje: g("mensaje")
    };
  }
  function componer(d) {
    var l = [];
    l.push(d.area === DIAG ? "Quisiera agendar una reunión de diagnóstico express gratuito." : "Quisiera solicitar un presupuesto.");
    if (d.areaTxt && d.area !== DIAG) l.push("Área: " + d.areaTxt);
    if (d.servicio) l.push("Servicio: " + d.servicio);
    l.push("Nombre: " + d.nombre);
    if (d.empresa) l.push("Empresa: " + d.empresa);
    if (d.localidad) l.push("País / Localidad: " + d.localidad);
    if (d.personas) l.push("Personas en la empresa: " + d.personas);
    if (d.correo) l.push("Correo: " + d.correo);
    if (d.telefono) l.push("Teléfono: " + d.telefono);
    if (d.mensaje) l.push("Mensaje:\n" + d.mensaje);
    return l.join("\n");
  }
  function asunto(d) {
    return (d.area === DIAG ? "Diagnóstico express gratuito" : "Pedido de presupuesto" + (d.areaTxt ? ": " + d.areaTxt : "")) + (d.empresa ? " · " + d.empresa : "");
  }
  function marcarError(form, nombre, msg) {
    var el = form.elements[nombre];
    var err = form.querySelector('[data-error-de="' + nombre + '"]');
    if (!el || !err) return;
    if (msg) { el.setAttribute("aria-invalid", "true"); err.textContent = msg; }
    else { el.removeAttribute("aria-invalid"); err.textContent = ""; }
  }
  function validar(form) {
    var d = leer(form), errores = [];
    var reglas = [
      ["nombre", !d.nombre, "Escriba su nombre."],
      ["correo", !d.correo, "Escriba un correo electrónico para poder responderle."],
      ["correo", d.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo), "Revise el correo: falta la arroba o el dominio (por ejemplo, nombre@empresa.com)."],
      ["area", !d.area, "Elija el área de servicio o «Otro»."],
      ["consentimiento", !form.elements.consentimiento.checked, "Para enviar el pedido tiene que aceptar la política de privacidad."]
    ];
    ["nombre", "correo", "area", "consentimiento"].forEach(function (n) { marcarError(form, n, ""); });
    reglas.forEach(function (r) {
      if (r[1] && errores.indexOf(r[0]) === -1) { errores.push(r[0]); marcarError(form, r[0], r[2]); }
    });
    return { ok: !errores.length, d: d, primero: errores[0] };
  }

  function prepararForm(form) {
    var estado = $(".form__estado", form);
    var conClave = !!(D.web3formsClave || "").trim();
    var sinjs = $(".form__sinjs", form); if (sinjs) sinjs.hidden = true;
    $$("[data-modo]", form).forEach(function (b) {
      var modo = b.getAttribute("data-modo");
      b.hidden = conClave ? modo !== "web3forms" : (modo === "web3forms" || (modo === "whatsapp" && !D.whatsapp));
    });
    $$("input, select, textarea", form).forEach(function (el) {
      el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input", function () {
        if (el.getAttribute("aria-invalid") === "true") marcarError(form, el.name, "");
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      estado.classList.remove("es-error");
      var v = validar(form);
      if (!v.ok) {
        var n = $$('[aria-invalid="true"]', form).length;
        estado.classList.add("es-error");
        estado.textContent = n === 1 ? "Falta completar un dato. Está marcado en el formulario." : "Faltan completar " + n + " datos. Están marcados en el formulario.";
        var el = form.elements[v.primero]; el && el.focus();
        return;
      }
      if (form.elements.botcheck && form.elements.botcheck.checked) return;
      var modo = (e.submitter && e.submitter.getAttribute("data-modo")) || (conClave ? "web3forms" : "whatsapp");
      var texto = componer(v.d);
      if (modo === "whatsapp") {
        window.open(waUrl(WA_SALUDO + "\n" + texto), "_blank", "noopener");
        estado.innerHTML = "Se abrió WhatsApp con su pedido. Para que nos llegue, revise el mensaje y envíelo desde WhatsApp. "
          + 'Si no se abrió, puede <a href="' + escapar(mailUrl(asunto(v.d), texto)) + '">enviarlo por correo</a>.';
      } else if (modo === "correo") {
        window.location.href = mailUrl(asunto(v.d), texto);
        estado.innerHTML = "Se abrió su programa de correo con el pedido. Para que nos llegue, revise el mensaje y envíelo. "
          + (D.correo ? 'Si no se abrió, puede escribirnos a <a href="mailto:' + escapar(D.correo) + '">' + escapar(D.correo) + '</a>.' : "");
      } else {
        var boton = e.submitter; if (boton) boton.disabled = true;
        estado.textContent = "Enviando su pedido…";
        var datos = {
          access_key: D.web3formsClave, subject: asunto(v.d), from_name: "Sitio web de Grupo Nodal",
          nombre: v.d.nombre, empresa: v.d.empresa, email: v.d.correo, telefono: v.d.telefono, localidad: v.d.localidad,
          area: v.d.areaTxt, servicio: v.d.servicio, personas: v.d.personas, mensaje: v.d.mensaje, botcheck: false
        };
        fetch("https://api.web3forms.com/submit", {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(datos)
        }).then(function (r) { return r.json(); }).then(function (j) {
          if (!j.success) throw new Error(j.message || "error");
          estado.textContent = "Recibimos su pedido. Le responderemos por correo o por teléfono en el horario de atención (" + (D.horario || "lunes a viernes, de 9 a 17 h") + ").";
          form.reset();
        }).catch(function () {
          estado.classList.add("es-error");
          estado.innerHTML = 'No se pudo enviar el pedido. Puede <a href="' + escapar(waUrl(WA_SALUDO + "\n" + texto)) + '" target="_blank" rel="noopener">enviarlo por WhatsApp</a> o <a href="' + escapar(mailUrl(asunto(v.d), texto)) + '">por correo</a>.';
        }).then(function () { if (boton) boton.disabled = false; });
      }
    });
  }
  $$("form.form").forEach(prepararForm);

  function precargar(form, area, servicio, mensaje) {
    if (!form) return;
    if (area && form.elements.area) { form.elements.area.value = area; marcarError(form, "area", ""); }
    if (form.elements.servicio) form.elements.servicio.value = servicio || "";
    if (form.elements.mensaje) {
      if (mensaje) form.elements.mensaje.value = mensaje;
      else if (area === DIAG && !form.elements.mensaje.value) {
        form.elements.mensaje.placeholder = "Cuéntenos brevemente la situación de su empresa y los días u horarios que le quedan cómodos.";
      }
    }
  }

  /* 9. Diálogo de presupuesto ---------------------------------------------- */
  var dlg = $("#dialogo-presupuesto");
  var opener = null;
  var soporta = dlg && typeof dlg.showModal === "function";
  function abrirDialogo(origen, area, servicio, mensaje) {
    var form = dlg ? $("form", dlg) : null;
    if (!soporta) {
      precargar($("#presupuesto form"), area, servicio, mensaje);
      location.hash = "#presupuesto";
      return;
    }
    opener = origen || doc.activeElement;
    precargar(form, area, servicio, mensaje);
    var alt = $("[data-wa-dialogo]", dlg);
    if (alt) {
      var waMsg = mensaje ? WA_SALUDO + "\n" + mensaje : WA_SALUDO + " " + (area === DIAG ? "Quisiera agendar una reunión de diagnóstico express gratuito." : servicio ? "Quisiera consultar por: " + servicio + "." : "Quisiera solicitar un presupuesto.");
      alt.href = waUrl(waMsg);
    }
    var titulo = $("#t-dialogo", dlg);
    if (titulo) titulo.textContent = area === DIAG ? "Diagnóstico express gratuito" : "Solicitar presupuesto";
    dlg.showModal();
    doc.body.classList.add("con-dialogo");
    var primero = form && form.elements.nombre;
    if (primero) primero.focus();
  }
  if (soporta) {
    dlg.addEventListener("close", function () {
      doc.body.classList.remove("con-dialogo");
      if (opener && opener.focus) opener.focus();
    });
    $$("[data-cerrar-dialogo]", dlg).forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = $$('a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])', dlg)
        .filter(function (el) { return el.offsetParent !== null && !el.hidden && !el.closest(".trampa"); });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && doc.activeElement === z) { e.preventDefault(); a.focus(); }
    });
  }
  $$("[data-abrir-presupuesto]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      abrirDialogo(b, b.getAttribute("data-area") || "", b.getAttribute("data-servicio") || "");
    });
  });

  /* 10. Agenda de diagnóstico ---------------------------------------------- */
  $$("[data-agenda]").forEach(function (b) {
    var url = (D.agendaUrl || "").trim();
    if (url) {
      b.href = url; b.target = "_blank"; b.rel = "noopener";
      var aviso = doc.createElement("span"); aviso.className = "solo-lectores"; aviso.textContent = " (abre en otra pestaña)";
      b.appendChild(aviso);
    } else {
      b.addEventListener("click", function (e) { e.preventDefault(); abrirDialogo(b, DIAG, ""); });
    }
  });
})();

