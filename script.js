/* ==========================================================================
   CINEMATIC DEVELOPER PORTFOLIO - INTERACTIVE SCRIPT
   Author: Elikante Charan
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mouse Spotlight Tracker
    const spotlight = document.getElementById('spotlight');
    document.addEventListener('mousemove', (e) => {
        if (spotlight) {
            spotlight.style.left = `${e.clientX}px`;
            spotlight.style.top = `${e.clientY}px`;
        }
    });

    // 2. Web Audio API Interactive Sound Synthesizer
    let audioEnabled = true;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
    }

    function playCinematicSound(freq = 440, type = 'sine', duration = 0.15, gainVal = 0.05) {
        if (!audioEnabled) return;
        try {
            initAudio();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.log('Audio Context Error:', e);
        }
    }

    // Sound toggle button
    const soundToggle = document.getElementById('sound-toggle');
    const soundText = soundToggle.querySelector('.sound-text');
    const soundIcon = soundToggle.querySelector('i');

    soundToggle.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        if (audioEnabled) {
            soundText.textContent = 'AUDIO: ON';
            soundIcon.className = 'fa-solid fa-volume-high';
            playCinematicSound(600, 'triangle', 0.2, 0.1);
        } else {
            soundText.textContent = 'AUDIO: OFF';
            soundIcon.className = 'fa-solid fa-volume-xmark';
        }
    });

    // Add sound to all buttons and links
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            playCinematicSound(320, 'sine', 0.08, 0.02);
        });
        el.addEventListener('click', () => {
            playCinematicSound(480, 'triangle', 0.12, 0.06);
        });
    });

    // 3. Particle Canvas Animation
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = `rgba(0, 243, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 65; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // 4. Copy Email to Clipboard
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'charanelikante@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                const originalText = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = `<i class="fa-solid fa-check glow-cyan"></i> COPIED TO CLIPBOARD!`;
                playCinematicSound(800, 'sine', 0.25, 0.08);

                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalText;
                }, 2500);
            }).catch(err => {
                console.error('Clipboard copy failed:', err);
            });
        });
    }

});
