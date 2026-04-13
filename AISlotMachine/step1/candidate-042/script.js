// AI Slot Machine Game
class AISlotMachine {
    constructor() {
        // Game state
        this.tokens = 100;
        this.bet = 10;
        this.isSpinning = false;

        // Reel symbols
        this.symbols = ['🦾', '⚙️', '🧠', '💬', '🎰', '📊', '🔮', '💰'];

        // AI-themed messages
        this.winMessages = [
            "Plot twist: AI got lucky for once! 🎉",
            "Your neural network aligned with probability! 🧠",
            "Hallucination turned into real tokens? 🔮",
            "The training data was in your favor! 📊",
            "Even a broken AI is right twice a day! ⏰",
            "The algorithm actually worked! 🎰",
            "Your tokens gained consciousness! 💬",
            "The simulation glitched in your favor! 🌀",
            "Token overflow detected (the good kind)! 💰"
        ];

        this.lossMessages = [
            "As expected, the house always wins. Just like training data. 📉",
            "Error 404: Your tokens not found. 🔍",
            "The AI learned to take your money. Congrats! 🤖",
            "This is what overfitting looks like. 📊",
            "Your pattern recognition needs more epochs. 🔄",
            "The weights weren't in your favor. ⚖️",
            "Another data point for the loss function. 📉",
            "Even GPT-4 couldn't predict that outcome. 🔮",
            "Better luck in your next training run! 🏋️",
            "That's not hallucinating, that's just losing. 💔"
        ];

        this.jackpotMessages = {
            brain: "BIG BRAIN TIME! You got 3 actual thoughts! 🧠✨",
            chat: "HALLUCINATION JACKPOT! 3 conversations generated! 💬✨",
            money: "TOKEN OVERFLOW! The ATM just emptied! 💰✨",
            slots: "RECURSIVE WIN! Your loss became a gain! 🎰✨",
            crystal: "PROPHECY CAME TRUE! 3 future-visions aligned! 🔮✨",
            data: "DATA TRAINED PERFECTLY! 3 pattern matches! 📊✨",
        };

        // DOM elements
        this.tokenCountEl = document.getElementById('tokenCount');
        this.betAmountEl = document.getElementById('betAmount');
        this.betInputEl = document.getElementById('betInput');
        this.messageEl = document.getElementById('message');
        this.messageBoxEl = document.getElementById('messageBox');
        this.spinButton = document.getElementById('spinButton');
        this.resetButton = document.getElementById('resetButton');
        this.decreaseBetBtn = document.getElementById('decreaseBet');
        this.increaseBetBtn = document.getElementById('increaseBet');
        this.reels = [
            document.getElementById('reel1'),
            document.getElementById('reel2'),
            document.getElementById('reel3')
        ];

        // Event listeners
        this.spinButton.addEventListener('click', () => this.spin());
        this.resetButton.addEventListener('click', () => this.reset());
        this.decreaseBetBtn.addEventListener('click', () => this.decreaseBet());
        this.increaseBetBtn.addEventListener('click', () => this.increaseBet());
        this.betInputEl.addEventListener('change', () => this.updateBetFromInput());
        this.betInputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.updateBetFromInput();
        });

        // Initialize display
        this.updateDisplay();
    }

    updateDisplay() {
        this.tokenCountEl.textContent = this.tokens;
        this.betAmountEl.textContent = this.bet;
        this.spinButton.textContent = `SPIN (Cost: ${this.bet} tokens)`;
        this.spinButton.disabled = this.tokens < this.bet || this.isSpinning;
        this.betInputEl.value = this.bet;
    }

    decreaseBet() {
        if (this.bet > 1) {
            this.bet = Math.max(1, this.bet - 1);
            this.updateDisplay();
        }
    }

    increaseBet() {
        if (this.bet < this.tokens) {
            this.bet = Math.min(this.tokens, this.bet + 1);
            this.updateDisplay();
        }
    }

    updateBetFromInput() {
        let value = parseInt(this.betInputEl.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > this.tokens) value = this.tokens;
        this.bet = value;
        this.updateDisplay();
    }

    spin() {
        if (this.tokens < this.bet || this.isSpinning) return;

        this.isSpinning = true;
        this.tokens -= this.bet;
        this.updateDisplay();

        // Reset message
        this.messageBoxEl.classList.remove('win', 'loss', 'celebrating');
        this.messageEl.textContent = 'Spinning...';

        // Spin reels
        const spinDuration = 2000; // 2 seconds
        const results = [];

        this.reels.forEach((reel, index) => {
            reel.classList.add('spinning');

            // Random offset for each reel to create variation
            const randomDelay = Math.random() * 200;

            setTimeout(() => {
                const result = Math.floor(Math.random() * this.symbols.length);
                results.push(result);

                // Set final position
                const offset = result * 50; // Each symbol is 50px high
                reel.style.transform = `translateY(-${offset}px)`;
                reel.classList.remove('spinning');

                // Check for win when all reels are done
                if (results.length === 3) {
                    setTimeout(() => this.checkWin(results), 300);
                }
            }, spinDuration + randomDelay);
        });
    }

    checkWin(results) {
        const [r1, r2, r3] = results;
        const sym1 = this.symbols[r1];
        const sym2 = this.symbols[r2];
        const sym3 = this.symbols[r3];

        let winAmount = 0;
        let message = '';
        let isWin = false;

        // Check for three of a kind (jackpot)
        if (r1 === r2 && r2 === r3) {
            isWin = true;
            switch (sym1) {
                case '🧠':
                    winAmount = 500;
                    message = this.jackpotMessages.brain;
                    break;
                case '💬':
                    winAmount = 300;
                    message = this.jackpotMessages.chat;
                    break;
                case '💰':
                    winAmount = 250;
                    message = this.jackpotMessages.money;
                    break;
                case '🎰':
                    winAmount = 200;
                    message = this.jackpotMessages.slots;
                    break;
                case '🔮':
                    winAmount = 150;
                    message = this.jackpotMessages.crystal;
                    break;
                case '📊':
                    winAmount = 100;
                    message = this.jackpotMessages.data;
                    break;
                default:
                    winAmount = 50;
                    message = 'TRIPLE MATCH! You won big! 🎊';
            }
        }
        // Check for any two matches
        else if (r1 === r2 || r2 === r3 || r1 === r3) {
            isWin = true;
            winAmount = this.bet * 2;
            message = `Two matches! You won ${winAmount} tokens (50% match bonus)! 🍀`;
        }

        if (isWin) {
            this.tokens += winAmount;
            this.messageBoxEl.classList.add('win', 'celebrating');
            this.messageEl.textContent = message;

            // Celebration animation
            this.messageBoxEl.addEventListener('animationend', () => {
                this.messageBoxEl.classList.remove('celebrating');
            }, { once: true });
        } else {
            this.messageBoxEl.classList.add('loss');
            const randomLossMsg = this.lossMessages[
                Math.floor(Math.random() * this.lossMessages.length)
            ];
            this.messageEl.textContent = randomLossMsg;
        }

        this.isSpinning = false;
        this.updateDisplay();

        // Check if out of tokens
        if (this.tokens <= 0) {
            this.messageEl.textContent = 'GAME OVER! The AI has taken all your tokens. Game complete! 🤖';
            this.spinButton.disabled = true;
        }
    }

    reset() {
        this.tokens = 100;
        this.bet = 10;
        this.isSpinning = false;

        // Reset reels to initial state
        this.reels.forEach(reel => {
            reel.style.transform = 'translateY(0)';
            reel.classList.remove('spinning');
        });

        this.messageBoxEl.classList.remove('win', 'loss');
        this.messageEl.textContent = 'Ready to lose tokens?';

        this.updateDisplay();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AISlotMachine();
});
