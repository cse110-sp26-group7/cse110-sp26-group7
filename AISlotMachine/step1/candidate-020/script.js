// Slot Machine Game State
const SYMBOLS = ['🤖', '💻', '🧠', '⚙️', '🔧'];
const WIN_MULTIPLIERS = {
    '🤖': 2,
    '💻': 3,
    '🧠': 5,
    '⚙️': 2,
    '🔧': 3
};

const STORAGE_KEY = 'aiSlotMachine';

let gameState = {
    tokens: 1000,
    totalWins: 0,
    lastWin: 0,
    isSpinning: false,
    currentBet: 10
};

// DOM Elements
const tokenCount = document.getElementById('tokenCount');
const lastWin = document.getElementById('lastWin');
const totalWins = document.getElementById('totalWins');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const betAmount = document.getElementById('betAmount');
const betWarning = document.getElementById('betWarning');
const resultMessage = document.getElementById('resultMessage');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');

// Initialize Game
function initGame() {
    loadGameState();
    updateUI();
    attachEventListeners();
}

function attachEventListeners() {
    spinButton.addEventListener('click', handleSpin);
    resetButton.addEventListener('click', resetGame);
    betAmount.addEventListener('input', updateBetDisplay);
    betAmount.addEventListener('change', validateBet);
}

function updateBetDisplay() {
    const bet = parseInt(betAmount.value) || 0;
    gameState.currentBet = bet;
    spinButton.textContent = `SPIN (${bet} tokens)`;

    if (bet > gameState.tokens) {
        betWarning.textContent = '⚠️ Insufficient tokens!';
    } else if (bet < 1) {
        betWarning.textContent = '⚠️ Bet must be at least 1!';
    } else {
        betWarning.textContent = '';
    }
}

function validateBet() {
    let bet = parseInt(betAmount.value) || 1;

    if (bet < 1) bet = 1;
    if (bet > 1000) bet = 1000;
    if (bet > gameState.tokens) bet = gameState.tokens;

    betAmount.value = bet;
    gameState.currentBet = bet;
    updateBetDisplay();
}

function handleSpin() {
    if (gameState.isSpinning) return;
    if (gameState.currentBet < 1 || gameState.currentBet > gameState.tokens) {
        alert('Invalid bet amount!');
        return;
    }

    gameState.isSpinning = true;
    spinButton.disabled = true;
    betAmount.disabled = true;
    resultMessage.textContent = '';
    resultMessage.className = '';

    // Deduct bet from tokens
    gameState.tokens -= gameState.currentBet;
    updateUI();

    // Animate reels
    animateReel(reel1, 2000);
    animateReel(reel2, 2500);
    animateReel(reel3, 3000, () => {
        // After all reels stop
        setTimeout(determineResult, 500);
    });
}

function animateReel(reel, duration, callback) {
    const reel_item = reel.querySelector('.reel-item');
    reel.classList.add('spinning');

    let startTime = Date.now();
    let spins = 0;

    function spin() {
        const elapsed = Date.now() - startTime;

        if (elapsed < duration) {
            reel_item.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            requestAnimationFrame(spin);
        } else {
            reel.classList.remove('spinning');
            reel_item.textContent = SYMBOLS[spins % SYMBOLS.length];
            if (callback) callback();
        }
        spins++;
    }

    spin();

    // Store final symbol
    const finalIndex = Math.floor(Math.random() * SYMBOLS.length);
    setTimeout(() => {
        reel_item.textContent = SYMBOLS[finalIndex];
    }, duration);
}

function determineResult() {
    const symbol1 = reel1.querySelector('.reel-item').textContent;
    const symbol2 = reel2.querySelector('.reel-item').textContent;
    const symbol3 = reel3.querySelector('.reel-item').textContent;

    const isWin = symbol1 === symbol2 && symbol2 === symbol3;

    if (isWin) {
        const multiplier = WIN_MULTIPLIERS[symbol1] || 2;
        const winAmount = gameState.currentBet * multiplier;
        gameState.tokens += winAmount;
        gameState.lastWin = winAmount;
        gameState.totalWins++;

        showWinMessage(symbol1, multiplier, winAmount);
        triggerWinFeedback();
    } else {
        showLossMessage(symbol1, symbol2, symbol3);
    }

    saveGameState();
    updateUI();
    gameState.isSpinning = false;
    spinButton.disabled = false;
    betAmount.disabled = false;
}

function showWinMessage(symbol, multiplier, winAmount) {
    resultMessage.className = 'win';

    const winMessages = [
        `🎉 JACKPOT! 3x ${symbol} - WON ${winAmount} TOKENS!`,
        `✨ YOU DID IT! ${symbol.repeat(3)} = ${multiplier}x MULTIPLIER = +${winAmount} TOKENS!`,
        `🚀 AI OVERLOAD! Matched ${symbol.repeat(3)} for ${winAmount} TOKENS!`,
        `💰 TOKENS LOADED! Your inference won ${winAmount} COMPUTE COINS!`
    ];

    resultMessage.textContent = winMessages[Math.floor(Math.random() * winMessages.length)];
}

function showLossMessage(s1, s2, s3) {
    resultMessage.className = 'loss';

    const lossMessages = [
        `❌ No match (${s1} ${s2} ${s3}) - Lost ${gameState.currentBet} tokens to the void`,
        `💔 Computation failed - ${gameState.currentBet} tokens deprecated`,
        `🐛 DEBUG FAILED - Your bet crashed the stack`,
        `🔧 The AI said "that's not it" - Lost ${gameState.currentBet} tokens`
    ];

    resultMessage.textContent = lossMessages[Math.floor(Math.random() * lossMessages.length)];
}

function triggerWinFeedback() {
    // Use Vibration API if available
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }

    // Visual feedback
    spinButton.style.animation = 'none';
    setTimeout(() => {
        spinButton.style.animation = 'pulse 0.5s';
    }, 10);
}

function updateUI() {
    tokenCount.textContent = gameState.tokens;
    totalWins.textContent = gameState.totalWins;
    lastWin.textContent = gameState.lastWin > 0 ? `+${gameState.lastWin}` : '—';

    updateBetDisplay();
}

function resetGame() {
    if (confirm('Are you sure you want to reset the game? This cannot be undone.')) {
        gameState = {
            tokens: 1000,
            totalWins: 0,
            lastWin: 0,
            isSpinning: false,
            currentBet: 10
        };

        // Reset reels
        reel1.querySelector('.reel-item').textContent = '🤖';
        reel2.querySelector('.reel-item').textContent = '💻';
        reel3.querySelector('.reel-item').textContent = '🧠';

        resultMessage.textContent = '';
        resultMessage.className = '';

        saveGameState();
        updateUI();
    }
}

function saveGameState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            gameState = { ...gameState, ...JSON.parse(saved) };
        } catch (e) {
            console.warn('Failed to load game state:', e);
        }
    }
}

// Start the game
initGame();
