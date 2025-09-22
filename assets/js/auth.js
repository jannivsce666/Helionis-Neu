// Authentication System for Helionis Website
// Handles user login, registration, and session management with Firebase integration

// Initialize Firebase Configuration (to be replaced with actual config)
const firebaseConfig = {
    apiKey: "AIzaSyDlQFqmGGBIrttrC6Ids-bppFpeOOfWXVU",
    authDomain: "helionis.firebaseapp.com",
    databaseURL: "https://helionis-default-rtdb.firebaseio.com",
    projectId: "helionis",
    storageBucket: "helionis.firebasestorage.app",
    messagingSenderId: "112789846576",
    appId: "1:112789846576:web:5a8049942a7c559ca98bf5",
    measurementId: "G-8W0GMB0F73"
};

// Firebase variables (will be initialized when Firebase SDK is loaded)
let auth = null;
let googleProvider = null;

// Initialize Firebase Auth when available
function initializeFirebaseAuth() {
    if (typeof firebase !== 'undefined') {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            auth = firebase.auth();
            googleProvider = new firebase.auth.GoogleAuthProvider();
            
            // Listen for auth state changes
            auth.onAuthStateChanged(handleAuthStateChange);
            
            console.log('Firebase Auth initialized');
        } catch (error) {
            console.warn('Firebase initialization failed, using local auth:', error);
            initializeLocalAuth();
        }
    } else {
        console.warn('Firebase not available, using local authentication');
        initializeLocalAuth();
    }
}

// Fallback local authentication
function initializeLocalAuth() {
    // Check if user is logged in locally
    const user = getCurrentUser();
    if (user) {
        handleAuthStateChange(user);
    }
}

// Handle authentication state changes
function handleAuthStateChange(user) {
    if (user) {
        onUserLoggedIn(user);
    } else {
        onUserLoggedOut();
    }
}

// User logged in callback
function onUserLoggedIn(user) {
    console.log('User logged in:', user.email || user.name);
    
    // Update UI
    updateAuthUI(true, user);
    
    // Save user data locally
    const userData = {
        uid: user.uid || user.id || Date.now().toString(),
        email: user.email,
        name: user.displayName || user.name,
        firstName: user.firstName || user.displayName?.split(' ')[0] || '',
        lastName: user.lastName || user.displayName?.split(' ')[1] || '',
        photoURL: user.photoURL || '',
        loginMethod: user.providerId || 'local',
        lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('helionis_user', JSON.stringify(userData));
    
    // Trigger custom event
    document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userData }));
}

// User logged out callback
function onUserLoggedOut() {
    console.log('User logged out');
    
    // Update UI
    updateAuthUI(false);
    
    // Clear user data
    localStorage.removeItem('helionis_user');
    
    // Trigger custom event
    document.dispatchEvent(new CustomEvent('userLoggedOut'));
}

// Update authentication UI
function updateAuthUI(isLoggedIn, user = null) {
    const navUsername = document.getElementById('nav-username');
    const profileLink = navUsername?.closest('a');
    
    if (isLoggedIn && user) {
        if (navUsername) {
            navUsername.textContent = user.firstName || user.name?.split(' ')[0] || 'Profil';
        }
        if (profileLink) {
            profileLink.href = 'profile.html';
        }
    } else {
        if (navUsername) {
            navUsername.textContent = 'Anmelden';
        }
        if (profileLink) {
            profileLink.href = 'login.html';
        }
    }
    
    // Update auth forms if on login page
    if (window.location.pathname.includes('login.html')) {
        updateLoginPageUI(isLoggedIn);
    }
}

// Update login page UI
function updateLoginPageUI(isLoggedIn) {
    if (isLoggedIn) {
        // Redirect to profile or intended page
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || 'profile.html';
        window.location.href = redirect;
    }
}

// Login with email and password
async function loginWithEmail(email, password) {
    try {
        showAuthLoading(true);
        
        if (auth) {
            // Firebase authentication
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } else {
            // Local authentication (demo mode)
            return await localEmailLogin(email, password);
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: getAuthErrorMessage(error) };
    } finally {
        showAuthLoading(false);
    }
}

// Local email login (demo mode)
async function localEmailLogin(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check local users database
    const users = JSON.parse(localStorage.getItem('helionis_users') || '{}');
    const user = users[email];
    
    if (user && user.password === password) {
        const userData = {
            uid: user.uid,
            email: user.email,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName
        };
        
        onUserLoggedIn(userData);
        return { success: true, user: userData };
    } else {
        return { success: false, error: 'Ungültige E-Mail-Adresse oder Passwort.' };
    }
}

