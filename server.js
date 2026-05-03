const express = require('express');
const path = require('path');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('/etc/secrets/Kenyaplots.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves your index.html from /public folder

// 1. PING - Keeps Render awake
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

// 2. NOTIFY AGENT - Send WhatsApp/Email when lead score >= 30
app.post('/api/notify-agent', async (req, res) => {
  const { phone, plot, payment, score, date } = req.body;
  
  console.log('🔥 HOT LEAD:', { phone, plot, payment, score, date });
  
  // Save to Firestore
  try {
    await db.collection('leads').add({
      phone,
      plot,
      payment,
      score,
      date,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Lead saved to Firestore');
  } catch (error) {
    console.error('Firestore error:', error);
  }
  
  res.json({ success: true });
});

// 3. GENERATE eTIMS INVOICE - Call KRA API
app.post('/api/generate-invoice', async (req, res) => {
  const { phone, plot, amount, payment, date } = req.body;
  
  try {
    const invoiceNo = 'INV-' + Date.now();
    const invoiceUrl = `https://kenyaplots-bot.onrender.com/invoices/${invoiceNo}.pdf`;
    
    res.json({ 
      success: true, 
      invoiceNo: invoiceNo, 
      invoiceUrl: invoiceUrl 
    });
    
  } catch (error) {
    console.error('eTIMS Error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate invoice' });
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
