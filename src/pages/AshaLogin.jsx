// src/pages/AshaLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOTP, verifyOTP } from '../services/otpService';
import { loginAsha, setCurrentSession } from '../services/authService';
import { translate } from '../services/translationService';

export default function AshaLogin() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('password'); // 'password' or 'otp'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = loginAsha(phone, password);
      
      if (result.success) {
        setSuccess('Login successful!');
        setTimeout(() => {
          navigate('/asha/dashboard');
        }, 1000);
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred while logging in');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = sendOTP(phone, 'login');
      
      if (result.success) {
        setSuccess('OTP sent successfully!');
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (error) {
      setError('An error occurred while sending OTP');
      console.error('OTP send error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = verifyOTP(phone, otp, 'login');
      
      if (result.success) {
        // Find ASHA by phone and create session
        const ashas = JSON.parse(localStorage.getItem('ashas') || '[]');
        const asha = ashas.find(a => a.phone === phone);
        
        if (asha) {
          const session = {
            current: {
              role: 'asha',
              id: asha.id,
              name: asha.name,
              loggedAt: new Date().toISOString()
            }
          };
          setCurrentSession(session);
          
          setSuccess('Login successful!');
          setTimeout(() => {
            navigate('/asha/dashboard');
          }, 1000);
        } else {
          setError('ASHA worker not found. Please sign up first.');
        }
      } else {
        setError(result.error || 'Invalid OTP');
      }
    } catch (error) {
      setError('An error occurred while verifying OTP');
      console.error('OTP verify error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-purple-100 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-600 text-white py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-3 px-4">
          <div
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="text-purple-700 font-bold">🏛</span>
          </div>
          <h1
            className="text-2xl font-bold tracking-wide cursor-pointer"
            onClick={() => navigate('/')}
          >
            {translate('E-Sannidhi')}
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-purple-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {translate('ASHA Login')}
            </h2>
            <p className="text-gray-600">
              {translate('Access your ASHA dashboard')}
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

          {/* Method Toggle */}
          <div className="flex mb-6 space-x-4">
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                method === 'password'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setMethod('password')}
            >
              {translate('Password')}
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                method === 'otp'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setMethod('otp')}
            >
              {translate('OTP')}
            </button>
          </div>

          {/* Password Login */}
          {method === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Mobile Number')} *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={translate('Enter mobile number')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Password')} *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={translate('Enter password')}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? translate('Logging in...') : translate('Login')}
              </button>
            </form>
          )}

          {/* OTP Login */}
          {method === 'otp' && (
            <form onSubmit={handleOTPLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Mobile Number')} *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={translate('Enter mobile number')}
                />
              </div>
              
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading || !phone.trim()}
                className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? translate('Sending...') : translate('Send OTP')}
              </button>
              
              {success && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('Enter OTP')} *
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg tracking-widest"
                    placeholder="000000"
                  />
                </div>
              )}
              
              {success && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? translate('Verifying...') : translate('Verify OTP')}
                </button>
              )}
            </form>
          )}

          {/* Signup Link */}
          <p className="text-sm text-gray-600 mt-6 text-center">
            {translate('Don\'t have an account?')}{' '}
            <button
              onClick={() => navigate('/asha/signup')}
              className="text-purple-700 font-semibold hover:underline"
            >
              {translate('Sign up')}
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-purple-700 text-white py-4 text-center text-sm mt-8 shadow-inner">
        © {new Date().getFullYear()} {translate('E-Sannidhi')} | {translate('Government of India Initiative')}
      </footer>
    </div>
  );
}