/* =============================================================================
   GRUPO NODAL · CONTENIDOS VERIFICADOS PARA EL MOTOR INTERACTIVO (v5.0 · 2.5D)
   - Paleta Manual de Identidad Visual:
     tinta #1F303E · petroleo #2A4154 · papel #F5EFEB · niebla #ECE7E1
     acero #6C7A86 · ocre #C38B42 · verde #6B8E77 · nexo #C01D2E
   - Datos reales (OIT, Banco Mundial, IEA, ISO, SRT, Ley 24.051, AEA 90364, NFPA).
   - Iconos vectoriales + etiquetas ultra-cortas (1–2 palabras).
   ============================================================================= */
window.NODAL_CONTENIDOS = {
  /* 1. CIRCUITO SEGURO (3 variantes rotativas) */
  CIRCUITOS: [
    {
      subtitulo: "Tablero eléctrico",
      etiquetaCentro: "PLANTA",
      objetivo: "Arrastrá las 2 piezas seguras al tablero.",
      slots: [
        { id: "s1", x: 245, y: 158, label: "PROTECCIÓN", acepta: "disyuntor" },
        { id: "s2", x: 375, y: 274, label: "DESCARGA", acepta: "pat" }
      ],
      piezas: [
        { id: "disyuntor", icon: "breaker", label: "Disyuntor 30mA", seguro: true, color: "#2A4154" },
        { id: "pat", icon: "ground", label: "Tierra TN-S", seguro: true, color: "#6B8E77" },
        { id: "puente", icon: "bridge", label: "Puente", seguro: false, color: "#C01D2E", aviso: "Lo provisorio no protege vidas ni pasa una inspección." },
        { id: "sin-tierra", icon: "no-ground", label: "Sin Tierra", seguro: false, color: "#C38B42", aviso: "Sin continuidad de masas, una falla energiza la carcasa." }
      ],
      norma: "Res. SRT 900/2015 · AEA 90364",
      sabias: "¿Sabías que el protocolo de puesta a tierra y continuidad de masas tiene validez anual obligatoria (12 meses) y verifica que los diferenciales actúen antes de una descarga fatal? Nosotros medimos, certificamos y dejamos sus tableros en regla."
    },
    {
      subtitulo: "Red contra incendio",
      etiquetaCentro: "RED INCENDIO",
      objetivo: "Arrastrá las 2 piezas seguras al lazo.",
      slots: [
        { id: "s1", x: 245, y: 158, label: "DETECCIÓN", acepta: "sensor" },
        { id: "s2", x: 375, y: 274, label: "PRESIÓN", acepta: "bomba" }
      ],
      piezas: [
        { id: "sensor", icon: "smoke", label: "Sensor Humo", seguro: true, color: "#2A4154" },
        { id: "bomba", icon: "pump", label: "Bomba Red", seguro: true, color: "#6B8E77" },
        { id: "valvula-cerrada", icon: "valve-off", label: "Válvula Cerr.", seguro: false, color: "#C01D2E", aviso: "Una válvula cerrada deja la red seca en el peor momento." },
        { id: "vencido", icon: "extinguisher", label: "Vencido", seguro: false, color: "#C38B42", aviso: "Sin recarga ni prueba hidráulica vigente, falla la habilitación y el seguro." }
      ],
      norma: "Dec. 351/79 Cap. 18 · IRAM 3597",
      sabias: "¿Sabías que en una inspección de aseguradora, una red de incendio sin mantenimiento documentado puede elevar la prima o rechazar cobertura ante siniestro? Coordinamos carga de fuego, detección, red y brigadas entrenadas."
    },
    {
      subtitulo: "Bloqueo LOTO",
      etiquetaCentro: "MANTENIMIENTO",
      objetivo: "Arrastrá las 2 piezas de bloqueo seguro.",
      slots: [
        { id: "s1", x: 245, y: 158, label: "AISLACIÓN", acepta: "candado" },
        { id: "s2", x: 375, y: 274, label: "PRUEBA", acepta: "cero" }
      ],
      piezas: [
        { id: "candado", icon: "lock", label: "Candado LOTO", seguro: true, color: "#6B8E77" },
        { id: "cero", icon: "gauge-zero", label: "Energía Cero", seguro: true, color: "#2A4154" },
        { id: "cartel", icon: "sign", label: "Solo Cartel", seguro: false, color: "#C01D2E", aviso: "Un cartel no impide un arranque accidental por otro turno." },
        { id: "apuro", icon: "bolt", label: "Parada Rápida", seguro: false, color: "#C38B42", aviso: "El botón de emergencia no aísla energía hidráulica ni neumática." }
      ],
      norma: "Ley 19.587 · Estándar LOTO",
      sabias: "¿Sabías que gran parte de los incidentes graves de mantenimiento ocurren por energías residuales no bloqueadas? Implementamos procedimientos LOTO simples y entrenamos a su equipo en planta."
    }
  ],

  /* 2. SHIFT NODAL (3 variantes — invertir plano Papel <-> Planta) */
  SHIFTS: [
    {
      subtitulo: "Riesgo eléctrico",
      norma: "21 de abril · Día de la HyS en Argentina (Ley 19.587)",
      sabias: "¿Sabías que la Ley 19.587 se sancionó el 21 de abril de 1972 y sigue siendo la columna vertebral de la seguridad industrial? Convertimos la norma escrita en controles reales que funcionan en planta."
    },
    {
      subtitulo: "Parada programada",
      norma: "Gestión del Cambio (MOC) · Arranque seguro",
      sabias: "¿Sabías que los arranques tras paradas de planta concentran una proporción crítica de desvíos operativos? Con revisiones previas al arranque (PSSR) reducimos paradas imprevistas y protegemos el cronograma."
    },
    {
      subtitulo: "Auditoría ISO",
      norma: "ISO 9001 / 14001 edición 2026",
      sabias: "¿Sabías que las normas ISO 9001, 14001 y 45001 comparten la misma Estructura de Alto Nivel (Anexo SL)? Unificarlas en un solo sistema reduce duplicaciones, horas de auditoría y costos."
    }
  ],

  /* 3. BLINDÁ EL PROCESO (3 variantes PSM) */
  PROCESOS: [
    {
      subtitulo: "Reactor químico",
      equipo: "REACTOR P-104",
      unidad: "bar",
      slots: [
        { x: 230, y: 150, label: "ALIVIO", acepta: "psv" },
        { x: 392, y: 268, label: "CORTE", acepta: "interlock" }
      ],
      piezas: [
        { id: "psv", icon: "psv", label: "Válvula PSV", seguro: true, color: "#2A4154" },
        { id: "interlock", icon: "interlock", label: "Interlock", seguro: true, color: "#6B8E77" },
        { id: "manual", icon: "valve-off", label: "Solo Manual", seguro: false, color: "#C01D2E", aviso: "Si la sobrepresión escala en segundos, no alcanza la acción manual." }
      ],
      norma: "Seguridad de Procesos (PSM · HAZOP / LOPA)",
      sabias: "¿Sabías que los accidentes mayores nunca ocurren por una sola falla, sino por la ausencia de barreras independientes de protección? Diseñamos análisis HAZOP y LOPA a escala real de su planta."
    },
    {
      subtitulo: "Silo de polvos",
      equipo: "SILO S-02",
      unidad: "% LEL",
      slots: [
        { x: 230, y: 150, label: "VENTEO", acepta: "venteo" },
        { x: 392, y: 268, label: "IGNICIÓN", acepta: "atex" }
      ],
      piezas: [
        { id: "venteo", icon: "vent", label: "Panel Venteo", seguro: true, color: "#6B8E77" },
        { id: "atex", icon: "atex", label: "Control ATEX", seguro: true, color: "#2A4154" },
        { id: "soplado", icon: "fan", label: "Barrido Aire", seguro: false, color: "#C01D2E", aviso: "Soplar polvo acumulado genera nubes explosivas en suspensión." }
      ],
      norma: "NFPA 652 · Prevención en polvos y silos",
      sabias: "¿Sabías que harinas, azúcar, cartón, madera y polvos metálicos pueden detonar en suspensión si encuentran una chispa estática? Evaluamos áreas clasificadas y planes preventivos específicos."
    },
    {
      subtitulo: "Sala de amoníaco",
      equipo: "FRÍO NH3",
      unidad: "ppm",
      slots: [
        { x: 230, y: 150, label: "SENSOR", acepta: "detector" },
        { x: 392, y: 268, label: "EXTRACCIÓN", acepta: "ventilacion" }
      ],
      piezas: [
        { id: "detector", icon: "sensor-gas", label: "Detector NH3", seguro: true, color: "#2A4154" },
        { id: "ventilacion", icon: "fan", label: "Extractor", seguro: true, color: "#6B8E77" },
        { id: "esperar", icon: "sign", label: "Por Olor", seguro: false, color: "#C01D2E", aviso: "A concentraciones peligrosas, la fatiga olfativa impide reaccionar a tiempo." }
      ],
      norma: "PSM en refrigeración · Continuidad operativa",
      sabias: "¿Sabías que una fuga de amoníaco sin detección temprana puede detener toda una planta alimentaria por días? Implementamos detección, planes de emergencia y simulacros con brigadas."
    }
  ],

  /* 4. DE EMISIONES A RENTABILIDAD (3 variantes · Finanzas Verdes y Carbono) */
  CARBONO: [
    {
      subtitulo: "Eficiencia y bonos",
      palancas: [
        { id: "iso50", icon: "motor", label: "ISO 50001", color: "#2A4154", ahorro: 34 },
        { id: "solar", icon: "solar", label: "Renovable", color: "#6B8E77", ahorro: 34 },
        { id: "bonos", icon: "coin-leaf", label: "Bonos Verdes", color: "#C38B42", ahorro: 32 }
      ],
      norma: "Banco Mundial · ISO 14064 · ISO 50001",
      sabias: "¿Sabías que los mecanismos de precio al carbono ya cubren casi el 30 % de las emisiones globales y movilizan más de USD 100.000 millones al año? Te ayudamos a bajar consumo energético y acceder a financiamiento verde."
    },
    {
      subtitulo: "Exportadores (CBAM)",
      palancas: [
        { id: "huella", icon: "coin-leaf", label: "Huella CO2", color: "#2A4154", ahorro: 33 },
        { id: "calor", icon: "heat", label: "Recup. Térmico", color: "#C38B42", ahorro: 34 },
        { id: "taxo", icon: "recycle", label: "Taxonomía", color: "#6B8E77", ahorro: 33 }
      ],
      norma: "CBAM Europeo · ISO 14064 · Finanzas Ambientales",
      sabias: "¿Sabías que medir y reducir la huella de carbono evita sobrecostos arancelarios en mercados exigentes y abre líneas de crédito con mejores tasas? Estructuramos su hoja de ruta ambiental con criterio financiero."
    },
    {
      subtitulo: "Descarbonización",
      palancas: [
        { id: "fugas", icon: "sensor-gas", label: "Control Metano", color: "#C38B42", ahorro: 35 },
        { id: "agua", icon: "drop", label: "Reúso Agua", color: "#2A4154", ahorro: 32 },
        { id: "creditos", icon: "coin-leaf", label: "Créditos CO2", color: "#6B8E77", ahorro: 33 }
      ],
      norma: "Eficiencia de activos · Finanzas Verdes",
      sabias: "¿Sabías que según la Agencia Internacional de la Energía (IEA), optimizar motores, compresores y fugas térmicas tiene los retornos más rápidos de la industria? Convertimos cumplimiento ambiental en ahorro medible."
    }
  ],

  /* 5. DESTINO SEGURO (3 variantes · Residuos y Economía Circular) */
  RESIDUOS: [
    {
      subtitulo: "Trazabilidad legal",
      items: [
        { id: "esp", icon: "drum", label: "Aceite Y8", destino: "operador", color: "#C38B42" },
        { id: "rec", icon: "recycle", label: "Cartón Limpio", destino: "circular", color: "#6B8E77" },
        { id: "efl", icon: "drop", label: "Efluente", destino: "planta", color: "#2A4154" }
      ],
      destinos: [
        { id: "operador", icon: "drum", label: "Operador Y8", x: 130, color: "#C38B42" },
        { id: "circular", icon: "recycle", label: "Econ. Circular", x: 310, color: "#6B8E77" },
        { id: "planta", icon: "drop", label: "Planta Efluentes", x: 490, color: "#2A4154" }
      ],
      norma: "Ley Nacional 24.051 · Gestión de Residuos",
      sabias: "¿Sabías que mezclar una pequeña fracción de residuo peligroso con residuo común vuelve peligroso a todo el lote y multiplica el costo de disposición? Ordenamos segregación, manifiestos y oportunidades de recupero."
    },
    {
      subtitulo: "Régimen RINE",
      items: [
        { id: "esp", icon: "drum", label: "Lodo Hidrocarb.", destino: "operador", color: "#C38B42" },
        { id: "rec", icon: "recycle", label: "Insumo Reúso", destino: "circular", color: "#6B8E77" },
        { id: "efl", icon: "drop", label: "Agua Lavado", destino: "planta", color: "#2A4154" }
      ],
      destinos: [
        { id: "operador", icon: "drum", label: "Tratador", x: 130, color: "#C38B42" },
        { id: "circular", icon: "recycle", label: "Reúso Insumo", x: 310, color: "#6B8E77" },
        { id: "planta", icon: "drop", label: "Monitoreo", x: 490, color: "#2A4154" }
      ],
      norma: "Res. 181/2026 (PBA) · Ley 11.720",
      sabias: "¿Sabías que desclasificar correctamente un residuo espejo para usarlo como insumo reduce gastos mensuales de transporte y tratamiento? Gestionamos inventarios, declaraciones y representación técnica."
    },
    {
      subtitulo: "Packaging limpio",
      items: [
        { id: "esp", icon: "drum", label: "Tintas/Solvent.", destino: "operador", color: "#C38B42" },
        { id: "rec", icon: "recycle", label: "Papel / Film", destino: "circular", color: "#6B8E77" },
        { id: "efl", icon: "drop", label: "Lavado Tintas", destino: "planta", color: "#2A4154" }
      ],
      destinos: [
        { id: "operador", icon: "drum", label: "Operador Esp.", x: 130, color: "#C38B42" },
        { id: "circular", icon: "recycle", label: "Valorización", x: 310, color: "#6B8E77" },
        { id: "planta", icon: "drop", label: "Fisicoquímica", x: 490, color: "#2A4154" }
      ],
      norma: "5 de junio · Día Mundial del Medio Ambiente (PNUMA)",
      sabias: "¿Sabías que valorizar recortes limpios de proceso transforma un costo mensual de retiro en recupero económico real? Diseñamos circuitos limpios de residuos y cumplimiento normativo."
    }
  ],

  /* 6. EQUIPÁ LA MANIOBRA (3 variantes · EPP) */
  EPP: [
    {
      subtitulo: "Tablero eléctrico",
      tarea: "INTERVENCIÓN BT",
      slots: [
        { x: 240, y: 158, label: "MANOS", acepta: "guantes" },
        { x: 380, y: 266, label: "ROSTRO", acepta: "pantalla" }
      ],
      piezas: [
        { id: "guantes", icon: "gloves", label: "Dieléctricos", seguro: true, color: "#6B8E77" },
        { id: "pantalla", icon: "shield", label: "Pantalla Arco", seguro: true, color: "#2A4154" },
        { id: "algodon", icon: "gloves", label: "Algodón", seguro: false, color: "#C01D2E", aviso: "El algodón no aísla tensión ni protege contra arco eléctrico." }
      ],
      norma: "Res. SRT 299/2011 · Ley 19.587",
      sabias: "¿Sabías que la Res. SRT 299/2011 exige EPP certificados y constancia firmada de entrega para cada puesto? Ordenamos matrices de EPP, entregas digitales y capacitación práctica en planta."
    },
    {
      subtitulo: "Trabajo en altura",
      tarea: "PASARELA > 2m",
      slots: [
        { x: 240, y: 158, label: "SUJECIÓN", acepta: "arnes" },
        { x: 380, y: 266, label: "ANCLAJE", acepta: "linea" }
      ],
      piezas: [
        { id: "arnes", icon: "harness", label: "Arnés", seguro: true, color: "#C38B42" },
        { id: "linea", icon: "lifeline", label: "Línea de Vida", seguro: true, color: "#6B8E77" },
        { id: "cinturon", icon: "harness", label: "Cinturón", seguro: false, color: "#C01D2E", aviso: "El cinturón de cintura no detiene una caída de forma segura." }
      ],
      norma: "Res. SRT 299/2011 · Prevención de caídas",
      sabias: "¿Sabías que el costo global de accidentes y enfermedades laborales representa entre el 4 % y 5,8 % del PBI mundial según la OIT? Prevenir en campo cuida a su gente y evita frenos operativos."
    },
    {
      subtitulo: "Espacio confinado",
      tarea: "TANQUE T-07",
      slots: [
        { x: 240, y: 158, label: "ATMÓSFERA", acepta: "medidor" },
        { x: 380, y: 266, label: "RESCATE", acepta: "tripode" }
      ],
      piezas: [
        { id: "medidor", icon: "sensor-gas", label: "Detector 4G", seguro: true, color: "#2A4154" },
        { id: "tripode", icon: "tripod", label: "Trípode", seguro: true, color: "#6B8E77" },
        { id: "solo", icon: "sign", label: "Sin Vigía", seguro: false, color: "#C01D2E", aviso: "Nunca se ingresa a un espacio confinado sin medición previa ni vigía externo." }
      ],
      norma: "Permiso de Trabajo · Procedimiento crítico",
      sabias: "¿Sabías que la falta de oxígeno o gases tóxicos invisibles no dan aviso sensorial antes del desmayo? Armamos permisos de trabajo seguro, medición y entrenamiento de brigadas."
    }
  ],

  /* 7. UNIVERSO NODAL 360° */
  UNIVERSO_360: [
    {
      id: "seguridad-higiene", icon: "shield", corto: "Seguridad e Higiene", color: "#C38B42",
      subs: ["Servicio externo mensual", "Mediciones SRT", "Ergonomía", "Mapa de riesgos", "Jefatura por abono"],
      sabias: "Según la OIT, los accidentes y enfermedades laborales cuestan entre el 4 % y el 5,8 % del PBI mundial en paradas, reemplazos e indemnizaciones.",
      ayuda: "En Grupo Nodal organizamos su servicio de HyS, mediciones y registros para bajar siniestralidad y sostener la operación al día."
    },
    {
      id: "medio-ambiente", icon: "recycle", corto: "Medio Ambiente", color: "#6B8E77",
      subs: ["Habilitación ambiental", "Residuos y RINE", "Monitoreos", "Permisos de agua/aire", "EIA y pasivos"],
      sabias: "Mezclar una fracción mínima de residuo peligroso (Ley 24.051) con descarte común contamina todo el lote y multiplica los costos de retiro.",
      ayuda: "Ordenamos segregación, permisos y monitoreos para eliminar riesgos de multas y detectar oportunidades de economía circular."
    },
    {
      id: "sistemas-de-gestion", icon: "motor", corto: "Calidad e ISO", color: "#2A4154",
      subs: ["ISO 9001/14001/45001", "Transición 2026", "Inocuidad FSSC/BRCGS", "FSC y PEFC", "TPM y pérdidas"],
      sabias: "Las normas ISO 9001, 14001 y 45001 comparten el Anexo SL: integrarlas en un solo sistema reduce duplicaciones y horas de auditoría.",
      ayuda: "Implementamos sistemas ágiles que acompañan la producción real, sin burocracia innecesaria y listos para certificar."
    },
    {
      id: "riesgos-de-proceso", icon: "psv", corto: "Riesgos de Proceso", color: "#6C7A86",
      subs: ["HAZOP y LOPA", "Arranque seguro PSSR", "Gestión del cambio", "Polvos y amoníaco", "Equipos críticos"],
      sabias: "Los eventos mayores en plantas de proceso suelen gestarse tras cambios menores no evaluados (falta de Gestión del Cambio).",
      ayuda: "Aplicamos ingeniería de seguridad de procesos a escala PyME o corporativa para evitar paradas imprevistas y proteger activos críticos."
    },
    {
      id: "cultura-factor-humano", icon: "harness", corto: "Cultura y Personas", color: "#6B8E77",
      subs: ["Conducta segura (SBC)", "Liderazgo supervisores", "Safety II y HOP", "Riesgos psicosociales", "Academia en línea"],
      sabias: "Cada 28 de abril la OIT recuerda que cumplir papeles no alcanza: cuando los procedimientos no se viven en planta, los incidentes se repiten.",
      ayuda: "Desarrollamos liderazgo en mandos medios y hábitos seguros que el equipo sostiene incluso cuando nadie está mirando."
    },
    {
      id: "sostenibilidad", icon: "solar", corto: "Sostenibilidad", color: "#6B8E77",
      subs: ["Huella de carbono", "Eficiencia ISO 50001", "Reportes ESG", "EUDR y CBAM", "Descarbonización"],
      sabias: "Según la Agencia Internacional de la Energía (IEA), optimizar motores, compresores y procesos térmicos genera ahorros inmediatos y verificables.",
      ayuda: "Medimos consumos y huellas con criterio operativo para bajar facturas energéticas y responder a exigencias de clientes exportadores."
    },
    {
      id: "cumplimiento-normativo", icon: "coin-leaf", corto: "Finanzas Verdes", color: "#C38B42",
      subs: ["Finanzas verdes y bonos", "Matriz legal", "Planos y gestoría", "RENPRE y SGA", "Seguro ambiental"],
      sabias: "El Banco Mundial registra más de USD 100.000 millones anuales movilizados por instrumentos de carbono y finanzas sostenibles en todo el mundo.",
      ayuda: "Combinamos matriz legal y gestoría al día con estructuración técnica para bonos de carbono y líneas de financiamiento verde."
    },
    {
      id: "seguridad-4-0", icon: "interlock", corto: "Seguridad 4.0 e IA", color: "#2A4154",
      subs: ["Legajo digital", "Tableros dirección", "Visión por cámara IoT", "IA preventiva", "Gemelos digitales"],
      sabias: "Centralizar vencimientos, inspecciones e indicadores en tiempo real evita que un papel vencido frene una obra o una habilitación.",
      ayuda: "Digitalizamos alertas, legajos y analítica predictiva para que la dirección vea el estado real de la planta en un vistazo."
    },
    {
      id: "obras-contratistas", icon: "lock", corto: "Obras y Contratistas", color: "#6C7A86",
      subs: ["HyS en obras/paradas", "Control documental", "Inducción online", "Proveedor O&G/Minería", "Técnicos en planta"],
      sabias: "En petróleo, gas y minería, una carpeta documental incompleta o una precalificación débil puede dejar a una PyME afuera de una licitación.",
      ayuda: "Preparamos contratistas y controlamos ingresos y paradas de planta desde el primer día para operar sin rechazos."
    },
    {
      id: "emergencias-patrimonial", icon: "pump", corto: "Emergencias", color: "#C01D2E",
      subs: ["Planes y simulacros", "Brigadas y RCP", "Redes de incendio", "Continuidad ISO 22301", "Seguridad patrimonial"],
      sabias: "Contar con un plan de continuidad (ISO 22301) y brigadas entrenadas reduce drásticamente el tiempo de recuperación tras un incidente.",
      ayuda: "Diseñamos redes de protección, simulacros realistas y planes de crisis para que su negocio siga operando."
    }
  ],

  /* 8. DRON EN PLANTA (3 escenarios productivos rotativos) */
  DRON_ESCENARIOS: [
    {
      nombre: "Línea de Packaging y Cajas",
      tipo: "cajas",
      puntos: [
        { x: 145, y: 155, titulo: "Guarda de seguridad", dato: "Interlock activo: cero atrapamientos en conformadora.", color: "#C38B42" },
        { x: 310, y: 245, titulo: "Control de calidad", dato: "Reducción de scrap de cartón y trazabilidad FSC/ISO 9001.", color: "#2A4154" },
        { x: 475, y: 165, titulo: "Ergonomía de paletizado", dato: "Protocolo SRT: menos lesiones y ritmo continuo.", color: "#6B8E77" }
      ]
    },
    {
      nombre: "Oleoducto y Estación de Bombeo",
      tipo: "oleoducto",
      puntos: [
        { x: 140, y: 170, titulo: "Integridad y PSM", dato: "Válvulas de alivio y sensores de presión en línea.", color: "#C38B42" },
        { x: 310, y: 260, titulo: "Detección de emisiones", dato: "Monitoreo ambiental y control preventivo de fugas.", color: "#6B8E77" },
        { x: 485, y: 160, titulo: "Contratistas habilitados", dato: "Legajo digital y precalificación HSE al día.", color: "#2A4154" }
      ]
    },
    {
      nombre: "Planta Embotelladora",
      tipo: "botellas",
      puntos: [
        { x: 145, y: 160, titulo: "Inocuidad FSSC 22000", dato: "Puntos críticos controlados sin reprocesos.", color: "#2A4154" },
        { x: 310, y: 250, titulo: "Eficiencia de agua y energía", dato: "Ahorro medible en lavado y motores (ISO 50001).", color: "#6B8E77" },
        { x: 475, y: 165, titulo: "Protección acústica", dato: "Medición de ruido laboral y resguardo del equipo.", color: "#C38B42" }
      ]
    }
  ],

  /* 9. EFEMÉRIDES Y DATOS VERIFICADOS PARA LOS PUZZLES VISUALES CLÁSICOS */
  CAPSULAS_CLASICAS: [
    { norma: "28 de abril · OIT Seguridad y Salud", sabias: "¿Sabías que la prevención sistemática reduce costos ocultos de paradas, primas de seguro y ausentismo? Integramos seguridad, ambiente, calidad y personas en un solo plan." },
    { norma: "ISO 9001 · 14001 · 45001", sabias: "¿Sabías que auditar tres sistemas separados cuesta mucho más tiempo de planta que gestionarlos de forma integrada? Diseñamos sistemas a escala real de su empresa." },
    { norma: "Finanzas Verdes · ISO 50001", sabias: "¿Sabías que ordenar su gestión ambiental y energética no solo evita multas, sino que puede abrir líneas de financiamiento verde y ahorros directos? Te acompañamos en cada paso." },
    { norma: "Continuidad del Negocio · ISO 22301", sabias: "¿Sabías que una planta preparada ante emergencias recupera su operación mucho más rápido y protege contratos clave? Trabajamos para que la dirección pueda descansar tranquila." }
  ]
};