// Register with email and password
async function registerWithEmail(email, password, firstName, lastName) {
    try {
        showAuthLoading(true);
        
        if (auth) {
            // Firebase authentication
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Update profile
            await userCredential.user.updateProfile({
                displayName: `${firstName} ${lastName}`
            });
            
            return { success: true, user: userCredential.user };
        } else {
            // Local registration (demo mode)
            return await localEmailRegister(email, password, firstName, lastName);
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: getAuthErrorMessage(error) };
    } finally {
        showAuthLoading(false);
    }
}

// Local email registration (demo mode)
async function localEmailRegister(email, password, firstName, lastName) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('helionis_users') || '{}');
    
    if (users[email]) {
        return { success: false, error: 'Diese E-Mail-Adresse ist bereits registriert.' };
    }
    
    // Create new user
    const userData = {
        uid: Date.now().toString(),
        email,
        password, // In real app, this should be hashed
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        createdAt: new Date().toISOString()
    };
    
    users[email] = userData;
    localStorage.setItem('helionis_users', JSON.stringify(users));
    
    // Log in user
    const loginData = { ...userData };
    delete loginData.password;
    onUserLoggedIn(loginData);
    
    return { success: true, user: loginData };
}

// Login with Google
async function loginWithGoogle() {
    try {
        showAuthLoading(true);
        
        if (auth && googleProvider) {
            // Firebase Google authentication
            const result = await auth.signInWithPopup(googleProvider);
            return { success: true, user: result.user };
        } else {
            // Demo mode - simulate Google login
            return await demoGoogleLogin();
        }
    } catch (error) {
        console.error('Google login error:', error);
        return { success: false, error: getAuthErrorMessage(error) };
    } finally {
        showAuthLoading(false);
    }
}

// Demo Google login
async function demoGoogleLogin() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userData = {
        uid: 'google_' + Date.now(),
        email: 'demo@google.com',
        name: 'Google Demo User',
        firstName: 'Google',
        lastName: 'User',
        photoURL: '',
        providerId: 'google.com'
    };
    
    onUserLoggedIn(userData);
    return { success: true, user: userData };
}

// Password reset
async function resetPassword(email) {
    try {
        showAuthLoading(true);
        
        if (auth) {
            // Firebase password reset
            await auth.sendPasswordResetEmail(email);
            return { success: true };
        } else {
            // Demo mode
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Password reset email sent to:', email);
            return { success: true };
        }
    } catch (error) {
        console.error('Password reset error:', error);
        return { success: false, error: getAuthErrorMessage(error) };
    } finally {
        showAuthLoading(false);
    }
}

