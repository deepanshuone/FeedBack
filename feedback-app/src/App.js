import React, { useState, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function App() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [lastFeedback, setLastFeedback] = useState(null);
  const printRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      setStatus('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      await axios.post('https://feedback-r10l.onrender.com/submit', { phone, message });
      setLastFeedback({ phone, message, date: new Date().toLocaleString() });
      setStatus('Feedback submitted successfully!');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('Submission failed. Try again later.');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get('https://feedback-r10l.onrender.com/feedback', {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = response.data;

      if (!Array.isArray(data) || data.length === 0) {
        setStatus('No feedback data found.');
        return;
      }

      const cleanedData = data.map(({ phone, message, createdAt }) => ({
        Phone: phone,
        Feedback: message,
        Date: new Date(createdAt).toLocaleString(),
      }));

      const worksheet = XLSX.utils.json_to_sheet(cleanedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(file, 'feedback.xlsx');

      setStatus('Download successful.');
    } catch (error) {
      console.error('Download Error:', error.response?.data || error.message);
      setStatus('Download failed. Please try again later.');
    }
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=500,width=800');
    printWindow.document.write('<html><head><title>Print Feedback</title></head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
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

      <button onClick={handleDownload} style={{ padding: '10px 20px', marginTop: '10px' }}>
        Download Feedback (Excel)
      </button>

      {lastFeedback && (
        <>
          <div ref={printRef} style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
            <h3>Last Submitted Feedback</h3>
            <p><strong>Phone:</strong> {lastFeedback.phone}</p>
            <p><strong>Feedback:</strong> {lastFeedback.message}</p>
            <p><strong>Date:</strong> {lastFeedback.date}</p>
          </div>
          <button onClick={handlePrint} style={{ padding: '10px 20px', marginTop: '10px' }}>
            Print Last Feedback
          </button>
        </>
      )}

      {status && <p style={{ marginTop: '15px' }}>{status}</p>}
    </div>
  );
}

export default App;
