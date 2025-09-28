// src/pages/DoctorSignup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOTP, verifyOTP } from '../services/otpService';
import { registerDoctor, setCurrentSession } from '../services/authService';
import { translate } from '../services/translationService';

export default function DoctorSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: '',
    location: '',
    licenseNumber: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
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

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!formData.specialization.trim()) {
      setError('Specialization is required');
      return;
    }

    if (!formData.licenseNumber.trim()) {
      setError('License number is required');
      return;
    }

    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = sendOTP(formData.phone, 'signup');
      
      if (result.success) {
        setStep('otp');
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

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('Please enter OTP');
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
      const result = verifyOTP(formData.phone, otp, 'signup');
      
      if (result.success) {
        // Register doctor
        const doctorData = {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          specialization: formData.specialization.trim(),
          location: formData.location.trim(),
          licenseNumber: formData.licenseNumber.trim(),
          password: formData.password,
          role: 'doctor'
        };

        const registerResult = registerDoctor(doctorData);
        
        if (registerResult.success) {
          // Set session
          const session = {
            current: {
              role: 'doctor',
              id: registerResult.user.id,
              name: registerResult.user.name,
              loggedAt: new Date().toISOString()
            }
          };
          setCurrentSession(session);
          
          setSuccess('Account created successfully!');
          setTimeout(() => {
            navigate('/doctor/dashboard');
          }, 1500);
        } else {
          setError(registerResult.error || 'Failed to create account');
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

  const handleBackToForm = () => {
    setStep('form');
    setOtp('');
    setError('');
    setSuccess('');
  };

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Gynecology',
    'Orthopedics',
    'Neurology',
    'Psychiatry',
    'Ophthalmology',
    'ENT',
    'Radiology',
    'Anesthesiology',
    'Emergency Medicine',
    'Internal Medicine',
    'Surgery'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100 font-sans">

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-green-100">

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

          {step === 'form' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Full Name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={translate('Enter your full name')}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Mobile Number')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={translate('Enter mobile number')}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={translate('Enter email address')}
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Specialization')} *
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">{translate('Select specialization')}</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* License Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('License Number')} *
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={translate('Enter medical license number')}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Location')} (Optional)
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={translate('Enter your location')}
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
                  minLength="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={translate('Enter password (min 6 characters)')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? translate('Sending OTP...') : translate('Send OTP')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  {translate('OTP sent to')} {formData.phone}
                </p>
                <p className="text-sm text-gray-500">
                  {translate('Please enter the 6-digit OTP')}
                </p>
              </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg tracking-widest"
                  placeholder="000000"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBackToForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  {translate('Back')}
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? translate('Verifying...') : translate('Verify OTP')}
                </button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <p className="text-sm text-gray-600 mt-6 text-center">
            {translate('Already have an account?')}{' '}
            <button
              onClick={() => navigate('/doctor/login')}
              className="text-green-700 font-semibold hover:underline"
            >
              {translate('Login')}
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-4 text-center text-sm mt-8 shadow-inner">
        © {new Date().getFullYear()} {translate('E-Sannidhi')} | {translate('Government of India Initiative')}
      </footer>
    </div>
  );
}