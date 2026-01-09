// Paleta inicial de ejemplo
let colores = [
  {nombre:"--fondo", valor:"#ffffff"},
  {nombre:"--letras", valor:"#121212"},
  {nombre:"--resaltar", valor:"#759AD3"},
  {nombre:"--opcion4", valor:"#67FDA3"},
  {nombre:"--opcion5", valor:"#868623"},
  {nombre:"--opcion6", valor:"#748582"}
];

const colorList = document.getElementById("colorList");

// Renderizar lista de colores como bloques arrastrables
function renderColores() {
  colorList.innerHTML = "";
  colores.forEach((c,i) => {
    const div = document.createElement("div");
    div.className = "color-item";
    div.draggable = true;
    div.dataset.index = i;

    div.innerHTML = `
      <div class="color-swatch" style="background:${c.valor}"></div>
      <span>${c.nombre}: ${c.valor}</span>
      <button onclick="quitarColor(${i})">✖</button>
      <span class="drag-handle">☰</span>
    `;
    colorList.appendChild(div);
  });
}

// Quitar color (máximo 2)
function quitarColor(i) {
  if (colores.length > 4) {
    colores.splice(i,1);
    renderColores();
  } else {
    alert("Debe haber al menos 4 colores.");
  }
}

// Drag & Drop reordenar colores
let dragIndex;
colorList.addEventListener("dragstart", e => {
  dragIndex = e.target.dataset.index;
});
colorList.addEventListener("dragover", e => e.preventDefault());
colorList.addEventListener("drop", e => {
  const targetIndex = e.target.closest(".color-item").dataset.index;
  const temp = colores[dragIndex];
  colores.splice(dragIndex,1);
  colores.splice(targetIndex,0,temp);
  renderColores();
});

// Aplicar colores como variables CSS
document.getElementById("aplicarBtn").addEventListener("click", () => {
  const style = document.createElement("style");
  let vars = ":root {\n";
  colores.forEach(c => vars += `  ${c.nombre}: ${c.valor};\n`);
  vars += "}";
  style.innerHTML = vars;
  document.head.appendChild(style);

  // Validar contraste texto vs fondo
  const fondo = getComputedStyle(document.documentElement).getPropertyValue("--fondo").trim();
  const texto = getComputedStyle(document.documentElement).getPropertyValue("--letras").trim();
  validarContraste(texto, fondo);

  // Minimizar formulario
  document.getElementById("formulario").classList.add("minimizado");
});

// Expandir formulario al hacer click
document.getElementById("formulario").addEventListener("click", e => {
  if (e.currentTarget.classList.contains("minimizado")) {
    e.currentTarget.classList.remove("minimizado");
  }
});

// Hacer formulario movible
const formulario = document.getElementById("formulario");
let offsetX, offsetY, dragging = false;
formulario.addEventListener("mousedown", e => {
  if (formulario.classList.contains("minimizado")) {
    dragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
  }
});
document.addEventListener("mousemove", e => {
  if (dragging) {
    formulario.style.left = (e.pageX - offsetX) + "px";
    formulario.style.top = (e.pageY - offsetY) + "px";
  }
});
document.addEventListener("mouseup", () => dragging = false);

// --- WCAG contraste ---
// Calcular luminancia relativa
function luminancia(hex) {
  const rgb = hex.replace("#","").match(/.{2}/g).map(x => parseInt(x,16)/255);
  const ajustado = rgb.map(c => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4));
  return 0.2126*ajustado[0] + 0.7152*ajustado[1] + 0.0722*ajustado[2];
}

// Calcular ratio de contraste
function contraste(color1, color2) {
  const L1 = luminancia(color1);
  const L2 = luminancia(color2);
  return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
}

// Mostrar toast
function showToast(msg, sugerencia, aplicarCallback) {
  const toast = document.getElementById("toast");
  toast.innerHTML = `
    <div>
      ${msg}<br>
      <button id="aplicarSug">Aplicar sugerencia (${sugerencia})</button>
    </div>
  `;
  toast.classList.add("show");
  document.getElementById("aplicarSug").onclick = aplicarCallback;
  setTimeout(() => toast.classList.remove("show"), 8000);
}

// Validar contraste texto vs fondo
function validarContraste(texto, fondo) {
  const ratio = contraste(texto,fondo);
  if (ratio < 4.5) {
    let sugerido = texto;
    const Ltext = luminancia(texto);
    const Lfondo = luminancia(fondo);
    if (Ltext > Lfondo) {
      // texto claro sobre fondo claro → oscurecer texto
      sugerido = "#000000";
    } else {
      // texto oscuro sobre fondo oscuro → aclarar texto
      sugerido = "#FFFFFF";
    }
    showToast("El contraste no es bueno según WCAG. Ratio: "+ratio.toFixed(2),
              sugerido,
              () => aplicarSugerencia(sugerido));
  }
}

// Aplicar sugerencia
function aplicarSugerencia(color) {
  document.documentElement.style.setProperty("--letras", color);
}

// Inicializar
renderColores();
