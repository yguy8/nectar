// Conversión HSL a HEX
    window.hslToHex = (h, s, l) => {
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

window.getBestTextColor = (bgColor) => (getLuminance(bgColor) > 0.5 ? '#1a1a1a' : '#f5f5f5');

// Función para generar una paleta armónica
function getHarmonicPalette() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 50) + 40; // Saturación balanceada (40-90)
    const l = Math.floor(Math.random() * 60) + 20; // Luz base (20-80)
    
    // variedad excéntrica
    const tipos = ['puro', 'mono', 'analogo', 'complementario', 'triada', 'tetradica'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];

    let c60, c30, c10;

    switch(tipo) {
        case 'mono':
            c60 = hslToHex(h, s, l);
            c30 = hslToHex(h, s - 15, l > 50 ? l - 25 : l + 25);
            c10 = hslToHex(h, s + 10, l > 50 ? l - 45 : l + 45);
            break;

        case 'analogo':
            c60 = hslToHex(h, s, l);
            // El secundario y acento se mueven en matiz y ligeramente en luz
            c30 = hslToHex((h + 30) % 360, s, l > 50 ? l - 15 : l + 15);
            c10 = hslToHex((h + 60) % 360, s + 10, l > 50 ? l - 25 : l + 25);
            break;

        case 'complementario':
            c60 = hslToHex(h, s, l);
            c30 = hslToHex(h, s - 10, l > 50 ? l - 20 : l + 20);
            c10 = hslToHex((h + 180) % 360, s + 15, l); // El opuesto puro
            break;

        case 'triada':
            // Tres colores equidistantes
            c60 = hslToHex(h, s, l);
            c30 = hslToHex((h + 120) % 360, s - 5, l > 50 ? l - 10 : l + 10);
            c10 = hslToHex((h + 240) % 360, s + 5, l);
            break;

        case 'tetradica':
            // Dos pares de complementarios
            c60 = hslToHex(h, s, l);
            c30 = hslToHex((h + 180) % 360, s, l > 50 ? l - 20 : l + 20);
            c10 = hslToHex((h + 90) % 360, s + 10, l);
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

function switchTab(type) {
    if (type === 'random') generateRandomPalette();
}

window.hexToHsl = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b), h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
};