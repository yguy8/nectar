//Este archivo gestiona el guardado, el modo oscuro, el copiado de código y semáforo WCGA

// UTILIDADES DE OBTENCIÓN DE DATOS ---
function getCurrentColors() {
    const container = document.querySelector('.mockup-container');
    const style = getComputedStyle(container);
    
    return {
        primary: style.getPropertyValue('--primary').trim() || '#f4da6c',
        secondary: style.getPropertyValue('--secondary').trim() || '#6c9ef4',
        accent: style.getPropertyValue('--accent').trim() || '#f46c9e',
        background: style.getPropertyValue('--background').trim() || '#ffffff',
        text: style.getPropertyValue('--text').trim() || '#333333',
        border: style.getPropertyValue('--border').trim() || '#eeeeee'
    };
}

//FORMATEADORES PARA COPIADO
const formatters = {
    css: (c) => `:root {
    --primary: ${c.primary};
    --secondary: ${c.secondary};
    --accent: ${c.accent};
    --background: ${c.background};
    --text: ${c.text};
    --border: ${c.border};
}`,

    tailwind: (c) => `// tailwind.config.js
    module.exports = {
    theme: {
        extend: {
        colors: {
            primary: '${c.primary}',
            secondary: '${c.secondary}',
            accent: '${c.accent}',
            background: '${c.background}',
            text: '${c.text}',
            border: '${c.border}',
        }
        }
    }
}`,

    scss: (c) => `// Variables SASS
    $primary: ${c.primary};
    $secondary: ${c.secondary};
    $accent: ${c.accent};
    $background: ${c.background};
    $text: ${c.text};
    $border: ${c.border};`
};

// FUNCIÓN DE COPIADO
window.copyToClipboard = async function(format, event) {
    const btn = event.currentTarget; 
    const originalText = btn.innerText;
    const colors = getCurrentColors();
    
    if (!formatters[format]) return;
    const textToCopy = formatters[format](colors);

    try {
        await navigator.clipboard.writeText(textToCopy);
        btn.innerText = "¡Copiado!";
        setTimeout(() => {
            btn.innerText = originalText;
        }, 2000);
    } catch (err) {
        console.error('Error al copiar: ', err);
    }
};

//MODO OSCURO (INVERSIÓN INTELIGENTE)
let isDarkModeActive = false;
let originalPalette = null; // Guarda la paleta generada o editada

window.handleDarkModeClick = function() {
    const btnText = document.getElementById('dark-mode-text');
    const btnIcon = document.getElementById('dark-mode-icon');

    // Icono de Sol para cuando estés en Modo Oscuro (para volver al claro)
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z" /><path d="M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.218 -1.567l.102 .07z" /><path d="M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z" /><path d="M12 5a7 7 0 1 1 -6.996 7.26l-.004 -.26l.004 -.26a7 7 0 0 1 6.996 -6.74z" /><path d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z" /><path d="M18.313 5.603a1 1 0 0 1 1.32 -.083l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.3 -1.414z" /><path d="M7.007 5.69a1 1 0 0 1 0 1.414l-.7 .7a1 1 0 0 1 -1.414 -1.414l.7 -.7a1 1 0 0 1 1.414 0z" /><path d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" /><path d="M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" /></svg>`;
    
    // Icono de Luna para cuando estés en Modo Claro (para ir al oscuro)
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z" /></svg>`;

    if (!isDarkModeActive) {
        // --- ACTIVAR MODO OSCURO ---
        originalPalette = getCurrentColors(); 
        applyScientificDark(originalPalette);
        
        if(btnText) btnText.innerText = "Modo Claro";
        if(btnIcon) btnIcon.innerHTML = sunIcon; 
        isDarkModeActive = true;
    } else {
        // --- VOLVER A MODO CLARO ---
        applyOriginalPalette(originalPalette);
        
        if(btnText) btnText.innerText = "Modo Oscuro";
        if(btnIcon) btnIcon.innerHTML = moonIcon;
        isDarkModeActive = false;
    }
};

// FUNCIÓN PARA INVERTIR COLORES
function applyScientificDark(base) {
    if (!window.hexToHsl || !window.hslToHex) return;

    // Extraemos el matiz (H) de tus colores de marca
    const secHsl = window.hexToHsl(base.secondary);
    const accHsl = window.hexToHsl(base.accent);

    // FONDO: Matiz de tu marca, pero casi negro (L=8%) y muy poca saturación (S=15%)
    const darkBg = window.hslToHex(secHsl.h, 15, 8); 
    
    // TEXTO: Un blanco orgánico con un toque de tu color (L=92%)
    const lightText = window.hslToHex(secHsl.h, 10, 92);
    
    // SECUNDARIO: Lo subimos de luz para que destaque sobre el fondo oscuro
    const brightSec = window.hslToHex(secHsl.h, Math.max(secHsl.s, 40), 60);
    
    // ACENTO: Lo hacemos vibrante para que el CTA resalte
    const brightAcc = window.hslToHex(accHsl.h, Math.max(accHsl.s, 50), 55);

    updateAllUI(darkBg, lightText, brightSec, brightAcc);
}

