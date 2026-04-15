/* ========================================
   CASINO-STYLE SYMBOL SVG DATA URLS - AI themed visuals
   ======================================== */

// Create SVG casino symbols with AI theming
const createSymbolSVG = {
    // Robot/AI Bot - stylized mechanical head
    bot: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23a855f7' width='200' height='200' rx='20'/%3E%3Crect fill='%2322d3ee' x='50' y='30' width='100' height='100' rx='10'/%3E%3Ccircle fill='%230f0f0f' cx='75' cy='60' r='10'/%3E%3Ccircle fill='%230f0f0f' cx='125' cy='60' r='10'/%3E%3Crect fill='%2322d3ee' x='70' y='85' width='60' height='15' rx='5'/%3E%3Crect fill='%23a855f7' x='45' y='140' width='110' height='30' rx='10'/%3E%3Ccircle fill='%2322d3ee' cx='85' cy='155' r='6'/%3E%3Ccircle fill='%2322d3ee' cx='115' cy='155' r='6'/%3E%3C/svg%3E`,

    // Data/Database - cylinder with circuit patterns
    data: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23a855f7' width='200' height='200' rx='20'/%3E%3Cellipse cx='100' cy='50' rx='50' ry='35' fill='%2322d3ee'/%3E%3Crect fill='%2322d3ee' x='50' y='50' width='100' height='80'/%3E%3Cellipse cx='100' cy='130' rx='50' ry='35' fill='%2322d3ee'/%3E%3Crect fill='%230f0f0f' x='65' y='70' width='10' height='30'/%3E%3Crect fill='%230f0f0f' x='125' y='70' width='10' height='30'/%3E%3Cline x1='70' y1='100' x2='130' y2='100' stroke='%230f0f0f' stroke-width='2'/%3E%3Ccircle cx='90' cy='85' r='4' fill='%230f0f0f'/%3E%3Ccircle cx='110' cy='115' r='4' fill='%230f0f0f'/%3E%3C/svg%3E`,

    // Brain/AI Intelligence - neural network pattern
    brain: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23a855f7' width='200' height='200' rx='20'/%3E%3Cellipse cx='100' cy='80' rx='45' ry='55' fill='%2322d3ee'/%3E%3Ccircle cx='75' cy='50' r='8' fill='%230f0f0f'/%3E%3Ccircle cx='100' cy='40' r='8' fill='%230f0f0f'/%3E%3Ccircle cx='125' cy='50' r='8' fill='%230f0f0f'/%3E%3Ccircle cx='70' cy='90' r='8' fill='%230f0f0f'/%3E%3Ccircle cx='130' cy='90' r='8' fill='%230f0f0f'/%3E%3Cline x1='75' y1='50' x2='100' y2='40' stroke='%230f0f0f' stroke-width='2'/%3E%3Cline x1='100' y1='40' x2='125' y2='50' stroke='%230f0f0f' stroke-width='2'/%3E%3Cline x1='75' y1='50' x2='70' y2='90' stroke='%230f0f0f' stroke-width='2'/%3E%3Cline x1='125' y1='50' x2='130' y2='90' stroke='%230f0f0f' stroke-width='2'/%3E%3Crect fill='%2322d3ee' x='60' y='130' width='80' height='40' rx='8'/%3E%3C/svg%3E`,

    // Analytics/Data Charts - vertical bars
    analytics: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23a855f7' width='200' height='200' rx='20'/%3E%3Crect fill='%2322d3ee' x='45' y='100' width='25' height='60'/%3E%3Crect fill='%2322d3ee' x='87' y='70' width='25' height='90'/%3E%3Crect fill='%2322d3ee' x='130' y='85' width='25' height='75'/%3E%3Cline x1='40' y1='165' x2='160' y2='165' stroke='%230f0f0f' stroke-width='3'/%3E%3Ccircle cx='57' cy='110' r='3' fill='%230f0f0f'/%3E%3Ccircle cx='99' cy='95' r='3' fill='%230f0f0f'/%3E%3Ccircle cx='142' cy='105' r='3' fill='%230f0f0f'/%3E%3C/svg%3E`,

    // Power/Energy - lightning bolt
    power: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23a855f7' width='200' height='200' rx='20'/%3E%3Cpolygon points='100,30 130,90 90,90 140,170 50,100 90,100' fill='%2322d3ee'/%3E%3Cpolygon points='100,30 130,90 90,90 140,170 50,100 90,100' fill='%230f0f0f' opacity='0.3'/%3E%3C/svg%3E`,

    // Algorithm/Pattern - geometric network
    algorithm: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23a855f7' width='200' height='200' rx='20'/%3E%3Crect fill='%2322d3ee' x='40' y='40' width='120' height='120' rx='15'/%3E%3Ccircle cx='60' cy='60' r='12' fill='%230f0f0f'/%3E%3Ccircle cx='100' cy='60' r='12' fill='%230f0f0f'/%3E%3Ccircle cx='140' cy='60' r='12' fill='%230f0f0f'/%3E%3Ccircle cx='60' cy='100' r='12' fill='%230f0f0f'/%3E%3Ccircle cx='140' cy='100' r='12' fill='%230f0f0f'/%3E%3Ccircle cx='100' cy='140' r='12' fill='%230f0f0f'/%3E%3Cline x1='60' y1='60' x2='100' y2='60' stroke='%230f0f0f' stroke-width='2'/%3E%3Cline x1='100' y1='60' x2='140' y2='60' stroke='%230f0f0f' stroke-width='2'/%3E%3Cline x1='60' y1='60' x2='60' y2='100' stroke='%230f0f0f' stroke-width='2'/%3E%3Cline x1='140' y1='60' x2='140' y2='100' stroke='%230f0f0f' stroke-width='2'/%3E%3Cline x1='60' y1='100' x2='100' y2='140' stroke='%230f0f0f' stroke-width='2'/%3E%3Cline x1='140' y1='100' x2='100' y2='140' stroke='%230f0f0f' stroke-width='2'/%3E%3C/svg%3E`
};

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

    // Web Audio API context
    audioContext: null,

    // Symbol definitions with their win values and SVG images
    symbols: {
        'bot': { value: 5, name: 'AI Bot', svg: createSymbolSVG.bot() },
        'data': { value: 4, name: 'Data', svg: createSymbolSVG.data() },
        'brain': { value: 3, name: 'Brain', svg: createSymbolSVG.brain() },
        'analytics': { value: 2, name: 'Analytics', svg: createSymbolSVG.analytics() },
        'power': { value: 1, name: 'Power', svg: createSymbolSVG.power() },
        'algorithm': { value: 1, name: 'Algorithm', svg: createSymbolSVG.algorithm() }
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
    reelImages: [
        document.querySelector('#reel1 .reel-image'),
        document.querySelector('#reel2 .reel-image'),
        document.querySelector('#reel3 .reel-image')
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

    frequencies.forEach((freq) => {
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

/** Get a random symbol key from the available symbols */
function getRandomSymbol() {
    const symbolKeys = Object.keys(gameState.symbols);
    return symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
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
function checkWin(symbolKeys) {
    const [s1, s2, s3] = symbolKeys;

    // All three match - highest payout
    if (s1 === s2 && s2 === s3) {
        const multiplier = gameState.symbols[s1].value * 2;
        return { win: true, multiplier, symbols: [s1, s2, s3] };
    }

    // Two match - lower payout
    if ((s1 === s2 && s1 !== s3) || (s1 === s3 && s1 !== s2) || (s2 === s3 && s2 !== s1)) {
        return { win: true, multiplier: 1, symbols: [s1, s2, s3] };
    }

    // No match - loss
    return { win: false, multiplier: 0, symbols: [s1, s2, s3] };
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
    const currentSymbolKeys = domElements.reelImages.map(img => {
        // Extract symbol key from data URL by matching against our symbols
        for (const key in gameState.symbols) {
            if (img.src === gameState.symbols[key].svg) {
                return key;
            }
        }
        return 'bot'; // fallback
    });

    const result = checkWin(currentSymbolKeys);

    // Update game state
    gameState.isSpinning = false;

    if (result.win) {
        // Calculate and apply winnings
        const winAmount = result.multiplier * gameState.bet;
        gameState.balance += winAmount;
        gameState.wins++;
        gameState.biggestWin = Math.max(gameState.biggestWin, winAmount);

        // Update UI with win message using symbol names
        const symbolNames = result.symbols.map(key => gameState.symbols[key].name).join(' ');
        domElements.resultMessage.textContent = `🎉 WIN! ${symbolNames} | +${winAmount} tokens!`;
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
        domElements.reelImages.forEach(img => {
            const randomSymbol = getRandomSymbol();
            img.src = gameState.symbols[randomSymbol].svg;
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

    // Reset reel display to default (bot symbol)
    const botImage = gameState.symbols['bot'].svg;
    domElements.reelImages.forEach(img => {
        img.src = botImage;
    });

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

// Set initial reel images
const botImage = gameState.symbols['bot'].svg;
domElements.reelImages.forEach(img => {
    img.src = botImage;
});
