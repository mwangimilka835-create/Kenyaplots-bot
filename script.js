function handleStep(msg) {
  if (step === 1) {
    if (msg === '1') {
      bookingData.payment = 'Cash';
      addBotMessage('<span style="color:#4caf50;font-weight:bold;">✓</span> Great choice! Cash buyers get a <strong>5% discount</strong> on the listed price.<br><br>📱 What\'s your phone number? <small>(e.g. 0712345678)</small>');
      step = 2;
    } else if (msg === '2') {
      bookingData.payment = 'Installments';
      addBotMessage('📱 What\'s your phone number? <small>(e.g. 0712345678)</small>');
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
