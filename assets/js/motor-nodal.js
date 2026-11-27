/* =============================================================================
   GRUPO NODAL · MOTOR WEBGL 3D INTERACTIVO (v5.3 · Three.js r149)
   -----------------------------------------------------------------------------
   12 experiencias interactivas en 3D real con iluminación de estudio, sombras
   proyectadas, piezas inclinadas y biseladas de alta legibilidad, esculturas 3D,
   arrastre + clic alternativo, HUD de identificación en vivo, Universo Nodal 360°
   y Dron 3D en planta. Compatible con CSP estricta (Three.js autoalojado).
   ============================================================================= */
(function () {
  "use strict";

  var COL = {
    tinta: "#1F303E",
    petroleo: "#2A4154",
    papel: "#F5EFEB",
    niebla: "#ECE7E1",
    crema: "#FAF7F3",
    blanco: "#FFFFFF",
    acero: "#6C7A86",
    ocre: "#C38B42",
    verde: "#6B8E77",
    nexo: "#C01D2E",
    seg: "#C38B42",
    amb: "#6B8E77",
    cal: "#2A4154",
    per: "#6B8E77",
    alerta: "#C01D2E"
  };

  var CORNERS_3D = [
    { id: "seg", label: "SEGURIDAD", x: -3.25, z: -1.85, color: COL.ocre },
    { id: "amb", label: "AMBIENTE",  x: 3.25,  z: -1.85, color: COL.verde },
    { id: "per", label: "PERSONAS",  x: -3.25, z: 1.85,  color: COL.verde },
    { id: "cal", label: "CALIDAD",   x: 3.25,  z: 1.85,  color: COL.petroleo }
  ];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pick(arr, idx) {
    return arr[(idx % arr.length + arr.length) % arr.length];
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapLines(ctx, text, maxW) {
    var words = String(text || "").split(/\s+/);
    var lines = [];
    var cur = "";
    for (var i = 0; i < words.length; i++) {
      var test = cur ? cur + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && cur) {
        lines.push(cur);
        cur = words[i];
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines.slice(0, 2);
  }

  /* =========================================================================
     30 ICONOS TÉCNICOS VECTORIALES PARA TEXTURAS 3D DE ALTA LEGIBILIDAD
     ========================================================================= */
  function drawIcon(ctx, iconId, x, y, size, color) {
    var s = (size || 28) * 0.5;
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color || COL.tinta;
    ctx.fillStyle = color || COL.tinta;
    ctx.lineWidth = Math.max(2.6, size * 0.115);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (iconId) {
      case "breaker":
        roundRectPath(ctx, -s * 0.65, -s * 0.85, s * 1.3, s * 1.7, 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.35, -s * 0.15); ctx.lineTo(s * 0.35, -s * 0.15);
        ctx.moveTo(0, -s * 0.15); ctx.lineTo(s * 0.28, -s * 0.55);
        ctx.moveTo(-s * 0.3, s * 0.4); ctx.lineTo(s * 0.3, s * 0.4);
        ctx.stroke();
        break;
      case "ground":
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.85); ctx.lineTo(0, s * 0.05);
        ctx.moveTo(-s * 0.75, s * 0.05); ctx.lineTo(s * 0.75, s * 0.05);
        ctx.moveTo(-s * 0.48, s * 0.42); ctx.lineTo(s * 0.48, s * 0.42);
        ctx.moveTo(-s * 0.22, s * 0.78); ctx.lineTo(s * 0.22, s * 0.78);
        ctx.stroke();
        break;
      case "bridge":
        ctx.beginPath();
        ctx.moveTo(-s * 0.75, s * 0.35);
        ctx.bezierCurveTo(-s * 0.3, -s * 0.75, s * 0.3, -s * 0.75, s * 0.75, s * 0.35);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-s * 0.75, s * 0.35, s * 0.18, 0, Math.PI * 2);
        ctx.arc(s * 0.75, s * 0.35, s * 0.18, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "no-ground":
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.72, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.28, -s * 0.25); ctx.lineTo(-s * 0.28, s * 0.1);
        ctx.moveTo(s * 0.28, -s * 0.25); ctx.lineTo(s * 0.28, s * 0.1);
        ctx.moveTo(-s * 0.52, s * 0.52); ctx.lineTo(s * 0.52, -s * 0.52);
        ctx.stroke();
        break;
      case "smoke":
        ctx.beginPath();
        ctx.moveTo(-s * 0.75, -s * 0.4); ctx.lineTo(s * 0.75, -s * 0.4);
        ctx.lineTo(s * 0.55, -s * 0.8); ctx.lineTo(-s * 0.55, -s * 0.8); ctx.closePath();
        ctx.stroke();
        [-s * 0.4, 0, s * 0.4].forEach(function (ox) {
          ctx.beginPath();
          ctx.moveTo(ox, -s * 0.1);
          ctx.quadraticCurveTo(ox - s * 0.2, s * 0.3, ox + s * 0.05, s * 0.75);
          ctx.stroke();
        });
        break;
      case "pump":
        ctx.beginPath();
        ctx.arc(0, s * 0.1, s * 0.65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.65, s * 0.1); ctx.lineTo(-s * 0.95, s * 0.1);
        ctx.moveTo(0, -s * 0.55); ctx.lineTo(s * 0.75, -s * 0.55);
        ctx.moveTo(-s * 0.3, s * 0.1); ctx.lineTo(s * 0.3, -s * 0.2); ctx.lineTo(s * 0.3, s * 0.4); ctx.closePath();
        ctx.stroke();
        break;
      case "valve-off":
        ctx.beginPath();
        ctx.moveTo(-s * 0.75, -s * 0.1); ctx.lineTo(0, s * 0.3); ctx.lineTo(-s * 0.75, s * 0.7); ctx.closePath();
        ctx.moveTo(s * 0.75, -s * 0.1); ctx.lineTo(0, s * 0.3); ctx.lineTo(s * 0.75, s * 0.7); ctx.closePath();
        ctx.moveTo(0, s * 0.3); ctx.lineTo(0, -s * 0.55);
        ctx.moveTo(-s * 0.5, -s * 0.55); ctx.lineTo(s * 0.5, -s * 0.55);
        ctx.stroke();
        break;
      case "extinguisher":
        roundRectPath(ctx, -s * 0.4, -s * 0.3, s * 0.8, s * 1.1, 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.3); ctx.lineTo(0, -s * 0.7);
        ctx.moveTo(-s * 0.35, -s * 0.7); ctx.lineTo(s * 0.45, -s * 0.7);
        ctx.moveTo(s * 0.35, -s * 0.65); ctx.lineTo(s * 0.75, -s * 0.35);
        ctx.stroke();
        break;
      case "lock":
        roundRectPath(ctx, -s * 0.6, -s * 0.1, s * 1.2, s * 0.9, 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -s * 0.1, s * 0.38, Math.PI, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, s * 0.32, s * 0.14, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "gauge-zero":
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.78, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(-s * 0.45, s * 0.35);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.14, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "sign":
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.8); ctx.lineTo(s * 0.82, s * 0.68); ctx.lineTo(-s * 0.82, s * 0.68); ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.25); ctx.lineTo(0, s * 0.2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, s * 0.44, s * 0.08, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "bolt":
        ctx.beginPath();
        ctx.moveTo(s * 0.15, -s * 0.85);
        ctx.lineTo(-s * 0.45, s * 0.08); ctx.lineTo(s * 0.05, s * 0.08);
        ctx.lineTo(-s * 0.15, s * 0.85);
        ctx.lineTo(s * 0.45, -s * 0.08); ctx.lineTo(-s * 0.05, -s * 0.08);
        ctx.closePath();
        ctx.stroke();
        break;
      case "psv":
        ctx.beginPath();
        ctx.moveTo(-s * 0.65, s * 0.6); ctx.lineTo(0, s * 0.1); ctx.lineTo(-s * 0.65, -s * 0.4); ctx.closePath();
        ctx.moveTo(0, s * 0.1); ctx.lineTo(s * 0.5, -s * 0.65); ctx.lineTo(s * 0.5, s * 0.65);
        ctx.moveTo(s * 0.22, -s * 0.42); ctx.lineTo(s * 0.5, -s * 0.68); ctx.lineTo(s * 0.78, -s * 0.42);
        ctx.stroke();
        break;
      case "interlock":
        ctx.beginPath();
        ctx.arc(-s * 0.22, 0, s * 0.45, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(s * 0.22, 0, s * 0.45, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "vent":
        roundRectPath(ctx, -s * 0.7, -s * 0.7, s * 1.4, s * 1.4, 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.4, -s * 0.25); ctx.lineTo(s * 0.4, -s * 0.25);
        ctx.moveTo(-s * 0.4, s * 0.05); ctx.lineTo(s * 0.4, s * 0.05);
        ctx.moveTo(-s * 0.4, s * 0.35); ctx.lineTo(s * 0.4, s * 0.35);
        ctx.stroke();
        break;
      case "atex":
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
          var a = (i * Math.PI) / 3;
          ctx.lineTo(Math.cos(a) * s * 0.85, Math.sin(a) * s * 0.85);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.28, s * 0.28); ctx.lineTo(0, -s * 0.32); ctx.lineTo(s * 0.28, s * 0.28);
        ctx.stroke();
        break;
      case "sensor-gas":
        ctx.beginPath();
        ctx.arc(0, s * 0.2, s * 0.38, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, s * 0.2, s * 0.68, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, s * 0.2, s * 0.92, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();
        break;
      case "fan":
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.2, 0, Math.PI * 2);
        ctx.fill();
        for (var f = 0; f < 3; f++) {
          var fa = (f * Math.PI * 2) / 3 - Math.PI / 2;
          ctx.beginPath();
          ctx.ellipse(Math.cos(fa) * s * 0.46, Math.sin(fa) * s * 0.46, s * 0.35, s * 0.18, fa, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
      case "motor":
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2);
        ctx.stroke();
        for (var g = 0; g < 6; g++) {
          var ga = (g * Math.PI) / 3;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ga) * s * 0.48, Math.sin(ga) * s * 0.48);
          ctx.lineTo(Math.cos(ga) * s * 0.82, Math.sin(ga) * s * 0.82);
          ctx.stroke();
        }
        break;
      case "solar":
        ctx.beginPath();
        ctx.moveTo(-s * 0.75, s * 0.55); ctx.lineTo(-s * 0.4, -s * 0.45);
        ctx.lineTo(s * 0.75, -s * 0.45); ctx.lineTo(s * 0.4, s * 0.55); ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.45); ctx.lineTo(-s * 0.18, s * 0.55);
        ctx.moveTo(-s * 0.58, s * 0.05); ctx.lineTo(s * 0.58, s * 0.05);
        ctx.stroke();
        break;
      case "coin-leaf":
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.75, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.3, s * 0.35);
        ctx.quadraticCurveTo(-s * 0.3, -s * 0.35, s * 0.38, -s * 0.35);
        ctx.quadraticCurveTo(s * 0.38, s * 0.35, -s * 0.3, s * 0.35);
        ctx.stroke();
        break;
      case "heat":
        ctx.beginPath();
        [-s * 0.42, 0, s * 0.42].forEach(function (hx) {
          ctx.moveTo(hx, s * 0.65);
          ctx.bezierCurveTo(hx - s * 0.28, s * 0.15, hx + s * 0.28, -s * 0.15, hx, -s * 0.65);
        });
        ctx.stroke();
        break;
      case "drum":
        roundRectPath(ctx, -s * 0.55, -s * 0.78, s * 1.1, s * 1.56, 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.55, -s * 0.25); ctx.lineTo(s * 0.55, -s * 0.25);
        ctx.moveTo(-s * 0.55, s * 0.28); ctx.lineTo(s * 0.55, s * 0.28);
        ctx.stroke();
        break;
      case "recycle":
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.68, 0.3, Math.PI * 1.15);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.68, Math.PI * 1.35, Math.PI * 2.15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(s * 0.5, -s * 0.42); ctx.lineTo(s * 0.78, -s * 0.1); ctx.lineTo(s * 0.36, -s * 0.08);
        ctx.stroke();
        break;
      case "drop":
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.85);
        ctx.bezierCurveTo(s * 0.7, -s * 0.05, s * 0.7, s * 0.78, 0, s * 0.78);
        ctx.bezierCurveTo(-s * 0.7, s * 0.78, -s * 0.7, -s * 0.05, 0, -s * 0.85);
        ctx.stroke();
        break;
      case "gloves":
        ctx.beginPath();
        ctx.moveTo(-s * 0.45, s * 0.75); ctx.lineTo(-s * 0.5, -s * 0.35);
        ctx.lineTo(-s * 0.18, -s * 0.68); ctx.lineTo(s * 0.1, -s * 0.68);
        ctx.lineTo(s * 0.15, -s * 0.15); ctx.lineTo(s * 0.55, -s * 0.25);
        ctx.lineTo(s * 0.4, s * 0.75); ctx.closePath();
        ctx.stroke();
        break;
      case "shield":
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.82); ctx.lineTo(s * 0.68, -s * 0.5); ctx.lineTo(s * 0.68, s * 0.1);
        ctx.quadraticCurveTo(s * 0.68, s * 0.68, 0, s * 0.88);
        ctx.quadraticCurveTo(-s * 0.68, s * 0.68, -s * 0.68, s * 0.1);
        ctx.lineTo(-s * 0.68, -s * 0.5); ctx.closePath();
        ctx.stroke();
        break;
      case "harness":
        ctx.beginPath();
        ctx.moveTo(-s * 0.45, -s * 0.75); ctx.lineTo(-s * 0.3, s * 0.75);
        ctx.moveTo(s * 0.45, -s * 0.75); ctx.lineTo(s * 0.3, s * 0.75);
        ctx.moveTo(-s * 0.5, s * 0.1); ctx.lineTo(s * 0.5, s * 0.1);
        ctx.moveTo(-s * 0.38, -s * 0.3); ctx.lineTo(s * 0.38, -s * 0.3);
        ctx.stroke();
        break;
      case "lifeline":
        ctx.beginPath();
        ctx.moveTo(-s * 0.75, -s * 0.45);
        ctx.quadraticCurveTo(0, s * 0.05, s * 0.75, -s * 0.45);
        ctx.moveTo(0, -s * 0.2); ctx.lineTo(0, s * 0.55);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, s * 0.65, s * 0.2, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "tripod":
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.75); ctx.lineTo(-s * 0.68, s * 0.75);
        ctx.moveTo(0, -s * 0.75); ctx.lineTo(s * 0.68, s * 0.75);
        ctx.moveTo(0, -s * 0.75); ctx.lineTo(0, s * 0.75);
        ctx.moveTo(-s * 0.45, -s * 0.75); ctx.lineTo(s * 0.45, -s * 0.75);
        ctx.stroke();
        break;
      default:
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2);
        ctx.stroke();
        break;
    }
    ctx.restore();
  }

  function roundedBoxShape(w, h, r) {
    var shape = new THREE.Shape();
    var hw = w / 2, hh = h / 2;
    r = Math.min(r, hw, hh);
    shape.moveTo(-hw + r, -hh);
    shape.lineTo(hw - r, -hh);
    shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
    shape.lineTo(hw, hh - r);
    shape.quadraticCurveTo(hw, hh, hw - r, hh);
    shape.lineTo(-hw + r, hh);
    shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
    shape.lineTo(-hw, -hh + r);
    shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
    return shape;
  }

  /* =========================================================================
     MOTOR WEBGL 3D PRINCIPAL
     ========================================================================= */
  function iniciarMotor(opts) {
    var root = opts.root;
    if (!root) return null;
    var DATA = window.NODAL_CONTENIDOS;
    var THREE = window.THREE;
    var wrap = root.querySelector(".motor-canvas-wrap");
    var canvas = root.querySelector("[data-motor-canvas]");
    var elNombre = root.querySelector("[data-motor-nombre]");
    var elProg = root.querySelector("[data-motor-progreso]");
    var elPie = root.querySelector("[data-motor-pie]");
    var elToast = root.querySelector("[data-motor-toast]");
    var elHover = root.querySelector("[data-motor-hover]");
    var elSubs = root.querySelector("[data-motor-subs]");
    var elPremio = root.querySelector("[data-motor-premio]");
    var elNorma = root.querySelector("[data-premio-norma]");
    var elTit = root.querySelector("[data-premio-titulo]");
    var elSab = root.querySelector("[data-premio-sabias]");
    var btnExpandir = root.querySelector("[data-motor-expandir]");
    var btnReclamar = root.querySelector("[data-motor-reclamar]");
    var btnNextPremio = root.querySelector("[data-motor-next]");

    function setPie(html) { if (elPie) elPie.innerHTML = html; }

    var toastTimer = null;
    function showToast(msg) {
      if (elHover) elHover.classList.remove("visible");
      if (!elToast) return;
      elToast.textContent = msg;
      elToast.classList.add("visible");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        elToast.classList.remove("visible");
      }, 2800);
    }

    function showHover(msg) {
      if (!elHover || (elToast && elToast.classList.contains("visible"))) return;
      if (!msg) { elHover.classList.remove("visible"); return; }
      elHover.textContent = msg;
      elHover.classList.add("visible");
    }

    function hideHover() {
      if (elHover) elHover.classList.remove("visible");
    }

    function setSubs(list) {
      if (!elSubs) return;
      if (!list || !list.length) { elSubs.innerHTML = ""; return; }
      elSubs.innerHTML = list.map(function (t) { return "<span>" + t + "</span>"; }).join("");
    }

    if (!canvas || !DATA || !THREE) {
      setPie("Motor 3D cargando recursos técnicos…");
      return null;
    }

    var W = 620, H = 450;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(W, H, false);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.04;
      renderer.outputEncoding = THREE.sRGBEncoding;
    } catch (err) {
      setPie("Tu navegador no tiene aceleración WebGL activa; podés explorar los servicios arriba o agendar un diagnóstico.");
      return null;
    }

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    var camBase = new THREE.Vector3(0, 7.6, 11.0);
    var camLook = new THREE.Vector3(0, 0.2, 0.25);
    var camMouseScale = new THREE.Vector2(1.25, 0.65);
    var shakeAmt = 0;

    // Iluminación de estudio 3 puntos
    var hemiLight = new THREE.HemisphereLight(0xfffaf2, 0x2a4154, 0.78);
    scene.add(hemiLight);

    var keyLight = new THREE.DirectionalLight(0xfff6e8, 1.25);
    keyLight.position.set(5.5, 11.5, 6.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -7;
    keyLight.shadow.camera.right = 7;
    keyLight.shadow.camera.top = 7;
    keyLight.shadow.camera.bottom = -7;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    var rimLight = new THREE.DirectionalLight(0x8bc9bc, 0.52);
    rimLight.position.set(-7.5, 5.2, -6.5);
    scene.add(rimLight);

    var shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 26),
      new THREE.ShadowMaterial({ opacity: 0.2 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.02;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    var gridHelper = new THREE.GridHelper(16, 16, 0xc7c0b6, 0xdad3c9);
    gridHelper.position.y = -0.015;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.26;
    scene.add(gridHelper);

    var stageGroup = new THREE.Group();
    scene.add(stageGroup);

    var fxGroup = new THREE.Group();
    scene.add(fxGroup);

    var createdTextures = [];
    var fxParticles = [];
    var fxShockwaves = [];

    var pointerNDC = new THREE.Vector2(0, 0);
    var pointerInside = false;
    var pointerDown = false;
    var downNDC = new THREE.Vector2(0, 0);
    var raycaster = new THREE.Raycaster();
    var dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.95);
    var dragHit = new THREE.Vector3();

    var currentExp = null;
    var currentVariant = 0;
    var deck = [];
    var deckPos = 0;
    var won = false;
    var exploreReady = false;
    var exploreTimer = null;

    function registerTex(tex) {
      tex.encoding = THREE.sRGBEncoding;
      tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 4);
      tex.needsUpdate = true;
      createdTextures.push(tex);
      return tex;
    }

    function disposeNode(obj) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        var mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(function (m) {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      }
    }

    function clearStage() {
      stageGroup.traverse(disposeNode);
      while (stageGroup.children.length) stageGroup.remove(stageGroup.children[0]);
      fxGroup.traverse(disposeNode);
      while (fxGroup.children.length) fxGroup.remove(fxGroup.children[0]);
      createdTextures.forEach(function (t) { t.dispose(); });
      createdTextures = [];
      fxParticles = [];
      fxShockwaves = [];
      setSubs([]);
      hideHover();
    }

    function ghostMat() {
      return new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    }

    /* -----------------------------------------------------------------------
       GENERADORES DE TEXTURAS ULTRA-LEGIBLES (SIN LAVADO ACES)
       ----------------------------------------------------------------------- */
    function makeCardTexture(iconId, label, accentHex) {
      var c = document.createElement("canvas");
      c.width = 512; c.height = 256;
      var x = c.getContext("2d");

      var accent = accentHex || COL.petroleo;
      x.fillStyle = "#FFFDF9";
      roundRectPath(x, 6, 6, 500, 244, 28);
      x.fill();
      x.strokeStyle = accent;
      x.lineWidth = 10;
      x.stroke();

      // Círculo sólido de color con ícono blanco grueso
      x.fillStyle = accent;
      x.beginPath();
      x.arc(98, 128, 66, 0, Math.PI * 2);
      x.fill();

      drawIcon(x, iconId, 98, 128, 66, "#FFFFFF");

      // Etiqueta grande y en negrita oscura con salto de línea automático
      x.fillStyle = "#14212B";
      x.font = '800 42px "Outfit", "Inter", sans-serif';
      x.textAlign = "left";
      x.textBaseline = "middle";
      var lines = wrapLines(x, label || "", 310);
      if (lines.length === 1) {
        x.fillText(lines[0], 184, 128, 305);
      } else {
        x.fillText(lines[0], 184, 98, 305);
        x.fillText(lines[1], 184, 158, 305);
      }

      return registerTex(new THREE.CanvasTexture(c));
    }

    function makePlaqueTexture(title, sub, bgHex, fgHex, accentHex) {
      var c = document.createElement("canvas");
      c.width = 512; c.height = 184;
      var x = c.getContext("2d");
      x.fillStyle = bgHex || "#14212B";
      roundRectPath(x, 6, 6, 500, 172, 26);
      x.fill();
      x.strokeStyle = accentHex || "#6B8E77";
      x.lineWidth = 6;
      x.stroke();

      x.fillStyle = fgHex || "#FFFFFF";
      x.textAlign = "center";
      x.textBaseline = "middle";
      if (sub) {
        x.font = '700 23px "Chivo Mono", monospace';
        x.fillStyle = "#CFE2DC";
        x.fillText(sub, 256, 56, 464);
        x.fillStyle = fgHex || "#FFFFFF";
        x.font = '800 40px "Outfit", "Inter", sans-serif';
        x.fillText(title, 256, 122, 464);
      } else {
        x.font = '800 44px "Outfit", "Inter", sans-serif';
        x.fillText(title, 256, 94, 464);
      }
      return registerTex(new THREE.CanvasTexture(c));
    }

    function makeBadgeTexture(iconId, label, accentHex, darkBg) {
      var c = document.createElement("canvas");
      c.width = 320; c.height = 240;
      var x = c.getContext("2d");
      x.clearRect(0, 0, 320, 240);

      x.fillStyle = darkBg ? "#14212B" : "#FFFFFF";
      x.beginPath();
      x.arc(160, 86, 64, 0, Math.PI * 2);
      x.fill();
      x.strokeStyle = accentHex || COL.ocre;
      x.lineWidth = 8;
      x.stroke();

      drawIcon(x, iconId, 160, 86, 62, darkBg ? "#FFFFFF" : (accentHex || COL.tinta));

      if (label) {
        x.fillStyle = "#14212B";
        roundRectPath(x, 14, 162, 292, 66, 33);
        x.fill();
        x.strokeStyle = accentHex || COL.ocre;
        x.lineWidth = 5;
        x.stroke();
        x.fillStyle = "#FFFFFF";
        x.font = '700 30px "Outfit", "Inter", sans-serif';
        x.textAlign = "center";
        x.textBaseline = "middle";
        x.fillText(label, 160, 195, 266);
      }
      return registerTex(new THREE.CanvasTexture(c));
    }

    function makePlanetLabelTexture(iconId, label, accentHex) {
      var c = document.createElement("canvas");
      c.width = 420; c.height = 112;
      var x = c.getContext("2d");
      x.clearRect(0, 0, 420, 112);

      x.fillStyle = "rgba(18, 30, 40, 0.94)";
      roundRectPath(x, 6, 8, 408, 96, 48);
      x.fill();
      x.strokeStyle = accentHex || COL.ocre;
      x.lineWidth = 6;
      x.stroke();

      x.fillStyle = accentHex || COL.ocre;
      x.beginPath();
      x.arc(54, 56, 34, 0, Math.PI * 2);
      x.fill();
      drawIcon(x, iconId, 54, 56, 36, "#FFFFFF");

      x.fillStyle = "#FFFFFF";
      x.font = '700 30px "Outfit", "Inter", sans-serif';
      x.textAlign = "left";
      x.textBaseline = "middle";
      x.fillText(label || "", 104, 57, 292);

      return registerTex(new THREE.CanvasTexture(c));
    }

    function createFloatingPlaque(title, sub, w, h, bgHex, fgHex, accentHex) {
      var tex = makePlaqueTexture(title, sub, bgHex, fgHex, accentHex);
      var mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false });
      return new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    }

    /* -----------------------------------------------------------------------
       ESCULTURA MINIATURA 3D PARA CADA PIEZA TÉCNICA
       ----------------------------------------------------------------------- */
    function createHardwareSculpt(iconId, hexColor) {
      var g = new THREE.Group();
      var accMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(hexColor), roughness: 0.25, metalness: 0.35 });
      var brassMat = new THREE.MeshStandardMaterial({ color: 0xD4A14A, roughness: 0.22, metalness: 0.72 });
      var steelMat = new THREE.MeshStandardMaterial({ color: 0xB8C2CA, roughness: 0.25, metalness: 0.75 });
      var darkMat = new THREE.MeshStandardMaterial({ color: 0x1F303E, roughness: 0.35, metalness: 0.25 });

      if (iconId === "breaker" || iconId === "interlock" || iconId === "bolt") {
        var box = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.28), darkMat);
        box.position.y = 0.11;
        var lever = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.08), accMat);
        lever.position.set(0, 0.24, 0.04);
        lever.rotation.x = 0.42;
        g.add(box, lever);
      } else if (iconId === "ground" || iconId === "tripod") {
        var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.03, 0.38, 12), brassMat);
        rod.position.y = 0.19;
        var cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.06, 12), accMat);
        cap.position.y = 0.04;
        g.add(rod, cap);
      } else if (iconId === "psv" || iconId === "valve-off" || iconId === "pump") {
        var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.24, 10), steelMat);
        stem.position.y = 0.12;
        var wheel = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 10, 20), accMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.y = 0.25;
        g.add(stem, wheel);
      } else if (iconId === "lock") {
        var body = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.12), brassMat);
        body.position.y = 0.11;
        var shackle = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.025, 10, 18, Math.PI), steelMat);
        shackle.position.y = 0.23;
        g.add(body, shackle);
      } else if (iconId === "drum" || iconId === "extinguisher") {
        var drum = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.34, 16), accMat);
        drum.position.y = 0.17;
        var rib = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.02, 8, 16), darkMat);
        rib.rotation.x = Math.PI / 2;
        rib.position.y = 0.17;
        g.add(drum, rib);
      } else if (iconId === "smoke" || iconId === "sensor-gas" || iconId === "gauge-zero") {
        var base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.1, 18), steelMat);
        base.position.y = 0.05;
        var dome = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), accMat);
        dome.position.y = 0.1;
        g.add(base, dome);
      } else if (iconId === "sign" || iconId === "bridge" || iconId === "no-ground") {
        var warn = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.3, 4), accMat);
        warn.position.y = 0.15;
        warn.rotation.y = Math.PI / 4;
        g.add(warn);
      } else {
        var prism = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), accMat);
        prism.position.y = 0.18;
        g.add(prism);
      }
      g.traverse(function (c) { if (c.isMesh) { c.castShadow = true; } });
      return g;
    }

    /* -----------------------------------------------------------------------
       CONSTRUCTOR DE PIEZA 3D BISELADA E INCLINADA HACIA LA CÁMARA
       ----------------------------------------------------------------------- */
    function create3DModule(piece, homeVec3, optsMod) {
      var o = optsMod || {};
      var mw = o.w || 2.15;
      var md = o.d || 1.06;
      var mh = o.h || 0.28;
      var group = new THREE.Group();
      group.position.copy(homeVec3);

      var lipGeom = new THREE.ExtrudeGeometry(roundedBoxShape(mw, md, 0.18), {
        depth: mh * 0.48, bevelEnabled: true, bevelThickness: 0.045, bevelSize: 0.045, bevelSegments: 2
      });
      lipGeom.rotateX(Math.PI / 2);
      var lipMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(piece.color || COL.petroleo),
        roughness: 0.3, metalness: 0.28
      });
      var lipMesh = new THREE.Mesh(lipGeom, lipMat);
      lipMesh.position.y = mh * 0.48;
      lipMesh.castShadow = true;
      lipMesh.receiveShadow = true;
      group.add(lipMesh);

      var topGeom = new THREE.ExtrudeGeometry(roundedBoxShape(mw - 0.05, md - 0.05, 0.15), {
        depth: mh * 0.56, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 2
      });
      topGeom.rotateX(Math.PI / 2);
      var topMat = new THREE.MeshStandardMaterial({
        color: 0xFFFDF9, roughness: 0.25, metalness: 0.05
      });
      var topMesh = new THREE.Mesh(topGeom, topMat);
      topMesh.position.y = mh + 0.04;
      topMesh.castShadow = true;
      topMesh.receiveShadow = true;
      group.add(topMesh);

      // Placa gráfica HD sin tone-mapping para lectura instantánea
      var tex = makeCardTexture(piece.icon, piece.label, piece.color);
      var faceMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
      var facePlane = new THREE.Mesh(new THREE.PlaneGeometry(mw - 0.1, md - 0.1), faceMat);
      facePlane.rotation.x = -Math.PI / 2;
      facePlane.position.y = mh + 0.086;
      group.add(facePlane);

      var sculpt = createHardwareSculpt(piece.icon, piece.color);
      sculpt.position.set(-mw * 0.36, mh + 0.08, -md * 0.45);
      sculpt.scale.setScalar(0.88);
      group.add(sculpt);

      // Hitbox transparente amplio y clickeable en Three.js
      var hitBox = new THREE.Mesh(new THREE.BoxGeometry(mw + 0.32, 0.9, md + 0.32), ghostMat());
      hitBox.position.y = 0.3;
      group.add(hitBox);

      var modObj = {
        data: piece,
        mesh: group,
        lipMat: lipMat,
        topMat: topMat,
        sculpt: sculpt,
        hitMesh: hitBox,
        home: homeVec3.clone(),
        target: homeVec3.clone(),
        baseTiltX: o.tiltX !== undefined ? o.tiltX : 0.44,
        velX: 0,
        velZ: 0,
        hovered: false,
        selected: false,
        dragging: false,
        locked: false
      };

      group.traverse(function (c) { c.userData.moduleRef = modObj; });
      stageGroup.add(group);
      return modObj;
    }

    function createMagneticSocket3D(posVec3, label, colorHex) {
      var g = new THREE.Group();
      g.position.copy(posVec3);

      var ped = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 1.05, 0.16, 28),
        new THREE.MeshStandardMaterial({ color: 0xECE7E1, roughness: 0.38, metalness: 0.15 })
      );
      ped.position.y = 0.08;
      ped.receiveShadow = true;
      ped.castShadow = true;
      g.add(ped);

      var ringMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex || COL.petroleo),
        emissive: new THREE.Color(colorHex || COL.petroleo),
        emissiveIntensity: 0.32,
        roughness: 0.25, metalness: 0.55
      });
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.065, 12, 36), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.18;
      g.add(ring);

      var haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorHex || COL.verde),
        transparent: true, opacity: 0.24, side: THREE.DoubleSide
      });
      var halo = new THREE.Mesh(new THREE.RingGeometry(0.92, 1.18, 36), haloMat);
      halo.rotation.x = -Math.PI / 2;
      halo.position.y = 0.17;
      g.add(halo);

      if (label) {
        var plaque = createFloatingPlaque(label, null, 2.0, 0.62, "#14212B", "#FFFFFF", colorHex || COL.petroleo);
        plaque.rotation.x = -Math.PI * 0.25;
        plaque.position.set(0, 0.46, -0.98);
        g.add(plaque);
      }

      var hitCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.9, 16), ghostMat());
      hitCyl.position.y = 0.4;
      g.add(hitCyl);

      stageGroup.add(g);
      var sockObj = {
        label: label || "",
        group: g, ring: ring, ringMat: ringMat, halo: halo, haloMat: haloMat,
        hitMesh: hitCyl, pos: posVec3.clone(), filled: null
      };
      g.traverse(function (c) { c.userData.socketRef = sockObj; });
      return sockObj;
    }

    function createDragTether() {
      var mat = new THREE.MeshBasicMaterial({ color: 0x6B8E77, transparent: true, opacity: 0.78 });
      var beam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 10), mat);
      beam.visible = false;
      stageGroup.add(beam);
      return beam;
    }

    function updateDragTether(beam, fromPos, toPos, colorHex) {
      var dist = fromPos.distanceTo(toPos);
      if (dist < 0.05) { beam.visible = false; return; }
      beam.visible = true;
      beam.material.color.set(colorHex || COL.verde);
      beam.position.copy(fromPos).add(toPos).multiplyScalar(0.5);
      beam.scale.set(1, dist, 1);
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), toPos.clone().sub(fromPos).normalize());
    }

    /* -----------------------------------------------------------------------
       EFECTOS DE PARTÍCULAS Y ONDAS EXPANSIVAS 3D
       ----------------------------------------------------------------------- */
    function spawnBurst3D(pos, hexColor, count) {
      var n = count || 18;
      var col = new THREE.Color(hexColor || COL.verde);
      for (var i = 0; i < n; i++) {
        var geom = i % 2 === 0 ? new THREE.OctahedronGeometry(0.11, 0) : new THREE.BoxGeometry(0.12, 0.12, 0.12);
        var mat = new THREE.MeshStandardMaterial({
          color: col, emissive: col, emissiveIntensity: 0.45,
          roughness: 0.25, metalness: 0.5, transparent: true, opacity: 1
        });
        var mesh = new THREE.Mesh(geom, mat);
        mesh.position.copy(pos);
        fxGroup.add(mesh);
        var ang = Math.random() * Math.PI * 2;
        var spd = 0.05 + Math.random() * 0.14;
        fxParticles.push({
          mesh: mesh,
          vx: Math.cos(ang) * spd,
          vy: 0.08 + Math.random() * 0.16,
          vz: Math.sin(ang) * spd,
          rx: (Math.random() - 0.5) * 0.2,
          ry: (Math.random() - 0.5) * 0.2,
          life: 1
        });
      }
      spawnShockwave3D(pos, hexColor);
    }

    function spawnShockwave3D(pos, hexColor) {
      var geom = new THREE.TorusGeometry(0.45, 0.04, 10, 36);
      var mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hexColor || COL.verde),
        transparent: true, opacity: 0.85
      });
      var ring = new THREE.Mesh(geom, mat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(pos.x, Math.max(0.12, pos.y), pos.z);
      fxGroup.add(ring);
      fxShockwaves.push({ mesh: ring, life: 1, maxScale: 3.4 });
    }

    function win(titulo, norma, sabias) {
      if (won) return;
      won = true;
      hideHover();
      spawnBurst3D(new THREE.Vector3(0, 1.2, 0), COL.verde, 26);
      spawnBurst3D(new THREE.Vector3(-1.4, 1.0, 0.4), COL.ocre, 14);
      spawnBurst3D(new THREE.Vector3(1.4, 1.0, 0.4), COL.petroleo, 14);
      if (elNorma) elNorma.textContent = norma;
      if (elTit) elTit.textContent = titulo;
      if (elSab) elSab.textContent = sabias;
      if (elPremio) elPremio.classList.add("visible");
      if (btnReclamar && currentExp) {
        btnReclamar.setAttribute(
          "data-diag-contexto",
          "Completé el desafío 3D «" + currentExp.nombre + "» (" + norma + ") y quiero agendar el Diagnóstico Express Gratuito."
        );
      }
    }

    function animateModules(modules, t, activeSlots) {
      modules.forEach(function (m, idx) {
        if (m.dragging) {
          m.mesh.position.x += (m.target.x - m.mesh.position.x) * 0.36;
          m.mesh.position.z += (m.target.z - m.mesh.position.z) * 0.36;
          m.mesh.position.y += (0.98 - m.mesh.position.y) * 0.3;
          m.mesh.scale.lerp(new THREE.Vector3(1.09, 1.09, 1.09), 0.25);
          m.mesh.rotation.z += (Math.max(-0.24, Math.min(0.24, -m.velX * 0.45)) - m.mesh.rotation.z) * 0.22;
          m.mesh.rotation.x += ((0.22 + Math.max(-0.2, Math.min(0.2, m.velZ * 0.45))) - m.mesh.rotation.x) * 0.22;
        } else {
          var restY = m.locked ? 0.24 : (m.selected ? 0.65 : (m.hovered ? 0.52 : 0.26 + Math.sin(t * 0.0024 + idx) * 0.03));
          m.mesh.position.x += (m.target.x - m.mesh.position.x) * 0.18;
          m.mesh.position.z += (m.target.z - m.mesh.position.z) * 0.18;
          m.mesh.position.y += (restY - m.mesh.position.y) * 0.18;
          var sc = (m.hovered || m.selected) && !m.locked ? 1.07 : 1.0;
          m.mesh.scale.lerp(new THREE.Vector3(sc, sc, sc), 0.18);
          var targetTiltX = m.locked ? 0.14 : (m.hovered || m.selected ? m.baseTiltX - 0.1 : m.baseTiltX);
          m.mesh.rotation.x += (targetTiltX - m.mesh.rotation.x) * 0.18;
          m.mesh.rotation.z += (0 - m.mesh.rotation.z) * 0.18;
        }
        m.lipMat.emissive.set(m.hovered || m.dragging || m.selected ? m.data.color : "#000000");
        m.lipMat.emissiveIntensity = (m.dragging || m.selected) ? 0.65 : (m.hovered ? 0.35 : 0);
        if (m.sculpt && !m.locked) {
          m.sculpt.rotation.y = Math.sin(t * 0.0018 + idx) * 0.35;
        }
      });

      if (activeSlots) {
        activeSlots.forEach(function (s, idx) {
          var pulse = 1 + Math.sin(t * 0.004 + idx) * 0.07;
          s.halo.scale.set(pulse, pulse, 1);
          s.ring.position.y = 0.18 + Math.sin(t * 0.003 + idx) * 0.03;
        });
      }
    }

    function updatePointerOnModule(modules, xNDC, yNDC) {
      raycaster.setFromCamera({ x: xNDC, y: yNDC }, camera);
      var roots = [];
      modules.forEach(function (m) { if (!m.locked) roots.push(m.mesh); });
      var hits = raycaster.intersectObjects(roots, true);
      var hitMod = hits.length ? hits[0].object.userData.moduleRef : null;
      modules.forEach(function (m) { m.hovered = (m === hitMod); });
      return hitMod;
    }

    function updatePointerOnTargets(targets, propKey) {
      raycaster.setFromCamera(pointerNDC, camera);
      var roots = targets.map(function (t) { return t.group; });
      var hits = raycaster.intersectObjects(roots, true);
      return hits.length ? hits[0].object.userData[propKey || "socketRef"] : null;
    }

    /* -----------------------------------------------------------------------
       CONTROLADOR COMPARTIDO DE ARRASTRE + CLIC ALTERNATIVO EN PIEZAS/DESTINOS
       ----------------------------------------------------------------------- */
    function makeDragAndClickHandlers(cfg) {
      return {
        selectedMod: null,
        dragging: null,
        selectMod: function (m) {
          this.modules.forEach(function (k) { k.selected = (k === m); });
          this.selectedMod = m;
          if (m) showHover(m.data.label + " seleccionado · Tocá el destino en el tablero");
        },
        onDown: function () {
          if (won) return;
          var hitM = updatePointerOnModule(this.modules, pointerNDC.x, pointerNDC.y);
          if (hitM) {
            this.dragging = hitM;
            hitM.dragging = true;
            canvas.classList.add("arrastrando");
            showHover(hitM.data.label + " · Soltá sobre un destino");
            return;
          }
          // Si ya hay pieza seleccionada y hace clic directo en un destino abierto, colocarla allí
          if (this.selectedMod) {
            var targets = cfg.getTargets(this);
            var hitT = updatePointerOnTargets(targets, cfg.targetKey || "socketRef");
            if (hitT && !cfg.isFilled(hitT)) {
              cfg.tryPlace(this, this.selectedMod, hitT);
              this.selectMod(null);
            } else {
              this.selectMod(null);
              hideHover();
            }
          }
        },
        onMove: function () {
          if (this.dragging) {
            raycaster.setFromCamera(pointerNDC, camera);
            if (raycaster.ray.intersectPlane(dragPlane, dragHit)) {
              var nx = Math.max(-4.3, Math.min(4.3, dragHit.x));
              var nz = Math.max(-2.5, Math.min(2.8, dragHit.z));
              this.dragging.velX = nx - this.dragging.target.x;
              this.dragging.velZ = nz - this.dragging.target.z;
              this.dragging.target.set(nx, 0.98, nz);
            }
            return;
          }
          var h = updatePointerOnModule(this.modules, pointerNDC.x, pointerNDC.y);
          if (h) {
            canvas.classList.add("clickeable");
            showHover(h.data.label + " · Arrastrá o hacé clic para elegir");
            return;
          }
          var targets = cfg.getTargets(this);
          var hitT = updatePointerOnTargets(targets, cfg.targetKey || "socketRef");
          if (hitT && !cfg.isFilled(hitT)) {
            canvas.classList.add("clickeable");
            showHover(this.selectedMod ? ("Colocar " + this.selectedMod.data.label + " en " + hitT.label) : ("Destino: " + hitT.label));
            return;
          }
          canvas.classList.remove("clickeable");
          if (!this.selectedMod) hideHover();
        },
        onUp: function () {
          var m = this.dragging;
          if (!m) return;
          this.dragging = null;
          m.dragging = false;
          this.tether.visible = false;
          canvas.classList.remove("arrastrando");

          var moveDist = Math.hypot(pointerNDC.x - downNDC.x, pointerNDC.y - downNDC.y);
          var targets = cfg.getTargets(this);

          // Primero intentar encaje cercano en suelte de arrastre
          for (var i = 0; i < targets.length; i++) {
            var s = targets[i];
            if (!cfg.isFilled(s) && Math.hypot(m.mesh.position.x - s.pos.x, m.mesh.position.z - s.pos.z) < 1.52) {
              this.selectMod(null);
              cfg.tryPlace(this, m, s);
              return;
            }
          }

          // Si fue un clic corto (sin arrastrar lejos), dejar seleccionada para modo clic-destino
          m.target.copy(m.home);
          if (moveDist < 0.045) {
            if (this.selectedMod === m) {
              this.selectMod(null);
              hideHover();
            } else {
              this.selectMod(m);
            }
          } else if (!this.selectedMod) {
            hideHover();
          }
        },
        tickTether: function () {
          var refMod = this.dragging || this.selectedMod;
          if (!refMod || !this.tether) return;
          var near = null, minD = 99;
          var targets = cfg.getTargets(this);
          targets.forEach(function (s) {
            if (!cfg.isFilled(s)) {
              var d = Math.hypot(refMod.mesh.position.x - s.pos.x, refMod.mesh.position.z - s.pos.z);
              if (d < 2.6 && d < minD) { minD = d; near = s; }
            }
          });
          if (near) updateDragTether(this.tether, refMod.mesh.position, near.pos.clone().setY(0.35), near.color || COL.verde);
          else this.tether.visible = false;
        }
      };
    }

    /* =======================================================================
       1. CIRCUITO SEGURO (Tablero / Red Incendio / LOTO en 3D)
       ======================================================================= */
    var ctrlCircuito = makeDragAndClickHandlers({
      targetKey: "socketRef",
      getTargets: function (self) { return self.slots; },
      isFilled: function (s) { return !!s.filled; },
      tryPlace: function (self, m, s) {
        if (!m.data.seguro) {
          shakeAmt = 0.28;
          spawnBurst3D(s.pos.clone().setY(0.5), COL.nexo, 16);
          showToast(m.data.aviso || "Ese elemento no protege el circuito.");
          m.target.copy(m.home);
          return;
        }
        m.target.copy(s.pos); m.locked = true; s.filled = m;
        s.ringMat.color.set(COL.verde);
        s.ringMat.emissive.set(COL.verde);
        s.ringMat.emissiveIntensity = 0.72;
        s.pipeMat.color.set(COL.verde);
        spawnBurst3D(s.pos.clone().setY(0.45), m.data.color, 18);
        var n = self.slots.filter(function (k) { return k.filled; }).length;
        elProg.textContent = n + " / 2 seguros";
        if (n === 2) win("¡Circuito verificado y en regla!", self.v.norma, self.v.sabias);
      }
    });

    var expCircuito = {
      id: "circuito", tipo: "puzzle", nombre: "Circuito Seguro", categoria: "INGENIERÍA EN CAMPO",
      v: null, slots: [], modules: [], dragging: null, selectedMod: null, tether: null, flowDots: [],
      init: function (vi) {
        this.v = pick(DATA.CIRCUITOS, vi);
        this.selectedMod = null; this.dragging = null;
        camBase.set(0, 7.6, 11.2); camLook.set(0, 0.2, 0.3);

        var chasis = new THREE.Mesh(
          new THREE.ExtrudeGeometry(roundedBoxShape(7.0, 3.3, 0.35), { depth: 0.26, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 }),
          new THREE.MeshStandardMaterial({ color: 0xF5EFEB, roughness: 0.4, metalness: 0.1 })
        );
        chasis.rotation.x = Math.PI / 2;
        chasis.position.set(0, 0.18, -0.75);
        chasis.receiveShadow = true; chasis.castShadow = true;
        stageGroup.add(chasis);

        var core = new THREE.Mesh(
          new THREE.BoxGeometry(1.45, 0.56, 1.15),
          new THREE.MeshStandardMaterial({ color: 0x1F303E, roughness: 0.28, metalness: 0.4 })
        );
        core.position.set(0, 0.44, -0.75);
        core.castShadow = true; core.receiveShadow = true;
        stageGroup.add(core);

        var corePlaque = createFloatingPlaque(this.v.etiquetaCentro, this.v.subtitulo, 2.35, 0.74, "#14212B", "#FFFFFF", COL.ocre);
        corePlaque.rotation.x = -Math.PI * 0.24;
        corePlaque.position.set(0, 1.05, -1.45);
        stageGroup.add(corePlaque);

        var slotPos = [new THREE.Vector3(-2.15, 0.16, -0.75), new THREE.Vector3(2.15, 0.16, -0.6)];
        var selfFlow = [];
        this.slots = this.v.slots.map(function (s, idx) {
          var p = slotPos[idx];
          var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.32, -0.75),
            new THREE.Vector3(p.x * 0.5, 0.32, p.z),
            new THREE.Vector3(p.x, 0.24, p.z)
          ]);
          var pipeMat = new THREE.MeshStandardMaterial({ color: 0x6C7A86, roughness: 0.3, metalness: 0.65 });
          var pipe = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.06, 8, false), pipeMat);
          pipe.castShadow = true;
          stageGroup.add(pipe);

          var dot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), new THREE.MeshBasicMaterial({ color: 0x6B8E77 }));
          dot.visible = false;
          stageGroup.add(dot);
          selfFlow.push({ dot: dot, curve: curve, slotIdx: idx });

          var sock = createMagneticSocket3D(p, s.label, idx === 0 ? COL.petroleo : COL.verde);
          sock.acepta = s.acepta;
          sock.pipeMat = pipeMat;
          return sock;
        });
        this.flowDots = selfFlow;

        var xs = [-3.22, -1.07, 1.07, 3.22];
        this.modules = shuffle(this.v.piezas).map(function (p, i) {
          return create3DModule(p, new THREE.Vector3(xs[i], 0.26, 2.05), { w: 1.96, d: 1.02 });
        });
        this.tether = createDragTether();
        elProg.textContent = "0 / 2 seguros";
        setPie("<strong>" + this.v.subtitulo + ":</strong> " + this.v.objetivo + " (podés arrastrar o hacer clic).");
      },
      selectMod: ctrlCircuito.selectMod,
      onDown: ctrlCircuito.onDown,
      onMove: ctrlCircuito.onMove,
      onUp: ctrlCircuito.onUp,
      forceWin: function () {
        var self = this;
        this.slots.forEach(function (s, i) {
          var m = self.modules.find(function (k) { return k.data.id === s.acepta; }) || self.modules.filter(function (k) { return k.data.seguro; })[i];
          if (m) { m.target.copy(s.pos); m.locked = true; s.filled = m; s.pipeMat.color.set(COL.verde); }
        });
        elProg.textContent = "2 / 2 seguros";
        win("¡Circuito verificado y en regla!", this.v.norma, this.v.sabias);
      },
      tick: function (t) {
        animateModules(this.modules, t, this.slots);
        ctrlCircuito.tickTether.call(this);
        var self = this;
        this.flowDots.forEach(function (fd) {
          var locked = !!self.slots[fd.slotIdx].filled;
          fd.dot.visible = locked;
          if (locked) fd.curve.getPoint((t * 0.00075) % 1, fd.dot.position);
        });
      }
    };

    /* =======================================================================
       2. SHIFT NODAL (Monolito 3D reversible 180° de doble cara)
       ======================================================================= */
    var expShift = {
      id: "shift", tipo: "puzzle", nombre: "Shift Nodal", categoria: "LÓGICA DE CUMPLIMIENTO",
      v: null, boardGroup: null, orb: null, orbX: -2.85, rotX: 0, targetRotX: 0, flipped: false,
      gates: [], goalMesh: null, warnCD: 0,
      init: function (vi) {
        this.v = pick(DATA.SHIFTS, vi);
        camBase.set(0, 5.4, 9.2); camLook.set(0, 0.3, 0.1);
        this.flipped = false; this.rotX = 0; this.targetRotX = 0;
        this.orbX = -2.85; this.warnCD = 0;
        this.gates = [
          { x: -1.3, needDark: false, passed: false },
          { x: 0.15, needDark: true,  passed: false },
          { x: 1.6,  needDark: false, passed: false }
        ];

        this.boardGroup = new THREE.Group();
        this.boardGroup.position.set(0, 0.72, -0.15);
        stageGroup.add(this.boardGroup);

        var topHalf = new THREE.Mesh(
          new THREE.BoxGeometry(6.8, 0.18, 2.7),
          new THREE.MeshStandardMaterial({ color: 0xFAF7F3, roughness: 0.3, metalness: 0.08 })
        );
        topHalf.position.y = 0.09; topHalf.castShadow = true; topHalf.receiveShadow = true;

        var botHalf = new THREE.Mesh(
          new THREE.BoxGeometry(6.8, 0.18, 2.7),
          new THREE.MeshStandardMaterial({ color: 0x1F303E, roughness: 0.28, metalness: 0.35 })
        );
        botHalf.position.y = -0.09; botHalf.castShadow = true; botHalf.receiveShadow = true;

        var railMat = new THREE.MeshStandardMaterial({ color: 0xC38B42, emissive: 0xC38B42, emissiveIntensity: 0.32, roughness: 0.25, metalness: 0.6 });
        var rail = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.42, 0.14), railMat);

        var topLabel = createFloatingPlaque("NORMA EN PAPEL", "CLIC · INVERTIR A PLANTA", 3.6, 0.66, "#14212B", "#FFFFFF", COL.ocre);
        topLabel.rotation.x = -Math.PI / 2;
        topLabel.position.set(0, 0.205, 0.88);

        var botLabel = createFloatingPlaque("REALIDAD EN PLANTA", "CLIC · INVERTIR A NORMA", 3.6, 0.66, "#14212B", "#FFFFFF", COL.verde);
        botLabel.rotation.x = Math.PI / 2;
        botLabel.position.set(0, -0.205, -0.88);

        this.boardGroup.add(topHalf, botHalf, rail, topLabel, botLabel);

        var self = this;
        this.gates.forEach(function (g) {
          var blockedMat = new THREE.MeshStandardMaterial({ color: 0xC01D2E, emissive: 0xC01D2E, emissiveIntensity: 0.3, roughness: 0.25, metalness: 0.35 });
          var openMat = new THREE.MeshStandardMaterial({ color: 0x6B8E77, emissive: 0x6B8E77, emissiveIntensity: 0.22, roughness: 0.3, metalness: 0.25 });

          var topBlock = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.56, 0.68), g.needDark ? blockedMat : openMat);
          topBlock.position.set(g.x, g.needDark ? 0.46 : 0.22, g.needDark ? 0 : -0.84);
          topBlock.castShadow = true;

          var botBlock = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.56, 0.68), g.needDark ? openMat : blockedMat);
          botBlock.position.set(g.x, g.needDark ? -0.22 : -0.46, g.needDark ? 0.84 : 0);
          botBlock.castShadow = true;
          self.boardGroup.add(topBlock, botBlock);
        });

        this.orb = new THREE.Mesh(
          new THREE.SphereGeometry(0.32, 24, 24),
          new THREE.MeshStandardMaterial({ color: 0xC38B42, emissive: 0xC38B42, emissiveIntensity: 0.4, roughness: 0.18, metalness: 0.72 })
        );
        this.orb.position.set(this.orbX, 0.4, 0);
        this.orb.castShadow = true;
        this.boardGroup.add(this.orb);

        this.goalMesh = new THREE.Mesh(
          new THREE.TorusGeometry(0.45, 0.085, 12, 28),
          new THREE.MeshStandardMaterial({ color: 0x6B8E77, emissive: 0x6B8E77, emissiveIntensity: 0.6, roughness: 0.2, metalness: 0.5 })
        );
        this.goalMesh.rotation.y = Math.PI / 2;
        this.goalMesh.position.set(2.85, 0, 0);
        this.boardGroup.add(this.goalMesh);

        elProg.textContent = "0 / 3 compuertas";
        setPie("<strong>" + this.v.subtitulo + ":</strong> Hacé clic para <strong>INVERTIR 180°</strong> cuando la esfera llegue a una compuerta roja.");
      },
      onDown: function () {
        if (won) return;
        this.flipped = !this.flipped;
        this.targetRotX = this.flipped ? Math.PI : 0;
        spawnShockwave3D(new THREE.Vector3(this.orbX, 0.5, 0), this.flipped ? COL.verde : COL.ocre);
        showHover(this.flipped ? "Plano activo: Realidad en Planta" : "Plano activo: Norma en Papel");
      },
      onMove: function () {
        canvas.classList.add("clickeable");
        showHover("Clic en el tablero · Invertir plano 180°");
      },
      onUp: function () {},
      forceWin: function () {
        this.orbX = 2.85;
        this.gates.forEach(function (g) { g.passed = true; });
        elProg.textContent = "3 / 3 compuertas";
        win("¡Del papel a la planta integrado!", this.v.norma, this.v.sabias);
      },
      tick: function (t) {
        this.rotX += (this.targetRotX - this.rotX) * 0.16;
        this.boardGroup.rotation.x = this.rotX;
        this.orb.position.y = this.flipped ? -0.4 : 0.4;
        this.goalMesh.rotation.x = t * 0.002;
        if (this.warnCD > 0) this.warnCD--;

        if (!won) {
          var nextX = this.orbX + 0.024;
          var blocked = false;
          for (var i = 0; i < this.gates.length; i++) {
            var g = this.gates[i];
            if (Math.abs(nextX - g.x) < 0.34 && g.needDark !== this.flipped) {
              blocked = true;
              if (this.warnCD === 0) {
                this.warnCD = 45;
                spawnBurst3D(new THREE.Vector3(g.x, 0.65, 0), COL.nexo, 6);
              }
              break;
            }
            if (!g.passed && nextX > g.x + 0.34 && g.needDark === this.flipped) {
              g.passed = true;
              spawnBurst3D(new THREE.Vector3(g.x, 0.55, 0), COL.verde, 12);
              var c = this.gates.filter(function (k) { return k.passed; }).length;
              elProg.textContent = c + " / 3 compuertas";
            }
          }
          if (!blocked) this.orbX = Math.min(2.85, nextX);
          this.orb.position.x = this.orbX;
          if (this.orbX >= 2.8) {
            elProg.textContent = "3 / 3 compuertas";
            win("¡Del papel a la planta integrado!", this.v.norma, this.v.sabias);
          }
        }
      }
    };

    /* =======================================================================
       3. BLINDÁ EL PROCESO (Reactor / Silo / NH3 en 3D)
       ======================================================================= */
    var ctrlProceso = makeDragAndClickHandlers({
      targetKey: "socketRef",
      getTargets: function (self) { return self.slots; },
      isFilled: function (s) { return !!s.filled; },
      tryPlace: function (self, m, s) {
        if (!m.data.seguro) {
          shakeAmt = 0.32;
          spawnBurst3D(s.pos.clone().setY(0.5), COL.nexo, 16);
          showToast(m.data.aviso || "No detiene la escalada del evento.");
          m.target.copy(m.home);
          return;
        }
        m.target.copy(s.pos); m.locked = true; s.filled = m;
        s.pipeMat.color.set(COL.verde);
        spawnBurst3D(s.pos.clone().setY(0.5), m.data.color, 18);
        var n = self.slots.filter(function (k) { return k.filled; }).length;
        elProg.textContent = n + " / 2 barreras";
        if (n === 2) win("¡Proceso estabilizado con capas independientes!", self.v.norma, self.v.sabias);
      }
    });

    var expProceso = {
      id: "proceso", tipo: "puzzle", nombre: "Blindá el Proceso", categoria: "SEGURIDAD DE PROCESOS (PSM)",
      v: null, slots: [], modules: [], dragging: null, selectedMod: null, tether: null, needle: null, alarmMat: null,
      init: function (vi) {
        this.v = pick(DATA.PROCESOS, vi);
        this.selectedMod = null; this.dragging = null;
        camBase.set(0, 7.6, 11.4); camLook.set(0, 0.45, 0.35);

        var deckMesh = new THREE.Mesh(
          new THREE.BoxGeometry(6.8, 0.2, 3.1),
          new THREE.MeshStandardMaterial({ color: 0xECE7E1, roughness: 0.45, metalness: 0.12 })
        );
        deckMesh.position.set(0, 0.1, -0.95);
        deckMesh.receiveShadow = true; deckMesh.castShadow = true;
        stageGroup.add(deckMesh);

        var vesselMat = new THREE.MeshStandardMaterial({ color: 0x2A4154, roughness: 0.28, metalness: 0.52 });
        var trimMat = new THREE.MeshStandardMaterial({ color: 0x8F9CA6, roughness: 0.22, metalness: 0.78 });
        var tankGroup = new THREE.Group();
        tankGroup.position.set(0, 1.35, -0.9);

        var cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.3, 28), vesselMat); cyl.castShadow = true;
        var capTop = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), vesselMat); capTop.position.y = 0.65; capTop.castShadow = true;
        var capBot = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), vesselMat); capBot.position.y = -0.65;
        var band1 = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.045, 10, 28), trimMat); band1.rotation.x = Math.PI / 2; band1.position.y = 0.35;
        var band2 = band1.clone(); band2.position.y = -0.35;

        [[-0.62, 0.62], [0.62, 0.62], [-0.62, -0.62], [0.62, -0.62]].forEach(function (pt) {
          var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.25, 10), trimMat);
          leg.position.set(pt[0], -0.65, pt[1]); leg.castShadow = true; tankGroup.add(leg);
        });

        var dialHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.14, 24), trimMat);
        dialHousing.rotation.x = Math.PI / 2; dialHousing.position.set(0, 0.1, 0.88);
        var dialFace = new THREE.Mesh(new THREE.CircleGeometry(0.32, 24), new THREE.MeshBasicMaterial({ color: 0xFAF7F3, toneMapped: false }));
        dialFace.position.set(0, 0.1, 0.955);

        this.needle = new THREE.Group();
        this.needle.position.set(0, 0.1, 0.97);
        var needleBar = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.24, 0.02), new THREE.MeshBasicMaterial({ color: 0xC01D2E }));
        needleBar.position.y = 0.1; this.needle.add(needleBar);

        this.alarmMat = new THREE.MeshStandardMaterial({ color: 0xC01D2E, emissive: 0xC01D2E, emissiveIntensity: 0.9, roughness: 0.2 });
        var beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.24, 16), this.alarmMat);
        beacon.position.y = 1.58;

        tankGroup.add(cyl, capTop, capBot, band1, band2, dialHousing, dialFace, this.needle, beacon);
        stageGroup.add(tankGroup);

        var eqPlaque = createFloatingPlaque(this.v.equipo, this.v.subtitulo, 2.4, 0.72, "#14212B", "#FFFFFF", COL.ocre);
        eqPlaque.rotation.x = -Math.PI * 0.22;
        eqPlaque.position.set(0, 0.6, 0.38);
        stageGroup.add(eqPlaque);

        var slotPos = [new THREE.Vector3(-2.35, 0.2, -0.75), new THREE.Vector3(2.35, 0.2, -0.6)];
        this.slots = this.v.slots.map(function (s, idx) {
          var p = slotPos[idx];
          var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(idx === 0 ? -0.82 : 0.82, 1.0, -0.9),
            new THREE.Vector3(p.x * 0.65, 0.65, p.z),
            new THREE.Vector3(p.x, 0.28, p.z)
          ]);
          var pipeMat = new THREE.MeshStandardMaterial({ color: 0x6C7A86, roughness: 0.28, metalness: 0.7 });
          var pipe = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.08, 10, false), pipeMat);
          pipe.castShadow = true; stageGroup.add(pipe);
          var sock = createMagneticSocket3D(p, s.label, idx === 0 ? COL.petroleo : COL.verde);
          sock.acepta = s.acepta; sock.pipeMat = pipeMat;
          return sock;
        });

        var xs = [-2.5, 0, 2.5];
        this.modules = shuffle(this.v.piezas).map(function (p, i) {
          return create3DModule(p, new THREE.Vector3(xs[i], 0.26, 2.05), { w: 2.1, d: 1.04 });
        });
        this.tether = createDragTether();
        elProg.textContent = "0 / 2 barreras";
        setPie("<strong>" + this.v.subtitulo + ":</strong> Instalá las 2 barreras independientes (arrastrá o hacé clic).");
      },
      selectMod: ctrlProceso.selectMod,
      onDown: ctrlProceso.onDown,
      onMove: ctrlProceso.onMove,
      onUp: ctrlProceso.onUp,
      forceWin: function () {
        var self = this;
        this.slots.forEach(function (s, i) {
          var m = self.modules.find(function (k) { return k.data.id === s.acepta; }) || self.modules.filter(function (k) { return k.data.seguro; })[i];
          if (m) { m.target.copy(s.pos); m.locked = true; s.filled = m; s.pipeMat.color.set(COL.verde); }
        });
        elProg.textContent = "2 / 2 barreras";
        win("¡Proceso estabilizado con capas independientes!", this.v.norma, this.v.sabias);
      },
      tick: function (t) {
        animateModules(this.modules, t, this.slots);
        ctrlProceso.tickTether.call(this);
        var n = this.slots.filter(function (k) { return k.filled; }).length;
        if (n === 2) {
          this.needle.rotation.z += (0.85 - this.needle.rotation.z) * 0.1;
          this.alarmMat.color.set(COL.verde); this.alarmMat.emissive.set(COL.verde); this.alarmMat.emissiveIntensity = 0.65;
        } else {
          this.needle.rotation.z = -0.9 + Math.sin(t * 0.025) * (0.28 - n * 0.1);
          this.alarmMat.emissiveIntensity = 0.35 + Math.abs(Math.sin(t * 0.008)) * 0.9;
        }
      }
    };

    /* =======================================================================
       4. DE EMISIONES A RENTABILIDAD (Torres 3D + 3 interruptores inclinados)
       ======================================================================= */
    var expCarbono = {
      id: "carbono", tipo: "puzzle", nombre: "De Emisiones a Rentabilidad", categoria: "FINANZAS VERDES",
      v: null, levers: [], emBar: null, ahBar: null, emH: 2.6, ahH: 0.45,
      init: function (vi) {
        this.v = pick(DATA.CARBONO, vi);
        camBase.set(0, 6.8, 11.4); camLook.set(0, 1.05, 0.35);

        var pedGeo = new THREE.BoxGeometry(2.2, 0.25, 1.8);
        var pedMat = new THREE.MeshStandardMaterial({ color: 0x1F303E, roughness: 0.35, metalness: 0.3 });
        var pedL = new THREE.Mesh(pedGeo, pedMat); pedL.position.set(-1.75, 0.125, -0.95); pedL.castShadow = true; pedL.receiveShadow = true;
        var pedR = new THREE.Mesh(pedGeo, pedMat); pedR.position.set(1.75, 0.125, -0.95); pedR.castShadow = true; pedR.receiveShadow = true;
        stageGroup.add(pedL, pedR);

        var glassMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.22, roughness: 0.1, metalness: 0.1 });
        var glassGeo = new THREE.BoxGeometry(1.45, 2.8, 1.15);
        var gL = new THREE.Mesh(glassGeo, glassMat); gL.position.set(-1.75, 1.65, -0.95);
        var gR = new THREE.Mesh(glassGeo, glassMat); gR.position.set(1.75, 1.65, -0.95);
        stageGroup.add(gL, gR);

        this.emBar = new THREE.Mesh(
          new THREE.BoxGeometry(1.16, 1, 0.9),
          new THREE.MeshStandardMaterial({ color: 0xC01D2E, emissive: 0xC01D2E, emissiveIntensity: 0.22, roughness: 0.25, metalness: 0.2 })
        );
        this.emBar.castShadow = true;
        this.ahBar = new THREE.Mesh(
          new THREE.BoxGeometry(1.16, 1, 0.9),
          new THREE.MeshStandardMaterial({ color: 0x6B8E77, emissive: 0x6B8E77, emissiveIntensity: 0.25, roughness: 0.22, metalness: 0.35 })
        );
        this.ahBar.castShadow = true;
        stageGroup.add(this.emBar, this.ahBar);

        this.emH = 2.6; this.ahH = 0.45;
        var lPlaque = createFloatingPlaque("EMISIONES CO2", "IMPACTO / COSTO", 2.4, 0.72, "#14212B", "#FFFFFF", COL.nexo);
        lPlaque.position.set(-1.75, 3.45, -0.95);
        var rPlaque = createFloatingPlaque("AHORRO Y BONOS", "RENTABILIDAD", 2.4, 0.72, "#14212B", "#FFFFFF", COL.verde);
        rPlaque.position.set(1.75, 3.45, -0.95);
        stageGroup.add(lPlaque, rPlaque);

        var xs = [-2.48, 0, 2.48];
        this.levers = this.v.palancas.map(function (p, i) {
          var g = new THREE.Group();
          g.position.set(xs[i], 0.28, 1.9);
          g.rotation.x = 0.38;

          var base = new THREE.Mesh(
            new THREE.ExtrudeGeometry(roundedBoxShape(2.15, 1.15, 0.16), { depth: 0.24, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 }),
            new THREE.MeshStandardMaterial({ color: 0xFFFDF9, roughness: 0.25, metalness: 0.08 })
          );
          base.rotation.x = Math.PI / 2;
          base.position.y = 0.24; base.castShadow = true; base.receiveShadow = true;
          g.add(base);

          var face = new THREE.Mesh(
            new THREE.PlaneGeometry(2.02, 1.02),
            new THREE.MeshBasicMaterial({ map: makeCardTexture(p.icon, p.label, p.color), toneMapped: false })
          );
          face.rotation.x = -Math.PI / 2;
          face.position.y = 0.29;
          g.add(face);

          var pivot = new THREE.Group();
          pivot.position.set(0.75, 0.3, -0.36);
          var arm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.44, 10), new THREE.MeshStandardMaterial({ color: 0x6C7A86, metalness: 0.8, roughness: 0.2 }));
          arm.position.y = 0.22;
          var knobMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(p.color), emissive: 0x000000, roughness: 0.25, metalness: 0.3 });
          var knob = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 14), knobMat);
          knob.position.y = 0.44;
          pivot.add(arm, knob);
          pivot.rotation.x = -0.48;
          g.add(pivot);

          var hit = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.0, 1.3), ghostMat());
          hit.position.y = 0.35;
          g.add(hit);

          var obj = { data: p, group: g, pivot: pivot, knobMat: knobMat, hitMesh: hit, active: false, hovered: false };
          g.traverse(function (c) { c.userData.leverRef = obj; });
          stageGroup.add(g);
          return obj;
        });

        elProg.textContent = "0 / 3 palancas";
        setPie("<strong>" + this.v.subtitulo + ":</strong> Activá los 3 interruptores 3D para transformar emisiones en rentabilidad.");
      },
      onDown: function () {
        if (won) return;
        raycaster.setFromCamera(pointerNDC, camera);
        var hits = raycaster.intersectObjects(this.levers.map(function (l) { return l.group; }), true);
        if (!hits.length) return;
        var lv = hits[0].object.userData.leverRef;
        if (lv && !lv.active) {
          lv.active = true;
          lv.knobMat.emissive.set(lv.data.color);
          lv.knobMat.emissiveIntensity = 0.85;
          spawnBurst3D(lv.group.position.clone().setY(0.65), lv.data.color, 16);
          var n = this.levers.filter(function (k) { return k.active; }).length;
          elProg.textContent = n + " / 3 palancas";
          showHover(lv.data.label + " activado (" + n + "/3)");
          if (n === 3) win("¡Rentabilidad verde desbloqueada!", this.v.norma, this.v.sabias);
        }
      },
      onMove: function () {
        raycaster.setFromCamera(pointerNDC, camera);
        var hits = raycaster.intersectObjects(this.levers.map(function (l) { return l.group; }), true);
        var lv = hits.length ? hits[0].object.userData.leverRef : null;
        this.levers.forEach(function (l) { l.hovered = (l === lv && !l.active); });
        canvas.classList.toggle("clickeable", !!(lv && !lv.active));
        if (lv) showHover(lv.active ? (lv.data.label + " (activo)") : ("Activar palanca: " + lv.data.label));
        else hideHover();
      },
      onUp: function () {},
      forceWin: function () {
        this.levers.forEach(function (l) {
          l.active = true; l.knobMat.emissive.set(l.data.color); l.knobMat.emissiveIntensity = 0.85;
        });
        elProg.textContent = "3 / 3 palancas";
        win("¡Rentabilidad verde desbloqueada!", this.v.norma, this.v.sabias);
      },
      tick: function () {
        var n = this.levers.filter(function (k) { return k.active; }).length;
        var targetEm = Math.max(0.35, 2.6 - n * 0.75);
        var targetAh = 0.45 + n * 0.75;
        this.emH += (targetEm - this.emH) * 0.12;
        this.ahH += (targetAh - this.ahH) * 0.12;
        this.emBar.scale.y = this.emH; this.emBar.position.set(-1.75, 0.25 + this.emH / 2, -0.95);
        this.ahBar.scale.y = this.ahH; this.ahBar.position.set(1.75, 0.25 + this.ahH / 2, -0.95);

        this.levers.forEach(function (l) {
          var tRot = l.active ? 0.55 : -0.48;
          l.pivot.rotation.x += (tRot - l.pivot.rotation.x) * 0.18;
          var ty = l.hovered ? 0.42 : 0.28;
          l.group.position.y += (ty - l.group.position.y) * 0.18;
        });
      }
    };

    /* =======================================================================
       5. DESTINO SEGURO (3 contenedores industriales 3D · BUG CORREGIDO!)
       ======================================================================= */
    var ctrlResiduos = makeDragAndClickHandlers({
      targetKey: "destRef",
      getTargets: function (self) { return self.dests; },
      isFilled: function (d) { return !!d.filled; },
      tryPlace: function (self, m, d) {
        if (m.data.destino !== d.id) {
          shakeAmt = 0.28;
          spawnBurst3D(d.pos.clone().setY(1.0), COL.nexo, 16);
          showToast("Ese destino mezclaría corrientes y genera pasivos ambientales.");
          m.target.copy(m.home);
          return;
        }
        d.filled = true; m.locked = true;
        m.target.set(d.pos.x, 0.26, d.pos.z + 0.55);
        spawnBurst3D(d.pos.clone().setY(1.0), d.color, 18);
        var n = self.dests.filter(function (k) { return k.filled; }).length;
        elProg.textContent = n + " / 3 clasificados";
        if (n === 3) win("¡Residuos trazados sin pasivos!", self.v.norma, self.v.sabias);
      }
    });

    var expResiduos = {
      id: "residuos", tipo: "puzzle", nombre: "Destino Seguro", categoria: "AMBIENTE Y ECONOMÍA CIRCULAR",
      v: null, dests: [], modules: [], dragging: null, selectedMod: null, tether: null,
      init: function (vi) {
        this.v = pick(DATA.RESIDUOS, vi);
        this.selectedMod = null; this.dragging = null;
        camBase.set(0, 7.6, 11.2); camLook.set(0, 0.45, 0.25);
        var dxs = [-2.55, 0, 2.55];

        this.dests = this.v.destinos.map(function (d, i) {
          var pos = new THREE.Vector3(dxs[i], 0, -0.95);
          var g = new THREE.Group();
          g.position.copy(pos);
          var mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(d.color), roughness: 0.3, metalness: 0.32 });
          var body;
          if (i === 0) {
            body = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 1.05, 20), mat);
            body.position.y = 0.52;
            var rib = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.04, 8, 22), new THREE.MeshStandardMaterial({ color: 0x1F303E, metalness: 0.6, roughness: 0.3 }));
            rib.rotation.x = Math.PI / 2; rib.position.y = 0.52; g.add(rib);
          } else if (i === 1) {
            body = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.58, 0.95, 6), mat);
            body.position.y = 0.48;
          } else {
            body = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.88, 24), mat);
            body.position.y = 0.44;
            var water = new THREE.Mesh(new THREE.CircleGeometry(0.68, 24), new THREE.MeshStandardMaterial({ color: 0x7EB7C9, roughness: 0.15, metalness: 0.2 }));
            water.rotation.x = -Math.PI / 2; water.position.y = 0.89; g.add(water);
          }
          body.castShadow = true; body.receiveShadow = true;
          g.add(body);

          var badge = makeBadgeTexture(d.icon, d.label, d.color, true);
          var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: badge, transparent: true, toneMapped: false }));
          sp.scale.set(2.05, 1.54, 1);
          sp.position.set(0, 1.85, 0);
          g.add(sp);

          var haloMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(d.color), transparent: true, opacity: 0.28, side: THREE.DoubleSide });
          var halo = new THREE.Mesh(new THREE.RingGeometry(0.86, 1.12, 32), haloMat);
          halo.rotation.x = -Math.PI / 2; halo.position.y = 0.03; g.add(halo);

          var hitCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 1.9, 14), ghostMat());
          hitCyl.position.y = 0.95; g.add(hitCyl);

          var destObj = { id: d.id, label: d.label, color: d.color, pos: pos, group: g, halo: halo, haloMat: haloMat, filled: false };
          g.traverse(function (c) { c.userData.destRef = destObj; });
          stageGroup.add(g);
          return destObj;
        });

        var xs = [-2.5, 0, 2.5];
        this.modules = shuffle(this.v.items).map(function (it, i) {
          return create3DModule(it, new THREE.Vector3(xs[i], 0.26, 2.05), { w: 2.08, d: 1.02 });
        });
        this.tether = createDragTether();
        elProg.textContent = "0 / 3 clasificados";
        setPie("<strong>" + this.v.subtitulo + ":</strong> Clasificá cada corriente en su contenedor 3D (arrastrá o hacé clic).");
      },
      selectMod: ctrlResiduos.selectMod,
      onDown: ctrlResiduos.onDown,
      onMove: ctrlResiduos.onMove,
      onUp: ctrlResiduos.onUp,
      forceWin: function () {
        var self = this;
        this.dests.forEach(function (d) {
          d.filled = true;
          var m = self.modules.find(function (k) { return k.data.destino === d.id; });
          if (m) { m.target.set(d.pos.x, 0.26, d.pos.z + 0.55); m.locked = true; }
        });
        elProg.textContent = "3 / 3 clasificados";
        win("¡Residuos trazados sin pasivos!", this.v.norma, this.v.sabias);
      },
      tick: function (t) {
        animateModules(this.modules, t);
        ctrlResiduos.tickTether.call(this);
        this.dests.forEach(function (d, i) {
          var sc = 1 + Math.sin(t * 0.004 + i) * 0.07;
          d.halo.scale.set(sc, sc, 1);
        });
      }
    };

    /* =======================================================================
       6. EQUIPÁ LA MANIOBRA (Escudo metálico 3D flotante + EPP)
       ======================================================================= */
    var ctrlEPP = makeDragAndClickHandlers({
      targetKey: "socketRef",
      getTargets: function (self) { return self.slots; },
      isFilled: function (s) { return !!s.filled; },
      tryPlace: function (self, m, s) {
        if (!m.data.seguro) {
          shakeAmt = 0.28;
          spawnBurst3D(s.pos.clone().setY(0.5), COL.nexo, 16);
          showToast(m.data.aviso || "Ese elemento no cumple la norma.");
          m.target.copy(m.home);
          return;
        }
        m.target.copy(s.pos); m.locked = true; s.filled = m;
        spawnBurst3D(s.pos.clone().setY(0.45), m.data.color, 18);
        var n = self.slots.filter(function (k) { return k.filled; }).length;
        elProg.textContent = n + " / 2 EPP";
        if (n === 2) {
          self.shieldMat.color.set(COL.verde);
          self.shieldMat.emissive.set(COL.verde);
          self.shieldMat.emissiveIntensity = 0.25;
          win("¡Maniobra habilitada con seguridad!", self.v.norma, self.v.sabias);
        }
      }
    });

    var expEPP = {
      id: "epp", tipo: "puzzle", nombre: "Equipá la Maniobra", categoria: "PREVENCIÓN EN CAMPO",
      v: null, slots: [], modules: [], dragging: null, selectedMod: null, tether: null, shieldGroup: null, shieldMat: null,
      init: function (vi) {
        this.v = pick(DATA.EPP, vi);
        this.selectedMod = null; this.dragging = null;
        camBase.set(0, 7.5, 11.2); camLook.set(0, 0.45, 0.3);

        var sh = new THREE.Shape();
        sh.moveTo(0, 1.3); sh.lineTo(1.1, 0.82); sh.lineTo(1.1, -0.2);
        sh.quadraticCurveTo(1.1, -1.0, 0, -1.35);
        sh.quadraticCurveTo(-1.1, -1.0, -1.1, -0.2);
        sh.lineTo(-1.1, 0.82); sh.closePath();

        this.shieldMat = new THREE.MeshStandardMaterial({ color: 0x2A4154, roughness: 0.25, metalness: 0.48 });
        var shieldMesh = new THREE.Mesh(
          new THREE.ExtrudeGeometry(sh, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 3 }),
          this.shieldMat
        );
        shieldMesh.rotation.x = -Math.PI * 0.34;
        shieldMesh.castShadow = true; shieldMesh.receiveShadow = true;

        this.shieldGroup = new THREE.Group();
        this.shieldGroup.position.set(0, 0.65, -0.8);
        this.shieldGroup.add(shieldMesh);

        var pl = createFloatingPlaque(this.v.tarea, this.v.subtitulo, 2.35, 0.72, "#14212B", "#FFFFFF", COL.verde);
        pl.rotation.x = -Math.PI * 0.22;
        pl.position.set(0, 0.9, 0.3);
        this.shieldGroup.add(pl);
        stageGroup.add(this.shieldGroup);

        var slotPos = [new THREE.Vector3(-2.35, 0.18, -0.65), new THREE.Vector3(2.35, 0.18, -0.65)];
        this.slots = this.v.slots.map(function (s, idx) {
          var sock = createMagneticSocket3D(slotPos[idx], s.label, idx === 0 ? COL.ocre : COL.verde);
          sock.acepta = s.acepta;
          return sock;
        });

        var xs = [-2.5, 0, 2.5];
        this.modules = shuffle(this.v.piezas).map(function (p, i) {
          return create3DModule(p, new THREE.Vector3(xs[i], 0.26, 2.05), { w: 2.08, d: 1.02 });
        });
        this.tether = createDragTether();
        elProg.textContent = "0 / 2 EPP";
        setPie("<strong>" + this.v.subtitulo + ":</strong> Equipá los 2 EPP certificados (arrastrá o hacé clic).");
      },
      selectMod: ctrlEPP.selectMod,
      onDown: ctrlEPP.onDown,
      onMove: ctrlEPP.onMove,
      onUp: ctrlEPP.onUp,
      forceWin: function () {
        var self = this;
        this.slots.forEach(function (s, i) {
          var m = self.modules.find(function (k) { return k.data.id === s.acepta; }) || self.modules.filter(function (k) { return k.data.seguro; })[i];
          if (m) { m.target.copy(s.pos); m.locked = true; s.filled = m; }
        });
        this.shieldMat.color.set(COL.verde);
        elProg.textContent = "2 / 2 EPP";
        win("¡Maniobra habilitada con seguridad!", this.v.norma, this.v.sabias);
      },
      tick: function (t) {
        animateModules(this.modules, t, this.slots);
        ctrlEPP.tickTether.call(this);
        this.shieldGroup.rotation.y = Math.sin(t * 0.0014) * 0.14 + pointerNDC.x * 0.2;
      }
    };

    /* =======================================================================
       7. UNIVERSO NODAL 360° (Globo + N 3D + 10 planetas con etiquetas claras)
       ======================================================================= */
    var expUniverso = {
      id: "universo", tipo: "explorar", nombre: "Universo Nodal 360°", categoria: "EXPLORACIÓN 360°",
      universeGroup: null, globe: null, planets: [], hitRoots: [], selected: 0, hovered: -1,
      rotY: 0, rotX: 0.16, dragLast: null, velY: 0.0036, velX: 0, satGroup: null,
      init: function () {
        this.selected = 0; this.hovered = -1;
        this.rotY = 0; this.rotX = 0.16; this.velY = 0.0036; this.velX = 0;
        camBase.set(0, 0.5, 13.0); camLook.set(0, -0.05, 0);
        gridHelper.visible = false;
        if (wrap) wrap.classList.add("modo-cosmos");

        this.universeGroup = new THREE.Group();
        stageGroup.add(this.universeGroup);

        this.globe = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.5, 1),
          new THREE.MeshBasicMaterial({ color: 0x6B8E77, wireframe: true, transparent: true, opacity: 0.34 })
        );
        this.universeGroup.add(this.globe);

        // Isotipo N 3D en el núcleo
        var nGroup = new THREE.Group();
        var colP = new THREE.MeshStandardMaterial({ color: 0x6B8E77, roughness: 0.25, metalness: 0.5 });
        var colO = new THREE.MeshStandardMaterial({ color: 0xC38B42, roughness: 0.25, metalness: 0.5 });
        var colR = new THREE.MeshStandardMaterial({ color: 0xC01D2E, emissive: 0xC01D2E, emissiveIntensity: 0.35, roughness: 0.25 });
        var colA = new THREE.MeshStandardMaterial({ color: 0x8BA5B8, roughness: 0.25, metalness: 0.65 });

        var leftCol = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.35, 14), colO); leftCol.position.set(-0.55, 0, 0);
        var rightCol = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.35, 14), colA); rightCol.position.set(0.55, 0, 0);
        var diag = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 1.72, 14), colO); diag.rotation.z = Math.atan2(1.1, 1.35);

        [[-0.55, 0.68, colO], [-0.55, -0.68, colP], [0.55, 0.68, colA], [0.55, -0.68, colA], [0, 0, colR]].forEach(function (pt, idx) {
          var sp = new THREE.Mesh(new THREE.SphereGeometry(idx === 4 ? 0.16 : 0.18, 18, 18), pt[2]);
          sp.position.set(pt[0], pt[1], 0); nGroup.add(sp);
        });
        nGroup.add(leftCol, rightCol, diag);
        this.universeGroup.add(nGroup);

        var total = DATA.UNIVERSO_360.length;
        var R = 3.0;
        var self = this;
        this.planets = [];
        this.hitRoots = [];

        DATA.UNIVERSO_360.forEach(function (s, i) {
          var phi = Math.acos(1 - 2 * (i + 0.5) / total);
          var theta = Math.PI * (1 + Math.sqrt(5)) * i;
          var pos = new THREE.Vector3(
            R * Math.sin(phi) * Math.cos(theta),
            R * Math.cos(phi) * 0.68,
            R * Math.sin(phi) * Math.sin(theta)
          );

          var pg = new THREE.Group();
          pg.position.copy(pos);

          var sphereMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(s.color), emissive: new THREE.Color(s.color), emissiveIntensity: 0.3,
            roughness: 0.2, metalness: 0.45
          });
          var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.28, 22, 22), sphereMat);
          pg.add(sphere);

          var ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.41, 0.03, 10, 28),
            new THREE.MeshBasicMaterial({ color: new THREE.Color(s.color), transparent: true, opacity: 0.68 })
          );
          ring.rotation.x = Math.PI * 0.35; ring.rotation.y = i * 0.5;
          pg.add(ring);

          // Etiqueta limpia flotando ENCIMA de la esfera (sin taparla)
          var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: makePlanetLabelTexture(s.icon, s.corto, s.color),
            transparent: true, toneMapped: false
          }));
          sprite.center.set(0.5, 0);
          sprite.scale.set(1.78, 0.48, 1);
          sprite.position.set(0, 0.42, 0);
          pg.add(sprite);

          var lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), pos]);
          var lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color(s.color), transparent: true, opacity: 0.32 });
          self.universeGroup.add(new THREE.Line(lineGeo, lineMat));

          var hit = new THREE.Mesh(new THREE.SphereGeometry(0.68, 10, 10), ghostMat());
          pg.add(hit);

          var plObj = { idx: i, data: s, group: pg, sphere: sphere, sphereMat: sphereMat, ring: ring, lineMat: lineMat, basePos: pos };
          pg.traverse(function (c) { c.userData.planetRef = plObj; });
          self.hitRoots.push(pg);
          self.universeGroup.add(pg);
          self.planets.push(plObj);
        });

        this.satGroup = new THREE.Group();
        this.universeGroup.add(this.satGroup);
        this.selectPlanet(0, false);
        elProg.textContent = "Arrastrá y clic en nodo 3D";
      },
      selectPlanet: function (idx, fx) {
        this.selected = idx;
        var p = this.planets[idx];
        var s = p.data;
        if (fx) spawnBurst3D(p.group.getWorldPosition(new THREE.Vector3()), s.color, 16);

        setSubs(s.subs || []);
        while (this.satGroup.children.length) {
          var ch = this.satGroup.children[0];
          disposeNode(ch);
          this.satGroup.remove(ch);
        }
        this.satGroup.position.copy(p.basePos);
        var count = (s.subs || []).length;
        for (var i = 0; i < count; i++) {
          var a = (i / count) * Math.PI * 2;
          var sat = new THREE.Mesh(new THREE.OctahedronGeometry(0.085, 0), new THREE.MeshBasicMaterial({ color: 0xFAF7F3 }));
          sat.position.set(Math.cos(a) * 0.68, Math.sin(a) * 0.22, Math.sin(a) * 0.68);
          this.satGroup.add(sat);
        }

        var nextBtn = exploreReady ? ' <button type="button" class="motor-next-inline" data-inline-next>Siguiente →</button>' : "";
        setPie(
          '<div class="uni-card"><div class="uni-card__top"><strong style="color:' + s.color + '">' + s.corto + '</strong>' + nextBtn + '</div>'
          + '<p><em>¿Sabías que...?</em> ' + s.sabias + ' <strong>' + s.ayuda + '</strong></p></div>'
        );
        var bn = elPie && elPie.querySelector("[data-inline-next]");
        if (bn) bn.addEventListener("click", nextRandom);
      },
      onExploreReady: function () { this.selectPlanet(this.selected, false); },
      onDown: function () {
        raycaster.setFromCamera(pointerNDC, camera);
        var hits = raycaster.intersectObjects(this.hitRoots, true);
        if (hits.length) {
          var pl = hits[0].object.userData.planetRef;
          if (pl) {
            this.selectPlanet(pl.idx, true);
            showHover("Servicio: " + pl.data.corto);
            return;
          }
        }
        this.dragLast = { x: pointerNDC.x, y: pointerNDC.y };
        canvas.classList.add("arrastrando");
      },
      onMove: function () {
        if (this.dragLast) {
          var dx = pointerNDC.x - this.dragLast.x;
          var dy = pointerNDC.y - this.dragLast.y;
          this.velY = dx * 2.2;
          this.velX = -dy * 1.4;
          this.rotY += this.velY;
          this.rotX = Math.max(-0.85, Math.min(0.85, this.rotX + this.velX));
          this.dragLast = { x: pointerNDC.x, y: pointerNDC.y };
          return;
        }
        raycaster.setFromCamera(pointerNDC, camera);
        var hits = raycaster.intersectObjects(this.hitRoots, true);
        var pl = hits.length ? hits[0].object.userData.planetRef : null;
        this.hovered = pl ? pl.idx : -1;
        canvas.classList.toggle("clickeable", !!pl);
        if (pl) showHover("Clic para explorar: " + pl.data.corto);
        else hideHover();
      },
      onUp: function () { this.dragLast = null; canvas.classList.remove("arrastrando"); },
      forceWin: function () { exploreReady = true; this.selectPlanet(this.selected, false); },
      tick: function (t) {
        if (!this.dragLast) {
          this.velY += (0.0035 - this.velY) * 0.04;
          this.rotY += this.velY;
          var targetRX = pointerInside ? pointerNDC.y * 0.32 : 0.16;
          this.rotX += (targetRX - this.rotX) * 0.05;
        }
        this.universeGroup.rotation.y = this.rotY;
        this.universeGroup.rotation.x = this.rotX;
        this.globe.rotation.y = -t * 0.0005;
        this.satGroup.rotation.y = t * 0.0022;

        var self = this;
        this.planets.forEach(function (p) {
          var act = p.idx === self.selected;
          var hov = p.idx === self.hovered;
          var ts = act ? 1.38 : (hov ? 1.24 : 1.0);
          p.sphere.scale.lerp(new THREE.Vector3(ts, ts, ts), 0.16);
          p.sphereMat.emissiveIntensity = act ? 0.85 : (hov ? 0.55 : 0.26);
          p.lineMat.opacity = act ? 0.88 : 0.26;
          p.ring.rotation.z = t * 0.0018 + p.idx;
        });
      }
    };

    /* =======================================================================
       8. DRON NODAL EN PLANTA (Cuadricóptero 3D + cinta/oleoducto/botellas)
       ======================================================================= */
    var expDron = {
      id: "dron", tipo: "explorar", nombre: "Dron en Planta", categoria: "INSPECCIÓN EN VIVO",
      v: null, droneGroup: null, dronePos: new THREE.Vector3(0, 2.2, 0.2),
      rotors: [], beacons: [], propsMoving: [], activeIdx: 0, scanConeMat: null,
      init: function (vi) {
        this.v = pick(DATA.DRON_ESCENARIOS, vi);
        camBase.set(0, 7.6, 10.6); camLook.set(0, 0.45, 0.1);
        this.activeIdx = 0;
        this.dronePos.set(0, 2.25, 0.15);
        this.propsMoving = []; this.rotors = [];

        var belt = new THREE.Mesh(
          new THREE.BoxGeometry(8.2, 0.24, 1.75),
          new THREE.MeshStandardMaterial({ color: 0x2A4154, roughness: 0.35, metalness: 0.45 })
        );
        belt.position.set(0, 0.14, 0.25); belt.receiveShadow = true; belt.castShadow = true;
        stageGroup.add(belt);

        var tipo = this.v.tipo;
        for (var i = 0; i < 6; i++) {
          var px = -3.6 + i * 1.44;
          var item;
          if (tipo === "cajas") {
            item = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.52, 0.68), new THREE.MeshStandardMaterial({ color: 0xC38B42, roughness: 0.55, metalness: 0.05 }));
            item.position.set(px, 0.52, 0.25);
          } else if (tipo === "oleoducto") {
            item = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.09, 10, 20), new THREE.MeshStandardMaterial({ color: 0x6B8E77, roughness: 0.25, metalness: 0.65 }));
            item.rotation.y = Math.PI / 2; item.position.set(px, 0.65, 0.25);
          } else {
            item = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.62, 14), new THREE.MeshStandardMaterial({ color: 0x7EB7C9, transparent: true, opacity: 0.85, roughness: 0.12, metalness: 0.25 }));
            item.position.set(px, 0.57, 0.25);
          }
          item.castShadow = true; stageGroup.add(item); this.propsMoving.push(item);
        }
        if (tipo === "oleoducto") {
          var pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 8.2, 20), new THREE.MeshStandardMaterial({ color: 0x6C7A86, roughness: 0.24, metalness: 0.78 }));
          pipe.rotation.z = Math.PI / 2; pipe.position.set(0, 0.65, 0.25); pipe.castShadow = true; stageGroup.add(pipe);
        }

        var bxs = [-2.55, 0, 2.55], bzs = [-1.15, 1.45, -1.05];
        this.beacons = this.v.puntos.map(function (pt, idx) {
          var p = new THREE.Vector3(bxs[idx], 0, bzs[idx]);
          var col = new THREE.Color(pt.color);
          var ped = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.4, 0.22, 16), new THREE.MeshStandardMaterial({ color: 0x1F303E, metalness: 0.4, roughness: 0.3 }));
          ped.position.set(p.x, 0.11, p.z);
          var gemMat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.55, roughness: 0.2, metalness: 0.4 });
          var gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), gemMat);
          gem.position.set(p.x, 0.62, p.z); gem.castShadow = true;
          var pl = createFloatingPlaque(pt.titulo, null, 2.2, 0.6, "#14212B", "#FFFFFF", pt.color);
          pl.rotation.x = -Math.PI * 0.22; pl.position.set(p.x, 1.18, p.z);
          stageGroup.add(ped, gem, pl);
          return { data: pt, pos: p, gem: gem, gemMat: gemMat };
        });

        this.droneGroup = new THREE.Group();
        this.droneGroup.position.copy(this.dronePos);
        var body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.18, 0.62), new THREE.MeshStandardMaterial({ color: 0x1F303E, roughness: 0.25, metalness: 0.55 }));
        body.castShadow = true; this.droneGroup.add(body);
        var led = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), new THREE.MeshBasicMaterial({ color: 0x6B8E77 }));
        led.position.y = -0.1; this.droneGroup.add(led);

        this.scanConeMat = new THREE.MeshBasicMaterial({ color: 0x6B8E77, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false });
        var cone = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.1, 20, 1, true), this.scanConeMat);
        cone.position.y = -1.15; this.droneGroup.add(cone);

        var self = this;
        [[-0.48, -0.48], [0.48, -0.48], [-0.48, 0.48], [0.48, 0.48]].forEach(function (ar) {
          var arm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.72, 8), new THREE.MeshStandardMaterial({ color: 0x6C7A86, metalness: 0.7 }));
          arm.rotation.z = Math.PI / 2; arm.rotation.y = Math.atan2(ar[1], ar[0]); arm.position.set(ar[0] * 0.5, 0.04, ar[1] * 0.5);
          var rot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.02, 14), new THREE.MeshBasicMaterial({ color: 0xC38B42, transparent: true, opacity: 0.55 }));
          rot.position.set(ar[0], 0.12, ar[1]); self.droneGroup.add(arm, rot); self.rotors.push(rot);
        });
        stageGroup.add(this.droneGroup);

        this.updateFooter();
        elProg.textContent = "Mové el dron 3D";
      },
      updateFooter: function () {
        var pt = this.v.puntos[this.activeIdx];
        var nextBtn = exploreReady ? ' <button type="button" class="motor-next-inline" data-inline-next>Siguiente →</button>' : "";
        setPie('<div class="uni-card"><div class="uni-card__top"><strong>' + this.v.nombre + ' · ' + pt.titulo + '</strong>' + nextBtn + '</div><p>' + pt.dato + '</p></div>');
        var bn = elPie && elPie.querySelector("[data-inline-next]");
        if (bn) bn.addEventListener("click", nextRandom);
      },
      onExploreReady: function () { this.updateFooter(); },
      onDown: function () {},
      onMove: function () { canvas.classList.add("clickeable"); showHover("Mové el cursor para volar el dron sobre la línea"); },
      onUp: function () {},
      forceWin: function () { exploreReady = true; this.updateFooter(); },
      tick: function (t) {
        this.propsMoving.forEach(function (pm) { pm.position.x += 0.018; if (pm.position.x > 4.2) pm.position.x = -4.2; });
        var tx = pointerInside ? pointerNDC.x * 3.4 : Math.sin(t * 0.0009) * 2.5;
        var tz = pointerInside ? -pointerNDC.y * 1.8 : Math.cos(t * 0.0011) * 0.9;
        var vx = (tx - this.dronePos.x) * 0.08;
        var vz = (tz - this.dronePos.z) * 0.08;
        this.dronePos.x += vx; this.dronePos.z += vz; this.dronePos.y = 2.2 + Math.sin(t * 0.004) * 0.08;
        this.droneGroup.position.copy(this.dronePos);
        this.droneGroup.rotation.z = Math.max(-0.35, Math.min(0.35, -vx * 2.2));
        this.droneGroup.rotation.x = Math.max(-0.35, Math.min(0.35, vz * 2.2));
        this.rotors.forEach(function (r) { r.rotation.y += 0.5; });

        var best = this.activeIdx, minD = 99, dp = this.dronePos;
        this.beacons.forEach(function (b, idx) {
          b.gem.rotation.y = t * 0.002 + idx;
          b.gem.position.y = 0.62 + Math.sin(t * 0.003 + idx) * 0.08;
          var d = Math.hypot(dp.x - b.pos.x, dp.z - b.pos.z);
          if (d < 1.85 && d < minD) { minD = d; best = idx; }
        });
        if (best !== this.activeIdx) {
          this.activeIdx = best;
          this.scanConeMat.color.set(this.beacons[best].data.color);
          spawnShockwave3D(this.beacons[best].pos.clone().setY(0.25), this.beacons[best].data.color);
          this.updateFooter();
        }
      }
    };

    /* =======================================================================
       9. CONECTAR LA X (4 bloques 3D hacia sus conectores centrales)
       ======================================================================= */
    var ctrlSnap = makeDragAndClickHandlers({
      targetKey: "socketRef",
      getTargets: function (self) { return self.slots; },
      isFilled: function (s) { return !!s.filled; },
      tryPlace: function (self, m, s) {
        if (m.targetSlot !== s) {
          shakeAmt = 0.2;
          spawnBurst3D(s.pos.clone().setY(0.45), COL.nexo, 10);
          showToast("Cada disciplina va en su propio puerto del núcleo.");
          m.target.copy(m.home);
          return;
        }
        m.locked = true; m.target.copy(s.pos); s.filled = m;
        var bm = self.beams.find(function (b) { return b.id === m.data.id; });
        if (bm) bm.mat.opacity = 0.95;
        spawnBurst3D(s.pos.clone().setY(0.45), m.data.color, 18);
        var n = self.modules.filter(function (k) { return k.locked; }).length;
        elProg.textContent = n + " / 4 nodos";
        if (n === 4) win("¡Red Nodal conectada en X!", self.v.norma, self.v.sabias);
      }
    });

    var expSnap = {
      id: "snap", tipo: "puzzle", nombre: "Conectar la X", categoria: "CONEXIÓN DE DISCIPLINAS",
      v: null, modules: [], slots: [], beams: [], dragging: null, selectedMod: null, tether: null, hub: null,
      init: function (vi) {
        this.v = pick(DATA.CAPSULAS_CLASICAS, vi);
        this.selectedMod = null; this.dragging = null;
        camBase.set(0, 8.2, 11.2); camLook.set(0, 0.25, 0.15);

        this.hub = new THREE.Mesh(
          new THREE.CylinderGeometry(0.82, 0.92, 0.45, 24),
          new THREE.MeshStandardMaterial({ color: 0x1F303E, roughness: 0.25, metalness: 0.5 })
        );
        this.hub.position.set(0, 0.22, 0); this.hub.castShadow = true; stageGroup.add(this.hub);

        var pl = createFloatingPlaque("SU NECESIDAD", "NÚCLEO CENTRAL", 2.2, 0.66, "#14212B", "#FFFFFF", COL.nexo);
        pl.rotation.x = -Math.PI * 0.3; pl.position.set(0, 0.72, 0.05); stageGroup.add(pl);

        var self = this;
        this.beams = []; this.slots = [];
        this.modules = CORNERS_3D.map(function (cn) {
          var sPos = new THREE.Vector3(cn.x * 0.45, 0.16, cn.z * 0.45);
          var ped = createMagneticSocket3D(sPos, cn.label, cn.color);
          ped.color = cn.color;
          self.slots.push(ped);

          var bCurve = new THREE.LineCurve3(new THREE.Vector3(0, 0.28, 0), sPos.clone().setY(0.28));
          var bMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(cn.color), emissive: new THREE.Color(cn.color), emissiveIntensity: 0.75, transparent: true, opacity: 0.18 });
          stageGroup.add(new THREE.Mesh(new THREE.TubeGeometry(bCurve, 4, 0.07, 8, false), bMat));
          self.beams.push({ id: cn.id, mat: bMat });

          var piece = { id: cn.id, icon: cn.id === "seg" ? "shield" : (cn.id === "amb" ? "recycle" : (cn.id === "per" ? "harness" : "motor")), label: cn.label, color: cn.color };
          var mod = create3DModule(piece, new THREE.Vector3(cn.x, 0.26, cn.z), { w: 2.05, d: 0.96, tiltX: 0.36 });
          mod.targetSlot = ped;
          return mod;
        });

        this.tether = createDragTether();
        elProg.textContent = "0 / 4 nodos";
        setPie("<strong>Integración Nodal:</strong> Arrastrá o clicá los 4 bloques hacia su puerto del núcleo central.");
      },
      selectMod: ctrlSnap.selectMod,
      onDown: ctrlSnap.onDown,
      onMove: ctrlSnap.onMove,
      onUp: ctrlSnap.onUp,
      forceWin: function () {
        var self = this;
        this.modules.forEach(function (m) {
          m.locked = true; m.target.copy(m.targetSlot.pos); m.targetSlot.filled = m;
          var bm = self.beams.find(function (b) { return b.id === m.data.id; });
          if (bm) bm.mat.opacity = 0.95;
        });
        elProg.textContent = "4 / 4 nodos";
        win("¡Red Nodal conectada en X!", this.v.norma, this.v.sabias);
      },
      tick: function (t) {
        animateModules(this.modules, t, this.slots);
        ctrlSnap.tickTether.call(this);
      }
    };

    /* =======================================================================
       10. PULSO MAGNÉTICO (12 cristales octaédricos 3D + anillo cursor)
       ======================================================================= */
    var expMagnet = {
      id: "magnet", tipo: "puzzle", nombre: "Pulso Magnético", categoria: "CONVERGENCIA",
      v: null, nodes: [], cursorRing: null, vortex: null,
      init: function (vi) {
        this.v = pick(DATA.CAPSULAS_CLASICAS, vi);
        camBase.set(0, 7.6, 10.2); camLook.set(0, 0.2, 0);

        this.vortex = new THREE.Mesh(
          new THREE.TorusGeometry(0.95, 0.08, 12, 36),
          new THREE.MeshStandardMaterial({ color: 0x1F303E, emissive: 0x6B8E77, emissiveIntensity: 0.45, roughness: 0.2, metalness: 0.65 })
        );
        this.vortex.rotation.x = Math.PI / 2; this.vortex.position.y = 0.18; stageGroup.add(this.vortex);

        this.cursorRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.68, 0.05, 10, 28),
          new THREE.MeshBasicMaterial({ color: 0xC38B42, transparent: true, opacity: 0.85 })
        );
        this.cursorRing.rotation.x = Math.PI / 2; this.cursorRing.position.y = 0.35; stageGroup.add(this.cursorRing);

        var cols = [COL.ocre, COL.verde, COL.petroleo, COL.nexo];
        this.nodes = [];
        for (var i = 0; i < 12; i++) {
          var a = (i / 12) * Math.PI * 2;
          var rad = 2.4 + (i % 3) * 0.42;
          var colHex = cols[i % cols.length];
          var mesh = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.28, 0),
            new THREE.MeshStandardMaterial({ color: new THREE.Color(colHex), emissive: new THREE.Color(colHex), emissiveIntensity: 0.28, roughness: 0.2, metalness: 0.55 })
          );
          mesh.position.set(Math.cos(a) * rad, 0.42, Math.sin(a) * rad * 0.72);
          mesh.castShadow = true; stageGroup.add(mesh);
          this.nodes.push({ mesh: mesh, vx: 0, vz: 0, color: colHex, anchored: false });
        }
        elProg.textContent = "0 / 12 al centro";
        setPie("<strong>Convergencia:</strong> Empujá los 12 cristales 3D con el anillo magnético hacia el vórtice central.");
      },
      onDown: function () {},
      onMove: function () { canvas.classList.add("clickeable"); showHover("Mové el anillo dorado detrás de cada cristal para empujarlo"); },
      onUp: function () {},
      forceWin: function () {
        this.nodes.forEach(function (n, i) {
          n.anchored = true;
          var a = (i / 12) * Math.PI * 2;
          n.mesh.position.set(Math.cos(a) * 0.45, 0.35, Math.sin(a) * 0.45);
        });
        elProg.textContent = "12 / 12 al centro";
        win("¡Equipo alineado en el mismo objetivo!", this.v.norma, this.v.sabias);
      },
      tick: function (t) {
        this.vortex.rotation.z = t * 0.002;
        var cx = 99, cz = 99;
        if (pointerInside) {
          raycaster.setFromCamera(pointerNDC, camera);
          if (raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.35), dragHit)) {
            cx = dragHit.x; cz = dragHit.z;
            this.cursorRing.position.set(cx, 0.35, cz);
            this.cursorRing.visible = true;
          }
        } else {
          this.cursorRing.visible = false;
        }
        var count = 0;
        this.nodes.forEach(function (n, idx) {
          n.mesh.rotation.y = t * 0.002 + idx;
          if (n.anchored) { count++; return; }
          if (pointerInside) {
            var dx = n.mesh.position.x - cx, dz = n.mesh.position.z - cz;
            var d = Math.hypot(dx, dz);
            if (d < 1.85 && d > 0.05) {
              var f = (1.85 - d) * 0.026;
              n.vx += (dx / d) * f; n.vz += (dz / d) * f;
            }
          }
          n.vx *= 0.9; n.vz *= 0.9;
          n.mesh.position.x = Math.max(-4.1, Math.min(4.1, n.mesh.position.x + n.vx));
          n.mesh.position.z = Math.max(-2.6, Math.min(2.6, n.mesh.position.z + n.vz));
          if (Math.hypot(n.mesh.position.x, n.mesh.position.z) < 0.98) {
            n.anchored = true;
            spawnBurst3D(n.mesh.position.clone(), n.color, 8);
            count++;
          }
        });
        if (!won) {
          elProg.textContent = count + " / 12 al centro";
          if (count === 12) win("¡Equipo alineado en el mismo objetivo!", this.v.norma, this.v.sabias);
        }
      }
    };

    /* =======================================================================
       11. TRAZAR EL RECORRIDO (4 portales 3D en secuencia)
       ======================================================================= */
    var expTrace = {
      id: "trace", tipo: "puzzle", nombre: "Trazar el Recorrido", categoria: "TRAZABILIDAD OPERATIVA",
      v: null, portals: [], tubes: [], step: 0,
      init: function (vi) {
        this.v = pick(DATA.CAPSULAS_CLASICAS, vi);
        camBase.set(0, 7.6, 10.6); camLook.set(0, 0.4, 0);
        this.step = 0; this.tubes = [];
        this.portals = CORNERS_3D.map(function (cn, i) {
          var p = new THREE.Vector3(cn.x * 0.76, 0.72, cn.z * 0.76);
          var col = new THREE.Color(cn.color);
          var torusMat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.3, roughness: 0.2, metalness: 0.5 });
          var torus = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.095, 14, 30), torusMat);
          torus.position.copy(p); torus.rotation.y = i % 2 === 0 ? 0.5 : -0.5; torus.castShadow = true;

          var pl = createFloatingPlaque((i + 1) + ". " + cn.label, null, 2.05, 0.58, "#14212B", "#FFFFFF", cn.color);
          pl.rotation.x = -Math.PI * 0.22; pl.position.set(p.x, 1.65, p.z);
          stageGroup.add(torus, pl);
          return { label: cn.label, pos: p, torus: torus, torusMat: torusMat, color: cn.color, lit: false };
        });

        for (var i = 0; i < 4; i++) {
          var a = this.portals[i].pos, b = this.portals[(i + 1) % 4].pos;
          var tMat = new THREE.MeshStandardMaterial({ color: 0x6B8E77, emissive: 0x6B8E77, emissiveIntensity: 0.65, transparent: true, opacity: 0.14 });
          stageGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(a, b), 6, 0.06, 8, false), tMat));
          this.tubes.push(tMat);
        }
        elProg.textContent = "Paso 1 de 4";
        setPie("<strong>Trazabilidad:</strong> Pasá el cursor o clicá los portales en orden del <strong>1</strong> al <strong>4</strong>.");
      },
      onDown: function () { this.checkCursor(); },
      onMove: function () {
        canvas.classList.add("clickeable");
        if (this.step < 4) showHover("Siguiente portal: " + (this.step + 1) + ". " + this.portals[this.step].label);
        this.checkCursor();
      },
      onUp: function () {},
      checkCursor: function () {
        if (won || !pointerInside) return;
        raycaster.setFromCamera(pointerNDC, camera);
        if (!raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.72), dragHit)) return;
        var tgt = this.portals[this.step];
        if (Math.hypot(dragHit.x - tgt.pos.x, dragHit.z - tgt.pos.z) < 1.25) {
          tgt.lit = true; tgt.torusMat.emissiveIntensity = 0.85;
          if (this.step > 0) this.tubes[this.step - 1].opacity = 0.92;
          spawnBurst3D(tgt.pos, tgt.color, 14);
          this.step++;
          if (this.step === 4) {
            this.tubes[3].opacity = 0.92;
            elProg.textContent = "4 / 4 completo";
            win("¡Ciclo de gestión cerrado en 3D!", this.v.norma, this.v.sabias);
          } else {
            elProg.textContent = "Paso " + (this.step + 1) + " de 4";
            showHover("¡Bien! Ahora pasá al " + (this.step + 1) + ". " + this.portals[this.step].label);
          }
        }
      },
      forceWin: function () {
        this.portals.forEach(function (p) { p.lit = true; p.torusMat.emissiveIntensity = 0.85; });
        this.tubes.forEach(function (t) { t.opacity = 0.92; });
        this.step = 4; elProg.textContent = "4 / 4 completo";
        win("¡Ciclo de gestión cerrado en 3D!", this.v.norma, this.v.sabias);
      },
      tick: function (t) {
        var self = this;
        this.portals.forEach(function (p, i) {
          var next = !won && i === self.step;
          var sc = next ? 1.16 + Math.sin(t * 0.008) * 0.08 : 1;
          p.torus.scale.set(sc, sc, sc);
          p.torus.rotation.z = t * 0.001 + i;
        });
      }
    };

    /* =======================================================================
       12. RADAR DE 4 FRENTES (Mesa holográfica 3D giratoria)
       ======================================================================= */
    var expRadar = {
      id: "radar", tipo: "puzzle", nombre: "Radar de 4 Frentes", categoria: "CONTROL PREVENTIVO",
      v: null, sweep: null, beacons: [], hitRoots: [],
      init: function (vi) {
        this.v = pick(DATA.CAPSULAS_CLASICAS, vi);
        camBase.set(0, 8.2, 10.6); camLook.set(0, 0.25, 0);

        var dish = new THREE.Mesh(
          new THREE.CylinderGeometry(2.65, 2.8, 0.22, 42),
          new THREE.MeshStandardMaterial({ color: 0x1F303E, roughness: 0.3, metalness: 0.45 })
        );
        dish.position.y = 0.11; dish.receiveShadow = true; dish.castShadow = true;
        stageGroup.add(dish);

        [0.95, 1.7, 2.45].forEach(function (rad) {
          var ring = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.025, 8, 42), new THREE.MeshBasicMaterial({ color: 0x6B8E77, transparent: true, opacity: 0.48 }));
          ring.rotation.x = Math.PI / 2; ring.position.y = 0.23; stageGroup.add(ring);
        });

        this.sweep = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 2.52, 0.04, 16, 1, false, 0, 0.55),
          new THREE.MeshBasicMaterial({ color: 0x6B8E77, transparent: true, opacity: 0.3 })
        );
        this.sweep.position.y = 0.25; stageGroup.add(this.sweep);

        var self = this;
        this.hitRoots = [];
        this.beacons = CORNERS_3D.map(function (cn, i) {
          var a = i * (Math.PI / 2) + 0.55;
          var pos = new THREE.Vector3(Math.cos(a) * 1.8, 0.22, Math.sin(a) * 1.8);
          var g = new THREE.Group();
          var col = new THREE.Color(cn.color);
          var gemMat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.55, roughness: 0.2, metalness: 0.45 });
          var gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), gemMat);
          gem.position.set(pos.x, 0.65, pos.z); gem.castShadow = true;

          var hit = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.4, 12), ghostMat());
          hit.position.set(pos.x, 0.75, pos.z);

          var pl = createFloatingPlaque(cn.label, null, 1.9, 0.56, "#14212B", "#FFFFFF", cn.color);
          pl.rotation.x = -Math.PI * 0.22; pl.position.set(pos.x, 1.32, pos.z);

          var bObj = { label: cn.label, pos: pos, gem: gem, gemMat: gemMat, color: cn.color, fixed: false };
          g.add(gem, hit, pl);
          g.traverse(function (c) { c.userData.beaconRef = bObj; });
          self.hitRoots.push(g);
          stageGroup.add(g);
          return bObj;
        });

        elProg.textContent = "0 / 4 focos";
        setPie("<strong>Control Preventivo:</strong> Hacé clic en los 4 cristales del radar 3D para estabilizar la planta.");
      },
      onDown: function () {
        if (won) return;
        raycaster.setFromCamera(pointerNDC, camera);
        var hits = raycaster.intersectObjects(this.hitRoots, true);
        if (!hits.length) return;
        var b = hits[0].object.userData.beaconRef;
        if (b && !b.fixed) {
          b.fixed = true;
          b.gemMat.color.set(COL.verde); b.gemMat.emissive.set(COL.verde); b.gemMat.emissiveIntensity = 0.85;
          spawnBurst3D(b.gem.position.clone(), b.color, 18);
          var n = this.beacons.filter(function (k) { return k.fixed; }).length;
          elProg.textContent = n + " / 4 focos";
          showHover("Frente estabilizado: " + b.label + " (" + n + "/4)");
          if (n === 4) win("¡Los 4 frentes bajo control!", this.v.norma, this.v.sabias);
        }
      },
      onMove: function () {
        raycaster.setFromCamera(pointerNDC, camera);
        var hits = raycaster.intersectObjects(this.hitRoots, true);
        var b = hits.length ? hits[0].object.userData.beaconRef : null;
        canvas.classList.toggle("clickeable", !!(b && !b.fixed));
        if (b) showHover(b.fixed ? (b.label + " estabilizado") : ("Clic para estabilizar: " + b.label));
        else hideHover();
      },
      onUp: function () {},
      forceWin: function () {
        this.beacons.forEach(function (b) { b.fixed = true; b.gemMat.color.set(COL.verde); });
        elProg.textContent = "4 / 4 focos";
        win("¡Los 4 frentes bajo control!", this.v.norma, this.v.sabias);
      },
      tick: function (t) {
        this.sweep.rotation.y = -t * 0.0022;
        this.beacons.forEach(function (b, idx) {
          b.gem.rotation.y = t * 0.0025 + idx;
          var sc = b.fixed ? 1.2 : 1 + Math.sin(t * 0.006 + idx) * 0.14;
          b.gem.scale.set(sc, sc, sc);
        });
      }
    };

    var ALL = [expCircuito, expShift, expProceso, expCarbono, expResiduos, expEPP, expUniverso, expDron, expSnap, expMagnet, expTrace, expRadar];

    function buildDeck() {
      deck = shuffle(ALL);
      deckPos = 0;
    }

    function loadExperience(exp, variantIdx) {
      if (exploreTimer) { clearTimeout(exploreTimer); exploreTimer = null; }
      clearStage();
      gridHelper.visible = true;
      if (wrap) wrap.classList.remove("modo-cosmos");
      canvas.classList.remove("clickeable", "arrastrando");

      currentExp = exp;
      won = false;
      exploreReady = false;
      if (elToast) elToast.classList.remove("visible");
      if (elPremio) elPremio.classList.remove("visible");
      if (elNombre) elNombre.textContent = exp.categoria + " · " + exp.nombre;

      currentVariant = typeof variantIdx === "number" ? variantIdx : Math.floor(Math.random() * 3);
      exp.init(currentVariant);
      camera.position.copy(camBase);
      camera.lookAt(camLook);

      if (exp.tipo === "explorar") {
        exploreTimer = setTimeout(function () {
          exploreReady = true;
          if (exp.onExploreReady) exp.onExploreReady();
        }, 8000);
      }
      if (opts.onChange) opts.onChange(exp);
    }

    function nextRandom() {
      if (deckPos >= deck.length) buildDeck();
      var next = deck[deckPos++];
      if (currentExp && next.id === currentExp.id && deck.length > 1) {
        next = deck[deckPos % deck.length];
        deckPos++;
      }
      loadExperience(next);
    }

    function updatePointerNDC(e) {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    canvas.addEventListener("pointerdown", function (e) {
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
      updatePointerNDC(e);
      downNDC.copy(pointerNDC);
      pointerDown = true; pointerInside = true;
      currentExp && currentExp.onDown();
    });
    canvas.addEventListener("pointermove", function (e) {
      updatePointerNDC(e);
      pointerInside = true;
      currentExp && currentExp.onMove();
    });
    canvas.addEventListener("pointerup", function () { pointerDown = false; currentExp && currentExp.onUp(); });
    canvas.addEventListener("pointerleave", function () {
      pointerInside = false; pointerDown = false;
      hideHover();
      currentExp && currentExp.onUp();
    });

    if (btnNextPremio) btnNextPremio.addEventListener("click", nextRandom);

    /* -----------------------------------------------------------------------
       EXPANSIÓN DE PANTALLA + REDIMENSIONADO DINÁMICO 3D
       ----------------------------------------------------------------------- */
    var isExpanded = false;
    var anchorNode = document.createComment("motor-anchor");
    var backdrop = document.querySelector(".motor-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "motor-backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      document.body.appendChild(backdrop);
    }

    function syncSize() {
      if (!wrap) return;
      var rect = wrap.getBoundingClientRect();
      if (rect.width > 40 && rect.height > 40) {
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(Math.round(rect.width), Math.round(rect.height), false);
      }
    }

    function setExpanded(flag) {
      flag = !!flag;
      if (isExpanded === flag) return;
      isExpanded = flag;
      if (flag) {
        if (root.parentNode) root.parentNode.insertBefore(anchorNode, root);
        document.body.appendChild(root);
      } else if (anchorNode.parentNode) {
        anchorNode.parentNode.replaceChild(root, anchorNode);
      }
      root.classList.toggle("expandido", flag);
      backdrop.classList.toggle("visible", flag);
      document.body.classList.toggle("con-motor-expandido", flag);
      if (btnExpandir) {
        btnExpandir.setAttribute("aria-expanded", flag ? "true" : "false");
        btnExpandir.setAttribute("aria-label", flag ? "Reducir pantalla" : "Expandir experiencia interactiva");
        btnExpandir.setAttribute("title", flag ? "Reducir pantalla" : "Expandir pantalla");
      }
      syncSize();
      requestAnimationFrame(syncSize);
    }

    if (btnExpandir) {
      btnExpandir.addEventListener("click", function () { setExpanded(!isExpanded); });
    }
    backdrop.addEventListener("click", function () { setExpanded(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isExpanded) {
        setExpanded(false);
        btnExpandir && btnExpandir.focus();
      }
    });
    window.addEventListener("resize", syncSize, { passive: true });
    if (window.ResizeObserver && wrap) {
      new window.ResizeObserver(syncSize).observe(wrap);
    }

    if (btnReclamar && opts.onClaim) {
      btnReclamar.addEventListener("click", function () {
        setExpanded(false);
        opts.onClaim(btnReclamar.getAttribute("data-diag-contexto") || "Quisiera coordinar el Diagnóstico Express Gratuito.");
      });
    }

    function loop(t) {
      var ox = pointerInside ? pointerNDC.x * camMouseScale.x : Math.sin((t || 0) * 0.0005) * 0.4;
      var oy = pointerInside ? pointerNDC.y * camMouseScale.y : 0;
      var sx = shakeAmt > 0.005 ? (Math.random() - 0.5) * shakeAmt : 0;
      var sy = shakeAmt > 0.005 ? (Math.random() - 0.5) * shakeAmt : 0;
      shakeAmt *= 0.85;

      camera.position.x += (camBase.x + ox + sx - camera.position.x) * 0.08;
      camera.position.y += (camBase.y + oy + sy - camera.position.y) * 0.08;
      camera.position.z += (camBase.z - camera.position.z) * 0.08;
      camera.lookAt(camLook);

      if (currentExp && currentExp.tick) currentExp.tick(t || 0);

      for (var i = fxParticles.length - 1; i >= 0; i--) {
        var p = fxParticles[i];
        p.mesh.position.x += p.vx; p.mesh.position.y += p.vy; p.mesh.position.z += p.vz;
        p.vy -= 0.006; p.mesh.rotation.x += p.rx; p.mesh.rotation.y += p.ry; p.life -= 0.025;
        if (p.life <= 0) {
          fxGroup.remove(p.mesh); disposeNode(p.mesh); fxParticles.splice(i, 1);
        } else {
          p.mesh.material.opacity = p.life;
          p.mesh.scale.setScalar(Math.max(0.05, p.life));
        }
      }
      for (var j = fxShockwaves.length - 1; j >= 0; j--) {
        var sw = fxShockwaves[j];
        sw.life -= 0.032;
        if (sw.life <= 0) {
          fxGroup.remove(sw.mesh); disposeNode(sw.mesh); fxShockwaves.splice(j, 1);
        } else {
          var sVal = 1 + (1 - sw.life) * sw.maxScale;
          sw.mesh.scale.set(sVal, sVal, 1);
          sw.mesh.material.opacity = sw.life * 0.8;
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }

    buildDeck();
    if (opts.startId) {
      var found = ALL.find(function (e) { return e.id === opts.startId; });
      loadExperience(found || deck[deckPos++]);
    } else {
      nextRandom();
    }
    syncSize();
    requestAnimationFrame(loop);

    return {
      list: ALL,
      selectById: function (id, vi) {
        var found = ALL.find(function (e) { return e.id === id; });
        if (found) loadExperience(found, vi);
      },
      nextRandom: nextRandom,
      nextVariant: function () { if (currentExp) loadExperience(currentExp, currentVariant + 1); },
      restart: function () { if (currentExp) loadExperience(currentExp, currentVariant); },
      forceWin: function () { if (currentExp && currentExp.forceWin) currentExp.forceWin(); }
    };
  }

  window.NodalMotor = { iniciar: iniciarMotor };
})();
