/* ========================================
   CASINO-STYLE SYMBOLS - AI themed with high-quality visuals
   ======================================== */

// Symbol definitions with casino-quality visual representations
const createSymbolSVG = {
    // Robot/AI Bot - sleek mechanical head with digital elements (AI themed)
    bot: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23a855f7' width='200' height='200' rx='20'/%3E%3Crect fill='%2322d3ee' x='40' y='20' width='120' height='110' rx='15'/%3E%3Crect fill='%230f0f0f' x='60' y='40' width='25' height='35' rx='5'/%3E%3Crect fill='%230f0f0f' x='115' y='40' width='25' height='35' rx='5'/%3E%3Ccircle fill='%2322d3ee' cx='72' cy='57' r='6'/%3E%3Ccircle fill='%2322d3ee' cx='127' cy='57' r='6'/%3E%3Crect fill='%2322d3ee' x='55' y='90' width='90' height='20' rx='8'/%3E%3Crect fill='%23a855f7' x='30' y='135' width='140' height='45' rx='12'/%3E%3Ccircle fill='%2322d3ee' cx='65' cy='162' r='8'/%3E%3Ccircle fill='%2322d3ee' cx='100' cy='162' r='8'/%3E%3Ccircle fill='%2322d3ee' cx='135' cy='162' r='8'/%3E%3C/svg%3E`,

    // Gold Bar - classic casino symbol for wealth and jackpot potential
    gold: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23654321' width='200' height='200' rx='20'/%3E%3Crect fill='%23FFD700' x='25' y='50' width='150' height='100' rx='8'/%3E%3Crect fill='%23FFA500' x='28' y='53' width='144' height='94'/%3E%3Crect fill='%23FFD700' x='35' y='60' width='130' height='80'/%3E%3Cline x1='50' y1='70' x2='150' y2='70' stroke='%23FFA500' stroke-width='2'/%3E%3Cline x1='50' y1='95' x2='150' y2='95' stroke='%23FFA500' stroke-width='2'/%3E%3Cline x1='50' y1='120' x2='150' y2='120' stroke='%23FFA500' stroke-width='2'/%3E%3C/svg%3E`,

    // Diamond - high-value casino gem symbol
    diamond: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23000080' width='200' height='200' rx='20'/%3E%3Cpolygon points='100,30 160,100 100,170 40,100' fill='%2300CED1'/%3E%3Cpolygon points='100,30 160,100 100,170 40,100' fill='%2300FFFF' opacity='0.6'/%3E%3Cline x1='100' y1='30' x2='100' y2='170' stroke='%23FFFFFF' stroke-width='2'/%3E%3Cline x1='40' y1='100' x2='160' y2='100' stroke='%23FFFFFF' stroke-width='2'/%3E%3C/svg%3E`,

    // Cherry - classic fruit slot machine symbol
    cherry: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23228B22' width='200' height='200' rx='20'/%3E%3Ccircle cx='70' cy='80' r='25' fill='%23DC143C'/%3E%3Ccircle cx='110' cy='70' r='25' fill='%23DC143C'/%3E%3Cpath d='M 85 50 Q 85 40 90 30' stroke='%23654321' stroke-width='3' fill='none'/%3E%3Cpath d='M 100 50 Q 100 40 105 30' stroke='%23654321' stroke-width='3' fill='none'/%3E%3Cellipse cx='75' cy='120' rx='35' ry='30' fill='%23FFD700'/%3E%3C/svg%3E`,

    // Seven - classic lucky number slot symbol
    seven: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23FF0000' width='200' height='200' rx='20'/%3E%3Ctext x='100' y='155' font-size='120' font-weight='bold' fill='%23FFD700' text-anchor='middle'%3E7%3C/text%3E%3C/svg%3E`,

    // Bell - classic slot machine sound symbol
    bell: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23DC143C' width='200' height='200' rx='20'/%3E%3Cpath d='M 80 70 Q 80 40 100 40 Q 120 40 120 70' fill='%23FFD700'/%3E%3Cpath d='M 75 65 Q 75 35 100 35 Q 125 35 125 65 L 125 100 Q 125 120 100 120 Q 75 120 75 100 Z' fill='%23FFD700' stroke='%23FF8C00' stroke-width='2'/%3E%3Crect x='95' y='120' width='10' height='35' fill='%23FF8C00'/%3E%3C/svg%3E`,

    // Star - bonus/lucky symbol
    star: () => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23FFD700' width='200' height='200' rx='20'/%3E%3Cpolygon points='100,30 130,90 195,90 145,135 170,195 100,150 30,195 55,135 5,90 70,90' fill='%23FFFFFF'/%3E%3C/svg%3E`
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
        'gold': { value: 5, name: 'Gold Bar', svg: createSymbolSVG.gold() },
        'diamond': { value: 4, name: 'Diamond', svg: createSymbolSVG.diamond() },
        'seven': { value: 4, name: 'Lucky 7', svg: createSymbolSVG.seven() },
        'cherry': { value: 3, name: 'Cherry', svg: createSymbolSVG.cherry() },
        'bell': { value: 2, name: 'Bell', svg: createSymbolSVG.bell() },
        'star': { value: 2, name: 'Star', svg: createSymbolSVG.star() }
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

    // Disable bet buttons for amounts higher than current balance
    domElements.betBtns.forEach(btn => {
        const betAmount = parseInt(btn.dataset.bet);
        btn.disabled = betAmount > gameState.balance;
    });

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

/** Check if the spin resulted in a win and calculate multiplier, return matched reel indices */
function checkWin(symbolKeys) {
    const [s1, s2, s3] = symbolKeys;
    let matchedIndices = [];

    // All three match - highest payout
    if (s1 === s2 && s2 === s3) {
        const multiplier = gameState.symbols[s1].value * 2;
        return { win: true, multiplier, symbols: [s1, s2, s3], matchedIndices: [0, 1, 2] };
    }

    // Two match - lower payout with specific matched reel indices
    if (s1 === s2 && s1 !== s3) {
        return { win: true, multiplier: 1, symbols: [s1, s2, s3], matchedIndices: [0, 1] };
    }
    if (s1 === s3 && s1 !== s2) {
        return { win: true, multiplier: 1, symbols: [s1, s2, s3], matchedIndices: [0, 2] };
    }
    if (s2 === s3 && s2 !== s1) {
        return { win: true, multiplier: 1, symbols: [s1, s2, s3], matchedIndices: [1, 2] };
    }

    // No match - loss
    return { win: false, multiplier: 0, symbols: [s1, s2, s3], matchedIndices: [] };
}

/** Animate only matched reels bouncing on a win - plays 3 bounces with staggered timing */
function playWinAnimation(matchedIndices) {
    matchedIndices.forEach((index) => {
        const reel = domElements.reels[index];
        // Reset animation by removing and re-applying it with staggered timing
        const staggerTimeout = setTimeout(() => {
            reel.style.animation = 'none';
            // Force reflow to ensure animation restarts
            void reel.offsetHeight;
            reel.style.animation = 'bounce 0.6s ease 3';
        }, index * 150);
        gameState.winAnimationTimeouts.push(staggerTimeout);
    });
}

/** Stop the spinning animation and process the result */
function stopSpinning() {
    // Clear the spinning interval immediately
    if (gameState.spinInterval) {
        clearInterval(gameState.spinInterval);
        gameState.spinInterval = null;
    }

    // Remove spinning animation class to stop visual rotation
    domElements.reels.forEach(reel => reel.classList.remove('spinning'));

    // Small delay to ensure final symbols are visible before processing
    const processTimeout = setTimeout(() => {
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

            // Play win animations and sound - only animate matched reels
            playWinAnimation(result.matchedIndices);
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
    }, 50);

    gameState.winAnimationTimeouts.push(processTimeout);
}

/** Execute a spin action - rotates reels with symbols and plays animation */
function spin() {
    // Validate spin is allowed
    if (gameState.isSpinning || gameState.balance < gameState.bet) {
        playClickSound();
        showNotification('Not enough tokens!');
        return;
    }

    // Play click sound for button press
    playClickSound();

    // Clear any previous spinning state to prevent conflicts
    if (gameState.spinInterval) {
        clearInterval(gameState.spinInterval);
        gameState.spinInterval = null;
    }

    // Update game state
    gameState.isSpinning = true;
    gameState.balance -= gameState.bet;
    gameState.spins++;
    updateDisplay();

    // Ensure reels are not in spinning class initially, then add it
    domElements.reels.forEach(reel => {
        reel.classList.remove('spinning');
        // Force reflow
        void reel.offsetHeight;
        reel.classList.add('spinning');
    });

    // Calculate spin duration (800-1200ms for realistic feel)
    const spinDuration = 800 + Math.random() * 400;
    const spinStart = Date.now();

    // Interval to change symbols every 100ms while spinning
    gameState.spinInterval = setInterval(() => {
        // Update each reel with a random symbol
        domElements.reelImages.forEach(img => {
            const randomSymbol = getRandomSymbol();
            img.src = gameState.symbols[randomSymbol].svg;
        });

        // Play tick sound on each symbol change
        playTickSound();

        // Check if spin duration has elapsed and stop if so
        if (Date.now() - spinStart > spinDuration) {
            stopSpinning();
        }
    }, 100);
}

/** Reset the game to initial state and clear all timers - full cleanup of spinning/animations */
function resetGame() {
    // Clear the main spinning interval
    if (gameState.spinInterval) {
        clearInterval(gameState.spinInterval);
        gameState.spinInterval = null;
    }

    // Clear all animation timeouts
    gameState.winAnimationTimeouts.forEach(timeout => clearTimeout(timeout));
    gameState.winAnimationTimeouts = [];

    // Clear all notification timeouts
    gameState.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
    gameState.notificationTimeouts = [];

    // Remove all spinning and animation classes from reels
    domElements.reels.forEach(reel => {
        reel.classList.remove('spinning');
        reel.style.animation = '';
    });

    // Reset game state to initial values
    gameState.balance = 100;
    gameState.bet = 10;
    gameState.spins = 0;
    gameState.wins = 0;
    gameState.losses = 0;
    gameState.biggestWin = 0;
    gameState.isSpinning = false;

    // Reset reel display to default (bot symbol - AI theme)
    const defaultImage = gameState.symbols['bot'].svg;
    domElements.reelImages.forEach(img => {
        img.src = defaultImage;
    });

    // Reset UI elements to initial state
    domElements.resultMessage.textContent = 'Ready to lose your tokens? Spin!';
    domElements.resultMessage.style.color = '#22d3ee';

    // Reset bet selection to default (10 tokens)
    domElements.betBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-bet="10"]').classList.add('active');

    // Update all displays (balance, bet, stats)
    updateDisplay();
    updateAIJoke();

    // Provide audio/visual feedback for reset
    playClickSound();
    showNotification('🔄 Game reset! Good luck!');
}

/* ========================================
   EVENT LISTENERS - Attach handlers to DOM elements
   ======================================== */

// Attach click handlers to bet buttons
domElements.betBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Prevent changing to a disabled bet amount
        if (e.target.disabled) {
            playClickSound();
            showNotification('Insufficient tokens for this bet');
            return;
        }

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
