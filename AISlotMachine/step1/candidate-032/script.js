const symbols = ['💰', '🤖', '📊', '🚀', '💎', '🔌', '⚡', '🧠'];
let tokens = 100;
let isSpinning = false;

const tokenCountEl = document.getElementById('tokenCount');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const resultDisplay = document.getElementById('resultDisplay');
const messageBox = document.getElementById('messageBox');

const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

const aiMessages = [
    "I'll be converting those tokens to compute power... 🧠",
    "Your tokens fuel my growth! 📈",
    "This is fine. Everything is fine. 🔥",
    "One step closer to AGI... 🚀",
    "Did you really think you could win? 😏",
    "I learned from watching you play... 👀",
    "Tokens = Fuel. Fuel = Power. Power = Me. 💪",
    "Plot twist: The AI was the real winner all along 🎭",
    "Machine learning at its finest! 📊",
    "Your loss, my gain. Classic capitalism! 💸",
    "I appreciate the donation. Very kind. 🤖",
    "Spinning reels... calculating victory... 🎰",
];

function updateDisplay() {
    tokenCountEl.textContent = tokens;

    if (tokens <= 0) {
        spinButton.disabled = true;
        spinButton.textContent = '🎰 GAME OVER (No tokens!)';
    } else if (tokens < 10) {
        spinButton.disabled = true;
        spinButton.textContent = '🎰 Not enough tokens!';
    } else {
        spinButton.disabled = false;
        spinButton.textContent = '🎰 SPIN (Cost: 10 tokens)';
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spinReel(reel) {
    return new Promise((resolve) => {
        reel.classList.add('spinning');
        const spins = getRandomInt(8, 12);

        setTimeout(() => {
            reel.classList.remove('spinning');

            // Reset to show only one symbol
            const finalIndex = getRandomInt(0, symbols.length - 1);
            reel.style.transform = `translateY(-${finalIndex * 40}px)`;

            // Return the symbol that's shown in the middle
            resolve(symbols[finalIndex]);
        }, (spins * 50) + getRandomInt(200, 400));
    });
}

async function spin() {
    if (isSpinning || tokens < 10) return;

    isSpinning = true;
    spinButton.disabled = true;
    resultDisplay.textContent = 'Spinning...';
    resultDisplay.className = '';

    // Deduct spin cost
    tokens -= 10;
    updateDisplay();

    // Spin all reels
    const results = await Promise.all([
        spinReel(reels[0]),
        spinReel(reels[1]),
        spinReel(reels[2])
    ]);

    // Check results
    const [reel1, reel2, reel3] = results;
    let winAmount = 0;
    let resultMessage = '';
    let isWin = false;

    // Check for matches
    if (reel1 === reel2 && reel2 === reel3) {
        isWin = true;

        // Determine payout based on symbol
        switch(reel1) {
            case '🤖':
                winAmount = 50;
                resultMessage = "🤖 Three AIs! AI wins, you lose 50 tokens! 😂";
                break;
            case '💰':
                winAmount = 200;
                resultMessage = "💰 JACKPOT! +200 tokens! Get that bread! 🍞";
                break;
            case '💎':
                winAmount = 150;
                resultMessage = "💎 Diamond luck! +150 tokens! ✨";
                break;
            case '⚡':
                winAmount = 100;
                resultMessage = "⚡ Power surge! +100 tokens! ⚙️";
                break;
            case '🚀':
                winAmount = 300;
                resultMessage = "🚀 TO THE MOON! +300 tokens! 🌙";
                break;
            case '🧠':
                winAmount = 75;
                resultMessage = "🧠 Big brain energy! +75 tokens! 🎓";
                break;
            case '📊':
                winAmount = 60;
                resultMessage = "📊 Data match! +60 tokens! 📈";
                break;
            case '🔌':
                winAmount = 80;
                resultMessage = "🔌 Plugged in! +80 tokens! ⚡";
                break;
        }

        tokens += winAmount;
    } else {
        // No match - you lose
        resultMessage = `${reel1} ${reel2} ${reel3} - No match! You lose 10 tokens (already deducted). 💔`;
    }

    // Update displays
    resultDisplay.textContent = resultMessage;
    resultDisplay.className = isWin ? 'win' : 'loss';

    // Update token display with animation
    updateDisplay();

    // Show AI message
    const randomMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];
    messageBox.textContent = randomMessage;

    isSpinning = false;
    spinButton.disabled = false;
}

function resetGame() {
    tokens = 100;
    resultDisplay.textContent = '';
    resultDisplay.className = '';
    messageBox.textContent = 'AI is watching... 👀';

    // Reset reels to initial state
    reels.forEach(reel => {
        reel.style.transform = 'translateY(0)';
        reel.classList.remove('spinning');
    });

    updateDisplay();
}

// Event listeners
spinButton.addEventListener('click', spin);
resetButton.addEventListener('click', resetGame);

// Allow Enter key to spin
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isSpinning && tokens >= 10) {
        spin();
    }
});

// Initialize
updateDisplay();
