//modo oscuro
const boton = document.getElementById("modoOscuroBtn");

const iconMoon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
     viewBox="0 0 24 24" fill="#d4af37" class="icon-moon">
  <path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z"/>
</svg>`;

const iconSun = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
     viewBox="0 0 24 24" fill="#d4af37" class="icon-sun">
  <path d="M12 19a1 1 0 0 1 1 1v2a1 1 0 0 1 -2 0v-2a1 1 0 0 1 1 -1m-4.95 -2.05a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1 -1.414 -1.414l1.414 -1.414a1 1 0 0 1 1.414 0m11.314 0l1.414 1.414a1 1 0 0 1 -1.414 1.414l-1.414 -1.414a1 1 0 0 1 1.414 -1.414m-5.049 -9.836a5 5 0 1 1 -2.532 9.674a5 5 0 0 1 2.532 -9.674m-9.315 3.886a1 1 0 0 1 0 2h-2a1 1 0 0 1 0 -2zm18 0a1 1 0 0 1 0 2h-2a1 1 0 0 1 0 -2zm-16.364 -6.778l1.414 1.414a1 1 0 0 1 -1.414 1.414l-1.414 -1.414a1 1 0 0 1 1.414 -1.414m14.142 0a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1 -1.414 -1.414l1.414 -1.414a1 1 0 0 1 1.414 0m-7.778 -3.222a1 1 0 0 1 1 1v2a1 1 0 0 1 -2 0v-2a1 1 0 0 1 1 -1"/>
</svg>`;

boton.addEventListener("click", () => {
  document.body.classList.toggle("oscuro");
  const tema = document.body.classList.contains("oscuro") ? "oscuro" : "claro";
  localStorage.setItem("tema", tema);

  // Cambiar ícono según tema
  boton.innerHTML = tema === "oscuro" ? iconSun : iconMoon;
});

// Al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  const tema = localStorage.getItem("tema");
  if (tema === "oscuro") {
    document.body.classList.add("oscuro");
    boton.innerHTML = iconSun;
  } else {
    boton.innerHTML = iconMoon;
  }
});

//menú hamburguesa en moviles/celulares
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu-list');

toggle.addEventListener('click', () => {
    menu.classList.toggle('show');

    // Cambiar ícono ☰ ↔ ✖
    if (menu.classList.contains('show')) {
        toggle.textContent = '✖';
    } else {
        toggle.textContent = '☰';
    }
});

// --- Utilidades extra ---
function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbString(r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// --- Variables y constantes globales ---
const pickBtn = document.getElementById("pickBtn");
const fileInput = document.getElementById("fileInput");
const stage = document.getElementById("stage");
const ctx = stage.getContext("2d");
const emptyMsg = document.getElementById("emptyMsg");

const swatch = document.getElementById("swatch");
const hexEl = document.getElementById("hex");
const paletteContainer = document.getElementById("palette");
const toast = document.getElementById("toast");
const paletteBtn = document.getElementById("paletteBtn");
const copyPaletteBtn = document.getElementById("copyPalette");

const zoomCanvas = document.getElementById("zoomCanvas");
const zoomCtx = zoomCanvas.getContext("2d");
zoomCanvas.width = 100;
zoomCanvas.height = 100;

const formatSelect = document.getElementById("formatSelect");
let currentFormat = "hex"; // por defecto HEX

let img = null;
let selectedPoints = []; // hasta 5 puntos
let draggingPoint = null;

// --- Funciones utilitarias ---
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function setCanvasSize(w, h) {
  stage.width = w;
  stage.height = h;
  stage.style.width = w + "px";
  stage.style.height = h + "px";
}

function drawImageToCanvas(image) {
  const w = image.naturalWidth, h = image.naturalHeight;
  const maxW = stage.parentElement.clientWidth;
  const scale = Math.min(1, maxW / w);
  setCanvasSize(w * scale, h * scale);
  ctx.clearRect(0, 0, stage.width, stage.height);
  ctx.drawImage(image, 0, 0, stage.width, stage.height);
  emptyMsg.style.display = "none";
}

function redrawAll() {
  drawImageToCanvas(img);
  selectedPoints.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.fillStyle = p.hex;
    ctx.fill();
    ctx.stroke();
  });
}

// --- Cargar imagen desde disco ---
pickBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const ext = file.name.split(".").pop().toLowerCase();
  if (!["jpg", "jpeg", "png", "svg"].includes(ext)) {
    showToast("Formato no soportado");
    return;
  }
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    img = image;
    selectedPoints = [];
    drawImageToCanvas(img);
    URL.revokeObjectURL(url);
    paletteBtn.disabled = false;
    copyPaletteBtn.disabled = false;
  };
  image.onerror = () => showToast("No se pudo cargar la imagen");
  image.src = url;
});

// --- Zoom pixelado flotante ---
stage.addEventListener("mousemove", e => {
  if (!img) return;
  const rect = stage.getBoundingClientRect();
  const scaleX = stage.width / rect.width;
  const scaleY = stage.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);

  const size = 20;
  zoomCtx.imageSmoothingEnabled = false;
  zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
  zoomCtx.drawImage(stage, x - size/2, y - size/2, size, size, 0, 0, zoomCanvas.width, zoomCanvas.height);

  zoomCanvas.style.display = "block";
  zoomCanvas.style.position = "absolute";
  zoomCanvas.style.left = `${e.pageX + 20}px`;
  zoomCanvas.style.top = `${e.pageY + 20}px`;
});

stage.addEventListener("mouseenter", () => {
  zoomCanvas.style.display = "block";
});

stage.addEventListener("mouseleave", () => {
  zoomCanvas.style.display = "none";
  zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
});

