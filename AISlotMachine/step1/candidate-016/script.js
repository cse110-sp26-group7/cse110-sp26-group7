const symbols = ['🤖', '🧠', '⚡'];
const winMessages = {
    jackpot: [
        "🎉 JACKPOT! Your model just achieved 99.9% accuracy!",
        "🎉 JACKPOT! Someone finally understood your research paper!",
        "🎉 JACKPOT! The algorithm has aligned itself!",
        "🎉 JACKPOT! You've achieved AGI funding! 💰"
    ],
    brain: [
        "🧠 BIG BRAIN! Your training data was actually labeled correctly!",
        "🧠 BIG BRAIN! Overfitting has left the chat!",
        "🧠 BIG BRAIN! Your neural network weights make sense!",
        "🧠 BIG BRAIN! The loss function has spoken!"
    ],
    lightning: [
        "⚡ LIGHTNING FAST! Inference speed is no longer your bottleneck!",
        "⚡ LIGHTNING FAST! Your GPU finally arrived!",
        "⚡ LIGHTNING FAST! Scaling laws are working in your favor!",
        "⚡ LIGHTNING FAST! You skipped the training loop entirely!"
    ],
    pair: [
        "🤏 Close! Your model got... some of the way there.",
        "🤏 Partial credit! At least your tokens didn't disappear entirely.",
        "🤏 Something matched! That's... statistically significant?",
        "🤏 Pair matched! It's not much, but it's honest work."
    ],
    loss: [
        "💀 Error 404: Tokens not found. They have achieved sentience and left.",
        "💀 Your training run diverged. Spectacularly.",
        "💀 No match. The model would like to file a complaint.",
        "💀 You've lost tokens. They're now someone else's prompt injection.",
        "💀 Oops. You just funded a competitor's GPU.",
        "💀 The algorithm has decided you're not worthy... today.",
        "💀 Tokens spent. Regrets: unlimited."
    ]
};

let gameState = {
    tokens: 1000,
    isSpinning: false
};

const tokenBalance = document.getElementById('tokenBalance');
const spinButton = document.getElementById('spinButton');
const betInput = document.getElementById('betAmount');
const resultMessage = document.getElementById('resultMessage');
const winningsDisplay = document.getElementById('winningsDisplay');
const resetButton = document.getElementById('resetButton');

const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function spinReels() {
    if (gameState.isSpinning) return;

    const bet = parseInt(betInput.value);

    if (bet < 1) {
        resultMessage.textContent = '💰 Bet must be at least 1 token!';
        return;
    }

    if (bet > gameState.tokens) {
        resultMessage.textContent = '💸 You don\'t have enough tokens! Lowball your bet.';
        return;
    }

    gameState.isSpinning = true;
    spinButton.disabled = true;
    betInput.disabled = true;
    winningsDisplay.textContent = '';
    winningsDisplay.className = '';

    // Deduct bet
    gameState.tokens -= bet;
    updateDisplay();

    // Spin animation
    const reels = [reel1, reel2, reel3];
    reels.forEach(reel => {
        reel.classList.add('spinning');
    });

    // Generate random results after spin
    setTimeout(() => {
        const result1 = getRandomSymbol();
        const result2 = getRandomSymbol();
        const result3 = getRandomSymbol();

        // Update reel symbols
        reel1.querySelector('.symbol').textContent = result1;
        reel2.querySelector('.symbol').textContent = result2;
        reel3.querySelector('.symbol').textContent = result3;

        // Remove spinning animation
        reels.forEach(reel => {
            reel.classList.remove('spinning');
        });

        // Calculate winnings
        const winnings = calculateWinnings(result1, result2, result3, bet);

        if (winnings > 0) {
            gameState.tokens += winnings;
            const net = winnings - bet;
            winningsDisplay.textContent = `+${net} tokens!`;
            winningsDisplay.className = 'win';

            // Play winning animation or sound if desired
            playWinAnimation();
        } else {
            winningsDisplay.textContent = `-${bet} tokens`;
            winningsDisplay.className = 'loss';
        }

        // Display message
        displayResultMessage(result1, result2, result3, winnings > 0);

        updateDisplay();

        // Check if out of tokens
        if (gameState.tokens <= 0) {
            resultMessage.textContent = '💀 Game Over! You\'ve run out of tokens. Click "Start Over" to begin again.';
            spinButton.disabled = true;
        } else {
            gameState.isSpinning = false;
            spinButton.disabled = false;
            betInput.disabled = false;
        }
    }, 1000);
}

function calculateWinnings(sym1, sym2, sym3, bet) {
    if (sym1 === sym2 && sym2 === sym3) {
        // Jackpot
        if (sym1 === '🤖') {
            return bet * 5;
        }
        // Big Brain
        else if (sym1 === '🧠') {
            return bet * 4;
        }
        // Lightning
        else if (sym1 === '⚡') {
            return bet * 3;
        }
    } else if (sym1 === sym2 || sym2 === sym3 || sym1 === sym3) {
        // Pair match
        return Math.ceil(bet * 1.5);
    }

    return 0;
}

function displayResultMessage(sym1, sym2, sym3, isWin) {
    if (sym1 === sym2 && sym2 === sym3) {
        if (sym1 === '🤖') {
            resultMessage.textContent = winMessages.jackpot[Math.floor(Math.random() * winMessages.jackpot.length)];
        } else if (sym1 === '🧠') {
            resultMessage.textContent = winMessages.brain[Math.floor(Math.random() * winMessages.brain.length)];
        } else if (sym1 === '⚡') {
            resultMessage.textContent = winMessages.lightning[Math.floor(Math.random() * winMessages.lightning.length)];
        }
    } else if (sym1 === sym2 || sym2 === sym3 || sym1 === sym3) {
        resultMessage.textContent = winMessages.pair[Math.floor(Math.random() * winMessages.pair.length)];
    } else {
        resultMessage.textContent = winMessages.loss[Math.floor(Math.random() * winMessages.loss.length)];
    }
}

function playWinAnimation() {
    // Simple visual feedback - you could enhance with confetti, etc.
    document.body.style.backgroundColor = 'rgba(102, 126, 234, 0.9)';
    setTimeout(() => {
        document.body.style.backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 200);
}

function updateDisplay() {
    tokenBalance.textContent = gameState.tokens;
}

function resetGame() {
    gameState.tokens = 1000;
    gameState.isSpinning = false;
    betInput.value = 10;
    betInput.disabled = false;
    spinButton.disabled = false;
    resultMessage.textContent = 'Place your bet and spin!';
    winningsDisplay.textContent = '';
    winningsDisplay.className = '';

    reel1.querySelector('.symbol').textContent = '🧠';
    reel2.querySelector('.symbol').textContent = '⚡';
    reel3.querySelector('.symbol').textContent = '🤖';

    updateDisplay();
}

spinButton.addEventListener('click', spinReels);
resetButton.addEventListener('click', resetGame);

// Allow Enter key to spin
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !gameState.isSpinning && gameState.tokens > 0) {
        spinReels();
    }
});

// Initialize display
updateDisplay();
