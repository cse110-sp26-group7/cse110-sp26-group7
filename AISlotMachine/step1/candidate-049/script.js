// Game state
const gameState = {
    tokens: 1000,
    totalWon: 0,
    totalLost: 0,
    isSpinning: false,
    currentBet: 50,
};

// Payout table
const payouts = {
    'triple': {
        '🤖': 500,
        '💬': 250,
        '🧠': 200,
        '⚡': 150,
        '💾': 100,
        '🎯': 75,
        '❌': 25,
        '💰': 300,
    },
    'partial': 0,
    'loss': 0,
};

// AI-themed messages for wins and losses
const winMessages = [
    'The neural network has spoken! 🧠✨',
    'Congratulations! You have defied the odds and fooled the AI!',
    'AGI moment achieved! The singularity is now! 🚀',
    'The algorithm blessed you! Praise be to the machine learning gods!',
    'Tokens raining down like hallucinations! 🌧️',
    'You broke the model! It predicted you would lose! 😂',
];

const loseMessages = [
    'Context window exceeded. Game over.',
    'The AI predicted your loss with 99.9% confidence. It was right.',
    'GPU overheated from processing your bad luck.',
    'Your tokens have been claimed by the training dataset.',
    'Error 404: Tokens not found.',
    'The model has learned from your mistakes.',
];

const neutralMessages = [
    'Hmm, the token distribution looks... interesting.',
    'The AI is thinking... (no useful insights yet)',
    'Random number generator says: meh.',
    'The probability space has spoken.',
];

// DOM elements
const tokenDisplay = document.getElementById('tokenDisplay');
const totalWonDisplay = document.getElementById('totalWon');
const totalLostDisplay = document.getElementById('totalLost');
const spinBtn = document.getElementById('spinBtn');
const resetBtn = document.getElementById('resetBtn');
const betInput = document.getElementById('betInput');
const betValue = document.getElementById('betValue');
const resultText = document.getElementById('resultText');
const messageArea = document.getElementById('messageArea');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');

// Event listeners
spinBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', resetGame);
betInput.addEventListener('input', updateBetDisplay);

// Update bet display when slider changes
function updateBetDisplay() {
    gameState.currentBet = parseInt(betInput.value);
    betValue.textContent = gameState.currentBet;
}

// Main spin function
function spin() {
    // Validate bet
    if (gameState.currentBet > gameState.tokens) {
        showMessage('Not enough tokens!', 'lose');
        return;
    }

    if (gameState.isSpinning) return;

    gameState.isSpinning = true;
    spinBtn.disabled = true;

    // Deduct bet
    gameState.tokens -= gameState.currentBet;
    gameState.totalLost += gameState.currentBet;
    updateDisplay();

    // Calculate final positions
    const finalPositions = [
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8),
    ];

    // Spin animation
    spinReel(reel1, finalPositions[0], 0);
    spinReel(reel2, finalPositions[1], 100);
    spinReel(reel3, finalPositions[2], 200);

    // After spinning is done, check for win
    setTimeout(() => {
        checkWin(finalPositions);
        gameState.isSpinning = false;
        spinBtn.disabled = false;
    }, 1500);
}

// Reel spinning animation
function spinReel(reel, finalPosition, delay) {
    setTimeout(() => {
        // Perform multiple rotations before landing
        const rotations = 5 + Math.random() * 3;
        const totalSpins = rotations * 8 + finalPosition;
        const offsetPixels = totalSpins * 150;

        reel.style.transition = 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        reel.style.transform = `translateY(-${offsetPixels}px)`;
    }, delay);
}

// Get symbols at position
function getSymbolAtPosition(reel, position) {
    const symbols = reel.querySelectorAll('.symbol');
    return symbols[position].textContent;
}

// Check for winning combination
function checkWin(positions) {
    const symbols = [
        getSymbolAtPosition(reel1, positions[0]),
        getSymbolAtPosition(reel2, positions[1]),
        getSymbolAtPosition(reel3, positions[2]),
    ];

    // Check for three of a kind
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        const winAmount = payouts.triple[symbols[0]];
        const totalWin = gameState.currentBet + winAmount;

        gameState.tokens += totalWin;
        gameState.totalWon += totalWin;

        resultText.textContent = `🎉 WINNER! ${symbols[0]} x3 - You won ${totalWin} tokens!`;
        resultText.style.color = '#28a745';
        showMessage(getRandomElement(winMessages), 'win');
    } else {
        // Loss
        resultText.textContent = '❌ Game Over - Context window exceeded. Your tokens are gone.';
        resultText.style.color = '#dc3545';
        showMessage(getRandomElement(loseMessages), 'lose');
    }

    updateDisplay();
}

// Show message function
function showMessage(text, type) {
    messageArea.innerHTML = '';
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = text;
    messageArea.appendChild(messageEl);

    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transition = 'opacity 0.5s ease';
    }, 3000);
}

// Update display values
function updateDisplay() {
    tokenDisplay.textContent = gameState.tokens;
    totalWonDisplay.textContent = gameState.totalWon;
    totalLostDisplay.textContent = gameState.totalLost;
}

// Reset game
function resetGame() {
    gameState.tokens = 1000;
    gameState.totalWon = 0;
    gameState.totalLost = 0;
    gameState.isSpinning = false;

    // Reset reels to initial position
    reel1.style.transition = 'none';
    reel2.style.transition = 'none';
    reel3.style.transition = 'none';
    reel1.style.transform = 'translateY(0)';
    reel2.style.transform = 'translateY(0)';
    reel3.style.transform = 'translateY(0)';

    resultText.textContent = 'Game reset! Ready to lose more tokens?';
    resultText.style.color = '#333';
    messageArea.innerHTML = '';
    spinBtn.disabled = false;

    updateDisplay();
}

// Utility: get random element from array
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Keyboard support using Platform API (Gamepad API)
if ('getGamepads' in navigator) {
    window.addEventListener('gamepadconnected', (event) => {
        console.log('Gamepad connected:', event.gamepad.id);
        checkGamepadInput();
    });

    window.addEventListener('gamepaddisconnected', (event) => {
        console.log('Gamepad disconnected:', event.gamepad.id);
    });

    function checkGamepadInput() {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (gamepad) {
                // Button 0 is A button - use to spin
                if (gamepad.buttons[0].pressed && !gameState.isSpinning) {
                    spin();
                }
                // Button 1 is B button - use to reset
                if (gamepad.buttons[1].pressed) {
                    resetGame();
                }
            }
        }
        requestAnimationFrame(checkGamepadInput);
    }

    checkGamepadInput();
}

// Initialize display on page load
window.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    resultText.textContent = 'Place your bet and spin the wheel of fortune!';
});
