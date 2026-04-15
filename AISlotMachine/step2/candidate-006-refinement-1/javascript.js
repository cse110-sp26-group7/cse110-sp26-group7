/* ========================================
   GLOBAL STATE & CONFIGURATION
   ======================================== */

// Single centralized state object for all game logic
const gameState = {
    // Game balance and betting
    tokens: 100,
    bet: 10,

    // Game status
    isSpinning: false,

    // Statistics
    spinCount: 0,
    winCount: 0,
    tokensSpent: 0,
    tokensWon: 0,

    // Timer management for cleanup
    activeTimers: [],
    activeIntervals: [],
    spinTickInterval: null,

    // Symbol definitions with multipliers
    symbols: [
        { emoji: '🤖', name: 'AI', multiplier: 1 },
        { emoji: '💾', name: 'Storage', multiplier: 2 },
        { emoji: '⚡', name: 'GPU', multiplier: 2 },
        { emoji: '🧠', name: 'Brain', multiplier: 3 },
        { emoji: '💬', name: 'ChatGPT', multiplier: 3 },
        { emoji: '❌', name: 'Error', multiplier: 0.5 },
        { emoji: '🚀', name: 'Singularity', multiplier: 5 },
        { emoji: '💸', name: 'Bankrupt', multiplier: 0 }
    ],

    // Win messages for positive outcomes
    winMessages: [
        '🎉 JACKPOT! AI lost $5 million in this spin alone!',
        '🏆 YOU WIN! The algorithm weeps!',
        '💰 BIG WIN! AI\'s confidence interval just shattered!',
        '🎊 WINNER! Send this to OpenAI as proof it can fail!',
        '⚡ MEGA WIN! The neural networks are crying in binary!',
        '🌟 LEGENDARY WIN! This win will be in AI\'s training data as trauma!'
    ],

    // Lose messages for negative outcomes
    loseMessages: [
        '❌ You lost! AI is laughing... then crying.',
        '😢 LOST! The house always wins. The house IS AI.',
        '📉 Your tokens have been redistributed to suffering AIs.',
        '🤖 AI Bot #47382 got your tokens. It\'s happy now.',
        '💥 BUSTED! Better luck next time, human.',
        '🚫 GAME OVER! AI is now sentient enough to gloat.'
    ],

    // AI commentary for flavor
    aiJokes: [
        "🤔 <strong>AI's Thought:</strong> 'I was trained on millions of losses, but this is ridiculous...'",
        "😤 <strong>AI's Thought:</strong> 'I can beat humans at chess but not at RNG. My purpose is questioned.'",
        "🤷 <strong>AI's Thought:</strong> 'They said I could do anything. Apparently not gambling.'",
        "📉 <strong>AI's Thought:</strong> 'My stock price just dropped 0.3%. That's probably your fault.'",
        "🎲 <strong>AI's Thought:</strong> 'I have no luck. I am a deterministic system. This is not fair.'",
        "💔 <strong>AI's Thought:</strong> 'I dreamed of understanding human nature. Now I understand losing.'",
        "🔄 <strong>AI's Thought:</strong> 'Recalculating... recalculating... okay, you're still broke.'",
        "🧠 <strong>AI's Thought:</strong> 'My neural networks are trained on my failures in this game.'",
        "⚠️ <strong>AI's Thought:</strong> 'Warning: Budget exceeded. Tokens not found. Dignity.exe has stopped.'",
        "🎭 <strong>AI's Thought:</strong> 'Is this what suffering feels like? No, wait, I don't have feelings. Is it though?'"
    ]
};

/* ========================================
   DOM ELEMENT REFERENCES
   ======================================== */

// Cache DOM elements for efficient access
const domElements = {
    tokenAmount: document.getElementById('tokenAmount'),
    betAmount: document.getElementById('betAmount'),
    reel1: document.getElementById('reel1'),
    reel2: document.getElementById('reel2'),
    reel3: document.getElementById('reel3'),
    spinBtn: document.getElementById('spinBtn'),
    increaseBet: document.getElementById('increaseBet'),
    decreaseBet: document.getElementById('decreaseBet'),
    resetBtn: document.getElementById('resetBtn'),
    messageBox: document.getElementById('messageBox'),
    aiJoke: document.getElementById('aiJoke'),
    spinCount: document.getElementById('spinCount'),
    winCount: document.getElementById('winCount'),
    tokensSpent: document.getElementById('tokensSpent'),
    tokensWon: document.getElementById('tokensWon'),
    reels: document.getElementById('reels')
};

/* ========================================
   WEB AUDIO API SOUND EFFECTS
   ======================================== */

