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
const corridorList = document.getElementById('corridor-list');
const insightChart = document.getElementById('insight-chart');
const insightTicker = document.getElementById('insight-ticker');
const adminTabs = document.querySelectorAll('[data-admin-tab]');
const adminTable = document.getElementById('admin-table');
const adminBroadcast = document.getElementById('admin-broadcast');
const adminStatus = document.getElementById('admin-status');
let adminStatusTimer;
const firstAdminKey = 'travetic-first-admin';

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

const adminData = {
  requests: {
    columns: [
      { label: 'Client', key: 'client' },
      { label: 'Journey', key: 'journey' },
      { label: 'Budget', key: 'budget' },
      { label: 'ETA', key: 'eta' },
      { label: 'Status', key: 'status' },
    ],
    rows: [
      {
        client: 'Lila & Dev',
        journey: 'Ladakh heli traverse',
        budget: '₹4.4L',
        eta: '18 min',
        status: 'Ops reviewing',
        tone: 'warn',
      },
      {
        client: 'Studio Areté',
        journey: 'Lisbon terrace interlude',
        budget: '₹2.1L',
        eta: '44 min',
        status: 'Awaiting documents',
        tone: 'warn',
      },
      {
        client: 'Anaya team',
        journey: 'Tokyo neon kitchens',
        budget: '₹3.6L',
        eta: '1h 12m',
        status: 'Chef confirmed',
        tone: 'ok',
      },
      {
        client: 'Harper Collective',
        journey: 'Kerala restorative',
        budget: '₹2.8L',
        eta: '2h 05m',
        status: 'Auto quoted',
        tone: 'ok',
      },
    ],
  },
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

const getBadgeClass = (tone) => {
  if (tone === 'hot') return 'badge badge--hot';
  if (tone === 'watch') return 'badge badge--watch';
  if (tone === 'cool') return 'badge badge--cool';
  return 'badge';
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

const formatAdminCell = (key, value, row) => {
  if (key === 'status') {
    const toneClass = row.tone === 'warn' ? 'chip chip--warn' : 'chip chip--ok';
    return `<span class="${toneClass}">${value}</span>`;
  }
  return value;
};

const renderAdminTable = (key = 'requests') => {
  if (!adminTable) return;
  const dataset = adminData[key];
  if (!dataset) return;
  const head = dataset.columns.map((column) => `<th scope="col">${column.label}</th>`).join('');
  const body = dataset.rows
    .map(
      (row) =>
        `<tr>${dataset.columns
          .map((column) => `<td>${formatAdminCell(column.key, row[column.key], row)}</td>`)
          .join('')}</tr>`,
    )
    .join('');
  adminTable.innerHTML = `
    <table>
      <thead><tr>${head}</tr></thead>
      <tbody>${body}</tbody>
    </table>
  `;
};

const setActiveAdminTab = (key) => {
  if (!adminTabs.length) return;
  adminTabs.forEach((tab) => {
    const isActive = tab.dataset.adminTab === key;
    tab.classList.toggle('active', isActive);
  });
  renderAdminTable(key);
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

renderCorridorList();
renderInsightChart();
renderInsightTicker();

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
      (() => {
        const email = formData.get('signupEmail');
        const phone = formData.get('phone');
        const volume = formData.get('volume');
        const storedAdmin = localStorage.getItem(firstAdminKey);
        if (!storedAdmin) {
          localStorage.setItem(
            firstAdminKey,
            JSON.stringify({
              studio,
              email,
              phone,
              volume,
              assignedAt: new Date().toISOString(),
            }),
          );
          return `${studio} is live as Travetic OS admin. You have full control while we dial in the first experience—expect credentials + concierge reach-out within 12 hours.`;
        }
        return `${studio} is queued for activation. Our team will share login credentials on email + WhatsApp within 12 hours.`;
      })(),
      'success',
    );
  });
}

if (adminTabs.length) {
  const defaultTab = adminTabs[0]?.dataset?.adminTab ?? 'requests';
  setActiveAdminTab(defaultTab);
  adminTabs.forEach((tab) => {
    tab.addEventListener('click', () => setActiveAdminTab(tab.dataset.adminTab));
  });
} else {
  renderAdminTable();
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
