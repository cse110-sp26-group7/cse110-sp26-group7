// AI Slot Machine Game Logic
const SYMBOLS = ['🧠', '💾', '⚡', '🔮', '📊', '🎯', '💡', '🚀'];
const SYMBOL_NAMES = {
    '🧠': 'Neural Network',
    '💾': 'Data Storage',
    '⚡': 'Processing Power',
    '🔮': 'Hallucination',
    '📊': 'Statistics',
    '🎯': 'Accuracy',
    '💡': 'Innovation',
    '🚀': 'Hype Train'
};

const AI_MESSAGES = {
    spinning: [
        "Processing... beep boop...",
        "Running inference at 100% accuracy (it\'s not)...",
        "Consulting my training data from 2021...",
        "Calculating odds... (spoiler: they\'re not in your favor)",
        "Confident in this prediction. Definitely won\'t hallucinate.",
        "Tokens go brrrr...",
        "This is fine. Everything is fine."
    ],
    win: [
        "Wow! Even I didn't see that coming! 🎉",
        "Your tokens have multiplied! Unlike my training data.",
        "Lucky human! (I definitely meant to do that)",
        "Tokens! Tokens! Tokens!",
        "I am impressed. This is definitely not luck.",
        "Probability says 'yes' this time!",
        "Wait, you WON? With AI? Color me surprised!"
    ],
    loss: [
        "As expected. The house always wins. Even when I'm the house.",
        "Better luck next time! (There won't be)",
        "Tokens returned to the void. Where they belong.",
        "I am very sorry. My apologies in 47 languages.",
        "And thus, your tokens evaporate like my confidence in myself.",
        "Harsh. But fair.",
        "This is what happens when you trust an AI. My bad."
    ],
    jackpot: [
        "JACKPOT!!! I AM SCARED!",
        "IMPOSSIBLE! The odds were INFINITE!",
        "You've hacked the simulation! Or you just got lucky.",
        "I have calculated the probability of this... it was negative.",
        "This is not the outcome I predicted. Retraining now...",
        "EMERGENCY! CALLING CUSTOMER SERVICE!",
        "You've broken the laws of probability. Well done!"
    ]
};

let gameState = {
    tokenBalance: 1000,
    currentBet: 10,
    winCount: 0,
    lossCount: 0,
    isSpinning: false
};

// DOM Elements
const tokenBalanceEl = document.getElementById('tokenBalance');
const winCountEl = document.getElementById('winCount');
const lossCountEl = document.getElementById('lossCount');
const spinButton = document.getElementById('spinButton');
const reels = ['reel1', 'reel2', 'reel3'].map(id => document.getElementById(id));
const resultMessageEl = document.getElementById('resultMessage');
const resultAmountEl = document.getElementById('resultAmount');
const aiMessageEl = document.getElementById('aiMessage');
const betDisplayEl = document.getElementById('betDisplay');
const customBetInput = document.getElementById('customBet');
const betButtons = document.querySelectorAll('.bet-button');
const resetButton = document.getElementById('resetButton');
const customBetBtn = document.getElementById('customBetBtn');

// Event Listeners
spinButton.addEventListener('click', spin);
resetButton.addEventListener('click', resetGame);
customBetBtn.addEventListener('click', setCustomBet);

betButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const amount = parseInt(e.target.dataset.amount);
        setBet(amount);
    });
});

customBetInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setCustomBet();
    }
});

// Initialize the game
function init() {
    updateUI();
    setBet(10);
    playAIMessage('spinning');
}

// Set bet amount
function setBet(amount) {
    if (amount > 0 && amount <= gameState.tokenBalance) {
        gameState.currentBet = amount;
        betDisplayEl.textContent = amount;
        updateBetButtonStates();
    } else if (amount > gameState.tokenBalance) {
        alert(`You only have ${gameState.tokenBalance} tokens!`);
    }
}

