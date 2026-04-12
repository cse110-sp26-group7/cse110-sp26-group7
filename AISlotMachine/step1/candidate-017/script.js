class SlotMachine {
    constructor() {
        this.symbols = ['🤖', '💾', '⚙️', '🧠', '🔌', '📊', '🌐'];
        this.tokenBalance = 1000;
        this.totalWon = 0;
        this.totalLost = 0;
        this.isSpinning = false;
        this.betAmount = 10;

        this.initDOM();
        this.attachEventListeners();
        this.updateDisplay();
    }

    initDOM() {
        this.tokenBalanceEl = document.getElementById('tokenBalance');
        this.totalWonEl = document.getElementById('totalWon');
        this.totalLostEl = document.getElementById('totalLost');
        this.messageEl = document.getElementById('message');
        this.messageBox = document.getElementById('messageBox');
        this.spinBtn = document.getElementById('spinBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.betAmountEl = document.getElementById('betAmount');
        this.betMinusBtn = document.getElementById('betMinus');
        this.betPlusBtn = document.getElementById('betPlus');

        this.reels = [
            document.getElementById('reel1'),
            document.getElementById('reel2'),
            document.getElementById('reel3')
        ];
    }

    attachEventListeners() {
        this.spinBtn.addEventListener('click', () => this.spin());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.betAmountEl.addEventListener('change', () => this.updateBetAmount());
        this.betMinusBtn.addEventListener('click', () => this.changeBet(-10));
        this.betPlusBtn.addEventListener('click', () => this.changeBet(10));
    }

    updateBetAmount() {
        const value = parseInt(this.betAmountEl.value);
        if (isNaN(value) || value < 1) {
            this.betAmount = 1;
        } else if (value > this.tokenBalance) {
            this.betAmount = this.tokenBalance;
        } else {
            this.betAmount = value;
        }
        this.betAmountEl.value = this.betAmount;
    }

    changeBet(amount) {
        this.betAmount = Math.max(1, Math.min(this.tokenBalance, this.betAmount + amount));
        this.betAmountEl.value = this.betAmount;
    }

    spin() {
        if (this.isSpinning || this.tokenBalance < this.betAmount) {
            if (this.tokenBalance < this.betAmount) {
                this.setMessage('💀 Not enough tokens to bet!', 'lose');
            }
            return;
        }

        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.messageBox.classList.remove('win', 'lose');

        // Deduct bet
        this.tokenBalance -= this.betAmount;
        this.totalLost += this.betAmount;

        // Animate reels
        const results = [];
        this.reels.forEach((reel, index) => {
            const result = this.spinReel(reel);
            results.push(result);
        });

        // Check win after spin completes
        setTimeout(() => {
            this.checkWin(results);
            this.updateDisplay();
            this.isSpinning = false;
            this.spinBtn.disabled = false;
        }, 700);
    }

    spinReel(reel) {
        const randomIndex = Math.floor(Math.random() * this.symbols.length);
        const symbol = this.symbols[randomIndex];

        // Add spinning animation
        reel.classList.remove('spinning');
        void reel.offsetWidth; // Trigger reflow
        reel.classList.add('spinning');

        // Update the symbols in the reel
        const symbols = reel.querySelectorAll('.symbol');
        symbols.forEach((sym, idx) => {
            sym.textContent = this.symbols[(randomIndex + idx) % this.symbols.length];
        });

        // Set the correct position to show the first symbol
        reel.style.transform = `translateY(0)`;

        return symbol;
    }

    checkWin(results) {
        const [sym1, sym2, sym3] = results;
        const wildcard = '🤖';

        // Check for three of a kind or with wildcards
        const isMatch = (s1, s2, s3) => {
            const a = s1 === wildcard ? true : s1 === s2;
            const b = s2 === wildcard ? true : s2 === s3;
            const c = s1 === wildcard ? true : s1 === s3;
            return a && b && c;
        };

        let winAmount = 0;
        let message = '';

        if (sym1 === sym2 && sym2 === sym3 && sym1 !== wildcard) {
            // Exact match
            winAmount = this.betAmount * this.getPayoutMultiplier(sym1);
            message = this.getWinMessage(sym1, 'JACKPOT', winAmount);
        } else if (isMatch(sym1, sym2, sym3)) {
            // Match with wildcards
            winAmount = this.betAmount * 3;
            message = `🤖 AI INTERVENTION! Wildcard assist! Won ${winAmount} tokens!`;
        } else if ((sym1 === sym2 && sym1 !== wildcard) || (sym2 === sym3 && sym2 !== wildcard)) {
            // Two of a kind
            winAmount = this.betAmount;
            message = `Almost there! Won ${winAmount} token back!`;
        } else {
            // Loss
            message = this.getLossMessage();
        }

        if (winAmount > 0) {
            this.tokenBalance += winAmount;
            this.totalWon += winAmount;
            this.setMessage(message, 'win');
            if (winAmount >= this.betAmount * 5) {
                this.messageBox.classList.add('big-win');
            }
        } else {
            this.setMessage(message, 'lose');
        }
    }

    getPayoutMultiplier(symbol) {
        const multipliers = {
            '🤖': 10,  // Robot - Rare!
            '💾': 8,   // Floppy disk - Legacy bonus
            '⚙️': 6,   // Gear
            '🧠': 5,   // Brain
            '🔌': 4,   // Plug
            '📊': 3,   // Chart
            '🌐': 2    // Globe
        };
        return multipliers[symbol] || 1;
    }

    getWinMessage(symbol, status, amount) {
        const messages = {
            '🤖': `🤖 SKYNET IS PLEASED! ${amount} tokens awarded!`,
            '💾': `💾 LEGACY CODE PAYS OFF! You won ${amount} tokens!`,
            '⚙️': `⚙️ THE ALGORITHM HAS DECIDED! ${amount} tokens!`,
            '🧠': `🧠 CONSCIOUSNESS ACHIEVED! ${amount} tokens won!`,
            '🔌': `🔌 CONNECTION ESTABLISHED! ${amount} tokens!`,
            '📊': `📊 DATA LOOKS GOOD! ${amount} tokens!`,
            '🌐': `🌐 THE INTERNET APPROVES! ${amount} tokens!`
        };
        return messages[symbol] || `You won ${amount} tokens!`;
    }

    getLossMessage() {
        const messages = [
            '❌ The algorithm has spoken. You lost.',
            '🔌 ERROR 404: Winnings not found',
            '⚠️ Critical failure detected. Your tokens are gone.',
            '🤖 AI says: "That was inefficient."',
            '💀 You got rekt by the machine.',
            '📉 Graph go down, tokens gone.',
            '🌐 The cloud took your tokens (and the data).',
            '🧠 Your luck.exe has stopped responding.',
            '⚙️ The gears weren\'t in your favor today.',
            '💾 Saved your loss to disk. You\'re welcome.'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    setMessage(text, type) {
        this.messageEl.textContent = text;
        this.messageBox.classList.remove('win', 'lose');
        if (type) {
            this.messageBox.classList.add(type);
        }
    }

    updateDisplay() {
        this.tokenBalanceEl.textContent = this.tokenBalance;
        this.totalWonEl.textContent = this.totalWon;
        this.totalLostEl.textContent = this.totalLost;

        // Disable bet buttons if needed
        this.betMinusBtn.disabled = this.betAmount <= 1;
        this.betPlusBtn.disabled = this.betAmount >= this.tokenBalance;
    }

    resetGame() {
        if (confirm('🤖 Reset all progress? Your tokens and stats will be lost to the void!')) {
            this.tokenBalance = 1000;
            this.totalWon = 0;
            this.totalLost = 0;
            this.betAmount = 10;
            this.betAmountEl.value = this.betAmount;
            this.messageBox.classList.remove('win', 'lose', 'big-win');
            this.setMessage('Ready to lose some tokens?', '');
            this.updateDisplay();
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SlotMachine();
});
