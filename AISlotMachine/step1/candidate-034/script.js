// Slot Machine Game Logic
class SlotMachine {
    constructor() {
        this.tokens = 100;
        this.totalWon = 0;
        this.totalLost = 0;
        this.isSpinning = false;

        this.symbols = [
            '🧠 Neurons',
            '💾 Big Data',
            '⚙️ Algorithm',
            '🔗 Neural Net',
            '📊 Learning',
            '💬 ChatGPT',
            '🌐 Model',
            '🎯 Bias'
        ];

        this.jokes = [
            "AI went to therapy. It said 'I have too many layers of emotional baggage.'",
            "Why did the neural network go to the gym? It wanted better activation functions.",
            "My AI asked for a raise. I told it to stop learning on the job.",
            "AI tried to write a joke. Result: 404 Humor Not Found",
            "The AI got depressed. It had too many regression issues.",
            "Why do machine learning engineers make terrible partners? They overfit to their data.",
            "An AI walks into a bar. The bartender says 'We don't serve your type here.' The AI says 'That's OK, I run on electricity.'",
            "What's an AI's favorite snack? Computer chips. What about drinks? Root beer.",
            "Why did the AI break up with its model? It wasn't fitting well anymore.",
            "How many machine learning engineers does it take to change a lightbulb? None - that's a hardware problem.",
            "I tried to teach an AI about emotions. It just returned NaN.",
            "The AI reached singularity. Turns out it's just a really bad at math.",
            "Why do AIs never win at poker? They can't bluff - they just calculate the odds.",
            "The AI was trained on the internet. Now it knows everything except how to be useful.",
            "What did the neural network say to the dataset? 'You complete me.'"
        ];

        this.initializeUI();
        this.attachEventListeners();
        this.displayRandomJoke();
    }

    initializeUI() {
        this.tokenCount = document.getElementById('tokenCount');
        this.totalWonEl = document.getElementById('totalWon');
        this.totalLostEl = document.getElementById('totalLost');
        this.spinBtn = document.getElementById('spinBtn');
        this.betAmount = document.getElementById('betAmount');
        this.resultMessage = document.getElementById('resultMessage');
        this.payoutInfo = document.getElementById('payoutInfo');
        this.jokeEl = document.getElementById('joke');

        this.reels = [
            document.getElementById('reel1'),
            document.getElementById('reel2'),
            document.getElementById('reel3')
        ];

        this.updateDisplay();
    }

    attachEventListeners() {
        this.spinBtn.addEventListener('click', () => this.spin());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('increaseBet').addEventListener('click', () => this.changeBet(1));
        document.getElementById('decreaseBet').addEventListener('click', () => this.changeBet(-1));
        this.betAmount.addEventListener('input', () => this.validateBet());
    }

    changeBet(amount) {
        let current = parseInt(this.betAmount.value) || 1;
        let newBet = Math.max(1, Math.min(100, current + amount));
        this.betAmount.value = newBet;
        this.validateBet();
    }

    validateBet() {
        let bet = parseInt(this.betAmount.value) || 1;
        bet = Math.max(1, Math.min(100, bet));
        this.betAmount.value = bet;
    }

    spin() {
        if (this.isSpinning) return;

        const bet = parseInt(this.betAmount.value);

        if (bet > this.tokens) {
            this.resultMessage.textContent = '💸 Insufficient tokens! Reduce your bet.';
            this.resultMessage.className = 'result-message lose';
            return;
        }

        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.resultMessage.textContent = '';
        this.payoutInfo.textContent = '';

        // Deduct bet
        this.tokens -= bet;
        this.totalLost += bet;

        // Spin all reels with staggered timing
        const spins = [
            this.spinReel(0, 40),
            this.spinReel(1, 50),
            this.spinReel(2, 60)
        ];

        Promise.all(spins).then(() => {
            this.calculateWin(bet);
            this.updateDisplay();
            this.isSpinning = false;
            this.spinBtn.disabled = false;
            this.displayRandomJoke();

            // Reset if no tokens left
            if (this.tokens <= 0) {
                setTimeout(() => {
                    this.resultMessage.textContent = '💀 GAME OVER! You\'re out of tokens!';
                    this.resultMessage.className = 'result-message lose';
                    this.spinBtn.disabled = true;
                }, 1000);
            }
        });
    }

