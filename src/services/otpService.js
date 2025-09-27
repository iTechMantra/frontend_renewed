// src/services/otpService.js
import { v4 as uuidv4 } from 'uuid';

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiry
export const sendOTP = (phone, type = 'login') => {
  try {
    const otps = JSON.parse(localStorage.getItem('otps') || '[]');
    
    // Clear existing OTPs for this phone
    const filteredOtps = otps.filter(otp => otp.phone !== phone);
    
    // Generate new OTP
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    
    const newOtp = {
      id: uuidv4(),
      phone,
      otp,
      type,
      expiry: expiry.toISOString(),
      createdAt: new Date().toISOString()
    };
    
    filteredOtps.push(newOtp);
    localStorage.setItem('otps', JSON.stringify(filteredOtps));
    
    // For demo purposes, we'll show the OTP in console and alert
    console.log(`OTP for ${phone}: ${otp}`);
    alert(`Demo OTP for ${phone}: ${otp}\n\nThis is a demo - in production, this would be sent via SMS.`);
    
    return { success: true, otp: otp };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: 'Failed to send OTP' };
  }
};

// Verify OTP
export const verifyOTP = (phone, otp, type = 'login') => {
  try {
    const otps = JSON.parse(localStorage.getItem('otps') || '[]');
    
    // Find the OTP
    const otpRecord = otps.find(o => 
      o.phone === phone && 
      o.otp === otp && 
      o.type === type
    );
    
    if (!otpRecord) {
      return { success: false, error: 'Invalid OTP' };
    }
    
    // Check if OTP is expired
    const now = new Date();
    const expiry = new Date(otpRecord.expiry);
    
    if (now > expiry) {
      // Remove expired OTP
      const filteredOtps = otps.filter(o => o.id !== otpRecord.id);
      localStorage.setItem('otps', JSON.stringify(filteredOtps));
      
      return { success: false, error: 'OTP has expired' };
    }
    
    // Remove the used OTP
    const filteredOtps = otps.filter(o => o.id !== otpRecord.id);
    localStorage.setItem('otps', JSON.stringify(filteredOtps));
    
    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: 'Failed to verify OTP' };
  }
};

// Clear expired OTPs
export const clearExpiredOtps = () => {
  try {
    const otps = JSON.parse(localStorage.getItem('otps') || '[]');
    const now = new Date();
    
    const validOtps = otps.filter(otp => {
      const expiry = new Date(otp.expiry);
      return now <= expiry;
    });
    
    localStorage.setItem('otps', JSON.stringify(validOtps));
    return true;
  } catch (error) {
    console.error('Error clearing expired OTPs:', error);
    return false;
  }
};

// Get OTP for a phone number (for demo purposes)
export const getOTPForPhone = (phone) => {
  try {
    const otps = JSON.parse(localStorage.getItem('otps') || '[]');
    const otpRecord = otps.find(o => o.phone === phone);
    
    if (otpRecord) {
      const now = new Date();
      const expiry = new Date(otpRecord.expiry);
      
      if (now <= expiry) {
        return otpRecord.otp;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting OTP for phone:', error);
    return null;
  }
};

// Check if OTP exists and is valid
export const isOTPValid = (phone, type = 'login') => {
  try {
    const otps = JSON.parse(localStorage.getItem('otps') || '[]');
    const otpRecord = otps.find(o => 
      o.phone === phone && 
      o.type === type
    );
    
    if (!otpRecord) {
      return false;
    }
    
    const now = new Date();
    const expiry = new Date(otpRecord.expiry);
    
    return now <= expiry;
  } catch (error) {
    console.error('Error checking OTP validity:', error);
    return false;
  }
};
