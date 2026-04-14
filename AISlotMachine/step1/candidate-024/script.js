// AI Slot Machine Game
const symbols = ['🚀', '💾', '🧠', '⚡', '🤖', '💡', '📊', '🔄'];

const payoutTable = {
    '🤖': { three: 500, two: 0, one: 0 },
    '🧠': { three: 250, two: 0, one: 0 },
    '⚡': { three: 150, two: 0, one: 0 },
    '💾': { three: 100, two: 0, one: 0 },
    '🚀': { three: 75, two: 0, one: 0 },
    '💡': { three: 50, two: 0, one: 0 },
    '📊': { three: 40, two: 0, one: 0 },
    '🔄': { three: 30, two: 0, one: 0 },
};

const messages = {
    win500: "🚨 SKYNET ACTIVATED! 🚨",
    win250: "🧠 The singularity is near! 🧠",
    win150: "⚡ GPU's are on fire! ⚡",
    win100: "💾 Training batch complete! 💾",
    win75: "🚀 Houston, we have profit! 🚀",
    win50: "💡 That was an actual good prediction! 💡",
    win40: "📊 Your loss function decreased! 📊",
    win30: "🔄 Backpropagation successful! 🔄",
    winSmall: "✨ Lucky guess! The AI is jealous. ✨",
    lose: "💸 Your tokens have been allocated to GPU usage 💸",
    noFunds: "❌ Insufficient tokens for spin. Time to buy more!",
    jackpot: "🎰 TRIPLE JACKPOT! 🎰 You've won the AI lottery!",
};

let tokens = 1000;
let isSpinning = false;

const reels = document.querySelectorAll('.reel');
const tokenDisplay = document.getElementById('tokenCount');
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('result');
const messageBox = document.getElementById('messageBox');

spinButton.addEventListener('click', spin);

function spin() {
    // Check if player has enough tokens
    if (tokens < 10) {
        messageBox.textContent = messages.noFunds;
        messageBox.classList.add('warning');
        return;
    }

    if (isSpinning) return;

    isSpinning = true;
    tokens -= 10;
    updateDisplay();

    // Clear previous result
    resultDisplay.textContent = '';
    resultDisplay.className = '';
    messageBox.classList.remove('warning');

    // Animate each reel
    const spinPromises = [];
    reels.forEach((reel, index) => {
        spinPromises.push(animateReel(reel, index));
    });

    // Once all reels are done spinning, check for matches
    Promise.all(spinPromises).then(() => {
        checkWin();
        isSpinning = false;
    });
}

function animateReel(reel, index) {
    return new Promise((resolve) => {
        // Random spin duration between 0.6-0.8 seconds for variety
        const spinDuration = 600 + Math.random() * 200;

        reel.classList.add('spinning');

        // Pick a random symbol index
        const randomIndex = Math.floor(Math.random() * symbols.length);
        const finalSymbol = symbols[randomIndex];

        // Store the final symbol as a data attribute
        reel.dataset.result = finalSymbol;

        setTimeout(() => {
            reel.classList.remove('spinning');

            // Scroll to show the selected symbol
            const offset = randomIndex * 100;
            reel.scrollTop = offset;

            resolve();
        }, spinDuration);
    });
}

function checkWin() {
    const results = Array.from(reels).map((reel) => reel.dataset.result);
    const [r1, r2, r3] = results;

    let winAmount = 0;
    let message = messages.lose;

    // Check for three of a kind
    if (r1 === r2 && r2 === r3) {
        const symbol = r1;
        winAmount = payoutTable[symbol].three;

        if (winAmount === 500) {
            message = messages.jackpot;
        } else if (winAmount === 250) {
            message = messages.win250;
        } else if (winAmount === 150) {
            message = messages.win150;
        } else if (winAmount === 100) {
            message = messages.win100;
        } else if (winAmount === 75) {
            message = messages.win75;
        } else if (winAmount === 50) {
            message = messages.win50;
        } else if (winAmount === 40) {
            message = messages.win40;
        } else {
            message = messages.win30;
        }

        resultDisplay.classList.add('win');
    }
    // Check for any two matches (small win)
    else if ((r1 === r2) || (r2 === r3) || (r1 === r3)) {
        winAmount = 25;
        message = messages.winSmall;
        resultDisplay.classList.add('win');
    }
    // No match - lose
    else {
        resultDisplay.classList.add('lose');
    }

    tokens += winAmount;
    updateDisplay();

    // Display result
    if (winAmount > 0) {
        resultDisplay.textContent = `🎉 Won ${winAmount} tokens! 🎉`;
        messageBox.classList.remove('warning');
    } else {
        resultDisplay.textContent = '-10 tokens';
        messageBox.classList.add('warning');
    }

    messageBox.textContent = message;
}

function updateDisplay() {
    tokenDisplay.textContent = tokens;

    if (tokens < 10) {
        spinButton.disabled = true;
        spinButton.textContent = 'NOT ENOUGH TOKENS';
    } else {
        spinButton.disabled = false;
        spinButton.textContent = 'SPIN (Costs 10 tokens)';
    }
}

// Initial setup
updateDisplay();
