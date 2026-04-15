/* ============================================
   SLOT MACHINE STATE AND CONFIGURATION
   ============================================ */

// Single state object holding all game data and references
const gameState = {
    // Player currency
    tokens: 100,
    totalWon: 0,
    spinCount: 0,

    // Game mechanics
    spinCost: 10,
    isSpinning: false,

    // Available symbols and their payouts
    symbols: ['aiCore', 'neuralNet', 'crypto', 'target', 'lightning', 'dataGraph'],
    payouts: {
        'aiCore': 30,
        'neuralNet': 25,
        'crypto': 50,
        'target': 35,
        'lightning': 40,
        'dataGraph': 20
    },

    // Symbol images (SVG data URIs with AI casino theme and classic casino symbols)
    symbolImages: {
        'aiCore': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="coreGrad" cx="50%" cy="50%"><stop offset="0%" style="stop-color:%2322d3ee;stop-opacity:1"/><stop offset="100%" style="stop-color:%230891b2;stop-opacity:1"/></radialGradient></defs><rect fill="%230f172a" x="5" y="5" width="90" height="90" rx="10"/><circle fill="url(%23coreGrad)" cx="50" cy="50" r="30"/><circle fill="%23a855f7" cx="50" cy="50" r="20"/><circle fill="%2322d3ee" cx="50" cy="50" r="10"/><rect fill="%23a855f7" x="20" y="35" width="6" height="6"/><rect fill="%23a855f7" x="74" y="35" width="6" height="6"/><rect fill="%23a855f7" x="20" y="59" width="6" height="6"/><rect fill="%23a855f7" x="74" y="59" width="6" height="6"/></svg>',
        'neuralNet': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="netGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%2322d3ee;stop-opacity:1"/><stop offset="100%" style="stop-color:%23a855f7;stop-opacity:1"/></linearGradient></defs><rect fill="%230f172a" x="5" y="5" width="90" height="90" rx="10"/><circle fill="url(%23netGrad)" cx="50" cy="25" r="10"/><circle fill="url(%23netGrad)" cx="30" cy="65" r="10"/><circle fill="url(%23netGrad)" cx="70" cy="65" r="10"/><circle fill="%2322d3ee" cx="50" cy="50" r="6"/><line x1="50" y1="25" x2="50" y2="50" stroke="%23a855f7" stroke-width="2"/><line x1="50" y1="50" x2="30" y2="65" stroke="%23a855f7" stroke-width="2"/><line x1="50" y1="50" x2="70" y2="65" stroke="%23a855f7" stroke-width="2"/></svg>',
        'crypto': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23fcd34d;stop-opacity:1"/><stop offset="100%" style="stop-color:%23f59e0b;stop-opacity:1"/></linearGradient></defs><rect fill="%230f172a" x="5" y="5" width="90" height="90" rx="10"/><circle fill="url(%23goldGrad)" cx="50" cy="50" r="32"/><circle fill="%23b45309" cx="50" cy="50" r="28"/><text x="50" y="65" font-size="48" font-weight="bold" text-anchor="middle" fill="%23fcd34d" font-family="serif">₿</text></svg>',
        'target': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%230f172a" x="5" y="5" width="90" height="90" rx="10"/><circle cx="50" cy="50" r="35" fill="none" stroke="%2322d3ee" stroke-width="4"/><circle cx="50" cy="50" r="25" fill="none" stroke="%23a855f7" stroke-width="3"/><circle cx="50" cy="50" r="15" fill="none" stroke="%2322d3ee" stroke-width="3"/><circle cx="50" cy="50" r="6" fill="%23a855f7"/></svg>',
        'lightning': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="lightGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%2322d3ee;stop-opacity:1"/><stop offset="100%" style="stop-color:%23a855f7;stop-opacity:1"/></linearGradient></defs><rect fill="%230f172a" x="5" y="5" width="90" height="90" rx="10"/><polygon points="50,12 68,45 48,45 70,85 20,45 48,45" fill="url(%23lightGrad)" stroke="%2322d3ee" stroke-width="2"/></svg>',
        'dataGraph': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="barGrad" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" style="stop-color:%2322d3ee;stop-opacity:1"/><stop offset="100%" style="stop-color:%23a855f7;stop-opacity:1"/></linearGradient></defs><rect fill="%230f172a" x="5" y="5" width="90" height="90" rx="10"/><rect x="18" y="55" width="14" height="25" fill="url(%23barGrad)"/><rect x="38" y="35" width="14" height="45" fill="url(%23barGrad)"/><rect x="58" y="45" width="14" height="35" fill="url(%23barGrad)"/><rect x="78" y="25" width="14" height="55" fill="url(%23barGrad)"/><line x1="10" y1="82" x2="90" y2="82" stroke="%2322d3ee" stroke-width="2"/></svg>'
    },

    // Timer references for cleanup
    timers: {
        spinAnimation: null,
        checkWinDelay: null
    },

    // Audio context for Web Audio API
    audioContext: null
};


