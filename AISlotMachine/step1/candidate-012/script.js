// Game state
let gameState = {
    tokens: 100,
    spins: 0,
    totalLost: 0,
    isSpinning: false
};

// AI-themed messages
const messages = {
    start: [
        "Bet your tokens on AI reliability! 🎲",
        "Spin to ask an AI a simple question! 🤔",
        "Try your luck with AI recommendations! ✨"
    ],
    wins: {
        brain: [
            "The AI had a coherent thought! 🎉",
            "It actually understood your prompt! 😲",
            "The model didn't hallucinate! (This time)",
            "Wait... was that correct? Let me check..."
        ],
        money: [
            "You won big! Now spend it all on compute! 💸",
            "Congratulations! That's 1 hour of cloud storage! 🌩️",
            "You can afford ONE token prediction! 💵",
            "Your GPU rental payment is secured!"
        ],
        rocket: [
            "To the moon! 🚀 (Watch it crash back down)",
            "AGI is 5 minutes away! (Again)",
            "This startup will definitely not go bankrupt",
            "We're shipping AI bias! 🚀"
        ],
        talk: [
            "The chatbot's response was relevant! 🎉",
            "It only repeated what you asked 10 times!",
            "No NSFW content detected! (Probably)",
            "ChatGPT wrote something useful! Unbelievable!"
        ],
        lightning: [
            "Your model trained in 0.5 seconds! ⚡",
            "The quantum computer actually worked!",
            "No training divergence detected!",
            "Your loss is decreasing! (For now...)"
        ],
        target: [
            "Nailed the accuracy target! 🎯",
            "Only 2% worse than production!",
            "The test set matched validation!",
            "Your metric didn't overfit!"
        ],
        phone: [
            "The mobile app didn't crash! 📱",
            "Your inference latency is < 1 hour!",
            "Battery drain is only 95%!",
            "The app is lighter than expected!"
        ],
        gem: [
            "You found a rare insight! 💎",
            "The data scientist actually understands your model!",
            "Your config is reproducible!",
            "Someone read your documentation!"
        ]
    },
    losses: [
        "AI made something up again... 😅",
        "It confidently gave you the wrong answer.",
        "That'll be $0.47 in API costs.",
        "Your prompt was 'too creative'.",
        "The model went to sleep.",
        "That wasn't aligned with human values.",
        "Please reformulate that question.",
        "Content policy violation detected!",
        "The AI had an existential crisis.",
        "Your tokens have been spent on training sarcasm.",
        "The model decided it knows better.",
        "Insert philosophical AI tangent here...",
        "That feature coming in Q2... (2026)"
    ],
    jackpot: [
        "JACKPOT! The AI was actually useful! 🤯",
        "UNPRECEDENTED! All three were correct! 🏆",
        "Did... did it work? CHECK THE LOGS!",
        "Is this real life? Or just hallucination? 🌀"
    ]
};

const symbols = ['📱', '💰', '🧠', '💬', '🔮', '⚡', '🎯', '🚀'];

const prizeTable = {
    '🧠': { jackpot: 50, partial: 5 },
    '💰': { jackpot: 100, partial: 5 },
    '🚀': { jackpot: 75, partial: 5 },
    '💬': { jackpot: 25, partial: 5 },
    '🔮': { jackpot: 30, partial: 5 },
    '⚡': { jackpot: 35, partial: 5 },
    '🎯': { jackpot: 40, partial: 5 },
    '📱': { jackpot: 20, partial: 5 }
};

const spinCost = 10;

// DOM elements
const tokenDisplay = document.getElementById('tokenCount');
const spinCountDisplay = document.getElementById('spinCount');
const totalLostDisplay = document.getElementById('totalLost');
const spinBtn = document.getElementById('spinBtn');
const resetBtn = document.getElementById('resetBtn');
const messageDisplay = document.getElementById('messageDisplay');
const reels = document.querySelectorAll('.reel');

