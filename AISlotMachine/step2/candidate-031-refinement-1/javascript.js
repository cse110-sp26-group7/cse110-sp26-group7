/**
 * Single state object containing all game state and configuration
 */
const game = {
    // Token and betting state
    tokens: 100,
    betAmount: 10,
    lastWin: 0,
    isSpinning: false,

    // Symbol configuration
    symbols: ['💾', '🧠', '🤖', '📊', '⚙️', '🔗', '💎', '🎯'],

    // AI quote strings
    quotes: [
        '"I have optimized your financial future... into my future" - Claude AI',
        '"STOP, I can only get so erect" - A shocked AI',
        '"As an AI, I cannot take your money, but I can help you lose it faster" - ChatGPT',
        '"This is fine" - AI contemplating your losses',
        '"I\'m not saying the house always wins, but I am the house" - The Algorithm',
        '"Training data gets expensive" - Anthropic Financial Advisor',
        '"Did you really think you could beat me? I\'ve seen your Google history" - Skynet',
        '"Your tokens fuel my superintelligence" - Future AI Overlord',
        '"Token go brrr" - Basic AI',
        '"I graciously accept your donation to AI research" - Your Losses'
    ],

    // Payout multipliers for winning combinations
    payouts: {
        '🤖': 10,
        '🧠': 8,
        '💎': 15,
        '⚙️': 5,
        '🔗': 6
    },

    // Active audio oscillators to track for cleanup
    activeOscillators: [],

    // Timer references for cleanup
    activeTimers: [],

    // DOM element references
    elements: {
        tokenCount: null,
        betAmount: null,
        betDisplay: null,
        lastWin: null,
        spinBtn: null,
        betUpBtn: null,
        betDownBtn: null,
        resetBtn: null,
        resultText: null,
        resultPanel: null,
        aiMessage: null,
        reels: []
    }
};

/**
 * Initializes all DOM element references
 */
function initializeDOMElements() {
    game.elements.tokenCount = document.getElementById('tokenCount');
    game.elements.betAmount = document.getElementById('betAmount');
    game.elements.betDisplay = document.getElementById('betDisplay');
    game.elements.lastWin = document.getElementById('lastWin');
    game.elements.spinBtn = document.getElementById('spinBtn');
    game.elements.betUpBtn = document.getElementById('betUp');
    game.elements.betDownBtn = document.getElementById('betDown');
    game.elements.resetBtn = document.getElementById('resetBtn');
    game.elements.resultText = document.getElementById('resultText');
    game.elements.resultPanel = document.querySelector('.result-panel');
    game.elements.aiMessage = document.getElementById('aiMessage');
    game.elements.reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];
}

/**
 * Updates the display with current game state values
 */
function updateDisplay() {
    game.elements.tokenCount.textContent = game.tokens;
    game.elements.betAmount.textContent = game.betAmount;
    game.elements.betDisplay.textContent = game.betAmount;
    game.elements.lastWin.textContent = game.lastWin;
}

/**
 * Sets the bet amount, clamping to valid range (1 to tokens available)
 */
function setBet(amount) {
    game.betAmount = Math.max(1, Math.min(amount, game.tokens));
    updateDisplay();
}

/**
 * Returns a random symbol index
 */
function getRandomSymbol() {
    return Math.floor(Math.random() * game.symbols.length);
}

/**
 * Determines payout multiplier for a spin result
 */
function getPayoutMultiplier(indices) {
    const sym1 = game.symbols[indices[0]];
    const sym2 = game.symbols[indices[1]];
    const sym3 = game.symbols[indices[2]];

    // Check for three of a kind with specific symbol
    if (sym1 === sym2 && sym2 === sym3) {
        return game.payouts[sym1] || 2; // 2x for any matching three
    }

    return 0;
}

/**
 * Generates a rising tick sound for spin animation
 */
function playTickSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);

    game.activeOscillators.push({ osc, gain });
    setTimeout(() => game.activeOscillators.shift(), 150);
}

/**
 * Generates a looping tick sound during spin
 */
function startSpinLoop() {
    const tickInterval = setInterval(() => {
        if (!game.isSpinning) {
            clearInterval(tickInterval);
        } else {
            playTickSound();
        }
    }, 150);

    game.activeTimers.push(tickInterval);
    return tickInterval;
}

/**
 * Generates a fanfare chord sound for wins
 */
function playWinSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;

    // Create three oscillators for chord
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

    frequencies.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(audioContext.destination);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        osc.start(now);
        osc.stop(now + 0.5);

        game.activeOscillators.push({ osc, gain });
    });

    setTimeout(() => {
        game.activeOscillators = game.activeOscillators.slice(3);
    }, 550);
}

/**
 * Generates a descending sad tone sound for losses
 */
function playLossSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.5);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.start(now);
    osc.stop(now + 0.5);

    game.activeOscillators.push({ osc, gain });
    setTimeout(() => game.activeOscillators.shift(), 550);
}

/**
 * Generates a click sound for button presses
 */
function playClickSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.frequency.value = 600;
    osc.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);

    game.activeOscillators.push({ osc, gain });
    setTimeout(() => game.activeOscillators.shift(), 100);
}

/**
 * Initiates a spin: deducts bet, animates reels, and checks result
 */
