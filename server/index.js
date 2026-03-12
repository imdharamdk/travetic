const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const { PORT = 4000, MONGODB_URI, ADMIN_SECRET = 'changeme' } = process.env;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. The API will not connect to a database.');
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

mongoose.connect(MONGODB_URI ?? '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch((error) => {
  console.warn('MongoDB connection warning:', error.message);
});

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: String,
    journey: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedAt: Date,
    notes: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const adminClaimSchema = new mongoose.Schema(
  {
    studio: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    volume: String,
  },
  { timestamps: true },
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
const AdminClaim = mongoose.models.AdminClaim || mongoose.model('AdminClaim', adminClaimSchema);
const magicTokenSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    role: { type: String, enum: ['customer', 'partner'], required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);
const MagicToken = mongoose.models.MagicToken || mongoose.model('MagicToken', magicTokenSchema);

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token || token !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
};

app.post('/api/bookings', async (req, res) => {
  const { name, email, message, journey } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const booking = await Booking.create({ name, email, message, journey });
    return res.status(201).json({ booking });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to create booking' });
  }
});

app.get('/api/bookings', requireAdmin, async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
  return res.json({ bookings });
});

app.patch('/api/bookings/:id', requireAdmin, async (req, res) => {
  const { status, note } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (status) {
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    booking.status = status;
    booking.approvedAt = status === 'approved' ? new Date() : null;
  }

  if (note) {
    booking.notes.push({ text: note });
  }

  await booking.save();
  return res.json({ booking });
});

app.post('/api/admin/claim', async (req, res) => {
  const { studio, email, phone, volume } = req.body;
  if (!studio || !email) {
    return res.status(400).json({ error: 'Studio and email are required' });
  }

  const existing = await AdminClaim.findOne();
  if (existing) {
    return res.json({
      alreadyClaimed: true,
      claim: existing,
    });
  }

  const claim = await AdminClaim.create({ studio, email, phone, volume });
  return res.status(201).json({
    alreadyClaimed: false,
    claim,
  });
});

app.get('/api/admin/claim', async (req, res) => {
  const claim = await AdminClaim.findOne().lean();
  if (!claim) {
    return res.status(404).json({ claim: null });
  }
  return res.json({ claim });
});

const frontRoot = path.join(__dirname, '..');
app.use(express.static(frontRoot));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontRoot, 'index.html'));
});

const createMagicToken = () => crypto.randomBytes(3).toString('hex');

app.post('/api/magic', async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ error: 'Email and role are required' });
  }
  if (!['customer', 'partner'].includes(role)) {
    return res.status(400).json({ error: 'Unsupported role' });
  }
  const token = createMagicToken();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await MagicToken.create({ email, role, token, expiresAt });
  console.log(`[magic] token for ${email} (${role}): ${token}`);
  return res.status(201).json({ message: 'Magic token issued', token });
});

app.post('/api/magic/verify', async (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) {
    return res.status(400).json({ error: 'Email and token required' });
  }
  const record = await MagicToken.findOne({ email, token });
  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
  await MagicToken.deleteMany({ email });
  return res.json({ success: true, role: record.role });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
