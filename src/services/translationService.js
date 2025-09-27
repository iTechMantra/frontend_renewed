// src/services/translationService.js

// Translation dictionary for English to Punjabi
const translations = {
  // Common words
  'Welcome': 'ਸੁਆਗਤ ਹੈ',
  'Login': 'ਲੌਗਇਨ',
  'Sign up': 'ਸਾਇਨ ਅੱਪ',
  'Logout': 'ਲੌਗਆਉਟ',
  'Home': 'ਘਰ',
  'Profile': 'ਪ੍ਰੋਫਾਈਲ',
  'Settings': 'ਸੈੱਟਿੰਗਜ਼',
  'Save': 'ਸੇਵ ਕਰੋ',
  'Cancel': 'ਰੱਦ ਕਰੋ',
  'Submit': 'ਜਮ੍ਹਾ ਕਰੋ',
  'Search': 'ਖੋਜੋ',
  'Yes': 'ਹਾਂ',
  'No': 'ਨਹੀਂ',
  'OK': 'ਠੀਕ ਹੈ',
  'Error': 'ਗਲਤੀ',
  'Success': 'ਸਫਲਤਾ',
  'Loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ',
  'Please wait': 'ਕਿਰਪਾ ਕਰਕੇ ਇੰਤਜ਼ਾਰ ਕਰੋ',
  
  // Navigation
  'Dashboard': 'ਡੈਸ਼ਬੋਰਡ',
  'Messages': 'ਸੰਦੇਸ਼',
  'Video Call': 'ਵੀਡੀਓ ਕਾਲ',
  'Health Records': 'ਸਿਹਤ ਰਿਕਾਰਡ',
  'Prescriptions': 'ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ',
  'Medicine Search': 'ਦਵਾਈ ਖੋਜ',
  'Orders': 'ਆਰਡਰ',
  'Waiting Room': 'ਇੰਤਜ਼ਾਰ ਕਮਰਾ',
  'Patients': 'ਮਰੀਜ਼',
  'Statistics': 'ਆਂਕੜੇ',
  'Campaign': 'ਮੁਹਿੰਮ',
  'Add Patient': 'ਮਰੀਜ਼ ਜੋੜੋ',
  
  // User types
  'User': 'ਉਪਯੋਗਕਰਤਾ',
  'Doctor': 'ਡਾਕਟਰ',
  'ASHA Worker': 'ਆਸ਼ਾ ਵਰਕਰ',
  'Pharmacy': 'ਦਵਾਈਖਾਨਾ',
  
  // Medical terms
  'Symptoms': 'ਲੱਛਣ',
  'Diagnosis': 'ਨਿਦਾਨ',
  'Treatment': 'ਇਲਾਜ',
  'Medicine': 'ਦਵਾਈ',
  'Dosage': 'ਮਾਤਰਾ',
  'Price': 'ਕੀਮਤ',
  'Company': 'ਕੰਪਨੀ',
  'Category': 'ਸ਼੍ਰੇਣੀ',
  
  // Actions
  'Attend': 'ਧਿਆਨ ਦਿਓ',
  'Complete': 'ਪੂਰਾ ਕਰੋ',
  'View': 'ਦੇਖੋ',
  'Edit': 'ਸੰਪਾਦਿਤ ਕਰੋ',
  'Delete': 'ਮਿਟਾਓ',
  'Download': 'ਡਾਊਨਲੋਡ',
  'Upload': 'ਅਪਲੋਡ',
  'Send': 'ਭੇਜੋ',
  'Receive': 'ਪ੍ਰਾਪਤ ਕਰੋ',
  
  // Time
  'Today': 'ਅੱਜ',
  'Yesterday': 'ਕੱਲ',
  'Tomorrow': 'ਕੱਲ',
  'Just now': 'ਹੁਣੇ',
  'min ago': 'ਮਿੰਟ ਪਹਿਲਾਂ',
  'hr ago': 'ਘੰਟਾ ਪਹਿਲਾਂ',
  'ago': 'ਪਹਿਲਾਂ',
  
  // Status
  'Pending': 'ਲੰਬਿਤ',
  'In Progress': 'ਤਰੱਕੀ ਵਿੱਚ',
  'Completed': 'ਪੂਰਾ',
  'Cancelled': 'ਰੱਦ',
  'Active': 'ਸਰਗਰਮ',
  'Inactive': 'ਨਿਸ਼ਕ੍ਰਿਆ',
  
  // Common phrases
  'Don\'t have an account?': 'ਖਾਤਾ ਨਹੀਂ ਹੈ?',
  'Already have an account?': 'ਖਾਤਾ ਪਹਿਲਾਂ ਤੋਂ ਹੈ?',
  'Enter your': 'ਆਪਣਾ ਦਰਜ ਕਰੋ',
  'Please enter': 'ਕਿਰਪਾ ਕਰਕੇ ਦਰਜ ਕਰੋ',
  'Enter': 'ਦਰਜ ਕਰੋ',
  'Select': 'ਚੁਣੋ',
  'Choose': 'ਚੁਣੋ',
  
  // E-Sannidhi specific
  'E-Sannidhi': 'ਈ-ਸਨਿਧੀ',
  'Government of India Initiative': 'ਭਾਰਤ ਸਰਕਾਰ ਦੀ ਪਹਿਲਕਦਮੀ',
  'Telemedicine': 'ਟੈਲੀਵੈੱਡੀਸਨ',
  'Healthcare': 'ਸਿਹਤ ਸੇਵਾ',
  'Community Health': 'ਭਾਈਚਾਰਕ ਸਿਹਤ',
  'AI Symptom Checker': 'AI ਲੱਛਣ ਚੈਕਰ',
  'Medicine Delivery': 'ਦਵਾਈ ਡਿਲੀਵਰੀ',
  'Video Consultation': 'ਵੀਡੀਓ ਸਲਾਹ',
  'Health Records': 'ਸਿਹਤ ਰਿਕਾਰਡ',
  'Prescription Management': 'ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ ਪ੍ਰਬੰਧਨ',
  
  // Form labels
  'Full Name': 'ਪੂਰਾ ਨਾਮ',
  'Mobile Number': 'ਮੋਬਾਈਲ ਨੰਬਰ',
  'Email': 'ਈਮੇਲ',
  'Password': 'ਪਾਸਵਰਡ',
  'Confirm Password': 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ',
  'Address': 'ਪਤਾ',
  'Location': 'ਟਿਕਾਣਾ',
  'Specialization': 'ਮਾਹਿਰਗੀ',
  'License Number': 'ਲਾਇਸੰਸ ਨੰਬਰ',
  'Aadhaar Number': 'ਆਧਾਰ ਨੰਬਰ',
  
  // Messages
  'Login successful': 'ਲੌਗਇਨ ਸਫਲ',
  'Registration successful': 'ਰਜਿਸਟ੍ਰੀਕਰਨ ਸਫਲ',
  'Logout successful': 'ਲੌਗਆਉਟ ਸਫਲ',
  'OTP sent successfully': 'OTP ਸਫਲਤਾਪੂਰਵਕ ਭੇਜਿਆ ਗਿਆ',
  'OTP verified successfully': 'OTP ਸਫਲਤਾਪੂਰਵਕ ਤਸਦੀਕ ਹੋਇਆ',
  'Invalid OTP': 'ਗਲਤ OTP',
  'OTP expired': 'OTP ਦੀ ਮਿਆਦ ਸਮਾਪਤ',
  'User not found': 'ਉਪਯੋਗਕਰਤਾ ਨਹੀਂ ਮਿਲਿਆ',
  'Invalid credentials': 'ਗਲਤ ਸਨਦ',
  'Password required': 'ਪਾਸਵਰਡ ਚਾਹੀਦਾ ਹੈ',
  'Phone required': 'ਫੋਨ ਚਾਹੀਦਾ ਹੈ',
  'Name required': 'ਨਾਮ ਚਾਹੀਦਾ ਹੈ',
  
  // Dashboard specific
  'Welcome back': 'ਵਾਪਸ ਸੁਆਗਤ ਹੈ',
  'Total Patients': 'ਕੁੱਲ ਮਰੀਜ਼',
  'Waiting': 'ਇੰਤਜ਼ਾਰ',
  'Attended': 'ਧਿਆਨ ਦਿੱਤਾ',
  'Health Records': 'ਸਿਹਤ ਰਿਕਾਰਡ',
  'Prescriptions': 'ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ',
  'Orders': 'ਆਰਡਰ',
  'Patients Added': 'ਮਰੀਜ਼ ਜੋੜੇ ਗਏ',
  'Campaign Progress': 'ਮੁਹਿੰਮ ਤਰੱਕੀ',
  
  // Medicine related
  'Medicine Details': 'ਦਵਾਈ ਵੇਰਵੇ',
  'Add to Cart': 'ਕਾਰਟ ਵਿੱਚ ਜੋੜੋ',
  'View Cart': 'ਕਾਰਟ ਦੇਖੋ',
  'Place Order': 'ਆਰਡਰ ਦਿਓ',
  'Order Summary': 'ਆਰਡਰ ਸਾਰ',
  'Total': 'ਕੁੱਲ',
  'Quantity': 'ਮਾਤਰਾ',
  'Price': 'ਕੀਮਤ',
  'each': 'ਹਰੇਕ',
  'Delivery': 'ਡਿਲੀਵਰੀ',
  'Track': 'ਟ੍ਰੈਕ ਕਰੋ',
  
  // Video call
  'Start Video Call': 'ਵੀਡੀਓ ਕਾਲ ਸ਼ੁਰੂ ਕਰੋ',
  'End Call': 'ਕਾਲ ਖਤਮ ਕਰੋ',
  'Join Meeting': 'ਮੀਟਿੰਗ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
  'Leave Meeting': 'ਮੀਟਿੰਗ ਛੋੜੋ',
  'Microphone': 'ਮਾਈਕ੍ਰੋਫੋਨ',
  'Camera': 'ਕੈਮਰਾ',
  'Screen Share': 'ਸਕ੍ਰੀਨ ਸਾਂਝੀ',
  
  // Chat
  'Type your message': 'ਆਪਣਾ ਸੰਦੇਸ਼ ਟਾਈਪ ਕਰੋ',
  'Send Message': 'ਸੰਦੇਸ਼ ਭੇਜੋ',
  'No messages yet': 'ਹਾਲੇ ਕੋਈ ਸੰਦੇਸ਼ ਨਹੀਂ',
  'Start a conversation': 'ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ',
  'Create Visit': 'ਮੁਲਾਕਾਤ ਬਣਾਓ',
  'Visit created successfully': 'ਮੁਲਾਕਾਤ ਸਫਲਤਾਪੂਰਵਕ ਬਣੀ',
  'Visit ID': 'ਮੁਲਾਕਾਤ ID',
  
  // Forms
  'Required': 'ਜ਼ਰੂਰੀ',
  'Optional': 'ਵਿਕਲਪਿਕ',
  'Choose file': 'ਫਾਈਲ ਚੁਣੋ',
  'No file chosen': 'ਕੋਈ ਫਾਈਲ ਨਹੀਂ ਚੁਣੀ',
  'Upload file': 'ਫਾਈਲ ਅਪਲੋਡ ਕਰੋ',
  'File uploaded': 'ਫਾਈਲ ਅਪਲੋਡ ਹੋਈ',
  'Upload failed': 'ਅਪਲੋਡ ਅਸਫਲ',
  
  // Status messages
  'Online': 'ਔਨਲਾਈਨ',
  'Offline': 'ਔਫਲਾਈਨ',
  'Connecting': 'ਜੁੜ ਰਿਹਾ ਹੈ',
  'Connected': 'ਜੁੜਿਆ ਹੋਇਆ',
  'Disconnected': 'ਡਿਸਕਨੈਕਟ',
  'Reconnecting': 'ਫਿਰ ਜੁੜ ਰਿਹਾ ਹੈ',
  
  // Common actions
  'Click here': 'ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ',
  'Learn more': 'ਹੋਰ ਜਾਣੋ',
  'Read more': 'ਹੋਰ ਪੜ੍ਹੋ',
  'Show more': 'ਹੋਰ ਦਿਖਾਓ',
  'Show less': 'ਕਮ ਦਿਖਾਓ',
  'View all': 'ਸਭ ਦੇਖੋ',
} 

