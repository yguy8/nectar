const getElement = (id) => document.getElementById(id);

// ABRIR / CERRAR FORMULARIO
window.switchTab = function(type) {
    const panel = getElement('color-form-panel');
    if (type === 'input') {
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            syncInputsWithPreview(); 
        }
    } else {
        panel.classList.add('hidden');
        if(typeof window.generateRandomPalette === "function") window.generateRandomPalette();
    }
};

// ACTUALIZAR UN COLOR ESPECÍFICO
window.updateSpecificColor = function(part, value) {
    const previewContainer = document.querySelector('.mockup-container');
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) return;

    // Actualizar el input de texto del color que estamos tocando
    const textInput = getElement(`hex-${part}`);
    if (textInput) textInput.value = value.toUpperCase();

    const mappings = {
        'bg':  { main: '--background', textVar: '--text' },
        'sec': { main: '--secondary',  textVar: '--text-light' },
        'acc': { main: '--accent',     textVar: '--text-cta' },
        'c4':  { main: '--color-4',    textVar: '--text-c4' },
        'c5':  { main: '--color-5',    textVar: '--text-c5' }
    };

    const map = mappings[part];
    if (map) {
        // Solo actualizamos la variable específica, nada más
        previewContainer.style.setProperty(map.main, value);
        previewContainer.style.setProperty(map.textVar, window.getBestTextColor(value));
        
        // El borde ahora es una variable independiente para que no ensucie
        if (part === 'sec') {
            previewContainer.style.setProperty('--border', value + '44');
        }
    }

    triggerWCAGUpdate();
};

// SINCRONIZAR TEXTO A PICKER
window.syncTextToPicker = function(textInput, pickerId, part) {
    let val = textInput.value;
    if (val.length > 0 && !val.startsWith('#')) val = '#' + val;
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val)) {
        getElement(pickerId).value = val;
        window.updateSpecificColor(part, val);
    }
};

// GENERAR ARMONÍA BASADA EN EL FONDO ACTUAL 
window.generateHarmoniesFromCurrent = function() {
    const baseHex = getElement('user-bg').value;
    const { h, s, l } = window.hexToHsl(baseHex);
    
    // Elegimos un tipo de armonía al azar para los otros 4 colores
    const tipos = ['analoga', 'completa', 'triada-extendida'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    
    let c30, c10, c4, c5;

    switch(tipo) {
        case 'analoga':
            // Repartición en abanico: -40°, -20°, +20°, +40°
            c30 = window.hslToHex((h + 20) % 360, s, l > 50 ? l - 10 : l + 10);
            c10 = window.hslToHex((h + 40) % 360, s + 5, l > 50 ? l - 20 : l + 20);
            c4  = window.hslToHex((h - 20 + 360) % 360, s, l);
            c5  = window.hslToHex((h - 40 + 360) % 360, s + 5, l);
            break;
            
        case 'completa':
            // Fondo y análogos vs Opuestos
            c30 = window.hslToHex((h + 30) % 360, s, l); // Análogo 1
            c4  = window.hslToHex((h - 30 + 360) % 360, s, l); // Análogo 2
            c10 = window.hslToHex((h + 180) % 360, s + 10, l); // Complementario directo
            c5  = window.hslToHex((h + 160) % 360, s + 10, l); // Split complementario
            break;

        case 'triada-extendida':
            // Puntos de la tríada con variaciones de saturación
            c30 = window.hslToHex((h + 120) % 360, s, l);
            c10 = window.hslToHex((h + 240) % 360, s, l);
            c4  = window.hslToHex((h + 120) % 360, s - 20, l > 50 ? l + 10 : l - 10);
            c5  = window.hslToHex((h + 240) % 360, s - 20, l > 50 ? l + 10 : l - 10);
            break;
    }

    // Inyectar colores a los inputs y a la vista
    const updates = { 'sec': c30, 'acc': c10, 'c4': c4, 'c5': c5 };
    
    Object.keys(updates).forEach(key => {
        window.updateSpecificColor(key, updates[key]);
        const picker = getElement(`user-${key}`);
        if (picker) picker.value = updates[key];
    });
    
    console.log(`Armonía manual generada: ${tipo}`);
};

// UTILIDADES DE SINCRONIZACIÓN INICIAL
function syncInputsWithPreview() {
    const container = document.querySelector('.mockup-container');
    const style = getComputedStyle(container);
    
    // Solo estos 3
    const parts = ['bg', 'sec', 'acc'];
    const vars = ['--background', '--secondary', '--accent'];

    parts.forEach((part, index) => {
        const color = style.getPropertyValue(vars[index]).trim();
        if (color) {
            const picker = getElement(`user-${part}`);
            const text = getElement(`hex-${part}`);
            if (picker) picker.value = color;
            if (text) text.value = color.toUpperCase();
        }
    });
}
function triggerWCAGUpdate() {
    const getVal = (id) => getElement(id)?.value || '#ffffff';

    const colors = {
        bg: getVal('user-bg'),
        sec: getVal('user-sec'),
        acc: getVal('user-acc'),
        c4: getVal('user-c4'),
        c5: getVal('user-c5'),
        txt: window.getBestTextColor(getVal('user-bg')),
        txtSec: window.getBestTextColor(getVal('user-sec')),
        txtBtn: window.getBestTextColor(getVal('user-acc'))
    };
    
    if(typeof window.verificarAccesibilidadGlobal === "function") {
        window.verificarAccesibilidadGlobal(colors);
    }
}