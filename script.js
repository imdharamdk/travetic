const form = document.getElementById('canvas-form');
const output = document.getElementById('canvas-output');
const yearEl = document.getElementById('year');
const playcase = document.getElementById('playcase');
const launchDemo = document.getElementById('launch-demo');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const modalEyebrow = document.getElementById('modal-eyebrow');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalAction = document.getElementById('modal-action');
const orbit = document.getElementById('orbit');
const authSection = document.getElementById('auth');
const authButtons = document.querySelectorAll('[data-auth-open]');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authSuccess = document.getElementById('auth-success');

const moodMap = {
  'Mediterranean coasts': {
    title: 'Balearic islands drift',
    highlights:
      'Floating brunches, finca stays, private sail to Formentera and farmhouse dinners.',
    flow: 'Calm arrival • Micro-adventure • Salt-water reset',
  },
  'Nordic design cities': {
    title: 'Copenhagen + Stockholm studio hop',
    highlights:
      'Studio tours, sauna rituals, chef pop-ups, and hidden vinyl bars curated by locals.',
    flow: 'Maker crawl • Nature immersion • Late-night jazz',
  },
  'Highland escapes': {
    title: 'Scottish highlands lodge circuit',
    highlights:
      'Heli drop day hikes, loch kayaking, and chefs bringing zero-mile menus.',
    flow: 'Wild arrival • Summit push • Fireside tasting',
  },
  'Island hopping': {
    title: 'Cyclades luminous arc',
    highlights:
      'Boutique katamaran transfers, mezze labs, sunset ceramics, and underwater photography.',
    flow: 'Sunrise launch • Coastal roaming • Open horizon finale',
  },
};

const impactCopy = {
  1: 'Baseline offsets through clean cookstove funds',
  2: 'Blended offsets + reusable amenity kits',
  3: 'Mangrove restoration with local partners',
  4: 'Regenerative lodging + verified blue carbon',
  5: 'Fully regenerative route + onsite conservation day',
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const modalVariants = {
  caseStudy: {
    eyebrow: 'Case study',
    title: '48 hours in Copenhagen',
    description:
      'A fast-moving founder retreat balancing creative inspiration with deep rest. Download the sample itinerary and budget notes.',
    action: 'Get the PDF',
    target: '#journal',
  },
  demo: {
    eyebrow: 'Product walkthrough',
    title: 'See Travetic OS in action',
    description:
      'Watch how agencies launch login portals, auto-price INR packages, and trigger concierge nudges inside Travetic OS.',
    action: 'Book walkthrough',
    target: '#auth',
  },
};

function updateOutput() {
  const formData = new FormData(form);
  const mood = formData.get('mood');
  const pace = formData.get('pace');
  const monthRaw = formData.get('month');
  const travelers = formData.get('travelerCount');
  const impact = Number(formData.get('impact'));

  const moodInfo = moodMap[mood];
  const monthLabel = monthRaw
    ? (() => {
        const [year, month] = monthRaw.split('-').map(Number);
        const name = monthNames[month - 1] ?? 'Soon';
        return `${name} ${year}`;
      })()
    : 'Soon';

  const window = monthRaw
    ? (() => {
        const date = new Date(`${monthRaw}-01T00:00:00`);
        const start = new Date(date.getTime() + 20 * 24 * 60 * 60 * 1000);
        const end = new Date(start.getTime() + 5 * 24 * 60 * 60 * 1000);
        return `${start.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })} – ${end.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })}`;
      })()
    : 'Flexible';

  output.querySelector('h3').textContent = `${moodInfo.title} in ${monthLabel}`;
  output.querySelectorAll('p')[1].textContent = `${pace} pace with ${
    travelers || 1
  } traveler${travelers > 1 ? 's' : ''}. ${moodInfo.highlights}`;

  const listItems = output.querySelectorAll('ul li');
  listItems[0].innerHTML = `<span>Best window</span>${window}`;
  listItems[1].innerHTML = `<span>Energy flow</span>${moodInfo.flow}`;
  listItems[2].innerHTML = `<span>Impact score</span>${impactCopy[impact]}`;
}

if (form) {
  form.addEventListener('input', updateOutput);
  updateOutput();
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const openModal = (variantKey = 'caseStudy') => {
  if (!modal) return;
  const variant = modalVariants[variantKey] ?? modalVariants.caseStudy;
  if (modalEyebrow) modalEyebrow.textContent = variant.eyebrow;
  if (modalTitle) modalTitle.textContent = variant.title;
  if (modalDescription) modalDescription.textContent = variant.description;
  if (modalAction) {
    modalAction.textContent = variant.action;
    modalAction.dataset.target = variant.target;
  }
  modal.setAttribute('aria-hidden', 'false');
};

const closeModalPanel = () => {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
};

if (playcase) {
  playcase.addEventListener('click', () => openModal('caseStudy'));
}

if (launchDemo) {
  launchDemo.addEventListener('click', () => openModal('demo'));
}

if (modal && closeModal) {
  closeModal.addEventListener('click', closeModalPanel);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModalPanel();
    }
  });
}

if (modalAction) {
  modalAction.addEventListener('click', () => {
    const targetSelector = modalAction.dataset.target;
    if (targetSelector) {
      const targetEl = document.querySelector(targetSelector);
      targetEl?.scrollIntoView({ behavior: 'smooth' });
    }
    closeModalPanel();
  });
}

if (orbit) {
  const parallax = (event) => {
    const { innerWidth, innerHeight } = window;
    const x = (event.clientX / innerWidth - 0.5) * 10;
    const y = (event.clientY / innerHeight - 0.5) * 10;
    orbit.style.transform = `rotate(0deg) translate(${x}px, ${y}px)`;
  };
  window.addEventListener('pointermove', parallax);
}

const scrollToAuth = () => {
  authSection?.scrollIntoView({ behavior: 'smooth' });
};

if (authButtons.length) {
  authButtons.forEach((button) => {
    button.addEventListener('click', scrollToAuth);
  });
}

const showAuthFeedback = (message, state = 'success') => {
  if (!authSuccess) return;
  authSuccess.textContent = message;
  authSuccess.dataset.state = state;
};

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const email = formData.get('loginEmail');
    showAuthFeedback(`Welcome back, ${email || 'partner'}! Redirecting to your dashboard.`, 'success');
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const studio = formData.get('studio') || 'your studio';
    showAuthFeedback(
      `${studio} is queued for activation. Our team will share login credentials on email + WhatsApp within 12 hours.`,
      'success',
    );
  });
}