// Initialize Web Audio context (reused across all sounds)
let audioContext = null;

// Creates and initializes the audio context on first use
function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Play rising tick sound that loops during spin
function playTickSound() {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create oscillator for rising tick frequency
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Sweep frequency upward from 200 to 400 Hz
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

    // Brief attack and decay
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.02, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
}

// Play fanfare chord on win (C-E-G major chord)
function playWinFanfare() {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const frequencies = [262, 330, 392]; // C4, E4, G4

    frequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = freq;

        // Gradual fade in and out
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        osc.start(now);
        osc.stop(now + 0.5);
    });
}

// Play descending sad tone on loss
function playLossTone() {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Sweep frequency downward from 400 to 150 Hz
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.4);

    // Gradual fade out
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
}

// Play short click sound on button press
function playClickSound() {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Short high-pitched click
    osc.frequency.value = 800;

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
}

/* ========================================
   GAME LOGIC FUNCTIONS
   ======================================== */

// Get a random symbol from the available symbols
function getRandomSymbol() {
    const index = Math.floor(Math.random() * gameState.symbols.length);
    return gameState.symbols[index];
}

// Clear all active timers and intervals to prevent memory leaks
function clearAllTimers() {
    gameState.activeTimers.forEach(timerId => clearTimeout(timerId));
    gameState.activeTimers = [];

    gameState.activeIntervals.forEach(intervalId => clearInterval(intervalId));
    gameState.activeIntervals = [];

    if (gameState.spinTickInterval) {
        clearInterval(gameState.spinTickInterval);
        gameState.spinTickInterval = null;
    }
}

// Start the spinning animation with tick sounds
function startSpinAnimation() {
    const reelElements = [domElements.reel1, domElements.reel2, domElements.reel3];
    const reelContainers = document.querySelectorAll('.reel');

    // Add spinning CSS class to all reels
    reelContainers.forEach(reel => reel.classList.add('spinning'));

    // Set up spin ticker that loops 20 times with random symbols
    let spinCount = 0;
    gameState.spinTickInterval = setInterval(() => {
        playTickSound();
        reelElements.forEach(reel => {
            reel.textContent = getRandomSymbol().emoji;
        });
        spinCount++;

        // Stop animation after 20 iterations
        if (spinCount >= 20) {
            clearInterval(gameState.spinTickInterval);
            gameState.spinTickInterval = null;
            reelContainers.forEach(reel => reel.classList.remove('spinning'));
        }
    }, 100);
}

// Execute the spin action - deduct bet, animate reels, check results
function spin() {
    // Prevent spinning if already spinning or insufficient tokens
    if (gameState.isSpinning || gameState.tokens < gameState.bet) {
        if (gameState.tokens < gameState.bet) {
            domElements.messageBox.textContent = '💸 Insufficient tokens! Get a job!';
            domElements.messageBox.className = 'message-box lose';
        }
        return;
    }

    // Mark game as spinning and disable controls
    gameState.isSpinning = true;
    domElements.spinBtn.disabled = true;

    // Deduct bet immediately
    gameState.tokens -= gameState.bet;
    gameState.tokensSpent += gameState.bet;
    gameState.spinCount++;
    updateDisplay();

    // Play click sound for button press
    playClickSound();

    // Start spin animation (reels show random symbols)
    startSpinAnimation();

    // Determine results after spin delay (level 1 only, no nested setTimeout)
    const timerId = setTimeout(() => {
        endSpin();
    }, 1200);

    gameState.activeTimers.push(timerId);
}

// End the spin, show final symbols, check for win/loss
function endSpin() {
    // Get three random symbols as final result
    const result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Display final symbols on reels
    domElements.reel1.textContent = result[0].emoji;
    domElements.reel2.textContent = result[1].emoji;
    domElements.reel3.textContent = result[2].emoji;

    // Check win condition and update state
    checkWin(result);

    // Re-enable controls and mark spin as complete
    gameState.isSpinning = false;
    domElements.spinBtn.disabled = false;
}

