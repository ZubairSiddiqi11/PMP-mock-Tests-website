// Test Page JavaScript
let testData = {
    mode: 'full',
    questions: [],
    currentQuestion: 0,
    answers: {},
    markedQuestions: new Set(),
    startTime: null,
    timeRemaining: 0,
    timerInterval: null,
    isPaused: false,
    pauseStartTime: null,
    totalPauseTime: 0
};

// Initialize test on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    initializeTest();
});

// Initialize Test
function initializeTest() {
    // Get test mode from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    testData.mode = urlParams.get('mode') || 'full';
    
    // Load questions based on mode
    loadQuestions();
    
    // Initialize UI
    initializeUI();
    
    // Start timer
    startTimer();
    
    // Display first question
    displayQuestion(0);
}

// Load Questions
function loadQuestions() {
    switch(testData.mode) {
        case 'full':
            testData.questions = window.questionFunctions.getFullExamQuestions();
            testData.timeRemaining = 230 * 60; // 230 minutes in seconds
            document.getElementById('testMode').textContent = 'Full Exam Mode';
            break;
        case 'quick':
            testData.questions = window.questionFunctions.getQuickTestQuestions();
            testData.timeRemaining = 30 * 60; // 30 minutes
            document.getElementById('testMode').textContent = 'Quick Test';
            break;
        case 'custom':
            // Prefer a preconfigured custom set from sessionStorage
            try {
                const preset = sessionStorage.getItem('customTestSet');
                if (preset) {
                    const parsed = JSON.parse(preset);
                    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length) {
                        testData.questions = parsed.questions;
                        testData.timeRemaining = typeof parsed.timeSeconds === 'number' ? parsed.timeSeconds : 60 * 60;
                        document.getElementById('testMode').textContent = parsed.label || 'Custom Test';
                        break;
                    }
                }
            } catch (e) {
                // Fallback below
            }
            // Fallback custom generation
            testData.questions = window.questionFunctions.getRandomQuestions(50);
            testData.timeRemaining = 60 * 60; // 60 minutes
            document.getElementById('testMode').textContent = 'Custom Test';
            break;
        default:
            testData.questions = window.questionFunctions.getQuickTestQuestions();
            testData.timeRemaining = 30 * 60;
    }
    
    testData.startTime = new Date();
}

// Initialize UI
function initializeUI() {
    // Update question counts
    document.getElementById('totalQuestions').textContent = testData.questions.length;
    document.getElementById('remainingCount').textContent = testData.questions.length;
    document.querySelector('.nav-stats .total').textContent = testData.questions.length;
    
    // Create question navigation buttons
    createQuestionGrid();
    
    // Update timer display
    updateTimerDisplay();
}

// Create Question Grid
function createQuestionGrid() {
    const grid = document.getElementById('questionGrid');
    grid.innerHTML = '';
    
    testData.questions.forEach((question, index) => {
        const btn = document.createElement('button');
        btn.className = 'question-btn';
        btn.textContent = index + 1;
        btn.onclick = () => navigateToQuestion(index);
        
        if (index === 0) {
            btn.classList.add('current');
        }
        
        grid.appendChild(btn);
    });
}

