const customerLoginForm = document.getElementById('customer-login-form');
const customerSignupForm = document.getElementById('customer-signup-form');
const partnerLoginForm = document.getElementById('partner-login-form');
const partnerSignupForm = document.getElementById('partner-signup-form');
const customerFeedback = document.getElementById('customer-feedback');
const partnerFeedback = document.getElementById('partner-feedback');
const API_ROOT = (window.TRAVETIC_CONFIG?.apiRoot) ?? '/api';

const setFeedback = (element, message, variant = 'success') => {
  if (!element) return;
  element.textContent = message;
  element.dataset.state = variant;
};

const handleLogin = (event, feedbackElement, label) => {
  event.preventDefault();
  if (!feedbackElement) return;
  setFeedback(feedbackElement, `Welcome back, ${label}! Redirecting to Travetic OS.`, 'success');
};

const handleCustomerSignup = async (event) => {
  event.preventDefault();
  if (!customerSignupForm) return;
  const formData = new FormData(customerSignupForm);
  const payload = {
    name: formData.get('customerName'),
    email: formData.get('customerEmail'),
    message: formData.get('customerMessage'),
  };
  try {
    const response = await fetch(`${API_ROOT}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error();
    setFeedback(customerFeedback, 'Thanks for the request—we’ll respond within 48 hours.', 'success');
    customerSignupForm.reset();
  } catch (error) {
    setFeedback(customerFeedback, 'Could not save your request. Please try again in a moment.', 'error');
  }
};

const handlePartnerSignup = async (event) => {
  event.preventDefault();
  if (!partnerSignupForm) return;
  const formData = new FormData(partnerSignupForm);
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
    const successText = alreadyClaimed
      ? 'An admin already exists. You are queued for activation.'
      : 'Studio confirmed as admin. Expect credentials + CRM access shortly.';
    setFeedback(partnerFeedback, successText, 'success');
  } catch (error) {
    setFeedback(partnerFeedback, 'Unable to claim the admin seat right now. Please try again in a moment.', 'error');
  }
};

if (customerLoginForm) {
  customerLoginForm.addEventListener('submit', (event) => handleLogin(event, customerFeedback, 'traveler'));
}

if (partnerLoginForm) {
  partnerLoginForm.addEventListener('submit', (event) => handleLogin(event, partnerFeedback, 'partner'));
}

if (customerSignupForm) {
  customerSignupForm.addEventListener('submit', handleCustomerSignup);
}

if (partnerSignupForm) {
  partnerSignupForm.addEventListener('submit', handlePartnerSignup);
}

if (typeof window !== 'undefined' && window.document) {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
