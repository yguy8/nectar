
// Función principal para obtener los colores actuales del DOM
function getCurrentColors() {
    const container = document.querySelector('.mockup-container');
    const style = getComputedStyle(container);
    
    return {
        primary: style.getPropertyValue('--primary').trim() || '#f4da6c',
        secondary: style.getPropertyValue('--secondary').trim(),
        accent: style.getPropertyValue('--accent').trim(),
        background: style.getPropertyValue('--background').trim(),
        text: style.getPropertyValue('--text').trim(),
        textLight: style.getPropertyValue('--text-light').trim(),
        border: style.getPropertyValue('--border').trim()
    };
}

// Generadores de strings por lenguaje para el botón de copiado
const formatters = {
    css: (c) => `:root {
    --primary: ${c.primary};
    --secondary: ${c.secondary};
    --accent: ${c.accent};
    --background: ${c.background};
    --text: ${c.text};
    --border: ${c.border};
}`,

    scss: (c) => `$primary: ${c.primary};
        $secondary: ${c.secondary};
        $accent: ${c.accent};
        $background: ${c.background};
        $text: ${c.text};
        $border: ${c.border};`,

    tailwind: (c) => `theme: {
        extend: {
            colors: {
            primary: '${c.primary}',
            secondary: '${c.secondary}',
            accent: '${c.accent}',
            background: '${c.background}',
            text: '${c.text}',
            }
        }
    }`
};

// Función de copiado de paleta de colores la página
async function copyToClipboard(format, event) {
    const btn = event.currentTarget; 
    const originalText = btn.innerText;
    const colors = getCurrentColors();
    const textToCopy = formatters[format](colors);

    try {
        await navigator.clipboard.writeText(textToCopy);
        
        btn.innerText = "¡Copiado!";
        btn.classList.add('copy-success');

        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('copy-success');
        }, 2000);

    } catch (err) {
        console.error('Error al copiar: ', err);
        btn.innerText = "Error";
    }
}