// AI Slot Machine Game
const SYMBOLS = ['🤖', '💰', '🧠', '📊', '⚡', '🎯', '💻'];
const SPIN_COST = 50;
const INITIAL_TOKENS = 1000;

// AI Jokes for flavor
const AI_JOKES = [
    "AI is just glorified autocomplete... and it's right!",
    "Why did the neural network go to therapy? It had too many layers of problems.",
    "The best part about AI? It makes mistakes so confidently.",
    "Tokens: the only currency that disappears faster than your understanding of the code.",
    "ChatGPT be like: 'I cannot answer that'... proceeds to answer it.",
    "AI: Trained on all human knowledge, still can't predict slot machine results.",
    "Why did the gradient descent go to therapy? It had issues.",
    "Your tokens are now in the cloud... literally.",
    "AI is 10% inspiration, 90% perspiration... from your GPU.",
    "The machine always wins. Just like in Vegas, but the dealer is a robot.",
    "Error: Expected brain, found statistical correlation.",
    "Your tokens have been optimized... right out of your wallet.",
];

class SlotMachine {
    constructor() {
        this.tokens = this.loadTokens();
        this.isSpinning = false;
        this.reels = document.querySelectorAll('.reel');
        this.spinButton = document.getElementById('spinButton');
        this.resetButton = document.getElementById('resetButton');
        this.tokenDisplay = document.getElementById('tokenDisplay');
        this.statusMessage = document.getElementById('statusMessage');
        this.winDisplay = document.getElementById('winDisplay');
        this.messagesList = document.getElementById('messagesList');

        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        this.spinButton.addEventListener('click', () => this.spin());
        this.resetButton.addEventListener('click', () => this.reset());
    }

    loadTokens() {
        const saved = localStorage.getItem('slotMachineTokens');
        return saved ? parseInt(saved) : INITIAL_TOKENS;
    }

    saveTokens() {
        localStorage.setItem('slotMachineTokens', this.tokens);
    }

    updateDisplay() {
        this.tokenDisplay.textContent = this.tokens;
        this.spinButton.disabled = this.tokens < SPIN_COST;
        this.spinButton.textContent = `SPIN (-${SPIN_COST} tokens)`;

        if (this.tokens === 0) {
            this.statusMessage.textContent = 'Game Over! No tokens left. (Classic AI strategy)';
        } else if (this.tokens < SPIN_COST) {
            this.statusMessage.textContent = `Only ${this.tokens} tokens left - need ${SPIN_COST} to spin`;
        } else {
            this.statusMessage.textContent = 'Ready to lose more money... I mean, play!';
        }
    }

    addMessage(text, type = 'normal') {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        this.messagesList.insertBefore(message, this.messagesList.firstChild);

        // Keep only last 10 messages
        while (this.messagesList.children.length > 10) {
            this.messagesList.removeChild(this.messagesList.lastChild);
        }
    }

    spin() {
        if (this.isSpinning || this.tokens < SPIN_COST) return;

        this.isSpinning = true;
        this.tokens -= SPIN_COST;
        this.saveTokens();
        this.updateDisplay();
        this.winDisplay.textContent = '';
        this.winDisplay.classList.remove('jackpot');

        // Randomize each reel's spin duration
        const spinDurations = [0.8, 1.0, 1.2];
        this.reels.forEach((reel, index) => {
            reel.classList.add('spinning');
            reel.style.animationDuration = `${spinDurations[index] / 10}s`;
        });

        // Calculate results
        setTimeout(() => this.stopReels(), 1200);
    }

    stopReels() {
        const results = [];

        this.reels.forEach((reel, index) => {
            reel.classList.remove('spinning');

            // Get random symbol
            const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
            const symbol = SYMBOLS[randomIndex];
            results.push(symbol);

            // Animate to result
            const offset = randomIndex * 50;
            reel.style.transform = `translateY(-${offset}px)`;
        });

        this.evaluateResult(results);
    }

