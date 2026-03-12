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
const ctaForm = document.querySelector('.cta-form');
const ctaFeedback = document.getElementById('cta-feedback');
const authSuccess = document.getElementById('auth-success');
const corridorList = document.getElementById('corridor-list');
const insightChart = document.getElementById('insight-chart');
const insightTicker = document.getElementById('insight-ticker');
const adminTabs = document.querySelectorAll('[data-admin-tab]');
const adminTable = document.getElementById('admin-table');
const adminBroadcast = document.getElementById('admin-broadcast');
const adminStatus = document.getElementById('admin-status');
const adminTokenInput = document.getElementById('admin-token-input');
const adminTokenSubmit = document.getElementById('admin-token-submit');
const adminTokenMessage = document.getElementById('admin-token-message');
const adminBookingCount = document.getElementById('admin-booking-count');

const API_ROOT = '/api';
let adminStatusTimer;
let adminTokenValue = '';
let bookingsCache = [];

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

const corridorData = [
  {
    route: 'Lisbon → Azores',
    change: '+32% YoY searches',
    note: 'Micro-stays surging for late spring',
    tone: 'hot',
    status: 'Hot',
  },
  {
    route: 'Osaka → Sapporo',
    change: '+21% seat holds',
    note: 'Sakura tail demand',
    tone: 'hot',
    status: 'Hot',
  },
  {
    route: 'Kochi → Ladakh',
    change: '+12% charter asks',
    note: 'Pre-monsoon buffers request',
    tone: 'watch',
    status: 'Watch',
  },
  {
    route: 'Reykjavík → Faroe',
    change: '-5% week over week',
    note: 'Storm delays easing',
    tone: 'cool',
    status: 'Cooling',
  },
];

