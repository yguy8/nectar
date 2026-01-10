// Paleta inicial dinámica con los nuevos nombres
let colores = [
  {nombre:"--color-fondo", valor:"#ffffff"},
  {nombre:"--color-texto", valor:"#121212"},
  {nombre:"--color-primario", valor:"#3498db"},
  {nombre:"--color-secundario", valor:"#2ecc71"},
  {nombre:"--color-acento", valor:"#f39c12"},
  {nombre:"--color-resaltar", valor:"#759AD3"}
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
if (formularioHeader) {
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
}

// --- Renderizar lista de colores con inputs dinámicos ---
function renderColores() {
  colorList.innerHTML = "";
  colores.forEach((c,i) => {
    const div = document.createElement("div");
    div.className = "color-item";
    div.draggable = true;
    div.dataset.index = i;

    div.innerHTML = `
      <span class="color-name">${c.nombre}</span>
      <input type="color" value="${c.valor}" 
            onchange="actualizarColor(${i}, this.value)">
      <button onclick="quitarColor(${i})" class="btn-remove" aria-label="Quitar color">
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
      <span class="drag-handle" aria-label="Arrastrar para reordenar">
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

  // Botón "+" si hay menos de 6 colores
  if (colores.length < 6) {
    const addDiv = document.createElement("div");
    addDiv.className = "color-item add-color";
    addDiv.innerHTML = `
      <button onclick="agregarColor()" class="btn-add" aria-label="Agregar color">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
            viewBox="0 0 24 24" fill="none" stroke="#737373" 
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            class="icon icon-tabler icon-tabler-plus">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
      </button>
    `;
    colorList.appendChild(addDiv);
  }
}
// --- Añadir color (máximo 6) ---
function agregarColor(nombreOpcional, valorOpcional) {
  if (colores.length >= 6) {
    showToast("Máximo 6 colores en la paleta.");
    return;
  }

  const baseNombre = "--color-acento";
  let nuevoNombre = nombreOpcional || baseNombre;
  let contador = 1;
  const nombresExistentes = new Set(colores.map(c => c.nombre));
  while (nombresExistentes.has(nuevoNombre)) {
    nuevoNombre = `${baseNombre}-${contador++}`;
  }

  const nuevoValor = valorOpcional || "#cccccc";

  colores.push({ nombre: nuevoNombre, valor: nuevoValor });
  document.documentElement.style.setProperty(nuevoNombre, nuevoValor);
  renderColores();

  // Enfocar el último input recién creado
  const items = colorList.querySelectorAll('.color-item input[type="color"]');
  const ultimo = items[items.length - 1];
  if (ultimo) ultimo.focus();

  showToast("Nuevo color añadido a la paleta.");
}

// --- Actualizar color dinámicamente ---
function actualizarColor(i, nuevoValor) {
  colores[i].valor = nuevoValor;
  document.documentElement.style.setProperty(colores[i].nombre, nuevoValor);
}

// --- Quitar color (mínimo 3) ---
function quitarColor(i) {
  if (colores.length > 3) {
    colores.splice(i,1);
    renderColores();
  } else {
    showToast("Debe haber al menos 3 colores.");
  }
}

// --- Drag & Drop reordenar colores ---
let dragIndex;
colorList.addEventListener("dragstart", e => {
  const item = e.target.closest(".color-item");
  if (!item || item.classList.contains("add-color")) return;
  dragIndex = Number(item.dataset.index);
});
colorList.addEventListener("dragover", e => e.preventDefault());
colorList.addEventListener("drop", e => {
  const targetItem = e.target.closest(".color-item");
  if (!targetItem || targetItem.classList.contains("add-color")) return;

  const targetIndex = Number(targetItem.dataset.index);
  if (Number.isNaN(dragIndex) || Number.isNaN(targetIndex)) return;

  const [temp] = colores.splice(dragIndex, 1);
  colores.splice(targetIndex, 0, temp);
  renderColores();
});

// --- Aplicar colores ---
document.getElementById("aplicarBtn").addEventListener("click", () => {
  colores.forEach(c => {
    document.documentElement.style.setProperty(c.nombre, c.valor);
  });

  const fondo = getValor("--color-fondo");
  const texto = getValor("--color-texto");
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
      ${msg}
      ${sugerencia ? `<br><button id="aplicarSug">Aplicar sugerencia (${sugerencia})</button>` : ""}
    </div>
  `;
  toast.classList.add("show");
  if (sugerencia && aplicarCallback) {
    document.getElementById("aplicarSug").onclick = aplicarCallback;
  }
  setTimeout(() => toast.classList.remove("show"), 6000);
}

function validarContraste(texto, fondo) {
  const ratio = contraste(texto,fondo);
  if (ratio < 4.5) {
    let sugerido = (luminancia(texto) > luminancia(fondo)) ? "#000000" : "#FFFFFF";
    showToast("El contraste no es bueno según WCAG. Ratio: "+ratio.toFixed(2),
              sugerido,
              () => aplicarSugerencia(sugerido));
  } else {
    showToast("Contraste válido según WCAG. Ratio: "+ratio.toFixed(2));
  }
}

function aplicarSugerencia(color) {
  document.documentElement.style.setProperty("--color-texto", color);
}

// ayuda a obtener valor actual de una variable
function getValor(nombreVar) {
  const item = colores.find(c => c.nombre === nombreVar);
  return item ? item.valor : "#000000";
}

// Inicializar
renderColores();
