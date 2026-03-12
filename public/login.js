const loginForm = document.getElementById('site-login-form');
const signupForm = document.getElementById('site-signup-form');
const loginFeedback = document.getElementById('login-feedback');
const claimFeedback = document.getElementById('claim-feedback');
const API_ROOT = '/api';

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

const handleClaim = async (event) => {
  event.preventDefault();
  if (!signupForm) return;
  const formData = new FormData(signupForm);
  const payload = {
    studio: formData.get('studio') || 'your studio',
    email: formData.get('signupEmail'),
    phone: formData.get('phone'),
    volume: formData.get('volume'),
  };
  try {
    const response = await fetch(`${API_ROOT}/admin/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error();
    const { alreadyClaimed } = await response.json();
    if (alreadyClaimed) {
      setFeedback(claimFeedback, 'An admin already exists. You are queued for activation.', 'success');
      return;
    }
    setFeedback(claimFeedback, 'Studio confirmed as admin. Expect credentials + CRM access shortly.', 'success');
  } catch (error) {
    setFeedback(claimFeedback, 'Unable to claim the admin seat right now. Please try again in a moment.', 'error');
  }
};

if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

if (signupForm) {
  signupForm.addEventListener('submit', handleClaim);
}

if (typeof window !== 'undefined' && window.document) {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
