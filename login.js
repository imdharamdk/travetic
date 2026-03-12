const customerLoginForm = document.getElementById('customer-login-form');
const customerSignupForm = document.getElementById('customer-signup-form');
const partnerLoginForm = document.getElementById('partner-login-form');
const partnerSignupForm = document.getElementById('partner-signup-form');
const customerFeedback = document.getElementById('customer-feedback');
const partnerFeedback = document.getElementById('partner-feedback');
const magicForm = document.getElementById('magic-verify-form');
const magicFeedback = document.getElementById('magic-feedback');
const API_ROOT = (window.TRAVETIC_CONFIG?.apiRoot) ?? '/api';

const setFeedback = (element, message, variant = 'success') => {
  if (!element) return;
  element.textContent = message;
  element.dataset.state = variant;
};

const sendMagicLink = async (email, role, feedbackElement) => {
  try {
    const response = await fetch(`${API_ROOT}/magic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    if (!response.ok) throw new Error();
    const { token } = await response.json();
    setFeedback(
      feedbackElement,
      `Magic token sent to ${email}. Use the code ${token} to verify your login.`,
      'success',
    );
  } catch (error) {
    setFeedback(feedbackElement, 'Unable to send the magic link right now. Try again soon.', 'error');
  }
};

const handleMagicVerify = async (event) => {
  event.preventDefault();
  if (!magicForm) return;
  const formData = new FormData(magicForm);
  const payload = {
    email: formData.get('magicEmail'),
    token: formData.get('magicToken'),
  };
  try {
    const response = await fetch(`${API_ROOT}/magic/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error();
    const { role } = await response.json();
    setFeedback(magicFeedback, `Magic token verified. Welcome ${role}!`, 'success');
    magicForm.reset();
  } catch (error) {
    setFeedback(magicFeedback, 'Invalid or expired token. Request a new one.', 'error');
  }
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
    partnerSignupForm.reset();
  } catch (error) {
    setFeedback(partnerFeedback, 'Unable to register right now. Please try again later.', 'error');
  }
};

if (customerLoginForm) {
  customerLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = new FormData(customerLoginForm).get('customerLoginEmail');
    sendMagicLink(email, 'customer', customerFeedback);
  });
}

if (partnerLoginForm) {
  partnerLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = new FormData(partnerLoginForm).get('partnerLoginEmail');
    sendMagicLink(email, 'partner', partnerFeedback);
  });
}

if (customerSignupForm) {
  customerSignupForm.addEventListener('submit', handleCustomerSignup);
}

if (partnerSignupForm) {
  partnerSignupForm.addEventListener('submit', handlePartnerSignup);
}

if (magicForm) {
  magicForm.addEventListener('submit', handleMagicVerify);
}

if (typeof window !== 'undefined' && window.document) {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
