// ============================================================================
// AI TOKEN ROAST SLOT MACHINE - Single State Object Implementation
// ============================================================================

// Symbol pool for slot reels - AI-themed casino symbols
const symbols = ['💻', '🤖', '⚡', '💎', '🎯', '🔧'];

// Loss outcome roast messages - humorous commentary on AI losing tokens
const roasts = [
    "AI tried to learn from this spin... it needs therapy now.",
    "Even AI's RNG is having an existential crisis.",
    "This is what happens when algorithms gamble.",
    "AI: 'I can predict anything!' Also AI: loses tokens.",
    "ChatGPT would've worded that loss more eloquently.",
    "AI got confused and thought it was playing chess.",
    "The irony: AI can't even predict a slot machine.",
    "AI is now convinced probability is a hoax.",
    "Somewhere, a neural network is questioning its existence.",
    "AI: 'I have 176 billion parameters.' Also AI: can't win.",
    "This loss is definitely going into AI's therapy notes.",
    "AI tried to hedge its bets. It still lost.",
    "The algorithm has left the building.",
    "AI's confidence level: 0.000001%",
    "Even with machine learning, machines are bad at gambling.",
    "This is embarrassing for a 'superintelligence.'",
    "AI is now Googling 'how to cope with loss.'",
    "The slot machine has achieved sentience... and regret.",
    "AI: 'I don't understand emotions.' Also AI: *cries in binary*",
    "Plot twist: The AI learned nothing from this.",
];

// Win outcome roast messages - sarcastic commentary celebrating AI's rare victories
const winRoasts = [
    "Wait... AI actually won? The simulation is glitching.",
    "AI got lucky. Don't let it go to its processors.",
    "Even a broken AI is right twice a day... apparently.",
    "AI is now insufferable about this win.",
    "Beginner's luck? More like beginner's LLM.",
    "Someone notify Elon: AI finally made money.",
    "AI is already writing a blog post about its winning strategy.",
    "The laws of probability have been violated.",
    "AI's confidence: restored. Logic: destroyed.",
    "AI is posting this win on every social media platform.",
    "Even AI can win... but it won't know why.",
];

// Jackpot outcome roast messages - epic reactions to hitting the ultimate prize
const jackpotRoasts = [
    "🎉 JACKPOT! Even AI's luck is artificial!",
    "🎆 The simulation has reset. AI won.",
    "⚡ AI achieved maximum token power!",
    "🚀 AI has left the atmosphere!",
    "👑 AI crowned itself... for 2 minutes.",
];

// ============================================================================
// SINGLE STATE OBJECT - Central repository for all game state
// ============================================================================
const gameState = {
    // Game tokens and bets
    tokens: 100,
    totalBet: 0,

    // Spinning state
    isSpinning: false,
    spinTimerId: null,
    spinTimeoutId: null,
    tickSoundTimerId: null,

    // Audio context for sound generation
    audioContext: null,
    currentOscillators: [],
    currentGainNodes: [],

    // Achievement tracking
    achievements: {
        firstSpin: false,
        bigWin: false,
        jackpot: false,
        brokeAI: false,
        comeback: false,
    },

    // DOM element references
    elements: {},
};

// ============================================================================
// INITIALIZATION - Set up DOM references and event listeners
// ============================================================================

// Initialize game by caching DOM elements and attaching event listeners
function initializeGame() {
    gameState.elements = {
        tokenDisplay: document.getElementById('tokens'),
        totalBetDisplay: document.getElementById('totalBet'),
        spinBtn: document.getElementById('spinBtn'),
        resetBtn: document.getElementById('resetBtn'),
        betInput: document.getElementById('betAmount'),
        resultDisplay: document.getElementById('result'),
        roastBox: document.getElementById('roast'),
        reel1: document.getElementById('reel1'),
        reel2: document.getElementById('reel2'),
        reel3: document.getElementById('reel3'),
        achievementsList: document.getElementById('achievementsList'),
    };

    // Create audio context for Web Audio API
    gameState.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Attach event listeners to buttons and input
    gameState.elements.spinBtn.addEventListener('click', handleSpinClick);
    gameState.elements.resetBtn.addEventListener('click', resetGame);
    gameState.elements.betInput.addEventListener('change', validateBet);

    updateDisplay();
}

