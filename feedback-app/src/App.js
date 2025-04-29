// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      setStatus('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/submit', { phone, message }); // Updated to port 5000
      setStatus('Feedback submitted successfully!');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('Submission failed. Try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Phone Number:</label><br />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          maxLength={10}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        /><br />

        <label>Feedback:</label><br />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        /><br />

        <button type="submit" style={{ padding: '10px 20px' }}>Submit</button>
      </form>
      {status && <p style={{ marginTop: '15px' }}>{status}</p>}
    </div>
  );
}

export default App;
