// Symbol definitions
const SYMBOLS = ['🚀', '💻', '🧠', '💰', '📊'];

// Payout table
const PAYOUTS = {
    '🚀🚀🚀': 500,
    '💻💻💻': 300,
    '🧠🧠🧠': 200,
    '💰💰💰': 400,
    '📊📊📊': 150,
};

// Fun AI-themed messages
const MESSAGES = {
    win: [
        '🎉 That was cheaper than an API call!',
        '🏆 You just beat the house AND the algorithm!',
        '💎 More tokens than a Transformers paper!',
        '🚀 To the moon! (where AI servers cost extra)',
        '🤖 Even AI is jealous of this win',
        '💸 You made more than a GPT-3 generates in tokens',
        '🎊 This is what good prompt engineering looks like!',
        '⭐ You rolled better than a neural network!',
    ],
    loss: [
        '😅 That\'s fine, API costs are worse',
        '💸 Your tokens went to training data',
        '🤖 The AI takes another W',
        '😤 Even the algorithm laughed at that',
        '📉 That\'s what your AWS bill looks like',
        '🎰 The house always wins (just like tech companies)',
        '💀 Your tokens became someone\'s GPT training data',
        '😢 Better luck next time, you still have tokens!',
    ],
    jackpot: [
        '🎆 JACKPOT! This is bigger than your API budget!',
        '🏅 LEGENDARY WIN! Even the servers are impressed!',
        '👑 ROYALTY! You beat the AI at its own game!',
        '🌟 ULTIMATE WIN! Your tokens are multiplying like LLMs!',
        '💥 MASSIVE! This is what overfitting to randomness looks like!',
    ],
    almostEmpty: [
        '⚠️ Last few tokens... this is like my training data',
        '🪦 Rip your balance. Want to press reset?',
        '💔 This hurts more than a cancelled API key',
        '😵 You\'re running on fumes and neural networks',
    ],
};

// Game state
let tokens = 1000;
let isSpinning = false;
const SPIN_COST = 50;

// DOM elements
const tokenCount = document.getElementById('tokenCount');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const messageEl = document.getElementById('message');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');

// Event listeners
spinButton.addEventListener('click', spin);
resetButton.addEventListener('click', resetGame);

// Initialize
updateUI();

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function getRandomMessage(messageType) {
    const messages = MESSAGES[messageType];
    return messages[Math.floor(Math.random() * messages.length)];
}

function spin() {
    if (isSpinning || tokens < SPIN_COST) {
        return;
    }

    // Deduct spin cost
    tokens -= SPIN_COST;
    isSpinning = true;
    spinButton.disabled = true;

    // Get reels
    const reels = [reel1, reel2, reel3];
    const spinDurations = [2.5, 3, 3.5]; // Different duration for each reel

    // Start spinning animation
    reels.forEach((reel, index) => {
        reel.parentElement.classList.add('spinning');
    });

    // Generate random symbols for landing
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Stop spinning and show results
    setTimeout(() => {
        reels.forEach((reel, index) => {
            reel.parentElement.classList.remove('spinning');
            reel.textContent = results[index];
        });

        // Check for wins
        checkWin(results);
        updateUI();
        isSpinning = false;
        spinButton.disabled = false;
    }, 3500);
}

function checkWin(results) {
    const resultString = results.join('');
    let winAmount = 0;
    let messageType = 'loss';

    // Check exact matches (jackpots)
    if (PAYOUTS[resultString]) {
        winAmount = PAYOUTS[resultString];
        messageType = 'jackpot';
    }
    // Check for any two matching
    else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        winAmount = 50;
        messageType = 'win';
    }

    // Add winnings to tokens
    tokens += winAmount;

    // Display message
    let message = '';
    if (winAmount > 0) {
        message = `${getRandomMessage(messageType)} +${winAmount} tokens! 💰`;
        messageEl.classList.remove('loss');
        messageEl.classList.add('win');
    } else {
        message = getRandomMessage('loss') + ' -50 tokens';
        messageEl.classList.remove('win');
        messageEl.classList.add('loss');
    }

    // Add almost empty warning
    if (tokens < 100 && tokens > 0) {
        message += '\n' + getRandomMessage('almostEmpty');
    }

    messageEl.textContent = message;
}

function updateUI() {
    tokenCount.textContent = tokens;
    spinButton.disabled = tokens < SPIN_COST;

    // Update spin button text
    if (tokens < SPIN_COST) {
        spinButton.textContent = 'NOT ENOUGH TOKENS';
        spinButton.style.opacity = '0.5';
    } else {
        spinButton.textContent = `SPIN (${SPIN_COST} tokens)`;
        spinButton.style.opacity = '1';
    }

    // Game over condition
    if (tokens === 0) {
        messageEl.textContent = '🎰 GAME OVER! You\'ve been ruined by the AI economy!';
        messageEl.classList.add('loss');
    }
}

function resetGame() {
    tokens = 1000;
    reel1.textContent = '🚀';
    reel2.textContent = '💻';
    reel3.textContent = '🧠';
    messageEl.textContent = 'Ready to lose some tokens? 😄';
    messageEl.classList.remove('win', 'loss');
    updateUI();
}
