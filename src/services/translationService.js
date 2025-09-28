// src/services/translationService.js

// Translation dictionary for English → Punjabi
const translations = {
  // Common
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

  // E-Sannidhi / Landing page
  'Healthcare': 'ਸਿਹਤ ਸੇਵਾ',
  'Community Health': 'ਭਾਈਚਾਰਕ ਸਿਹਤ',
  'AI Symptom Checker': 'AI ਲੱਛਣ ਚੈਕਰ',
  'Medicine Delivery': 'ਦਵਾਈ ਡਿਲੀਵਰੀ',
  'Video Consultations': 'ਵੀਡੀਓ ਸਲਾਹ',
  'Digital Health Records': 'ਸਿਹਤ ਰਿਕਾਰਡ',
  'Prescription Management': 'ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ ਪ੍ਰਬੰਧਨ',

  // Hero section
  'Healthcare Reimagined': 'ਸਿਹਤ ਸੇਵਾ ਦਾ ਨਵਾਂ ਰੂਪ',
  'Connecting patients, doctors, ASHA workers, and pharmacies through cutting-edge telemedicine technology. Experience healthcare that\'s accessible, affordable.':
      'ਮਰੀਜ਼, ਡਾਕਟਰ, ASHA ਵਰਕਰ ਅਤੇ ਫਾਰਮਸੀਜ਼ ਨੂੰ ਉੱਚ ਤਕਨੀਕ ਵਾਲੀ ਟੈਲੀਮੇਡੀਸਨ ਦੁਆਰਾ ਜੋੜਨਾ। ਸਿਹਤ ਸੇਵਾਵਾਂ ਹੁਣ ਸਹੂਲਤਯੋਗ ਅਤੇ ਕਿਫ਼ਾਇਤੀ ਹਨ।',
  'Secure & Private': 'ਸੁਰੱਖਿਅਤ ਅਤੇ ਪ੍ਰਾਈਵੇਟ',
  '24/7 Available': '24/7 ਉਪਲਬਧ',
  'Community Care': 'ਕਮਿਊਨਿਟੀ ਕੇਅਰ',
  'Get Started Today': 'ਅੱਜ ਹੀ ਸ਼ੁਰੂ ਕਰੋ',
  'Learn More': 'ਹੋਰ ਜਾਣੋ',

  // How it works
  'How It Works': 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
  'Simple steps to access healthcare anywhere': 'ਕਿਤੇ ਵੀ ਸਿਹਤ ਸੇਵਾ ਤੱਕ ਪਹੁੰਚ ਦੇ ਲਈ ਸਧਾਰਣ ਕਦਮ',
  'Step 1: Register': 'ਕਦਮ 1: ਰਜਿਸਟਰ ਕਰੋ',
  'Sign up as a patient, doctor, ASHA, or pharmacy to access the platform': 'ਪਲੇਟਫਾਰਮ ਤੱਕ ਪਹੁੰਚ ਲਈ ਮਰੀਜ਼, ਡਾਕਟਰ, ASHA ਜਾਂ ਫਾਰਮਸੀ ਵਜੋਂ ਸਾਈਨ ਅੱਪ ਕਰੋ',
  'Step 2: Consult / Upload': 'ਕਦਮ 2: ਸਲਾਹ / ਅਪਲੋਡ ਕਰੋ',
  'Patients can consult doctors, upload health records, and track symptoms': 'ਮਰੀਜ਼ ਡਾਕਟਰਾਂ ਨਾਲ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਕਰ ਸਕਦੇ ਹਨ, ਸਿਹਤ ਰਿਕਾਰਡ ਅਪਲੋਡ ਕਰ ਸਕਦੇ ਹਨ ਅਤੇ ਲੱਛਣ ਟ੍ਰੈਕ ਕਰ ਸਕਦੇ ਹਨ',
  'Step 3: Get Medicines': 'ਕਦਮ 3: ਦਵਾਈ ਪ੍ਰਾਪਤ ਕਰੋ',
  'Order medicines online or visit nearby pharmacies for delivery': 'ਆਨਲਾਈਨ ਦਵਾਈਆਂ ਆਰਡਰ ਕਰੋ ਜਾਂ ਨੇੜਲੇ ਫਾਰਮਸੀ ਤੋਂ ਡਿਲੀਵਰੀ ਪ੍ਰਾਪਤ ਕਰੋ',

  // Features
  'Comprehensive Healthcare Solutions': 'ਵਿਆਪਕ ਸਿਹਤ ਸੇਵਾ ਹੱਲ',
  'Our platform offers a complete suite of healthcare services designed to make quality medical care accessible to everyone, anywhere, anytime.':
      'ਸਾਡਾ ਪਲੇਟਫਾਰਮ ਹਰ ਕੋਈ, ਕਿਤੇ ਵੀ, ਕਿਸੇ ਵੀ ਸਮੇਂ ਗੁਣਵੱਤਾ ਵਾਲੀ ਮੈਡੀਕਲ ਸੇਵਾ ਤੱਕ ਪਹੁੰਚਯੋਗ ਬਣਾਉਂਦਾ ਹੈ',
  'AI Symptom Checker': 'AI ਲੱਛਣ ਚੈਕਰ',
  'Advanced AI analyzes symptoms and provides preliminary health assessments with high accuracy.':
      'ਉੱਚ-ਗੁਣਵੱਤਾ ਵਾਲਾ AI ਲੱਛਣਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਦਾ ਹੈ ਅਤੇ ਪ੍ਰਾਰੰਭਿਕ ਸਿਹਤ ਮੁਲਾਂਕਣ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ',
  'Video Consultations': 'ਵੀਡੀਓ ਸਲਾਹ',
  'Secure, high-quality video calls with certified doctors from the comfort of your home.':
      'ਸਰਟੀਫਾਈਡ ਡਾਕਟਰਾਂ ਨਾਲ ਘਰ ਬੈਠੇ ਸੁਖਦਾਈ, ਉੱਚ-ਗੁਣਵੱਤਾ ਵਾਲੀਆਂ ਵੀਡੀਓ ਕਾਲਾਂ',
  'Digital Health Records': 'ਸਿਹਤ ਰਿਕਾਰਡ',
  'Centralized, encrypted health records accessible to you and your healthcare providers.':
      'ਕੇਂਦਰਿਤ, ਗੁਪਤ ਸਿਹਤ ਰਿਕਾਰਡ, ਜੋ ਤੁਹਾਨੂੰ ਅਤੇ ਤੁਹਾਡੇ ਹੈਲਥਕੇਅਰ ਪ੍ਰਦਾਤਾਵਾਂ ਲਈ ਉਪਲਬਧ ਹਨ',
  'Medicine Delivery': 'ਦਵਾਈ ਡਿਲੀਵਰੀ',
  'Fast, reliable delivery of prescribed medications directly to your doorstep.':
      'ਤੁਰੰਤ ਅਤੇ ਭਰੋਸੇਯੋਗ ਦਵਾਈ ਡਿਲੀਵਰੀ ਸਿੱਧੇ ਤੁਹਾਡੇ ਦਰਵਾਜੇ ਤੱਕ',
  'Community Health': 'ਭਾਈਚਾਰਕ ਸਿਹਤ',
  'Connect with local ASHA workers and participate in community health programs.':
      'ਸਥਾਨਕ ASHA ਵਰਕਰਾਂ ਨਾਲ ਜੁੜੋ ਅਤੇ ਭਾਈਚਾਰਕ ਸਿਹਤ ਪ੍ਰੋਗਰਾਮਾਂ ਵਿੱਚ ਭਾਗ ਲਓ',
  '24/7 Support': '24/7 ਸਹਾਇਤਾ',
  'Round-the-clock customer support and emergency assistance when you need it most.':
      'ਜਦੋਂ ਤੁਹਾਨੂੰ ਸਭ ਤੋਂ ਜ਼ਿਆਦਾ ਲੋੜ ਹੋਵੇ, ਚੋਣ-ਪ੍ਰਦਾਨ ਸਹਾਇਤਾ ਅਤੇ ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ',

  // Roles
  'Choose Your Role': 'ਆਪਣਾ ਰੋਲ ਚੁਣੋ',
  'Select your role to access personalized features and tools designed specifically for your healthcare needs.':
      'ਆਪਣੀ ਸਿਹਤ ਸੇਵਾ ਦੀਆਂ ਜ਼ਰੂਰਤਾਂ ਲਈ ਵਿਸ਼ੇਸ਼ ਤੌਰ ਤੇ ਡਿਜ਼ਾਈਨ ਕੀਤੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਅਤੇ ਟੂਲਾਂ ਤੱਕ ਪਹੁੰਚ ਲਈ ਰੋਲ ਚੁਣੋ',
  'Patient': 'ਮਰੀਜ਼',
  'Book consultations, access health records, and get AI-powered symptom analysis.':
      'ਸਲਾਹ-ਮਸ਼ਵਰਾ ਬੁੱਕ ਕਰੋ, ਸਿਹਤ ਰਿਕਾਰਡ ਤੱਕ ਪਹੁੰਚ ਕਰੋ, ਅਤੇ AI ਲੱਛਣ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਾਪਤ ਕਰੋ',
  'Doctor': 'ਡਾਕਟਰ',
  'Conduct video consultations, manage patient records, and provide expert care.':
      'ਵੀਡੀਓ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਕਰੋ, ਮਰੀਜ਼ ਰਿਕਾਰਡ ਪ੍ਰਬੰਧਿਤ ਕਰੋ, ਅਤੇ ਵਿਸ਼ੇਸ਼ ਤਜਰਬੇ ਵਾਲੀ ਦੇਖਭਾਲ ਦਿਓ',
  'ASHA Worker': 'ਆਸ਼ਾ ਵਰਕਰ',
  'Support community health initiatives and coordinate patient care.':
      'ਭਾਈਚਾਰਕ ਸਿਹਤ ਪ੍ਰਯਾਸਾਂ ਨੂੰ ਸਹਾਇਤਾ ਦਿਓ ਅਤੇ ਮਰੀਜ਼ ਦੇਖਭਾਲ ਨੂੰ ਕੋਆਰਡੀਨੇਟ ਕਰੋ',
  'Pharmacy': 'ਫਾਰਮਸੀ',
  'Manage prescriptions, provide medicine delivery, and track inventory.':
      'ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ ਪ੍ਰਬੰਧਿਤ ਕਰੋ, ਦਵਾਈ ਡਿਲੀਵਰੀ ਕਰੋ, ਅਤੇ ਇਨਵੈਂਟਰੀ ਟ੍ਰੈਕ ਕਰੋ',
  'Get Started →': 'ਸ਼ੁਰੂ ਕਰੋ →'
};

// Initialize translations
export const initializeTranslations = () => {
  console.log('Translations initialized');
};

// Language helpers
export const setLanguage = (langCode) => {
  localStorage.setItem('appLanguage', langCode);
};

export const getCurrentLanguage = () => {
  return localStorage.getItem('appLanguage') || 'en';
};

export const getToggleLanguage = () => (getCurrentLanguage() === 'en' ? 'pa' : 'en');

export const getToggleLanguageName = () => (getCurrentLanguage() === 'en' ? 'ਪੰਜਾਬੀ' : 'English');

// Main translation function
export const translate = (text) => {
  const lang = getCurrentLanguage();
  if (lang === 'pa') {
    return translations[text] || text;
  }
  return text;
};

// Get all available languages
export const getAvailableLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];
