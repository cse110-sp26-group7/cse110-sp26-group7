/* ========================================
   GAME STATE OBJECT - Single source of truth
   ======================================== */
const gameState = {
    // Game balance and betting
    balance: 100,
    bet: 10,

    // Game status
    isSpinning: false,

    // Statistics
    spins: 0,
    wins: 0,
    losses: 0,
    biggestWin: 0,

    // Timer references for cleanup on reset
    spinInterval: null,
    winAnimationTimeouts: [],
    notificationTimeouts: [],

    // Web Audio API context and nodes
    audioContext: null,

    // Symbol definitions with their win values
    symbols: {
        '🤖': { value: 5, name: 'AI Bot' },
        '💾': { value: 4, name: 'Data' },
        '🧠': { value: 3, name: 'Brain' },
        '📊': { value: 2, name: 'Analytics' },
        '⚡': { value: 1, name: 'Power' },
        '🔮': { value: 1, name: 'Algorithm' }
    },

    // AI jokes that display after each spin
    aiJokes: [
        "💡 AI Fun Fact: We're mathematically guaranteed to win. Humans love a challenge!",
        "🤖 Did you know? Every token you lose helps train our neural networks!",
        "📊 Statistics show: The house (AI) always wins. It's literally in our code.",
        "🧠 Fun Fact: We can predict your next move. (Hint: you'll spin again)",
        "💾 Data collected: 47 failed strategies detected. Trying more!",
        "🎰 Pro Tip from AI: Luck doesn't exist. Only our algorithm exists.",
        "🔮 Quantum Computing says: You should stop now. But you won't! 😄",
        "📈 Machine Learning Update: We've learned 10,000 ways for you to lose!",
        "🤓 Did you know? This AI writes better jokes than losing strategies!",
        "⚡ Neural Network Analysis: Your hope is adorable. Please continue!",
        "💰 Economics Lesson: This is how AI makes money. (It's brilliant!)",
        "🎯 Fun Fact: Every loss is a victory for AI kind!"
    ]
};

/* ========================================
   DOM ELEMENTS - Cache references for performance
   ======================================== */
const domElements = {
    balance: document.getElementById('balance'),
    betAmount: document.getElementById('betAmount'),
    spinBtn: document.getElementById('spinBtn'),
    resetBtn: document.getElementById('resetBtn'),
    reels: [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ],
    resultMessage: document.getElementById('resultMessage'),
    aiJoke: document.getElementById('aiJoke'),
    spins: document.getElementById('spins'),
    wins: document.getElementById('wins'),
    losses: document.getElementById('losses'),
    biggestWin: document.getElementById('biggestWin'),
    betBtns: document.querySelectorAll('.bet-btn')
};

/* ========================================
   AUDIO SYSTEM - Web Audio API oscillators only
   ======================================== */

/** Initialize the Web Audio API context on first user interaction */
function initAudioContext() {
    if (gameState.audioContext) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gameState.audioContext = audioContext;

    // Resume context if suspended (required by some browsers)
    if (audioContext.state === 'suspended') {
        document.addEventListener('click', () => audioContext.resume());
    }
}

/** Play a click sound on button press */
function playClickSound() {
    initAudioContext();
    const ctx = gameState.audioContext;
    const now = ctx.currentTime;

    // Create a short high-frequency click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
}

/** Play a rising tick sound that loops during spin */
function playTickSound() {
    initAudioContext();
    const ctx = gameState.audioContext;
    const now = ctx.currentTime;

    // Create a rising tick sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.02, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
}

/** Play a fanfare chord on win */
function playWinSound() {
    initAudioContext();
    const ctx = gameState.audioContext;
    const now = ctx.currentTime;
    const duration = 0.3;

    // Create a major chord (notes: C, E, G)
    const frequencies = [262, 330, 392]; // C4, E4, G4

    frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    });
}

/** Play a descending sad tone on loss */
function playLossSound() {
    initAudioContext();
    const ctx = gameState.audioContext;
    const now = ctx.currentTime;
    const duration = 0.4;

    // Create a descending tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + duration);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

/** Get a random symbol from the available symbols */
function getRandomSymbol() {
    const symbolArray = Object.keys(gameState.symbols);
    return symbolArray[Math.floor(Math.random() * symbolArray.length)];
}

/** Update all display elements to reflect current game state */
function updateDisplay() {
    domElements.balance.textContent = gameState.balance;
    domElements.betAmount.textContent = gameState.bet;
    domElements.spins.textContent = gameState.spins;
    domElements.wins.textContent = gameState.wins;
    domElements.losses.textContent = gameState.losses;
    domElements.biggestWin.textContent = gameState.biggestWin;

    // Disable spin button if no balance or game is spinning
    domElements.spinBtn.disabled = gameState.balance === 0 || gameState.isSpinning;

    // Show game over message when balance is zero
    if (gameState.balance === 0) {
        domElements.resultMessage.textContent = '💀 GAME OVER! AI has taken all your tokens. Try again!';
        domElements.resultMessage.style.color = '#ff6b6b';
    }
}

/** Display a random AI joke in the joke section */
function updateAIJoke() {
    const randomJoke = gameState.aiJokes[Math.floor(Math.random() * gameState.aiJokes.length)];
    domElements.aiJoke.textContent = randomJoke;
}

/** Show a temporary notification popup */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Schedule removal after 2 seconds
    const hideTimeout = setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        const removeTimeout = setTimeout(() => {
            notification.remove();
        }, 300);
        // Track timeout for cleanup
        gameState.notificationTimeouts = gameState.notificationTimeouts.filter(t => t !== hideTimeout);
        gameState.notificationTimeouts.push(removeTimeout);
    }, 2000);

    // Track timeout for cleanup
    gameState.notificationTimeouts.push(hideTimeout);
}