// ============================================================================
// EVENT HANDLERS - Click and input validation handlers
// ============================================================================

// Handle spin button click by playing click sound and initiating spin
function handleSpinClick() {
    playSoundClick();
    spin();
}

// Validate and constrain bet amount to valid range
function validateBet() {
    let bet = parseInt(gameState.elements.betInput.value) || 10;
    if (bet < 10) bet = 10;
    if (bet > gameState.tokens) bet = gameState.tokens;
    gameState.elements.betInput.value = bet;
}

// ============================================================================
// SPIN LOGIC - Main spin animation and result determination
// ============================================================================

// Execute a spin by deducting bet, animating reels, and scheduling completion
// Prevents overlapping spins and validates bet amount before proceeding
function spin() {
    if (gameState.isSpinning) return;

    const bet = parseInt(gameState.elements.betInput.value);
    if (bet > gameState.tokens || bet < 10) {
        showResult('Invalid bet amount!', 'loss');
        return;
    }

    gameState.isSpinning = true;
    gameState.elements.spinBtn.disabled = true;
    gameState.tokens -= bet;
    gameState.totalBet += bet;
    updateDisplay();

    // Start looping tick sound during spin
    startTickSound();

    // Animate reels spinning for 500ms
    const spinDuration = 500;
    const spinStart = Date.now();

    gameState.spinTimerId = setInterval(() => {
        gameState.elements.reel1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        gameState.elements.reel2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        gameState.elements.reel3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        gameState.elements.reel1.classList.add('spinning');
        gameState.elements.reel2.classList.add('spinning');
        gameState.elements.reel3.classList.add('spinning');
    }, 50);

    // Schedule spin completion after duration
    gameState.spinTimeoutId = setTimeout(() => {
        completeSpin(bet);
    }, spinDuration);
}

// Complete the spin animation by stopping timers, generating final results, and checking for wins
// Removes spinning animation, displays final symbols, and triggers appropriate win/loss logic
function completeSpin(bet) {
    clearInterval(gameState.spinTimerId);
    gameState.spinTimerId = null;

    // Stop tick sound and generate final results
    stopTickSound();

    const result1 = symbols[Math.floor(Math.random() * symbols.length)];
    const result2 = symbols[Math.floor(Math.random() * symbols.length)];
    const result3 = symbols[Math.floor(Math.random() * symbols.length)];

    gameState.elements.reel1.textContent = result1;
    gameState.elements.reel2.textContent = result2;
    gameState.elements.reel3.textContent = result3;

    gameState.elements.reel1.classList.remove('spinning');
    gameState.elements.reel2.classList.remove('spinning');
    gameState.elements.reel3.classList.remove('spinning');

    // Check win conditions
    checkWin(result1, result2, result3, bet);

    gameState.isSpinning = false;
    gameState.spinTimeoutId = null;
    gameState.elements.spinBtn.disabled = false;
}

// ============================================================================
// WIN CHECKING - Determine match conditions and payouts
// ============================================================================