// --- Selección de color en canvas ---
stage.addEventListener("click", e => {
  if (!img) return;

  const rect = stage.getBoundingClientRect();
  const scaleX = stage.width / rect.width;
  const scaleY = stage.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);
  const data = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b] = data;
  const hex = rgbToHex(r, g, b);

  if (selectedPoints.length >= 5) {
    selectedPoints.shift();
  }

  selectedPoints.push({ x, y, r, g, b, hex });

  redrawAll();
  renderSelectedColors();
  renderMainColor(selectedPoints[selectedPoints.length - 1]);
});

// --- Drag & Drop de puntos ---
stage.addEventListener("mousedown", e => {
  const rect = stage.getBoundingClientRect();
  const scaleX = stage.width / rect.width;
  const scaleY = stage.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);

  selectedPoints.forEach((p, idx) => {
    const dx = x - p.x;
    const dy = y - p.y;
    if (Math.sqrt(dx*dx + dy*dy) < 8) {
      draggingPoint = idx;
    }
  });
});

stage.addEventListener("mousemove", e => {
  if (draggingPoint === null) return;
  const rect = stage.getBoundingClientRect();
  const scaleX = stage.width / rect.width;
  const scaleY = stage.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);

  const data = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b] = data;
  const hex = rgbToHex(r, g, b);
  selectedPoints[draggingPoint] = { x, y, r, g, b, hex };

  redrawAll();
  renderSelectedColors();
  renderMainColor(selectedPoints[draggingPoint]);
});

stage.addEventListener("mouseup", () => {
  draggingPoint = null;
});

// --- Renderizar color principal ---
function renderMainColor(c) {
  // Vista previa del color
  swatch.style.backgroundColor = `rgb(${c.r},${c.g},${c.b})`;

  // Mostrar nombre según formato
  let displayValue;
  if (currentFormat === "hex") displayValue = c.hex;
  else if (currentFormat === "rgb") displayValue = rgbString(c.r, c.g, c.b);
  else displayValue = rgbToHsl(c.r, c.g, c.b);

  hexEl.textContent = displayValue;
}

// --- Renderizar lista de colores ---
function renderSelectedColors() {
  paletteContainer.innerHTML = "";
  selectedPoints.forEach((c, idx) => {
    const chip = document.createElement("div");
    chip.className = "chip";

    // Vista previa del color
    const colorDiv = document.createElement("div");
    colorDiv.className = "color";
    colorDiv.style.background = `rgb(${c.r},${c.g},${c.b})`;

    // Nombre según formato actual
    let displayValue;
    if (currentFormat === "hex") {
      displayValue = c.hex;
    } else if (currentFormat === "rgb") {
      displayValue = rgbString(c.r, c.g, c.b);
    } else {
      displayValue = rgbToHsl(c.r, c.g, c.b);
    }

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = `<span>${displayValue}</span>`;

    // Botón copiar
    const copyBtn = document.createElement("button");
copyBtn.className = "copy-btn";
copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
  viewBox="0 0 24 24" fill="none" stroke="#c933ffff" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-copy">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666" />
  <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
</svg>`;
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(displayValue)
        .then(() => showToast("Color copiado"))
        .catch(() => showToast("No se pudo copiar el color"));
    };
  // Botón eliminar
  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-x">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  `;

  removeBtn.onclick = () => {
    selectedPoints.splice(idx, 1);
    redrawAll();
    renderSelectedColors();
  };


    // Ensamblar chip
    chip.appendChild(colorDiv);
    chip.appendChild(meta);
    chip.appendChild(copyBtn);
    chip.appendChild(removeBtn);
    paletteContainer.appendChild(chip);
  });
}


// --- Generar paleta completa ---
paletteBtn.addEventListener("click", () => {
  if (selectedPoints.length === 0) {
    showToast("Selecciona al menos un punto");
    return;
  }
  paletteContainer.innerHTML = "";
  selectedPoints.forEach(c => {
    let displayValue;
    if (currentFormat === "hex") {
      displayValue = c.hex;
    } else if (currentFormat === "rgb") {
      displayValue = rgbString(c.r, c.g, c.b);
    } else {
      displayValue = rgbToHsl(c.r, c.g, c.b);
    }

    const chip = document.createElement("div");
    chip.className = "chip";
    chip.innerHTML = `
      <div class="color" style="background:rgb(${c.r},${c.g},${c.b})"></div>
      <div class="meta"><span>${displayValue}</span></div>
    `;
    paletteContainer.appendChild(chip);
  });
});

// --- Copiar paleta completa ---
copyPaletteBtn.addEventListener("click", () => {
  if (selectedPoints.length === 0) {
    showToast("No hay colores en la paleta");
    return;
  }
  const text = selectedPoints.map(c => {
    if (currentFormat === "hex") return c.hex;
    if (currentFormat === "rgb") return rgbString(c.r, c.g, c.b);
    return rgbToHsl(c.r, c.g, c.b);
  }).join("\n");

  navigator.clipboard.writeText(text)
    .then(() => showToast("Paleta copiada"))
    .catch(() => showToast("No se pudo copiar la paleta"));
});

// --- Cambio de formato desde el selector ---
formatSelect.addEventListener("change", e => {
  currentFormat = e.target.value;
  renderSelectedColors();
  if (selectedPoints.length > 0) {
    renderMainColor(selectedPoints[selectedPoints.length - 1]);
  }
  showToast(`Formato cambiado a ${currentFormat.toUpperCase()}`);
});

// --- Estado inicial ---
(function init() {
  emptyMsg.style.display = "block";
  setCanvasSize(320, 240);
  paletteBtn.disabled = true;
  copyPaletteBtn.disabled = true;
})();
