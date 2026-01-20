// OTP Service for SMS and Email
// You'll need to install: npm install twilio @sendgrid/mail
import { OTP_CONFIG } from '../config/otpConfig';

interface OTPConfig {
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioPhoneNumber?: string;
  sendGridApiKey?: string;
  sendGridFromEmail?: string;
}

class OTPService {
  private config: OTPConfig;

  constructor(config: OTPConfig = {}) {
    this.config = {
      twilioAccountSid: OTP_CONFIG.twilio.accountSid,
      twilioAuthToken: OTP_CONFIG.twilio.authToken,
      twilioPhoneNumber: OTP_CONFIG.twilio.phoneNumber,
      sendGridApiKey: OTP_CONFIG.sendGrid.apiKey,
      sendGridFromEmail: OTP_CONFIG.sendGrid.fromEmail,
      ...config,
    };
  }

  // Generate a 6-digit OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send SMS OTP using Twilio
  async sendSMSOTP(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      if (!this.config.twilioAccountSid || !this.config.twilioAuthToken || !this.config.twilioPhoneNumber) {
        console.warn('Twilio credentials not configured. Using mock SMS service.');
        return this.mockSMSOTP(phoneNumber, otp);
      }

      // Uncomment and configure Twilio for real SMS
      /*
      const twilio = require('twilio');
      const client = twilio(this.config.twilioAccountSid, this.config.twilioAuthToken);
      
      await client.messages.create({
        body: `Your Vidyanka verification code is: ${otp}. Valid for 10 minutes.`,
        from: this.config.twilioPhoneNumber,
        to: phoneNumber
      });
      */

      // For now, using mock service
      return this.mockSMSOTP(phoneNumber, otp);
    } catch (error) {
      console.error('SMS OTP Error:', error);
      return false;
    }
  }

  // Send Email OTP using SendGrid
  async sendEmailOTP(email: string, otp: string): Promise<boolean> {
    try {
      if (!this.config.sendGridApiKey || !this.config.sendGridFromEmail) {
        console.warn('SendGrid credentials not configured. Using mock email service.');
        return this.mockEmailOTP(email, otp);
      }

      // Uncomment and configure SendGrid for real email
      /*
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(this.config.sendGridApiKey);
      
      const msg = {
        to: email,
        from: this.config.sendGridFromEmail,
        subject: 'Vidyanka - Your Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4f46e5;">Vidyanka Verification</h2>
            <p>Your verification code is:</p>
            <h1 style="color: #4f46e5; font-size: 48px; letter-spacing: 8px; text-align: center; margin: 20px 0;">
              ${otp}
            </h1>
            <p>This code is valid for 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `
      };
      
      await sgMail.send(msg);
      */

      // For now, using mock service
      return this.mockEmailOTP(email, otp);
    } catch (error) {
      console.error('Email OTP Error:', error);
      return false;
    }
  }

  // Mock SMS service for development
  private async mockSMSOTP(phoneNumber: string, otp: string): Promise<boolean> {
    console.log(`📱 Mock SMS sent to ${phoneNumber}: Your Vidyanka verification code is ${otp}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In development, you can show the OTP in console or alert
    if (__DEV__) {
      console.log(`🔐 Development OTP for ${phoneNumber}: ${otp}`);
    }
    
    return true;
  }

  // Mock Email service for development
  private async mockEmailOTP(email: string, otp: string): Promise<boolean> {
    console.log(`📧 Mock Email sent to ${email}: Your Vidyanka verification code is ${otp}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In development, you can show the OTP in console or alert
    if (__DEV__) {
      console.log(`🔐 Development OTP for ${email}: ${otp}`);
    }
    
    return true;
  }

  // Validate OTP format
  validateOTPFormat(otp: string): boolean {
    return /^\d{6}$/.test(otp);
  }

  // Check if OTP is expired (10 minutes)
  isOTPExpired(timestamp: number): boolean {
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
    return (now - timestamp) > tenMinutes;
  }
}

// Create and export a default instance
const otpService = new OTPService({
  // Configure these with your actual credentials
  // twilioAccountSid: 'your_twilio_account_sid',
  // twilioAuthToken: 'your_twilio_auth_token',
  // twilioPhoneNumber: 'your_twilio_phone_number',
  // sendGridApiKey: 'your_sendgrid_api_key',
  // sendGridFromEmail: 'noreply@vidyanka.com',
});

export default otpService;
export { OTPService }; 