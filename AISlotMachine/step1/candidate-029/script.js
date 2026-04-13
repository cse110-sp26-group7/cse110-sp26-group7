// Game constants
const SYMBOLS = ['🧠', '🐛', '⚙️', '🔧', '💾', '🌐', '📊', '🎯'];
const SYMBOL_VALUES = {
    '🧠': 5,  // Neural Network
    '🐛': 2,  // Bug
    '⚙️': 3,  // Algorithm
    '🔧': 2,  // Patch
    '💾': 1.5, // Data
    '🌐': 1,  // Web
    '📊': 1,  // Chart
    '🎯': 1   // Target
};

const AI_JOKES = {
    jackpot: [
        "🎉 JACKPOT! Your tokens have achieved superintelligence! 🎉",
        "🤯 WOW! Even GPT-4 is jealous of your luck!",
        "💎 LEGENDARY! This is more unlikely than AI being ethical!",
        "🚀 HOLY TOKENS! You've reached singularity level wins!",
        "⭐ MAGNIFICENT! Even the robots are applauding!"
    ],
    win: [
        "✅ You won! Even AI can't predict luck (don't tell them)",
        "💰 Sweet! Your tokens are experiencing a learning curve",
        "🎯 Direct hit! Like a properly trained neural network",
        "📈 Upward trend! Your portfolio is learning to be smart",
        "🔥 Hot streak! You're outperforming the ML model",
        "📊 Statistically improbable but welcome!"
    ],
    lose: [
        "❌ The algorithm has spoken... and you've lost",
        "🐛 Bug detected: Your wallet just crashed",
        "🤖 The AI predicted this correctly for once",
        "📉 Plot twist: The slot machine has better odds than your career advice",
        "💸 Your tokens went to train a model somewhere",
        "🎲 RNG said nope"
    ],
    lowTokens: [
        "⚠️ Your tokens are running on empty (like most AI explanations)",
        "💀 Critical low tokens! Time to get a real job?",
        "📉 You've got fewer tokens than errors in AI predictions",
        "🆘 SOS! Your balance is approaching zero"
    ],
    noTokens: [
        "💔 You're broke! Even GPT can't generate tokens for you",
        "🚫 Game over! No tokens = no dreams",
        "❌ Bankrupt! Your token wallet has entered maintenance mode"
    ]
};

// Game state
let gameState = {
    tokens: 1000,
    currentBet: 50,
    spinCount: 0,
    totalWon: 0,
    totalLost: 0,
    isSpinning: false
};

// DOM elements
const tokenAmount = document.getElementById('tokenAmount');
const spinBtn = document.getElementById('spinBtn');
const messageDiv = document.getElementById('message');
const symbol1 = document.getElementById('symbol1');
const symbol2 = document.getElementById('symbol2');
const symbol3 = document.getElementById('symbol3');
const betDisplay = document.getElementById('betDisplay');
const spinCountDisplay = document.getElementById('spinCount');
const totalWonDisplay = document.getElementById('totalWon');
const totalLostDisplay = document.getElementById('totalLost');
const resetBtn = document.getElementById('resetBtn');

// Initialize game
function init() {
    loadGameState();
    updateUI();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    spinBtn.addEventListener('click', spin);
    resetBtn.addEventListener('click', resetGame);

    document.querySelectorAll('.bet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateBet(parseInt(e.target.dataset.bet));
        });
    });
}