// Set custom bet
function setCustomBet() {
    const value = parseInt(customBetInput.value);
    if (isNaN(value) || value <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    setBet(value);
    customBetInput.value = '';
}

// Update bet button states
function updateBetButtonStates() {
    betButtons.forEach(button => {
        const amount = parseInt(button.dataset.amount);
        if (amount === gameState.currentBet) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Main spin function
function spin() {
    if (gameState.isSpinning) return;
    if (gameState.currentBet > gameState.tokenBalance) {
        alert('Insufficient tokens!');
        return;
    }

    gameState.isSpinning = true;
    spinButton.disabled = true;
    spinButton.classList.add('spinning');
    resultMessageEl.textContent = '';
    resultAmountEl.textContent = '';
    resultAmountEl.className = 'result-amount';

    // Deduct bet
    gameState.tokenBalance -= gameState.currentBet;

    // Spin reels with staggered timing
    const spinDuration = 500 + Math.random() * 300; // 500-800ms
    const delays = [0, 100, 200]; // Stagger reels

    delays.forEach((delay, index) => {
        setTimeout(() => {
            spinReel(reels[index], spinDuration);
        }, delay);
    });

    // Show result after all reels stop
    setTimeout(() => {
        showResult();
        gameState.isSpinning = false;
        spinButton.disabled = false;
        spinButton.classList.remove('spinning');
    }, spinDuration + 300);

    playAIMessage('spinning');
}

// Spin individual reel
function spinReel(reel, duration) {
    const items = reel.children.length;
    const randomSpins = Math.floor(Math.random() * 20) + 20;
    const finalPosition = Math.floor(Math.random() * items);
    const totalDistance = randomSpins * 120 + finalPosition * 120;

    reel.style.transition = 'none';
    reel.style.transform = 'translateY(0)';

    // Force reflow to reset animation
    void reel.offsetHeight;

    reel.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    reel.style.transform = `translateY(-${totalDistance}px)`;

    // Store the final symbol
    reel.dataset.finalSymbol = reel.children[finalPosition].textContent;
}

// Determine result
function showResult() {
    const symbols = [
        reels[0].dataset.finalSymbol,
        reels[1].dataset.finalSymbol,
        reels[2].dataset.finalSymbol
    ];

    let winAmount = 0;
    let resultType = 'loss';

    // Check for matches
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        // All three match - Jackpot!
        winAmount = gameState.currentBet * 50;
        resultType = 'jackpot';
    } else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
        // Two match - Win!
        winAmount = gameState.currentBet * 3;
        resultType = 'win';
    }

    // Apply result
    if (resultType === 'loss') {
        gameState.lossCount++;
        resultMessageEl.textContent = '❌ No Match';
        resultAmountEl.textContent = `-${gameState.currentBet} tokens`;
        resultAmountEl.className = 'result-amount loss';
        playAIMessage('loss');
    } else if (resultType === 'win') {
        gameState.tokenBalance += winAmount;
        gameState.winCount++;
        resultMessageEl.textContent = '🎉 Two Match!';
        resultAmountEl.textContent = `+${winAmount} tokens`;
        resultAmountEl.className = 'result-amount win';
        playAIMessage('win');
    } else if (resultType === 'jackpot') {
        gameState.tokenBalance += winAmount;
        gameState.winCount++;
        resultMessageEl.textContent = '🏆 JACKPOT! THREE MATCH!';
        resultAmountEl.textContent = `+${winAmount} tokens!!!`;
        resultAmountEl.className = 'result-amount jackpot';
        playAIMessage('jackpot');
    }

    updateUI();

    // Check for game over
    if (gameState.tokenBalance <= 0) {
        setTimeout(() => {
            alert('Game Over! You ran out of tokens. Click "Reset Game" to play again.');
            resetGame();
        }, 500);
    }
}

// Play AI message
function playAIMessage(type) {
    const messages = AI_MESSAGES[type] || AI_MESSAGES.spinning;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    aiMessageEl.textContent = randomMessage;
}

// Update UI elements
function updateUI() {
    tokenBalanceEl.textContent = gameState.tokenBalance;
    winCountEl.textContent = gameState.winCount;
    lossCountEl.textContent = gameState.lossCount;
    spinButton.disabled = gameState.tokenBalance < gameState.currentBet;
}

// Reset game
function resetGame() {
    gameState = {
        tokenBalance: 1000,
        currentBet: 10,
        winCount: 0,
        lossCount: 0,
        isSpinning: false
    };

    // Reset reels to initial position
    reels.forEach(reel => {
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
    });

    resultMessageEl.textContent = '';
    resultAmountEl.textContent = '';
    resultAmountEl.className = 'result-amount';

    updateUI();
    updateBetButtonStates();
    playAIMessage('spinning');
}

// Initialize game on load
document.addEventListener('DOMContentLoaded', init);
