// Profile Page JS

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }
  loadProfile();
});

function loadProfile() {
  const user = auth.getCurrentUser();
  if (!user) return;

  // Header
  document.getElementById('profileName').textContent = `${user.firstName} ${user.lastName}`;
  document.getElementById('profileEmail').textContent = user.email;

  // Form fields
  document.getElementById('firstNameInput').value = user.firstName || '';
  document.getElementById('lastNameInput').value = user.lastName || '';
  document.getElementById('emailInput').value = user.email || '';
  document.getElementById('examDateInput').value = user.examDate || '';

  // Preferences (stored in users table)
  const users = JSON.parse(localStorage.getItem('pmp_users') || '[]');
  const full = users.find(u => u.id === user.id);
  const settings = (full && full.settings) || { notifications: true, dailyReminder: true, theme: 'light' };

  document.getElementById('themeSelect').value = settings.theme || 'light';
  document.getElementById('notificationsSelect').value = String(!!settings.notifications);
  document.getElementById('dailyReminderSelect').value = String(!!settings.dailyReminder);
}

function saveProfile() {
  const updates = {
    firstName: document.getElementById('firstNameInput').value.trim(),
    lastName: document.getElementById('lastNameInput').value.trim(),
    email: document.getElementById('emailInput').value.trim(),
    examDate: document.getElementById('examDateInput').value
  };

  // Persist core profile
  const ok = auth.updateUserProfile(updates);

  // Persist preferences in users table
  const users = JSON.parse(localStorage.getItem('pmp_users') || '[]');
  const current = auth.getCurrentUser();
  const idx = users.findIndex(u => u.id === current.id);
  if (idx !== -1) {
    users[idx].settings = {
      ...(users[idx].settings || {}),
      theme: document.getElementById('themeSelect').value,
      notifications: document.getElementById('notificationsSelect').value === 'true',
      dailyReminder: document.getElementById('dailyReminderSelect').value === 'true'
    };
    localStorage.setItem('pmp_users', JSON.stringify(users));
  }

  if (ok) {
    window.mainApp.showNotification('Profile saved successfully', 'success');
    loadProfile();
  } else {
    window.mainApp.showNotification('Failed to save profile', 'error');
  }
}

function updatePassword() {
  const newPass = document.getElementById('newPassword').value;
  const confirm = document.getElementById('confirmNewPassword').value;
  if (!newPass) {
    window.mainApp.showNotification('Enter a new password', 'warning');
    return;
  }
  if (newPass !== confirm) {
    window.mainApp.showNotification('Passwords do not match', 'error');
    return;
  }
  if (newPass.length < 8) {
    window.mainApp.showNotification('Password must be at least 8 characters', 'error');
    return;
  }
  const users = JSON.parse(localStorage.getItem('pmp_users') || '[]');
  const user = auth.getCurrentUser();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx].password = newPass;
    localStorage.setItem('pmp_users', JSON.stringify(users));
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
    window.mainApp.showNotification('Password updated', 'success');
  }
}

function goBack() {
  history.back();
}
