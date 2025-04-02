document.addEventListener('DOMContentLoaded', function() {
    // Menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        this.innerHTML = mainNav.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Reproductores de audio
    const audioPlayers = document.querySelectorAll('.audio-player');
    
    audioPlayers.forEach(player => {
        const progressBar = player.querySelector('.progress-bar');
        const progressContainer = player.querySelector('.progress-container');
        const progressTime = player.querySelector('.progress-time');
        const playBtn = player.querySelector('.play-btn');
        const volumeBtn = player.querySelector('.volume-btn');
        const speedBtn = player.querySelector('.speed-btn');
        
        // Crear elemento de audio
        const audio = new Audio();
        // Aquí deberías asignar la ruta real del archivo de audio
        // audio.src = player.closest('.episode-card').querySelector('.download-btn').href;
        
        let isPlaying = false;
        let isMuted = false;
        let playbackRate = 1;
        const speeds = [1, 1.5, 2];
        
        // Actualizar tiempo
        function updateTime() {
            const currentTime = formatTime(audio.currentTime);
            const duration = formatTime(audio.duration);
            progressTime.textContent = `${currentTime} / ${duration}`;
            
            // Actualizar barra de progreso
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
        
        // Formatear tiempo (mm:ss)
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
        
        // Controlar la reproducción
        playBtn.addEventListener('click', function() {
            if (isPlaying) {
                audio.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                audio.play();
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = !isPlaying;
        });
        
        // Controlar volumen
        volumeBtn.addEventListener('click', function() {
            isMuted = !isMuted;
            audio.muted = isMuted;
            volumeBtn.innerHTML = isMuted ? 
                '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        });
        
        // Cambiar velocidad
        if (speedBtn) {
            speedBtn.addEventListener('click', function() {
                playbackRate = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
                audio.playbackRate = playbackRate;
                speedBtn.textContent = `${playbackRate}x`;
            });
        }
        
        // Actualizar progreso al hacer clic en la barra
        progressContainer.addEventListener('click', function(e) {
            const width = this.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            
            audio.currentTime = (clickX / width) * duration;
        });
        
        // Actualizar tiempo periódicamente
        audio.addEventListener('timeupdate', updateTime);
        
        // Resetear al terminar
        audio.addEventListener('ended', function() {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
            audio.currentTime = 0;
        });
        
        // Precargar metadatos
        audio.addEventListener('loadedmetadata', function() {
            progressTime.textContent = `0:00 / ${formatTime(audio.duration)}`;
        });
    });
    
    // Efecto de aparición de episodios
    const episodeCards = document.querySelectorAll('.episode-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    episodeCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Formulario de contacto
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulación de envío (en producción usaría fetch o AJAX)
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensaje Enviado';
            
            // Crear y mostrar notificación
            const notification = document.createElement('div');
            notification.className = 'form-notification success';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>¡Gracias por tu mensaje! Nos pondremos en contacto pronto.</p>
            `;
            contactForm.appendChild(notification);
            
            // Desaparecer después de 5 segundos
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
            
            // Resetear formulario después de 2 segundos
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    });
}


});