// Initialize translations
export const initializeTranslations = () => {
  // This function can be used to load translations from an external source
  // For now, we'll use the static dictionary above
  console.log('Translations initialized');
};

// Create reverse translation dictionary (Punjabi to English)
const reverseTranslations = {};
Object.keys(translations).forEach(key => {
  reverseTranslations[translations[key]] = key;
});

// Translate text from English to Punjabi or vice versa
export const translate = (text) => {
  try {
    // Get current language setting
    const currentLang = localStorage.getItem('appLanguage') || 'en';
    
    // If English, return original text or English translation
    if (currentLang === 'en') {
      // If text is in Punjabi, translate back to English
      if (reverseTranslations[text]) {
        return reverseTranslations[text];
      }
      // Otherwise return original text
      return text;
    }
    
    // If Punjabi, return Punjabi translation
    if (translations[text]) {
      return translations[text];
    }
    
    // If no translation found, return original text
    return text;
  } catch (error) {
    console.error('Error translating text:', error);
    return text;
  }
};

// Get all available languages
export const getAvailableLanguages = () => {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
  ];
};

// Set application language
export const setLanguage = (langCode) => {
  try {
    localStorage.setItem('appLanguage', langCode);
    return true;
  } catch (error) {
    console.error('Error setting language:', error);
    return false;
  }
};

// Get current language
export const getCurrentLanguage = () => {
  try {
    return localStorage.getItem('appLanguage') || 'en';
  } catch (error) {
    console.error('Error getting current language:', error);
    return 'en';
  }
};

// Get the opposite language for toggle button
export const getToggleLanguage = () => {
  try {
    const currentLang = getCurrentLanguage();
    return currentLang === 'en' ? 'pa' : 'en';
  } catch (error) {
    console.error('Error getting toggle language:', error);
    return 'pa';
  }
};

// Get the display name for the toggle button
export const getToggleLanguageName = () => {
  try {
    const currentLang = getCurrentLanguage();
    return currentLang === 'en' ? 'ਪੰਜਾਬੀ' : 'English';
  } catch (error) {
    console.error('Error getting toggle language name:', error);
    return 'ਪੰਜਾਬੀ';
  }
};
