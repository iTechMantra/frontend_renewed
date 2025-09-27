// src/components/AshaPatientForm.jsx
import { useState } from 'react';
import { getCurrentUser } from '../services/authService';
import { createPatient } from '../services/storageService';
import { translate } from '../services/translationService';

export default function AshaPatientForm({ onPatientAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    village: '',
    address: '',
    notes: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Patient name is required');
      return;
    }

    if (!formData.age.trim()) {
      setError('Patient age is required');
      return;
    }

    if (!formData.gender.trim()) {
      setError('Patient gender is required');
      return;
    }

    if (!formData.village.trim()) {
      setError('Village is required');
      return;
    }

    if (isNaN(formData.age) || formData.age < 0 || formData.age > 120) {
      setError('Please enter a valid age');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setError('Please log in to add patients');
        return;
      }

      const patientData = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        phone: formData.phone.trim(),
        village: formData.village.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        ownerRole: 'asha',
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        assignedDoctorId: null,
        status: 'active'
      };

      const result = createPatient(patientData);
      
      if (result.success) {
        setSuccess('Patient added successfully!');
        
        // Reset form
        setFormData({
          name: '',
          age: '',
          gender: '',
          phone: '',
          village: '',
          address: '',
          notes: ''
        });
        
        // Notify parent component
        if (onPatientAdded) {
          onPatientAdded(result.patient);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to add patient');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      setError('An error occurred while adding the patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {translate('Add New Patient')}
      </h3>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Patient Name')} *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={translate('Enter patient\'s full name')}
          />
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate('Age')} *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              min="0"
              max="120"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={translate('Enter age')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate('Gender')} *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">{translate('Select gender')}</option>
              <option value="male">{translate('Male')}</option>
              <option value="female">{translate('Female')}</option>
              <option value="other">{translate('Other')}</option>
            </select>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Phone Number')} ({translate('Optional')})
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={translate('Enter phone number')}
          />
        </div>

        {/* Village */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Village/Location')} *
          </label>
          <input
            type="text"
            name="village"
            value={formData.village}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={translate('Enter village or location')}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Address')} ({translate('Optional')})
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={translate('Enter detailed address')}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Notes')} ({translate('Optional')})
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={translate('Enter any additional notes about the patient')}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? translate('Adding Patient...') : translate('Add Patient')}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>{translate('Note')}:</strong> {translate('All fields marked with * are required. The patient will be registered under your ASHA account and can be managed through your dashboard.')}
        </p>
      </div>
    </div>
  );
}
