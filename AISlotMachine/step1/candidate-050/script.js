// Game State
const gameState = {
    tokens: 1000,
    currentBet: 100,
    isSpinning: false,
    totalSpins: 0,
    biggestWin: 0,
    timesBroke: 0,
    reels: [
        ['💻', '🤖', '⚡', '🧠', '🚀', '💾', '📊', '🔮'],
        ['💻', '🤖', '⚡', '🧠', '🚀', '💾', '📊', '🔮'],
        ['💻', '🤖', '⚡', '🧠', '🚀', '💾', '📊', '🔮'],
    ]
};

// AI Humor Messages
const winMessages = [
    "🎉 You beat the algorithm! The AI is crying in the server room! 🎉",
    "🏆 JACKPOT! ChatGPT just rage quit! 🏆",
    "💰 You won! This is literally the only thing AI can't predict 💰",
    "🚀 TO THE MOON! Even an AI couldn't have odds-stacked this much! 🚀",
    "⚡ LIGHTNING STRIKE! The machine just had an existential crisis! ⚡",
    "🤖 The AI overlords are NOT happy about this! 🤖",
];

const lossMessages = [
    "📉 The house always wins. And the house is... also an AI. 📉",
    "💸 Oops! You just fed the AI's college fund! 💸",
    "🤯 The algorithm has spoken. It's not in your favor. 🤯",
    "🎰 Better luck next time, human. The machine is undefeated. 🎰",
    "😅 The AI is doing a victory lap right now 😅",
    "🔮 The crystal ball (neural network) has spoken! 🔮",
];

const partialWinMessages = [
    "✨ Two-fer! The AI allowed this small mercy ✨",
    "🎲 Partial win! You survived this spin... barely! 🎲",
    "👾 Close call! The AI's algorithm was almost merciful! 👾",
];

// DOM Elements
const tokenCount = document.getElementById('tokenCount');
const spinBtn = document.getElementById('spinBtn');
const messageBox = document.getElementById('messageBox');
const message = document.getElementById('message');
const betBtns = document.querySelectorAll('.bet-btn');
const totalSpinsDisplay = document.getElementById('totalSpins');
const biggestWinDisplay = document.getElementById('biggestWin');
const timesBrokeDisplay = document.getElementById('timesBroke');

// Event Listeners
betBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        betBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.currentBet = parseInt(btn.dataset.bet);
    });
});

spinBtn.addEventListener('click', spin);

// Game Logic
function spin() {
    if (gameState.isSpinning) return;
    if (gameState.tokens < gameState.currentBet) {
        showMessage("❌ Not enough tokens! Time to face the cold, hard truth of your poor life choices.", 'lose');
        return;
    }

    gameState.isSpinning = true;
    spinBtn.disabled = true;

    // Deduct bet
    gameState.tokens -= gameState.currentBet;
    updateDisplay();

    // Generate random positions for each reel
    const finalPositions = [
        Math.floor(Math.random() * gameState.reels[0].length),
        Math.floor(Math.random() * gameState.reels[1].length),
        Math.floor(Math.random() * gameState.reels[2].length),
    ];

    // Animate reels
    animateReels(finalPositions, () => {
        // Check results after spinning
        const winAmount = checkWin(finalPositions);
        gameState.tokens += winAmount;
        gameState.totalSpins++;

        // Update display
        updateDisplay();

        // Show result message
        if (winAmount > gameState.currentBet) {
            const profit = winAmount - gameState.currentBet;
            gameState.biggestWin = Math.max(gameState.biggestWin, profit);
            const randomWinMessage = winMessages[Math.floor(Math.random() * winMessages.length)];
            showMessage(`${randomWinMessage}\n+${profit}Ⓣ tokens!`, 'win');
        } else if (winAmount === gameState.currentBet) {
            const randomPartialMessage = partialWinMessages[Math.floor(Math.random() * partialWinMessages.length)];
            showMessage(`${randomPartialMessage}\nBet returned!`, 'win');
        } else {
            const randomLossMessage = lossMessages[Math.floor(Math.random() * lossMessages.length)];
            showMessage(`${randomLossMessage}\n-${gameState.currentBet}Ⓣ tokens gone!`, 'lose');
        }

        // Check if broke
        if (gameState.tokens <= 0) {
            gameState.tokens = 1000; // Reset with new tokens (government bailout)
            gameState.timesBroke++;
            showMessage("💀 You're BROKE! The government (AI overlords) just gave you a bailout. Congratulations on being a bank. 💀", 'lose');
        }

        gameState.isSpinning = false;
        spinBtn.disabled = false;
    });
}

function animateReels(finalPositions, callback) {
    const duration = 600; // ms
    const startTime = Date.now();

    function animateFrame() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        for (let i = 0; i < 3; i++) {
            const reel = document.getElementById(`reel${i + 1}`);
            // Calculate spin distance (more spins at start, slows down)
            const totalRotation = (finalPositions[i] + Math.floor(easeProgress * 20)) % gameState.reels[i].length;
            const offset = -(totalRotation * 50);
            reel.style.transform = `translateY(${offset}px)`;
        }

        if (progress < 1) {
            requestAnimationFrame(animateFrame);
        } else {
            callback();
        }
    }

    animateFrame();
}

function checkWin(positions) {
    const symbols = [
        gameState.reels[0][positions[0]],
        gameState.reels[1][positions[1]],
        gameState.reels[2][positions[2]],
    ];

    // Check for three in a row
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        const payoutTable = {
            '🤖': 1000,
            '🚀': 500,
            '⚡': 200,
            '🧠': 150,
            '💾': 75,
            '💻': 50,
            '📊': 30,
            '🔮': 25,
        };
        return gameState.currentBet + (payoutTable[symbols[0]] || 10);
    }

    // Check for two in a row (return bet)
    if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
        return gameState.currentBet;
    }

    // No match
    return 0;
}

function showMessage(text, type) {
    messageBox.className = `message-box ${type}`;
    message.textContent = text;
    messageBox.style.animation = 'none';
    setTimeout(() => {
        messageBox.style.animation = 'winFlash 0.5s ease';
    }, 10);
}

function updateDisplay() {
    tokenCount.textContent = gameState.tokens;
    totalSpinsDisplay.textContent = gameState.totalSpins;
    biggestWinDisplay.textContent = gameState.biggestWin + 'Ⓣ';
    timesBrokeDisplay.textContent = gameState.timesBroke;

    // Update bet button states
    betBtns.forEach(btn => {
        const betAmount = parseInt(btn.dataset.bet);
        if (gameState.tokens < betAmount) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        } else {
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    });

    // Ensure current bet is affordable
    if (gameState.tokens < gameState.currentBet) {
        const affordableBets = Array.from(betBtns)
            .filter(btn => !btn.disabled)
            .map(btn => parseInt(btn.dataset.bet));
        if (affordableBets.length > 0) {
            gameState.currentBet = affordableBets[affordableBets.length - 1];
            betBtns.forEach(btn => btn.classList.remove('active'));
            betBtns.forEach(btn => {
                if (parseInt(btn.dataset.bet) === gameState.currentBet) {
                    btn.classList.add('active');
                }
            });
        }
    }
}

// Initialize
updateDisplay();
showMessage("Welcome to the AI Token Jackpot! 🎰\nGood luck fighting the algorithm!", 'lose');