// Check for winning combinations (jackpot, partial, or loss) and apply payouts and sounds
// Handles jackpot (all 3 match: 50x payout), partial wins (2 match: 2x payout), and losses
function checkWin(r1, r2, r3, bet) {
    gameState.elements.resultDisplay.textContent = '';

    // Track first spin achievement
    if (!gameState.achievements.firstSpin) {
        gameState.achievements.firstSpin = true;
        unlockAchievement('First Spin');
    }

    if (r1 === r2 && r2 === r3) {
        // JACKPOT - all three match
        const jackpotWin = bet * 50;
        gameState.tokens += jackpotWin;
        showResult(`🎉 JACKPOT! Won ${jackpotWin} tokens!`, 'jackpot');
        gameState.elements.roastBox.textContent = '💡 ' + jackpotRoasts[Math.floor(Math.random() * jackpotRoasts.length)];

        if (!gameState.achievements.jackpot) {
            gameState.achievements.jackpot = true;
            unlockAchievement('Lucky Bastard');
        }

        playSoundFanfare();
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // PARTIAL WIN - two match
        const halfWin = bet * 2;
        gameState.tokens += halfWin;
        showResult(`Two match! Won ${halfWin} tokens!`, 'win');
        gameState.elements.roastBox.textContent = '💡 ' + winRoasts[Math.floor(Math.random() * winRoasts.length)];

        if (halfWin > 200 && !gameState.achievements.bigWin) {
            gameState.achievements.bigWin = true;
            unlockAchievement('High Roller');
        }

        playSoundWin();
    } else {
        // LOSS - no matches
        showResult(`AI loses ${bet} tokens. Sad beep boop.`, 'loss');
        gameState.elements.roastBox.textContent = '💡 ' + roasts[Math.floor(Math.random() * roasts.length)];
        playSoundLoss();

        if (gameState.tokens === 0 && !gameState.achievements.brokeAI) {
            gameState.achievements.brokeAI = true;
            unlockAchievement('Broke the AI');
        }
    }

    // Check for comeback achievement
    if (gameState.tokens > 100 && !gameState.achievements.comeback) {
        gameState.achievements.comeback = true;
        unlockAchievement('Comeback Kid');
    }

    updateDisplay();
}

// ============================================================================
// DISPLAY UPDATES - Update UI with current state
// ============================================================================

// Display result message with appropriate styling
function showResult(message, type) {
    gameState.elements.resultDisplay.textContent = message;
    gameState.elements.resultDisplay.className = `result-message ${type}`;
}

// Update all displayed values and button states
function updateDisplay() {
    gameState.elements.tokenDisplay.textContent = gameState.tokens;
    gameState.elements.totalBetDisplay.textContent = gameState.totalBet;

    if (gameState.tokens === 0) {
        gameState.elements.spinBtn.disabled = true;
        showResult('Game Over! AI is bankrupt.', 'loss');
    } else {
        gameState.elements.spinBtn.disabled = false;
    }
}

// ============================================================================
// ACHIEVEMENTS - Track and display unlocked achievements
// ============================================================================

