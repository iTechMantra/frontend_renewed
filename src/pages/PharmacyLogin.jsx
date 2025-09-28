// src/pages/PharmacyLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPharmacyByPhone, createPharmacy } from '../services/storageService';
import { setCurrentSession } from '../services/authService';
import { translate } from '../services/translationService';

export default function PharmacyLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    license: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleLogin = async (e) => {
  e.preventDefault();
  
  if (!formData.phone.trim()) {
    setError('Phone number is required');
    return;
  }

  if (!formData.password.trim()) {
    setError('Password is required');
    return;
  }

  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const pharmacy = getPharmacyByPhone(formData.phone);
    
    if (pharmacy && pharmacy.password === formData.password) {
      setCurrentSession({ 
        current: { 
          role: 'pharmacy', 
          id: pharmacy.id, 
          name: pharmacy.name, 
          loggedAt: new Date().toISOString() 
        } 
      });
      
      setSuccess('Login successful!');
      setTimeout(() => {
        navigate('/pharmacy/dashboard');
      }, 1000);
    } else {
      setError('Invalid phone number or password.');
    }
  } catch (error) {
    setError('An error occurred while logging in');
    console.error('Login error:', error);
  } finally {
    setLoading(false);
  }
};

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Pharmacy name is required');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!formData.password.trim()) {
  setError('Password is required');
  return;
}

    setLoading(true);
    setError('');
    setSuccess('');

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
        password: formData.password.trim(), 
        role: 'pharmacy'
      });

      if (result.success) {
        setCurrentSession({ 
          current: { 
            role: 'pharmacy', 
            id: result.pharmacy.id, 
            name: result.pharmacy.name, 
            loggedAt: new Date().toISOString() 
          } 
        });
        
        setSuccess('Account created successfully!');
        setTimeout(() => {
          navigate('/pharmacy/dashboard');
        }, 1500);
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (error) {
      setError('An error occurred while creating account');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-yellow-100 font-sans">
      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-yellow-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {mode === 'login' ? translate('Pharmacy Login') : translate('Create Pharmacy Account')}
            </h2>
            <p className="text-gray-600">
              {mode === 'login' 
                ? translate('Login to manage your pharmacy')
                : translate('Join E-Sannidhi as a pharmacy partner')
              }
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex mb-6 space-x-4">
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                mode === 'login'
                  ? 'bg-yellow-600 text-white shadow'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setMode('login')}
            >
              {translate('Login')}
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                mode === 'signup'
                  ? 'bg-yellow-600 text-white shadow'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setMode('signup')}
            >
              {translate('Sign Up')}
            </button>
          </div>

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Phone Number')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={translate('Enter phone number')}
                />
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
    {translate('Password')} *
             </label>
             <input
             type="password"
             name="password"
             value={formData.password}
             onChange={handleInputChange}
             required
             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
             placeholder={translate('Enter password')}
            />
            </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? translate('Logging in...') : translate('Login')}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Pharmacy Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Pharmacy Name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={translate('Enter pharmacy name')}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Phone Number')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={translate('Enter phone number')}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Email')} (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={translate('Enter email address')}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Address')} (Optional)
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={translate('Enter pharmacy address')}
                />
              </div>

              {/* License */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('License Number')} (Optional)
                </label>
                <input
                  type="text"
                  name="license"
                  value={formData.license}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={translate('Enter license number')}
                />
              </div>

              {/* Password */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate('Password')} *
               </label>
               <input
               type="password"
               name="password"
               value={formData.password}
               onChange={handleInputChange}
               required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder={translate('Create password')}
             />
            </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? translate('Creating Account...') : translate('Create Account')}
              </button>
            </form>
          )}

          {/* Back to Home Link */}
          <p className="text-sm text-gray-600 mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-yellow-700 font-semibold hover:underline"
            >
              {translate('Back to Home')}
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-yellow-900 text-white py-4 text-center text-sm mt-8 shadow-inner">
        © {new Date().getFullYear()} {translate('E-Sannidhi')} | {translate('Government of India Initiative')}
      </footer>
    </div>
  );
}