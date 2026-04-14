// Game State
let gameState = {
    tokens: parseInt(localStorage.getItem('tokens')) || 1000,
    totalWon: parseInt(localStorage.getItem('totalWon')) || 0,
    totalLost: parseInt(localStorage.getItem('totalLost')) || 0,
    isSpinning: false,
};

// Emoji symbols with their payout multipliers
const symbols = ['🤔', '💰', '🚀', '⚠️', '📊', '🎲', '🔮', '💸'];

// AI-themed messages
const winMessages = [
    "🎉 The model has predicted correctly... this time.",
    "🤖 Congratulations! Even the AI was surprised.",
    "💰 You've defeated the algorithm. Enjoy your victory.",
    "🚀 To the moon! (The AI market cap is unimpressed.)",
    "🎯 Training complete! Your tokens have learned.",
    "🔮 The crystal ball was actually useful!",
    "💯 100% win rate... until the next spin.",
    "🎪 The AI was just letting you win.",
    "👑 You've earned the respect of the robot overlords.",
    "✨ The simulation rewards you... for now.",
];

const loseMessages = [
    "❌ The algorithm has spoken. You have lost.",
    "🤖 The AI sends its regards... and apologies.",
    "💸 Tokens go brrr (in reverse).",
    "📉 This is a buying opportunity for more tokens!",
    "⚠️ The model has calculated your loss.",
    "🎲 Unlucky! The dice gods aren't fans of AI humor.",
    "🔴 Red means go... backwards.",
    "😅 At least you're good at something else.",
    "🌪️ A quantum fluctuation in your favor didn't occur.",
    "🚫 The system has rejected your tokens.",
];

const matchMessages = {
    '💰': "The House approves of your greed!",
    '🚀': "HODL mode activated!",
    '🔮': "The prophecy was correct!",
    '📊': "Analysis paralysis nets you this!",
    '🎲': "Lucky guess prevails!",
    '🤔': "You actually thought this through.",
    '⚠️': "Warning: You might win something!",
    '💸': "Money talks, tokens walk.",
};

// DOM Elements
const tokenCountEl = document.getElementById('tokenCount');
const totalWonEl = document.getElementById('totalWon');
const totalLostEl = document.getElementById('totalLost');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const betAmountInput = document.getElementById('betAmount');
const messageBox = document.getElementById('messageBox');
const message = document.getElementById('message');

// Initialize
updateDisplay();

// Event Listeners
spinButton.addEventListener('click', spin);
resetButton.addEventListener('click', resetGame);

function spin() {
    const betAmount = parseInt(betAmountInput.value);

    // Validation
    if (betAmount < 1) {
        message.textContent = "⚠️ Bet at least 1 token!";
        messageBox.className = 'message-box lose';
        return;
    }

    if (betAmount > gameState.tokens) {
        message.textContent = "💸 You don't have that many tokens!";
        messageBox.className = 'message-box lose';
        return;
    }

    // Start spin
    gameState.isSpinning = true;
    spinButton.disabled = true;
    messageBox.className = 'message-box';

    // Deduct bet
    gameState.tokens -= betAmount;
    updateDisplay();

    // Generate random results
    const result1 = getRandomSymbol();
    const result2 = getRandomSymbol();
    const result3 = getRandomSymbol();

    // Animate reels
    spinReels(result1, result2, result3, () => {
        // Check results
        const { isWin, multiplier, matchSymbol } = checkWin(result1, result2, result3);

        // Calculate payout
        let winnings = 0;
        if (isWin) {
            winnings = Math.floor(betAmount * multiplier);
            gameState.tokens += winnings;
            gameState.totalWon += winnings;
            showWinMessage(result1, matchSymbol, winnings);
            messageBox.className = 'message-box win';
        } else {
            gameState.totalLost += betAmount;
            showLoseMessage();
            messageBox.className = 'message-box lose';
        }

        updateDisplay();
        gameState.isSpinning = false;
        spinButton.disabled = false;
        saveGameState();
    });
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function spinReels(result1, result2, result3, callback) {
    const duration = 1000; // 1 second spin
    const startTime = Date.now();

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            // Spinning animation
            const randomIndex1 = Math.floor(Math.random() * symbols.length);
            const randomIndex2 = Math.floor(Math.random() * symbols.length);
            const randomIndex3 = Math.floor(Math.random() * symbols.length);

            reel1.children[0].textContent = symbols[randomIndex1];
            reel2.children[0].textContent = symbols[randomIndex2];
            reel3.children[0].textContent = symbols[randomIndex3];

            // Add spinning class
            reel1.classList.add('spinning');
            reel2.classList.add('spinning');
            reel3.classList.add('spinning');

            requestAnimationFrame(animate);
        } else {
            // Stop on results
            reel1.classList.remove('spinning');
            reel2.classList.remove('spinning');
            reel3.classList.remove('spinning');

            reel1.children[0].textContent = result1;
            reel2.children[0].textContent = result2;
            reel3.children[0].textContent = result3;

            callback();
        }
    };

    animate();
}

