// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (MongoDB Atlas)
const mongoURI = 'mongodb+srv://devloper:Dishu@2002@FB.mongodb.net/feedbackDB?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Schema and Model
const FeedbackSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', FeedbackSchema);

// Routes
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

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