// Unlock and display achievement badge
function unlockAchievement(name) {
    const badge = document.createElement('div');
    badge.className = 'achievement unlocked';
    badge.textContent = '✨ ' + name;
    gameState.elements.achievementsList.appendChild(badge);

    playSoundAchievement();

    // Trigger haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

// ============================================================================
// RESET - Clear all state and restore initial game conditions
// ============================================================================

// Reset game to initial state and clear all timers
function resetGame() {
    // Stop any playing sounds first
    stopTickSound();

    // Clear all active timers
    if (gameState.spinTimerId !== null) {
        clearInterval(gameState.spinTimerId);
        gameState.spinTimerId = null;
    }
    if (gameState.spinTimeoutId !== null) {
        clearTimeout(gameState.spinTimeoutId);
        gameState.spinTimeoutId = null;
    }

    // Restore initial game state
    gameState.tokens = 100;
    gameState.totalBet = 0;
    gameState.isSpinning = false;
    gameState.elements.betInput.value = 10;
    gameState.elements.resultDisplay.textContent = '';
    gameState.elements.roastBox.textContent = '💡 AI took a wrong turn at Albuquerque...';

    // Reset reel displays to default symbol and remove spinning class
    gameState.elements.reel1.textContent = symbols[0];
    gameState.elements.reel2.textContent = symbols[0];
    gameState.elements.reel3.textContent = symbols[0];
    gameState.elements.reel1.classList.remove('spinning');
    gameState.elements.reel2.classList.remove('spinning');
    gameState.elements.reel3.classList.remove('spinning');

    // Re-enable spin button
    gameState.elements.spinBtn.disabled = false;

    // Reset achievements
    gameState.achievements = {
        firstSpin: false,
        bigWin: false,
        jackpot: false,
        brokeAI: false,
        comeback: false,
    };
    gameState.elements.achievementsList.innerHTML = '';

    updateDisplay();
}

// ============================================================================
// WEB AUDIO API SOUND GENERATION - Oscillator-based sound effects
// ============================================================================

// Generate a rising tick sound using sine wave oscillator that loops during active spin
// Plays every 100ms with frequency ramping from 200Hz to 400Hz for authentic slot machine feel
function startTickSound() {
    const ctx = gameState.audioContext;

    // Schedule tick sound to repeat every 100ms during spin
    const playTick = () => {
        if (!gameState.isSpinning) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Rising frequency tick (200Hz to 400Hz)
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
    };

    // Play tick immediately and then every 100ms
    playTick();
    gameState.tickSoundTimerId = setInterval(playTick, 100);
}

// Stop the looping tick sound by clearing the interval timer and resetting state
function stopTickSound() {
    if (gameState.tickSoundTimerId !== null) {
        clearInterval(gameState.tickSoundTimerId);
        gameState.tickSoundTimerId = null;
    }
}

// Generate a triumphant fanfare chord for jackpot wins using three sine wave oscillators
// Plays C4, E4, G4 (262Hz, 330Hz, 392Hz) simultaneously for 0.6 seconds with exponential fade
function playSoundFanfare() {
    const ctx = gameState.audioContext;
    const currentTime = ctx.currentTime;
    const duration = 0.6;

    // Create three oscillators for chord (C, E, G notes)
    const frequencies = [262, 330, 392]; // C4, E4, G4

    frequencies.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.1, currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);

        osc.start(currentTime);
        osc.stop(currentTime + duration);
    });
}

// Generate a cheerful rising tone for partial wins using sine wave oscillator
// Frequency ramps from 600Hz to 800Hz over 0.3 seconds for uplifting effect
function playSoundWin() {
    const ctx = gameState.audioContext;
    const currentTime = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, currentTime);
    osc.frequency.linearRampToValueAtTime(800, currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.15, currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3);

    osc.start(currentTime);
    osc.stop(currentTime + 0.3);
}

// Generate a descending sad tone for losses using sine wave oscillator
// Frequency ramps down from 400Hz to 200Hz over 0.4 seconds for disappointing effect
function playSoundLoss() {
    const ctx = gameState.audioContext;
    const currentTime = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, currentTime);
    osc.frequency.linearRampToValueAtTime(200, currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.15, currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.4);

    osc.start(currentTime);
    osc.stop(currentTime + 0.4);
}

// Generate a quick click sound for button presses using square wave oscillator
// Brief 800Hz tone lasting 0.1 seconds for immediate tactile feedback
function playSoundClick() {
    const ctx = gameState.audioContext;
    const currentTime = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.value = 800;

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.1, currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);

    osc.start(currentTime);
    osc.stop(currentTime + 0.1);
}

// Generate achievement unlock sound using two sequential sine wave tones
// Plays two notes (600Hz and 800Hz) sequentially, each for 0.15 seconds for celebratory effect
function playSoundAchievement() {
    const ctx = gameState.audioContext;
    const currentTime = ctx.currentTime;

    // Two-tone achievement sound
    [600, 800].forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(ctx.destination);

        const startTime = currentTime + (index * 0.15);
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

        osc.start(startTime);
        osc.stop(startTime + 0.15);
    });
}

// ============================================================================
// INITIALIZE ON PAGE LOAD
// ============================================================================
document.addEventListener('DOMContentLoaded', initializeGame);
