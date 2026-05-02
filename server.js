const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Database setup
const db = new sqlite3.Database('./leads.db');
db.run(`CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT,
  plot TEXT,
  date TEXT,
  payment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/lead', (req, res) => {
  const { name, phone, plot, date, payment } = req.body;
  db.run(`INSERT INTO leads (name, phone, plot, date, payment) VALUES (?, ?, ?)`,
    [name, phone, plot, date, payment],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.get('/api/leads', (req, res) => {
  db.all('SELECT * FROM leads ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
