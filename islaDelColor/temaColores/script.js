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

// Generar colores aleatorios hex
function randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

// Valida si un valor es un color CSS válido
function isValidCssColor(value) {
    const s = new Option().style;
    s.color = value;
    return s.color !== "";
}

// Normaliza el color ingresado (soporta español, hex, rgb/hsl)
function normalizeUserColor(value) {
    let v = value.trim().toLowerCase();

    const map = {
        "negro": "#000000",
        "blanco": "#ffffff",
        "rojo": "red",
        "azul": "blue",
        "verde": "green",
        "amarillo": "yellow",
        "naranja": "orange",
        "morado": "purple",
        "violeta": "violet",
        "rosa": "pink",
        "gris": "gray",
        "cian": "cyan",
        "magenta": "magenta",
        "marron": "brown",
        "marrón": "brown",
        "cafe": "brown",
        "café": "brown",
        "turquesa": "turquoise",
        "dorado": "gold",
        "plata": "silver"
    };

    if (map[v]) return map[v];

    if (/^#?[0-9a-f]{3}$/.test(v) || /^#?[0-9a-f]{6}$/.test(v)) {
        if (!v.startsWith("#")) v = "#" + v;
        return v;
    }

    if (isValidCssColor(v)) return v;

    return null;
}

// Mostrar toast
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// Copiar color individual
function copyText(element) {
    const parent = element.parentElement;
    const textSpan = parent.querySelector(".color-name");
    const originalText = textSpan.innerText;
    navigator.clipboard.writeText(originalText).then(() => {
        textSpan.innerText = "¡Copiado!";
        setTimeout(() => (textSpan.innerText = originalText), 1500);
    });
}

// Copiar toda la paleta
function copyPalette(button) {
    const group = button.closest(".palette-group");
    const colors = [...group.querySelectorAll(".color-name")].map((span) => span.innerText);
    const paletteText = colors.join(", ");
    navigator.clipboard.writeText(paletteText).then(() => {
        button.innerText = "¡Paleta copiada!";
        setTimeout(() => (button.innerText = "Copiar paleta"), 1500);
    });
}

// Eliminar paleta
function deletePalette(button) {
    const group = button.closest(".palette-group");
    group.remove();
}

// Lista de colores añadidos por el usuario
let userColors = [];

// Generar paletas
function generateThemePalette() {
    const tema = document.getElementById("tema").value.trim();
    const container = document.getElementById("paletteContainer");

    if (!tema) {
        showToast("Por favor ingresa un tema para comenzar");
        return;
    }

    container.innerHTML = "";

    for (let i = 0; i < 4; i++) {
        const group = document.createElement("div");
        group.className = "palette-group";

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "✖";
        deleteBtn.className = "remove-btn";
        deleteBtn.setAttribute("aria-label", "Eliminar paleta");
        deleteBtn.onclick = () => deletePalette(deleteBtn);
        group.appendChild(deleteBtn);

        const paletteColors = [...userColors];
        while (paletteColors.length < 4) {
            const rand = randomColor();
            paletteColors.push({ raw: rand, normalized: rand });
        }

        paletteColors.forEach((colorObj) => {
            const card = document.createElement("div");
            card.className = "color-card";
            card.style.backgroundColor = colorObj.normalized;
            card.innerHTML = `
                <span class="color-swatch" style="background:${colorObj.normalized}"></span>
                <span class="color-name">${colorObj.raw}</span>
                <button onclick="copyText(this)" class="copy-color-btn" aria-label="Copiar color">
                    <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" 
                    viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-copy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 
                    2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 
                    -2h10c.75 0 1.158 .385 1.5 1" /></svg> 
                </button>
            `;
            group.appendChild(card);
        });

        const copyBtn = document.createElement("button");
        copyBtn.innerText = "Copiar paleta";
        copyBtn.className = "copy-btn";
        copyBtn.setAttribute("aria-label", "Copiar paleta completa");
        copyBtn.onclick = () => copyPalette(copyBtn);
        group.appendChild(copyBtn);

        container.appendChild(group);
    }
}

// Añadir color específico
function addSpec() {
    const input = document.getElementById("specInput");
    const raw = input.value.trim();
    if (!raw) return;

    const normalized = normalizeUserColor(raw);
    if (!normalized) {
        showToast("Color no válido. Usa nombres (negro, azul), hex (#000000), rgb(0,0,0) o hsl(0,0%,0%).");
        return;
    }

    // Evitar duplicados
    if (userColors.some(c => c.raw.toLowerCase() === raw.toLowerCase())) {
        showToast("Ese color ya fue agregado");
        input.value = "";
        return;
    }

    userColors.push({ raw: raw, normalized: normalized });

    const specList = document.getElementById("specList");
    const specBtn = document.createElement("div");
    specBtn.className = "spec-btn";

    const swatch = document.createElement("span");
    swatch.className = "spec-swatch";
    swatch.style.backgroundColor = normalized;

    const label = document.createElement("span");
    label.innerText = raw;

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "✖";
    removeBtn.className = "remove-spec";
    removeBtn.setAttribute("aria-label", "Eliminar color específico");
    removeBtn.onclick = () => {
        userColors = userColors.filter((c) => c.raw.toLowerCase() !== raw.toLowerCase());
        specBtn.remove();
    };

    specBtn.appendChild(swatch);
    specBtn.appendChild(label);
    specBtn.appendChild(removeBtn);
    specList.appendChild(specBtn);

    input.value = "";
}

// Detectar Enter en los inputs
document.getElementById("tema").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        generateThemePalette();
    }
});

document.getElementById("specInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addSpec();
    }
});
