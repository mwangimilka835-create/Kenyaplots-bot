<script>
    let step = 0;
    let bookingData = {};
    const chatBody = document.getElementById('chatBody');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    window.onload = () => {
      setTimeout(() => {
        addBotMessage(`
          <div style="background:#fff;border-radius:12px;overflow:hidden;margin:12px 0;box-shadow:0 1px 3px rgba(0,0,0,0.12);">
            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600" alt="Sunrise Gardens" style="width:100%;height:180px;object-fit:cover;">
            <div style="padding:12px;">
              <div style="background:#e8f5e9;color:#0f6c3e;padding:4px 10px;border-radius:12px;font-size:12px;display:inline-flex;align-items:center;gap:4px;margin-bottom:8px;">📍 Sunrise Gardens - Thika Road</div>
              <div style="color:#0f6c3e;font-weight:700;font-size:20px;margin:8px 0;">KES 1,200,000</div>
              <div style="font-size:14px;color:#333;line-height:1.4;">Prime 1/8 acre plot along Thika Superhighway. Ready title deed, electricity & water available. Only 30 min from Nairobi CBD.</div>
              <button style="width:100%;padding:8px;background:#f5f5f5;border:none;border-radius:8px;margin-top:8px;font-size:14px;color:#0f6c3e;">View on Map</button>
            </div>
          </div>
        `);
        setTimeout(() => {
          addBotMessage('How would you like to pay?<br><br>Reply <strong>1</strong> for Cash<br>Reply <strong>2</strong> for Installments');
          step = 1;
        }, 800);
      }, 500);
    };

    function sendMessage() {
      const msg = userInput.value.trim();
      if (!msg) return;
      
      addUserMessage(msg);
      userInput.value = '';
      sendBtn.disabled = true;
      
      setTimeout(() => {
        handleStep(msg);
        sendBtn.disabled = false;
      }, 600);
    }

    function addUserMessage(msg) {
      chatBody.innerHTML += `<div style="margin-bottom:12px;display:flex;gap:8px;justify-content:flex-end;"><div style="background:#0f6c3e;color:#fff;padding:10px 14px;border-radius:18px;border-top-right-radius:4px;max-width:85%;box-shadow:0 1px 1px rgba(0,0,0,0.1);font-size:14px;">${msg}</div></div>`;
      scrollToBottom();
    }

    function addBotMessage(msg) {
      chatBody.innerHTML += `<div style="margin-bottom:12px;display:flex;gap:8px;justify-content:flex-start;"><div style="width:28px;height:28px;background:#0f6c3e;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">KP</div><div style="background:#fff;padding:10px 14px;border-radius:18px;border-top-left-radius:4px;max-width:85%;box-shadow:0 1px 1px rgba(0,0,0,0.1);font-size:14px;line-height:1.4;">${msg}</div></div>`;
      scrollToBottom();
    }

    function scrollToBottom() {
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function isValidPhone(phone) {
      return /^(\+254|0)[17]\d{8}$/.test(phone.replace(/\s/g, ''));
    }

    function isValidDate(date) {
      // Must have at least 1 letter and 1 number, or match date formats
      const hasLetters = /[a-zA-Z]/.test(date);
      const hasNumbers = /\d/.test(date);
      const looksLikeDate = /(\d{1,2}[\/\-\s]\d{1,2}[\/\-\s]\d{2,4})|(\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i.test(date);
      
      return date.length >= 5 && (hasLetters && hasNumbers || looksLikeDate);
    }

    function handleStep(msg) {
      if (step === 1) {
        if (msg === '1') {
          bookingData.payment = 'Cash';
          addBotMessage('<span style="color:#4caf50;font-weight:bold;">✓</span> Great choice! Cash buyers get a <strong>5% discount</strong> on the listed price.<br><br>📱 When would you like to visit the site?<br><br>Please reply with your preferred date (e.g. 15 July 2025)');
          step = 2;
        } else if (msg === '2') {
          bookingData.payment = 'Installments';
          addBotMessage('📱 When would you like to visit the site?<br><br>Please reply with your preferred date (e.g. 15 July 2025)');
          step = 2;
        } else {
          addBotMessage('Please reply with <strong>1</strong> for Cash or <strong>2</strong> for Installments.');
        }
      } else if (step === 2) {
        if (!isValidPhone(msg)) {
          addBotMessage('That doesn\'t look like a valid Kenyan phone number.<br><br>Please enter like <strong>0712345678</strong> or <strong>+254712345678</strong>');
          return;
        }
        bookingData.phone = msg;
        addBotMessage('📅 When would you like to visit the site?<br><br>Please reply with your preferred date (e.g. 15 July 2025)');
        step = 3;
      } else if (step === 3) {
        if (!isValidDate(msg)) {
          addBotMessage('Please enter a valid date like <strong>15 July 2025</strong> or <strong>23/12/2025</strong>.<br><br>Don\'t just type letters like "gdd".');
          return;
        }
        bookingData.date = msg;
        addBotMessage(`🎉 <strong>Booking Confirmed!</strong><br><br>Your site visit is scheduled for <strong>${msg}</strong>.<br><br>Our agent will contact you at <strong>${bookingData.phone}</strong> to confirm the details.<br><br>Thank you for your interest! 🏡`);
        saveToDatabase();
        step = 4;
        userInput.disabled = true;
        sendBtn.disabled = true;
        userInput.placeholder = 'Conversation completed';
      }
    }

    async function saveToDatabase() {
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            name: 'Chat User',
            phone: bookingData.phone,
            plot: 'Sunrise Gardens - Thika Road',
            payment: bookingData.payment,
            visit_date: bookingData.date,
            created_at: new Date().toISOString()
          })
        });
      } catch (err) {
        console.error('Save error:', err);
      }
    }

    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  </script>
