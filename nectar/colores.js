// --- FUNCIONES DE APOYO ---
const getElement = (id) => document.getElementById(id);

//  ABRIR / CERRAR FORMULARIO
window.switchTab = function(type) {
    const panel = getElement('color-form-panel');
    if (type === 'input') {
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            syncInputsWithPreview(); // Cargar colores actuales al abrir
        }
    } else {
        panel.classList.add('hidden');
        if(typeof generateRandomPalette === "function") generateRandomPalette();
    }
};

// ACTUALIZAR UN COLOR ESPECÍFICO (Al gusto del usuario)
window.updateSpecificColor = function(part, value) {
    const previewContainer = document.querySelector('.mockup-container');
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) return;

    // Actualizar el campo de texto correspondiente
    getElement(`hex-${part}`).value = value.toUpperCase();

    // Determinar qué variable CSS y qué color de texto actualizar
    const mappings = {
        'bg':  { main: '--background', textVar: '--text' },
        'sec': { main: '--secondary',  textVar: '--text-light' },
        'acc': { main: '--accent',     textVar: '--text-cta' }
    };

    const map = mappings[part];
    previewContainer.style.setProperty(map.main, value);
    previewContainer.style.setProperty(map.textVar, getBestTextColor(value));
    
    // Actualizar borde sutil si es el secundario
    if (part === 'sec') previewContainer.style.setProperty('--border', value + '44');

    // Refrescar WCAG
    triggerWCAGUpdate();
};

// SINCRONIZAR TEXTO A PICKER
window.syncTextToPicker = function(textInput, pickerId, part) {
    let val = textInput.value;
    if (val.length > 0 && !val.startsWith('#')) val = '#' + val;
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val)) {
        getElement(pickerId).value = val;
        updateSpecificColor(part, val);
    }
};

// GENERAR ARMONÍA BASADA EN EL FONDO ACTUAL
window.generateHarmoniesFromCurrent = function() {
    const baseHex = getElement('user-bg').value;
    const { h, s, l } = hexToHsl(baseHex);
    const tipos = ['mono', 'analogo', 'complementario', 'triada', 'tetradica'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];

    let c30, c10;

    switch(tipo) {
        case 'mono':
            c30 = hslToHex(h, s - 15, l > 50 ? l - 25 : l + 25);
            c10 = hslToHex(h, s + 10, l > 50 ? l - 45 : l + 45);
            break;
        case 'analogo':
            c30 = hslToHex((h + 30) % 360, s, l > 50 ? l - 15 : l + 15);
            c10 = hslToHex((h + 60) % 360, s + 10, l > 50 ? l - 25 : l + 25);
            break;
        case 'complementario':
            c30 = hslToHex(h, s - 10, l > 50 ? l - 20 : l + 20);
            c10 = hslToHex((h + 180) % 360, s + 15, l);
            break;
        default: // Triada
            c30 = hslToHex((h + 120) % 360, s - 5, l > 50 ? l - 10 : l + 10);
            c10 = hslToHex((h + 240) % 360, s + 5, l);
    }

    // Aplicar los colores generados a los otros campos
    updateSpecificColor('sec', c30);
    getElement('user-sec').value = c30;
    updateSpecificColor('acc', c10);
    getElement('user-acc').value = c10;
};

// UTILIDADES DE SINCRONIZACIÓN INICIAL
function syncInputsWithPreview() {
    const container = document.querySelector('.mockup-container');
    const style = getComputedStyle(container);
    
    const bg = style.getPropertyValue('--background').trim();
    const sec = style.getPropertyValue('--secondary').trim();
    const acc = style.getPropertyValue('--accent').trim();

    if (bg) { getElement('user-bg').value = bg; getElement('hex-bg').value = bg.toUpperCase(); }
    if (sec) { getElement('user-sec').value = sec; getElement('hex-sec').value = sec.toUpperCase(); }
    if (acc) { getElement('user-acc').value = acc; getElement('hex-acc').value = acc.toUpperCase(); }
}

function triggerWCAGUpdate() {
    const colors = {
        bg: getElement('user-bg').value,
        sec: getElement('user-sec').value,
        acc: getElement('user-acc').value,
        txt: getBestTextColor(getElement('user-bg').value),
        txtSec: getBestTextColor(getElement('user-sec').value),
        txtBtn: getBestTextColor(getElement('user-acc').value)
    };
    if(typeof verificarAccesibilidadGlobal === "function") verificarAccesibilidadGlobal(colors);
}