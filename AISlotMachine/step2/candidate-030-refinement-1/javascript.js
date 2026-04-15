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
    symbols: ['🤖', '🧠', '💰', '🎯', '⚡', '📊'],
    payouts: {
        '🤖': 30,
        '🧠': 25,
        '💰': 50,
        '🎯': 35,
        '⚡': 40,
        '📊': 20
    },

    // Timer references for cleanup
    timers: {
        spinAnimation: null,
        checkWinDelay: null,
        tickSound: null
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

    frequencies.forEach((freq, index) => {
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
}

// Return a random symbol from the available symbols array
function getRandomSymbol() {
    return gameState.symbols[Math.floor(Math.random() * gameState.symbols.length)];
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
            reel.textContent = getRandomSymbol();
            reel.classList.add('spinning');
        });

        playTickSound();

        if (spins >= maxSpins) {
            clearInterval(gameState.timers.spinAnimation);
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
        reel.textContent = finalSymbols[i];
    });

    // Delay win check to allow visual settling (level 2 of timer nesting)
    gameState.timers.checkWinDelay = setTimeout(() => {
        checkWin(finalSymbols, messageEl);
        gameState.isSpinning = false;
        document.getElementById('spinBtn').disabled = gameState.tokens < gameState.spinCost;
    }, 300);
}

// Check if the spin results match and distribute winnings
function checkWin(symbols, messageEl) {
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        const winAmount = gameState.payouts[symbols[0]];
        gameState.tokens += winAmount;
        gameState.totalWon += winAmount;

        messageEl.textContent = `🎉 YOU WON ${winAmount} TOKENS! 🎉`;
        messageEl.className = 'message win';

        playWinSound();
    } else {
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
    gameState.isSpinning = false;

    // Clear message display
    const messageEl = document.getElementById('message');
    messageEl.textContent = '';
    messageEl.className = 'message';

    // Snap reels to default symbols
    document.getElementById('reel1').textContent = '🤖';
    document.getElementById('reel2').textContent = '🧠';
    document.getElementById('reel3').textContent = '💰';

    // Remove spinning animation class
    document.querySelectorAll('.reel').forEach(reel => reel.classList.remove('spinning'));

    // Update display and re-enable controls
    updateDisplay();
}


/* ============================================
   EVENT LISTENERS AND INITIALIZATION
   ============================================ */

// Attach event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('spinBtn').addEventListener('click', spin);
    document.getElementById('resetBtn').addEventListener('click', reset);
    updateDisplay();
});
