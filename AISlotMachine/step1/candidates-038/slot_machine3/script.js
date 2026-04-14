// Game State
const gameState = {
    tokens: 100,
    currentBet: 10,
    spins: 0,
    wins: 0,
    biggestWin: 0,
    isSpinning: false,
    inventory: [],
};

// Symbol values (for matching)
const symbols = {
    '🧠': 'brain',
    '💰': 'money',
    '📊': 'chart',
    '🔮': 'crystal',
    '⚡': 'lightning',
    '🎯': 'target'
};

// Winning combinations
const winningCombinations = {
    '🧠🧠🧠': { tokens: 100, message: '🧠 TRIPLE BRAIN POWER! 🧠' },
    '💰💰💰': { tokens: 500, message: '💰 JACKPOT!!! 💰 The AI actually made money!' },
    '📊📊📊': { tokens: 200, message: '📊 DATA OVERLOAD WIN! 📊' },
    '🔮🔮🔮': { tokens: 150, message: '🔮 YOUR FUTURE IS PROSPEROUS! 🔮' },
    '⚡⚡⚡': { tokens: 120, message: '⚡ ELECTRIC SHOCK WIN! ⚡' },
    '🎯🎯🎯': { tokens: 75, message: '🎯 PERFECT ALIGNMENT! 🎯' },
    '🧠🧠⚡': { tokens: 50, message: '🧠⚡ Brain Power Activated! +50 tokens' },
    '💰💰📊': { tokens: 40, message: '💰📊 Money meets Data! +40 tokens' },
};

// DOM Elements
const tokenCount = document.getElementById('tokenCount');
const betAmount = document.getElementById('betAmount');
const betInput = document.getElementById('betInput');
const spinBtn = document.getElementById('spinBtn');
const resetBtn = document.getElementById('resetBtn');
const betMinus = document.getElementById('betMinus');
const betPlus = document.getElementById('betPlus');
const resultDisplay = document.getElementById('result');
const messageBox = document.getElementById('messageBox');
const inventoryDiv = document.getElementById('inventory');
const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
const spinsDisplay = document.getElementById('spins');
const winsDisplay = document.getElementById('wins');
const winRateDisplay = document.getElementById('winRate');
const biggestWinDisplay = document.getElementById('biggestWin');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    setupEventListeners();
});

function setupEventListeners() {
    spinBtn.addEventListener('click', spin);
    resetBtn.addEventListener('click', resetGame);
    betMinus.addEventListener('click', () => adjustBet(-1));
    betPlus.addEventListener('click', () => adjustBet(1));
    betInput.addEventListener('change', (e) => {
        const value = parseInt(e.target.value) || gameState.currentBet;
        gameState.currentBet = Math.max(1, Math.min(value, gameState.tokens));
        updateDisplay();
    });

    // Shop buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', purchaseItem);
    });
}

function adjustBet(amount) {
    gameState.currentBet = Math.max(1, Math.min(gameState.currentBet + amount, gameState.tokens));
    updateDisplay();
}

function updateDisplay() {
    tokenCount.textContent = gameState.tokens;
    betAmount.textContent = gameState.currentBet;
    betInput.value = gameState.currentBet;
    spinBtn.disabled = gameState.isSpinning || gameState.tokens < gameState.currentBet;

    // Update bet controls
    betMinus.disabled = gameState.currentBet <= 1 || gameState.isSpinning;
    betPlus.disabled = gameState.currentBet >= gameState.tokens || gameState.isSpinning;
    betInput.disabled = gameState.isSpinning;

    // Update stats
    spinsDisplay.textContent = gameState.spins;
    winsDisplay.textContent = gameState.wins;
    winRateDisplay.textContent = gameState.spins > 0 ? Math.round((gameState.wins / gameState.spins) * 100) + '%' : '0%';
    biggestWinDisplay.textContent = gameState.biggestWin;

    // Update shop buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
        const cost = parseInt(btn.dataset.cost);
        btn.disabled = gameState.tokens < cost;
    });
}

function getRandomSymbol() {
    const symbolArray = Object.keys(symbols);
    return symbolArray[Math.floor(Math.random() * symbolArray.length)];
}

