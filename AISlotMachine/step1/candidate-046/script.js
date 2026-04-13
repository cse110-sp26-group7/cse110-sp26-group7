// Game state
const gameState = {
    tokenBalance: 1000,
    sessionWins: 0,
    sessionLosses: 0,
    isSpinning: false
};

// Symbols and their payouts
const symbols = ['🤖', '💾', '📊', '⚡', '🧠', '🔮'];
const payoutTable = {
    '🤖': { name: 'AGI Achieved', multiplier: 10 },
    '💾': { name: 'Data Saved', multiplier: 5 },
    '📊': { name: 'Perfect Metrics', multiplier: 3 }
};

// DOM Elements
const tokenBalanceEl = document.getElementById('tokenBalance');
const sessionWinsEl = document.getElementById('sessionWins');
const sessionLossesEl = document.getElementById('sessionLosses');
const reel1WindowEl = document.getElementById('reel1Window');
const reel2WindowEl = document.getElementById('reel2Window');
const reel3WindowEl = document.getElementById('reel3Window');
const messageAreaEl = document.getElementById('messageArea');
const betInputEl = document.getElementById('betInput');
const spinButtonEl = document.getElementById('spinButton');
const resetButtonEl = document.getElementById('resetButton');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    spinButtonEl.addEventListener('click', handleSpin);
    resetButtonEl.addEventListener('click', handleReset);
    betInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSpin();
        }
    });
    updateDisplay();
});

/**
 * Get a random symbol
 */
function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

/**
 * Calculate winnings based on the three reels
 */
function calculateWinnings(reel1, reel2, reel3, betAmount) {
    // Check if all three reels match
    if (reel1 === reel2 && reel2 === reel3) {
        // Check if it's a winning combination
        if (payoutTable[reel1]) {
            const multiplier = payoutTable[reel1].multiplier;
            return {
                won: true,
                amount: betAmount * multiplier,
                message: `🎉 ${payoutTable[reel1].name}! Won ${betAmount * multiplier} tokens!`
            };
        }
    }

    // No match - player loses
    return {
        won: false,
        amount: -betAmount,
        message: `💥 GPU Overheated! Lost ${betAmount} tokens.`
    };
}

/**
 * Validate bet input
 */
function validateBet(betAmount) {
    const numBet = parseInt(betAmount, 10);

    if (isNaN(numBet) || numBet < 1) {
        return { valid: false, error: 'Bet must be at least 1 token' };
    }

    if (numBet > gameState.tokenBalance) {
        return { valid: false, error: 'Insufficient tokens for this bet' };
    }

    if (numBet > 500) {
        return { valid: false, error: 'Maximum bet is 500 tokens' };
    }

    return { valid: true, amount: numBet };
}

/**
 * Spin animation and game logic
 */
async function handleSpin() {
    // Validate bet
    const betValidation = validateBet(betInputEl.value);
    if (!betValidation.valid) {
        showMessage(betValidation.error, 'loss');
        return;
    }

    if (gameState.isSpinning) return;

    const betAmount = betValidation.amount;
    gameState.isSpinning = true;
    spinButtonEl.disabled = true;
    betInputEl.disabled = true;

    // Deduct bet from balance
    gameState.tokenBalance -= betAmount;
    updateDisplay();

    // Spin animation duration
    const spinDuration = 800; // milliseconds
    const animationFrames = 30;
    const frameInterval = spinDuration / animationFrames;

    // Animate spinning
    for (let i = 0; i < animationFrames; i++) {
        reel1WindowEl.textContent = getRandomSymbol();
        reel2WindowEl.textContent = getRandomSymbol();
        reel3WindowEl.textContent = getRandomSymbol();

        reel1WindowEl.classList.add('spinning');
        reel2WindowEl.classList.add('spinning');
        reel3WindowEl.classList.add('spinning');

        await new Promise(resolve => setTimeout(resolve, frameInterval));
    }

    reel1WindowEl.classList.remove('spinning');
    reel2WindowEl.classList.remove('spinning');
    reel3WindowEl.classList.remove('spinning');

    // Get final results
    const finalReel1 = getRandomSymbol();
    const finalReel2 = getRandomSymbol();
    const finalReel3 = getRandomSymbol();

    reel1WindowEl.textContent = finalReel1;
    reel2WindowEl.textContent = finalReel2;
    reel3WindowEl.textContent = finalReel3;

    // Calculate result
    const result = calculateWinnings(finalReel1, finalReel2, finalReel3, betAmount);

    // Update balance and stats
    gameState.tokenBalance += betAmount + result.amount;
    if (result.won) {
        gameState.sessionWins++;
    } else {
        gameState.sessionLosses++;
    }

    updateDisplay();
    showMessage(result.message, result.won ? 'win' : 'loss');

    // Check if player is out of tokens
    if (gameState.tokenBalance <= 0) {
        gameState.tokenBalance = 0;
        updateDisplay();
        showMessage('💸 Game Over! You\'re out of tokens. Click Reset to play again.', 'loss');
        spinButtonEl.disabled = true;
        betInputEl.disabled = true;
    } else {
        gameState.isSpinning = false;
        spinButtonEl.disabled = false;
        betInputEl.disabled = false;
    }
}

/**
 * Show message in message area
 */
function showMessage(message, type = '') {
    messageAreaEl.textContent = message;
    messageAreaEl.className = 'message-area';
    if (type) {
        messageAreaEl.classList.add(type);
    }
}

/**
 * Update display elements
 */
function updateDisplay() {
    tokenBalanceEl.textContent = gameState.tokenBalance;
    sessionWinsEl.textContent = gameState.sessionWins;
    sessionLossesEl.textContent = gameState.sessionLosses;
}

/**
 * Reset game
 */
function handleReset() {
    gameState.tokenBalance = 1000;
    gameState.sessionWins = 0;
    gameState.sessionLosses = 0;
    gameState.isSpinning = false;

    reel1WindowEl.textContent = '🤖';
    reel2WindowEl.textContent = '💾';
    reel3WindowEl.textContent = '📊';

    betInputEl.value = '10';
    betInputEl.disabled = false;
    spinButtonEl.disabled = false;

    messageAreaEl.textContent = '';
    messageAreaEl.className = 'message-area';

    updateDisplay();
}
