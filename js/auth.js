// Authentication JavaScript
const AUTH_KEY = 'pmp_users';
const CURRENT_USER_KEY = 'currentUser';
const AUTH_TOKEN_KEY = 'authToken';

// Initialize authentication data
function initAuth() {
    if (!localStorage.getItem(AUTH_KEY)) {
        localStorage.setItem(AUTH_KEY, JSON.stringify([]));
    }
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem(AUTH_KEY) || '[]');
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Generate token
        const token = generateToken();
        
        // Store current user and token
        const userData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            examDate: user.examDate
        };
        
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        localStorage.setItem(AUTH_KEY, JSON.stringify(users));
        
        showNotification('Login successful! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showNotification('Invalid email or password', 'error');
        shakeForm('loginForm');
    }
}

// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const examDate = document.getElementById('examDate').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    // Validate password strength
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem(AUTH_KEY) || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateUserId(),
        firstName,
        lastName,
        email,
        password, // In production, this should be hashed
        examDate,
        registeredDate: new Date().toISOString(),
        progress: {
            totalTests: 0,
            averageScore: 0,
            studyTime: 0,
            weakAreas: [],
            strongAreas: []
        },
        testHistory: [],
        settings: {
            notifications: true,
            dailyReminder: true,
            theme: 'light'
        }
    };
    
    // Add user to database
    users.push(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
    
    // Auto login
    const userData = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        examDate: newUser.examDate
    };
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    localStorage.setItem(AUTH_TOKEN_KEY, generateToken());
    
    showNotification('Account created successfully! Redirecting to dashboard...', 'success');
    
    // Initialize user data
    initializeUserData(newUser.id);
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Initialize User Data
function initializeUserData(userId) {
    // Create initial test data structure
    const testData = {
        userId: userId,
        questions: [],
        customTests: [],
        flashcards: [],
        dailyChallenges: []
    };
    
    localStorage.setItem(`user_data_${userId}`, JSON.stringify(testData));
}

// Generate User ID
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Generate Token
function generateToken() {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 20);
}

// Check if user is authenticated
function isAuthenticated() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return !!(token && user);
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

// Update user profile
function updateUserProfile(updates) {
    const users = JSON.parse(localStorage.getItem(AUTH_KEY) || '[]');
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem(AUTH_KEY, JSON.stringify(users));
            
            // Update current user session
            const updatedUserData = {
                ...currentUser,
                ...updates
            };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUserData));
            
            return true;
        }
    }
    return false;
}

// Update user progress
function updateUserProgress(progressData) {
    const users = JSON.parse(localStorage.getItem(AUTH_KEY) || '[]');
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].progress = {
                ...users[userIndex].progress,
                ...progressData
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(users));
            return true;
        }
    }
    return false;
}

// Add test to history
function addTestToHistory(testResult) {
    const users = JSON.parse(localStorage.getItem(AUTH_KEY) || '[]');
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            if (!users[userIndex].testHistory) {
                users[userIndex].testHistory = [];
            }
            users[userIndex].testHistory.push({
                ...testResult,
                date: new Date().toISOString()
            });
            
            // Update progress stats
            const history = users[userIndex].testHistory;
            const totalTests = history.length;
            const averageScore = history.reduce((sum, test) => sum + test.score, 0) / totalTests;
            
            users[userIndex].progress.totalTests = totalTests;
            users[userIndex].progress.averageScore = Math.round(averageScore);
            
            localStorage.setItem(AUTH_KEY, JSON.stringify(users));
            return true;
        }
    }
    return false;
}

// Get user test history
function getUserTestHistory() {
    const users = JSON.parse(localStorage.getItem(AUTH_KEY) || '[]');
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        const user = users.find(u => u.id === currentUser.id);
        return user ? user.testHistory || [] : [];
    }
    return [];
}

// Get user progress
function getUserProgress() {
    const users = JSON.parse(localStorage.getItem(AUTH_KEY) || '[]');
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        const user = users.find(u => u.id === currentUser.id);
        return user ? user.progress || {} : {};
    }
    return {};
}

// Shake form animation for errors
function shakeForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return {
        score: strength,
        level: strengthLevels[Math.min(strength - 1, 5)]
    };
}

// Session management
function checkSession() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
        return false;
    }
    
    // Check token expiry (simple implementation)
    const tokenParts = token.split('_');
    const tokenTime = parseInt(tokenParts[1]);
    const currentTime = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
    
    if (currentTime - tokenTime > sessionDuration) {
        // Session expired
        logout();
        return false;
    }
    
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    window.location.href = 'index.html';
}

// Initialize auth on page load
initAuth();

// Export functions for use in other scripts
window.auth = {
    isAuthenticated,
    getCurrentUser,
    updateUserProfile,
    updateUserProgress,
    addTestToHistory,
    getUserTestHistory,
    getUserProgress,
    checkSession,
    logout
};
