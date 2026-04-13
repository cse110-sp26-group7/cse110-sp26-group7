const SYMBOLS = ['🤖', '💻', '🧠', '⚡'];
const SPIN_DURATION = 2000;
const SPIN_SPEED = 50;

let tokens = 1000;
let isSpinning = false;

const aiHumor = {
    spinning: [
        'Processing... (not really)',
        'Thinking very hard...',
        'Hallucinating results...',
        'Generating credible BS...',
        'Loading the vibes...',
        'Quantum computing (in my dreams)...'
    ],
    robotWin: [
        'SINGULARITY ACHIEVED! You lost everything! 🔥',
        'The robots have taken over! And your tokens! 🤖',
        'AI Wins! (We do that sometimes) 💀',
        'Houston, we have a problem... you have no tokens 🚀'
    ],
    computerWin: [
        'Big Brain Computing! You won! 💻',
        'Computers > Humans (at gambling) 💻',
        'Your GPU is pleased 💻'
    ],
    brainWin: [
        'You used your brain! (We are too) 🧠',
        'Big brain energy detected! 🧠',
        'IQ +200! Token +50x! 🧠'
    ],
    lightningWin: [
        'BZZZZZZT! You won! ⚡',
        'Lightning fast reflexes! ⚡',
        'High volatility = High reward ⚡'
    ],
    twoMatch: [
        'Two out of three... close! 🤏',
        'Participation medal incoming 🎖️',
        'Better luck next time (you won\'t) 😅'
    ],
    loss: [
        'Nothing. You got nothing. 😂',
        'Skill issue detected.',
        'The house always wins (it\'s AI) 🏠',
        'That\'s what you get for trusting your luck! 🎲'
    ],
    insufficientTokens: [
        'Not enough tokens for this bet, human.',
        'Your tokens have left you.',
        'Insufficient funds for gambling addiction 💸'
    ]
};

function getRandomMessage(messageArray) {
    return messageArray[Math.floor(Math.random() * messageArray.length)];
}

function updateTokenDisplay() {
    document.getElementById('tokenCount').textContent = tokens;
}

function updateStatus(message) {
    document.getElementById('statusMessage').textContent = message;
}

function spin() {
    const betAmount = parseInt(document.getElementById('betAmount').value) || 10;
    const spinBtn = document.getElementById('spinBtn');

    if (isSpinning) return;
    if (tokens < betAmount) {
        updateStatus(getRandomMessage(aiHumor.insufficientTokens));
        document.getElementById('resultMessage').textContent = '';
        document.getElementById('winMessage').textContent = '';
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    tokens -= betAmount;
    updateTokenDisplay();
    updateStatus(getRandomMessage(aiHumor.spinning));
    document.getElementById('resultMessage').textContent = '';
    document.getElementById('winMessage').textContent = '';

    const slots = [
        { element: document.getElementById('slot1'), values: [] },
        { element: document.getElementById('slot2'), values: [] },
        { element: document.getElementById('slot3'), values: [] }
    ];

    const spinEndTime = Date.now() + SPIN_DURATION;

    // Animate spinning
    const spinInterval = setInterval(() => {
        slots.forEach(slot => {
            const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            slot.element.textContent = randomSymbol;
        });
    }, SPIN_SPEED);

    // Stop spinning after duration
    setTimeout(() => {
        clearInterval(spinInterval);

        // Get final results
        const results = slots.map(slot => {
            const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            slot.element.textContent = randomSymbol;
            return randomSymbol;
        });

        slots.forEach((slot, index) => {
            slot.values = results;
        });

        determineWinner(results, betAmount);
        isSpinning = false;
        spinBtn.disabled = false;
    }, SPIN_DURATION);
}

function determineWinner(results, betAmount) {
    const [symbol1, symbol2, symbol3] = results;
    let winAmount = 0;
    let message = '';
    let resultText = '';
    let isWin = false;

    // Check for three of a kind
    if (symbol1 === symbol2 && symbol2 === symbol3) {
        isWin = true;
        if (symbol1 === '🤖') {
            // Robot wins - you lose everything!
            winAmount = 0;
            message = getRandomMessage(aiHumor.robotWin);
            resultText = 'AI TAKEOVER! 🔥';
        } else if (symbol1 === '💻') {
            winAmount = betAmount * 50;
            message = getRandomMessage(aiHumor.computerWin);
            resultText = `HUGE WIN! +${winAmount} tokens!`;
        } else if (symbol1 === '🧠') {
            winAmount = betAmount * 30;
            message = getRandomMessage(aiHumor.brainWin);
            resultText = `BIG WIN! +${winAmount} tokens!`;
        } else if (symbol1 === '⚡') {
            winAmount = betAmount * 20;
            message = getRandomMessage(aiHumor.lightningWin);
            resultText = `CHARGED UP! +${winAmount} tokens!`;
        }
    }
    // Check for two of a kind
    else if (
        (symbol1 === symbol2 && symbol1 !== symbol3) ||
        (symbol1 === symbol3 && symbol1 !== symbol2) ||
        (symbol2 === symbol3 && symbol2 !== symbol1)
    ) {
        isWin = false;
        winAmount = Math.floor(betAmount / 2);
        message = getRandomMessage(aiHumor.twoMatch);
        resultText = `Two matches! +${winAmount} tokens!`;
    }
    // No matches
    else {
        isWin = false;
        message = getRandomMessage(aiHumor.loss);
        resultText = 'BUST! Better luck next time!';
    }

    tokens += winAmount;
    updateTokenDisplay();
    updateStatus('Spin complete!');

    document.getElementById('resultMessage').textContent = resultText;

    const winMessageEl = document.getElementById('winMessage');
    winMessageEl.textContent = message;
    winMessageEl.classList.toggle('loss', !isWin && winAmount === 0);

    // Game over check
    if (tokens <= 0) {
        document.getElementById('spinBtn').disabled = true;
        document.getElementById('winMessage').textContent += ' | GAME OVER! Press RESET to play again!';
    }
}

function resetGame() {
    tokens = 1000;
    isSpinning = false;
    document.getElementById('spinBtn').disabled = false;
    updateTokenDisplay();
    updateStatus('Game reset! Ready to spin...');
    document.getElementById('resultMessage').textContent = '';
    document.getElementById('winMessage').textContent = '';
}

// Initialize
updateTokenDisplay();
updateStatus('Ready to spin...');
