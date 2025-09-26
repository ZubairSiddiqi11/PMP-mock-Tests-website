// Results Page JavaScript
let testResults = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load test results
    loadTestResults();
});

// Load Test Results
function loadTestResults() {
    // Get results from session storage
    const resultsData = sessionStorage.getItem('testResults');
    
    if (!resultsData) {
        // If no results, redirect to dashboard
        window.location.href = 'dashboard.html';
        return;
    }
    
    testResults = JSON.parse(resultsData);
    
    // Display results
    displayResults();
    
    // Create charts
    createCharts();
    
    // Load historical data
    loadHistoricalData();
    
    // Generate recommendations
    generateRecommendations();
    
    // Celebrate if passed
    if (testResults.score >= 70) {
        celebrateSuccess();
    }
}

// Display Results
function displayResults() {
    // Animate score circle
    const score = testResults.score;
    const scoreCircle = document.getElementById('scoreCircle');
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (score / 100) * circumference;
    
    // Set color based on score
    let strokeColor = '';
    let scoreLabel = '';
    let resultMessage = '';
    let resultDescription = '';
    
    if (score >= 70) {
        strokeColor = '#22c55e'; // Success color
        scoreLabel = 'PASSED';
        resultMessage = 'Congratulations! You Passed!';
        resultDescription = 'Great job! You\'re well on your way to PMP certification success.';
        scoreCircle.classList.add('pass-indicator');
    } else if (score >= 60) {
        strokeColor = '#f97316'; // Warning color
        scoreLabel = 'BORDERLINE';
        resultMessage = 'Almost There!';
        resultDescription = 'You\'re close to passing. Focus on your weak areas and try again.';
        scoreCircle.classList.add('borderline-indicator');
    } else {
        strokeColor = '#ef4444'; // Danger color
        scoreLabel = 'NEEDS IMPROVEMENT';
        resultMessage = 'Keep Practicing!';
        resultDescription = 'Don\'t give up! Review the materials and focus on understanding the concepts.';
        scoreCircle.classList.add('fail-indicator');
    }
    
    scoreCircle.style.stroke = strokeColor;
    scoreCircle.style.strokeDashoffset = offset;
    
    // Update score text
    document.getElementById('scoreValue').textContent = score + '%';
    document.getElementById('scoreLabel').textContent = scoreLabel;
    document.getElementById('resultMessage').textContent = resultMessage;
    document.getElementById('resultDescription').textContent = resultDescription;
    
    // Update statistics
    document.getElementById('correctAnswers').textContent = testResults.correct;
    document.getElementById('incorrectAnswers').textContent = testResults.total - testResults.correct;
    
    // Format time
    const minutes = Math.floor(testResults.timeSpent / 60);
    const seconds = testResults.timeSpent % 60;
    document.getElementById('timeSpent').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Update breakdown
    displayBreakdown();
}

// Display Breakdown
function displayBreakdown() {
    const breakdownList = document.getElementById('breakdownList');
    breakdownList.innerHTML = '';
    
    const domains = Object.keys(testResults.breakdown);
    const colors = {
        'People': '#667eea',
        'Process': '#764ba2',
        'Business Environment': '#f59e0b',
        'Agile': '#10b981',
        'Hybrid': '#06b6d4'
    };
    
    domains.forEach(domain => {
        const data = testResults.breakdown[domain];
        if (data.total === 0) return;
        
        const percentage = Math.round((data.correct / data.total) * 100);
        const item = document.createElement('div');
        item.className = 'breakdown-item';
        
        let scoreClass = '';
        if (percentage >= 70) scoreClass = 'success';
        else if (percentage >= 50) scoreClass = 'warning';
        else scoreClass = 'danger';
        
        item.innerHTML = `
            <div class="breakdown-info">
                <div class="breakdown-icon" style="background: ${colors[domain]};">
                    <i class="fas fa-chart-pie"></i>
                </div>
                <div class="breakdown-text">
                    <h4>${domain}</h4>
                    <p>${data.correct} out of ${data.total} correct</p>
                </div>
            </div>
            <div class="breakdown-score">
                <span class="breakdown-percentage ${scoreClass}">${percentage}%</span>
                <span class="breakdown-ratio">${data.correct}/${data.total}</span>
            </div>
        `;
        
        breakdownList.appendChild(item);
    });
}

