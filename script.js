// Obtener elementos del DOM
const tarjetas = document.querySelectorAll('.opcion-card');
const seccionResultado = document.getElementById('resultado');
const resultadoEmoji = document.getElementById('resultadoEmoji');
const resultadoSabor = document.getElementById('resultadoSabor');

// Objeto con emojis para cada sabor
const emojis = {
    'Fresa': '🍓',
    'Guineo': '🍌',
    'Galleta Oreo': '🍪',
    'Vainilla': '🍦'
};

// Agregar evento click a cada tarjeta
tarjetas.forEach(tarjeta => {
    const boton = tarjeta.querySelector('.btn-opcion');
    
    boton.addEventListener('click', () => {
        const sabor = tarjeta.getAttribute('data-sabor');
        mostrarResultado(sabor);
    });

    // Efecto hover en la tarjeta
    tarjeta.addEventListener('mouseenter', () => {
        tarjeta.style.transform = 'translateY(-10px) scale(1.05)';
    });

    tarjeta.addEventListener('mouseleave', () => {
        tarjeta.style.transform = 'translateY(0) scale(1)';
    });
});

// Función para mostrar resultado
function mostrarResultado(sabor) {
    // Ocultar las opciones
    document.querySelector('.header').style.display = 'none';
    document.querySelector('.contenedor-opciones').style.display = 'none';
    
    seccionResultado.classList.add('mostrar');
    
    // Agregar sonido (si el navegador lo permite)
    reproducirSonido();
    
    // Enviar respuesta al servidor
    enviarRespuesta(sabor);
}

// Función para enviar respuesta al servidor
async function enviarRespuesta(sabor) {
    try {
        const response = await fetch('/guardar-respuesta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ opcion: sabor })
        });
        
        const data = await response.text();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para reproducir sonido
function reproducirSonido() {
    // Crear un contexto de audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configurar sonido
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Cerrar resultado al hacer clic fuera del modal
document.addEventListener('click', (e) => {
    if (seccionResultado.classList.contains('mostrar') && 
        e.target === seccionResultado) {
        volverAtras();
    }
});

// Permitir teclado Escape para cerrar
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && seccionResultado.classList.contains('mostrar')) {
        volverAtras();
    }
});
