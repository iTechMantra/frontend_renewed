// src/pages/LandingPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentSession } from '../services/authService';
import { initializeStorage } from '../services/storageService';
import { translate, initializeTranslations, getToggleLanguage, getToggleLanguageName } from '../services/translationService';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Initialize storage and translations
    initializeStorage();
    initializeTranslations();
    
    // Check if user is already logged in
    const session = getCurrentSession();
    if (session?.current) {
      navigate(`/${session.current.role}/dashboard`);
      return;
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  const handleRoleSelect = (role) => {
    switch (role) {
      case 'user':
        navigate('/user/login');
        break;
      case 'doctor':
        navigate('/doctor/login');
        break;
      case 'asha':
        navigate('/asha/login');
        break;
      case 'pharmacy':
        navigate('/PharmacyDashboard');
        break;
      default:
        break;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                🏛
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {translate('E-Sannidhi')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Online Status */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isOnline 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span>{isOnline ? translate('Online') : translate('Offline')}</span>
              </div>
              
              {/* Language Toggle */}
              <button
                onClick={() => {
                  const newLang = getToggleLanguage();
                  localStorage.setItem('appLanguage', newLang);
                  window.location.reload();
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {getToggleLanguageName()}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {translate('Welcome to')} <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{translate('E-Sannidhi')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {translate('Your comprehensive telemedicine platform connecting patients, doctors, ASHA workers, and pharmacies for better healthcare access')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => {
                // The AI Symptom Checker is now available via the chatbot widget
                alert(translate('AI Symptom Checker is now available via the chatbot widget in the bottom right corner!'));
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              🔍 {translate('AI Symptom Checker')}
            </button>
            
            <button
              onClick={() => navigate('/pharmacy')}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              💊 {translate('Pharmacy')}
            </button>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {translate('Choose Your Role')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {translate('Select your role to access the appropriate dashboard and features')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* User */}
            <div
              onClick={() => handleRoleSelect('user')}
              className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{translate('User')}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {translate('Access telemedicine services, health records, and connect with healthcare providers')}
                </p>
                <div className="text-blue-600 font-semibold group-hover:text-blue-700">
                  {translate('Login / Sign Up')} →
                </div>
              </div>
            </div>

            {/* Doctor */}
            <div
              onClick={() => handleRoleSelect('doctor')}
              className="group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">👩‍⚕️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{translate('Doctor')}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {translate('Provide telemedicine consultations, manage patients, and prescribe medications')}
                </p>
                <div className="text-green-600 font-semibold group-hover:text-green-700">
                  {translate('Login / Sign Up')} →
                </div>
              </div>
            </div>

            {/* ASHA */}
            <div
              onClick={() => handleRoleSelect('asha')}
              className="group bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">👩‍⚕️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{translate('ASHA / Volunteer')}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {translate('Community health worker - register patients, provide basic care, and connect with doctors')}
                </p>
                <div className="text-purple-600 font-semibold group-hover:text-purple-700">
                  {translate('Login / Sign Up')} →
                </div>
              </div>
            </div>

            {/* Pharmacy */}
            <div
              onClick={() => handleRoleSelect('pharmacy')}
              className="group bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-yellow-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{translate('Pharmacy')}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {translate('Browse medicines, place orders, and get prescriptions delivered to your doorstep')}
                </p>
                <div className="text-yellow-600 font-semibold group-hover:text-yellow-700">
                  {translate('Enter Pharmacy')} →
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {translate('Key Features')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {translate('Comprehensive healthcare solutions at your fingertips')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📹</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{translate('Video Consultations')}</h3>
              <p className="text-gray-600">
                {translate('Connect with doctors through secure video calls for remote consultations')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{translate('Health Records')}</h3>
              <p className="text-gray-600">
                {translate('Store and manage your health records digitally for easy access')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{translate('Medicine Delivery')}</h3>
              <p className="text-gray-600">
                {translate('Order medicines online and get them delivered to your doorstep')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{translate('AI Symptom Checker')}</h3>
              <p className="text-gray-600">
                {translate('Get preliminary health insights using our AI-powered symptom analysis')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{translate('Community Health')}</h3>
              <p className="text-gray-600">
                {translate('ASHA workers can register and manage community health programs')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{translate('Multi-language')}</h3>
              <p className="text-gray-600">
                {translate('Available in English and Punjabi for better accessibility')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  🏛
                </div>
                <h3 className="text-xl font-bold">{translate('E-Sannidhi')}</h3>
              </div>
              <p className="text-gray-400">
                {translate('Government of India Initiative')}
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{translate('Quick Links')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleRoleSelect('user')} className="hover:text-white transition-colors">{translate('User Login')}</button></li>
                <li><button onClick={() => handleRoleSelect('doctor')} className="hover:text-white transition-colors">{translate('Doctor Login')}</button></li>
                <li><button onClick={() => handleRoleSelect('asha')} className="hover:text-white transition-colors">{translate('ASHA Login')}</button></li>
                <li><button onClick={() => navigate('/pharmacy')} className="hover:text-white transition-colors">{translate('Pharmacy')}</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{translate('Contact')}</h4>
              <p className="text-gray-400">
                {translate('For support and assistance')}
              </p>
              <p className="text-gray-400">
                {translate('Email')}: support@esannidhi.gov.in
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} {translate('E-Sannidhi')}. {translate('All rights reserved')}.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}