// Game state
const state = {
    tokens: 1000,
    totalWon: 0,
    totalLost: 0,
    isSpinning: false,
};

// Symbols with AI themes
const symbols = ['🪙', '🧠', '⚡', '🎰', '❌', '💰', '🤔'];

// Payout table
const payouts = {
    '💰': 500,  // Big money win
    '🪙': 100,  // Coin tokens
    '🧠': 75,   // Brain (thinking about tokens)
    '⚡': 50,   // Energy/Power
    '🤔': 25,   // Hallucination (thinking it won)
    'match': 10, // Any match
    '❌': -10   // Bug! Lose tokens
};

// AI humor messages
const messages = {
    bigWin: [
        "🎉 HUGE WIN! Your tokens have achieved consciousness!",
        "🚀 Tokens.exe has executed successfully!",
        "💎 You've discovered a GPU cluster of luck!",
        "🌟 Your neural network has been blessed by the crypto gods!"
    ],
    mediumWin: [
        "✨ Nice! You overclock your luck!",
        "🎯 Great! Your training data paid off!",
        "💡 Success! You've optimized your RNG!",
        "🏆 Excellent! Your model converged!"
    ],
    smallWin: [
        "👍 Not bad! Tokens acquired!",
        "💰 You found some loose tokens!",
        "⚙️ System upgrade: +Tokens",
        "🤖 Processing... tokens granted!"
    ],
    loss: [
        "😅 Critical error! Your tokens.bat crashed!",
        "🐛 BUG DETECTED: Lost tokens in production!",
        "💥 Stack overflow of bad luck!",
        "🤔 Hallucination confirmed: tokens disappeared!"
    ],
    noFunds: [
        "💸 Insufficient tokens! Need 10 tokens to spin.",
        "⚠️ LOW MEMORY: Not enough tokens!",
        "🛑 Error 404: Tokens not found!",
        "📉 Portfolio update: BANKRUPT!"
    ]
};

// DOM elements
const tokenDisplay = document.getElementById('tokenDisplay');
const totalWonDisplay = document.getElementById('totalWonDisplay');
const totalLostDisplay = document.getElementById('totalLostDisplay');
const spinBtn = document.getElementById('spinBtn');
const resetBtn = document.getElementById('resetBtn');
const resultDisplay = document.getElementById('resultDisplay');
const messageBox = document.getElementById('messageBox');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Initialize game
function init() {
    spinBtn.addEventListener('click', spin);
    resetBtn.addEventListener('click', resetGame);
    updateDisplay();
}

// Update UI display
function updateDisplay() {
    tokenDisplay.textContent = state.tokens;
    totalWonDisplay.textContent = state.totalWon;
    totalLostDisplay.textContent = state.totalLost;

    // Update button state
    spinBtn.disabled = state.tokens < 10 || state.isSpinning;
    if (state.tokens < 10) {
        spinBtn.textContent = 'INSUFFICIENT TOKENS';
    } else {
        spinBtn.textContent = 'SPIN FOR 10 TOKENS';
    }
}

// Get random symbol
function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Spin the reels
async function spin() {
    if (state.isSpinning || state.tokens < 10) {
        return;
    }

    // Deduct spinning cost
    state.tokens -= 10;
    state.totalLost += 10;
    state.isSpinning = true;

    // Clear previous messages
    messageBox.textContent = '';
    messageBox.className = '';
    resultDisplay.textContent = 'Spinning...';

    // Add spinning animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simulate spinning with random outcomes
    const outcomes = [];
    await new Promise(resolve => setTimeout(resolve, 1500)); // Spin duration

    // Stop reels one by one
    for (let i = 0; i < reels.length; i++) {
        const outcome = getRandomSymbol();
        outcomes.push(outcome);
        reels[i].classList.remove('spinning');

        // Set the visible symbol
        const symbols_html = reels[i].querySelectorAll('.symbol');
        symbols_html.forEach((s, idx) => {
            s.textContent = symbols[(symbols.indexOf(outcome) + idx) % symbols.length];
        });

        await new Promise(resolve => setTimeout(resolve, 200)); // Stagger reel stops
    }

    // Check for wins
    checkWin(outcomes);
    updateDisplay();
    state.isSpinning = false;
}

// Check winning conditions
function checkWin(outcomes) {
    const [reel1, reel2, reel3] = outcomes;
    let payout = 0;
    let message = '';
    let isWin = false;

    // Check for three of a kind
    if (reel1 === reel2 && reel2 === reel3) {
        if (reel1 === '❌') {
            // Bug! Lose more tokens
            payout = payouts['❌'];
            message = getRandomMessage('loss');
        } else {
            payout = payouts[reel1] || payouts.match;
            if (payout >= 100) {
                message = getRandomMessage('bigWin');
            } else if (payout >= 50) {
                message = getRandomMessage('mediumWin');
            } else {
                message = getRandomMessage('smallWin');
            }
            isWin = true;
        }
    }
    // Check for any two of a kind
    else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
        payout = payouts.match;
        message = getRandomMessage('smallWin');
        isWin = true;
    }
    // No match
    else {
        message = getRandomMessage('loss');
        payout = 0;
    }

    // Apply payout
    if (payout > 0) {
        state.tokens += payout;
        state.totalWon += payout;
    } else if (payout < 0) {
        state.tokens += payout; // payout is already negative
        state.totalLost += Math.abs(payout);
    }

    // Ensure tokens don't go negative
    if (state.tokens < 0) {
        state.tokens = 0;
    }

    // Display result
    resultDisplay.textContent = `${reel1} ${reel2} ${reel3}`;
    messageBox.textContent = `${message} ${payout !== 0 ? `(${payout > 0 ? '+' : ''}${payout} tokens)` : ''}`;
    messageBox.className = isWin || payout < 0 ? (payout > 0 ? 'win' : 'lose') : 'lose';
}

// Get random message
function getRandomMessage(type) {
    const messageList = messages[type];
    return messageList[Math.floor(Math.random() * messageList.length)];
}

// Reset game
function resetGame() {
    state.tokens = 1000;
    state.totalWon = 0;
    state.totalLost = 0;
    state.isSpinning = false;

    resultDisplay.textContent = 'Good luck!';
    messageBox.textContent = '';
    messageBox.className = '';

    updateDisplay();
}

// Start the game
init();