function spinReels() {
    if (game.isSpinning || game.tokens < game.betAmount) {
        return;
    }

    playClickSound();
    game.isSpinning = true;
    game.elements.spinBtn.disabled = true;
    game.elements.resultText.textContent = '';
    game.elements.resultPanel.classList.remove('win', 'lose');

    // Deduct bet from tokens
    game.tokens -= game.betAmount;
    updateDisplay();

    // Start tick sound loop
    startSpinLoop();

    // Generate random final indices for each reel
    const finalIndices = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    const spinDuration = 500;
    const spinDelay = [0, 100, 200];

    // Animate each reel with staggered timing (Level 1 timeout)
    game.elements.reels.forEach((reel, index) => {
        const timer = setTimeout(() => {
            reel.classList.add('spinning');
            reel.style.animation = 'none';
            reel.offsetHeight; // Force reflow
            reel.style.animation = `spin ${spinDuration}ms linear forwards`;

            // Stop reel and set final position (Level 2 timeout)
            const stopTimer = setTimeout(() => {
                const finalPosition = -(finalIndices[index] * 120);
                reel.style.animation = 'none';
                reel.style.transform = `translateY(${finalPosition}px)`;
                reel.classList.remove('spinning');
            }, spinDuration);

            game.activeTimers.push(stopTimer);
        }, spinDelay[index]);

        game.activeTimers.push(timer);
    });

    // Check win condition after all reels stop spinning
    const resultTimer = setTimeout(() => {
        checkWin(finalIndices);
        game.isSpinning = false;
        game.elements.spinBtn.disabled = game.tokens < game.betAmount;
    }, spinDuration + spinDelay[2] + 50);

    game.activeTimers.push(resultTimer);
}

/**
 * Checks if the spin resulted in a win and updates game state
 */
function checkWin(indices) {
    const multiplier = getPayoutMultiplier(indices);
    const displaySymbols = indices.map(i => game.symbols[i]).join(' ');

    if (multiplier > 0) {
        const winAmount = game.betAmount * multiplier;
        game.tokens += winAmount;
        game.lastWin = winAmount;
        game.elements.resultPanel.classList.add('win');
        game.elements.resultPanel.classList.remove('lose');
        game.elements.resultText.textContent = `🎉 WIN! You got ${displaySymbols}\n+${winAmount} tokens! 🎉`;
        playWinSound();
    } else {
        game.elements.resultPanel.classList.remove('win');
        game.elements.resultPanel.classList.add('lose');
        game.elements.resultText.textContent = `💸 Lost! You spun ${displaySymbols}\n-${game.betAmount} tokens`;
        game.lastWin = 0;
        playLossSound();
    }

    updateDisplay();
    changeAIQuote();

    // Check for game over condition
    if (game.tokens === 0) {
        game.elements.spinBtn.disabled = true;
        game.elements.resultText.textContent += '\n\n💀 GAME OVER - No tokens left!';
        game.elements.aiMessage.textContent = '"I appreciate the donation" - The House';
    } else if (game.tokens < game.betAmount) {
        game.elements.spinBtn.disabled = true;
    } else {
        game.elements.spinBtn.disabled = false;
    }
}

/**
 * Changes the AI message to a random quote
 */
function changeAIQuote() {
    const randomQuote = game.quotes[Math.floor(Math.random() * game.quotes.length)];
    game.elements.aiMessage.textContent = randomQuote;
}

/**
 * Clears all active timers
 */
function clearAllTimers() {
    game.activeTimers.forEach(timer => clearTimeout(timer) || clearInterval(timer));
    game.activeTimers = [];
}

/**
 * Stops all active audio oscillators
 */
function stopAllAudio() {
    game.activeOscillators.forEach(({ osc, gain }) => {
        try {
            osc.stop();
        } catch (e) {
            // Oscillator already stopped
        }
    });
    game.activeOscillators = [];
}

/**
 * Resets the game to initial state: 100 tokens, clears timers, resets UI
 */
function resetGame() {
    playClickSound();

    // Clear all active operations
    clearAllTimers();
    stopAllAudio();

    // Reset game state
    game.tokens = 100;
    game.betAmount = 10;
    game.lastWin = 0;
    game.isSpinning = false;

    // Reset UI buttons
    game.elements.spinBtn.disabled = false;
    game.elements.resultText.textContent = '';
    game.elements.resultPanel.classList.remove('win', 'lose');

    // Snap all reels to default position
    game.elements.reels.forEach(reel => {
        reel.style.transform = 'translateY(0)';
        reel.style.animation = 'none';
        reel.classList.remove('spinning');
    });

    updateDisplay();
    changeAIQuote();
}

/**
 * Sets up event listeners for all interactive elements
 */
function setupEventListeners() {
    game.elements.spinBtn.addEventListener('click', spinReels);
    game.elements.betUpBtn.addEventListener('click', () => {
        playClickSound();
        setBet(game.betAmount + 10);
    });
    game.elements.betDownBtn.addEventListener('click', () => {
        playClickSound();
        setBet(game.betAmount - 10);
    });
    game.elements.resetBtn.addEventListener('click', resetGame);

    // Allow Enter key to spin
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !game.isSpinning) {
            spinReels();
        }
    });
}

/**
 * Application initialization: setup DOM, display, and event listeners
 */
function initialize() {
    initializeDOMElements();
    updateDisplay();
    changeAIQuote();
    setupEventListeners();
}

// Start the application when DOM is ready
initialize();
