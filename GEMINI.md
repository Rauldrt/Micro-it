# Micro-it — Memoria de Contexto & Directrices del Proyecto

> **Este archivo es la memoria permanente de Micro-it.** Cualquier agente o sesión que abra esta carpeta debe leer y respetar estas definiciones de arquitectura, identidad y rendimiento.

---

## 1. Visión y Posicionamiento de Marca
* **Nombre:** **Micro-it** (*Studio & Apps*).
* **Propuesta de Valor:** Agencia líder de desarrollo de software a medida, implementaciones tecnológicas avanzadas y creación de identidad de marca:
  * Aplicaciones Web & Móviles (React, Node, TypeScript, Tailwind CSS, Motion).
  * Facturación electrónica fiscal (AFIP / ARCA).
  * Impresión térmica Bluetooth y hardware punto de venta (POS).
  * Automatizaciones de mensajería masiva y API WhatsApp.
  * Soluciones inteligentes impulsadas por Gemini AI y procesamiento de voz/audio.
* **Componente de Tienda / Labs:** El catálogo de soluciones creadas por Micro-it (Wanda POS, WhatsApp Sender, PrintLabel Pro, AudioNotes AI, etc.) convive dentro de la página como prueba viva (*live portfolio / suite*) del poder de desarrollo de la agencia.

---

## 2. Paradigma de Interfaz y Arquitectura Técnica
* **Viewport Fijo `100dvh`:** Toda la experiencia corre contenida sin scroll global del documento (`overflow: hidden`).
* **Carrusel Vertical 3D Elástico (`VerticalCarousel.tsx`):**
  * `perspective: 1200px`, `transformStyle: preserve-3d`.
  * Física basada en resortes (`motion/react` / `Framer Motion`).
  * Desplazamiento por arrastre (*drag gestures*), rueda de ratón y flechas del teclado.
  * Expansión de ancho en la tarjeta central (`width: 95%` vs `88%` en laterales) con escala `1.04`.
* **Paneles Interactivos Material Design 3 (`#panel1` y `#panel2` en `App.tsx` / `index.css`):**
  * Panel 1: **Dashboard** (aloja el carrusel vertical 3D).
  * Panel 2: **Ajustes** (aloja telemetría, auto-play, navegador de tarjetas y branding).
  * Transición con curva de aceleración enfatizada: `cubic-bezier(0.2, 0.0, 0.0, 1.0)` en 600ms.
  * Los paneles se colapsan en *pills* flotantes con bordes redondeados y se expanden a pantalla completa con un clic.
* **Modal Fullscreen:** Despliegue con efecto cortina `clip-path` vertical al presionar Enter o dar clic en "Ver Solución Completa".

---

## 3. Isotipo Oficial de Micro-it (Identidad Consensuada)
* **Concepto:** **01. Badge Dinámico 3D** ([MicroLogo.tsx](file:///E:/Micro-it/src/components/MicroLogo.tsx)).
* **Glifo del Símbolo `µ`:**
  * **Bordes rectos (flat-cut):** Cortes planos horizontales en el tope de ambas astas y en la base del descendente; corte vertical recto en el terminal/espolón derecho.
  * **Cuerpo reforzado:** Calibre *Extra Bold / Heavy* con gran densidad visual y presencia institucional.
  * **Color:** **100% Negro puro integral (`#000000`)**.
  * **Sin contorno blanco:** No lleva borde blanco; el recorte óptico y contraste se logran puramente por su luz posterior.
* **Sombra Animada Aurora Boreal (`animate-aurora-symbol`):**
  * Proyectada **exclusivamente como la sombra (`filter: drop-shadow`) del glifo negro interior**.
  * Cadencia suave y mística en ciclo de **9.5 segundos**:
    * Verde Esmeralda (`#10b981`) $\rightarrow$ Cian Polar (`#06b6d4`) $\rightarrow$ Azul Eléctrico (`#38bdf8`) $\rightarrow$ Violeta/Magenta (`#a855f7`).
* **Cuerpo del Badge Reactivo:**
  * **Gradiente de Negro al Color Dinámico:** Inicia en negro absoluto (`#000000` a 0%) y se proyecta hacia el `accentColor` de la tarjeta activa (100%), creando un efecto de eclipse tecnológico sobre el que resalta la sombra polar.
  * Bisel perimetral de cristal y destello especular superior 3D.

---

## 4. Reglas Críticas de Rendimiento Gráfico (GPU)
1. **Evitar filtros pesados en animación continua:** No aplicar `filter: blur(...)` ni `backdrop-blur-3xl` sobre las tarjetas 3D en movimiento, ya que obliga a Chromium a rasterizar por CPU y genera micro-tirones.
2. **Fondos ambientales ligeros:** El resplandor ambiental del viewport utiliza `radial-gradient` puro con opacidad controlada.
3. **Aceleración por Hardware:** Elementos móviles deben conservar `willChange: 'transform, opacity'` y `backfaceVisibility: 'hidden'`.

---

## 5. Comandos y Entorno
* **Directorio raíz del proyecto:** `E:\Micro-it`
* **Dependencias:** `npm install` (React 19, Motion, Tailwind CSS v4, Lucide React, Vite).
* **Servidor de desarrollo:** `npm run dev` (ejecuta en puerto `5173` con `--host`).
* **Compilación de producción:** `npm run build`.
