/**
 * Paradise Clothing - Frontend Authentication Simulation
 * NOTE: This is a client-side localStorage simulation for demonstration
 * purposes only and is not intended for real-world production security.
 *
 * Storage Keys:
 * - "user": stores { name, email, password }
 * - "isLoggedIn": stores "true" | "false"
 */

const USER_STORAGE_KEY = 'user';
const LOGIN_STATE_KEY = 'isLoggedIn';

/**
 * Retrieves the registered user from localStorage
 * @returns {Object|null} { name, email, password }
 */
function getUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Paradise Auth] Error reading user from localStorage', err);
    return null;
  }
}

/**
 * Checks if a user is currently logged in
 * @returns {boolean}
 */
function isLoggedIn() {
  return localStorage.getItem(LOGIN_STATE_KEY) === 'true' && getUser() !== null;
}

/**
 * Simulates user registration and persists credentials in localStorage
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, message: string }}
 */
function registerUser(name, email, password) {
  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = password || '';

  if (!cleanName || cleanName.length < 2) {
    return { success: false, message: 'Please enter a valid full name.' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailPattern.test(cleanEmail)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  if (!cleanPassword || cleanPassword.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters.' };
  }

  const existingUser = getUser();
  if (existingUser && existingUser.email === cleanEmail) {
    return { success: false, message: 'An account with this email already exists. Please sign in.' };
  }

  const user = {
    name: cleanName,
    email: cleanEmail,
    password: cleanPassword
  };

  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return { success: true, message: 'Account created successfully! You can now sign in.' };
  } catch (err) {
    console.error('[Paradise Auth] Registration failed', err);
    return { success: false, message: 'Could not save account details. Please try again.' };
  }
}

/**
 * Simulates login against the registered user in localStorage
 * Strict validation:
 * - No user registered -> "No account found. Please sign up first."
 * - Wrong credentials -> "Invalid credentials."
 * - Correct credentials -> set isLoggedIn = "true"
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, message: string }}
 */
function loginUser(email, password) {
  const registeredUser = getUser();

  // 1. Enforce registration check
  if (!registeredUser) {
    return { success: false, message: 'No account found. Please sign up first.' };
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = password || '';

  // 2. Validate credentials against registered user
  if (registeredUser.email !== cleanEmail || registeredUser.password !== cleanPassword) {
    return { success: false, message: 'Invalid credentials.' };
  }

  // 3. Mark session active
  localStorage.setItem(LOGIN_STATE_KEY, 'true');

  // Update navbar immediately
  updateAuthNavbar();

  // Broadcast event
  window.dispatchEvent(new CustomEvent('auth:updated', {
    detail: { isLoggedIn: true, user: registeredUser }
  }));

  return { success: true, message: 'Login successful! Welcome to Paradise.' };
}

/**
 * Logs out user and clears login session state
 * @returns {{ success: boolean, message: string }}
 */
function logoutUser() {
  localStorage.setItem(LOGIN_STATE_KEY, 'false');

  // Update navbar immediately
  updateAuthNavbar();

  // Broadcast event
  window.dispatchEvent(new CustomEvent('auth:updated', {
    detail: { isLoggedIn: false, user: null }
  }));

  return { success: true, message: 'You have been logged out.' };
}

/**
 * Updates navbar auth link across all pages to reflect logged in/out status
 */
function updateAuthNavbar() {
  const authLinks = document.querySelectorAll('#nav-auth-link');
  const loggedIn = isLoggedIn();
  const user = getUser();

  authLinks.forEach(link => {
    if (loggedIn && user && user.name) {
      const firstName = user.name.split(' ')[0];
      link.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Hi, ${firstName}</span>
      `;
    } else {
      link.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Login</span>
      `;
    }
  });

  // Mobile auth buttons
  const mobileAuthBtns = document.querySelectorAll('.mobile-auth-actions .btn-outline');
  mobileAuthBtns.forEach(mobileAuthBtn => {
    if (loggedIn && user && user.name) {
      const firstName = user.name.split(' ')[0];
      mobileAuthBtn.textContent = `My Account (${firstName})`;
    } else {
      mobileAuthBtn.textContent = 'Sign In / Register';
    }
  });
}

// Global Auth namespace
const Auth = {
  getUser,
  isLoggedIn,
  registerUser,
  loginUser,
  logoutUser,
  updateNavbar: updateAuthNavbar
};

// Sync on cross-tab storage changes
window.addEventListener('storage', (e) => {
  if (e.key === LOGIN_STATE_KEY || e.key === USER_STORAGE_KEY) {
    updateAuthNavbar();
  }
});

console.log('[Paradise] auth.js loaded successfully');
