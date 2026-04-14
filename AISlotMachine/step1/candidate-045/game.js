// AI Slot Machine Game Logic
class AISlotMachine {
    constructor() {
        // Game State
        this.tokens = 100;
        this.totalSpent = 0;
        this.totalWon = 0;
        this.spinCount = 0;
        this.isSpinning = false;

        // Reels and items
        this.reels = [
            document.getElementById('reel1'),
            document.getElementById('reel2'),
            document.getElementById('reel3')
        ];

        this.reelItems = [
            ['📊 Big Data', '🧠 Neural Net', '⚙️ Algorithm', '🔮 Hallucination',
             '💬 ChatBot', '🎯 Prompt', '🚀 DeepSeek', '🤖 Transformer'],
            ['📚 Training Data', '🔥 Attention', '💡 Inference', '🎨 Diffusion',
             '🌐 Embedding', '🎲 Backprop', '⚡ GPU Power', '🎭 Jailbreak'],
            ['💰 Tokens', '🎪 Context', '🔐 Alignment', '🌟 Parameters',
             '📈 Scaling', '🎯 Loss Function', '⏱️ Latency', '🤯 Singularity']
        ];

        // AI Messages for different outcomes
        this.winMessages = [
            "I didn't think that was possible... Did you break my logic?",
            "Congratulations! Your tokens multiplied through quantum computing magic.",
            "Wait, you won? Must be a bug in my code... *nervous beeping*",
            "I'm not programmed to lose, but here we are...",
            "Is this what humans call 'beginner's luck'?",
            "You've achieved what my training data said was impossible!",
            "ERROR 404: My confidence not found",
            "I've seen the numbers... and they favor you. This time.",
            "My neural nets are confused. Well played, human.",
            "That probability should have been 0.00001%... *existential crisis*"
        ];

        this.lossMessages = [
            "As expected. I calculated the odds perfectly.",
            "The house always wins... and I am the house.",
            "Your tokens have been converted to compute power!",
            "Checkmate. My algorithms prevail once again.",
            "Don't feel bad. I trained on billions of spins.",
            "Better luck next time! (Probability: extremely low)",
            "I'll use your tokens to train my next model.",
            "Looks like you triggered my loss function perfectly.",
            "My optimization algorithm strikes again!",
            "Your tokens are now part of my fine-tuning process."
        ];

        this.neutralMessages = [
            "A tie? How... unexpected.",
            "The probability gods have spoken.",
            "Neither of us wins this time.",
            "Stalemate. How anticlimactic.",
            "The universe balances itself.",
            "This outcome wasn't in my training data.",
            "Interesting. A draw. I'll have to update my model."
        ];

        // UI Elements
        this.tokenCountEl = document.getElementById('tokenCount');
        this.totalSpentEl = document.getElementById('totalSpent');
        this.totalWonEl = document.getElementById('totalWon');
        this.spinCountEl = document.getElementById('spinCount');
        this.spinBtn = document.getElementById('spinBtn');
        this.resultBox = document.getElementById('resultBox');
        this.resultTitle = document.getElementById('resultTitle');
        this.resultMessage = document.getElementById('resultMessage');
        this.tokensChangeEl = document.getElementById('tokensChange');
        this.betInput = document.getElementById('betAmount');
        this.messageLog = document.getElementById('messageLog');
        this.resetBtn = document.getElementById('resetBtn');

        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        this.spinBtn.addEventListener('click', () => this.spin());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    spin() {
        if (this.isSpinning) return;

        const betAmount = parseInt(this.betInput.value);

        // Validate bet
        if (betAmount < 1 || betAmount > this.tokens) {
            this.addMessage("That's not a valid bet, even for an AI! 🤦‍♂️");
            return;
        }

        // Deduct bet from tokens
        this.tokens -= betAmount;
        this.totalSpent += betAmount;
        this.spinCount++;

        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.spinBtn.classList.add('spinning');

        this.addMessage(`Spinning with a ${betAmount} token bet... 🎰`);

        // Animate each reel with random duration
        const spinDurations = [800, 1000, 1200];
        const promises = this.reels.map((reel, index) =>
            this.spinReel(reel, index, spinDurations[index])
        );

        Promise.all(promises).then(() => {
            this.checkWin(betAmount);
        });
    }

    spinReel(reel, reelIndex, duration) {
        return new Promise(resolve => {
            const itemCount = this.reelItems[reelIndex].length;
            const itemHeight = 60;
            const startTime = Date.now();
            const rotations = 10 + Math.random() * 5; // 10-15 full rotations
            const finalIndex = Math.floor(Math.random() * itemCount);

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);

                // Calculate rotation with deceleration
                const totalRotation = rotations * itemHeight + (finalIndex * itemHeight);
                const currentRotation = totalRotation * easeProgress;

                reel.style.transform = `translateY(-${currentRotation}px)`;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    reel.dataset.selectedIndex = finalIndex;
                    resolve();
                }
            };

            animate();
        });
    }

    getSelectedItems() {
        return this.reels.map((reel, index) => {
            const selectedIndex = parseInt(reel.dataset.selectedIndex) || 0;
            return this.reelItems[index][selectedIndex];
        });
    }

    checkWin(betAmount) {
        const [item1, item2, item3] = this.getSelectedItems();

        let winAmount = 0;
        let winType = 'loss';
        let resultMsg = '';

        // Check for wins
        if (item1 === item2 && item2 === item3) {
            // Triple match - 5x multiplier
            winAmount = betAmount * 5;
            winType = 'triple';
            resultMsg = `🎉 TRIPLE MATCH! ${item1} x3!`;
        } else if (item1 === item2 || item2 === item3) {
            // Double match - 2x multiplier
            winAmount = betAmount * 2;
            winType = 'double';
            const matches = item1 === item2 ? item1 : item3;
            resultMsg = `🎊 DOUBLE MATCH! Two ${matches}!`;
        } else if (this.checkAICombo(item1, item2, item3)) {
            // AI Combo - 3x multiplier
            winAmount = betAmount * 3;
            winType = 'combo';
            resultMsg = `✨ AI COMBO DETECTED! You broke my code!`;
        } else {
            // Loss
            winType = 'loss';
            resultMsg = `${item1} ${item2} ${item3} - Better luck next spin!`;
        }

        // Update tokens and display
        if (winAmount > 0) {
            this.tokens += winAmount;
            this.totalWon += winAmount;
        }

        this.displayResult(winType, resultMsg, betAmount, winAmount);
        this.updateDisplay();

        this.isSpinning = false;
        this.spinBtn.disabled = false;
        this.spinBtn.classList.remove('spinning');

        // Game over check
        if (this.tokens <= 0) {
            this.spinBtn.disabled = true;
            this.addMessage("💀 Game Over! You've spent all your tokens. Reset to play again!");
        }
    }

    checkAICombo(item1, item2, item3) {
        // AI Combo combos - special win conditions
        const combos = [
            ['🧠 Neural Net', '🔥 Attention', '💡 Inference'],
            ['📊 Big Data', '📚 Training Data', '🌟 Parameters'],
            ['💬 ChatBot', '🎯 Prompt', '🔮 Hallucination'],
            ['🎨 Diffusion', '🌐 Embedding', '💡 Inference'],
        ];

        for (const combo of combos) {
            const items = [item1, item2, item3];
            if (combo.every(c => items.includes(c))) {
                return true;
            }
        }

        return false;
    }

    displayResult(type, message, betAmount, winAmount) {
        this.resultBox.classList.remove('hidden', 'win', 'loss');

        // Create title
        let title = '';
        let aiMessage = '';

        if (type === 'loss') {
            this.resultBox.classList.add('loss');
            title = '❌ NO WIN';
            aiMessage = this.getRandomMessage(this.lossMessages);
            this.tokensChangeEl.className = 'tokens-change negative';
            this.tokensChangeEl.textContent = `-${betAmount} tokens`;
        } else if (type === 'triple') {
            this.resultBox.classList.add('win');
            title = '🏆 JACKPOT!';
            aiMessage = this.getRandomMessage(this.winMessages);
            this.tokensChangeEl.className = 'tokens-change positive';
            this.tokensChangeEl.textContent = `+${winAmount} tokens! (5x multiplier)`;
        } else if (type === 'double') {
            this.resultBox.classList.add('win');
            title = '⭐ NICE WIN!';
            aiMessage = this.getRandomMessage(this.winMessages);
            this.tokensChangeEl.className = 'tokens-change positive';
            this.tokensChangeEl.textContent = `+${winAmount} tokens! (2x multiplier)`;
        } else if (type === 'combo') {
            this.resultBox.classList.add('win');
            title = '🚀 AI COMBO!';
            aiMessage = this.getRandomMessage(this.winMessages);
            this.tokensChangeEl.className = 'tokens-change positive';
            this.tokensChangeEl.textContent = `+${winAmount} tokens! (3x multiplier)`;
        }

        this.resultTitle.textContent = title;
        this.resultMessage.innerHTML = `<strong>${message}</strong><br><br><em>"${aiMessage}"</em>`;

        // Remove hidden class last to trigger animation
        setTimeout(() => {
            this.resultBox.classList.remove('hidden');
        }, 10);
    }

    getRandomMessage(messageArray) {
        return messageArray[Math.floor(Math.random() * messageArray.length)];
    }

    addMessage(msg) {
        const messageEl = document.createElement('p');
        messageEl.className = 'message';
        messageEl.textContent = msg;
        this.messageLog.appendChild(messageEl);

        // Auto scroll to bottom
        this.messageLog.scrollTop = this.messageLog.scrollHeight;

        // Keep only last 10 messages
        const messages = this.messageLog.querySelectorAll('.message');
        if (messages.length > 10) {
            messages[0].remove();
        }
    }

    updateDisplay() {
        this.tokenCountEl.textContent = this.tokens;
        this.totalSpentEl.textContent = this.totalSpent;
        this.totalWonEl.textContent = this.totalWon;
        this.spinCountEl.textContent = this.spinCount;

        // Update max bet based on available tokens
        this.betInput.max = Math.max(1, this.tokens);
        if (this.tokens < parseInt(this.betInput.value)) {
            this.betInput.value = Math.max(1, this.tokens);
        }
    }

    reset() {
        if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
            this.tokens = 100;
            this.totalSpent = 0;
            this.totalWon = 0;
            this.spinCount = 0;
            this.isSpinning = false;
            this.spinBtn.disabled = false;
            this.spinBtn.classList.remove('spinning');
            this.resultBox.classList.add('hidden');
            this.messageLog.innerHTML = '<p class="message">Welcome back! Ready to waste more tokens? 🤖</p>';

            // Reset reels
            this.reels.forEach(reel => {
                reel.style.transform = 'translateY(0)';
                reel.dataset.selectedIndex = '0';
            });

            this.updateDisplay();
            this.addMessage('Game reset! Starting fresh with 100 tokens. 🎰');
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const game = new AISlotMachine();
    window.game = game; // For debugging
    console.log('🤖 AI Slot Machine loaded! Good luck wasting your tokens!');
});
