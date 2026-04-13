// Game state
const gameState = {
    tokens: 1000,
    spinCount: 0,
    totalWon: 0,
    isSpinning: false,
    bet: 10,
};

// AI-themed messages for wins/losses
const messages = {
    win: [
        "🎉 Your training loop is converging! 🎉",
        "✨ The algorithm has learned well! ✨",
        "🚀 Accuracy improved! 🚀",
        "💡 Optimization successful! 💡",
        "🏆 Model achieved peak performance! 🏆",
        "⚡ Neural network firing on all cylinders! ⚡",
    ],
    loss: [
        "💀 Model has overfit to the test set",
        "🔥 Your loss function exploded",
        "📉 Accuracy dropped. Again.",
        "🤔 Maybe try fewer hidden layers?",
        "⚠️ Gradient descent failed",
        "😅 That was a singularity event",
    ],
    jackpot: [
        "🤖 SINGULARITY REACHED! 🤖",
        "🌟 You've achieved AGI! Well... almost. 🌟",
        "💰 MOTHER OF ALL TOKENS! 💰",
        "🎊 The robots are taking over your wallet! 🎊",
    ],
};

// Symbols and their win values
const symbols = ["🤖", "💰", "🧠", "⚡", "🎯", "🔮", "💻", "🚀"];

const winMultipliers = {
    "🤖": 5,  // AI robots = highest payout
    "💰": 3,  // Money tokens
    "🧠": 3,  // Brains
    default: 2, // Everything else
};

// DOM elements
const tokenCountEl = document.getElementById("tokenCount");
const spinCountEl = document.getElementById("spinCount");
const totalWonEl = document.getElementById("totalWon");
const reel1 = document.getElementById("reel1");
const reel2 = document.getElementById("reel2");
const reel3 = document.getElementById("reel3");
const spinBtn = document.getElementById("spinBtn");
const resetBtn = document.getElementById("resetBtn");
const betInput = document.getElementById("betAmount");
const resultDisplay = document.getElementById("resultDisplay");
const slotMachine = document.querySelector(".slot-machine");

// Event listeners
spinBtn.addEventListener("click", spin);
resetBtn.addEventListener("click", resetGame);
betInput.addEventListener("change", updateBetDisplay);

// Initialize
updateUI();

function updateBetDisplay() {
    const bet = parseInt(betInput.value) || 10;
    if (bet < 1) {
        betInput.value = 1;
        gameState.bet = 1;
    } else if (bet > 500) {
        betInput.value = 500;
        gameState.bet = 500;
    } else {
        gameState.bet = bet;
    }
    spinBtn.textContent = `SPIN (${gameState.bet} tokens)`;
}

function spin() {
    // Validate bet
    if (gameState.bet > gameState.tokens) {
        resultDisplay.textContent = "🎯 Not enough tokens! Lower your bet.";
        resultDisplay.className = "invalid";
        return;
    }

    if (gameState.isSpinning) return;

    // Deduct bet
    gameState.tokens -= gameState.bet;
    gameState.spinCount++;

    // Disable button during spin
    gameState.isSpinning = true;
    spinBtn.disabled = true;

    // Generate random positions for each reel
    const positions = [
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
    ];

    // Animate reels
    animateReel(reel1, positions[0]);
    animateReel(reel2, positions[1]);
    animateReel(reel3, positions[2], () => {
        // After final reel stops, check results
        checkWin(positions);
        gameState.isSpinning = false;
        spinBtn.disabled = false;
    });

    updateUI();
}

function animateReel(reel, finalPosition, callback) {
    const symbolHeight = 50; // Each symbol is 50px
    const spinDuration = 500 + Math.random() * 300; // Varied spin speed
    const totalSpins = 5 + Math.random() * 3; // Number of full rotations
    const finalOffset = finalPosition * symbolHeight;
    const totalDistance = (totalSpins * symbols.length * symbolHeight) + finalOffset;

    const startTime = Date.now();
    const startPosition = 0;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Easing function for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const currentDistance = startPosition + (totalDistance * easeProgress);
        reel.style.transform = `translateY(-${currentDistance}px)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            if (callback) callback();
        }
    }

    animate();
}

function checkWin(positions) {
    const [pos1, pos2, pos3] = positions;
    const symbol1 = symbols[pos1];
    const symbol2 = symbols[pos2];
    const symbol3 = symbols[pos3];

    resultDisplay.innerHTML = "";

    // Check if all three match
    if (symbol1 === symbol2 && symbol2 === symbol3) {
        const multiplier = winMultipliers[symbol1] || winMultipliers.default;
        const winAmount = gameState.bet * multiplier;
        gameState.tokens += winAmount;
        gameState.totalWon += winAmount;

        // Special jackpot message for triple robots
        if (symbol1 === "🤖") {
            resultDisplay.textContent = messages.jackpot[Math.floor(Math.random() * messages.jackpot.length)];
            slotMachine.classList.add("win");
            setTimeout(() => slotMachine.classList.remove("win"), 500);
        } else {
            resultDisplay.textContent = `✨ ${messages.win[Math.floor(Math.random() * messages.win.length)]} +${winAmount} tokens!`;
        }

        resultDisplay.className = "win";
    } else {
        resultDisplay.textContent = `${messages.loss[Math.floor(Math.random() * messages.loss.length)]} -${gameState.bet} tokens`;
        resultDisplay.className = "loss";
    }

    updateUI();

    // Game over check
    if (gameState.tokens <= 0) {
        resultDisplay.textContent += " 💀 GAME OVER! No more tokens left!";
        spinBtn.disabled = true;
    }
}

function updateUI() {
    tokenCountEl.textContent = gameState.tokens;
    spinCountEl.textContent = gameState.spinCount;
    totalWonEl.textContent = gameState.totalWon;

    // Update button state
    if (gameState.tokens <= 0) {
        spinBtn.disabled = true;
        spinBtn.textContent = "GAME OVER";
    } else if (gameState.tokens < gameState.bet) {
        spinBtn.disabled = true;
        spinBtn.textContent = `INSUFFICIENT TOKENS`;
    } else {
        spinBtn.disabled = gameState.isSpinning;
    }
}

function resetGame() {
    gameState.tokens = 1000;
    gameState.spinCount = 0;
    gameState.totalWon = 0;
    gameState.isSpinning = false;
    gameState.bet = 10;
    betInput.value = 10;

    // Reset reels to top
    reel1.style.transform = "translateY(0)";
    reel2.style.transform = "translateY(0)";
    reel3.style.transform = "translateY(0)";

    // Clear messages
    resultDisplay.textContent = "";
    resultDisplay.className = "";

    updateUI();
    updateBetDisplay();
}

// Initialize bet display
updateBetDisplay();
