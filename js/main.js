// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupScrollEffects();
    setupAnimations();
    checkAuthStatus();
}

// Navigation Setup
function setupNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Active link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    });
}

// Scroll Effects
function setupScrollEffects() {
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'var(--white)';
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

// Setup Animations
function setupAnimations() {
    // Add animation classes to elements
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('scroll-animate');
    });
    
    const modeCards = document.querySelectorAll('.mode-card');
    modeCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
        card.classList.add('scroll-animate');
    });
}

// Modal Functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchToSignup() {
    closeModal('loginModal');
    showSignupModal();
}

function switchToLogin() {
    closeModal('signupModal');
    showLoginModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Demo Function
function showDemo() {
    showNotification('Demo video coming soon!', 'info');
}

// Test Mode Functions
function startFullExam() {
    if (checkAuth()) {
        window.location.href = 'test.html?mode=full';
    }
}

function startCustomTest() {
    if (checkAuth()) {
        window.location.href = 'custom-test.html';
    }
}

function startTopicPractice() {
    if (checkAuth()) {
        window.location.href = 'topic-practice.html';
    }
}

// Check Authentication
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        showNotification('Please login to access this feature', 'warning');
        showLoginModal();
        return false;
    }
    return true;
}

// Check Authentication Status
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        const userData = JSON.parse(user);
        updateUIForLoggedInUser(userData);
    }
}

// Update UI for Logged In User
function updateUIForLoggedInUser(userData) {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        // Replace login/signup buttons with user menu
        const loginBtn = navMenu.querySelector('.btn-login');
        const signupBtn = navMenu.querySelector('.btn-signup');
        
        if (loginBtn && signupBtn) {
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            
            // Add user menu
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <button class="btn btn-primary" onclick="goToDashboard()">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </button>
                <div class="user-dropdown">
                    <img src="images/avatar.svg" alt="User" class="user-avatar">
                    <span>${userData.firstName}</span>
                    <i class="fas fa-chevron-down"></i>
                    <div class="dropdown-content">
                        <a href="profile.html"><i class="fas fa-user"></i> Profile</a>
                        <a href="progress.html"><i class="fas fa-chart-line"></i> Progress</a>
                        <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            `;
            navMenu.appendChild(userMenu);
        }
    }
}

// Go to Dashboard
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

// Logout Function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Contact Form Handler
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Simulate form submission
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    form.reset();
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                background: var(--primary-color);
                color: white;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 3000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            }
            .notification.success { background: var(--success-color); }
            .notification.error { background: var(--danger-color); }
            .notification.warning { background: var(--warning-color); }
            .notification.info { background: var(--primary-color); }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                margin-left: auto;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Get Notification Icon
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

// Utility Functions
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function calculatePercentage(value, total) {
    return Math.round((value / total) * 100);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Export functions for use in other scripts
window.mainApp = {
    showNotification,
    formatTime,
    calculatePercentage,
    shuffleArray,
    checkAuth,
    logout
};