function spin() {
    if (gameState.isSpinning || gameState.tokens < gameState.currentBet) {
        return;
    }

    // Deduct bet
    gameState.tokens -= gameState.currentBet;
    gameState.spins += 1;
    gameState.isSpinning = true;
    resultDisplay.textContent = '';
    resultDisplay.className = '';

    updateDisplay();

    // Animate reels
    const spinDurations = [2000, 2300, 2600]; // Staggered spin times
    const reelResults = [];

    reels.forEach((reel, index) => {
        reel.classList.add('spinning');

        setTimeout(() => {
            reel.classList.remove('spinning');
            const randomSymbol = getRandomSymbol();
            reelResults.push(randomSymbol);
            reel.style.transform = `translateY(0)`;
            reel.innerHTML = `<div class="reel-item">${randomSymbol}</div>`;

            // Check if this is the last reel
            if (index === 2) {
                setTimeout(() => {
                    checkResult(reelResults);
                }, 100);
            }
        }, spinDurations[index]);
    });
}

function checkResult(results) {
    const resultString = results.join('');

    // Check for exact matches first
    if (winningCombinations[resultString]) {
        handleWin(resultString);
    } else {
        handleLoss();
    }

    gameState.isSpinning = false;
    updateDisplay();
}

function handleWin(resultString) {
    const winInfo = winningCombinations[resultString];
    const winAmount = winInfo.tokens;

    gameState.tokens += winAmount;
    gameState.wins += 1;
    gameState.biggestWin = Math.max(gameState.biggestWin, winAmount);

    resultDisplay.textContent = winInfo.message;
    resultDisplay.className = 'win';

    // Play win sound effect (using Web Audio API)
    playWinSound();

    // Show celebration message
    showMessage(`🎉 WON ${winAmount} TOKENS! 🎉`, 'success', 3000);
}

function handleLoss() {
    resultDisplay.textContent = '😅 Better luck next spin... (the AI gods were not amused)';
    resultDisplay.className = 'lose';
    showMessage('💸 Lost! Tokens deducted.', 'error', 2000);
}

function purchaseItem(e) {
    const btn = e.target;
    const cost = parseInt(btn.dataset.cost);
    const itemName = btn.dataset.item;
    const itemEmoji = btn.parentElement.querySelector('.item-emoji').textContent;

    if (gameState.tokens < cost) {
        showMessage('❌ Not enough tokens!', 'error', 2000);
        return;
    }

    gameState.tokens -= cost;
    gameState.inventory.push({ name: itemName, emoji: itemEmoji });

    updateDisplay();
    updateInventory();

    // Mark item as purchased
    btn.disabled = true;
    btn.parentElement.classList.add('purchased');

    showMessage(`🤖 You bought an ${itemName}!`, 'success', 3000);
}

function updateInventory() {
    if (gameState.inventory.length === 0) {
        inventoryDiv.innerHTML = '<p class="empty-inv">No AI friends yet... keep spinning!</p>';
        return;
    }

    inventoryDiv.innerHTML = gameState.inventory.map((item, index) => `
        <div class="inventory-item">
            <span class="emoji">${item.emoji}</span>
            <span>${item.name}</span>
        </div>
    `).join('');
}

function resetGame() {
    if (confirm('🔄 Start a new game? Your current tokens will be reset to 100.')) {
        gameState.tokens = 100;
        gameState.currentBet = 10;
        gameState.spins = 0;
        gameState.wins = 0;
        gameState.biggestWin = 0;
        gameState.inventory = [];
        gameState.isSpinning = false;
        resultDisplay.textContent = '';
        resultDisplay.className = '';

        // Reset shop buttons
        document.querySelectorAll('.shop-item').forEach(item => {
            item.classList.remove('purchased');
            item.querySelector('.buy-btn').disabled = false;
        });

        updateDisplay();
        updateInventory();
        showMessage('🎮 New game started!', 'info', 2000);
    }
}

function showMessage(text, type = 'info', duration = 3000) {
    messageBox.textContent = text;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';

    setTimeout(() => {
        messageBox.style.display = 'none';
    }, duration);
}

// Web Audio API for sound effects
function playWinSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;

        // Create a simple win sound with multiple tones
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

        notes.forEach((frequency, index) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.frequency.value = frequency;
            osc.type = 'sine';

            const startTime = now + (index * 0.1);
            const duration = 0.2;

            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            osc.start(startTime);
            osc.stop(startTime + duration);
        });
    } catch (e) {
        // Audio context not available, silently fail
        console.log('Audio not available');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        spin();
    }
});
