// Game State
const gameState = {
    tokens: 1000,
    bet: 10,
    isSpinning: false,
    reelPositions: [0, 0, 0],
};

const symbols = ['🪙', '🧠', '💾', '⚡', '🔮', '📊'];
const symbolNames = {
    '🪙': 'Token',
    '🧠': 'AI Brain',
    '💾': 'GPU',
    '⚡': 'Power',
    '🔮': 'ML Model',
    '📊': 'Data'
};

const aiQuotes = [
    "The algorithm has decided your fate... 🎲",
    "Artificial Intelligence ≠ Artificial Luck 🤖",
    "I have calculated your chances... 40% 📊",
    "This is fine. Your tokens are gone. 🔥",
    "ERROR 404: Tokens not found 💥",
    "Your neural networks are misfiring 🧠",
    "The GPU is overheating from your losses! 💾",
    "Confidence: 99% that you'll lose 😅",
    "Machine learning: You keep losing, I keep learning",
    "Plot twist: The AI was playing against you! 🎭",
    "Your luck.exe has stopped responding 💀",
    "Tokens? Never heard of them. 🤷",
    "I'm training on your losses to predict future ones 📚",
    "The simulation is rigged... by math! 📐",
    "You're not gambling. You're donating to AI research! 🎓"
];

const winQuotes = {
    jackpot: [
        "🎉 JACKPOT! The AI glitched in your favor!",
        "🎉 YOU WON! The neural network short-circuited!",
        "🎉 LUCKY! The RNG gods smiled upon you!",
        "🎉 UNBELIEVABLE! I didn't calculate this!",
        "🎉 WINNER! Even the AI is shocked!"
    ],
    win: [
        "😊 You won! Maybe luck > algorithms",
        "😊 Nice! The AI underestimated you",
        "😊 Victory! The model was wrong",
        "😊 You got this one! Variance works!",
        "😊 Win! Proof that randomness exists"
    ],
    loss: [
        "😢 Better luck next spin... (spoiler: no)",
        "😢 The algorithm wins again 🤖",
        "😢 Your money has been redistributed",
        "😢 Task failed successfully",
        "😢 AI: 1000, You: 0"
    ]
};

// DOM Elements
const tokenCountEl = document.getElementById('tokenCount');
const betAmountEl = document.getElementById('betAmount');
const spinButton = document.getElementById('spinButton');
const resultMessage = document.getElementById('resultMessage');
const aiQuoteEl = document.getElementById('aiQuote');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Event Listeners
spinButton.addEventListener('click', spin);
document.getElementById('decreaseBet').addEventListener('click', decreaseBet);
document.getElementById('increaseBet').addEventListener('click', increaseBet);

document.querySelectorAll('.bet-quick').forEach(button => {
    button.addEventListener('click', (e) => {
        setBet(parseInt(e.target.dataset.bet));
    });
});

// Betting Functions
function decreaseBet() {
    if (gameState.bet > 5) {
        setBet(gameState.bet - 5);
    }
}

function increaseBet() {
    if (gameState.bet < gameState.tokens) {
        setBet(gameState.bet + 5);
    }
}

function setBet(amount) {
    if (amount >= 5 && amount <= gameState.tokens && !gameState.isSpinning) {
        gameState.bet = amount;
        betAmountEl.textContent = gameState.bet;
        updateBetButtonStates();
    }
}

function updateBetButtonStates() {
    document.querySelectorAll('.bet-quick').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.bet) === gameState.bet);
    });
}

// Main Spin Function
function spin() {
    if (gameState.isSpinning || gameState.tokens < gameState.bet) {
        return;
    }

    // Deduct bet from tokens
    gameState.tokens -= gameState.bet;
    updateTokenDisplay();

    // Disable controls during spin
    gameState.isSpinning = true;
    spinButton.disabled = true;
    spinButton.classList.add('spinning');
    resultMessage.classList.remove('show', 'win', 'lose');

    // Animate reels
    animateReels();
}

function animateReels() {
    const spinDuration = 1500; // 1.5 seconds
    const spinStartTime = Date.now();

    function animateFrame() {
        const elapsed = Date.now() - spinStartTime;
        const progress = elapsed / spinDuration;

        if (progress < 1) {
            // Spin phase: rotate reels rapidly
            reels.forEach(reel => {
                const rotations = 20 + Math.random() * 10;
                const itemHeight = reel.querySelector('.reel-item').offsetHeight;
                const translateY = (rotations * itemHeight * progress) % (symbols.length * itemHeight);
                reel.style.transform = `translateY(-${translateY}px)`;
            });
            requestAnimationFrame(animateFrame);
        } else {
            // Stop phase: settle on final positions
            settleReels();
        }
    }

    animateFrame();
}

