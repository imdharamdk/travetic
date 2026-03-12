const adminTokenInput = document.getElementById('admin-token-input');
const adminTokenSubmit = document.getElementById('admin-token-submit');
const adminGateInput = document.getElementById('admin-gate-input');
const adminGateButton = document.getElementById('admin-gate-button');
const gateMessage = document.getElementById('admin-gate-message');
const adminGate = document.getElementById('admin-gate');
const tokenMessage = document.getElementById('admin-token-message');
const bookingCountEl = document.getElementById('admin-booking-count');
const bookingTable = document.getElementById('admin-booking-table');
const adminStatus = document.getElementById('admin-status');
const broadcastForm = document.getElementById('admin-broadcast');
const queuePending = document.getElementById('queue-pending');
const queueNotes = document.getElementById('queue-notes');
const queueRecent = document.getElementById('queue-recent');
const adminCount = document.getElementById('admin-count');
const adminNotes = document.getElementById('admin-notes');
const API_ROOT = '/api';
const ADMIN_TOKEN_KEY = 'travetic-admin-token';
let adminToken = sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
let bookings = [];

const syncTokenInputs = (token) => {
  if (adminTokenInput) adminTokenInput.value = token;
  if (adminGateInput) adminGateInput.value = token;
};

const hideGate = () => {
  if (!adminGate) return;
  adminGate.classList.add('hidden');
};

const showGate = () => {
  if (!adminGate) return;
  adminGate.classList.remove('hidden');
};

const setStatus = (message, state = 'success') => {
  if (!adminStatus) return;
  adminStatus.textContent = message;
  adminStatus.style.color = state === 'error' ? '#ffb199' : 'var(--accent-2)';
};

const setGateMessage = (message, state = 'success') => {
  if (!gateMessage) return;
  gateMessage.textContent = message;
  gateMessage.style.color = state === 'error' ? '#ffb199' : 'var(--accent-2)';
};

const setTokenMessage = (message, state = 'success') => {
  if (!tokenMessage) return;
  tokenMessage.textContent = message;
  tokenMessage.style.color = state === 'error' ? '#ffb199' : 'var(--accent-2)';
};

const renderTable = () => {
  if (!bookingTable) return;
  if (!bookings.length) {
    bookingTable.innerHTML = '<p>No bookings yet. Enter the admin token to sync.</p>';
    bookingCountEl.textContent = 'No data';
    return;
  }
  const rows = bookings
    .map((booking) => {
      const latestNote = booking.notes?.length
        ? booking.notes[booking.notes.length - 1].text
        : 'No notes yet';
      return `
        <tr>
          <td>${booking.name}</td>
          <td>${booking.email}</td>
          <td><span class="chip chip--${booking.status === 'approved' ? 'ok' : 'warn'}">${booking.status}</span></td>
          <td>${latestNote}</td>
          <td>
            <button class="btn btn-mini" data-action="approve" data-id="${booking._id}">Approve</button>
            <button class="btn btn-mini" data-action="note" data-id="${booking._id}">Add note</button>
          </td>
        </tr>
      `;
    })
    .join('');
  bookingTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Email</th>
          <th>Status</th>
          <th>Latest note</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
  bookingTable.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      if (button.dataset.action === 'approve') {
        handleApprove(id);
      } else {
        handleAddNote(id);
      }
    });
  });
  bookingCountEl.textContent = `${bookings.length} live request(s)`;
};

const updateDashboardStats = () => {
  const pending = bookings.filter((booking) => booking.status === 'pending').length;
  const notesTotal = bookings.reduce((sum, booking) => sum + (booking.notes?.length || 0), 0);
  if (queuePending) queuePending.textContent = pending;
  if (queueNotes) queueNotes.textContent = notesTotal;
  if (queueRecent) queueRecent.textContent = bookings.length;
  if (adminCount) adminCount.textContent = bookings.length;
  if (adminNotes) adminNotes.textContent = notesTotal;
};

const fetchBookings = async () => {
  if (!adminToken) {
    setTokenMessage('Enter the admin secret before loading bookings.', 'error');
    showGate();
    return;
  }
  try {
    const response = await fetch(`${API_ROOT}/bookings`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    if (!response.ok) throw new Error('Unauthorized');
    const { bookings: data } = await response.json();
    bookings = data;
    setTokenMessage('Bookings synchronized.', 'success');
    renderTable();
    updateDashboardStats();
  } catch (error) {
    setTokenMessage('Invalid token or network error.', 'error');
    setGateMessage('The token did not unlock the data. Please try again.', 'error');
    showGate();
  }
};

const handleApprove = async (id) => {
  if (!adminToken) {
    setTokenMessage('Add the admin secret first.', 'error');
    return;
  }
  try {
    await fetch(`${API_ROOT}/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'approved' }),
    });
    await fetchBookings();
    setStatus('Booking approved successfully.');
  } catch (error) {
    setStatus('Approval failed. Double-check the token.', 'error');
  }
};

const handleAddNote = async (id) => {
  if (!adminToken) {
    setTokenMessage('Add the admin secret first.', 'error');
    return;
  }
  const note = window.prompt('Add a quick note for this booking');
  if (!note) return;
  try {
    await fetch(`${API_ROOT}/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ note }),
    });
    setStatus('Note saved to the booking.', 'success');
    await fetchBookings();
  } catch (error) {
    setStatus('Could not save the note. Please try again.', 'error');
  }
};

const unlockDashboard = (token) => {
  adminToken = token;
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  syncTokenInputs(token);
  hideGate();
  fetchBookings();
};

const handleTokenSubmit = () => {
  const token = adminTokenInput?.value.trim();
  if (!token) {
    setTokenMessage('Token required to load CRM data.', 'error');
    return;
  }
  unlockDashboard(token);
};

const handleGateAuth = () => {
  const token = adminGateInput?.value.trim();
  if (!token) {
    setGateMessage('Provide the admin secret to continue.', 'error');
    return;
  }
  unlockDashboard(token);
  setGateMessage('Dashboard unlocked.', 'success');
};

if (adminTokenSubmit) {
  adminTokenSubmit.addEventListener('click', handleTokenSubmit);
}

if (adminGateButton) {
  adminGateButton.addEventListener('click', handleGateAuth);
}

if (broadcastForm) {
  broadcastForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(broadcastForm);
    const message = (formData.get('broadcast') || '').trim();
    if (!message) {
      setStatus('Add a quick note before sending the bulletin.', 'error');
      return;
    }
    setStatus(`Bulletin sent to live agents: "${message}"`);
    broadcastForm.reset();
  });
}

if (typeof window !== 'undefined') {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  if (adminToken) {
    syncTokenInputs(adminToken);
    hideGate();
    fetchBookings();
  } else {
    showGate();
  }
}