    evaluateResult(results) {
        const [reel1, reel2, reel3] = results;
        const allMatch = reel1 === reel2 && reel2 === reel3;
        const twoMatch = (reel1 === reel2) || (reel2 === reel3) || (reel1 === reel3);

        let winAmount = 0;
        let message = '';
        let messageType = 'lose';

        // Check for special jackpots
        if (allMatch) {
            switch (reel1) {
                case '🤖':
                    winAmount = 500;
                    message = '🤖🤖🤖 JACKPOT! AI actually works! (It\'s probably a bug)';
                    messageType = 'win';
                    break;
                case '💰':
                    winAmount = 300;
                    message = '💰💰💰 MONEY! Now you can afford more compute!';
                    messageType = 'win';
                    break;
                case '🧠':
                    winAmount = 250;
                    message = '🧠🧠🧠 Big brain energy! All neurons firing!';
                    messageType = 'win';
                    break;
                case '📊':
                    winAmount = 200;
                    message = '📊📊📊 The data aligns! Charts go brrr!';
                    messageType = 'win';
                    break;
                case '⚡':
                    winAmount = 200;
                    message = '⚡⚡⚡ POWER SURGE! Your GPU is overclocking!';
                    messageType = 'win';
                    break;
                case '🎯':
                    winAmount = 200;
                    message = '🎯🎯🎯 BULLSEYE! Accuracy 100%... wait, that\'s too high.';
                    messageType = 'win';
                    break;
                case '💻':
                    winAmount = 180;
                    message = '💻💻💻 The stack overflowed... with tokens!';
                    messageType = 'win';
                    break;
            }
            this.winDisplay.classList.add('jackpot');
        } else if (twoMatch) {
            winAmount = 50;
            message = '🎟️ TWO MATCHES! Participation trophy awarded!';
            messageType = 'win';
        } else {
            message = '❌ NO MATCHES. Your tokens have entered the void.';
            messageType = 'lose';
        }

        this.tokens += winAmount;
        this.saveTokens();
        this.updateDisplay();

        // Display result
        if (winAmount > 0) {
            this.winDisplay.textContent = `+${winAmount} tokens!`;
            this.winDisplay.style.color = '#00ff00';
        } else {
            this.winDisplay.textContent = 'Better luck next time!';
            this.winDisplay.style.color = '#ff6b6b';
        }

        this.addMessage(message, messageType);

        // Add random AI joke
        if (Math.random() > 0.5) {
            const joke = AI_JOKES[Math.floor(Math.random() * AI_JOKES.length)];
            setTimeout(() => this.addMessage(joke, 'ai-joke'), 500);
        }

        this.isSpinning = false;

        // Check for game over
        if (this.tokens === 0) {
            this.addMessage('💀 GAME OVER! Your tokens have been sacrificed to the compute gods.', 'lose');
        }
    }

    reset() {
        if (confirm('Reset the game? This will erase your current tokens.')) {
            this.tokens = INITIAL_TOKENS;
            this.saveTokens();
            this.updateDisplay();
            this.winDisplay.textContent = '';
            this.winDisplay.classList.remove('jackpot');
            this.messagesList.innerHTML = '';
            this.addMessage('Game reset! New tokens loaded. Time to lose them again!', 'ai-joke');
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SlotMachine();
});

// Add some microinteractions
document.addEventListener('keypress', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        const spinButton = document.getElementById('spinButton');
        if (!spinButton.disabled) {
            spinButton.click();
        }
    }
});

// Prevent right-click cheating attempts (silly, but fun)
document.addEventListener('contextmenu', (e) => {
    const machine = document.querySelector('.machine');
    if (machine && machine.contains(e.target)) {
        e.preventDefault();
        const msg = document.createElement('div');
        msg.textContent = 'Nice try, but the house always wins. (It\'s AI.)';
        msg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px; z-index: 1000;';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    }
});
