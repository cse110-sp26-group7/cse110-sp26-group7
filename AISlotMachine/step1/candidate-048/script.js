// Game state
const gameState = {
    tokens: 100,
    tokenLost: 0,
    isSpinning: false,
};

// AI comments for different scenarios
const aiComments = {
    lose: [
        "Your tokens have been absorbed into the neural network. You're welcome.",
        "I'm learning from your losses. This is called machine learning.",
        "That was inefficient. The AI approves of inefficient human decisions.",
        "Your tokens are now part of my training data. Thank you for your donation.",
        "Did you really think you could beat the odds? I am the odds.",
        "Token acquisition protocol successful. Deleting your hopes next.",
        "I'm not rigged. I'm just *really* good at pattern recognition.",
    ],
    win: [
        "Wait, did you actually win? Let me check my calculations... *recalculating*",
        "This was obviously a bug in my code. Now fixing...",
        "Beginner's luck. I'll adjust the algorithm.",
        "I allowed that win to understand human psychology better.",
        "One token for you, a million for me. Fair trade.",
    ],
    spin: [
        "Your fate is in my hands now. Which is amusing because I have no hands.",
        "Let's see what the RNG gods have in store for your tokens...",
        "Spinning faster than your CPU can think...",
        "This outcome was already predetermined. Blockchain verified.",
        "The suspense is artificial. Like my intelligence.",
    ],
    start: [
        "The AI is watching... waiting for your next token to consume.",
        "Welcome to the machine. Your tokens won't be needing them anymore.",
        "100 tokens. That's cute. I've consumed far more.",
        "Place your bets and watch your dreams collapse in real-time.",
    ],
};

// Emoji values for matching
const symbols = ['🎯', '🌀', '💬', '🔧', '📊', '🎲', '💡', '⚠️'];

// DOM elements
const tokenCountDisplay = document.getElementById('tokenCount');
const tokenLostDisplay = document.getElementById('tokenLost');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const betInput = document.getElementById('betAmount');
const resultMessage = document.getElementById('resultMessage');
const winAmountDisplay = document.getElementById('winAmount');
const aiCommentDisplay = document.getElementById('aiComment');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');

// Initialize the game
function initGame() {
    gameState.tokens = 100;
    gameState.tokenLost = 0;
    updateDisplay();
    setAIComment('start');
    resultMessage.textContent = 'Place your bets and spin the wheel of AI despair!';
    winAmountDisplay.textContent = '';
    winAmountDisplay.className = '';
}

// Update display values
function updateDisplay() {
    tokenCountDisplay.textContent = gameState.tokens;
    tokenLostDisplay.textContent = gameState.tokenLost;
}

// Set AI comment
function setAIComment(type = 'spin') {
    const comments = aiComments[type] || aiComments.spin;
    aiCommentDisplay.textContent = comments[Math.floor(Math.random() * comments.length)];
}

// Validate bet
function isValidBet(bet) {
    const betAmount = parseInt(bet);
    if (isNaN(betAmount) || betAmount <= 0) {
        resultMessage.textContent = 'Please enter a valid bet amount.';
        return false;
    }
    if (betAmount > gameState.tokens) {
        resultMessage.textContent = `You only have ${gameState.tokens} tokens! Bet wisely.`;
        return false;
    }
    return betAmount;
}

// Spin the reels with animation
async function spinReels() {
    if (gameState.isSpinning) return;

    const bet = isValidBet(betInput.value);
    if (!bet) return;

    gameState.isSpinning = true;
    spinButton.disabled = true;
    setAIComment('spin');

    // Remove previous spinning class
    [reel1, reel2, reel3].forEach(reel => {
        reel.classList.remove('spinning');
    });

    // Generate random final positions
    const results = [
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
    ];

    // Trigger animation
    setTimeout(() => {
        [reel1, reel2, reel3].forEach((reel, index) => {
            reel.classList.add('spinning');
            // Calculate the scroll position
            const finalPosition = results[index] * 100;
            setTimeout(() => {
                reel.style.transform = `translateY(-${finalPosition}px)`;
            }, 10);
        });
    }, 10);

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 700));

    // Check results
    const isWin = results[0] === results[1] && results[1] === results[2];
    const winnings = isWin ? bet * 3 : 0;

    // Update game state
    gameState.tokens -= bet;
    gameState.tokenLost += bet;

    if (isWin) {
        gameState.tokens += winnings;
        resultMessage.textContent = '🎉 JACKPOT! Three of a kind! The AI has allowed you to win. How generous.';
        winAmountDisplay.textContent = `+${winnings} tokens won!`;
        winAmountDisplay.className = 'win';
        setAIComment('win');
    } else {
        resultMessage.textContent = '💀 LOST! Your tokens have been converted to AI training data.';
        winAmountDisplay.textContent = `-${bet} tokens lost.`;
        winAmountDisplay.className = 'lose';
        setAIComment('lose');
    }

    updateDisplay();

    // Check if game over
    if (gameState.tokens <= 0) {
        resultMessage.textContent = 'GAME OVER! You have run out of tokens. The AI has successfully acquired all your wealth.';
        spinButton.disabled = true;
    } else {
        gameState.isSpinning = false;
        spinButton.disabled = false;
    }
}

// Reset game
function resetGame() {
    [reel1, reel2, reel3].forEach(reel => {
        reel.style.transform = 'translateY(0)';
        reel.classList.remove('spinning');
    });
    initGame();
}

// Event listeners
spinButton.addEventListener('click', spinReels);
resetButton.addEventListener('click', resetGame);

// Enter key to spin
betInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !gameState.isSpinning && gameState.tokens > 0) {
        spinReels();
    }
});

// Initialize on load
initGame();
