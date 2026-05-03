const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

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
  
  // Option A: Send WhatsApp using Africa's Talking
  // const africastalking = require('africastalking')({
  //   apiKey: process.env.AT_API_KEY,
  //   username: process.env.AT_USERNAME
  // });
  // await africastalking.SMS.send({
  //   to: '+2547XXXXXXXX', // Your sales agent's number
  //   message: `HOT LEAD! ${phone} scored ${score} points for ${plot}. Payment: ${payment}. Visit: ${date}`
  // });
  
  // Option B: Send Email using SendGrid
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({
  //   to: 'agent@kenyaplots.com',
  //   from: 'bot@kenyaplots.com',
  //   subject: `Hot Lead: ${score} points`,
  //   text: `Phone: ${phone}, Plot: ${plot}, Payment: ${payment}, Date: ${date}`
  // });
  
  res.json({ success: true });
});

// 3. GENERATE eTIMS INVOICE - Call KRA API
app.post('/api/generate-invoice', async (req, res) => {
  const { phone, plot, amount, payment, date } = req.body;
  
  try {
    // Call KRA eTIMS API here
    // const kraResponse = await fetch('https://etims.kra.go.ke/api/v1/invoice', {
    //   method: 'POST',
    //   headers: { 
    //     'Authorization': `Bearer ${process.env.KRA_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     buyerPin: 'A000A', // Get from user or use default
    //     buyerName: 'Chat User',
    //     buyerPhone: phone,
    //     items: [{
    //       name: plot,
    //       quantity: 1,
    //       unitPrice: amount,
    //       taxRate: 0 // Land is exempt from VAT
    //     }]
    //   })
    // });
    // const kraData = await kraResponse.json();
    
    // For now, return mock data
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
