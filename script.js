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
const corridorList = document.getElementById('corridor-list');
const insightChart = document.getElementById('insight-chart');
const insightTicker = document.getElementById('insight-ticker');
const ctaForm = document.querySelector('.cta-form');
const ctaFeedback = document.getElementById('cta-feedback');

const API_ROOT = (window.TRAVETIC_CONFIG?.apiRoot) ?? '/api';

const moodMap = {
  'Goan backwaters': {
    title: 'Goan lagoon drift',
    highlights:
      'Floating brunches, villa stays, and fishermen-led sundown sails on the Zuari.',
    flow: 'Sunrise paddles • Slow spa days • Sunset shacks',
  },
  'Rajasthan forts': {
    title: 'Udaipur + Jaigarh retreat',
    highlights:
      'Mewar hospitality, palace dining, and night-time fort walks with torchlit rituals.',
    flow: 'Royal arrival • City strolls • Desert finale',
  },
  'Himalayan highlands': {
    title: 'Spiti + Ladakh highpass circuit',
    highlights:
      'Heli drops, tea house dinners, and sherpa-led canyon hikes that stay flexible.',
    flow: 'Altitude acclimatize • Summit trekkings • Fireside recoveries',
  },
  'Southern islands': {
    title: 'Andaman + Lakshadweep vault',
    highlights:
      'Marine biology tours, guided dives, and chef-on-island tastings with beachside stargazing.',
    flow: 'Marine immersion • Coastal roam • Coral finale',
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
    title: '48 hours in Udaipur',
    description:
      'A founder retreat looping lake-palace dinners, artisan workshops, and concierge spa resets. Download the itinerary + budget notes.',
    action: 'Get the PDF',
    target: '#journal',
  },
  demo: {
    eyebrow: 'Product walkthrough',
    title: 'See Travetic OS in action',
    description:
      'Watch how agencies launch login portals, auto-price INR packages, and trigger concierge nudges inside Travetic OS.',
    action: 'Book walkthrough',
    target: '#canvas',
  },
};

const corridorData = [
  {
    route: 'Goa → Lakshadweep',
    change: '+32% YoY interest',
    note: 'Monsoon-season micro-ships filling fast',
    tone: 'hot',
    status: 'Hot',
  },
  {
    route: 'Delhi → Jaipur',
    change: '+18% heritage bookings',
    note: 'Fort suites cleared for March festivals',
    tone: 'hot',
    status: 'Hot',
  },
  {
    route: 'Kochi → Ladakh',
    change: '+12% charter asks',
    note: 'High-altitude buffering for summer',
    tone: 'watch',
    status: 'Watch',
  },
  {
    route: 'Mumbai → Spiti',
    change: '-4% week over week',
    note: 'Highway maintenance easing delays',
    tone: 'cool',
    status: 'Cooling',
  },
];

const chartData = [
  {
    route: 'Spiti high pass',
    value: 84,
    detail: 'Crew ready',
  },
  {
    route: 'Ladakh heli traverse',
    value: 72,
    detail: 'Ops scaling',
  },
  {
    route: 'Mumbai creative crawl',
    value: 63,
    detail: 'Hold chef slots',
  },
  {
    route: 'Kerala residencies',
    value: 58,
    detail: 'Plenty of seats',
  },
];

const tickerSignals = [
  'New Goa dumpling crawl booking window unlocked',
  'Lahaul high passes see clear skies through April',
  '75 EV SUVs released in Rajasthan window',
  'Udaipur city palace nights capped at 40 per slot',
  'Andaman seaplane maintenance lock from 3–5 April',
];

const setCtaFeedback = (message, state = 'success') => {
  if (!ctaFeedback) return;
  ctaFeedback.textContent = message;
  ctaFeedback.dataset.state = state;
};

const renderCorridorList = () => {
  if (!corridorList) return;
  corridorList.innerHTML = corridorData
    .map(
      (item) => `
        <li>
          <div>
            <strong>${item.route}</strong>
            <span>${item.change} · ${item.note}</span>
          </div>
          <span class="badge badge--${item.tone}">${item.status}</span>
        </li>
      `,
    )
    .join('');
};

const renderInsightChart = () => {
  if (!insightChart) return;
  insightChart.innerHTML = chartData
    .map(
      (item) => `
        <div class="insight-bar">
          <strong>${item.route}</strong>
          <div class="bar-meter" style="--value:${item.value}%"></div>
          <span>${item.detail}</span>
        </div>
      `,
    )
    .join('');
};

const renderInsightTicker = () => {
  if (!insightTicker) return;
  insightTicker.innerHTML = tickerSignals.map((signal) => `<span>${signal}</span>`).join('');
};

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

const updateOutput = () => {
  if (!form || !output) return;
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
        return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(
          undefined,
          { month: 'short', day: 'numeric' },
        )}`;
      })()
    : 'Flexible';

  output.querySelector('h3').textContent = `${moodInfo.title} in ${monthLabel}`;
  const paragraphs = output.querySelectorAll('p');
  if (paragraphs[1]) {
    paragraphs[1].textContent = `${pace} pace with ${travelers || 1} traveler${
      travelers > 1 ? 's' : ''
    }. ${moodInfo.highlights}`;
  }
  const listItems = output.querySelectorAll('ul li');
  if (listItems.length >= 3) {
    listItems[0].innerHTML = `<span>Best window</span>${window}`;
    listItems[1].innerHTML = `<span>Energy flow</span>${moodInfo.flow}`;
    listItems[2].innerHTML = `<span>Impact score</span>${impactCopy[impact]}`;
  }
};

const handleBookingSubmit = async (event) => {
  event.preventDefault();
  if (!ctaForm) return;
  const formData = new FormData(ctaForm);
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };
  try {
    const response = await fetch(`${API_ROOT}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error();
    setCtaFeedback('Concept request received. We will follow up within 48 hours.', 'success');
    ctaForm.reset();
  } catch (error) {
    setCtaFeedback('Unable to send your request right now. Try again in a moment.', 'error');
  }
};

if (form) {
  form.addEventListener('input', updateOutput);
  updateOutput();
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

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

if (ctaForm) {
  ctaForm.addEventListener('submit', handleBookingSubmit);
}

renderCorridorList();
renderInsightChart();
renderInsightTicker();
