const crypto = require('crypto');

const PIXEL_ID = '1069181438510520';
const ACCESS_TOKEN = 'EAAl2BZBnbLEcBPuGnKyVUeaXrpoe2CzwpzS22IAswsqCeQZC3DTS8CqonhxtAc8APt2UMFPLlannMyafxxiBJGuoxx6c0mwqexG9XlFkZA5oDiJPvW0wd30XLmnwrqFyzNLj5IEtsDKTsJIPzSUZAsYISk4ogCqxh3vylX8mwgEP3KYQugms9p62sd184gZDZD';

// Hash function
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Test conversion event
const testEvent = {
  data: [{
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: 'https://findbroker.paisowala.com',
    action_source: 'website',
    user_data: {
      ph: [sha256('+919876543210')],
      fn: [sha256('test')],
      ln: [sha256('user')],
      country: [sha256('in')],
      fbc: 'fb.1.' + Date.now() + '.test_click_id_123'
    },
    custom_data: {
      value: 500,
      currency: 'INR',
      content_name: 'zerodha',
      content_category: 'broker_account_opening'
    },
    event_id: 'test_purchase_' + Date.now()
  }],
  access_token: ACCESS_TOKEN
};

// Send to Facebook
fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testEvent)
})
.then(res => res.json())
.then(data => {
  console.log('✅ SUCCESS! Facebook Conversions API Response:');
  console.log(JSON.stringify(data, null, 2));
  
  if (data.events_received) {
    console.log('\n🎉 CONVERSION TRACKING IS WORKING!');
    console.log(`Events received: ${data.events_received}`);
    console.log(`FB Trace ID: ${data.fbtrace_id}`);
  } else if (data.error) {
    console.log('\n❌ ERROR:', data.error.message);
  }
})
.catch(err => {
  console.error('❌ FAILED:', err.message);
});
