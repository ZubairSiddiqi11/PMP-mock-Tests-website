// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    initializeDashboard();
});

// Initialize Dashboard
function initializeDashboard() {
    loadUserData();
    setupExamCountdown();
    loadStatistics();
    initializeChart();
    loadRecentActivity();
    setupEventListeners();
}

// Load User Data
function loadUserData() {
    const user = auth.getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('userFirstName').textContent = user.firstName;
    }
}

// Setup Exam Countdown
function setupExamCountdown() {
    const user = auth.getCurrentUser();
    if (user && user.examDate) {
        const examDate = new Date(user.examDate);
        updateCountdown(examDate);
        
        // Update countdown every second
        setInterval(() => updateCountdown(examDate), 1000);
    } else {
        document.getElementById('countdownText').textContent = 'No exam date set';
    }
}

// Update Countdown
function updateCountdown(examDate) {
    const now = new Date();
    const diff = examDate - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        let countdownText = '';
        if (days > 0) {
            countdownText = `${days} day${days > 1 ? 's' : ''} to exam`;
        } else if (hours > 0) {
            countdownText = `${hours} hour${hours > 1 ? 's' : ''} to exam`;
        } else {
            countdownText = 'Exam today!';
        }
        
        document.getElementById('countdownText').textContent = countdownText;
    } else {
        document.getElementById('countdownText').textContent = 'Exam date passed';
    }
}

// Load Statistics
function loadStatistics() {
    const progress = auth.getUserProgress();
    const testHistory = auth.getUserTestHistory();
    
    // Update stats
    document.getElementById('averageScore').textContent = `${progress.averageScore || 0}%`;
    document.getElementById('testsCompleted').textContent = progress.totalTests || 0;
    document.getElementById('studyTime').textContent = formatStudyTime(progress.studyTime || 0);
    document.getElementById('streak').textContent = calculateStreak();
    
    // Update knowledge areas
    updateKnowledgeAreas(testHistory);
}

// Format Study Time
function formatStudyTime(minutes) {
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Calculate Streak
function calculateStreak() {
    const testHistory = auth.getUserTestHistory();
    if (testHistory.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Sort tests by date (most recent first)
    const sortedTests = testHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (let i = 0; i < sortedTests.length; i++) {
        const testDate = new Date(sortedTests[i].date);
        testDate.setHours(0, 0, 0, 0);
        
        const dayDiff = Math.floor((today - testDate) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === streak) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

// Update Knowledge Areas
function updateKnowledgeAreas(testHistory) {
    if (testHistory.length === 0) return;
    
    const areas = {
        'People': { total: 0, correct: 0 },
        'Process': { total: 0, correct: 0 },
        'Business Environment': { total: 0, correct: 0 },
        'Agile': { total: 0, correct: 0 },
        'Hybrid': { total: 0, correct: 0 }
    };
    
    // Calculate percentages from test history
    testHistory.forEach(test => {
        if (test.breakdown) {
            Object.keys(test.breakdown).forEach(area => {
                if (areas[area]) {
                    areas[area].total += test.breakdown[area].total || 0;
                    areas[area].correct += test.breakdown[area].correct || 0;
                }
            });
        }
    });
    
    // Update UI
    const knowledgeList = document.querySelector('.knowledge-list');
    if (knowledgeList) {
        knowledgeList.innerHTML = '';
        
        Object.keys(areas).forEach(area => {
            const percentage = areas[area].total > 0 
                ? Math.round((areas[area].correct / areas[area].total) * 100)
                : 0;
            
            const color = percentage >= 70 ? 'var(--success-color)' :
                         percentage >= 50 ? 'var(--warning-color)' :
                         'var(--danger-color)';
            
            const item = document.createElement('div');
            item.className = 'knowledge-item';
            item.innerHTML = `
                <div class="knowledge-header">
                    <span>${area}</span>
                    <span class="percentage">${percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%; background: ${color};"></div>
                </div>
            `;
            knowledgeList.appendChild(item);
        });
    }
}

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    const testHistory = auth.getUserTestHistory();
    
    // Prepare data for last 7 tests
    const recentTests = testHistory.slice(-7);
    const labels = recentTests.map((test, index) => `Test ${index + 1}`);
    const scores = recentTests.map(test => test.score || 0);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.length > 0 ? labels : ['No Data'],
            datasets: [{
                label: 'Score %',
                data: scores.length > 0 ? scores : [0],
                borderColor: 'rgb(102, 126, 234)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Score: ${context.parsed.y}%`;
                        }
                    }
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

// Load Recent Activity
function loadRecentActivity() {
    const testHistory = auth.getUserTestHistory();
    const activityList = document.getElementById('activityList');
    
    if (!activityList) return;
    
    if (testHistory.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="activity-content">
                    <h4>No activity yet</h4>
                    <p>Start taking tests to see your activity here</p>
                    <span class="activity-time">Now</span>
                </div>
            </div>
        `;
        return;
    }
    
    // Display recent activities
    activityList.innerHTML = '';
    const recentActivities = testHistory.slice(-3).reverse();
    
    recentActivities.forEach(test => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const icon = test.score >= 70 ? 'check-circle' : 
                    test.score >= 50 ? 'exclamation-circle' : 
                    'times-circle';
        
        const iconColor = test.score >= 70 ? 'var(--success-color)' :
                         test.score >= 50 ? 'var(--warning-color)' :
                         'var(--danger-color)';
        
        activityItem.innerHTML = `
            <div class="activity-icon" style="background: ${iconColor};">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${test.type || 'Practice Test'}</h4>
                <p>Score: ${test.score}% - ${test.questions || 0} questions</p>
                <span class="activity-time">${formatTimeAgo(test.date)}</span>
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

// Format Time Ago
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 7) {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Add any dashboard-specific event listeners here
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Quick Test Functions
function startQuickTest() {
    window.location.href = 'test.html?mode=quick';
}

function startFullExam() {
    window.location.href = 'test.html?mode=full';
}

function practiceWeakAreas() {
    window.location.href = 'topic-practice.html?focus=weak';
}

function reviewMistakes() {
    window.location.href = 'review.html';
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.logout();
    }
}
