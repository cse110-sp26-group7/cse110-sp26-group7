const gameState = {
    tokenBalance: 1000,
    sessionWins: 0,
    sessionLosses: 0,
    isSpinning: false
};

const symbols = ['🤖', '💾', '📊', '⚡', '🧠', '🔮'];
const payoutTable = {
    '🤖': { name: 'AGI Achieved', multiplier: 10 },
    '💾': { name: 'Data Saved', multiplier: 5 },
    '📊': { name: 'Perfect Metrics', multiplier: 3 }
};

const elements = {
    tokenBalance: document.getElementById('tokenBalance'),
    sessionWins: document.getElementById('sessionWins'),
    sessionLosses: document.getElementById('sessionLosses'),
    reel1: document.getElementById('reel1'),
    reel2: document.getElementById('reel2'),
    reel3: document.getElementById('reel3'),
    messageArea: document.getElementById('messageArea'),
    betInput: document.getElementById('betInput'),
    spinButton: document.getElementById('spinButton'),
    resetButton: document.getElementById('resetButton')
};

document.addEventListener('DOMContentLoaded', () => {
    elements.spinButton.addEventListener('click', handleSpin);
    elements.resetButton.addEventListener('click', handleReset);
    elements.betInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSpin();
    });
    updateDisplay();
});

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

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

function calculateWinnings(reel1, reel2, reel3, betAmount) {
    if (reel1 === reel2 && reel2 === reel3 && payoutTable[reel1]) {
        const multiplier = payoutTable[reel1].multiplier;
        return {
            won: true,
            amount: betAmount * multiplier,
            message: `🎉 ${payoutTable[reel1].name}! Won ${betAmount * multiplier} tokens!`
        };
    }

    return {
        won: false,
        amount: -betAmount,
        message: `💥 GPU Overheated! Lost ${betAmount} tokens.`
    };
}

async function handleSpin() {
    const betValidation = validateBet(elements.betInput.value);
    if (!betValidation.valid) {
        showMessage(betValidation.error, 'loss');
        return;
    }

    if (gameState.isSpinning) return;

    const betAmount = betValidation.amount;
    gameState.isSpinning = true;
    disableControls(true);

    gameState.tokenBalance -= betAmount;
    updateDisplay();

    const spinDuration = 800;
    const frameInterval = 50;
    const frameCount = spinDuration / frameInterval;

    for (let i = 0; i < frameCount; i++) {
        elements.reel1.textContent = getRandomSymbol();
        elements.reel2.textContent = getRandomSymbol();
        elements.reel3.textContent = getRandomSymbol();

        addSpinClass([elements.reel1, elements.reel2, elements.reel3]);
        await delay(frameInterval);
    }

    removeSpinClass([elements.reel1, elements.reel2, elements.reel3]);

    const finalReel1 = getRandomSymbol();
    const finalReel2 = getRandomSymbol();
    const finalReel3 = getRandomSymbol();

    elements.reel1.textContent = finalReel1;
    elements.reel2.textContent = finalReel2;
    elements.reel3.textContent = finalReel3;

    const result = calculateWinnings(finalReel1, finalReel2, finalReel3, betAmount);

    gameState.tokenBalance += betAmount + result.amount;
    if (result.won) {
        gameState.sessionWins++;
    } else {
        gameState.sessionLosses++;
    }

    updateDisplay();
    showMessage(result.message, result.won ? 'win' : 'loss');

    if (gameState.tokenBalance <= 0) {
        gameState.tokenBalance = 0;
        updateDisplay();
        showMessage('💸 Game Over! You\'re out of tokens. Click Reset to play again.', 'loss');
        disableControls(true);
    } else {
        gameState.isSpinning = false;
        disableControls(false);
    }
}

function handleReset() {
    gameState.tokenBalance = 1000;
    gameState.sessionWins = 0;
    gameState.sessionLosses = 0;
    gameState.isSpinning = false;

    elements.reel1.textContent = '🤖';
    elements.reel2.textContent = '💾';
    elements.reel3.textContent = '📊';

    elements.betInput.value = '10';
    elements.messageArea.textContent = '';
    elements.messageArea.className = 'message-area';

    disableControls(false);
    updateDisplay();
}

function updateDisplay() {
    elements.tokenBalance.textContent = gameState.tokenBalance;
    elements.sessionWins.textContent = gameState.sessionWins;
    elements.sessionLosses.textContent = gameState.sessionLosses;
}

function showMessage(message, type = '') {
    elements.messageArea.textContent = message;
    elements.messageArea.className = 'message-area';
    if (type) {
        elements.messageArea.classList.add(type);
    }
}

function disableControls(disabled) {
    elements.spinButton.disabled = disabled;
    elements.betInput.disabled = disabled;
    elements.resetButton.disabled = disabled;
}

function addSpinClass(reels) {
    reels.forEach(reel => reel.classList.add('spinning'));
}

function removeSpinClass(reels) {
    reels.forEach(reel => reel.classList.remove('spinning'));
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