// Initialize
function init() {
    updateDisplay();
    showRandomMessage(messages.start);
    spinBtn.addEventListener('click', spin);
    resetBtn.addEventListener('click', reset);
}

function updateDisplay() {
    tokenDisplay.textContent = gameState.tokens;
    spinCountDisplay.textContent = gameState.spins;
    totalLostDisplay.textContent = gameState.totalLost;

    // Enable/disable spin button
    spinBtn.disabled = gameState.tokens < spinCost || gameState.isSpinning;
    spinBtn.textContent = `SPIN (Cost: ${spinCost} tokens)`;
}

function showMessage(text, type = 'neutral') {
    messageDisplay.textContent = text;
    messageDisplay.className = 'message-display';
    if (type) {
        messageDisplay.classList.add(type);
    }
}

function showRandomMessage(messageArray) {
    const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
    showMessage(randomMessage, 'neutral');
}

function spin() {
    if (gameState.isSpinning || gameState.tokens < spinCost) return;

    gameState.isSpinning = true;
    gameState.tokens -= spinCost;
    gameState.spins += 1;
    gameState.totalLost += spinCost;
    updateDisplay();

    // Animate reels
    const spinDuration = 1000; // 1 second
    const results = [];

    reels.forEach((reel, index) => {
        reel.classList.add('spinning');

        // Generate random result
        const resultSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        results.push(resultSymbol);

        // Stop reel after animation
        setTimeout(() => {
            reel.classList.remove('spinning');
            reel.innerHTML = `<div class="symbol">${resultSymbol}</div>`;
        }, spinDuration);
    });

    // Check results after all reels stop
    setTimeout(() => {
        checkResults(results);
        gameState.isSpinning = false;
        updateDisplay();
    }, spinDuration + 100);
}

function checkResults(results) {
    const [r1, r2, r3] = results;

    // Check for jackpot (all three match)
    if (r1 === r2 && r2 === r3) {
        handleJackpot(r1);
        return;
    }

    // Check for partial matches (any two match)
    let hasPartialMatch = false;
    if (r1 === r2 || r2 === r3 || r1 === r3) {
        hasPartialMatch = true;
    }

    if (hasPartialMatch) {
        handlePartialWin(results);
    } else {
        handleLoss();
    }
}

function handleJackpot(symbol) {
    const prize = prizeTable[symbol]?.jackpot || 30;
    gameState.tokens += prize;

    // Get AI-themed message for this symbol
    const symbolMessages = {
        '🧠': messages.wins.brain,
        '💰': messages.wins.money,
        '🚀': messages.wins.rocket,
        '💬': messages.wins.talk,
        '🔮': messages.wins.lightning,
        '⚡': messages.wins.lightning,
        '🎯': messages.wins.target,
        '📱': messages.wins.phone
    };

    const winMessages = symbolMessages[symbol] || messages.wins.brain;
    const message = winMessages[Math.floor(Math.random() * winMessages.length)];

    showMessage(`${message}\n\n+${prize} tokens!`, 'win');
}

function handlePartialWin(results) {
    // Award a small amount for any match
    const prize = 5;
    gameState.tokens += prize;

    const matchedPair = results.find((r, i) =>
        (i < 2 && r === results[i + 1]) ||
        (i === 0 && r === results[2])
    );

    showMessage(`Two of a kind! You got: ${matchedPair} ${results.join(' ')}?\n\n+${prize} tokens!`, 'win');
}

function handleLoss() {
    showRandomMessage(messages.losses);
    showMessage(showRandomMessage(messages.losses).textContent || messages.losses[0], 'loss');
}

function reset() {
    gameState = {
        tokens: 100,
        spins: 0,
        totalLost: 0,
        isSpinning: false
    };

    reels.forEach(reel => {
        reel.innerHTML = `<div class="symbol">🎰</div>`;
    });

    updateDisplay();
    showRandomMessage(messages.start);
}

// Start the game
init();
