# 🏝️ Isla del Color

**Isla del Color** es una herramienta web diseñada para facilitar el proceso de selección y generación de paletas de colores.  
Elegir una paleta adecuada puede ser agotador y abrumador, especialmente en proyectos de marca donde la identidad visual es crítica.  
Este proyecto busca **reducir la carga cognitiva** del diseñador o creativo, ofreciendo herramientas que guían la elección cromática de manera estructurada y accesible.

---

## 🎯 Objetivo

Simplificar la toma de decisiones en diseño de color mediante:
- **Automatización** de combinaciones cromáticas basadas en teoría del color.
- **Exploración guiada** con frases, estéticas y temas que orientan la selección.
- **Validación técnica** de contraste y armonía para asegurar accesibilidad y legibilidad.

---

## ⚙️ Funcionalidades

- **Colores por tema**: selecciona paletas a partir de frases o estéticas (ej. elegante, minimalista, extravagante).
- **Ingresar color**: genera combinaciones armoniosas basadas en un color elegido.
- **Generador de paletas al azar**: explora combinaciones inesperadas para inspiración rápida.
- **Revisión de contraste**: asegura que texto y fondo cumplan con estándares de accesibilidad.
- **Extractor de color**: obtiene paletas directamente desde imágenes cargadas.
- **Guía de tesoros**: explica esquemas cromáticos clásicos (complementarios, análogos, triádicos, tetrádicos).

---

## 🛠️ Tecnologías utilizadas

- **HTML5** – estructura semántica y modular.
- **CSS3** – estilos responsivos, arquitectura modular y soporte de modo oscuro.
- **JavaScript (ES6+)** – interactividad (modales, navegación, validación de contraste).
- **SVG** – íconos escalables y accesibles.
- **Imágenes externas** – ejemplos visuales de teoría del color.

---

## 📂 Estructura del proyecto

Isla-del-color/
│
├── inicio.html                 # Página principal
├── inicio.css                  # Estilos globales de la página principal
├── inicio.js                   # Lógica de interacción (menú, modales, modo oscuro)
│
├── contraste/                 # Herramienta para revisar contraste entre colores
├── extractorDeColor/          # Extrae colores desde imágenes
├── generadorDePaletasDeColor/ # Genera paletas cromáticas al azar
├── ingresarColor/             # Genera paletas a partir de un color ingresado
└── temasColores/              # Paletas basadas en temas, frases o estéticas


