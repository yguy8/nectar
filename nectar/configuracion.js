//Este archivo gestiona el guardado, el modo oscuro, el copiado de código y semáforo WCGA

// UTILIDADES DE OBTENCIÓN DE DATOS ---
function getCurrentColors() {
    const container = document.querySelector('.mockup-container');
    const style = getComputedStyle(container);
    
    // Leemos las variables CSS directamente del contenedor de previsualización
    return {
        background: style.getPropertyValue('--background').trim(),
        text: style.getPropertyValue('--text').trim(),
        secondary: style.getPropertyValue('--secondary').trim(),
        accent: style.getPropertyValue('--accent').trim(),
        border: style.getPropertyValue('--border').trim()
    };
}

//FORMATEADORES PARA COPIADO
//hacer que copie ambos modos oscuro y claro 
const formatters = {
    //CSS CUSTOM PROPERTIES 
    css: (c) => {
        const isDark = window.getLuminance(c.background) < 0.5;
        //invertir los colores
        const opp = (isDark && originalPalette) ? originalPalette : {
            background: '#ffffff',
            text: '#1a1a1a',
            secondary: '#f3f4f6',
            accent: c.accent
        };

        return `/* --- CONFIGURACIÓN DE COLORES --- */

        /* MODO ${isDark ? 'OSCURO' : 'CLARO'} (ACTUAL) */
        :root {
        --background: ${c.background};
        --text: ${c.text};
        --secondary: ${c.secondary};
        --accent: ${c.accent};
        --border: ${c.secondary}44;
        }

        /* MODO ${isDark ? 'CLARO' : 'OSCURO'} (OPUESTO) */
        /* Aplica esta clase al body o contenedor principal */
        .${isDark ? 'light-mode' : 'dark'} {
        --background: ${opp.background || opp.background};
        --text: ${isDark ? '#1a1a1a' : '#f1f1f1'};
        --secondary: ${opp.secondary};
        --accent: ${opp.accent};
        --border: ${opp.secondary}44;
        }`;
    },

    // SCSS 
    scss: (c) => {
        const isDark = window.getLuminance(c.background) < 0.5;
        
                return `// --- VARIABLES SCSS ---
        $bg-main: ${c.background};
        $text-main: ${c.text};
        $secondary-main: ${c.secondary};
        $accent-main: ${c.accent};
        $border-main: ${c.secondary}44;

        // Mapa de colores para iteración
        $theme: (
            "background": $bg-main,
            "text": $text-main,
            "secondary": $secondary-main,
            "accent": $accent-main
        );

        // Mixin para temas dinámicos
        @mixin theme-provider($is-dark: ${isDark}) {
            background-color: $bg-main;
            color: $text-main;
            
            .accent-element {
                color: $accent-main;
            }
        }`;
    },

    // TAILWIND CSS
    tailwind: (c) => {
        const isDark = window.getLuminance(c.background) < 0.5;
        return `// tailwind.config.js
        /** @type {import('tailwindcss').Config} */
        module.exports = {
        darkMode: 'class', // Habilita el modo oscuro basado en clases
        theme: {
            extend: {
            colors: {
                // Colores actuales (${isDark ? 'Dark Mode' : 'Light Mode'})
                'brand-bg': '${c.background}',
                'brand-text': '${c.text}',
                'brand-sec': '${c.secondary}',
                'brand-acc': '${c.accent}',
            },
            // Configuración recomendada para usar con variables CSS
            // background: 'var(--background)',
            // foreground: 'var(--text)',
            },
        },
        plugins: [],
        }`;
    }
};

// FUNCIÓN DE COPIADO INTEGRADA
window.copyToClipboard = async function(format, event) {
    const btn = event.currentTarget; 
    const originalText = btn.innerText;
    const colors = getCurrentColors();
    
    if (!formatters[format]) {
        console.error('Formato no reconocido:', format);
        return;
    }

    const textToCopy = formatters[format](colors);

    try {
        await navigator.clipboard.writeText(textToCopy);
        
        btn.innerText = "¡Copiado!";
        btn.style.pointerEvents = "none"; // Evita múltiples clics rápidos
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.pointerEvents = "auto";
        }, 2000);

    } catch (err) {
        console.error('Error al copiar: ', err);
        btn.innerText = "Error";
        setTimeout(() => { btn.innerText = originalText; }, 2000);
    }
};


//MODO OSCURO (INVERSIÓN INTELIGENTE)
let isDarkModeActive = false;
let originalPalette = null; // Guarda la paleta generada o editada
// Icono de Sol para cuando estés en Modo Oscuro (para volver al claro)
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z" /><path d="M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.218 -1.567l.102 .07z" /><path d="M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z" /><path d="M12 5a7 7 0 1 1 -6.996 7.26l-.004 -.26l.004 -.26a7 7 0 0 1 6.996 -6.74z" /><path d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z" /><path d="M18.313 5.603a1 1 0 0 1 1.32 -.083l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.3 -1.414z" /><path d="M7.007 5.69a1 1 0 0 1 0 1.414l-.7 .7a1 1 0 0 1 -1.414 -1.414l.7 -.7a1 1 0 0 1 1.414 0z" /><path d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" /><path d="M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" /></svg>`;
// Icono de Luna para cuando estés en Modo Claro (para ir al oscuro)
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z" /></svg>`;

window.handleDarkModeClick = function() {
    const btnText = document.getElementById('dark-mode-text');
    const btnIcon = document.getElementById('dark-mode-icon');

    if (!isDarkModeActive) {
        originalPalette = getCurrentColors(); 
        
        applyScientificDark(originalPalette);
        
        if(btnText) btnText.innerText = "Modo Claro";
        if(btnIcon) btnIcon.innerHTML = sunIcon; 
        isDarkModeActive = true;
    } else {
        applyOriginalPalette(originalPalette);
        
        if(btnText) btnText.innerText = "Modo Oscuro";
        if(btnIcon) btnIcon.innerHTML = moonIcon;
        isDarkModeActive = false;
    }
};

// FUNCIÓN PARA INVERTIR COLORES
function applyScientificDark(base) {
    if (!window.hexToHsl || !window.hslToHex) return;
    const accHsl = window.hexToHsl(base.accent);
    const bgHsl = window.hexToHsl(base.background);
    const newBg = window.hslToHex(accHsl.h, Math.max(accHsl.s, 20), 15);
    let newAcc = base.background;
    if (bgHsl.l > 95) newAcc = "#f4da6c"; 
    const secHsl = window.hexToHsl(base.secondary);
    const newSec = window.hslToHex(secHsl.h, Math.max(secHsl.s, 40), 60);

    const newTxt = "#f1f1f1";

    updateAllUI(newBg, newTxt, newSec, newAcc);
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

