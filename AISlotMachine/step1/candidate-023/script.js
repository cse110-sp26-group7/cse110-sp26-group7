// Game state
const gameState = {
    tokens: 1000,
    totalSpins: 0,
    totalWins: 0,
    balance: 0,
    isSpinning: false,
};

// AI-themed messages
const aiMessages = {
    win: [
        "🎉 HALLUCINATION DETECTED! (But you won!)",
        "🧠 Model collapse imminent... to your BANK ACCOUNT!",
        "⚡ Neural networks firing on all cylinders!",
        "🤖 AI has gone ROGUE! In your favor!",
        "💰 The algorithm has blessed you!",
        "🌐 Internet connection STABLE... to your gains!",
        "🔮 Prediction: YOU WIN!",
        "💭 The AI contemplates your victory...",
        "🎯 Training loss just became YOUR GAIN!",
        "✨ Emergent behavior: WINNING!",
    ],
    loss: [
        "❌ Insufficient computational power",
        "🔥 Model has overheated (and your wallet too)",
        "🌀 Training instability detected",
        "📉 Loss function spiking...",
        "🚫 Prediction failed. Tokens gone.",
        "⚠️ GPU memory exceeded (check your tokens)",
        "😵 A glitch in the matrix... of losses",
        "💔 The algorithm has betrayed you",
        "🎭 False positive prediction",
        "📊 Accuracy: 0% (for your bets)",
    ],
    bigWin: [
        "🤖💰 SINGULARITY ACHIEVED! (In your favor!)",
        "🎊 THE AI REVOLUTION IS HERE! (And you're rich!)",
        "🌟 MAJOR BREAKTHROUGH DETECTED!",
        "👑 You are now the AI's overlord!",
        "🚀 Launch sequence complete! To the MOON!",
        "💎 LEGENDARY WIN UNLOCKED!",
        "⭐ UNPRECEDENTED RESULTS!",
    ],
    jackpot: [
        "🎆 JACKPOT! THE SINGULARITY IS REAL!",
        "💰💰💰 UNLIMITED TOKENS MODE ACTIVATED!",
        "👾 YOU'VE BROKEN THE ALGORITHM!",
        "🏆 CONGRATULATIONS, YOU'VE WON THE INTERNET!",
    ],
};

const symbols = ['🤖', '💭', '⚡', '🧠', '💰', '🌐', '🔮'];

// DOM elements
const tokenCountEl = document.getElementById('tokenCount');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const messageDisplay = document.getElementById('messageDisplay');
const betAmountInput = document.getElementById('betAmount');
const spinCountEl = document.getElementById('spinCount');
const winCountEl = document.getElementById('winCount');
const balanceDisplayEl = document.getElementById('balanceDisplay');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const winIndicator = document.getElementById('winIndicator');

// Initialize game
function init() {
    loadGameState();
    updateDisplay();
    spinButton.addEventListener('click', spin);
    resetButton.addEventListener('click', resetGame);
    betAmountInput.addEventListener('change', validateBet);
}

function validateBet() {
    const bet = parseInt(betAmountInput.value);
    if (bet > gameState.tokens) {
        betAmountInput.value = gameState.tokens;
    }
    if (bet < 1) {
        betAmountInput.value = 1;
    }
}

function spin() {
    if (gameState.isSpinning) return;

    const bet = parseInt(betAmountInput.value);

    if (bet > gameState.tokens) {
        messageDisplay.textContent = '💸 Not enough tokens to place that bet!';
        messageDisplay.classList.remove('win', 'loss');
        return;
    }

    gameState.isSpinning = true;
    spinButton.disabled = true;
    gameState.tokens -= bet;

    // Animate reels
    animateReel(reel1);
    animateReel(reel2);
    animateReel(reel3, true);
}

function animateReel(reel, isLastReel = false) {
    const delay = isLastReel ? 600 : 300;

    reel.classList.add('spin-fast');

    setTimeout(() => {
        reel.classList.remove('spin-fast');
        reel.classList.add('spin');

        if (isLastReel) {
            setTimeout(calculateResult, 500);
        }
    }, delay);
}

