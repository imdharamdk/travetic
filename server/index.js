const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
