// MATEMÁTICAS DE COLOR

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

window.getLuminance = function(hex) {
    const rgb = hex.replace('#', '').match(/.{2}/g).map(x => {
        const s = parseInt(x, 16) / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

window.getContrastRatio = function(hex1, hex2) {
    const l1 = window.getLuminance(hex1);
    const l2 = window.getLuminance(hex2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

window.getBestTextColor = (bgColor) => (window.getLuminance(bgColor) > 0.45 ? '#1a1a1a' : '#f5f5f5');

//GENERACIÓN DE PALETAS 

function getHarmonicPalette() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 50) + 40; 
    const l = Math.floor(Math.random() * 65) + 15; // Rango que permite fondos oscuros naturales
    
    const tipos = ['mono', 'analogo', 'complementario', 'triada', 'tetradica'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    let c60, c30, c10;

    switch(tipo) {
        case 'mono':
            c60 = window.hslToHex(h, s, l);
            c30 = window.hslToHex(h, s - 15, l > 50 ? l - 25 : l + 25);
            c10 = window.hslToHex(h, s + 10, l > 50 ? l - 45 : l + 45);
            break;
        case 'analogo':
            c60 = window.hslToHex(h, s, l);
            c30 = window.hslToHex((h + 30) % 360, s, l > 50 ? l - 15 : l + 15);
            c10 = window.hslToHex((h + 60) % 360, s + 10, l > 50 ? l - 25 : l + 25);
            break;
        case 'complementario':
            c60 = window.hslToHex(h, s, l);
            c30 = window.hslToHex(h, s - 10, l > 50 ? l - 20 : l + 20);
            c10 = window.hslToHex((h + 180) % 360, s + 15, l);
            break;
        case 'triada':
            c60 = window.hslToHex(h, s, l);
            c30 = window.hslToHex((h + 120) % 360, s - 5, l > 50 ? l - 10 : l + 10);
            c10 = window.hslToHex((h + 240) % 360, s + 5, l);
            break;
        case 'tetradica':
            c60 = window.hslToHex(h, s, l);
            c30 = window.hslToHex((h + 180) % 360, s, l > 50 ? l - 20 : l + 20);
            c10 = window.hslToHex((h + 90) % 360, s + 10, l);
            break;
        default:
            c60 = window.hslToHex(h, s, l);
            c30 = window.hslToHex(h, s, l > 50 ? l - 30 : l + 30);
            c10 = window.hslToHex(h, s, l > 50 ? l - 50 : l + 50);
    }
    return { c60, c30, c10, tipo };
}

// LÓGICA PRINCIPAL 

window.generateRandomPalette = function() {
    const previewContainer = document.querySelector('.mockup-container');
    let paleta, t60, ratio, esAceptable = false;

    // Bucle de calidad: asegura legibilidad del fondo generado
    while (!esAceptable) {
        paleta = getHarmonicPalette();
        t60 = window.getBestTextColor(paleta.c60);
        ratio = window.getContrastRatio(paleta.c60, t60);
        if (ratio >= 4.5 || Math.random() < 0.10) esAceptable = true;
    }

    const t30 = window.getBestTextColor(paleta.c30);
    const t10 = window.getBestTextColor(paleta.c10);

    // DETERMINAR SI LA PALETA ES OSCURA DE NACIMIENTO
    const lum = window.getLuminance(paleta.c60);
    const isDarkBase = lum < 0.45;

    const variables = {
        '--background': paleta.c60,
        '--text': t60,
        '--secondary': paleta.c30,
        '--text-light': t30,
        '--accent': paleta.c10,
        '--text-cta': t10,
        '--border': paleta.c30 + '44'
    };

    // Aplicar a CSS
    Object.keys(variables).forEach(k => previewContainer.style.setProperty(k, variables[k]));

    // SINCRONIZACIÓN CRÍTICA CON configuracion.js
    // Esto evita que el modo oscuro regrese a la paleta anterior
    if (window.syncDarkModeStatus) {
        window.syncDarkModeStatus(isDarkBase, {
            background: paleta.c60,
            text: t60,
            secondary: paleta.c30,
            accent: paleta.c10
        });
    }

    // Actualizar semáforo
    if (window.verificarAccesibilidadGlobal) {
        window.verificarAccesibilidadGlobal({
            bg: paleta.c60, sec: paleta.c30, acc: paleta.c10,
            txt: t60, txtSec: t30, txtBtn: t10
        });
    }

    console.log(`Paleta Generada (${paleta.tipo}) - Dominancia: ${isDarkBase ? 'Oscura' : 'Clara'}`);
};

// Conversión HEX a HSL (para uso en otros scripts si es necesario)
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