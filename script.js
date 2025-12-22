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
});