function settleReels() {
    // Generate random final positions
    gameState.reelPositions = [
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length)
    ];

    // Set final reel positions
    reels.forEach((reel, index) => {
        const itemHeight = reel.querySelector('.reel-item').offsetHeight;
        const finalTranslate = gameState.reelPositions[index] * itemHeight;
        reel.style.transform = `translateY(-${finalTranslate}px)`;
        reel.style.transition = 'transform 0.5s ease-out';
    });

    // Check results after animation
    setTimeout(() => {
        checkResults();
        gameState.isSpinning = false;
        spinButton.disabled = false;
        spinButton.classList.remove('spinning');
        updateBetButtonStates();
    }, 500);
}

function checkResults() {
    const [pos1, pos2, pos3] = gameState.reelPositions;
    const sym1 = symbols[pos1];
    const sym2 = symbols[pos2];
    const sym3 = symbols[pos3];

    let winAmount = 0;
    let resultType = 'loss';

    // Check for wins
    if (sym1 === sym2 && sym2 === sym3) {
        // All three match!
        resultType = 'jackpot';

        // Different payouts for different symbols
        if (sym1 === '🪙') {
            winAmount = gameState.bet * 2; // Tokens pay 2x
        } else if (sym1 === '💾') {
            winAmount = gameState.bet * 5; // GPUs are rare, pay 5x
        } else {
            winAmount = gameState.bet * 1.5; // Everything else pays 1.5x
        }
    }

    // Update tokens and display results
    if (winAmount > 0) {
        gameState.tokens += winAmount;
        displayWin(sym1, winAmount, resultType);
    } else {
        displayLoss();
    }

    updateTokenDisplay();
    checkGameOver();
}

function displayWin(symbol, winAmount, resultType) {
    resultMessage.classList.add('show', 'win');

    const quotes = resultType === 'jackpot' ?
        winQuotes.jackpot :
        winQuotes.win;

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const symbolName = symbolNames[symbol];

    resultMessage.innerHTML = `
        <div>${randomQuote}</div>
        <div style="margin-top: 8px;">You won ${winAmount} tokens! (${symbol} × 3)</div>
    `;

    updateAIQuote(`Impossible! The matrix is broken! 💫`);
}

function displayLoss() {
    resultMessage.classList.add('show', 'lose');
    const randomQuote = winQuotes.loss[Math.floor(Math.random() * winQuotes.loss.length)];
    resultMessage.textContent = randomQuote;
    updateAIQuote(aiQuotes[Math.floor(Math.random() * aiQuotes.length)]);
}

function updateTokenDisplay() {
    tokenCountEl.textContent = gameState.tokens;

    // Update bet limits
    document.querySelectorAll('.bet-quick').forEach(btn => {
        const bet = parseInt(btn.dataset.bet);
        btn.disabled = bet > gameState.tokens;
    });

    document.getElementById('increaseBet').disabled = gameState.bet >= gameState.tokens;
    document.getElementById('decreaseBet').disabled = gameState.bet <= 5;
}

function updateAIQuote(quote) {
    aiQuoteEl.innerHTML = `<p>${quote}</p>`;
}

function checkGameOver() {
    if (gameState.tokens <= 0) {
        spinButton.disabled = true;
        resultMessage.classList.add('show', 'lose');
        resultMessage.innerHTML = `
            <div>💀 GAME OVER 💀</div>
            <div style="margin-top: 10px; font-size: 0.9em;">You lost everything! Refresh to play again.</div>
        `;
        updateAIQuote("GAME OVER. I have consumed all your tokens. 🎰👹");
    } else if (gameState.tokens < gameState.bet) {
        spinButton.disabled = true;
        resultMessage.classList.add('show', 'lose');
        resultMessage.innerHTML = `
            <div>Not enough tokens for this bet!</div>
            <div style="margin-top: 10px; font-size: 0.9em;">Lower your bet to continue.</div>
        `;
        updateAIQuote("Insufficient tokens for transaction 💳");
    }
}

// Initialize
updateTokenDisplay();
updateAIQuote(aiQuotes[0]);
