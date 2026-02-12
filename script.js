document.addEventListener('DOMContentLoaded', () => {
    const scamOverlay = document.getElementById('scam-overlay');
    const mainContent = document.getElementById('main-content');
    const debugBtn = document.getElementById('debug-btn');
    const bgMusic = document.getElementById('bg-music');

    // 1. Handle "Debug System" Click
    debugBtn.addEventListener('click', () => {
        // Glitch effect
        document.body.style.backgroundColor = 'black';
        scamOverlay.style.display = 'none';

        // Remove scroll restriction (though we are hiding overflow on body roughly via reset/fixed, 
        // but let's keep it clean)
        document.body.style.overflow = 'auto'; // Allow scrolling so content doesn't get cut off

        mainContent.classList.remove('hidden');
        mainContent.classList.add('visible');

        // Start Music
        bgMusic.play().catch(e => console.log("Audio play failed:", e));

        // Removed startLanterns() - will be triggered in Step 2
    });

    // Step Navigation
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentStep = e.target.closest('.step-section');
            const nextStepId = e.target.getAttribute('data-next');
            const nextStep = document.getElementById(nextStepId);

            if (currentStep && nextStep) {
                // Fade out current
                currentStep.classList.remove('active');

                // Show next
                nextStep.classList.add('active');
            }
        });
    });

    // Lantern Interaction (Step 2)
    const userLantern = document.getElementById('user-lantern');
    const lanternInstruction = document.getElementById('lantern-instruction');
    const lanternNextBtn = document.getElementById('lantern-next-btn');
    let lanternState = 'unlit'; // unlit -> lit -> flying

    if (userLantern) {
        userLantern.addEventListener('click', () => {
            if (lanternState === 'unlit') {
                // Light it up
                userLantern.classList.add('lit');
                lanternState = 'lit';
                lanternInstruction.textContent = "¡Es hermoso! Ahora haz click para lanzarlo al cielo...";
            } else if (lanternState === 'lit') {
                // Release it
                userLantern.classList.add('flying');
                lanternState = 'flying';
                lanternInstruction.style.opacity = '0'; // Hide text

                // Start the background show!
                setTimeout(() => {
                    startLanterns();
                    lanternNextBtn.classList.remove('hidden');
                }, 1000); // Small delay to let it fly a bit
            }
        });
    }

    // 2. Gift Interactions
    const hersheyGift = document.getElementById('hershey-gift');
    const hersheyText = hersheyGift.querySelector('.gift-text');
    const giftNextBtn = document.getElementById('gift-next-btn');

    hersheyGift.addEventListener('click', () => {
        hersheyText.classList.remove('hidden');
        hersheyText.classList.add('visible');
        checkGifts();
    });



    const tower = document.getElementById('rapunzel-tower');
    const towerText = document.querySelector('#tower-gift .gift-text');

    tower.addEventListener('click', () => {
        tower.classList.toggle('glowing');
        if (tower.classList.contains('glowing')) {
            towerText.classList.remove('hidden');
            towerText.classList.add('visible');
            checkGifts();
        }
    });

    let giftsRevealed = 0;
    function checkGifts() {
        // Check if both texts are visible
        const hersheyVisible = !hersheyText.classList.contains('hidden');
        const towerVisible = !towerText.classList.contains('hidden');

        if (hersheyVisible && towerVisible) {
            giftNextBtn.classList.remove('hidden');
        }
    }

    // 3. The "No" Button Troll
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');

    // Initial positioning relative to the container to make sure it starts next to YES
    // We actually leave it in flow first, then switch to absolute on first hover? 
    // Or just start absolute. CSS has it absolute.
    // Let's set initial position to allow it to be seen.
    // Actually, flexbox 'gap' won't work well if one is absolute. 
    // Let's fix the CSS in the next step if needed, but for now logic:

    // We need to set initial position via JS so it sits nicely, 
    // OR we just rely on CSS absolute positioning which places it somewhere.
    // Better strategy: Keep it static until first hover, then switch to fixed/absolute.

    noBtn.style.position = 'static'; // Override CSS for a moment to let it sit naturally

    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('touchstart', moveNoButton); // Mobile support

    function moveNoButton() {
        // If it's the first time (position is static), we need to set it to fixed at its CURRENT location first
        // to enable the transition to work smoothly.
        if (noBtn.style.position !== 'fixed') {
            const rect = noBtn.getBoundingClientRect();
            noBtn.style.position = 'fixed';
            noBtn.style.left = rect.left + 'px';
            noBtn.style.top = rect.top + 'px';

            // Force reflow to ensuring the browser registers the start position
            noBtn.offsetHeight;
        }

        const maxX = window.innerWidth - noBtn.offsetWidth;
        const maxY = window.innerHeight - noBtn.offsetHeight;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        // Now move it
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
    }

    // 4. Yes Button
    yesBtn.addEventListener('click', () => {
        // Switch Music to Nada Sin Ti
        bgMusic.pause();
        bgMusic.src = './assets/nada_sin_ti.mp3';
        bgMusic.load();
        bgMusic.play().catch(e => console.log("Audio switch failed:", e));

        // Hide Step 4
        document.getElementById('step-4').classList.remove('active');

        // Show Step 5 (Success)
        const stepSuccess = document.getElementById('step-success');
        stepSuccess.classList.add('active');
        stepSuccess.style.display = 'flex'; // Ensure it's visible if scoped style interferes, though class 'active' should handle it
    });

    // Lantern Logic
    function startLanterns() {
        const container = document.querySelector('.lantern-container');
        setInterval(() => {
            const lantern = document.createElement('div');
            lantern.classList.add('lantern');
            // Use 95vw to avoid edge cases causing horizontal scrollbar
            lantern.style.left = Math.random() * 95 + 'vw';
            lantern.style.animationDuration = (Math.random() * 5 + 5) + 's'; // 5-10s
            container.appendChild(lantern);

            // Cleanup
            setTimeout(() => {
                lantern.remove();
            }, 10000);
        }, 500);
    }
});
