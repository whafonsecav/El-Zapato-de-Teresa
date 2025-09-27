document.addEventListener('DOMContentLoaded', () => {
    // Elementos de Audio
    const backgroundAudio = document.getElementById('background-audio');
    const audioControl = document.getElementById('audio-control');
    const iconMuted = document.getElementById('icon-muted');
    const iconUnmuted = document.getElementById('icon-unmuted');
    
    // Elementos de Navegación y Contenido
    const navLinks = document.querySelectorAll('.bottom-nav a');
    const creditsWrapper = document.querySelector('.credits-scroll-wrapper');
    
    const homenajeContainer = document.querySelector('.homenaje-container');
    const finalLogo = document.querySelector('.final-logo');

    // Variables de estado
    let audioContextStarted = false;
    let youtubePlayer;
    let wasAudioPausedByVideo = false;

    // --- NAVEGACIÓN ENTRE SECCIONES (SLIDES) ---
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 
            const targetId = link.getAttribute('href');
            const targetSlide = document.querySelector(targetId);

            if (targetSlide) {
                targetSlide.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
            }

            // Control de animación de créditos (scroll, homenaje y logo)
            if (targetId === '#creditos') {
                creditsWrapper.classList.add('credits-scrolling');
                homenajeContainer.classList.add('homenaje-animating');
                finalLogo.classList.add('logo-animating');
            } else {
                creditsWrapper.classList.remove('credits-scrolling');
                homenajeContainer.classList.remove('homenaje-animating');
                finalLogo.classList.remove('logo-animating');
            }

            // Control de audio y video al navegar
            if (youtubePlayer && typeof youtubePlayer.pauseVideo === 'function') {
                youtubePlayer.pauseVideo();
            }

            if (wasAudioPausedByVideo && !backgroundAudio.muted) {
                backgroundAudio.play();
                wasAudioPausedByVideo = false;
                updateAudioIcon(); 
            }
        });
    });

    // --- CONTROL DE AUDIO DE FONDO ---
    const updateAudioIcon = () => {
        if (backgroundAudio.muted || backgroundAudio.paused) {
            iconUnmuted.style.display = 'none';
            iconMuted.style.display = 'block';
        } else {
            iconUnmuted.style.display = 'block';
            iconMuted.style.display = 'none';
        }
    };

    const startAudioContext = () => {
        if (!audioContextStarted) {
           const playPromise = backgroundAudio.play();
           if (playPromise !== undefined) {
                playPromise.then(() => {
                    audioContextStarted = true;
                    backgroundAudio.volume = 0.1;
                    updateAudioIcon();
                }).catch(() => {});
           }
        }
    };
    
    window.addEventListener('click', startAudioContext, { once: true });

    audioControl.addEventListener('click', () => {
        startAudioContext(); 
        backgroundAudio.muted = !backgroundAudio.muted;
        if (!backgroundAudio.muted && backgroundAudio.paused){
            backgroundAudio.play();
        }
        updateAudioIcon();
    });

    // --- INTEGRACIÓN CON API DE YOUTUBE ---
    window.onYouTubeIframeAPIReady = function() {
        youtubePlayer = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: 'dC6a3vKspdI',
            playerVars: {
                'autoplay': 0, 'modestbranding': 1, 'rel': 0,
                'iv_load_policy': 3, 'fs': 1
            },
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING && !backgroundAudio.paused) {
            backgroundAudio.pause();
            wasAudioPausedByVideo = true;
            updateAudioIcon();
        } 
        else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            if (wasAudioPausedByVideo && !backgroundAudio.muted) {
                backgroundAudio.play();
                wasAudioPausedByVideo = false;
                updateAudioIcon();
            }
        }
    }
});
