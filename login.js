const loginForm = document.getElementById('site-login-form');
const loginFeedback = document.getElementById('login-feedback');
const API_ROOT = (window.TRAVETIC_CONFIG?.apiRoot) ?? '/api';

const setFeedback = (element, message, variant = 'success') => {
  if (!element) return;
  element.textContent = message;
  element.dataset.state = variant;
};

const handleLogin = (event) => {
  event.preventDefault();
  if (!loginForm) return;
  const formData = new FormData(loginForm);
  const email = formData.get('loginEmail');
  setFeedback(loginFeedback, `Welcome back, ${email || 'partner'}! Redirecting to Travetic OS.`, 'success');
};

if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

if (typeof window !== 'undefined' && window.document) {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
