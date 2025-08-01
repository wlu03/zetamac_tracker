# Zetamac Tracker

A modern, customizable mental arithmetic trainer inspired by Zetamac, with comprehensive progress tracking and personalization features.

## Features

### 🎯 Core Gameplay
- **Timed Mental Math**: Solve arithmetic problems as quickly as possible
- **Real-time Scoring**: Track your score and accuracy during gameplay
- **Multiple Operations**: Addition, subtraction, multiplication, and division
- **Visual Feedback**: Immediate feedback on correct/incorrect answers

### ⚙️ Customization Options
- **Difficulty Levels**: Easy (1-10), Medium (1-50), Hard (1-100), Expert (1-999)
- **Game Duration**: 60, 120, 180, or 300 seconds
- **Operation Types**: Choose which math operations to include
- **Advanced Settings**: Allow negative results, custom number ranges

### 📊 Progress Tracking
- **Session Statistics**: Real-time score and accuracy tracking
- **Historical Data**: Best scores, average performance, total games played
- **Recent Games**: Track your last 10 game sessions with detailed stats
- **Data Persistence**: All statistics saved locally in your browser

### 🎨 Modern Design
- **Responsive UI**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Animations**: Smooth transitions and visual feedback
- **Accessibility**: Keyboard navigation and screen reader friendly
- **Glass Morphism**: Modern, translucent design elements

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. Click "Start Game" to begin with default settings
3. Type your answers and press Enter or let auto-submit handle it
4. Try to solve as many problems as possible before time runs out!

### Customizing Your Experience
1. Click the "Settings" button to open the settings panel
2. Adjust game duration (60-300 seconds)
3. Select your preferred difficulty level
4. Choose which math operations to include
5. Enable/disable negative results
6. Settings are automatically saved for your next session

### Tracking Your Progress
1. Click "Statistics" to view your performance data
2. See your best scores, average performance, and accuracy
3. Review your recent game sessions
4. Clear statistics if you want to start fresh

### Game Controls
- **Start Game**: Begin a new timed session
- **Pause/Resume**: Pause the timer and game
- **Reset**: Stop current game and return to start screen
- **Enter Key**: Submit your answer (when input is focused)
- **Auto-Submit**: Answers are checked automatically as you type

## Technical Details

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support**: iOS Safari, Chrome Mobile, Samsung Internet
- **Local Storage**: Uses browser's local storage for data persistence

### Files Structure
```
zetamac_tracker/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling
├── script.js           # Game logic and functionality
└── README.md           # This documentation
```

### Data Storage
- All settings and statistics are stored locally in your browser
- No data is sent to external servers
- Clear browser data to reset all progress

## Game Mechanics

### Scoring System
- **+1 point** for each correct answer
- **No penalty** for incorrect answers
- **Real-time accuracy** calculation (correct ÷ total × 100)

### Difficulty Levels
- **Easy**: Numbers 1-10, simple operations
- **Medium**: Numbers 1-50, balanced challenge
- **Hard**: Numbers 1-100, increased complexity
- **Expert**: Numbers 1-999, maximum challenge

### Problem Generation
- **Smart Algorithm**: Ensures division problems have whole number answers
- **Balanced Mix**: Random selection from enabled operation types
- **Negative Results**: Optional setting for subtraction problems
- **Range Scaling**: Multiplication and division ranges adjust by difficulty

## Tips for Better Performance

### Improving Speed
- Practice mental math shortcuts (e.g., 9×7 = 9×10 - 9×3)
- Focus on pattern recognition for multiplication tables
- Use estimation to quickly eliminate obviously wrong answers

### Accuracy Tips
- Take a moment to double-check before submitting
- Practice specific operation types that challenge you
- Start with easier difficulty and gradually increase

### Training Strategies
- Set daily practice goals (e.g., 10 games per day)
- Focus on consistency rather than peak performance
- Use statistics to identify areas for improvement

## Customization Ideas

### Personal Challenges
- Set target scores for different difficulty levels
- Try single-operation sessions to focus on weak areas
- Experiment with different time limits

### Study Modes
- Use shorter sessions (60s) for quick practice
- Longer sessions (300s) for endurance training
- Custom operation mixes for specific math topics

## Browser Requirements

### Minimum Requirements
- JavaScript enabled
- Local Storage support
- CSS3 support for animations

### Recommended
- Modern browser (last 2 years)
- Screen resolution: 320px+ width
- Stable internet connection (for font loading)

## Troubleshooting

### Common Issues
- **Statistics not saving**: Check if local storage is enabled
- **Poor performance**: Try reducing browser extensions
- **Display issues**: Ensure browser zoom is at 100%

### Reset Options
- **Clear Statistics**: Use button in Statistics panel
- **Reset Settings**: Clear browser local storage
- **Fresh Start**: Delete localStorage data for this domain

## Privacy & Data

### Data Collection
- **No tracking**: No analytics or user tracking
- **Local only**: All data stays on your device
- **No accounts**: No registration or login required

### Data Export
Currently, there's no built-in export feature, but all data is stored in browser localStorage and can be accessed via developer tools if needed.

---

**Enjoy practicing your mental math skills with Zetamac Tracker!** 🧮✨ 