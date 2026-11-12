# MEMORIA PERMANENTE DEL PROYECTO MICRO-IT

Fecha de consolidación de memoria: 12 de Noviembre de 2026.
Ubicación de trabajo: `E:\Micro-it`
Repositorio remoto: `https://github.com/Rauldrt/Micro-it.git` (rama: `main`)

---

## Resumen Ejecutivo de la Evolución del Proyecto

1. **Reenfoque Estratégico:**
   - La plataforma evolucionó desde una tienda de aplicaciones aislada hacia el **sitio oficial de Micro-it como agencia de desarrollo de software, implementaciones tecnológicas y creación de identidad de marca**.
   - Los productos reales desarrollados por el usuario (Wanda POS, WhatsApp Bulk Sender, PrintLabel Pro, AudioNotes AI, etc.) fueron integrados directamente como el showcase vivo del poder tecnológico de la agencia.

2. **Origen de la UI & Prototipo Base:**
   - Tomado del prototipo experimental `Carrousel-vertical` (`https://github.com/Rauldrt/Carrousel-vertical`).
   - Conserva los dos paneles interactivos estilo Material Design 3 con aceleración enfatizada (`cubic-bezier(0.2, 0.0, 0.0, 1.0)`):
     - **Dashboard (#panel1):** Carrusel vertical 3D elástico con física de resortes, arrastre y expansión de ancho al centrarse.
     - **Ajustes (#panel2):** Panel de telemetría, auto-play, navegación directa y estudio de marca.

3. **Optimización de Rendimiento Gráfico (60-120 FPS):**
   - Se erradicó el tartamudeo gráfico eliminando `filter: blur(...)` dinámico de las tarjetas 3D y reemplazando el fondo `blur-3xl` por un `radial-gradient` puro acelerado por GPU.

4. **Consolidación del Isotipo Oficial:**
   - **Variante:** 01. Badge Dinámico 3D.
   - **Símbolo:** Letra griega `µ` con bordes rectos (flat-cut), cuerpo extra bold, 100% negro sólido (`#000000`) sin contorno blanco.
   - **Sombra Aurora Boreal:** Proyectada exclusivamente como sombra del glifo interior en un ciclo lento y místico de 9.5s (esmeralda, cian polar, azul eléctrico, violeta).
   - **Cuerpo del Badge:** Gradiente desde negro absoluto (`#000000`) hacia el color dinámico de la tarjeta activa.

---

## Estructura de Archivos Clave
- `src/components/MicroLogo.tsx`: Componente del isotipo oficial y sus variantes vectoriales.
- `src/components/VerticalCarousel.tsx`: Motor 3D del carrusel con `motion/react`.
- `src/components/HeaderBar.tsx`: Barra superior con el isotipo reactivo, título de marca y selector de módulos.
- `src/components/BottomElement.tsx`: Panel interactivo extendido y visor de branding.
- `src/components/FullscreenCardModal.tsx`: Modal con efecto cortina `clip-path`.
- `src/data/cardsData.ts`: Las 6 soluciones oficiales de Micro-it con especificaciones, módulos y métricas.
- `src/index.css`: Tokens MD3, layout y keyframes de la Aurora Boreal (`@keyframes aurora-symbol-drop`).
- `src/App.tsx`: Contenedor maestro y orquestador de paneles colapsables/expandibles.

---

## Cómo Continuar el Trabajo en Futuras Sesiones
1. Establecer `E:\Micro-it` como espacio de trabajo en el editor / Antigravity.
2. Iniciar el servidor de desarrollo: `npm run dev` (disponible en `http://localhost:5173`).
3. Al consultar este archivo (`MEMORY.md`) o `GEMINI.md`, el agente dispondrá de todo el contexto histórico, decisiones técnicas y lineamientos estéticos sin necesidad de repetir instrucciones.