// Display Question
function displayQuestion(index) {
    if (index < 0 || index >= testData.questions.length) return;
    
    const question = testData.questions[index];
    testData.currentQuestion = index;
    
    // Update question number
    document.getElementById('currentQuestion').textContent = index + 1;
    
    // Update question text
    document.getElementById('questionText').innerHTML = question.question;
    
    // Update answer options
    const optionsContainer = document.getElementById('answerOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, optionIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'answer-option';
        optionDiv.onclick = () => selectAnswer(optionIndex);
        
        // Check if this option is selected
        if (testData.answers[index] === optionIndex) {
            optionDiv.classList.add('selected');
        }
        
        optionDiv.innerHTML = `
            <div class="answer-radio"></div>
            <div class="answer-content">
                <span class="answer-label">${String.fromCharCode(65 + optionIndex)}.</span>
                <span class="answer-text">${option}</span>
            </div>
        `;
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update question grid
    updateQuestionGrid();
    
    // Update mark button
    updateMarkButton();
    
    // Update progress
    updateProgress();
}

// Select Answer
function selectAnswer(optionIndex) {
    testData.answers[testData.currentQuestion] = optionIndex;
    
    // Update UI
    const options = document.querySelectorAll('.answer-option');
    options.forEach((option, index) => {
        if (index === optionIndex) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // Update question button status
    updateQuestionGrid();
    updateProgress();
}

// Clear Answer
function clearAnswer() {
    delete testData.answers[testData.currentQuestion];
    
    // Update UI
    const options = document.querySelectorAll('.answer-option');
    options.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Update question button status
    updateQuestionGrid();
    updateProgress();
}

// Navigate to Question
function navigateToQuestion(index) {
    displayQuestion(index);
}

// Previous Question
function previousQuestion() {
    if (testData.currentQuestion > 0) {
        displayQuestion(testData.currentQuestion - 1);
    }
}

// Next Question
function nextQuestion() {
    if (testData.currentQuestion < testData.questions.length - 1) {
        displayQuestion(testData.currentQuestion + 1);
    }
}

// Toggle Mark
function toggleMark() {
    const currentIndex = testData.currentQuestion;
    
    if (testData.markedQuestions.has(currentIndex)) {
        testData.markedQuestions.delete(currentIndex);
    } else {
        testData.markedQuestions.add(currentIndex);
    }
    
    updateMarkButton();
    updateQuestionGrid();
    updateProgress();
}

// Update Mark Button
function updateMarkButton() {
    const markBtn = document.querySelector('.btn-mark');
    if (testData.markedQuestions.has(testData.currentQuestion)) {
        markBtn.classList.add('marked');
        markBtn.innerHTML = '<i class="fas fa-flag"></i> Marked for Review';
    } else {
        markBtn.classList.remove('marked');
        markBtn.innerHTML = '<i class="far fa-flag"></i> Mark for Review';
    }
}

// Update Navigation Buttons
function updateNavigationButtons() {
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    
    prevBtn.disabled = testData.currentQuestion === 0;
    nextBtn.disabled = testData.currentQuestion === testData.questions.length - 1;
}

// Update Question Grid
function updateQuestionGrid() {
    const buttons = document.querySelectorAll('.question-btn');
    
    buttons.forEach((btn, index) => {
        btn.className = 'question-btn';
        
        if (index === testData.currentQuestion) {
            btn.classList.add('current');
        }
        
        if (testData.answers[index] !== undefined) {
            btn.classList.add('answered');
        }
        
        if (testData.markedQuestions.has(index)) {
            btn.classList.add('marked');
        }
    });
}

// Update Progress
function updateProgress() {
    const answered = Object.keys(testData.answers).length;
    const marked = testData.markedQuestions.size;
    const remaining = testData.questions.length - answered;
    const percentage = (answered / testData.questions.length) * 100;
    
    // Update counts
    document.getElementById('answeredCount').textContent = answered;
    document.getElementById('markedCount').textContent = marked;
    document.getElementById('remainingCount').textContent = remaining;
    document.querySelector('.nav-stats .answered').textContent = answered;
    
    // Update progress circle
    const progressCircle = document.getElementById('progressCircle');
    const circumference = 2 * Math.PI * 54; // radius = 54
    const offset = circumference - (percentage / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    
    document.getElementById('progressPercent').textContent = Math.round(percentage) + '%';
}

// Timer Functions
function startTimer() {
    testData.timerInterval = setInterval(() => {
        if (!testData.isPaused && testData.timeRemaining > 0) {
            testData.timeRemaining--;
            updateTimerDisplay();
            
            // Warning at 5 minutes
            if (testData.timeRemaining === 300) {
                showNotification('5 minutes remaining!', 'warning');
            }
            
            // Auto-submit at 0
            if (testData.timeRemaining === 0) {
                submitTest();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(testData.timeRemaining / 3600);
    const minutes = Math.floor((testData.timeRemaining % 3600) / 60);
    const seconds = testData.timeRemaining % 60;
    
    let display = '';
    if (hours > 0) {
        display = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    document.getElementById('timer').textContent = display;
    
    // Change color based on time remaining
    const timerContainer = document.querySelector('.timer-container');
    if (testData.timeRemaining < 300) {
        timerContainer.style.background = '#fee2e2';
        timerContainer.style.color = '#dc2626';
    } else if (testData.timeRemaining < 600) {
        timerContainer.style.background = '#fed7aa';
        timerContainer.style.color = '#ea580c';
    }
}

// Pause Test
function pauseTest() {
    testData.isPaused = true;
    testData.pauseStartTime = new Date();
    
    // Update pause modal
    const elapsed = Math.floor((new Date() - testData.startTime - testData.totalPauseTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('pauseTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const answered = Object.keys(testData.answers).length;
    document.getElementById('pauseAnswered').textContent = `${answered}/${testData.questions.length}`;
    
    // Show pause modal
    document.getElementById('pauseModal').style.display = 'block';
}

// Resume Test
function resumeTest() {
    if (testData.pauseStartTime) {
        testData.totalPauseTime += new Date() - testData.pauseStartTime;
    }
    testData.isPaused = false;
    document.getElementById('pauseModal').style.display = 'none';
}

// End Test
function endTest() {
    // Update summary
    const answered = Object.keys(testData.answers).length;
    const marked = testData.markedQuestions.size;
    const unanswered = testData.questions.length - answered;
    
    document.getElementById('summaryAnswered').textContent = answered;
    document.getElementById('summaryMarked').textContent = marked;
    document.getElementById('summaryUnanswered').textContent = unanswered;
    
    // Show modal
    document.getElementById('endTestModal').style.display = 'block';
}

// Close End Test Modal
function closeEndTestModal() {
    document.getElementById('endTestModal').style.display = 'none';
}

// Submit Test
function submitTest() {
    // Stop timer
    clearInterval(testData.timerInterval);
    
    // Calculate results
    const results = calculateResults();
    
    // Save test to history
    auth.addTestToHistory(results);
    
    // Store results in session storage for results page
    sessionStorage.setItem('testResults', JSON.stringify(results));
    
    // Redirect to results page
    window.location.href = 'results.html';
}

// Calculate Results
function calculateResults() {
    let correct = 0;
    const breakdown = {
        'People': { total: 0, correct: 0 },
        'Process': { total: 0, correct: 0 },
        'Business Environment': { total: 0, correct: 0 },
        'Agile': { total: 0, correct: 0 },
        'Hybrid': { total: 0, correct: 0 }
    };
    
    testData.questions.forEach((question, index) => {
        const userAnswer = testData.answers[index];
        const isCorrect = userAnswer === question.correct;
        
        if (isCorrect) correct++;
        
        if (breakdown[question.domain]) {
            breakdown[question.domain].total++;
            if (isCorrect) breakdown[question.domain].correct++;
        }
    });
    
    const totalTime = Math.floor((new Date() - testData.startTime - testData.totalPauseTime) / 1000);
    
    return {
        mode: testData.mode,
        score: Math.round((correct / testData.questions.length) * 100),
        correct: correct,
        total: testData.questions.length,
        questions: testData.questions.length,
        answered: Object.keys(testData.answers).length,
        timeSpent: totalTime,
        breakdown: breakdown,
        date: new Date().toISOString(),
        type: testData.mode === 'full' ? 'Full Exam' : testData.mode === 'quick' ? 'Quick Test' : 'Custom Test',
        answers: testData.answers,
        questionsData: testData.questions
    };
}

// Show Marked Questions
function showMarkedQuestions() {
    if (testData.markedQuestions.size === 0) {
        showNotification('No marked questions', 'info');
        return;
    }
    
    // Navigate to first marked question
    const firstMarked = Array.from(testData.markedQuestions)[0];
    navigateToQuestion(firstMarked);
}

// Show Unanswered Questions
function showUnansweredQuestions() {
    const unanswered = [];
    for (let i = 0; i < testData.questions.length; i++) {
        if (testData.answers[i] === undefined) {
            unanswered.push(i);
        }
    }
    
    if (unanswered.length === 0) {
        showNotification('All questions answered!', 'success');
        return;
    }
    
    // Navigate to first unanswered
    navigateToQuestion(unanswered[0]);
}

// Calculator Functions
let calcDisplay = '0';
let calcPrevious = '';
let calcOperation = '';

function toggleCalculator() {
    const modal = document.getElementById('calculatorModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function calcInput(value) {
    if (calcDisplay === '0' && value !== '.') {
        calcDisplay = value;
    } else {
        calcDisplay += value;
    }
    updateCalcDisplay();
}

function calcClear() {
    calcDisplay = '0';
    calcPrevious = '';
    calcOperation = '';
    updateCalcDisplay();
}

function calcDelete() {
    if (calcDisplay.length > 1) {
        calcDisplay = calcDisplay.slice(0, -1);
    } else {
        calcDisplay = '0';
    }
    updateCalcDisplay();
}

function calcEquals() {
    try {
        calcDisplay = eval(calcDisplay).toString();
    } catch (e) {
        calcDisplay = 'Error';
    }
    updateCalcDisplay();
}

function updateCalcDisplay() {
    document.getElementById('calcDisplay').textContent = calcDisplay;
}

// Notification function
function showNotification(message, type) {
    if (window.mainApp && window.mainApp.showNotification) {
        window.mainApp.showNotification(message, type);
    }
}
