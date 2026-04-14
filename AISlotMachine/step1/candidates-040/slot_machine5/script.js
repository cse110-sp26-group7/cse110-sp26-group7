const SYMBOLS = ['🤖', '💰', '🧠', '📊', '✨'];

const AI_JOKES = [
    "Why did the AI go to the casino? Because it had a lot of processing power to lose!",
    "I tried to teach my neural network about money. It just kept asking for more training data.",
    "Why do AI tokens go to therapy? Too many layers of emotional baggage.",
    "My AI lost all its tokens. Now it's asking for a reboot. Such desperation.",
    "Why did the chatbot love slots? Randomness is the only thing it can't predict!",
    "I asked my AI to stop gambling. It said, 'But the loss function is so compelling!'",
    "Your tokens are like a neural network parameter: never quite what you expected.",
    "Why do AIs make terrible gamblers? They overthink every spin!",
    "The AI keeps asking: 'Can we backpropagate through time to undo that loss?'",
    "My AI said it has a 'foolproof strategy.' I'm fairly certain it's the fool proof.",
    "Tokens are just numbers anyway. At least that's what I tell myself.",
    "Your wallet is experiencing a 'training loss.' Which never stops.",
    "Why don't AIs ever win big? They're afraid of overtraining!",
];

let gameState = {
    tokens: 1000,
    bet: 10,
    isSpinning: false,
    totalWon: 0,
    totalLost: 0,
};

const tokenCountEl = document.getElementById('token-count');
const totalWonEl = document.getElementById('total-won');
const totalLostEl = document.getElementById('total-lost');
const betInput = document.getElementById('bet');
const spinBtn = document.getElementById('spin-btn');
const messageBox = document.getElementById('message-text');
const jokeEl = document.getElementById('joke');
const betMinusBtn = document.getElementById('bet-minus');
const betPlusBtn = document.getElementById('bet-plus');

const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3'),
];

// Initialize
updateUI();
displayRandomJoke();

// Event listeners
spinBtn.addEventListener('click', spin);
betInput.addEventListener('change', (e) => {
    let value = parseInt(e.target.value) || 10;
    value = Math.max(1, Math.min(value, gameState.tokens));
    gameState.bet = value;
    betInput.value = value;
});

betMinusBtn.addEventListener('click', () => {
    gameState.bet = Math.max(1, gameState.bet - 10);
    betInput.value = gameState.bet;
});

betPlusBtn.addEventListener('click', () => {
    gameState.bet = Math.min(gameState.tokens, gameState.bet + 10);
    betInput.value = gameState.bet;
});

function displayRandomJoke() {
    const randomJoke = AI_JOKES[Math.floor(Math.random() * AI_JOKES.length)];
    jokeEl.textContent = randomJoke;
}

function spin() {
    // Validation
    if (gameState.isSpinning) return;
    if (gameState.bet > gameState.tokens) {
        showMessage('Not enough tokens to place this bet!', 'lose');
        return;
    }

    gameState.isSpinning = true;
    spinBtn.disabled = true;
    betInput.disabled = true;
    betMinusBtn.disabled = true;
    betPlusBtn.disabled = true;

    // Deduct bet
    gameState.tokens -= gameState.bet;
    gameState.totalLost += gameState.bet;
    updateUI();

    // Spin each reel with different timing
    const spinDurations = [2000, 2300, 2600];
    const results = [];

    spinDurations.forEach((duration, index) => {
        spinReel(index, duration, () => {
            results.push(getRandomSymbol());
            if (results.length === 3) {
                handleResult(results);
            }
        });
    });
}

function spinReel(reelIndex, duration, callback) {
    const reel = reels[reelIndex];
    reel.classList.add('spinning');

    // Rapid spinning animation
    const spinCount = Math.floor(duration / 50);
    let currentSpin = 0;

    const spinInterval = setInterval(() => {
        const randomSymbol = getRandomSymbol();
        reel.innerHTML = `<div class="symbol">${randomSymbol}</div>`;
        currentSpin++;

        if (currentSpin >= spinCount) {
            clearInterval(spinInterval);
            reel.classList.remove('spinning');
            callback();
        }
    }, 50);
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function handleResult(results) {
    const [symbol1, symbol2, symbol3] = results;
    const displayResult = `${symbol1} ${symbol2} ${symbol3}`;

    let payout = calculatePayout(results);

    if (payout > 0) {
        gameState.tokens += payout;
        gameState.totalWon += payout;

        if (payout >= gameState.bet * 50) {
            showMessage(`🎉 BIG WIN!!! You won ${payout} tokens! 🎉`, 'big-win');
            playWinAnimation();
        } else if (payout > gameState.bet) {
            showMessage(`✨ You won ${payout} tokens!`, 'win');
        } else {
            showMessage(`You got your bet back. Better luck next time!`, 'win');
        }
    } else {
        showMessage(`No match. Your tokens have been sacrificed to the AI gods. 🪦`, 'lose');
    }

    updateUI();
    setTimeout(resetSpin, 500);
    displayRandomJoke();
}

function calculatePayout(results) {
    const [s1, s2, s3] = results;

    // Three of a kind
    if (s1 === s2 && s2 === s3) {
        const payoutMultipliers = {
            '🤖': 100,
            '💰': 50,
            '🧠': 25,
            '📊': 15,
            '✨': 10,
        };
        return gameState.bet * (payoutMultipliers[s1] || 10);
    }

    // Two of a kind
    if (s1 === s2 || s2 === s3 || s1 === s3) {
        return gameState.bet; // Return original bet
    }

    return 0;
}

function playWinAnimation() {
    // Create confetti-like animation using emojis
    const emojis = ['🎉', '🎊', '✨', '🤖', '💰', '🍀'];
    for (let i = 0; i < 10; i++) {
        const div = document.createElement('div');
        div.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        div.style.position = 'fixed';
        div.style.left = Math.random() * 100 + '%';
        div.style.top = '-20px';
        div.style.fontSize = '2em';
        div.style.pointerEvents = 'none';
        div.style.animation = `fall ${2 + Math.random()}s linear forwards`;
        document.body.appendChild(div);

        setTimeout(() => div.remove(), 3000);
    }

    if (!document.getElementById('fall-animation')) {
        const style = document.createElement('style');
        style.id = 'fall-animation';
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.className = 'message-box ' + type;
    messageBox.textContent = text;
}

function resetSpin() {
    gameState.isSpinning = false;
    spinBtn.disabled = false;
    betInput.disabled = false;
    betMinusBtn.disabled = false;
    betPlusBtn.disabled = false;
}

function updateUI() {
    tokenCountEl.textContent = gameState.tokens;
    totalWonEl.textContent = gameState.totalWon;
    totalLostEl.textContent = gameState.totalLost;
    betInput.value = gameState.bet;
    betInput.max = gameState.tokens;

    // Disable spin button if not enough tokens
    if (gameState.tokens < gameState.bet) {
        spinBtn.disabled = true;
    } else if (!gameState.isSpinning) {
        spinBtn.disabled = false;
    }

    // Disable bet controls if not enough tokens
    if (gameState.tokens === 0) {
        betMinusBtn.disabled = true;
        betPlusBtn.disabled = true;
        spinBtn.disabled = true;
        showMessage('Game Over! You\'re out of tokens. Refresh to play again.', 'lose');
    }
}

// Add some personality on load
window.addEventListener('load', () => {
    showMessage('Good luck! (You\'ll need it.) 🍀', 'win');
});