/* ============================================
   SOUND SYSTEM USING WEB AUDIO API OSCILLATORS
   ============================================ */

// Initialize or get the audio context (reuse existing context when possible)
function getAudioContext() {
    if (!gameState.audioContext) {
        try {
            gameState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            return null;
        }
    }
    return gameState.audioContext;
}

// Play rising tick sound that loops during spin (frequency sweeps upward)
function playTickSound() {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const startTime = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, startTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.05, startTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.1);
}

// Play fanfare chord on win (multiple frequencies played together)
function playWinSound() {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const startTime = audioContext.currentTime;
    const duration = 0.5;
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G (major chord)

    frequencies.forEach((freq) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = freq;

        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    });
}

// Play descending sad tone on loss (frequency sweeps downward)
function playLossSound() {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const startTime = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, startTime + 0.3);

    gainNode.gain.setValueAtTime(0.2, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
}

// Play click sound on button press (short high-pitched beep)
function playClickSound() {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const startTime = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 800;

    gainNode.gain.setValueAtTime(0.15, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.05);
}


/* ============================================
   GAME DISPLAY AND STATE MANAGEMENT
   ============================================ */

// Update all UI displays to reflect current game state
function updateDisplay() {
    document.getElementById('tokenCount').textContent = gameState.tokens;
    document.getElementById('totalWon').textContent = gameState.totalWon;
    document.getElementById('spinCount').textContent = gameState.spinCount;
    document.getElementById('spinBtn').disabled = gameState.tokens < gameState.spinCost;
    document.getElementById('spinBtn').textContent = `SPIN (${gameState.spinCost} tokens)`;

    // Update bet display with current bet amount
    document.getElementById('betDisplay').textContent = gameState.spinCost;

    // Update bet button states (allow decrease if > 1, allow increase if < tokens)
    const betDownBtn = document.getElementById('betDown');
    const betUpBtn = document.getElementById('betUp');
    betDownBtn.disabled = gameState.spinCost <= 1 || gameState.isSpinning;
    betUpBtn.disabled = gameState.spinCost >= gameState.tokens || gameState.isSpinning;
}

// Get image source for a given symbol
function getSymbolImage(symbol) {
    return gameState.symbolImages[symbol] || gameState.symbolImages['aiCore'];
}

// Return a random symbol from the available symbols array
function getRandomSymbol() {
    return gameState.symbols[Math.floor(Math.random() * gameState.symbols.length)];
}


/* ============================================
   BET CONTROL LOGIC
   ============================================ */

// Increase bet amount by 1 (maximum: available tokens)
function increaseBet() {
    if (!gameState.isSpinning && gameState.spinCost < gameState.tokens) {
        gameState.spinCost++;
        playClickSound();
        updateDisplay();
    }
}

// Decrease bet amount by 1 (minimum: 1)
function decreaseBet() {
    if (!gameState.isSpinning && gameState.spinCost > 1) {
        gameState.spinCost--;
        playClickSound();
        updateDisplay();
    }
}


/* ============================================
   GAME LOGIC AND SPIN MECHANICS
   ============================================ */

// Execute the spin action when spin button is clicked
function spin() {
    if (gameState.isSpinning || gameState.tokens < gameState.spinCost) return;

    playClickSound();
    gameState.isSpinning = true;
    gameState.tokens -= gameState.spinCost;
    gameState.spinCount++;
    updateDisplay();

    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    const messageEl = document.getElementById('message');
    messageEl.textContent = 'SPINNING...';
    messageEl.className = 'message neutral';
    document.getElementById('spinBtn').disabled = true;

    // Spin animation parameters
    const spinDuration = 500;
    const spinInterval = 100;
    let spins = 0;
    const maxSpins = spinDuration / spinInterval;

    // Start spinning animation loop (level 1 of timer nesting)
    gameState.timers.spinAnimation = setInterval(() => {
        spins++;
        reels.forEach(reel => {
            const randomSymbol = getRandomSymbol();
            const img = reel.querySelector('.reel-image');
            img.src = getSymbolImage(randomSymbol);
            reel.classList.add('spinning');
            reel.classList.remove('matching');
        });

        playTickSound();

        if (spins >= maxSpins) {
            clearInterval(gameState.timers.spinAnimation);
            gameState.timers.spinAnimation = null;
            finishSpin(reels, messageEl);
        }
    }, spinInterval);
}

