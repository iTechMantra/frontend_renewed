// src/components/ProfileView.jsx
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { translate } from '../services/translationService';

export default function ProfileView({ onUpdate }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        location: currentUser.location || ''
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update user data in localStorage
      const role = user.role;
      const storageKey = role === 'doctor' ? 'doctors' : role === 'asha' ? 'ashas' : 'users';
      const users = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          ...formData,
          updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem(storageKey, JSON.stringify(users));
        
        // Update local state
        const updatedUser = users[userIndex];
        setUser(updatedUser);
        
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Notify parent component
        if (onUpdate) {
          onUpdate(updatedUser);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      location: user.location || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">{translate('Loading profile...')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {translate('Profile')}
        </h3>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {translate('Edit Profile')}
          </button>
        )}
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

      {/* Profile Avatar */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          {user.photo ? (
            <img
              src={user.photo}
              alt={user.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </div>
        
        <div>
          <h4 className="text-xl font-semibold text-gray-900">{user.name}</h4>
          <p className="text-sm text-gray-600 capitalize">{user.role}</p>
          {user.specialization && (
            <p className="text-sm text-gray-600">{user.specialization}</p>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Full Name')}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{user.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Mobile Number')}
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{user.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Email')}
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{user.email || translate('Not specified')}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Location')}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{user.location || translate('Not specified')}</p>
          )}
        </div>

        {/* Role-specific fields */}
        {user.role === 'doctor' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translate('Specialization')}
              </label>
              <p className="text-gray-900">{user.specialization || translate('Not specified')}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translate('License Number')}
              </label>
              <p className="text-gray-900">{user.licenseNumber || translate('Not specified')}</p>
            </div>
          </>
        )}

        {user.role === 'asha' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate('Aadhaar Number')}
            </label>
            <p className="text-gray-900">{user.aadhaar || translate('Not specified')}</p>
          </div>
        )}

        {/* Account Information */}
        <div className="border-t border-gray-200 pt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">
            {translate('Account Information')}
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">{translate('Member since')}:</span>
              <span className="ml-2 text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            {user.updatedAt && (
              <div>
                <span className="text-gray-600">{translate('Last updated')}:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? translate('Saving...') : translate('Save Changes')}
          </button>
          
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            {translate('Cancel')}
          </button>
        </div>
      )}
    </div>
  );
}