// Sign out user
async function signOutUser() {
    try {
        if (auth) {
            await auth.signOut();
        } else {
            onUserLoggedOut();
        }
        
        // Redirect to home page
        window.location.href = '/';
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

// Check if user is logged in
function isUserLoggedIn() {
    const user = getCurrentUser();
    return user !== null;
}

// Get current user
function getCurrentUser() {
    try {
        const userData = localStorage.getItem('helionis_user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Show/hide loading state
function showAuthLoading(show) {
    const loadingElements = document.querySelectorAll('.auth-loading');
    const submitButtons = document.querySelectorAll('.auth-submit');
    
    loadingElements.forEach(el => {
        el.style.display = show ? 'block' : 'none';
    });
    
    submitButtons.forEach(button => {
        button.disabled = show;
        if (show) {
            button.textContent = 'Lädt...';
        } else {
            // Reset button text based on form type
            if (button.closest('#login-form')) {
                button.textContent = 'Anmelden';
            } else if (button.closest('#register-form')) {
                button.textContent = 'Registrieren';
            } else if (button.closest('#reset-form')) {
                button.textContent = 'Link senden';
            }
        }
    });
}

// Get user-friendly error message
function getAuthErrorMessage(error) {
    const errorMessages = {
        'auth/user-not-found': 'Kein Benutzer mit dieser E-Mail-Adresse gefunden.',
        'auth/wrong-password': 'Falsches Passwort.',
        'auth/email-already-in-use': 'Diese E-Mail-Adresse ist bereits registriert.',
        'auth/weak-password': 'Das Passwort ist zu schwach.',
        'auth/invalid-email': 'Ungültige E-Mail-Adresse.',
        'auth/too-many-requests': 'Zu viele Anmeldeversuche. Versuchen Sie es später erneut.',
        'auth/user-disabled': 'Dieses Benutzerkonto wurde deaktiviert.',
        'auth/popup-closed-by-user': 'Anmeldung wurde abgebrochen.',
        'auth/popup-blocked': 'Pop-up wurde blockiert. Bitte erlauben Sie Pop-ups für diese Seite.'
    };
    
    if (error.code && errorMessages[error.code]) {
        return errorMessages[error.code];
    }
    
    return error.message || 'Ein unbekannter Fehler ist aufgetreten.';
}

// Form submission handlers
function handleLoginForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    if (!email || !password) {
        showAuthMessage('Bitte füllen Sie alle Felder aus.', 'error');
        return;
    }
    
    loginWithEmail(email, password).then(result => {
        if (result.success) {
            showAuthMessage('Erfolgreich angemeldet!', 'success');
        } else {
            showAuthMessage(result.error, 'error');
        }
    });
}

function handleRegisterForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showAuthMessage('Bitte füllen Sie alle Felder aus.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthMessage('Passwörter stimmen nicht überein.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthMessage('Das Passwort muss mindestens 6 Zeichen lang sein.', 'error');
        return;
    }
    
    registerWithEmail(email, password, firstName, lastName).then(result => {
        if (result.success) {
            showAuthMessage('Erfolgreich registriert!', 'success');
        } else {
            showAuthMessage(result.error, 'error');
        }
    });
}

function handleResetForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    
    if (!email) {
        showAuthMessage('Bitte geben Sie Ihre E-Mail-Adresse ein.', 'error');
        return;
    }
    
    resetPassword(email).then(result => {
        if (result.success) {
            showAuthMessage('Passwort-Reset-Link wurde gesendet!', 'success');
            event.target.reset();
        } else {
            showAuthMessage(result.error, 'error');
        }
    });
}

// Show authentication message
function showAuthMessage(message, type = 'info') {
    const messageContainer = document.getElementById('auth-message');
    
    if (messageContainer) {
        const colors = {
            success: 'var(--mystical-green)',
            error: '#e74c3c',
            warning: '#f39c12',
            info: 'var(--silver)'
        };
        
        messageContainer.style.display = 'block';
        messageContainer.style.borderLeftColor = colors[type];
        messageContainer.textContent = message;
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 5000);
        }
    } else if (typeof window.HelionisMain?.showNotification === 'function') {
        window.HelionisMain.showNotification(message, type);
    } else {
        alert(message); // Fallback
    }
}

// Initialize authentication system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase or local auth
    initializeFirebaseAuth();
    
    // Set up form handlers if on login page
    if (window.location.pathname.includes('login.html')) {
        setupLoginPageHandlers();
    }
    
    // Check auth state on protected pages
    checkProtectedPage();
});

// Setup login page handlers
function setupLoginPageHandlers() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const resetForm = document.getElementById('reset-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginForm);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterForm);
    }
    
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetForm);
    }
    
    // Google sign-in button
    const googleButton = document.getElementById('google-signin');
    if (googleButton) {
        googleButton.addEventListener('click', function() {
            loginWithGoogle().then(result => {
                if (result.success) {
                    showAuthMessage('Erfolgreich mit Google angemeldet!', 'success');
                } else {
                    showAuthMessage(result.error, 'error');
                }
            });
        });
    }
}

// Check if current page requires authentication
function checkProtectedPage() {
    const protectedPages = ['profile.html', 'cart.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isUserLoggedIn()) {
        // Store intended destination
        const redirectUrl = window.location.href;
        window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
    }
}

// Form switching functions for login page
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('reset-form').style.display = 'none';
    
    document.querySelectorAll('.form-switch a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector('[onclick="showLoginForm()"]').classList.add('active');
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('reset-form').style.display = 'none';
    
    document.querySelectorAll('.form-switch a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector('[onclick="showRegisterForm()"]').classList.add('active');
}

function showResetForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('reset-form').style.display = 'block';
    
    document.querySelectorAll('.form-switch a').forEach(link => {
        link.classList.remove('active');
    });
}

// Global exports
window.HelionisAuth = {
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    resetPassword,
    signOutUser,
    isUserLoggedIn,
    getCurrentUser,
    showLoginForm,
    showRegisterForm,
    showResetForm
};