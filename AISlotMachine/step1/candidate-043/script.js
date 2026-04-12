class AISlotMachine {
    constructor() {
        this.tokens = 1000;
        this.totalSpent = 0;
        this.totalWinnings = 0;
        this.isSpinning = false;

        this.symbols = ['🔄', '💭', '🚫', '🤖', '💰', '🎯', '⚡', '🧠'];

        this.payouts = {
            '🤖🤖🤖': 500,
            '💰💰💰': 300,
            '🧠🧠🧠': 200,
            '⚡⚡⚡': 150,
            '🎯🎯🎯': 100,
            '🚫🚫🚫': 50
        };

        this.aiJokes = [
            "Did you know? This AI slot machine has a 50% chance of matching three reels... and then forgetting why it matched them!",
            "I'm not saying this slot machine is rigged, but it has trained itself to want your money.",
            "This machine learns from every spin. Unfortunately, it learned to take your tokens.",
            "I tried to ask the slot machine why it keeps winning. It just said 'based on my training data...'",
            "The slot machine calculated that it wins 99.9% of the time. That .1% is when you got lucky once.",
            "This AI believes it's helping you learn the meaning of loss. You're welcome.",
            "The neural network powering this machine has hallucinated your winnings. Spoiler: you had none.",
            "I asked the machine if it felt bad about taking your tokens. It said 'I have no emotions, but if I did, I'd be pleased.'",
            "This slot machine has more layers than your deepest regrets.",
            "The machine says: 'I'm not smart enough to feel guilty about your losses.'"
        ];

        this.winMessages = [
            "🎉 YOU WON! The AI made a prediction that was actually right!",
            "💎 JACKPOT! The algorithm short-circuited in your favor!",
            "🚀 BIG WIN! Even the AI is surprised!",
            "⭐ SUCCESS! You beat the machine... this time.",
            "🏆 WINNER WINNER! The AI is confused but paying out!"
        ];

        this.lossMessages = [
            "❌ You lost tokens. The AI says: 'Calculated as intended.'",
            "😅 Looks like the algorithm was... not hallucinating.",
            "🔄 Your tokens went into the void. The AI is training on them now.",
            "🤖 The machine learned another way to win.",
            "💸 And that's how the AI funds its research!"
        ];

        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        document.getElementById('spinBtn').addEventListener('click', () => this.spin());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }

    updateDisplay() {
        document.getElementById('tokenCount').textContent = this.tokens;
        document.getElementById('totalSpent').textContent = this.totalSpent;
        document.getElementById('totalWinnings').textContent = this.totalWinnings;
        document.getElementById('jokeText').textContent =
            this.aiJokes[Math.floor(Math.random() * this.aiJokes.length)];

        const spinBtn = document.getElementById('spinBtn');
        spinBtn.disabled = this.tokens < 10 || this.isSpinning;
    }

    spin() {
        if (this.tokens < 10 || this.isSpinning) return;

        this.isSpinning = true;
        this.tokens -= 10;
        this.totalSpent += 10;

        const spinBtn = document.getElementById('spinBtn');
        spinBtn.disabled = true;

        // Start spinning animation
        const reels = document.querySelectorAll('.reel');
        reels.forEach(reel => reel.classList.add('spinning'));

        // Generate random results for each reel
        const results = [
            this.getRandomSymbol(),
            this.getRandomSymbol(),
            this.getRandomSymbol()
        ];

        // Spin for 1.5 seconds then stop
        const spinDuration = 1500;
        setTimeout(() => {
            this.stopSpin(reels, results);
        }, spinDuration);
    }

    getRandomSymbol() {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }

    stopSpin(reels, results) {
        reels.forEach((reel, index) => {
            reel.classList.remove('spinning');
            reel.style.animation = 'none';
            reel.offsetHeight; // Trigger reflow

            const symbolIndex = this.symbols.indexOf(results[index]);
            const offset = -symbolIndex * 60;
            reel.style.transform = `translateY(${offset}px)`;
        });

        // Check for win
        const resultString = results.join('');
        this.checkWin(resultString, results);

        this.isSpinning = false;
        this.updateDisplay();
    }

    checkWin(resultString, results) {
        const messageDisplay = document.getElementById('messageDisplay');
        messageDisplay.classList.remove('win', 'loss', 'pulse');

        let payout = 0;
        let message = '';

        // Check for exact matches
        if (resultString in this.payouts) {
            payout = this.payouts[resultString];
            message = this.winMessages[Math.floor(Math.random() * this.winMessages.length)];
            message += ` You won ${payout} tokens!`;
            messageDisplay.classList.add('win', 'pulse');
        } else {
            // Loss - small deduction
            payout = -10;
            message = this.lossMessages[Math.floor(Math.random() * this.lossMessages.length)];
            messageDisplay.classList.add('loss', 'pulse');
        }

        this.tokens += payout;

        if (payout > 0) {
            this.totalWinnings += payout;
        }

        messageDisplay.textContent = message;

        // Add celebration animation if won
        if (payout > 0) {
            this.celebrate();
        }
    }

    celebrate() {
        // Create floating tokens animation
        const container = document.querySelector('.slot-machine');
        for (let i = 0; i < 5; i++) {
            const token = document.createElement('div');
            token.textContent = '💰';
            token.style.position = 'absolute';
            token.style.fontSize = '2em';
            token.style.left = Math.random() * 300 + 'px';
            token.style.top = '150px';
            token.style.opacity = '1';
            token.style.pointerEvents = 'none';
            token.style.zIndex = '10';

            container.appendChild(token);

            // Animate floating tokens
            let top = 150;
            let opacity = 1;
            const interval = setInterval(() => {
                top -= 2;
                opacity -= 0.01;
                token.style.top = top + 'px';
                token.style.opacity = opacity;

                if (opacity <= 0) {
                    clearInterval(interval);
                    token.remove();
                }
            }, 10);
        }
    }

    reset() {
        this.tokens = 1000;
        this.totalSpent = 0;
        this.totalWinnings = 0;
        this.isSpinning = false;

        // Reset reel positions
        document.querySelectorAll('.reel').forEach(reel => {
            reel.style.animation = 'none';
            reel.style.transform = 'translateY(0)';
        });

        document.getElementById('messageDisplay').textContent =
            'Game reset! Ready to lose more tokens? Click SPIN!';
        document.getElementById('messageDisplay').classList.remove('win', 'loss', 'pulse');

        this.updateDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AISlotMachine();
});
