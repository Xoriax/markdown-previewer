require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const File = require('./models/File');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}
mongoose.connect(MONGODB_URI).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// API Routes
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// List
app.get('/api/files', async (req, res) => {
  const files = await File.find().sort({ updatedAt: -1 }).lean();
  res.json(files);
});

// Read one
app.get('/api/files/:id', async (req, res) => {
  try {
    const f = await File.findById(req.params.id).lean();
    if (!f) return res.status(404).json({ error: 'Not found' });
    res.json(f);
  } catch {
    res.status(400).json({ error: 'Invalid id' });
  }
});

// Create
app.post('/api/files', async (req, res) => {
  const { title, content = '' } = req.body || {};
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
  const created = await File.create({ title: title.trim(), content });
  res.status(201).json(created);
});

// Update
app.put('/api/files/:id', async (req, res) => {
  const { title, content } = req.body || {};
  const payload = {};
  if (typeof title === 'string') payload.title = title.trim();
  if (typeof content === 'string') payload.content = content;

  try {
    const updated = await File.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Invalid id or payload' });
  }
});

// Delete
app.delete('/api/files/:id', async (req, res) => {
  try {
    const del = await File.findByIdAndDelete(req.params.id).lean();
    if (!del) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'Invalid id' });
  }
});

// Static frontend (sert index.html & dashboard.html depuis la racine du repo)
app.use('/', express.static(path.join(__dirname, '..', '..')));

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});