const chartData = [
  {
    route: 'Patagonia sky trail',
    value: 84,
    detail: 'Crew ready',
  },
  {
    route: 'Ladakh heli traverse',
    value: 72,
    detail: 'Ops scaling',
  },
  {
    route: 'Tokyo neon kitchens',
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
  'Visas moving faster for Japan 10-day stays',
  'Atacama observatory reopening 2 April',
  '75 EV SUVs released in Rajasthan window',
  'Lisbon rooftops capped at 40 guests per slot',
  'Andaman seaplane maintenance lock from 3–5 April',
];

const adminStaticTables = {
  inventory: {
    columns: [
      { label: 'Asset', key: 'asset' },
      { label: 'Window', key: 'window' },
      { label: 'Held by', key: 'holder' },
      { label: 'Status', key: 'status' },
    ],
    rows: [
      {
        asset: 'Patagonia ice fields lodge',
        window: '12–18 May',
        holder: 'Travetic',
        status: 'Expires in 6h',
        tone: 'warn',
      },
      {
        asset: 'Lisbon design loft',
        window: '18–20 Jun',
        holder: 'Studio Areté',
        status: 'Shared pool',
        tone: 'ok',
      },
      {
        asset: 'Atacama slow camp',
        window: '2–7 Jul',
        holder: 'Reserva partner',
        status: 'Awaiting deposit',
        tone: 'warn',
      },
      {
        asset: 'Osaka vinyl speakeasy',
        window: 'Daily 9pm',
        holder: 'Travetic',
        status: 'Guaranteed',
        tone: 'ok',
      },
      {
        asset: 'Udaipur jagir dinner',
        window: 'All May',
        holder: 'Travetic',
        status: 'Invite only',
        tone: 'ok',
      },
    ],
  },
  team: {
    columns: [
      { label: 'Name', key: 'name' },
      { label: 'Role', key: 'role' },
      { label: 'Shift', key: 'shift' },
      { label: 'Status', key: 'status' },
    ],
    rows: [
      {
        name: 'Sara Patel',
        role: 'Concierge lead',
        shift: '08:00 – 16:00 IST',
        status: 'On shift',
        tone: 'ok',
      },
      {
        name: 'Jonas Rindt',
        role: 'Inventory ops',
        shift: 'Remote EU',
        status: 'Monitoring',
        tone: 'ok',
      },
      {
        name: 'Mira Rao',
        role: 'Deal Desk',
        shift: '12:00 – 20:00 IST',
        status: 'On break',
        tone: 'warn',
      },
      {
        name: 'Leo Martins',
        role: 'Impact verifier',
        shift: 'Rotating',
        status: 'On call',
        tone: 'ok',
      },
    ],
  },
};

const bookingColumns = [
  { label: 'Client', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Message', key: 'message' },
  { label: 'Status', key: 'status' },
  { label: 'Actions', key: 'actions' },
];

const getBadgeClass = (tone) => {
  if (tone === 'hot') return 'badge badge--hot';
  if (tone === 'watch') return 'badge badge--watch';
  if (tone === 'cool') return 'badge badge--cool';
  if (tone === 'warn') return 'chip chip--warn';
  if (tone === 'ok') return 'chip chip--ok';
  return 'badge';
};

const setAdminStatusMessage = (message, state = 'success') => {
  if (!adminStatus) return;
  adminStatus.textContent = message;
  adminStatus.style.color = state === 'error' ? '#ffb199' : 'var(--accent-2)';
  if (adminStatusTimer) {
    clearTimeout(adminStatusTimer);
  }
  adminStatusTimer = setTimeout(() => {
    adminStatus.textContent = '';
  }, 5000);
};

const setAdminTokenMessage = (message, state = 'success') => {
  if (!adminTokenMessage) return;
  adminTokenMessage.textContent = message;
  adminTokenMessage.style.color = state === 'error' ? '#ffb199' : 'var(--accent-2)';
};

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
          <span class="${getBadgeClass(item.tone)}">${item.status}</span>
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

const renderAdminTable = (dataset) => {
  if (!adminTable || !dataset) return;
  const head = dataset.columns.map((column) => `<th scope="col">${column.label}</th>`).join('');
  const body = dataset.rows
    .map(
      (row) =>
        `<tr>${dataset.columns
          .map((column) => {
            if (column.key === 'actions') {
              return `<td><button class="btn btn-outline btn-mini" data-booking-id="${row.id}">Approve</button></td>`;
            }
            const value = row[column.key] ?? '—';
            if (column.key === 'status') {
              const toneClass = getBadgeClass(row[column.key] === 'approved' ? 'ok' : 'warn');
              return `<td><span class="${toneClass}">${value}</span></td>`;
            }
            return `<td>${value}</td>`;
          })
          .join('')}</tr>`,
    )
    .join('');
  adminTable.innerHTML = `
    <table>
      <thead><tr>${head}</tr></thead>
      <tbody>${body}</tbody>
    </table>
  `;
  const actionButtons = adminTable.querySelectorAll('[data-booking-id]');
  actionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      handleApproveBooking(button.dataset.bookingId);
    });
  });
};

const renderBookingsTable = () => {
  const rows = bookingsCache.map((booking) => ({
    id: booking._id,
    name: booking.name,
    email: booking.email,
    message: booking.message?.slice(0, 50) || 'Booking request',
    status: booking.status,
  }));
  renderAdminTable({ columns: bookingColumns, rows });
  if (adminBookingCount) {
    adminBookingCount.textContent = `${rows.length} request(s) loaded`;
  }
};

const setActiveAdminTab = (key) => {
  if (!adminTabs.length) return;
  adminTabs.forEach((tab) => {
    const isActive = tab.dataset.adminTab === key;
    tab.classList.toggle('active', isActive);
  });
  if (key === 'requests') {
    renderBookingsTable();
    return;
  }
  renderAdminTable(adminStaticTables[key]);
};

const renderAdminTables = () => {
  const defaultTab = adminTabs[0]?.dataset?.adminTab ?? 'requests';
  setActiveAdminTab(defaultTab);
  adminTabs.forEach((tab) =>
    tab.addEventListener('click', () => setActiveAdminTab(tab.dataset.adminTab)),
  );
};

