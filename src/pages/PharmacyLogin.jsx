// src/pages/PharmacyLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPharmacyByPhone, createPharmacy } from '../services/storageService';
import { setCurrentUser, setCurrentRole } from '../services/authService';
import { translate } from '../services/translationService';

export default function PharmacyLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    license: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const pharmacy = getPharmacyByPhone(formData.phone);
      
      if (pharmacy) {
        // Set current user and role
        setCurrentUser(pharmacy);
        setCurrentRole('pharmacy');
        
        // Navigate to pharmacy dashboard
        navigate('/pharmacy/dashboard');
      } else {
        setError('Pharmacy not found. Please check your phone number or sign up.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if pharmacy already exists
      const existingPharmacy = getPharmacyByPhone(formData.phone);
      if (existingPharmacy) {
        setError('Pharmacy with this phone number already exists.');
        return;
      }

      // Create new pharmacy
      const result = createPharmacy({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        license: formData.license.trim(),
        role: 'pharmacy'
      });

      if (result.success) {
        // Set current user and role
        setCurrentUser(result.pharmacy);
        setCurrentRole('pharmacy');
        
        // Navigate to pharmacy dashboard
        navigate('/pharmacy/dashboard');
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
            🏛
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? translate('Pharmacy Login') : translate('Pharmacy Signup')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              {translate('Or')}{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="font-medium text-yellow-600 hover:text-yellow-500"
              >
                {translate('create a new pharmacy account')}
              </button>
            </>
          ) : (
            <>
              {translate('Or')}{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="font-medium text-yellow-600 hover:text-yellow-500"
              >
                {translate('sign in to existing account')}
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={isLogin ? handleLogin : handleSignup}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {translate('Pharmacy Name')} *
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder={translate('Enter pharmacy name')}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                {translate('Phone Number')} *
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder={translate('Enter phone number')}
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {translate('Email')}
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      placeholder={translate('Enter email address')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    {translate('Address')}
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      placeholder={translate('Enter pharmacy address')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="license" className="block text-sm font-medium text-gray-700">
                    {translate('License Number')}
                  </label>
                  <div className="mt-1">
                    <input
                      id="license"
                      name="license"
                      type="text"
                      value={formData.license}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      placeholder={translate('Enter license number')}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLogin ? translate('Signing in...') : translate('Creating account...')}
                  </div>
                ) : (
                  isLogin ? translate('Sign In') : translate('Create Account')
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{translate('Or')}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
              >
                {translate('Back to Home')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}