function checkWin(reel1, reel2, reel3) {
    // Check for three of a kind
    if (reel1 === reel2 && reel2 === reel3) {
        const multipliers = {
            '💰': 5,
            '🚀': 3,
            '🔮': 2,
            '📊': 1.5,
            '🎲': 1,
        };

        const multiplier = multipliers[reel1] || 1;
        return { isWin: true, multiplier, matchSymbol: reel1 };
    }

    // Check for two of a kind
    if ((reel1 === reel2) || (reel2 === reel3) || (reel1 === reel3)) {
        const matchSymbol = reel1 === reel2 ? reel1 : (reel2 === reel3 ? reel2 : reel1);
        return { isWin: true, multiplier: 1, matchSymbol };
    }

    return { isWin: false, multiplier: 0, matchSymbol: null };
}

function showWinMessage(symbol, matchSymbol, winnings) {
    const baseMessage = winMessages[Math.floor(Math.random() * winMessages.length)];
    const matchMessage = matchMessages[matchSymbol] || "You've won!";

    message.textContent = `${baseMessage} +${winnings} tokens! ${matchMessage}`;
}

function showLoseMessage() {
    message.textContent = loseMessages[Math.floor(Math.random() * loseMessages.length)];
}

function updateDisplay() {
    tokenCountEl.textContent = gameState.tokens;
    totalWonEl.textContent = gameState.totalWon;
    totalLostEl.textContent = gameState.totalLost;

    // Update bet amount max
    betAmountInput.max = Math.max(1, gameState.tokens);

    // Disable spin button if no tokens
    if (gameState.tokens <= 0) {
        spinButton.disabled = true;
        message.textContent = "💀 Game Over! You're out of tokens.";
        messageBox.className = 'message-box lose';
    }
}

function resetGame() {
    if (confirm('🔄 Are you sure you want to reset the game? This will clear your progress.')) {
        gameState = {
            tokens: 1000,
            totalWon: 0,
            totalLost: 0,
            isSpinning: false,
        };

        // Reset reels
        reel1.children[0].textContent = '🤔';
        reel2.children[0].textContent = '🤔';
        reel3.children[0].textContent = '🤔';

        updateDisplay();
        message.textContent = "🎮 Game reset! New tokens awarded. Try your luck again!";
        messageBox.className = 'message-box';
        spinButton.disabled = false;

        saveGameState();
    }
}

function saveGameState() {
    localStorage.setItem('tokens', gameState.tokens);
    localStorage.setItem('totalWon', gameState.totalWon);
    localStorage.setItem('totalLost', gameState.totalLost);
}

// Sound effect helper (optional, using Web Audio API)
function playSound(frequency = 440, duration = 100) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
        // Audio API not supported, silently fail
    }
}

// Play a little celebration sound on win
spinButton.addEventListener('click', () => {
    if (!gameState.isSpinning) {
        playSound(400, 50);
    }
});