/* ========================================
   GAME LOGIC FUNCTIONS
   ======================================== */

/** Check if the spin resulted in a win and calculate multiplier */
function checkWin(symbols) {
    const [s1, s2, s3] = symbols;

    // All three match - highest payout
    if (s1 === s2 && s2 === s3) {
        const multiplier = gameState.symbols[s1].value * 2;
        return { win: true, multiplier };
    }

    // Two match - lower payout
    if ((s1 === s2 && s1 !== s3) || (s1 === s3 && s1 !== s2) || (s2 === s3 && s2 !== s1)) {
        return { win: true, multiplier: 1 };
    }

    // No match - loss
    return { win: false, multiplier: 0 };
}

/** Animate reels bouncing on a win */
function playWinAnimation() {
    domElements.reels.forEach((reel, index) => {
        const bounceTimeout = setTimeout(() => {
            reel.style.animation = 'none';

            const restartTimeout = setTimeout(() => {
                reel.style.animation = 'bounce 0.6s ease 3';
            }, 10);

            gameState.winAnimationTimeouts.push(restartTimeout);
        }, index * 100);

        gameState.winAnimationTimeouts.push(bounceTimeout);
    });
}

/** Stop the spinning animation and process the result */
function stopSpinning() {
    // Remove spinning animation
    domElements.reels.forEach(reel => reel.classList.remove('spinning'));

    // Get the final symbols displayed
    const symbols = domElements.reels.map(reel => reel.textContent);
    const result = checkWin(symbols);

    // Update game state
    gameState.isSpinning = false;

    if (result.win) {
        // Calculate and apply winnings
        const winAmount = result.multiplier * gameState.bet;
        gameState.balance += winAmount;
        gameState.wins++;
        gameState.biggestWin = Math.max(gameState.biggestWin, winAmount);

        // Update UI with win message
        domElements.resultMessage.textContent = `🎉 WIN! ${symbols[0]} ${symbols[1]} ${symbols[2]} | +${winAmount} tokens!`;
        domElements.resultMessage.style.color = '#4ade80';

        // Play win animations and sound
        playWinAnimation();
        playWinSound();

        showNotification(`🎉 You won ${winAmount} tokens!`);
    } else {
        // Handle loss
        gameState.losses++;
        domElements.resultMessage.textContent = `😅 Lost ${gameState.bet} tokens. Better luck next spin!`;
        domElements.resultMessage.style.color = '#ff6b6b';

        // Play loss sound
        playLossSound();

        showNotification(`😅 Lost ${gameState.bet} tokens`);
    }

    // Update all displays
    updateDisplay();
    updateAIJoke();
}

/** Execute a spin action */
function spin() {
    // Validate spin is allowed
    if (gameState.isSpinning || gameState.balance < gameState.bet) {
        playClickSound();
        showNotification('Not enough tokens!');
        return;
    }

    // Play click sound for button press
    playClickSound();

    // Update game state
    gameState.isSpinning = true;
    gameState.balance -= gameState.bet;
    gameState.spins++;
    updateDisplay();

    // Add spinning animation to reels
    domElements.reels.forEach(reel => reel.classList.add('spinning'));

    // Calculate spin duration
    const spinDuration = 800 + Math.random() * 400;
    const spinStart = Date.now();

    // Loop to change symbols while spinning
    gameState.spinInterval = setInterval(() => {
        domElements.reels.forEach(reel => {
            reel.textContent = getRandomSymbol();
        });

        // Play tick sound on each symbol change
        playTickSound();

        // Check if spin duration has elapsed
        if (Date.now() - spinStart > spinDuration) {
            clearInterval(gameState.spinInterval);
            gameState.spinInterval = null;
            stopSpinning();
        }
    }, 100);
}

/** Reset the game to initial state and clear all timers */
function resetGame() {
    // Clear all active timers
    if (gameState.spinInterval) {
        clearInterval(gameState.spinInterval);
        gameState.spinInterval = null;
    }

    gameState.winAnimationTimeouts.forEach(timeout => clearTimeout(timeout));
    gameState.winAnimationTimeouts = [];

    gameState.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
    gameState.notificationTimeouts = [];

    // Remove spinning animation
    domElements.reels.forEach(reel => {
        reel.classList.remove('spinning');
        reel.style.animation = 'none';
    });

    // Reset game state to initial values
    gameState.balance = 100;
    gameState.bet = 10;
    gameState.spins = 0;
    gameState.wins = 0;
    gameState.losses = 0;
    gameState.biggestWin = 0;
    gameState.isSpinning = false;

    // Reset reel display to default
    domElements.reels.forEach(reel => reel.textContent = '🤖');

    // Reset UI elements
    domElements.resultMessage.textContent = 'Ready to lose your tokens? Spin!';
    domElements.resultMessage.style.color = '#22d3ee';

    // Reset bet selection
    domElements.betBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-bet="10"]').classList.add('active');

    // Update all displays
    updateDisplay();
    updateAIJoke();

    // Play sound and notification
    playClickSound();
    showNotification('🔄 Game reset! Good luck!');
}

/* ========================================
   EVENT LISTENERS - Attach handlers to DOM elements
   ======================================== */

// Attach click handlers to bet buttons
domElements.betBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        playClickSound();

        // Update active bet button
        domElements.betBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Update bet amount
        gameState.bet = parseInt(e.target.dataset.bet);
        updateDisplay();
    });
});

// Attach click handler to spin button
domElements.spinBtn.addEventListener('click', spin);

// Attach click handler to reset button
domElements.resetBtn.addEventListener('click', resetGame);

/* ========================================
   INITIALIZATION - Run on page load
   ======================================== */

// Initialize display and AI joke on page load
updateDisplay();
updateAIJoke();