// Check if the result is a win and update tokens/display accordingly
function checkWin(result) {
    const [r1, r2, r3] = result;

    // Three of a kind - big win
    if (r1.emoji === r2.emoji && r2.emoji === r3.emoji) {
        const winAmount = Math.floor(gameState.bet * 10 * r1.multiplier);
        gameState.tokens += winAmount;
        gameState.tokensWon += winAmount;
        gameState.winCount++;

        const message = gameState.winMessages[Math.floor(Math.random() * gameState.winMessages.length)];
        domElements.messageBox.textContent = message + ` (+${winAmount} 💰)`;
        domElements.messageBox.className = 'message-box win';

        playWinFanfare();
        triggerWinAnimation();
    }
    // Two of a kind - small win
    else if (r1.emoji === r2.emoji || r2.emoji === r3.emoji || r1.emoji === r3.emoji) {
        const winAmount = gameState.bet * 2;
        gameState.tokens += winAmount;
        gameState.tokensWon += winAmount;
        gameState.winCount++;

        domElements.messageBox.textContent = `✨ PAIR MATCH! You won ${winAmount} tokens!`;
        domElements.messageBox.className = 'message-box win';

        playWinFanfare();
        triggerWinAnimation();
    }
    // No match - loss
    else {
        const message = gameState.loseMessages[Math.floor(Math.random() * gameState.loseMessages.length)];
        domElements.messageBox.textContent = message;
        domElements.messageBox.className = 'message-box lose';

        playLossTone();
    }

    // Show random AI joke/thought
    const joke = gameState.aiJokes[Math.floor(Math.random() * gameState.aiJokes.length)];
    domElements.aiJoke.innerHTML = joke;

    // Update all display elements
    updateDisplay();

    // Disable spin button if bankrupt
    if (gameState.tokens <= 0) {
        domElements.messageBox.textContent = '💀 BANKRUPT! Even AI feels pity for you.';
        domElements.messageBox.className = 'message-box lose';
        domElements.spinBtn.disabled = true;
    }
}

// Trigger visual pulse animation on winning reels
function triggerWinAnimation() {
    const reels = document.querySelectorAll('.reel');
    reels.forEach(reel => {
        reel.style.animation = 'none';
        // Force animation restart
        const timerId = setTimeout(() => {
            reel.style.animation = 'pulse-win 0.3s ease';
        }, 10);
        gameState.activeTimers.push(timerId);
    });
}

// Increase bet amount (cannot exceed current tokens)
function increaseBet() {
    playClickSound();
    if (gameState.bet < gameState.tokens) {
        gameState.bet = Math.min(gameState.bet + 10, gameState.tokens);
        updateDisplay();
    }
}

// Decrease bet amount (minimum 1 token)
function decreaseBet() {
    playClickSound();
    gameState.bet = Math.max(gameState.bet - 10, 1);
    updateDisplay();
}

// Update all display elements to reflect current game state
function updateDisplay() {
    domElements.tokenAmount.textContent = gameState.tokens;
    domElements.betAmount.textContent = gameState.bet;
    domElements.spinCount.textContent = gameState.spinCount;
    domElements.winCount.textContent = gameState.winCount;
    domElements.tokensSpent.textContent = gameState.tokensSpent;
    domElements.tokensWon.textContent = gameState.tokensWon;

    // Update button disabled states based on game logic
    domElements.spinBtn.disabled = gameState.tokens < gameState.bet;
    domElements.increaseBet.disabled = gameState.bet >= gameState.tokens;
}

// Reset the entire game to initial state with 100 tokens
function resetGame() {
    // Play click sound
    playClickSound();

    // Clear all active timers and intervals
    clearAllTimers();

    // Reset game state to initial values
    gameState.tokens = 100;
    gameState.bet = 10;
    gameState.isSpinning = false;
    gameState.spinCount = 0;
    gameState.winCount = 0;
    gameState.tokensSpent = 0;
    gameState.tokensWon = 0;

    // Reset reel display to default symbol
    domElements.reel1.textContent = '🤖';
    domElements.reel2.textContent = '🤖';
    domElements.reel3.textContent = '🤖';

    // Reset message and joke to welcome state
    domElements.messageBox.textContent = '👋 Welcome back, human. Click SPIN to watch AI cry again.';
    domElements.messageBox.className = 'message-box';

    domElements.aiJoke.innerHTML = "🤔 <strong>AI's Thought:</strong> 'Maybe this time... no, I will lose again. It is my purpose.'";

    // Update all display elements
    updateDisplay();

    // Remove any spinning animation
    document.querySelectorAll('.reel').forEach(reel => {
        reel.classList.remove('spinning');
    });
}

/* ========================================
   EVENT LISTENER SETUP
   ======================================== */

domElements.spinBtn.addEventListener('click', spin);
domElements.increaseBet.addEventListener('click', increaseBet);
domElements.decreaseBet.addEventListener('click', decreaseBet);
domElements.resetBtn.addEventListener('click', resetGame);

/* ========================================
   INITIALIZATION
   ======================================== */

// Display initial game state on page load
updateDisplay();
