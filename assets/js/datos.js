/* =============================================================================
   GRUPO NODAL · DATOS DE CONTACTO Y SERVICIOS EXTERNOS (único lugar para cambiarlos)
   -----------------------------------------------------------------------------
   - Se completan los campos y se guarda. No hace falta tocar ningún HTML.
   - web3formsClave vacía: el formulario arma un mensaje de WhatsApp con los datos
     cargados y ofrece también enviarlo por correo. Con clave: envía por Web3Forms.
   - agendaUrl vacía: "Agendar diagnóstico" abre el formulario con
     "Diagnóstico express gratuito" elegido y la opción de WhatsApp.
     Con valor: abre esa agenda (Google Calendar, Cal.com o Calendly) en otra pestaña.
   ============================================================================= */
window.NODAL = {
  correo: "gruponodal@gmail.com",

  /* WhatsApp: 549 + código de área sin 0 + número sin 15 */
  whatsapp: "5491130639599",
  telefono: "+5491130639599",
  telefonoVisible: "11 3063-9599",

  horario: "Lunes a viernes, de 9 a 17 h",
  alcance: "Toda la Argentina y Latinoamérica",

  /* [A COMPLETAR] URL completa del perfil de LinkedIn de la empresa */
  linkedin: "",

  /* [A COMPLETAR] Clave de acceso de Web3Forms (la crea un socio en web3forms.com con su correo) */
  web3formsClave: "",

  /* [A COMPLETAR] Página de citas: Google Calendar, Cal.com o Calendly */
  agendaUrl: "",

  /* Poner true solo si se desea resaltar en amarillo los campos [A COMPLETAR] internos */
  modoRevision: false
};

