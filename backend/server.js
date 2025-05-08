const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = 'mongodb+srv://developer:Dishu2002@fb.y1b6wnr.mongodb.net/?retryWrites=true&w=majority&appName=FB';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Schema and Model
const FeedbackSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', FeedbackSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Feedback API!');
});

// Submit feedback
app.post('/submit', async (req, res) => {
  const { phone, message } = req.body;

  try {
    const newFeedback = new Feedback({ phone, message });
    await newFeedback.save();
    res.status(201).send('Feedback submitted successfully.');
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).send('Server Error');
  }
});

// ✅ Get all feedback (used for Excel download)
app.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // adjust as per your schema
    res.json(feedbacks);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
