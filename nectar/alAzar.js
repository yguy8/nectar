/**
 * ARCHIVO: alAzar.js
 * Lógica de generación armónica y validación de contraste
 */

// 1. UTILIDADES DE COLOR
const generateHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

/**
 * Calcula la luminancia relativa para estándares WCAG
 */
function getLuminance(hex) {
    const rgb = hex.replace('#', '').match(/.{2}/g).map(x => {
        const s = parseInt(x, 16) / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

/**
 * Calcula el ratio de contraste entre dos colores (ej: 4.5)
 */
function getContrastRatio(hex1, hex2) {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Determina si el texto debe ser negro o blanco según el fondo
 */
const getBestTextColor = (bgColor) => (getLuminance(bgColor) > 0.5 ? '#1a1a1a' : '#ffffff');

// 2. FUNCIÓN PRINCIPAL
function generateRandomPalette() {
    // Obtenemos la cantidad elegida por el usuario
    const size = parseInt(document.getElementById('palette-size').value) || 5;
    const previewContainer = document.querySelector('.mockup-container');
    
    // Aplicamos Regla 60-30-10
    // 60% Dominante (Fondo principal)
    const color60 = generateHex(); 
    // 30% Secundario (Tarjetas/Header)
    const color30 = generateHex(); 
    // 10% Acento (Botones/Iconos)
    const color10 = generateHex(); 

    // Calculamos colores de texto automáticos para evitar invisibilidad
    const textOn60 = getBestTextColor(color60);
    const textOn30 = getBestTextColor(color30);
    const textOn10 = getBestTextColor(color10);

    // Mapeo de variables CSS
    let variables = {
        '--background': color60,      // Dominante
        '--text': textOn60,           // Contraste con dominante
        '--secondary': color30,      // Secundario
        '--text-light': textOn30,     // Contraste con secundario
        '--accent': color10,          // Acento
        '--border': color30 + '44'    // Borde sutil basado en el secundario
    };

    // Ajuste por cantidad (Si es 3, simplificamos la paleta visualmente)
    if (size === 3) {
        previewContainer.classList.add('palette-size-3');
    } else {
        previewContainer.classList.remove('palette-size-3');
    }

    // 3. APLICAR AL DOM
    Object.keys(variables).forEach(key => {
        previewContainer.style.setProperty(key, variables[key]);
    });

    // 4. ACTUALIZAR SEMÁFORO WCAG (Contraste Texto vs Fondo Dominante)
    const ratio = getContrastRatio(color60, textOn60);
    updateWCAGStatus(ratio);

    console.log(`Paleta Armónica Generada. Ratio de contraste: ${ratio.toFixed(2)}`);
}

/**
 * Actualiza visualmente el semáforo de accesibilidad
 */
function updateWCAGStatus(ratio) {
    const greenLight = document.getElementById('light-green');
    const redLight = document.getElementById('light-red');
    const ratioText = document.getElementById('contrast-ratio-text');
    const statusLabel = document.querySelector('.status-label');

    if (!greenLight || !redLight) return;

    ratioText.innerText = `${ratio.toFixed(2)}:1`;

    if (ratio >= 4.5) {
        // Pasa estándar AA
        greenLight.classList.add('active');
        redLight.classList.remove('active');
        statusLabel.innerText = "ACCESIBLE";
        statusLabel.style.color = "#2ecc71";
    } else {
        // Falla
        redLight.classList.add('active');
        greenLight.classList.remove('active');
        statusLabel.innerText = "BAJO CONTRASTE";
        statusLabel.style.color = "#e74c3c";
    }
}

/**
 * Interceptor para el botón del Header
 */
function switchTab(type) {
    if (type === 'random') {
        generateRandomPalette();
    } else {
        console.log("Cambiando a pestaña:", type);
        // Aquí puedes añadir la lógica para mostrar/ocultar otras secciones
    }
}