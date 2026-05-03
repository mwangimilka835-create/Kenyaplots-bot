function generateQRCode(data) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, data, { width: 200 }, function (error) {
      if (error) {
        console.error(error);
        resolve(null);
      } else {
        resolve(canvas.toDataURL());
      }
    });
  });
}

function handleStep(msg) {
  const msgLower = msg.toLowerCase();
  
  // Neighborhood Context RAG
  if (msgLower.includes('school') || msgLower.includes('shule') || msgLower.includes('internet') || msgLower.includes('fiber') || msgLower.includes('hospital') || msgLower.includes('market')) {
    if (msgLower.includes('school') || msgLower.includes('shule')) {
      addBotMessage('🏫 The nearest primary school is 1.2km away (5 min drive). Secondary school is 3.5km away.');
    } else if (msgLower.includes('internet') || msgLower.includes('fiber')) {
      addBotMessage('📡 Yes, Safaricom Fiber is available in Sunrise Gardens. Safaricom 4G and Airtel 4G also have full coverage.');
    }
    return;
  }
  
  // Document Preview
  if (msgLower.includes('proof') || msgLower.includes('title deed') || msgLower.includes('ownership') || msgLower.includes('document') || msgLower.includes('hati')) {
    addBotMessage('📄 Here\'s a specimen copy of the Title Deed for Sunrise Gardens:<br><br><img src="https://via.placeholder.com/400x250/cccccc/666?text=Specimen+Title+Deed" style="width:100%;border-radius:8px;margin-top:8px;filter:blur(2px);"><br><small>Blurred for security. Full original available during site visit.</small>');
    leadScore += 15;
    checkHotLead();
    return;
  }

  // Main booking flow
  if (step === 1) {
    if (msg === '1') {
      bookingData.payment = language === 'en'? 'Cash' : 'Pesa Taslimu';
      leadScore += 20; // +20 for cash
      checkHotLead();
      addBotMessage('<span style="color:#4caf50;font-weight:bold;">✓</span> ' + (language === 'en'? 'Great choice! Cash buyers get a <strong>5% discount</strong> on the listed price.' : 'Chaguo zuri! Wanunuzi wa pesa taslimu wanapata <strong>punguzo la 5%</strong> kwenye bei iliyoorodheshwa.') + '<br><br>' + t('phone'));
      step = 2;
    } else if (msg === '2') {
      bookingData.payment = language === 'en'? 'Installments' : 'Malipo ya Awamu';
      addBotMessage(t('phone'));
      step = 2;
    } else {
      addBotMessage(t('pay') + '<br><br>' + t('cash') + '<br>' + t('installments'));
    }
  } else if (step === 2) {
    if (!isValidPhone(msg)) {
      addBotMessage(t('invalidPhone'));
      return;
    }
    bookingData.phone = msg;
    leadScore += 10; // +10 for valid phone
    checkHotLead();
    addBotMessage(t('date'));
    step = 3;
  } else if (step === 3) {
    if (!isValidDate(msg)) {
      addBotMessage(t('invalidDate'));
      return;
    }
    bookingData.date = msg;
    leadScore += 15; // +15 for booking site visit
    checkHotLead();
    
    addBotMessage(t('confirmed', { date: msg, phone: bookingData.phone, score: leadScore }));
    
    // Generate Gate Pass QR Code - IoT Site Access
    setTimeout(async () => {
      const qrData = JSON.stringify({
        name: 'Chat User',
        phone: bookingData.phone,
        plot: 'Sunrise Gardens',
        date: bookingData.date,
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      });
      
      const qrImageBase64 = await generateQRCode(qrData);
      
      if (qrImageBase64) {
        addBotMessage(`🎫 <strong>Your Gate Pass is ready!</strong><br><br>Show this QR code at the gate on <strong>${msg}</strong>. Valid for 2 hours only.<br><br><img src="${qrImageBase64}" style="width:200px;height:200px;border-radius:8px;margin-top:8px;border:1px solid #e0e0e0;" alt="Gate Pass QR Code">`);
      } else {
        addBotMessage(`🎫 <strong>Your Gate Pass is ready!</strong><br><br>Show this QR code at the gate on <strong>${msg}</strong>. Valid for 2 hours only.<br><br><small>QR code generation failed. Please contact agent.</small>`);
      }
    }, 1000);
    
    // Generate eTIMS Invoice if cash payment
    if (bookingData.payment === 'Cash' || bookingData.payment === 'Pesa Taslimu') {
      setTimeout(() => {
        generateeTIMSInvoice();
      }, 2000);
    }
    
    saveToDatabase();
    step = 4;
    userInput.disabled = true;
    sendBtn.disabled = true;
    userInput.placeholder = language === 'en'? 'Conversation completed' : 'Mazungumzo yameisha';
  }
                    }
