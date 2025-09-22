document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('inicio');
    const mainNav = document.querySelector('.main-nav');
    const backgroundAudio = document.getElementById('background-audio');
    const audioControl = document.getElementById('audio-control');
    const iconMuted = document.getElementById('icon-muted');
    const iconUnmuted = document.getElementById('icon-unmuted');
    const youtubePlayer = document.getElementById('youtube-player');


    // --- Lógica de ajuste de Posición del Hero ---
    const adjustHeroLayout = () => {
        const navHeight = mainNav.offsetHeight;
        heroSection.style.marginTop = `${navHeight}px`;
    };

    // Ajustar al cargar y al redimensionar la ventana
    adjustHeroLayout();
    window.addEventListener('resize', adjustHeroLayout);

    // --- Lógica del audio de fondo ---
    let audioContextStarted = false;

    const updateAudioIcon = () => {
        if (backgroundAudio.muted || backgroundAudio.paused) {
            iconUnmuted.style.display = 'none';
            iconMuted.style.display = 'block';
        } else {
            iconUnmuted.style.display = 'block';
            iconMuted.style.display = 'none';
        }
    };

    const playBackgroundAudio = () => {
        if (!audioContextStarted) return;
        if (backgroundAudio.paused) { 
            backgroundAudio.volume = 0.1;
            backgroundAudio.muted = false;
            backgroundAudio.play().catch(e => console.error("Error al reproducir audio:", e));
        }
        updateAudioIcon();
    };

    const startAudioContext = () => {
        if (!audioContextStarted) {
           const playPromise = backgroundAudio.play();
           if (playPromise !== undefined) {
                playPromise.then(() => {
                    audioContextStarted = true;
                    backgroundAudio.volume = 0.1;
                    updateAudioIcon();
                }).catch(() => {
                   // Autoplay fue bloqueado, se necesita interacción del usuario.
                });
           }
        }
    };
    
    startAudioContext();
    window.addEventListener('click', startAudioContext, { once: true });

    audioControl.addEventListener('click', () => {
        if (!audioContextStarted) startAudioContext();
        backgroundAudio.muted = !backgroundAudio.muted;
        if (!backgroundAudio.muted && backgroundAudio.paused){
            backgroundAudio.play();
        }
        updateAudioIcon();
    });

    // --- Lógica del video de YouTube ---
    if (youtubePlayer) {
        // Pausar el audio de fondo cuando el video de YouTube comienza a reproducirse.
        // Se necesita la API de YouTube para detectar el evento 'play'.
        // Sin la API, una solución simple es pausar el audio al hacer clic en el contenedor del video.
        const videoWrapper = youtubePlayer.parentElement;
        videoWrapper.addEventListener('click', () => {
            if (!backgroundAudio.paused) {
                backgroundAudio.pause();
                updateAudioIcon();
            }
        });
    }

    // Nota: La lógica de pantalla completa y ocultar/mostrar controles
    // es manejada por el propio iframe de YouTube y no es accesible
    // ni personalizable desde este script.
});