const fetchBookings = async () => {
  if (!adminTokenValue) {
    setAdminTokenMessage('Enter your admin secret to load bookings.', 'error');
    return;
  }
  try {
    const response = await fetch(`${API_ROOT}/bookings`, {
      headers: {
        Authorization: `Bearer ${adminTokenValue}`,
      },
    });
    if (!response.ok) {
      throw new Error('Invalid token');
    }
    const { bookings } = await response.json();
    bookingsCache = bookings;
    setAdminTokenMessage('Bookings refreshed.', 'success');
    renderBookingsTable();
  } catch (error) {
    setAdminTokenMessage('Unable to load bookings.', 'error');
  }
};

const handleApproveBooking = async (id) => {
  if (!adminTokenValue) {
    setAdminTokenMessage('Add the admin secret before approving.', 'error');
    return;
  }
  try {
    await fetch(`${API_ROOT}/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminTokenValue}`,
      },
      body: JSON.stringify({ status: 'approved' }),
    });
    await fetchBookings();
    setAdminStatusMessage('Booking approved and synced.', 'success');
  } catch (error) {
    setAdminStatusMessage('Approval failed. Check token or network.', 'error');
  }
};

const handleAdminTokenSubmit = () => {
  const token = adminTokenInput?.value.trim();
  if (!token) {
    setAdminTokenMessage('Token cannot be blank.', 'error');
    return;
  }
  adminTokenValue = token;
  fetchBookings();
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
    setCtaFeedback('There was a problem submitting your request. Try again in a second.', 'error');
  }
};

const claimAdminSeat = async (payload) => {
  try {
    const response = await fetch(`${API_ROOT}/admin/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch (error) {
    return { alreadyClaimed: false };
  }
};

const showAuthFeedback = (message, state = 'success') => {
  if (!authSuccess) return;
  authSuccess.textContent = message;
  authSuccess.dataset.state = state;
};

const handleSignup = async (event) => {
  event.preventDefault();
  if (!signupForm) return;
  const formData = new FormData(signupForm);
  const payload = {
    studio: formData.get('studio') || 'your studio',
    email: formData.get('signupEmail'),
    phone: formData.get('phone'),
    volume: formData.get('volume'),
  };
  const claim = await claimAdminSeat(payload);
  if (claim.alreadyClaimed) {
    showAuthFeedback(`${payload.studio} is queued for activation. Our team will share credentials within 12 hours.`, 'success');
    return;
  }
  showAuthFeedback(
    `${payload.studio} is live as Travetic OS admin. Expect credentials + concierge reach-out within 12 hours.`,
    'success',
  );
};

const handleLogin = (event) => {
  event.preventDefault();
  if (!loginForm) return;
  const formData = new FormData(loginForm);
  const email = formData.get('loginEmail');
  showAuthFeedback(`Welcome back, ${email || 'partner'}! Redirecting to your dashboard.`, 'success');
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

  if (output) {
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
  }
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

const scrollToAuth = () => {
  authSection?.scrollIntoView({ behavior: 'smooth' });
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

if (authButtons.length) {
  authButtons.forEach((button) => {
    button.addEventListener('click', scrollToAuth);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

if (signupForm) {
  signupForm.addEventListener('submit', handleSignup);
}

if (ctaForm) {
  ctaForm.addEventListener('submit', handleBookingSubmit);
}

if (adminTokenSubmit) {
  adminTokenSubmit.addEventListener('click', handleAdminTokenSubmit);
}

if (adminBroadcast) {
  adminBroadcast.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(adminBroadcast);
    const message = (formData.get('broadcast') || '').trim();
    if (!message) {
      setAdminStatusMessage('Add a quick note before sending the bulletin.', 'error');
      return;
    }
    setAdminStatusMessage(`Bulletin sent to 11 agents: "${message}"`);
    adminBroadcast.reset();
  });
}

renderCorridorList();
renderInsightChart();
renderInsightTicker();
renderAdminTables();
