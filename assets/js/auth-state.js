import { onAuthStateChange } from './firebase-config.js';

// Global auth state management
document.addEventListener('DOMContentLoaded', function() {
    const userStatus = document.getElementById('user-status');
    const cartCount = document.getElementById('cart-count');
    
    // Listen for auth state changes
    onAuthStateChange((user) => {
        if (user && userStatus) {
            // User is logged in - show first name and link to profile
            const firstName = user.displayName?.split(' ')[0] || 'Profil';
            userStatus.textContent = firstName;
            
            // Update navigation link to profile
            const loginLink = userStatus.closest('a');
            if (loginLink) {
                loginLink.href = 'profile.html';
                loginLink.title = 'Mein Profil verwalten';
            }
            
            // Add user indicator icon
            const userIcon = loginLink.querySelector('svg use');
            if (userIcon) {
                userIcon.setAttribute('href', '#user-check');
            }
            
        } else if (userStatus) {
            // User is logged out - show login text and link to login
            userStatus.textContent = 'Login';
            
            // Update navigation link to login
            const loginLink = userStatus.closest('a');
            if (loginLink) {
                loginLink.href = 'login.html';
                loginLink.title = 'Anmelden';
            }
            
            // Reset user icon
            const userIcon = loginLink.querySelector('svg use');
            if (userIcon) {
                userIcon.setAttribute('href', '#user');
            }
        }
    });
});