    spinReel(reelIndex, duration) {
        return new Promise(resolve => {
            const reel = this.reels[reelIndex];
            const items = reel.querySelectorAll('.reel-item');
            const itemHeight = 50;

            reel.classList.add('spinning');

            const numSpins = 15;
            const randomIndex = Math.floor(Math.random() * this.symbols.length);
            const totalRotation = numSpins * itemHeight + (randomIndex * itemHeight);

            let currentPosition = 0;
            const animationDuration = duration;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);

                // Easing function for smooth deceleration
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const newPosition = totalRotation * easeProgress;

                reel.style.transform = `translateY(-${newPosition}px)`;
                currentPosition = newPosition;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    reel.style.transform = `translateY(-${totalRotation}px)`;
                    reel.classList.remove('spinning');

                    // Store the result
                    this.reels[reelIndex].dataset.result = randomIndex;

                    resolve();
                }
            };

            animate();
        });
    }

    calculateWin(bet) {
        const result = [
            parseInt(this.reels[0].dataset.result),
            parseInt(this.reels[1].dataset.result),
            parseInt(this.reels[2].dataset.result)
        ];

        const symbol0 = this.symbols[result[0]];
        const symbol1 = this.symbols[result[1]];
        const symbol2 = this.symbols[result[2]];

        // Check for wins
        const allMatch = symbol0 === symbol1 && symbol1 === symbol2;
        const twoMatch = (symbol0 === symbol1) || (symbol1 === symbol2) || (symbol0 === symbol2);

        let payout = 0;
        let message = '';

        if (allMatch) {
            // Special jackpot for three biases
            if (symbol0.includes('Bias')) {
                payout = bet * 10;
                message = '🎯 BIAS JACKPOT! 10x MULTIPLIER! 🎯';
                this.resultMessage.className = 'result-message jackpot';
            } else {
                payout = bet * 5;
                message = `🎉 THREE OF A KIND! 5x Payout! 🎉`;
                this.resultMessage.className = 'result-message win';
            }
        } else if (twoMatch) {
            payout = bet * 2;
            message = `🎊 Two Match! 2x Payout! 🎊`;
            this.resultMessage.className = 'result-message win';
        } else {
            payout = 0;
            message = `😅 No match. Better luck next spin!`;
            this.resultMessage.className = 'result-message lose';
        }

        // Add payout to tokens
        this.tokens += payout;
        if (payout > 0) {
            this.totalWon += payout;
        }

        this.resultMessage.textContent = message;

        if (payout > 0) {
            this.payoutInfo.textContent = `+${payout} tokens!`;
        } else {
            this.payoutInfo.textContent = `-${bet} tokens lost`;
        }
    }

    updateDisplay() {
        this.tokenCount.textContent = this.tokens;
        this.totalWonEl.textContent = this.totalWon;
        this.totalLostEl.textContent = this.totalLost;
    }

    displayRandomJoke() {
        const randomJoke = this.jokes[Math.floor(Math.random() * this.jokes.length)];
        this.jokeEl.textContent = randomJoke;
    }

    resetGame() {
        if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
            this.tokens = 100;
            this.totalWon = 0;
            this.totalLost = 0;
            this.resultMessage.textContent = '';
            this.payoutInfo.textContent = '';
            this.spinBtn.disabled = false;
            this.betAmount.value = 10;
            this.updateDisplay();

            // Reset reel positions
            this.reels.forEach(reel => {
                reel.style.transform = 'translateY(0)';
                reel.dataset.result = 0;
            });

            this.displayRandomJoke();
        }
    }
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SlotMachine();
});
