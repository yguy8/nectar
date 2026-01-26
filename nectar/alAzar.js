// Función para generar un color hexadecimal aleatorio
const generateHex = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};


// Calcula la luminosidad 
const getContrastYIQ = (hexcolor) => {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#333333' : '#ffffff';
};

//Función principal que modifica las variables CSS de la previsualización

function generateRandomPalette() {
    const primary = generateHex();
    const secondary = generateHex();
    const accent = generateHex();
    const background = generateHex();
    
    //  colores de texto para asegurar legibilidad
    const textOnPrimary = getContrastYIQ(primary);
    const textOnBG = getContrastYIQ(background);

    // el mapeo de variables CSS
    const newPalette = {
        '--primary': primary,
        '--secondary': secondary,
        '--accent': accent,
        '--background': background,
        '--text': textOnPrimary,      // Texto sobre el fondo primary (mockup-window)
        '--text-light': textOnBG,     // Texto sobre el fondo blanco/claro (secciones)
        '--border': secondary + '44'  // Borde semi-transparente del color secundario
    };

    //cambios al contenedor de previsualización
    const previewContainer = document.querySelector('.mockup-container');
    
    if (previewContainer) {
        Object.keys(newPalette).forEach(property => {
            previewContainer.style.setProperty(property, newPalette[property]);
        });
        
        console.log("%c Nueva Paleta Nectar Aplicada ", `background: ${primary}; color: ${textOnPrimary}; font-weight: bold;`);
    }
}


//Adaptación de switchTab para ejecutar la lógica

function switchTab(type) {
    if (type === 'random') {
        generateRandomPalette();
    } else {
        // Aquí iría tu lógica para ocultar/mostrar pestañas
        console.log("Navegando a la pestaña:", type);
    }
}