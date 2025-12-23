document.addEventListener('DOMContentLoaded', () => {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#00d2ff', '#ff9f43', '#ee5253', '#1dd1a1', '#2f3640', '#f368e0', '#ffeb3b'];
    const shapes = ['square', 'rectangle', 'circle', 'triangle', 'line', 'cross'];

    function createConfetti() {
        const confetti = document.createElement('div');
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.classList.add('confetti', shape);

        // Random properties
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const animDuration = Math.random() * 3 + 3; // 3-6s
        const animDelay = Math.random() * 5;
        const scale = Math.random() * 0.5 + 0.5;

        // Styles
        confetti.style.left = `${left}vw`;
        confetti.style.animationDuration = `${animDuration}s`;
        confetti.style.animationDelay = `${animDelay}s`;
        confetti.style.opacity = Math.random() + 0.2;
        confetti.style.transform = `scale(${scale})`;

        if (shape !== 'triangle' && shape !== 'line' && shape !== 'cross') {
            confetti.style.backgroundColor = bg;
        } else if (shape === 'triangle') {
            confetti.style.borderBottomColor = bg;
        } else if (shape === 'line') {
            confetti.style.backgroundColor = bg;
        } else if (shape === 'cross') {
            // For cross, we need to set the background of pseudo-elements. 
            // CSS variables are easiest here.
            confetti.style.setProperty('--confetti-color', bg);
        }

        // Specific shape adjustments handled in CSS (width/height etc)

        confettiContainer.appendChild(confetti);

        // Remove after animation to prevent memory leaks if we were spawning continuously (we are not yet)
        // confetti.addEventListener('animationend', () => { ... });
    }

    // Create a lot of confetti
    for (let i = 0; i < 60; i++) {
        // createConfetti(); // Confetti disabled per user request
    }
    // Premium Popup Logic
    // Premium Popup Logic
    const popup = document.getElementById('success-popup');
    const popupCard = document.querySelector('.popup-card-content');
    const contactForm = document.querySelector('.clean-form');

    // Make closePopup available globally
    window.closePopup = function () {
        if (popup) {
            popup.classList.add('opacity-0', 'pointer-events-none');
            // Reset card animation
            if (popupCard) {
                popupCard.classList.add('translate-y-10', 'scale-95');
            }
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Stop actual submission

            // Show Popup
            if (popup) {
                popup.classList.remove('opacity-0', 'pointer-events-none');
                // Trigger card animation
                if (popupCard) {
                    popupCard.classList.remove('translate-y-10', 'scale-95');
                }
            }
        });
    }

    // Close on outside click
    if (popup) {
        popup.addEventListener('click', function (e) {
            if (e.target === popup) {
                closePopup();
            }
        });
    }
    // ==========================================
    // GSAP ANIMATIONS (High Level Joss Mode)
    // ==========================================

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hide to prevent flash
    gsap.set('.hero-title, .hero-subtitle, .hero-text, .hero-btn', { y: 100, opacity: 0 });
    gsap.set('#client-hero', { opacity: 0, y: 100 });
    gsap.set('#trusted-by', { opacity: 0, scale: 0.8 });
    gsap.set('#contact', { opacity: 0, y: 100 });

    // 1. HERO ENTRANCE (Staggered & Elastic)
    const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

    heroTl
        .to('.hero-title', { y: 0, opacity: 1, duration: 1.8, delay: 0.2 })
        .to('.hero-subtitle', { y: 0, opacity: 1, duration: 1.5 }, "-=1.4")
        .to('.hero-text', { y: 0, opacity: 1, duration: 1.5 }, "-=1.3")
        .to('.hero-btn', { y: 0, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.3)" }, "-=1.0");

    // 2. 3D TILT EFFECT (Mouse Parallax)
    const heroCard = document.querySelector('.glass-card');
    if (heroCard) {
        heroCard.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = heroCard.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            gsap.to(heroCard, {
                rotationY: x * 10, // Rotate Y axis based on X mouse
                rotationX: -y * 10, // Rotate X axis based on Y mouse (inverted)
                transformPerspective: 1000,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        heroCard.addEventListener('mouseleave', () => {
            gsap.to(heroCard, {
                rotationY: 0,
                rotationX: 0,
                duration: 1,
                ease: "elastic.out(1, 0.5)"
            });
        });
    }

    // 3. SCROLL REVEALS (Client Section)
    gsap.to('#client-hero', {
        scrollTrigger: {
            trigger: '#client-hero',
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out"
    });

    // 4. TRUSTED BY (Explosive Pop)
    gsap.to('#trusted-by', {
        scrollTrigger: {
            trigger: '#trusted-by',
            start: "top 85%",
        },
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "back.out(1.2)" // Overshoot effect
    });

    // 5. CONTACT SECTION (Smooth Glide)
    gsap.to('#contact', {
        scrollTrigger: {
            trigger: '#contact',
            start: "top 75%",
        },
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out"
    });

    // 6. MAGNETIC BUTTONS
    document.querySelectorAll('.hero-btn, .linkedin-btn, button[type="submit"]').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = btn.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) * 0.3; // Limit movement
            const y = (e.clientY - top - height / 2) * 0.3;

            gsap.to(btn, { x: x, y: y, duration: 0.3 });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });

});