// Complete the spin and display final results
function finishSpin(reels, messageEl) {
    reels.forEach(reel => reel.classList.remove('spinning'));

    // Get final symbols
    const finalSymbols = [
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol()
    ];

    reels.forEach((reel, i) => {
        const img = reel.querySelector('.reel-image');
        img.src = getSymbolImage(finalSymbols[i]);
    });

    // Delay win check to allow visual settling (level 2 of timer nesting)
    gameState.timers.checkWinDelay = setTimeout(() => {
        checkWin(finalSymbols, messageEl);
        gameState.isSpinning = false;
        document.getElementById('spinBtn').disabled = gameState.tokens < gameState.spinCost;
        gameState.timers.checkWinDelay = null;
    }, 300);
}

// Check if the spin results match and distribute winnings, handle 3-match wins and 2-match animations
function checkWin(symbols, messageEl) {
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    // Check for 3-symbol match (win condition)
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        const winAmount = gameState.payouts[symbols[0]];
        gameState.tokens += winAmount;
        gameState.totalWon += winAmount;

        messageEl.textContent = `🎉 YOU WON ${winAmount} TOKENS! 🎉`;
        messageEl.className = 'message win';

        // Animate all three reels for 3-match win
        reels.forEach(reel => reel.classList.add('matching'));

        playWinSound();
    }
    // Check for 2-symbol match (animate but no payout)
    else if (symbols[0] === symbols[1]) {
        messageEl.textContent = '⭐ Two match! Almost there...';
        messageEl.className = 'message neutral';

        // Animate only the matching reels
        reels[0].classList.add('matching');
        reels[1].classList.add('matching');

        playClickSound();
    }
    else if (symbols[1] === symbols[2]) {
        messageEl.textContent = '⭐ Two match! Almost there...';
        messageEl.className = 'message neutral';

        // Animate only the matching reels
        reels[1].classList.add('matching');
        reels[2].classList.add('matching');

        playClickSound();
    }
    else if (symbols[0] === symbols[2]) {
        messageEl.textContent = '⭐ Two match! Almost there...';
        messageEl.className = 'message neutral';

        // Animate only the matching reels
        reels[0].classList.add('matching');
        reels[2].classList.add('matching');

        playClickSound();
    }
    // No matches
    else {
        messageEl.textContent = '❌ No match... your training data was corrupted.';
        messageEl.className = 'message lose';

        playLossSound();
    }

    updateDisplay();
}


/* ============================================
   GAME RESET AND INITIALIZATION
   ============================================ */

// Reset all game state to initial values and clear all timers
function reset() {
    // Clear all active timers
    if (gameState.timers.spinAnimation !== null) {
        clearInterval(gameState.timers.spinAnimation);
        gameState.timers.spinAnimation = null;
    }

    if (gameState.timers.checkWinDelay !== null) {
        clearTimeout(gameState.timers.checkWinDelay);
        gameState.timers.checkWinDelay = null;
    }

    // Reset game state to initial values
    gameState.tokens = 100;
    gameState.totalWon = 0;
    gameState.spinCount = 0;
    gameState.spinCost = 10;
    gameState.isSpinning = false;

    // Clear message display
    const messageEl = document.getElementById('message');
    messageEl.textContent = '';
    messageEl.className = 'message';

    // Snap reels to default symbols
    const defaultSymbols = ['aiCore', 'neuralNet', 'crypto'];
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    reels.forEach((reel, i) => {
        const img = reel.querySelector('.reel-image');
        img.src = getSymbolImage(defaultSymbols[i]);
    });

    // Remove spinning and matching animation classes
    document.querySelectorAll('.reel').forEach(reel => {
        reel.classList.remove('spinning');
        reel.classList.remove('matching');
    });

    // Update display and re-enable controls
    updateDisplay();
}


/* ============================================
   EVENT LISTENERS AND INITIALIZATION
   ============================================ */

// Attach event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Spin and reset button listeners
    document.getElementById('spinBtn').addEventListener('click', spin);
    document.getElementById('resetBtn').addEventListener('click', reset);

    // Bet control listeners
    document.getElementById('betUp').addEventListener('click', increaseBet);
    document.getElementById('betDown').addEventListener('click', decreaseBet);

    // Initialize legend images
    document.getElementById('legendAiCore').src = getSymbolImage('aiCore');
    document.getElementById('legendNeuralNet').src = getSymbolImage('neuralNet');
    document.getElementById('legendCrypto').src = getSymbolImage('crypto');
    document.getElementById('legendTarget').src = getSymbolImage('target');
    document.getElementById('legendLightning').src = getSymbolImage('lightning');
    document.getElementById('legendDataGraph').src = getSymbolImage('dataGraph');

    // Initialize reels with default symbols
    document.getElementById('reel1').querySelector('.reel-image').src = getSymbolImage('aiCore');
    document.getElementById('reel2').querySelector('.reel-image').src = getSymbolImage('neuralNet');
    document.getElementById('reel3').querySelector('.reel-image').src = getSymbolImage('crypto');

    // Update display
    updateDisplay();
});