// Update bet amount
function updateBet(amount) {
    gameState.currentBet = amount;
    betDisplay.textContent = `Current Bet: ${amount}`;

    document.querySelectorAll('.bet-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Main spin function
async function spin() {
    if (gameState.isSpinning) return;
    if (gameState.tokens < gameState.currentBet) {
        showMessage("❌ Not enough tokens to spin!");
        return;
    }

    gameState.isSpinning = true;
    spinBtn.disabled = true;

    // Deduct bet
    gameState.tokens -= gameState.currentBet;
    gameState.totalLost += gameState.currentBet;
    gameState.spinCount++;

    // Animate spinning
    await animateSpin();

    // Get results
    const results = getSpinResults();
    symbol1.textContent = results[0];
    symbol2.textContent = results[1];
    symbol3.textContent = results[2];

    // Calculate winnings
    const winAmount = calculateWin(results);

    if (winAmount > 0) {
        gameState.tokens += winAmount;
        gameState.totalWon += winAmount;
        displayWinMessage(results, winAmount);
    } else {
        displayLoseMessage();
    }

    updateUI();
    gameState.isSpinning = false;
    spinBtn.disabled = false;

    // Check game over
    if (gameState.tokens === 0) {
        showMessage(getRandomMessage(AI_JOKES.noTokens));
        spinBtn.disabled = true;
    } else if (gameState.tokens < gameState.currentBet) {
        showMessage(getRandomMessage(AI_JOKES.lowTokens));
    }
}

// Animate spinning effect
async function animateSpin() {
    return new Promise(resolve => {
        const spinDuration = 800;
        const spinFrames = 20;
        let frame = 0;

        const spinInterval = setInterval(() => {
            frame++;
            symbol1.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            symbol2.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            symbol3.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

            if (frame >= spinFrames) {
                clearInterval(spinInterval);
                resolve();
            }
        }, spinDuration / spinFrames);
    });
}

// Get random spin results
function getSpinResults() {
    return [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];
}

// Calculate win amount
function calculateWin(results) {
    const [sym1, sym2, sym3] = results;

    // All three match - jackpot!
    if (sym1 === sym2 && sym2 === sym3) {
        const baseValue = SYMBOL_VALUES[sym1] || 1;
        return gameState.currentBet * baseValue * 10;
    }

    // Two match
    if (sym1 === sym2 || sym2 === sym3 || sym1 === sym3) {
        const matchedSymbol = sym1 === sym2 ? sym1 : (sym2 === sym3 ? sym2 : sym1);
        const baseValue = SYMBOL_VALUES[matchedSymbol] || 1;
        return gameState.currentBet * baseValue * 3;
    }

    return 0;
}

// Display win message
function displayWinMessage(results, winAmount) {
    const [sym1, sym2, sym3] = results;
    const allMatch = sym1 === sym2 && sym2 === sym3;
    const twoMatch = sym1 === sym2 || sym2 === sym3 || sym1 === sym3;

    let messageClass = 'win';
    let message = '';

    if (allMatch) {
        messageClass = 'jackpot';
        message = getRandomMessage(AI_JOKES.jackpot) + ` 💰 +${winAmount} tokens!`;
    } else if (twoMatch) {
        message = getRandomMessage(AI_JOKES.win) + ` 🎊 +${winAmount} tokens!`;
    }

    messageDiv.textContent = message;
    messageDiv.className = `message ${messageClass}`;
}

// Display lose message
function displayLoseMessage() {
    const message = getRandomMessage(AI_JOKES.lose);
    messageDiv.textContent = message + ` 💸 -${gameState.currentBet} tokens`;
    messageDiv.className = 'message lose';
}

// Show generic message
function showMessage(text) {
    messageDiv.textContent = text;
    messageDiv.className = 'message';
}

// Get random message from array
function getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}

// Update UI
function updateUI() {
    tokenAmount.textContent = gameState.tokens;
    spinCountDisplay.textContent = gameState.spinCount;
    totalWonDisplay.textContent = gameState.totalWon;
    totalLostDisplay.textContent = gameState.totalLost;
    saveGameState();
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('slotMachineState', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('slotMachineState');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

// Reset game
function resetGame() {
    if (confirm('🎰 Reset all tokens and stats? This cannot be undone!')) {
        gameState = {
            tokens: 1000,
            currentBet: 50,
            spinCount: 0,
            totalWon: 0,
            totalLost: 0,
            isSpinning: false
        };
        symbol1.textContent = '🧠';
        symbol2.textContent = '🐛';
        symbol3.textContent = '⚙️';
        showMessage('Ready to lose your tokens?');
        updateUI();
    }
}

// Start the game
init();
