// Conversión HSL a HEX
const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

const generateHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

function getLuminance(hex) {
    const rgb = hex.replace('#', '').match(/.{2}/g).map(x => {
        const s = parseInt(x, 16) / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function getContrastRatio(hex1, hex2) {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const getBestTextColor = (bgColor) => (getLuminance(bgColor) > 0.5 ? '#1a1a1a' : '#f5f5f5');

// Función para generar una paleta armónica
function getHarmonicPalette() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 40) + 40; // Saturación estable (40-80%)
    const l = Math.floor(Math.random() * 60) + 20; // Luminosidad base (20-80%)
    
    const tipos = ['puro', 'mono', 'analogo', 'complementario', 'triada'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];

    let c60, c30, c10;

    switch(tipo) {
        case 'mono':
            c60 = hslToHex(h, s, l);
            c30 = hslToHex(h, s - 20, l > 50 ? l - 20 : l + 20);
            c10 = hslToHex(h, s, l > 50 ? l - 40 : l + 40);
            break;
        case 'analogo':
            c60 = hslToHex(h, s, l);
            c30 = hslToHex((h + 30) % 360, s, l);
            c10 = hslToHex((h + 60) % 360, s, l);
            break;
        case 'complementario':
            c60 = hslToHex(h, s, l);
            c30 = hslToHex(h, s - 10, l > 50 ? l - 10 : l + 10);
            c10 = hslToHex((h + 180) % 360, s + 10, l);
            break;
        case 'triada':
            c60 = hslToHex(h, s, l);
            c30 = hslToHex((h + 120) % 360, s, l);
            c10 = hslToHex((h + 240) % 360, s, l);
            break;
        default: // Azar puro
            c60 = generateHex();
            c30 = generateHex();
            c10 = generateHex();
    }
    return { c60, c30, c10, tipo };
}

// Generador aleatorio de paletas con verificación de accesibilidad
function generateRandomPalette() {
    const previewContainer = document.querySelector('.mockup-container');
    const size = parseInt(document.getElementById('palette-size').value) || 5;
    
    let paleta, t60, ratio, esAceptable = false;

    // 90% de las veces buscamos que el fondo sea legible
    while (!esAceptable) {
        paleta = getHarmonicPalette();
        t60 = getBestTextColor(paleta.c60);
        ratio = getContrastRatio(paleta.c60, t60);

        if (ratio >= 4.5 || Math.random() < 0.10) esAceptable = true;
    }

    const t30 = getBestTextColor(paleta.c30);
    const t10 = getBestTextColor(paleta.c10);

    let variables = {
        '--background': paleta.c60,
        '--text': t60,
        '--secondary': paleta.c30,
        '--text-light': t30,
        '--accent': paleta.c10,
        '--text-cta': t10,
        '--border': paleta.c30 + '44'
    };

    Object.keys(variables).forEach(k => previewContainer.style.setProperty(k, variables[k]));
    if (size === 3) previewContainer.classList.add('palette-size-3');
    else previewContainer.classList.remove('palette-size-3');

    verificarAccesibilidadGlobal({
        bg: paleta.c60, sec: paleta.c30, acc: paleta.c10,
        txt: t60, txtSec: t30, txtBtn: t10
    });

    console.log(`Modo: ${paleta.tipo}`);
}

// Semaforo de accesibilidad WCAG
function verificarAccesibilidadGlobal(colores) {
    const parejas = [
        { fondo: colores.bg, texto: colores.txt },
        { fondo: colores.sec, texto: colores.txtSec },
        { fondo: colores.acc, texto: colores.txtBtn },
        { fondo: colores.bg, texto: colores.acc }
    ];
    const fallas = parejas.filter(p => getContrastRatio(p.fondo, p.texto) < 4.5).length;
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

function switchTab(type) {
    if (type === 'random') generateRandomPalette();
}