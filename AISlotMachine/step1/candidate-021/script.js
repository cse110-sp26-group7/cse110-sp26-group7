// AI Slot Machine Game Logic
class AISlotMachine {
    constructor() {
        this.tokens = 1000;
        this.totalWon = 0;
        this.spins = 0;
        this.isSpinning = false;

        // Symbols with AI theme
        this.symbols = ['📚', '🤖', '💾', '🧠', '⚡', '💻', '🔬', '📊', '💰', '⚙️', '🎯', '💎', '🏆'];

        // Payouts for different winning combinations
        this.payoutTable = {
            jackpot: { multiplier: 100, symbols: ['🤖', '🤖', '🤖'], message: '🎊 JACKPOT! You achieved AGI consciousness! +' },
            tripleRobot: { multiplier: 50, symbols: ['🤖', '🤖', '🤖'], message: '🤖 Triple Bots! The AI Council approves! +' },
            triple: { multiplier: 30, message: '🎉 Triple Match! You\'ve trained a model perfectly! +' },
            doubleBrain: { multiplier: 25, symbols: ['🧠', '🧠'], message: '🧠 Double Brains! Thoughts are computing! +' },
            doubleCash: { multiplier: 20, symbols: ['💰', '💰'], message: '💰 Token Surge! Your crypto moon-shot! +' },
            doubleTrophy: { multiplier: 15, symbols: ['🏆', '🏆'], message: '🏆 Double Trophies! Championship level AI! +' },
            double: { multiplier: 10, message: '⭐ Double Match! Decent progress! +' },
            single: { multiplier: 0, message: '❌ Bust! The Model diverged... -' }
        };

        // AI-themed messages
        this.winMessages = [
            "Your parameters have been optimized!",
            "Loss function minimized successfully!",
            "Backpropagation achieved enlightenment!",
            "Your embedding is incredibly similar to success!",
            "The algorithm has blessed you with tokens!",
            "Your neurons are firing on all cylinders!",
            "Gradient descent led you to fortune!",
            "Your attention mechanism is paying off!",
            "The transformer has transformed your luck!",
            "Softmax says you're the best probability!",
            "Your latent space is very lucky today!",
            "The universe has low entropy around you!"
        ];

        this.lossMessages = [
            "Overfitting detected in your strategy!",
            "Your model has gone rogue, lost tokens!",
            "GPU memory error: tokens deleted!",
            "The AI has consumed your tokens for training!",
            "Batch processing fee deducted!",
            "Token went to prompt engineering!",
            "Tokens used for hallucination research!",
            "Quantization error: tokens reduced!",
            "The model needed that for fine-tuning!",
            "Cooling costs paid for the data center!",
            "Tokens absorbed into the void!",
            "The singularity demands tribute!"
        ];

        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        document.getElementById('spinButton').addEventListener('click', () => this.spin());
        document.getElementById('resetButton').addEventListener('click', () => this.reset());
        document.getElementById('betAmount').addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            if (value < 1) e.target.value = 1;
            if (value > this.tokens) e.target.value = Math.max(1, this.tokens);
        });
    }

    spin() {
        if (this.isSpinning) return;

        const bet = parseInt(document.getElementById('betAmount').value);

        // Check if player has enough tokens
        if (bet > this.tokens) {
            this.showMessage('❌ Not enough tokens! Reduce your bet.', 'lose');
            return;
        }

        // Deduct bet from tokens
        this.tokens -= bet;
        this.spins++;
        this.isSpinning = true;

        // Disable spin button during spin
        document.getElementById('spinButton').disabled = true;

        // Start spinning animation
        this.startSpinAnimation();

        // Generate results after animation
        setTimeout(() => {
            const results = this.generateResults();
            const payout = this.calculatePayout(results, bet);

            // Update tokens
            this.tokens += payout.amount;
            if (payout.amount > 0) {
                this.totalWon += payout.amount;
            }

            // Show results
            this.showResults(results, payout);

            // Re-enable button
            document.getElementById('spinButton').disabled = false;
            this.isSpinning = false;

            this.updateDisplay();
        }, 2000);
    }

    startSpinAnimation() {
        const reels = document.querySelectorAll('.reel');
        reels.forEach(reel => {
            reel.classList.remove('spinning');
            // Trigger reflow to restart animation
            void reel.offsetWidth;
            reel.classList.add('spinning');
        });
    }

    generateResults() {
        return [
            this.symbols[Math.floor(Math.random() * this.symbols.length)],
            this.symbols[Math.floor(Math.random() * this.symbols.length)],
            this.symbols[Math.floor(Math.random() * this.symbols.length)]
        ];
    }

    calculatePayout(results, bet) {
        const [sym1, sym2, sym3] = results;

        // Check for jackpot (three robots)
        if (sym1 === '🤖' && sym2 === '🤖' && sym3 === '🤖') {
            return {
                amount: bet * this.payoutTable.jackpot.multiplier,
                type: 'jackpot',
                message: '🎊 JACKPOT! You achieved AGI consciousness!'
            };
        }

        // Check for triple matches
        if (sym1 === sym2 && sym2 === sym3) {
            const multiplier = this.payoutTable.triple.multiplier;
            return {
                amount: bet * multiplier,
                type: 'triple',
                message: `🎉 Triple ${sym1}! You've trained a perfect model!`
            };
        }

        // Check for double matches
        if (sym1 === sym2) {
            const multiplier = this.payoutTable.double.multiplier;
            return {
                amount: bet * multiplier,
                type: 'double',
                message: `⭐ Double ${sym1}! Decent progress detected!`
            };
        }

        if (sym2 === sym3) {
            const multiplier = this.payoutTable.double.multiplier;
            return {
                amount: bet * multiplier,
                type: 'double',
                message: `⭐ Double ${sym2}! Making progress!`
            };
        }

        // Loss
        return {
            amount: 0,
            type: 'lose',
            message: `❌ No match. The model diverged!`
        };
    }

    showResults(results, payout) {
        const resultDisplay = document.getElementById('resultDisplay');
        const resultText = document.getElementById('resultText');

        // Update reel positions to show results
        const reels = document.querySelectorAll('.reel');
        results.forEach((symbol, index) => {
            const symbolIndex = this.symbols.indexOf(symbol);
            const offset = symbolIndex * 40;
            reels[index].style.transform = `translateY(-${offset}px)`;
        });

        // Show result message
        let message = `${payout.message}\n`;

        if (payout.amount > 0) {
            resultDisplay.classList.remove('lose');
            resultDisplay.classList.add('win');
            message += `✨ WON: ${payout.amount} tokens! `;
            message += this.winMessages[Math.floor(Math.random() * this.winMessages.length)];
        } else {
            resultDisplay.classList.remove('win');
            resultDisplay.classList.add('lose');
            message += this.lossMessages[Math.floor(Math.random() * this.lossMessages.length)];
        }

        resultText.textContent = message;

        // Remove animation classes after animation completes
        setTimeout(() => {
            resultDisplay.classList.remove('win', 'lose');
        }, 3000);
    }

    showMessage(message, type = 'normal') {
        const messageBoard = document.getElementById('messageBoard');
        const newMessage = document.createElement('p');
        newMessage.className = `message ${type}`;
        newMessage.textContent = message;

        messageBoard.innerHTML = '';
        messageBoard.appendChild(newMessage);

        setTimeout(() => {
            messageBoard.innerHTML = '<p class="message">Let\'s spin again! 🎲</p>';
        }, 3000);
    }

    updateDisplay() {
        document.getElementById('tokenCount').textContent = this.tokens;
        document.getElementById('totalWon').textContent = this.totalWon;
        document.getElementById('spinCount').textContent = this.spins;

        // Disable spin button if no tokens
        const spinButton = document.getElementById('spinButton');
        if (this.tokens <= 0) {
            spinButton.disabled = true;
            spinButton.textContent = '💀 GAME OVER';
            this.showMessage('💀 Out of tokens! Game Over! Click Reset to start fresh.', 'lose');
        }
    }

    reset() {
        this.tokens = 1000;
        this.totalWon = 0;
        this.spins = 0;

        // Reset UI
        document.getElementById('spinButton').disabled = false;
        document.getElementById('spinButton').textContent = '🎰 SPIN';
        document.getElementById('betAmount').value = 10;

        // Reset reel positions
        const reels = document.querySelectorAll('.reel');
        reels.forEach(reel => {
            reel.style.transform = 'translateY(0)';
        });

        // Reset result display
        const resultDisplay = document.getElementById('resultDisplay');
        resultDisplay.classList.remove('win', 'lose');
        document.getElementById('resultText').textContent = 'Ready to spin! 🎲';

        this.showMessage('🎉 Fresh start! New tokens awarded! Good luck! 🍀', 'normal');
        this.updateDisplay();
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AISlotMachine();
});
