// Game state
let gameState = {
    tokens: 1000,
    totalSpent: 0
};

// AI-themed symbols and their meanings
const SYMBOLS = {
    '🚀': { name: 'AGI', weight: 5 },      // Rarest - AGI singularity
    '💡': { name: 'Idea', weight: 15 },    // Good idea
    '🔄': { name: 'Loop', weight: 20 },    // Infinite loop
    '😵': { name: 'Hallucinate', weight: 30 }, // Hallucinating
    '💸': { name: 'Cost', weight: 30 }     // Cost explosion
};

// Payout multipliers
const PAYOUTS = {
    '🚀🚀🚀': 500,
    '💡💡💡': 100,
    '🔄🔄🔄': 50,
    '😵😵😵': 25,
    '💸💸💸': 5,
    'pair': 2
};

// Funny AI-related tips and messages
const FUNNY_TIPS = [
    "The best time to quit was 1000 tokens ago. The second best time is now.",
    "AI: Artificial Incomplete logic",
    "Tokens are like API calls: infinite until you see the bill",
    "Why did the AI go broke? It had a context window of credit.",
    "This is what it feels like to be a prompt engineer with a budget.",
    "Your tokens are processing... they'll return never.",
    "The house always wins. The house is also the AI.",
    "Token cost scaling: linear pricing, exponential losses",
    "Chat and lose: The AI Token Story",
    "Even AI knows when to fold 'em",
    "Your tokens were sacrificed to the LLM gods 🙏",
    "This is fine. 🔥 (tokens edition)",
    "Prediction: You'll spin again. I'm very confident in this forecast.",
    "Losing money so fast, even a 10x GPU can't keep up",
    "The AI felt bad about your loss. It did not process this feeling."
];

// DOM elements
const tokenCount = document.getElementById('tokenCount');
const totalSpent = document.getElementById('totalSpent');
const spinBtn = document.getElementById('spinBtn');
const betAmount = document.getElementById('betAmount');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');
const tipsList = document.getElementById('tipsList');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Initialize game from localStorage
function initGame() {
    const saved = localStorage.getItem('slotMachineState');
    if (saved) {
        gameState = JSON.parse(saved);
    }
    updateDisplay();
}

// Save game state
function saveGame() {
    localStorage.setItem('slotMachineState', JSON.stringify(gameState));
}

// Update UI
function updateDisplay() {
    tokenCount.textContent = gameState.tokens;
    totalSpent.textContent = gameState.totalSpent;
}

// Get random symbol based on weights
function getRandomSymbol() {
    const symbols = Object.keys(SYMBOLS);
    const weights = symbols.map(s => SYMBOLS[s].weight);
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    let random = Math.random() * totalWeight;
    for (let i = 0; i < symbols.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return symbols[i];
        }
    }
    return symbols[symbols.length - 1];
}

// Spin the reels
async function spin() {
    const bet = parseInt(betAmount.value);

    // Validate bet
    if (bet <= 0) {
        message.textContent = '❌ Invalid bet amount!';
        return;
    }

    if (gameState.tokens < bet) {
        message.textContent = '💔 Not enough tokens! You\'re broke like an underutilized GPU.';
        return;
    }

    // Deduct bet
    gameState.tokens -= bet;
    gameState.totalSpent += bet;
    updateDisplay();

    // Disable spin button during animation
    spinBtn.disabled = true;
    message.textContent = 'Spinning...';

    // Animate reels
    const spins = [];
    const results = [];

    for (let i = 0; i < 3; i++) {
        spins.push(animateReel(reels[i], results, i));
    }

    await Promise.all(spins);

    // Calculate winnings
    const winAmount = calculateWinnings(results, bet);

    // Add winnings to tokens
    gameState.tokens += winAmount;
    updateDisplay();

    // Show result message
    if (winAmount > 0) {
        const netGain = winAmount - bet;
        message.textContent = `🎉 WIN! +${netGain} tokens! (Total win: ${winAmount})`;
        message.classList.remove('lose');
        message.classList.add('win');
    } else {
        message.textContent = `💀 Lost ${bet} tokens. Such is the way of AI.`;
        message.classList.remove('win');
        message.classList.add('lose');
    }

    // Add random tip
    addRandomTip();

    // Save game
    saveGame();

    // Re-enable spin button
    spinBtn.disabled = false;
}

// Animate a single reel
function animateReel(reel, results, index) {
    return new Promise(resolve => {
        const symbols = Object.keys(SYMBOLS);
        let currentIndex = Math.floor(Math.random() * symbols.length);
        let spins = 0;
        const maxSpins = 10 + Math.random() * 5;

        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % symbols.length;
            reel.style.transform = `translateY(-${currentIndex * 40}px)`;
            spins++;

            if (spins >= maxSpins) {
                clearInterval(interval);
                results[index] = symbols[currentIndex];
                resolve();
            }
        }, 50);

        reel.classList.add('spinning');
        setTimeout(() => reel.classList.remove('spinning'), 500);
    });
}

// Calculate winnings based on result
function calculateWinnings(results, bet) {
    const [r1, r2, r3] = results;

    // Check for three in a row
    const threeMatch = `${r1}${r2}${r3}`;
    if (PAYOUTS[threeMatch]) {
        return bet * PAYOUTS[threeMatch];
    }

    // Check for pairs
    if ((r1 === r2 && r1 === r3) || r1 === r2 || r2 === r3 || r1 === r3) {
        return bet * PAYOUTS['pair'];
    }

    return 0; // Loss
}

// Add random AI tip
function addRandomTip() {
    const randomTip = FUNNY_TIPS[Math.floor(Math.random() * FUNNY_TIPS.length)];
    const newTip = document.createElement('li');
    newTip.textContent = `"${randomTip}"`;
    tipsList.insertBefore(newTip, tipsList.firstChild);

    // Keep only the last 5 tips
    while (tipsList.children.length > 5) {
        tipsList.removeChild(tipsList.lastChild);
    }
}

// Reset game
function resetGame() {
    if (confirm('🚨 Are you sure you want to reset? Your precious tokens will be gone forever.')) {
        gameState = {
            tokens: 1000,
            totalSpent: 0
        };
        updateDisplay();
        message.textContent = '';
        message.classList.remove('win', 'lose');
        tipsList.innerHTML = '<li>"A fresh start! Or is it déjà vu?" - Confused AI</li>';
        saveGame();
    }
}

// Event listeners
spinBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', resetGame);

// Prevent negative bet
betAmount.addEventListener('change', (e) => {
    if (e.target.value < 1) {
        e.target.value = 1;
    }
    if (e.target.value > 500) {
        e.target.value = 500;
    }
});

// Initialize on load
window.addEventListener('DOMContentLoaded', initGame);