function applyOriginalPalette(base) {
    if (!base) return;
    updateAllUI(base.background, base.text, base.secondary, base.accent);
}

// ACTUALIZACIÓN DE LA INTERFAZ 
function updateAllUI(bg, txt, sec, acc) {
    const container = document.querySelector('.mockup-container');
    
    //Aplicar variables CSS al Mockup
    const vars = {
        '--background': bg,
        '--text': txt,
        '--secondary': sec,
        '--accent': acc,
        '--text-light': window.getBestTextColor(sec),
        '--text-cta': window.getBestTextColor(acc),
        '--border': sec + '44'
    };
    Object.keys(vars).forEach(k => container.style.setProperty(k, vars[k]));

    // Sincronizar todos los inputs del formulario para que coincidan
    const inputsMap = {
        'user-bg': bg, 'hex-bg': bg,
        'user-sec': sec, 'hex-sec': sec,
        'user-acc': acc, 'hex-acc': acc
    };
    Object.keys(inputsMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = id.startsWith('hex') ? inputsMap[id].toUpperCase() : inputsMap[id];
    });

    // Actualizar Semáforo de Accesibilidad
    if (window.verificarAccesibilidadGlobal) {
        window.verificarAccesibilidadGlobal({
            bg, sec, acc,
            txt, txtSec: vars['--text-light'], txtBtn: vars['--text-cta']
        });
    }
}

// RESET DEL BOTÓN AL GENERAR AL AZAR 
// Llama a esta función dentro de generateRandomPalette()
window.resetDarkModeButton = function() {
    isDarkModeActive = false;
    const btnText = document.getElementById('dark-mode-text');
    const btnIcon = document.getElementById('dark-mode-icon');
    if(btnText) btnText.innerText = "Modo Oscuro";
    if(btnIcon) btnIcon.innerText = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ededed" class="icon icon-tabler icons-tabler-filled icon-tabler-moon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z" /></svg>`;
};


//PERSISTENCIA (LOCAL STORAGE)
function savePaletteLocally() {
    const colors = getCurrentColors();
    localStorage.setItem('nectar_palette_data', JSON.stringify(colors));
}

function loadPaletteLocally() {
    const saved = localStorage.getItem('nectar_palette_data');
    if (saved) {
        const c = JSON.parse(saved);
        setTimeout(() => {
            if (window.updateSpecificColor) {
                window.updateSpecificColor('bg', c.background);
                window.updateSpecificColor('sec', c.secondary);
                window.updateSpecificColor('acc', c.accent);
                
                const container = document.querySelector('.mockup-container');
                container.style.setProperty('--text', c.text);
            }
        }, 150);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', loadPaletteLocally);

//Semáforo WCGA para la detección de accesibilidad
function verificarAccesibilidadGlobal(colores) {
    const parejas = [
        // texto principal
        { fondo: colores.bg, texto: colores.txt }, 
        
        // texto de ejemplo
        { fondo: colores.sec, texto: colores.txt }, 
        
        // texto de botón
        { fondo: colores.acc, texto: colores.txtBtn },
        
        // sobre fondo general
        { fondo: colores.bg, texto: colores.acc }
    ];

    const ratios = parejas.map(p => getContrastRatio(p.fondo, p.texto));
    
    // Contamos cuántas combinaciones fallan el estándar AA (4.5)
    const fallas = ratios.filter(r => r < 4.5).length;
    
    updateWCAGStatus(fallas);
}

function updateWCAGStatus(numFallas) {
    const red = document.getElementById('light-red'), yellow = document.getElementById('light-yellow'), green = document.getElementById('light-green');
    const statusLabel = document.querySelector('.status-label');
    if (!red || !yellow || !green) return;
    [red, yellow, green].forEach(l => l.classList.remove('active'));

    if (numFallas === 0) {
        green.classList.add('active');
        statusLabel.innerText = "EXCELENTE";
        statusLabel.style.color = "var(--success)";
    } else if (numFallas <= 1) {
        yellow.classList.add('active');
        statusLabel.innerText = "EQUILIBRADO";
        statusLabel.style.color = "var(--medium)";
    } else {
        red.classList.add('active');
        statusLabel.innerText = "FALLA";
        statusLabel.style.color = "var(--danger)";
    }
}