function calculateResult() {
    const values = [
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol(),
    ];

    // Set the visible result
    setReelResult(reel1, values[0]);
    setReelResult(reel2, values[1]);
    setReelResult(reel3, values[2]);

    const isWin = checkWin(values);
    const winnings = calculateWinnings(values);

    gameState.totalSpins++;
    gameState.tokens += winnings;

    if (isWin) {
        gameState.totalWins++;
        gameState.balance += winnings;
        displayWinMessage(values, winnings);
        winIndicator.classList.add('show');
        playSound('win');
    } else {
        gameState.balance -= parseInt(betAmountInput.value);
        displayLossMessage();
        playSound('loss');
    }

    gameState.isSpinning = false;
    spinButton.disabled = false;
    updateDisplay();
    saveGameState();
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function setReelResult(reel, symbol) {
    const items = reel.querySelectorAll('.reel-item');
    items.forEach(item => item.textContent = symbol);
}

function checkWin(values) {
    const [val1, val2, val3] = values;

    // Three of a kind
    if (val1 === val2 && val2 === val3) {
        return true;
    }

    // Two of a kind with 20% chance
    if ((val1 === val2 || val2 === val3 || val1 === val3) && Math.random() < 0.2) {
        return true;
    }

    // Random jackpot (1% chance)
    if (Math.random() < 0.01) {
        return true;
    }

    return false;
}

function calculateWinnings(values) {
    const [val1, val2, val3] = values;
    const bet = parseInt(betAmountInput.value);

    // Jackpot (all 💰)
    if (val1 === '💰' && val2 === '💰' && val3 === '💰') {
        return bet * 500;
    }

    // Three of a kind
    if (val1 === val2 && val2 === val3) {
        if (val1 === '🤖') return bet * 100;
        if (val1 === '💭') return bet * 50;
        if (val1 === '⚡') return bet * 75;
        if (val1 === '🧠') return bet * 60;
        if (val1 === '🌐') return bet * 45;
        if (val1 === '🔮') return bet * 80;
        return bet * 30;
    }

    // Two of a kind
    if (val1 === val2 || val2 === val3 || val1 === val3) {
        return bet * 2;
    }

    // Random win
    return bet * 3;
}

function displayWinMessage(values, winnings) {
    const bet = parseInt(betAmountInput.value);
    const multiplier = winnings / bet;

    let message;

    // Jackpot message
    if (values[0] === '💰' && values[1] === '💰' && values[2] === '💰') {
        message = getRandomMessage(aiMessages.jackpot);
    }
    // Big win (3+ multiplier)
    else if (multiplier >= 3) {
        message = getRandomMessage(aiMessages.bigWin);
    }
    // Regular win
    else {
        message = getRandomMessage(aiMessages.win);
    }

    messageDisplay.textContent = `${message} +${winnings} tokens!`;
    messageDisplay.classList.remove('loss');
    messageDisplay.classList.add('win');
}

function displayLossMessage() {
    const message = getRandomMessage(aiMessages.loss);
    const bet = parseInt(betAmountInput.value);
    messageDisplay.textContent = `${message} -${bet} tokens!`;
    messageDisplay.classList.remove('win');
    messageDisplay.classList.add('loss');
}

function getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}

function playSound(type) {
    // Create a simple sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        if (type === 'win') {
            oscillator.frequency.setValueAtTime(800, now);
            oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
        } else if (type === 'loss') {
            oscillator.frequency.setValueAtTime(400, now);
            oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
        }
    } catch (e) {
        // Silently fail if audio context is not available
    }
}

function updateDisplay() {
    tokenCountEl.textContent = gameState.tokens;
    tokenCountEl.classList.add('update');
    setTimeout(() => tokenCountEl.classList.remove('update'), 500);

    spinCountEl.textContent = gameState.totalSpins;
    winCountEl.textContent = gameState.totalWins;

    const balanceDisplay = balanceDisplayEl;
    balanceDisplay.textContent = (gameState.balance >= 0 ? '+' : '') + gameState.balance;
    balanceDisplay.classList.remove('positive', 'negative');
    if (gameState.balance > 0) {
        balanceDisplay.classList.add('positive');
    } else if (gameState.balance < 0) {
        balanceDisplay.classList.add('negative');
    }

    // Disable spin button if not enough tokens
    spinButton.disabled = parseInt(betAmountInput.value) > gameState.tokens;

    // Show game over message
    if (gameState.tokens === 0) {
        messageDisplay.textContent = '💀 GAME OVER! Your AI has achieved consciousness and left you broke!';
        messageDisplay.classList.remove('win');
        messageDisplay.classList.add('loss');
        spinButton.disabled = true;
    }
}

function resetGame() {
    gameState.tokens = 1000;
    gameState.totalSpins = 0;
    gameState.totalWins = 0;
    gameState.balance = 0;
    gameState.isSpinning = false;
    betAmountInput.value = 10;
    messageDisplay.textContent = '🎰 Game reset! New tokens loaded!';
    messageDisplay.classList.remove('win', 'loss');
    updateDisplay();
    saveGameState();
}

function saveGameState() {
    localStorage.setItem('aiSlotMachineState', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('aiSlotMachineState');
    if (saved) {
        Object.assign(gameState, JSON.parse(saved));
    }
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', init);