// Create Charts
function createCharts() {
    // Domain Performance Chart
    const domainCtx = document.getElementById('domainChart');
    if (domainCtx) {
        const domains = Object.keys(testResults.breakdown);
        const scores = domains.map(domain => {
            const data = testResults.breakdown[domain];
            return data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        });
        
        new Chart(domainCtx, {
            type: 'radar',
            data: {
                labels: domains,
                datasets: [{
                    label: 'Your Score',
                    data: scores,
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: 'rgb(102, 126, 234)',
                    pointBackgroundColor: 'rgb(102, 126, 234)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(102, 126, 234)'
                }, {
                    label: 'Passing Score',
                    data: [70, 70, 70, 70, 70],
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderColor: 'rgb(34, 197, 94)',
                    pointBackgroundColor: 'rgb(34, 197, 94)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(34, 197, 94)',
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Load Historical Data
function loadHistoricalData() {
    const testHistory = auth.getUserTestHistory();
    
    if (testHistory.length > 0) {
        // Calculate statistics
        const scores = testHistory.map(test => test.score);
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        const bestScore = Math.max(...scores);
        const testsTaken = testHistory.length;
        
        // Calculate improvement
        let improvement = 0;
        if (testHistory.length > 1) {
            const previousScore = testHistory[testHistory.length - 2].score;
            improvement = testResults.score - previousScore;
        }
        
        // Update UI
        document.getElementById('avgScore').textContent = avgScore + '%';
        document.getElementById('bestScore').textContent = bestScore + '%';
        document.getElementById('testsTaken').textContent = testsTaken;
        
        const improvementEl = document.getElementById('improvement');
        improvementEl.textContent = (improvement >= 0 ? '+' : '') + improvement + '%';
        improvementEl.className = improvement >= 0 ? 'positive' : 'negative';
        
        // Create progress chart
        createProgressChart(testHistory);
    } else {
        // First test
        document.getElementById('avgScore').textContent = testResults.score + '%';
        document.getElementById('bestScore').textContent = testResults.score + '%';
        document.getElementById('testsTaken').textContent = '1';
        document.getElementById('improvement').textContent = 'First Test';
    }
}

// Create Progress Chart
function createProgressChart(testHistory) {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    // Get last 10 tests
    const recentTests = testHistory.slice(-10);
    const labels = recentTests.map((test, index) => `Test ${index + 1}`);
    const scores = recentTests.map(test => test.score);
    
    // Add current test
    labels.push(`Test ${labels.length + 1}`);
    scores.push(testResults.score);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Test Scores',
                data: scores,
                borderColor: 'rgb(102, 126, 234)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Passing Score',
                data: new Array(labels.length).fill(70),
                borderColor: 'rgb(34, 197, 94)',
                borderDash: [5, 5],
                borderWidth: 2,
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Generate Recommendations
function generateRecommendations() {
    const recommendationsGrid = document.getElementById('recommendationsGrid');
    recommendationsGrid.innerHTML = '';
    
    const recommendations = [];
    
    // Analyze each domain
    Object.keys(testResults.breakdown).forEach(domain => {
        const data = testResults.breakdown[domain];
        if (data.total === 0) return;
        
        const percentage = Math.round((data.correct / data.total) * 100);
        
        if (percentage < 50) {
            recommendations.push({
                domain: domain,
                level: 'urgent',
                icon: 'fa-exclamation-triangle',
                title: `Critical: ${domain}`,
                text: `You scored ${percentage}% in ${domain}. This area needs immediate attention. Consider reviewing all fundamental concepts and taking focused practice tests.`
            });
        } else if (percentage < 70) {
            recommendations.push({
                domain: domain,
                level: 'moderate',
                icon: 'fa-info-circle',
                title: `Improve: ${domain}`,
                text: `You scored ${percentage}% in ${domain}. You're close to the passing threshold. Focus on understanding key concepts and practice more questions.`
            });
        } else {
            recommendations.push({
                domain: domain,
                level: 'good',
                icon: 'fa-check-circle',
                title: `Strong: ${domain}`,
                text: `Great job! You scored ${percentage}% in ${domain}. Maintain this level while helping to improve other areas.`
            });
        }
    });
    
    // Sort by urgency
    recommendations.sort((a, b) => {
        const order = { urgent: 0, moderate: 1, good: 2 };
        return order[a.level] - order[b.level];
    });
    
    // Display recommendations
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = `recommendation-card ${rec.level}`;
        card.innerHTML = `
            <div class="recommendation-header">
                <i class="fas ${rec.icon}"></i>
                <h4>${rec.title}</h4>
            </div>
            <p>${rec.text}</p>
        `;
        recommendationsGrid.appendChild(card);
    });
}

// Celebrate Success
function celebrateSuccess() {
    // Create confetti
    const container = document.getElementById('confetti-container');
    const colors = ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// Action Functions
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

function startNewTest() {
    window.location.href = 'test.html?mode=full';
}

function reviewAnswers() {
    // Store test data for review page
    sessionStorage.setItem('reviewData', JSON.stringify(testResults));
    window.location.href = 'review.html';
}

function practiceWeakAreas() {
    // Find weakest domain
    let weakestDomain = null;
    let lowestScore = 100;
    
    Object.keys(testResults.breakdown).forEach(domain => {
        const data = testResults.breakdown[domain];
        if (data.total > 0) {
            const percentage = (data.correct / data.total) * 100;
            if (percentage < lowestScore) {
                lowestScore = percentage;
                weakestDomain = domain;
            }
        }
    });
    
    if (weakestDomain) {
        window.location.href = `topic-practice.html?topic=${encodeURIComponent(weakestDomain)}`;
    } else {
        window.location.href = 'topic-practice.html';
    }
}

function shareResults() {
    const shareText = `I just scored ${testResults.score}% on my PMP practice test! 🎉 Preparing for success with Skill Up Consultant Services.`;
    
    if (navigator.share) {
        navigator.share({
            title: 'PMP Test Results',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Copy to clipboard
        navigator.clipboard.writeText(shareText);
        showNotification('Results copied to clipboard!', 'success');
    }
}

function downloadReport() {
    // In a real application, this would generate a PDF
    showNotification('Report download will be available soon!', 'info');
}

// Notification function
function showNotification(message, type) {
    if (window.mainApp && window.mainApp.showNotification) {
        window.mainApp.showNotification(message, type);
    }
}
