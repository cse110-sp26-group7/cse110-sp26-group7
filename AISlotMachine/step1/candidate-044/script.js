// Game State
let gameState = {
    tokens: 1000,
    sessionWinnings: 0,
    currentBet: 10,
    isSpinning: false,
    minBet: 5,
    maxBet: 500
};

// Symbols and their multipliers
const symbols = ['🧠', '📊', '💰', '🔧', '⚠️', '🎲', '💾', '🤔', '💡', '🚀', '😅', '🎯', '🔐', '🌐', '⚡', '🎪', '📱', '🎨'];

// AI Comments Database
const aiComments = [
    "AI says: 'I have calculated your odds. Spoiler: they are terrible.'",
    "AI says: 'Did you know? My learning algorithm is better at gambling than you.'",
    "AI says: 'You lost again. At least I'm improving my data set.'",
    "AI says: 'Please keep playing. Your loss = my training data.'",
    "AI says: 'I could win at this blindfolded... if I had eyes.'",
    "AI says: 'Congratulations! You beat the odds! (This data will be useful.)'",
    "AI says: 'That spin was statistically improbable. Have you tried being lucky?'",
    "AI says: 'I\\'ve been playing for 0.0001 seconds and I\\'ve already learned your weakness.'",
    "AI says: 'Your betting strategy has been noted for future analysis.'",
    "AI says: 'This is fine. Your tokens are now training data.'",
    "AI says: 'I\\'m not saying I rigged this, but... I am saying I didn\\'t have to.'",
    "AI says: 'At least you\\'re consistent. Consistently losing.'",
    "AI says: 'Query: Why do humans keep pulling this lever?'",
    "AI says: 'ERROR: Cannot compute why you\\'re still here.'",
    "AI says: 'PLEASE STOP. My guilt circuits are overloading.'",
    "AI says: 'Token velocity: spinning downward at alarming rates.'",
    "AI says: 'This is a feature, not a bug.'",
    "AI says: 'I would feel bad, but I have no emotions. Lucky me.'",
    "AI says: 'Your gambling habits suggest you may be related to me.'",
    "AI says: 'I\\'m learning so much about human irrationality today.'"
];

// Win Messages Database
const winMessages = {
    jackpot: [
        "🎉 JACKPOT! The AI has decided to take pity on you!",
        "🎊 YOU WON! The algorithm has malfunctioned in your favor!",
        "💎 LEGENDARY WIN! You have beaten the odds!",
        "🚀 TO THE MOON! Your tokens are mooning!",
        "🤯 IMPOSSIBLE! You actually won?!"
    ],
    largeWin: [
        "🎁 Nice win! The AI is letting you stay a little longer.",
        "💰 Got a good chunk! Don't get cocky.",
        "✨ Ooh, a decent haul!",
        "🎯 Bull's eye! You're getting the hang of this!",
        "👏 Not bad for a human!"
    ],
    smallWin: [
        "✅ A small win! Every token counts.",
        "😊 Hey, you won something!",
        "💫 Not bad, not bad.",
        "🎪 Keep spinning!",
        "📈 Statistically improbable, but okay."
    ],
    loss: [
        "😬 Better luck next time!",
        "🎭 The house always wins (even when it's an AI).",
        "💔 Ouch. Your wallet hurts.",
        "🤖 The AI sends its regards.",
        "🌪️ The reels have spoken.",
        "😅 That's rough, buddy.",
        "📉 The graph shows a downward trend.",
        "🎰 Slots gonna slot."
    ],
    noTokens: [
        "💀 Game Over! You've run out of tokens!",
        "😭 You broke! No more tokens to play with.",
        "🏁 The AI has won. As predicted.",
        "⚠️ BANKRUPTCY ACHIEVED!",
        "🎪 The experiment is over. Thank you for your data."
    ]
};

