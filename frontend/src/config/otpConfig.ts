// OTP Service Configuration
// Add your actual credentials here for production use

export const OTP_CONFIG = {
  // Twilio SMS Configuration
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'your_twilio_account_sid',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'your_twilio_auth_token',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || 'your_twilio_phone_number',
  },
  
  // SendGrid Email Configuration
  sendGrid: {
    apiKey: process.env.SENDGRID_API_KEY || 'your_sendgrid_api_key',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@vidyanka.com',
  },
  
  // OTP Settings
  otp: {
    length: 6,
    expiryMinutes: 10,
    maxAttempts: 3,
  },
};

// Instructions for setting up real services:
/*
1. TWILIO SMS SETUP:
   - Sign up at https://www.twilio.com
   - Get your Account SID and Auth Token from the dashboard
   - Get a phone number for sending SMS
   - Set environment variables:
     TWILIO_ACCOUNT_SID=your_account_sid
     TWILIO_AUTH_TOKEN=your_auth_token
     TWILIO_PHONE_NUMBER=your_twilio_phone_number

2. SENDGRID EMAIL SETUP:
   - Sign up at https://sendgrid.com
   - Get your API Key from the dashboard
   - Verify your sender email address
   - Set environment variables:
     SENDGRID_API_KEY=your_api_key
     SENDGRID_FROM_EMAIL=your_verified_email

3. FOR DEVELOPMENT:
   - The app will use mock services if credentials are not configured
   - OTP codes will be logged to console in development mode
   - You can see the OTP in the console logs when testing

4. FOR PRODUCTION:
   - Configure real credentials in environment variables
   - Uncomment the real service code in otpService.ts
   - Test thoroughly before deploying
*/ 