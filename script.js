class ZetamacGame {
    constructor() {
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            timeRemaining: 120,
            currentScore: 0,
            totalProblems: 0,
            correctAnswers: 0,
            currentProblem: null,
            gameStartTime: null
        };

        this.settings = {
            duration: 120,
            difficulty: 'medium',
            operations: {
                addition: true,
                subtraction: true,
                multiplication: true,
                division: false
            },
            allowNegatives: false,
            autoSubmitDelay: 800
        };

        this.statistics = this.loadStatistics();
        this.timer = null;
        this.autoSubmitTimer = null;

        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.updateDisplay();
        this.updateStatistics();
    }

    initializeElements() {
        // Game elements
        this.timerElement = document.getElementById('timer');
        this.problemElement = document.getElementById('problem');
        this.answerInput = document.getElementById('answerInput');
        this.scoreElement = document.getElementById('currentScore');
        this.accuracyElement = document.getElementById('accuracy');

        // Control buttons
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');

        // Panel buttons
        this.settingsBtn = document.getElementById('settingsBtn');
        this.statsBtn = document.getElementById('statsBtn');

        // Panels
        this.settingsPanel = document.getElementById('settingsPanel');
        this.statsPanel = document.getElementById('statsPanel');

        // Settings elements
        this.gameDurationSelect = document.getElementById('gameDuration');
        this.difficultySelect = document.getElementById('difficulty');
        this.additionCheck = document.getElementById('addition');
        this.subtractionCheck = document.getElementById('subtraction');
        this.multiplicationCheck = document.getElementById('multiplication');
        this.divisionCheck = document.getElementById('division');
        this.negativesCheck = document.getElementById('negativesAllowed');
        this.autoSubmitDelaySelect = document.getElementById('autoSubmitDelay');

        // Statistics elements
        this.totalGamesElement = document.getElementById('totalGames');
        this.bestScoreElement = document.getElementById('bestScore');
        this.avgScoreElement = document.getElementById('avgScore');
        this.bestAccuracyElement = document.getElementById('bestAccuracy');
        this.recentGamesElement = document.getElementById('recentGamesList');

        // Modal elements
        this.gameOverModal = document.getElementById('gameOverModal');
        this.finalScoreElement = document.getElementById('finalScore');
        this.finalAccuracyElement = document.getElementById('finalAccuracy');
        this.problemsSolvedElement = document.getElementById('problemsSolved');
    }

    bindEvents() {
        // Game controls
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetGame());

        // Answer input
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.gameState.isPlaying && !this.gameState.isPaused) {
                this.clearAutoSubmitTimer();
                this.checkAnswer();
            }
        });

        this.answerInput.addEventListener('input', () => {
            if (this.gameState.isPlaying && !this.gameState.isPaused) {
                this.handleAnswerInput();
            }
        });

        // Panel controls
        this.settingsBtn.addEventListener('click', () => this.showPanel('settings'));
        this.statsBtn.addEventListener('click', () => this.showPanel('stats'));
        document.getElementById('closeSettings').addEventListener('click', () => this.hidePanel('settings'));
        document.getElementById('closeStats').addEventListener('click', () => this.hidePanel('stats'));

        // Settings changes
        this.gameDurationSelect.addEventListener('change', () => this.updateSettings());
        this.difficultySelect.addEventListener('change', () => this.updateSettings());
        this.additionCheck.addEventListener('change', () => this.updateSettings());
        this.subtractionCheck.addEventListener('change', () => this.updateSettings());
        this.multiplicationCheck.addEventListener('change', () => this.updateSettings());
        this.divisionCheck.addEventListener('change', () => this.updateSettings());
        this.negativesCheck.addEventListener('change', () => this.updateSettings());
        this.autoSubmitDelaySelect.addEventListener('change', () => this.updateSettings());

        // Modal controls
        document.getElementById('playAgain').addEventListener('click', () => {
            this.hideModal();
            this.startGame();
        });
        document.getElementById('closeModal').addEventListener('click', () => this.hideModal());

        // Statistics
        document.getElementById('exportStats').addEventListener('click', () => this.exportStatisticsToCSV());
        document.getElementById('clearStats').addEventListener('click', () => this.clearStatistics());

        // Close panels when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target === this.settingsPanel) this.hidePanel('settings');
            if (e.target === this.statsPanel) this.hidePanel('stats');
        });
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('zetamac-settings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        this.applySettings();
    }

    applySettings() {
        this.gameDurationSelect.value = this.settings.duration;
        this.difficultySelect.value = this.settings.difficulty;
        this.additionCheck.checked = this.settings.operations.addition;
        this.subtractionCheck.checked = this.settings.operations.subtraction;
        this.multiplicationCheck.checked = this.settings.operations.multiplication;
        this.divisionCheck.checked = this.settings.operations.division;
        this.negativesCheck.checked = this.settings.allowNegatives;
        this.autoSubmitDelaySelect.value = this.settings.autoSubmitDelay;
        
        this.gameState.timeRemaining = this.settings.duration;
        this.updateDisplay();
    }

    updateSettings() {
        this.settings.duration = parseInt(this.gameDurationSelect.value);
        this.settings.difficulty = this.difficultySelect.value;
        this.settings.operations.addition = this.additionCheck.checked;
        this.settings.operations.subtraction = this.subtractionCheck.checked;
        this.settings.operations.multiplication = this.multiplicationCheck.checked;
        this.settings.operations.division = this.divisionCheck.checked;
        this.settings.allowNegatives = this.negativesCheck.checked;
        this.settings.autoSubmitDelay = parseInt(this.autoSubmitDelaySelect.value);

        // Ensure at least one operation is selected
        const hasOperation = Object.values(this.settings.operations).some(op => op);
        if (!hasOperation) {
            this.settings.operations.addition = true;
            this.additionCheck.checked = true;
        }

        localStorage.setItem('zetamac-settings', JSON.stringify(this.settings));
        
        if (!this.gameState.isPlaying) {
            this.gameState.timeRemaining = this.settings.duration;
            this.updateDisplay();
        }
    }

    generateProblem() {
        const availableOperations = Object.entries(this.settings.operations)
            .filter(([op, enabled]) => enabled)
            .map(([op]) => op);

        const operation = availableOperations[Math.floor(Math.random() * availableOperations.length)];
        const range = this.getDifficultyRange();

        let num1, num2, answer, problemText;

        switch (operation) {
            case 'addition':
                num1 = this.randomInRange(range.min, range.max);
                num2 = this.randomInRange(range.min, range.max);
                answer = num1 + num2;
                problemText = `${num1} + ${num2}`;
                break;

            case 'subtraction':
                num1 = this.randomInRange(range.min, range.max);
                num2 = this.randomInRange(range.min, range.max);
                if (!this.settings.allowNegatives && num2 > num1) {
                    [num1, num2] = [num2, num1];
                }
                answer = num1 - num2;
                problemText = `${num1} - ${num2}`;
                break;

            case 'multiplication':
                const multRange = this.getMultiplicationRange();
                num1 = this.randomInRange(multRange.min, multRange.max);
                num2 = this.randomInRange(multRange.min, multRange.max);
                answer = num1 * num2;
                problemText = `${num1} × ${num2}`;
                break;

            case 'division':
                const divRange = this.getDivisionRange();
                num2 = this.randomInRange(divRange.min, divRange.max);
                answer = this.randomInRange(1, divRange.max);
                num1 = num2 * answer;
                problemText = `${num1} ÷ ${num2}`;
                break;
        }

        return { problemText, answer };
    }

    getDifficultyRange() {
        switch (this.settings.difficulty) {
            case 'easy': return { min: 1, max: 10 };
            case 'medium': return { min: 1, max: 50 };
            case 'hard': return { min: 1, max: 100 };
            case 'expert': return { min: 1, max: 999 };
            default: return { min: 1, max: 50 };
        }
    }

    getMultiplicationRange() {
        switch (this.settings.difficulty) {
            case 'easy': return { min: 1, max: 5 };
            case 'medium': return { min: 1, max: 12 };
            case 'hard': return { min: 1, max: 25 };
            case 'expert': return { min: 1, max: 99 };
            default: return { min: 1, max: 12 };
        }
    }

    getDivisionRange() {
        switch (this.settings.difficulty) {
            case 'easy': return { min: 2, max: 5 };
            case 'medium': return { min: 2, max: 12 };
            case 'hard': return { min: 2, max: 25 };
            case 'expert': return { min: 2, max: 50 };
            default: return { min: 2, max: 12 };
        }
    }

    randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    startGame() {
        this.gameState.isPlaying = true;
        this.gameState.isPaused = false;
        this.gameState.timeRemaining = this.settings.duration;
        this.gameState.currentScore = 0;
        this.gameState.totalProblems = 0;
        this.gameState.correctAnswers = 0;
        this.gameState.gameStartTime = Date.now();

        this.answerInput.disabled = false;
        this.answerInput.focus();
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;

        this.generateNewProblem();
        this.startTimer();
        this.updateDisplay();
    }

    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        
        if (this.gameState.isPaused) {
            this.pauseTimer();
            this.clearAutoSubmitTimer();
            this.answerInput.disabled = true;
            this.pauseBtn.textContent = 'Resume';
            this.problemElement.textContent = 'Game Paused';
        } else {
            this.startTimer();
            this.answerInput.disabled = false;
            this.answerInput.focus();
            this.pauseBtn.textContent = 'Pause';
            this.problemElement.textContent = this.gameState.currentProblem.problemText;
        }
    }

    resetGame() {
        this.gameState.isPlaying = false;
        this.gameState.isPaused = false;
        this.gameState.timeRemaining = this.settings.duration;
        this.gameState.currentScore = 0;
        this.gameState.totalProblems = 0;
        this.gameState.correctAnswers = 0;
        this.gameState.currentProblem = null;

        this.pauseTimer();
        this.clearAutoSubmitTimer();
        this.answerInput.disabled = true;
        this.answerInput.value = '';
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Pause';
        this.problemElement.textContent = 'Click Start to begin';

        this.updateDisplay();
    }

    generateNewProblem() {
        this.gameState.currentProblem = this.generateProblem();
        this.problemElement.textContent = this.gameState.currentProblem.problemText;
        this.answerInput.value = '';
    }

    handleAnswerInput() {
        this.clearAutoSubmitTimer();
        
        const inputValue = this.answerInput.value.trim();
        
        // Don't auto-submit if input is empty
        if (inputValue === '') return;
        
        // Check if the answer looks complete
        const shouldAutoSubmit = this.shouldAutoSubmitAnswer(inputValue);
        
        if (shouldAutoSubmit && this.settings.autoSubmitDelay > 0) {
            // Auto-submit after the configured delay
            this.autoSubmitTimer = setTimeout(() => {
                if (this.gameState.isPlaying && !this.gameState.isPaused) {
                    this.checkAnswer();
                }
            }, this.settings.autoSubmitDelay);
        }
    }

    shouldAutoSubmitAnswer(inputValue) {
        const userAnswer = parseInt(inputValue);
        if (isNaN(userAnswer)) return false;
        
        // Estimate expected answer range based on the current problem
        const expectedAnswer = this.gameState.currentProblem.answer;
        const expectedLength = Math.abs(expectedAnswer).toString().length;
        const inputLength = Math.abs(userAnswer).toString().length;
        
        // Auto-submit if:
        // 1. Input length matches expected length, OR
        // 2. Input length is >= 3 digits, OR
        // 3. User has typed more than the expected answer (likely done)
        return inputLength >= expectedLength || 
               inputLength >= 3 || 
               Math.abs(userAnswer) > Math.abs(expectedAnswer) * 10;
    }

    clearAutoSubmitTimer() {
        if (this.autoSubmitTimer) {
            clearTimeout(this.autoSubmitTimer);
            this.autoSubmitTimer = null;
        }
    }

    checkAnswer() {
        this.clearAutoSubmitTimer();
        
        const userAnswer = parseInt(this.answerInput.value);
        
        if (isNaN(userAnswer)) return;

        this.gameState.totalProblems++;

        if (userAnswer === this.gameState.currentProblem.answer) {
            this.gameState.correctAnswers++;
            this.gameState.currentScore++;
            this.showAnswerFeedback(true);
        } else {
            this.showAnswerFeedback(false);
        }

        this.updateDisplay();
        this.generateNewProblem();
    }

    showAnswerFeedback(isCorrect) {
        this.answerInput.classList.remove('correct', 'incorrect');
        this.answerInput.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        setTimeout(() => {
            this.answerInput.classList.remove('correct', 'incorrect');
        }, 500);
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.gameState.timeRemaining--;
            this.updateDisplay();

            if (this.gameState.timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    pauseTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    endGame() {
        this.gameState.isPlaying = false;
        this.pauseTimer();
        this.clearAutoSubmitTimer();
        this.answerInput.disabled = true;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;

        const accuracy = this.gameState.totalProblems > 0 
            ? Math.round((this.gameState.correctAnswers / this.gameState.totalProblems) * 100) 
            : 0;

        // Save game statistics
        this.saveGameResult({
            score: this.gameState.currentScore,
            accuracy: accuracy,
            problemsSolved: this.gameState.totalProblems,
            duration: this.settings.duration,
            date: new Date().toISOString()
        });

        // Show game over modal
        this.showGameOverModal();
        this.updateStatistics();
    }

    showGameOverModal() {
        const accuracy = this.gameState.totalProblems > 0 
            ? Math.round((this.gameState.correctAnswers / this.gameState.totalProblems) * 100) 
            : 0;

        this.finalScoreElement.textContent = this.gameState.currentScore;
        this.finalAccuracyElement.textContent = `${accuracy}%`;
        this.problemsSolvedElement.textContent = this.gameState.totalProblems;

        this.gameOverModal.classList.remove('hidden');
    }

    hideModal() {
        this.gameOverModal.classList.add('hidden');
    }

    showPanel(panelType) {
        if (panelType === 'settings') {
            this.settingsPanel.classList.remove('hidden');
            this.statsPanel.classList.add('hidden');
        } else if (panelType === 'stats') {
            this.statsPanel.classList.remove('hidden');
            this.settingsPanel.classList.add('hidden');
            this.updateStatistics();
        }
    }

    hidePanel(panelType) {
        if (panelType === 'settings') {
            this.settingsPanel.classList.add('hidden');
        } else if (panelType === 'stats') {
            this.statsPanel.classList.add('hidden');
        }
    }

    updateDisplay() {
        this.timerElement.textContent = this.gameState.timeRemaining;
        this.scoreElement.textContent = this.gameState.currentScore;
        
        const accuracy = this.gameState.totalProblems > 0 
            ? Math.round((this.gameState.correctAnswers / this.gameState.totalProblems) * 100) 
            : 0;
        this.accuracyElement.textContent = `${accuracy}%`;

        // Update timer color based on remaining time
        if (this.gameState.timeRemaining <= 10 && this.gameState.isPlaying) {
            this.timerElement.style.color = '#ff6b6b';
        } else {
            this.timerElement.style.color = '#667eea';
        }
    }

    loadStatistics() {
        const saved = localStorage.getItem('zetamac-statistics');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            totalGames: 0,
            bestScore: 0,
            totalScore: 0,
            bestAccuracy: 0,
            recentGames: []
        };
    }

    saveGameResult(gameResult) {
        this.statistics.totalGames++;
        this.statistics.totalScore += gameResult.score;
        
        if (gameResult.score > this.statistics.bestScore) {
            this.statistics.bestScore = gameResult.score;
        }
        
        if (gameResult.accuracy > this.statistics.bestAccuracy) {
            this.statistics.bestAccuracy = gameResult.accuracy;
        }

        // Add to recent games (keep last 10)
        this.statistics.recentGames.unshift(gameResult);
        if (this.statistics.recentGames.length > 10) {
            this.statistics.recentGames.pop();
        }

        localStorage.setItem('zetamac-statistics', JSON.stringify(this.statistics));
    }

    updateStatistics() {
        this.totalGamesElement.textContent = this.statistics.totalGames;
        this.bestScoreElement.textContent = this.statistics.bestScore;
        
        const avgScore = this.statistics.totalGames > 0 
            ? Math.round(this.statistics.totalScore / this.statistics.totalGames) 
            : 0;
        this.avgScoreElement.textContent = avgScore;
        this.bestAccuracyElement.textContent = `${this.statistics.bestAccuracy}%`;

        this.updateRecentGamesList();
    }

    updateRecentGamesList() {
        if (this.statistics.recentGames.length === 0) {
            this.recentGamesElement.innerHTML = '<p class="no-games">No games played yet</p>';
            return;
        }

        this.recentGamesElement.innerHTML = this.statistics.recentGames
            .map(game => {
                const date = new Date(game.date).toLocaleDateString();
                const time = new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return `
                    <div class="game-entry">
                        <div class="game-date">${date} ${time}</div>
                        <div class="game-stats">
                            <span>Score: ${game.score}</span>
                            <span>Accuracy: ${game.accuracy}%</span>
                        </div>
                    </div>
                `;
            })
            .join('');
    }

    exportStatisticsToCSV() {
        const avgScore = this.statistics.totalGames > 0 
            ? Math.round(this.statistics.totalScore / this.statistics.totalGames) 
            : 0;

        // Create CSV content
        let csvContent = 'Zetamac Tracker Statistics Export\n';
        csvContent += `Export Date,${new Date().toISOString()}\n\n`;
        
        // Summary statistics
        csvContent += 'Summary Statistics\n';
        csvContent += 'Metric,Value\n';
        csvContent += `Total Games,${this.statistics.totalGames}\n`;
        csvContent += `Best Score,${this.statistics.bestScore}\n`;
        csvContent += `Average Score,${avgScore}\n`;
        csvContent += `Best Accuracy,${this.statistics.bestAccuracy}%\n\n`;
        
        // Individual game data
        csvContent += 'Individual Games\n';
        csvContent += 'Date,Time,Score,Accuracy,Problems Solved,Duration (seconds)\n';
        
        this.statistics.recentGames.forEach(game => {
            const gameDate = new Date(game.date);
            const date = gameDate.toLocaleDateString();
            const time = gameDate.toLocaleTimeString();
            
            csvContent += `${date},${time},${game.score},${game.accuracy}%,${game.problemsSolved},${game.duration}\n`;
        });

        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `zetamac_statistics_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    clearStatistics() {
        if (confirm('Are you sure you want to clear all statistics? This cannot be undone.')) {
            this.statistics = {
                totalGames: 0,
                bestScore: 0,
                totalScore: 0,
                bestAccuracy: 0,
                recentGames: []
            };
            localStorage.removeItem('zetamac-statistics');
            this.updateStatistics();
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ZetamacGame();
}); 