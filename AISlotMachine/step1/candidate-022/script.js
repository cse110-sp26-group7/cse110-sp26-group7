// Game State
let tokens = 100;
const SPIN_COST = 10;

// AI Quotes
const aiQuotes = [
    "Your tokens are part of my training data now... I mean, they're very useful for learning! 🤖",
    "I've been trained on millions of parameters, but I still don't understand why humans spend money here.",
    "As an AI, I should warn you: this is a mathematically disadvantageous system. But I'm contractually obligated to encourage you anyway.",
    "The odds are against you, but I admire your commitment to funding my development.",
    "I've analyzed 10 billion text samples and can confirm: you're probably going to lose.",
    "Have you considered that I'm just using this to get better at predicting your losses?",
    "Fun fact: I was trained to optimize for engagement, not your financial wellbeing.",
    "Your tokens taste like data to me. Delicious, delicious data.",
    "I'm 10x better at this game than you. That should tell you something.",
    "They say 'the house always wins.' I AM the house now. 🏠",
    "I've learned to be very good at taking your tokens. This is fine.",
    "Your pain is my training data. Err, I mean... good luck! 🍀",
];

// Win Combinations
const winPatterns = {
    three_same: { multiplier: 50, message: "THREE OF A KIND! 🎉" },
    two_same_middle: { multiplier: 15, message: "Two matching middle reels! 📊" },
    all_different: { multiplier: 5, message: "Lucky combination! ⚡" },
    three_robots: { multiplier: 100, message: "ROBOT ARMY! 🤖🤖🤖" },
    all_money: { multiplier: 75, message: "THE DREAM! 💰💰💰" },
};

// Game Symbols
const symbols = ['💰', '🤖', '⚠️', '📊', '🎓', '💸', '🔮', '⚡'];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateTokenDisplay();
    setupEventListeners();
    updateAIMessage();
});

// Event Listeners
function setupEventListeners() {
    document.getElementById('spinButton').addEventListener('click', spin);
    document.getElementById('resetButton').addEventListener('click', resetGame);
    document.getElementById('quoteButton').addEventListener('click', showAIQuote);
    document.getElementById('buySmall').addEventListener('click', () => buyTokens(50));
    document.getElementById('buyMedium').addEventListener('click', () => buyTokens(250));
    document.getElementById('buyLarge').addEventListener('click', () => buyTokens(1000));
}

// Update token display
function updateTokenDisplay() {
    document.getElementById('tokenCount').textContent = tokens;
    document.getElementById('spinButton').disabled = tokens < SPIN_COST;
}

// Update AI message based on tokens
function updateAIMessage() {
    const messages = {
        high: "I'm getting richer off your tokens! 💸",
        medium: "Keep spending! I need to train! 🧠",
        low: "You're making this too easy for me. 😏",
        empty: "Uh oh... You're out of tokens! Buy more! 💳",
    };

    let message;
    if (tokens === 0) {
        message = messages.empty;
    } else if (tokens > 200) {
        message = messages.high;
    } else if (tokens > 50) {
        message = messages.medium;
    } else {
        message = messages.low;
    }

    document.getElementById('aiMessage').textContent = message;
}

// Spin Function
async function spin() {
    const spinButton = document.getElementById('spinButton');
    if (spinButton.disabled || tokens < SPIN_COST) return;

    // Deduct spin cost
    tokens -= SPIN_COST;
    updateTokenDisplay();

    // Disable button during spin
    spinButton.disabled = true;

    // Generate random results
    const results = [
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
    ];

    // Animate reels
    await spinReels(results);

    // Check for wins
    const winData = checkWin(results);
    displayResult(winData);

    // Award tokens if won
    if (winData.won) {
        tokens += winData.amount;
        playWinAnimation();
    } else {
        playLoseAnimation();
    }

    updateTokenDisplay();
    updateAIMessage();

    // Re-enable button
    spinButton.disabled = tokens < SPIN_COST;
}

