document.getElementById('leadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const lead = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    plot: document.getElementById('plot').value,
    date: document.getElementById('date').value,
    payment: document.getElementById('payment').value
  };

  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    
    const data = await res.json();
    if (data.success) {
      document.getElementById('message').innerHTML = 'Site visit booked! We will call you to confirm.';
      document.getElementById('message').className = 'success';
      document.getElementById('leadForm').reset();
    }
  } catch (err) {
    document.getElementById('message').innerHTML = 'Error booking. Try again.';
    document.getElementById('message').className = 'error';
  }
});
