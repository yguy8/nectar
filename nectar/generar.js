//CONVERSIÓN
window.hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

window.hexToHsl = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
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

const getElement = (id) => document.getElementById(id);

// SINCRONIZACIÓN FORMULARIO-AL AZAR    

// Actualiza los inputs del formulario cuando se genera una paleta al azar
window.syncFormWithPalette = function(colors) {
    const parts = ['bg', 'sec', 'acc'];
    parts.forEach(part => {
        const val = colors[part];
        if (!val) return;
        const picker = getElement(`user-${part}`);
        const text = getElement(`hex-${part}`);
        if (picker) picker.value = val;
        if (text) text.value = val.toUpperCase();
    });
};

//GESTIÓN DEL FORMULARIO (CAMBIO MANUAL DE COLORES)

window.switchTab = function(type) {
    const panel = getElement('color-form-panel');
    if (type === 'input') {
        panel.classList.toggle('hidden');
    } else if (type === 'random') {
        window.generateRandomPalette();
    }
};

window.updateSpecificColor = function(part, value) {
    const previewContainer = document.querySelector('.mockup-container');
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) return;

    // Sincronizar texto y picker dentro del formulario
    const textInput = getElement(`hex-${part}`);
    const pickerInput = getElement(`user-${part}`);
    if (textInput) textInput.value = value.toUpperCase();
    if (pickerInput) pickerInput.value = value;

    const mappings = {
        'bg':  { main: '--background', textVar: '--text' },
        'sec': { main: '--secondary',  textVar: '--text-light' },
        'acc': { main: '--accent',     textVar: '--text-cta' }
    };

    const map = mappings[part];
    if (map) {
        previewContainer.style.setProperty(map.main, value);
        previewContainer.style.setProperty(map.textVar, window.getBestTextColor(value));
        if (part === 'sec') {
            previewContainer.style.setProperty('--border', value + '44');
        }
    }
    triggerWCAGUpdate();
};

window.syncTextToPicker = function(textInput, pickerId, part) {
    let val = textInput.value;
    if (val.length > 0 && !val.startsWith('#')) val = '#' + val;
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val)) {
        window.updateSpecificColor(part, val);
    }
};

//  GENERACIÓN ALEATORIA (AZAR)
function getHarmonicPalette() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 40) + 40; 
    const l = Math.floor(Math.random() * 40) + 30;
    
    // Tipos de armonía (simplificado para tus 3 colores principales)
    const tipos = ['analogo', 'complementario', 'triada'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    let cBg, cSec, cAcc;

    switch(tipo) {
        case 'analogo':
            cBg = window.hslToHex(h, s, l);
            cSec = window.hslToHex((h + 30) % 360, s, l);
            cAcc = window.hslToHex((h + 60) % 360, s, l + 10);
            break;
        case 'complementario':
            cBg = window.hslToHex(h, s, l);
            cSec = window.hslToHex(h, s - 10, l > 50 ? l - 20 : l + 20);
            cAcc = window.hslToHex((h + 180) % 360, s + 10, l);
            break;
        case 'triada':
            cBg = window.hslToHex(h, s, l);
            cSec = window.hslToHex((h + 120) % 360, s, l);
            cAcc = window.hslToHex((h + 240) % 360, s, l);
            break;
    }
    return { bg: cBg, sec: cSec, acc: cAcc };
}

window.generateRandomPalette = function() {
    const previewContainer = document.querySelector('.mockup-container');
    let paleta, tBg, ratio, esAceptable = false;

    // calidad (asegurar contraste mínimo)
    while (!esAceptable) {
        paleta = getHarmonicPalette();
        tBg = window.getBestTextColor(paleta.bg);
        ratio = window.getContrastRatio(paleta.bg, tBg);
        if (ratio >= 4.5 || Math.random() < 0.1) esAceptable = true;
    }

    // Mockup (prototipo)
    const vars = {
        '--background': paleta.bg,
        '--text': tBg,
        '--secondary': paleta.sec,
        '--text-light': window.getBestTextColor(paleta.sec),
        '--accent': paleta.acc,
        '--text-cta': window.getBestTextColor(paleta.acc),
        '--border': paleta.sec + '44'
    };
    Object.keys(vars).forEach(k => previewContainer.style.setProperty(k, vars[k]));
    
    // actualizar formulario (el usuario vea qué colores salieron)
    window.syncFormWithPalette(paleta);

    triggerWCAGUpdate();
};

//ACCESIBILIDAD (WCAG)
function triggerWCAGUpdate() {
    const getVal = (id) => getElement(id)?.value || '#ffffff';
    const colors = {
        bg: getVal('user-bg'),
        sec: getVal('user-sec'),
        acc: getVal('user-acc'),
        txt: window.getBestTextColor(getVal('user-bg')),
        txtSec: window.getBestTextColor(getVal('user-sec')),
        txtBtn: window.getBestTextColor(getVal('user-acc'))
    };
    
    if(typeof window.verificarAccesibilidadGlobal === "function") {
        window.verificarAccesibilidadGlobal(colors);
    }
}

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