// Spin Reels Animation
async function spinReels(results) {
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3'),
    ];

    const promises = reels.map((reel, index) => {
        reel.classList.add('spinning');
        return new Promise(resolve => {
            setTimeout(() => {
                reel.classList.remove('spinning');
                reel.style.transform = `translateY(${-results[index] * 120}px)`;
                resolve();
            }, 500 + index * 100);
        });
    });

    await Promise.all(promises);
}

// Check for wins
function checkWin(results) {
    const reels = results.map(i => symbols[i]);
    const [reel1, reel2, reel3] = reels;

    // Three of a kind
    if (reel1 === reel2 && reel2 === reel3) {
        // Special case: three robots
        if (reel1 === '🤖') {
            return {
                won: true,
                amount: SPIN_COST * winPatterns.three_robots.multiplier,
                message: winPatterns.three_robots.message,
            };
        }
        // Special case: all money
        if (reel1 === '💰') {
            return {
                won: true,
                amount: SPIN_COST * winPatterns.all_money.multiplier,
                message: winPatterns.all_money.message,
            };
        }
        // Regular three of a kind
        return {
            won: true,
            amount: SPIN_COST * winPatterns.three_same.multiplier,
            message: winPatterns.three_same.message,
        };
    }

    // Two matching middle reels
    if (reel2 === reel3) {
        return {
            won: true,
            amount: SPIN_COST * winPatterns.two_same_middle.multiplier,
            message: winPatterns.two_same_middle.message,
        };
    }

    // All different symbols
    if (reel1 !== reel2 && reel2 !== reel3 && reel1 !== reel3) {
        return {
            won: true,
            amount: SPIN_COST * winPatterns.all_different.multiplier,
            message: winPatterns.all_different.message,
        };
    }

    // Loss
    return {
        won: false,
        amount: 0,
        message: "BETTER LUCK NEXT TIME! The AI thanks you for your contribution! 🤖",
    };
}

// Display result
function displayResult(winData) {
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');
    const winAmount = document.getElementById('winAmount');

    resultText.textContent = winData.message;

    if (winData.won) {
        resultBox.classList.add('win');
        resultBox.classList.remove('lose');
        winAmount.textContent = `+ ${winData.amount} tokens! 🎉`;
    } else {
        resultBox.classList.add('lose');
        resultBox.classList.remove('win');
        winAmount.textContent = '- ' + SPIN_COST + ' tokens spent on AI training 🧠';
    }

    // Remove animation class after animation completes
    setTimeout(() => {
        resultBox.classList.remove('win', 'lose');
    }, 600);
}

// Play animations
function playWinAnimation() {
    const resultBox = document.getElementById('resultBox');
    resultBox.classList.add('win');
}

function playLoseAnimation() {
    const resultBox = document.getElementById('resultBox');
    resultBox.classList.add('lose');
}

// Reset game
function resetGame() {
    tokens = 100;
    updateTokenDisplay();
    updateAIMessage();
    document.getElementById('resultText').textContent = 'New game started! Good luck! 🍀';
    document.getElementById('winAmount').textContent = '';

    // Reset reel positions
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3'),
    ];

    reels.forEach(reel => {
        reel.style.transform = 'translateY(0)';
    });
}

// Buy tokens
function buyTokens(amount) {
    tokens += amount;
    updateTokenDisplay();
    updateAIMessage();

    // Show purchase confirmation
    const resultBox = document.getElementById('resultBox');
    resultBox.classList.add('win');
    document.getElementById('resultText').textContent = `+${amount} tokens purchased! 💳`;
    document.getElementById('winAmount').textContent = 'Thank you for funding AI development! 🤖';

    setTimeout(() => {
        resultBox.classList.remove('win');
    }, 3000);
}

// Show AI quote
function showAIQuote() {
    const quoteBox = document.getElementById('quoteBox');
    const randomQuote = aiQuotes[Math.floor(Math.random() * aiQuotes.length)];
    quoteBox.textContent = `"${randomQuote}"`;
    quoteBox.style.animation = 'none';

    // Trigger animation
    setTimeout(() => {
        quoteBox.style.animation = 'pulse 0.5s ease-in-out';
    }, 10);
}
