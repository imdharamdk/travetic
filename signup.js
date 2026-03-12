const customerForm = document.getElementById('signup-customer-form');
const partnerForm = document.getElementById('signup-partner-form');
const customerFeedback = document.getElementById('signup-customer-feedback');
const partnerFeedback = document.getElementById('signup-partner-feedback');
const API_ROOT = (window.TRAVETIC_CONFIG?.apiRoot) ?? '/api';

const setFeedback = (element, message, variant = 'success') => {
  if (!element) return;
  element.textContent = message;
  element.dataset.state = variant;
};

const handleCustomerSignup = async (event) => {
  event.preventDefault();
  if (!customerForm) return;
  const formData = new FormData(customerForm);
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
    setFeedback(customerFeedback, 'Concept queued—our travel desk will reply within 48 hours.', 'success');
    customerForm.reset();
  } catch (error) {
    setFeedback(customerFeedback, 'We could not save your request. Try again in a moment.', 'error');
  }
};

const handlePartnerSignup = async (event) => {
  event.preventDefault();
  if (!partnerForm) return;
  const formData = new FormData(partnerForm);
  const payload = {
    studio: formData.get('studio'),
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
    const message = alreadyClaimed
      ? 'An admin already exists. You are queued for activation.'
      : 'Studio confirmed as admin. Expect credentials + CRM access shortly.';
    setFeedback(partnerFeedback, message, 'success');
    partnerForm.reset();
  } catch (error) {
    setFeedback(partnerFeedback, 'Unable to register right now. Please try again later.', 'error');
  }
};

if (customerForm) {
  customerForm.addEventListener('submit', handleCustomerSignup);
}

if (partnerForm) {
  partnerForm.addEventListener('submit', handlePartnerSignup);
}

if (typeof window !== 'undefined') {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
