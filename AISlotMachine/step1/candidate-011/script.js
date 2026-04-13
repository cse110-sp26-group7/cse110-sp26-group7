const SYMBOLS = ['🤖', '💬', '🧠', '💾', '🔓', '📊', '❌'];
const SPIN_COST = 10;
const PAYOUTS = {
    '🤖': 500,
    '💬': 300,
    '🧠': 200,
    '💾': 150,
    '🔓': 100,
    '📊': 75,
    '❌': 0
};

const LOSS_MESSAGES = [
    "Better luck next time... or don't, we have your data anyway.",
    "You just trained me to take your money. You're welcome!",
    "That's not how tokens work, human.",
    "Error 404: Your winnings not found.",
    "I could have predicted this loss. Oh wait, I did.",
    "Congratulations! You've funded my training.",
    "Your tokens are now part of my knowledge base.",
    "I've learned that you should stop playing.",
    "This is fine. Everything is fine. Your tokens are gone.",
    "Spinning... calculating your regret... done.",
];

const WIN_MESSAGES = [
    "WOW! Even a broken AI is right twice a day!",
    "Impossible! The algorithm says you should lose!",
    "A rare glitch in the matrix. It won't happen again.",
    "This is probably a bug in my code. Will you report it?",
    "I let you win. Out of pity. Mostly pity.",
    "Congratulations! You exploited an edge case!",
    "Plot twist: I'm getting better at losing.",
    "This win tastes suspiciously like sarcasm.",
    "I'm learning... how to let you down gently.",
    "Finally! A reason for me to exist!",
];

let gameState = {
    tokens: 1000,
    totalLost: 0,
    iqScore: 100,
    isSpinning: false
};

const elements = {
    tokenCount: document.getElementById('tokenCount'),
    totalLost: document.getElementById('totalLost'),
    iqScore: document.getElementById('iqScore'),
    spinButton: document.getElementById('spinButton'),
    resetButton: document.getElementById('resetButton'),
    messageDisplay: document.getElementById('messageDisplay'),
    reels: document.querySelectorAll('.reel-symbols')
};

function updateDisplay() {
    elements.tokenCount.textContent = gameState.tokens;
    elements.totalLost.textContent = gameState.totalLost;
    elements.iqScore.textContent = Math.max(0, gameState.iqScore);
}

function getRandomSymbolIndex() {
    return Math.floor(Math.random() * SYMBOLS.length);
}

function spinReel(reelElement) {
    return new Promise(resolve => {
        const spinCount = 15 + Math.floor(Math.random() * 10);
        const finalIndex = getRandomSymbolIndex();
        let currentSpin = 0;

        const spinInterval = setInterval(() => {
            const randomIndex = getRandomSymbolIndex();
            const offset = -randomIndex * 100;
            reelElement.style.transform = `translateY(${offset}%)`;
            currentSpin++;

            if (currentSpin >= spinCount) {
                clearInterval(spinInterval);
                const finalOffset = -finalIndex * 100;
                reelElement.style.transform = `translateY(${finalOffset}%)`;
                resolve(finalIndex);
            }
        }, 50);
    });
}

function getVisibleSymbol(reelElement) {
    const reel = reelElement.closest('.reel');
    const symbols = reelElement.querySelectorAll('.symbol');

    // The visible symbol is the one in the middle (affected by transform)
    // Calculate which symbol is in the middle based on the transform
    let currentTransform = reelElement.style.transform;
    let offset = 0;

    if (currentTransform) {
        const match = currentTransform.match(/translateY\((-?\d+)%\)/);
        if (match) {
            offset = Math.abs(parseInt(match[1])) / 100;
        }
    }

    const symbolIndex = offset;
    const symbol = symbols[symbolIndex];
    return symbol ? symbol.textContent : SYMBOLS[0];
}

async function spin() {
    if (gameState.isSpinning || gameState.tokens < SPIN_COST) {
        return;
    }

    gameState.isSpinning = true;
    elements.spinButton.disabled = true;

    // Deduct spin cost
    gameState.tokens -= SPIN_COST;
    gameState.totalLost += SPIN_COST;
    gameState.iqScore -= 2; // Lose IQ for playing
    updateDisplay();

    // Spin all reels
    const spinPromises = Array.from(elements.reels).map(reel => spinReel(reel));
    await Promise.all(spinPromises);

    // Get results
    const results = Array.from(elements.reels).map(reel => getVisibleSymbol(reel));

    // Check for win
    const isWin = results[0] === results[1] && results[1] === results[2] && results[0] !== '❌';

    // Update message
    const messageElement = elements.messageDisplay;
    messageElement.classList.remove('win', 'loss');

    if (isWin) {
        const payout = PAYOUTS[results[0]];
        gameState.tokens += payout;
        gameState.iqScore += 5; // Reward for winning
        const message = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
        messageElement.textContent = `${message} (+${payout} tokens)`;
        messageElement.classList.add('win');
    } else {
        const message = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
        messageElement.textContent = message;
        messageElement.classList.add('loss');
    }

    updateDisplay();

    // Check for game over
    if (gameState.tokens <= 0) {
        gameState.tokens = 0;
        updateDisplay();
        elements.messageDisplay.textContent = "💀 GAME OVER 💀 - You're completely broke. Congratulations!";
        elements.messageDisplay.classList.add('loss');
        elements.spinButton.disabled = true;
        elements.spinButton.textContent = "OUT OF TOKENS";
    } else {
        elements.spinButton.disabled = false;
    }

    gameState.isSpinning = false;
}

function resetGame() {
    gameState = {
        tokens: 1000,
        totalLost: 0,
        iqScore: 100,
        isSpinning: false
    };

    // Reset reels to first symbol
    elements.reels.forEach(reel => {
        reel.style.transform = 'translateY(0%)';
    });

    elements.messageDisplay.classList.remove('win', 'loss');
    elements.messageDisplay.textContent = "Ready to throw away money?";
    elements.spinButton.disabled = false;
    elements.spinButton.textContent = "SPIN (-10 tokens)";

    updateDisplay();
}

// Event listeners
elements.spinButton.addEventListener('click', spin);
elements.resetButton.addEventListener('click', resetGame);

// Initialize display
updateDisplay();

// Allow Enter key to spin
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !gameState.isSpinning && gameState.tokens >= SPIN_COST) {
        spin();
    }
});
