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

// --- CONVERSORES (Fundamentales para la manipulación orgánica) ---

function hexToHsl(hex) {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = hex;
    const c = ctx.fillStyle; 
    let r = parseInt(c.substring(1, 3), 16) / 255;
    let g = parseInt(c.substring(3, 5), 16) / 255;
    let b = parseInt(c.substring(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

// --- UTILIDADES ---

function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

function copyText(element) {
    const textSpan = element.parentElement.querySelector(".color-name");
    const originalText = textSpan.innerText;
    navigator.clipboard.writeText(originalText).then(() => {
        textSpan.innerText = "¡Copiado!";
        setTimeout(() => (textSpan.innerText = originalText), 1500);
    });
}

function copyPalette(button) {
    const group = button.closest(".palette-group");
    const colors = [...group.querySelectorAll(".color-name")].map((span) => span.innerText);
    navigator.clipboard.writeText(colors.join(", ")).then(() => {
        button.innerText = "¡Paleta copiada!";
        setTimeout(() => (button.innerText = "Copiar paleta"), 1500);
    });
}

// --- GENERADOR ORGÁNICO (AZAR BASADO EN TEMA) ---

function generateThemePalette() {
    const tema = document.getElementById("tema").value.trim();
    const container = document.getElementById("paletteContainer");

    if (!tema) {
        showToast("Por favor ingresa un tema para comenzar");
        return;
    }

    container.innerHTML = "";

    // Generamos 4 paletas que no siguen reglas, solo "vibras" del tema
    for (let i = 0; i < 4; i++) {
        const group = document.createElement("div");
        group.className = "palette-group";
        
        // Botón de eliminar
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "✖";
        deleteBtn.className = "remove-btn";
        deleteBtn.onclick = () => group.remove();
        group.appendChild(deleteBtn);

        // AQUÍ CONECTARÁS EL RAG:
        // El RAG analizará el "tema" y debería devolvernos un color base diferente para cada grupo
        let seedHex = randomColor(); 
        let hsl = hexToHsl(seedHex);

        // Generamos 4 colores por grupo con variaciones aleatorias fuertes
        for (let j = 0; j < 4; j++) {
            // En lugar de ángulos fijos, rotamos el tono de forma impredecible
            // pero manteniendo cierta cercanía para que no sea un caos total
            let h = (hsl.h + (Math.random() * 120 - 60)) % 360; 
            if (h < 0) h += 360;

            // Saturación y Brillo totalmente dinámicos
            let s = Math.max(10, Math.min(95, hsl.s + (Math.random() * 40 - 20)));
            let l = Math.max(10, Math.min(90, hsl.l + (Math.random() * 50 - 25)));

            const finalHex = hslToHex(h, s, l);

            const card = document.createElement("div");
            card.className = "color-card";
            card.style.backgroundColor = finalHex;
            card.innerHTML = `
                <span class="color-swatch" style="background:${finalHex}"></span>
                <span class="color-name">${finalHex}</span>
                <button onclick="copyText(this)" class="copy-color-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                        <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                        <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
                    </svg> 
                </button>
            `;
            group.appendChild(card);
        }

        const copyBtn = document.createElement("button");
        copyBtn.innerText = "Copiar paleta";
        copyBtn.className = "copy-btn";
        copyBtn.onclick = () => copyPalette(copyBtn);
        group.appendChild(copyBtn);

        container.appendChild(group);
    }
}

// Event Listener
document.getElementById("tema").addEventListener("keydown", (e) => {
    if (e.key === "Enter") generateThemePalette();
});