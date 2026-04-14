// Game State
let gameState = {
    tokens: 100,
    totalWon: 0,
    totalLost: 0,
    isSpinning: false,
    reelResults: [null, null, null]
};

// Symbol definitions
const symbols = ['🤖', '💾', '📊', '⚡', '🧠', '🔮', '🎯', '💰'];

// Win conditions
const winConditions = {
    '🤖🤖🤖': { tokens: 500, message: '🚀 YOU\'VE ACHIEVED AGI! This is either amazing or terrifying. +500 tokens!' },
    '💾💾💾': { tokens: 100, message: '💿 Data successfully persisted! +100 tokens! Now don\'t lose the backup drive...' },
    '📊📊📊': { tokens: 75, message: '📈 Perfect metrics! Your model\'s learning curves are beautiful. +75 tokens!' },
    '⚡⚡⚡': { tokens: 150, message: '⚙️ Computational overload! Your GPU just reached peak performance. +150 tokens!' },
    '🧠🧠🧠': { tokens: 120, message: '💡 Neural networks firing on all cylinders! +120 tokens!' },
    '🔮🔮🔮': { tokens: 200, message: '✨ You can predict the future! Or you\'re just lucky. +200 tokens!' },
    '🎯🎯🎯': { tokens: 90, message: '🎪 Bullseye! Your accuracy is suspiciously high. +90 tokens!' },
    '💰💰💰': { tokens: 300, message: '💸 Show me the tokens! You\'re officially an AI capitalist. +300 tokens!' }
};

// AI-themed loss messages
const lossMessages = [
    '❌ GPU overheated. Model crashed. Token spent. Such is ML life.',
    '⚠️ Training diverged. Your hyperparameters were probably bad anyway.',
    '🔥 Overfitting detected. Your tokens were just memorizing failure.',
    '🤖 The AI has decided you didn\'t deserve to win. (Lucky you!)',
    '💔 The algorithm has spoken. Time to debug your luck.',
    '🐛 Bug in your destiny detected.',
    '⏸️ Model paused unexpectedly. That\'ll be your tokens.',
    '🎰 The house wins. It\'s always the house.',
    '📉 Market crash. HODL your remaining tokens!',
    '🌩️ A wild dataset appeared! It ate your tokens.'
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
    randomizeReels();
});

function initializeGame() {
    // Load from localStorage if available
    const saved = localStorage.getItem('slotMachineGame');
    if (saved) {
        gameState = JSON.parse(saved);
    }
    updateDisplay();
}

function setupEventListeners() {
    const spinButton = document.getElementById('spinButton');
    const resetButton = document.getElementById('resetButton');
    const betInput = document.getElementById('betAmount');

    spinButton.addEventListener('click', spin);
    resetButton.addEventListener('click', resetGame);

    // Validate bet input
    betInput.addEventListener('change', (e) => {
        const maxBet = gameState.tokens;
        if (e.target.value > maxBet) {
            e.target.value = maxBet;
        }
        if (e.target.value < 1) {
            e.target.value = 1;
        }
    });

    // Allow spin on Enter key
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !gameState.isSpinning) {
            spin();
        }
    });
}

function randomizeReels() {
    const reels = document.querySelectorAll('.reel');
    reels.forEach((reel, index) => {
        const randomPosition = Math.floor(Math.random() * symbols.length);
        const offset = randomPosition * 50;
        reel.style.transform = `translateY(-${offset}px)`;
    });
}

function spin() {
    if (gameState.isSpinning) return;

    const betAmount = parseInt(document.getElementById('betAmount').value);

    // Validate bet
    if (betAmount < 1 || betAmount > gameState.tokens) {
        showMessage('Invalid bet amount!', 'loss');
        return;
    }

    // Deduct bet
    gameState.tokens -= betAmount;
    gameState.totalLost += betAmount;

    gameState.isSpinning = true;
    document.getElementById('spinButton').disabled = true;
    clearResultDisplay();

    // Spin each reel with slight delay for effect
    const reels = document.querySelectorAll('.reel');
    reels.forEach((reel, index) => {
        setTimeout(() => {
            spinReel(reel, index, betAmount);
        }, index * 200);
    });

    // Check results after all reels stop spinning
    setTimeout(() => {
        checkResults(betAmount);
        gameState.isSpinning = false;
        document.getElementById('spinButton').disabled = false;
    }, 2000);
}

function spinReel(reel, index, betAmount) {
    reel.classList.add('spinning');

    let spins = 0;
    const maxSpins = 15 + Math.random() * 10;

    const spinInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        const offset = randomIndex * 50;
        reel.style.transform = `translateY(-${offset}px)`;

        spins++;
        if (spins >= maxSpins) {
            clearInterval(spinInterval);
            reel.classList.remove('spinning');
            gameState.reelResults[index] = symbols[randomIndex];
        }
    }, 50);
}

function checkResults(betAmount) {
    const result = gameState.reelResults.join('');
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.textContent = `${gameState.reelResults[0]} ${gameState.reelResults[1]} ${gameState.reelResults[2]}`;

    if (winConditions[result]) {
        const win = winConditions[result];
        gameState.tokens += win.tokens;
        gameState.totalWon += win.tokens;
        showMessage(win.message, 'win');
    } else {
        showMessage(getRandomLossMessage(), 'loss');
    }

    updateDisplay();
    saveGame();
}

function clearResultDisplay() {
    document.getElementById('resultDisplay').textContent = '';
}

function showMessage(message, type) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.textContent = message;
    messagesDiv.className = 'messages';
    if (type === 'win') {
        messagesDiv.classList.add('message-win');
    } else if (type === 'loss') {
        messagesDiv.classList.add('message-loss');
    }
}

function getRandomLossMessage() {
    return lossMessages[Math.floor(Math.random() * lossMessages.length)];
}

function updateDisplay() {
    document.getElementById('tokenCount').textContent = gameState.tokens;
    document.getElementById('totalWon').textContent = gameState.totalWon;
    document.getElementById('totalLost').textContent = gameState.totalLost;

    // Disable spin button if no tokens
    const spinButton = document.getElementById('spinButton');
    const betAmount = parseInt(document.getElementById('betAmount').value);

    if (gameState.tokens === 0) {
        spinButton.disabled = true;
        if (!gameState.isSpinning) {
            showMessage('💀 You\'re out of tokens! Click Reset Game to start over.', 'loss');
        }
    } else if (betAmount > gameState.tokens) {
        document.getElementById('betAmount').value = gameState.tokens;
    }
}

function resetGame() {
    if (confirm('Are you sure you want to reset your game? This will lose all your progress!')) {
        gameState = {
            tokens: 100,
            totalWon: 0,
            totalLost: 0,
            isSpinning: false,
            reelResults: [null, null, null]
        };
        document.getElementById('betAmount').value = 10;
        clearResultDisplay();
        document.getElementById('messages').textContent = '';
        randomizeReels();
        updateDisplay();
        saveGame();
    }
}

function saveGame() {
    localStorage.setItem('slotMachineGame', JSON.stringify(gameState));
}

// Auto-save game state periodically
setInterval(saveGame, 5000);