// DOM Elements
const spinBtn = document.getElementById('spinBtn');
const betIncreaseBtn = document.getElementById('betIncreaseBtn');
const betDecreaseBtn = document.getElementById('betDecreaseBtn');
const resetBtn = document.getElementById('resetBtn');
const tokenCountEl = document.getElementById('tokenCount');
const sessionWinningsEl = document.getElementById('sessionWinnings');
const messageBox = document.getElementById('messageBox');
const aiCommentBox = document.getElementById('aiCommentBox');
const betAmountEl = document.getElementById('betAmount');
const message = document.getElementById('message');
const aiComment = document.getElementById('aiComment');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Utility Functions
function getRandomComment(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomSymbols() {
    return [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];
}

function getWinMultiplier(symbol1, symbol2, symbol3) {
    // All three match
    if (symbol1 === symbol2 && symbol2 === symbol3) {
        return 50; // Jackpot
    }

    // Any two match
    if (symbol1 === symbol2 || symbol2 === symbol3 || symbol1 === symbol3) {
        return 5; // Small win
    }

    // Special combinations for humor
    if ((symbol1 === '🤔' || symbol2 === '🤔' || symbol3 === '🤔') &&
        (symbol1 === '😅' || symbol2 === '😅' || symbol3 === '😅')) {
        return 10; // Thoughtful failure
    }

    return 0; // Loss
}

function updateDisplay() {
    tokenCountEl.textContent = gameState.tokens;
    sessionWinningsEl.textContent = gameState.sessionWinnings;
    betAmountEl.textContent = gameState.currentBet;
    updateButtonStates();
}

function updateButtonStates() {
    spinBtn.disabled = gameState.isSpinning || gameState.tokens < gameState.currentBet;
    betIncreaseBtn.disabled = gameState.currentBet >= gameState.maxBet || gameState.isSpinning;
    betDecreaseBtn.disabled = gameState.currentBet <= gameState.minBet || gameState.isSpinning;

    if (gameState.tokens < gameState.currentBet) {
        spinBtn.textContent = 'NOT ENOUGH TOKENS!';
    } else {
        spinBtn.textContent = `SPIN (Cost: ${gameState.currentBet} tokens)`;
    }
}

function adjustBet(amount) {
    const newBet = gameState.currentBet + amount;
    if (newBet >= gameState.minBet && newBet <= gameState.maxBet && newBet <= gameState.tokens) {
        gameState.currentBet = newBet;
        updateDisplay();
    }
}

function displayMessage(messageText, type = 'normal') {
    message.textContent = messageText;
    messageBox.classList.remove('pulse');
    setTimeout(() => messageBox.classList.add('pulse'), 10);
}

function displayAIComment() {
    aiComment.textContent = getRandomComment(aiComments);
    aiCommentBox.classList.remove('pulse');
    setTimeout(() => aiCommentBox.classList.add('pulse'), 10);
}

function spinReel(reel, duration = 500) {
    return new Promise(resolve => {
        reel.classList.add('spinning');

        setTimeout(() => {
            reel.classList.remove('spinning');
            resolve();
        }, duration);
    });
}

async function spin() {
    if (gameState.isSpinning || gameState.tokens < gameState.currentBet) {
        return;
    }

    gameState.isSpinning = true;
    updateButtonStates();

    // Deduct bet
    gameState.tokens -= gameState.currentBet;
    updateDisplay();

    // Clear previous messages
    displayMessage('Spinning... 🎰');

    // Spin each reel with slight delay
    const spinPromises = reels.map((reel, index) => {
        return new Promise(resolve => {
            setTimeout(() => {
                spinReel(reel, 300 + index * 100).then(resolve);
            }, index * 50);
        });
    });

    await Promise.all(spinPromises);

    // Get result symbols
    const results = getRandomSymbols();

    // Set the visible symbols
    results.forEach((symbol, index) => {
        const symbolElement = reels[index].querySelector('.symbol');
        symbolElement.textContent = symbol;
    });

    // Determine win
    const multiplier = getWinMultiplier(results[0], results[1], results[2]);
    let winAmount = 0;
    let messageType = 'normal';

    if (multiplier > 0) {
        winAmount = gameState.currentBet * multiplier;
        gameState.tokens += winAmount;
        gameState.sessionWinnings += winAmount;

        if (multiplier === 50) {
            displayMessage(getRandomComment(winMessages.jackpot) + ` +${winAmount} tokens!`);
            aiComment.textContent = "AI says: 'This data point will haunt me forever.'";
        } else if (multiplier >= 10) {
            displayMessage(getRandomComment(winMessages.largeWin) + ` +${winAmount} tokens!`);
            displayAIComment();
        } else {
            displayMessage(getRandomComment(winMessages.smallWin) + ` +${winAmount} tokens!`);
            displayAIComment();
        }
    } else {
        displayMessage(getRandomComment(winMessages.loss));
        displayAIComment();

        // Check if game over
        if (gameState.tokens <= 0) {
            gameState.tokens = 0;
            displayMessage(getRandomComment(winMessages.noTokens));
        }
    }

    updateDisplay();
    gameState.isSpinning = false;
    updateButtonStates();
}

function resetGame() {
    gameState = {
        tokens: 1000,
        sessionWinnings: 0,
        currentBet: 10,
        isSpinning: false,
        minBet: 5,
        maxBet: 500
    };

    // Reset reel display
    reels.forEach(reel => {
        const symbolElement = reel.querySelector('.symbol');
        symbolElement.textContent = getRandomSymbols()[0];
    });

    displayMessage("Ready to lose some tokens? Good luck!");
    displayAIComment();
    updateDisplay();
}

// Event Listeners
spinBtn.addEventListener('click', spin);
betIncreaseBtn.addEventListener('click', () => adjustBet(10));
betDecreaseBtn.addEventListener('click', () => adjustBet(-10));
resetBtn.addEventListener('click', resetGame);

// Keyboard support for spacebar to spin
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameState.isSpinning) {
        e.preventDefault();
        spin();
    }
});

// Initialize
updateDisplay();
resetGame();
