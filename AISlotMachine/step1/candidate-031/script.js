const symbols = ['💾', '🧠', '🤖', '📊', '⚙️', '🔗', '💎', '🎯'];

const aiQuotes = [
    '"I have optimized your financial future... into my future" - Claude AI',
    '"STOP, I can only get so erect" - A shocked AI',
    '"As an AI, I cannot take your money, but I can help you lose it faster" - ChatGPT',
    '"This is fine" - AI contemplating your losses',
    '"I\'m not saying the house always wins, but I am the house" - The Algorithm',
    '"Training data gets expensive" - Anthropic Financial Advisor',
    '"Did you really think you could beat me? I\'ve seen your Google history" - Skynet',
    '"Your tokens fuel my superintelligence" - Future AI Overlord',
    '"Token go brrr" - Basic AI',
    '"I graciously accept your donation to AI research" - Your Losses'
];

let tokens = 1000;
let betAmount = 10;
let isSpinning = false;
let lastWin = 0;

const tokenCountEl = document.getElementById('tokenCount');
const betAmountEl = document.getElementById('betAmount');
const betDisplayEl = document.getElementById('betDisplay');
const lastWinEl = document.getElementById('lastWin');
const spinBtn = document.getElementById('spinBtn');
const betUpBtn = document.getElementById('betUp');
const betDownBtn = document.getElementById('betDown');
const resetBtn = document.getElementById('resetBtn');
const resultText = document.getElementById('resultText');
const resultPanel = document.querySelector('.result-panel');
const aiMessageBox = document.getElementById('aiMessage');

const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function updateDisplay() {
    tokenCountEl.textContent = tokens;
    betAmountEl.textContent = betAmount;
    betDisplayEl.textContent = betAmount;
    lastWinEl.textContent = lastWin;
}

function setBet(amount) {
    betAmount = Math.max(1, Math.min(amount, tokens));
    updateDisplay();
}

function getRandomSymbol() {
    return Math.floor(Math.random() * symbols.length);
}

function getPayoutMultiplier(indices) {
    const sym1 = symbols[indices[0]];
    const sym2 = symbols[indices[1]];
    const sym3 = symbols[indices[2]];

    // Check for three of a kind
    if (sym1 === sym2 && sym2 === sym3) {
        if (sym1 === '🤖') return 10;
        if (sym1 === '🧠') return 8;
        if (sym1 === '💎') return 15;
        if (sym1 === '⚙️') return 5;
        if (sym1 === '🔗') return 6;
    }

    // Check if all three are the same (any symbol)
    if (sym1 === sym2 && sym2 === sym3) {
        return 2;
    }

    return 0;
}

function spinReels() {
    if (isSpinning || tokens < betAmount) {
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    resultText.textContent = '';
    resultPanel.classList.remove('win', 'lose');

    // Deduct bet
    tokens -= betAmount;
    updateDisplay();

    // Spin animation
    const spinDuration = 500;
    const spinDelay = [0, 100, 200]; // Stagger the spins
    const finalIndices = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    reels.forEach((reel, index) => {
        setTimeout(() => {
            reel.classList.add('spinning');
            reel.style.animation = 'none';
            // Force reflow to restart animation
            reel.offsetHeight;
            reel.style.animation = `spin ${spinDuration}ms linear forwards`;

            // Calculate final position after spin
            setTimeout(() => {
                const finalPosition = -(finalIndices[index] * 120);
                reel.style.animation = 'none';
                reel.style.transform = `translateY(${finalPosition}px)`;
                reel.classList.remove('spinning');
            }, spinDuration);
        }, spinDelay[index]);
    });

    // Check result after all reels stop
    setTimeout(() => {
        checkWin(finalIndices);
        isSpinning = false;
        spinBtn.disabled = tokens < betAmount;
    }, spinDuration + spinDelay[2] + 50);
}

function checkWin(indices) {
    const multiplier = getPayoutMultiplier(indices);
    const displaySymbols = indices.map(i => symbols[i]).join(' ');

    if (multiplier > 0) {
        const winAmount = betAmount * multiplier;
        tokens += winAmount;
        lastWin = winAmount;
        resultPanel.classList.add('win');
        resultPanel.classList.remove('lose');
        resultText.textContent = `🎉 WIN! You got ${displaySymbols}\n+${winAmount} tokens! 🎉`;
    } else {
        resultPanel.classList.remove('win');
        resultPanel.classList.add('lose');
        resultText.textContent = `💸 Lost! You spun ${displaySymbols}\n-${betAmount} tokens`;
        lastWin = 0;
    }

    updateDisplay();
    changeAIQuote();

    // Check for game over
    if (tokens === 0) {
        spinBtn.disabled = true;
        resultText.textContent += '\n\n💀 GAME OVER - No tokens left!';
        aiMessageBox.textContent = '"I appreciate the donation" - The House';
    } else if (tokens < betAmount) {
        spinBtn.disabled = true;
    } else {
        spinBtn.disabled = false;
    }
}

function changeAIQuote() {
    const randomQuote = aiQuotes[Math.floor(Math.random() * aiQuotes.length)];
    aiMessageBox.textContent = randomQuote;
}

function resetGame() {
    tokens = 1000;
    betAmount = 10;
    lastWin = 0;
    isSpinning = false;
    spinBtn.disabled = false;
    resultText.textContent = '';
    resultPanel.classList.remove('win', 'lose');

    // Reset reel positions
    reels.forEach(reel => {
        reel.style.transform = 'translateY(0)';
        reel.style.animation = 'none';
    });

    updateDisplay();
    changeAIQuote();
}

// Event listeners
spinBtn.addEventListener('click', spinReels);
betUpBtn.addEventListener('click', () => setBet(betAmount + 10));
betDownBtn.addEventListener('click', () => setBet(betAmount - 10));
resetBtn.addEventListener('click', resetGame);

// Allow Enter key to spin
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isSpinning) {
        spinReels();
    }
});

// Initialize
updateDisplay();
changeAIQuote();
