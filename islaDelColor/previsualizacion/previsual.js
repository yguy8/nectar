// Paleta inicial dinámica
let colores = [
  {nombre:"--fondo", valor:"#ffffff"},
  {nombre:"--letras", valor:"#121212"},
  {nombre:"--resaltar", valor:"#759AD3"},
  {nombre:"--opcion4", valor:"#67FDA3"},
  {nombre:"--opcion5", valor:"#868623"},
  {nombre:"--opcion6", valor:"#748582"}
];

const colorList        = document.getElementById("colorList");
const formularioBtn    = document.getElementById("formularioBtn");
const formulario       = document.getElementById("formulario");
const cerrarBtn        = document.getElementById("cerrarBtn");
const formularioHeader = document.getElementById("formularioHeader");

// --- Abrir / cerrar formulario ---
formularioBtn.addEventListener("click", () => {
  formulario.classList.remove("oculto");
  formularioBtn.style.display = "none";
});
cerrarBtn.addEventListener("click", () => {
  formulario.classList.add("oculto");
  formularioBtn.style.display = "flex";
});

// --- Mover botón flotante ---
let draggingBtn = false, offsetXBtn, offsetYBtn;
formularioBtn.addEventListener("mousedown", e => {
  draggingBtn = true;
  offsetXBtn = e.clientX - formularioBtn.offsetLeft;
  offsetYBtn = e.clientY - formularioBtn.offsetTop;
});
document.addEventListener("mousemove", e => {
  if (draggingBtn) {
    formularioBtn.style.left = (e.clientX - offsetXBtn) + "px";
    formularioBtn.style.top  = (e.clientY - offsetYBtn) + "px";
    formularioBtn.style.bottom = "auto";
    formularioBtn.style.right  = "auto";
  }
});
document.addEventListener("mouseup", () => draggingBtn = false);

// --- Mover formulario expandido ---
let draggingForm = false, offsetXForm, offsetYForm;
formularioHeader.addEventListener("mousedown", e => {
  draggingForm = true;
  offsetXForm = e.clientX - formulario.offsetLeft;
  offsetYForm = e.clientY - formulario.offsetTop;
});
document.addEventListener("mousemove", e => {
  if (draggingForm) {
    formulario.style.left = (e.clientX - offsetXForm) + "px";
    formulario.style.top  = (e.clientY - offsetYForm) + "px";
    formulario.style.bottom = "auto";
    formulario.style.right  = "auto";
  }
});
document.addEventListener("mouseup", () => draggingForm = false);

// --- Renderizar lista de colores con inputs dinámicos ---
function renderColores() {
  colorList.innerHTML = "";
  colores.forEach((c,i) => {
    const div = document.createElement("div");
    div.className = "color-item";
    div.draggable = true;
    div.dataset.index = i;

    div.innerHTML = `
      <input type="color" value="${c.valor}" 
             onchange="actualizarColor(${i}, this.value)">
      <span>${c.nombre}</span>
      <button onclick="quitarColor(${i})" class="btn-remove">
        <!-- SVG X -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
             viewBox="0 0 24 24" fill="none" stroke="#000000" 
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
             class="icon icon-tabler icon-tabler-x">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M18 6l-12 12" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
      <span class="drag-handle">
        <!-- SVG grip vertical -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
             viewBox="0 0 24 24" fill="none" stroke="#000000" 
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
             class="icon icon-tabler icon-tabler-grip-vertical">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M8 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M8 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M8 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M14 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M14 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M14 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        </svg>
      </span>
    `;
    colorList.appendChild(div);
  });
}
// Actualizar color dinámicamente
function actualizarColor(i, nuevoValor) {
  colores[i].valor = nuevoValor;
  document.documentElement.style.setProperty(colores[i].nombre, nuevoValor);
}

// Quitar color (mínimo 4)
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

// --- Aplicar colores ---
document.getElementById("aplicarBtn").addEventListener("click", () => {
  const style = document.createElement("style");
  let vars = ":root {\n";
  colores.forEach(c => vars += `  ${c.nombre}: ${c.valor};\n`);
  vars += "}";
  style.innerHTML = vars;
  document.head.appendChild(style);

  const fondo = getComputedStyle(document.documentElement).getPropertyValue("--fondo").trim();
  const texto = getComputedStyle(document.documentElement).getPropertyValue("--letras").trim();
  validarContraste(texto, fondo);
});

// --- WCAG contraste ---
function luminancia(hex) {
  const rgb = hex.replace("#","").match(/.{2}/g).map(x => parseInt(x,16)/255);
  const ajustado = rgb.map(c => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4));
  return 0.2126*ajustado[0] + 0.7152*ajustado[1] + 0.0722*ajustado[2];
}

function contraste(color1, color2) {
  const L1 = luminancia(color1);
  const L2 = luminancia(color2);
  return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
}

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

function validarContraste(texto, fondo) {
  const ratio = contraste(texto,fondo);
  if (ratio < 4.5) {
    let sugerido = (luminancia(texto) > luminancia(fondo)) ? "#000000" : "#FFFFFF";
    showToast("⚠️ El contraste no es bueno según WCAG. Ratio: "+ratio.toFixed(2),
              sugerido,
              () => aplicarSugerencia(sugerido));
  }
}

function aplicarSugerencia(color) {
  document.documentElement.style.setProperty("--letras", color);
}

// Inicializar
renderColores();
