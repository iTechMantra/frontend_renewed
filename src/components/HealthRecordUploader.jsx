// src/components/HealthRecordUploader.jsx
import { useState } from 'react';
import { createHealthRecord } from '../services/storageService';
import { translate } from '../services/translationService';

export default function HealthRecordUploader({ patientId, onUpload }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        setError('File type not supported. Please upload JPEG, PNG, GIF, PDF, or TXT files.');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!notes.trim()) {
      setError('Notes are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let fileData = null;
      let fileName = null;
      
      if (selectedFile) {
        fileData = await convertFileToBase64(selectedFile);
        fileName = selectedFile.name;
      }

      const recordData = {
        patientId,
        title: title.trim(),
        notes: notes.trim(),
        fileName,
        fileData,
        uploadedBy: 'user', // This will be set by the calling component
        uploadedAt: new Date().toISOString()
      };

      const result = createHealthRecord(recordData);
      
      if (result.success) {
        setSuccess('Health record uploaded successfully!');
        
        // Reset form
        setTitle('');
        setNotes('');
        setSelectedFile(null);
        
        // Notify parent component
        if (onUpload) {
          onUpload(result.record);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to upload health record');
      }
    } catch (error) {
      console.error('Error uploading health record:', error);
      setError('An error occurred while uploading the file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {translate('Upload Health Record')}
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
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Title')} *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={translate('Enter record title')}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Notes')} *
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={translate('Enter detailed notes about this health record')}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Attach File')} ({translate('Optional')})
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>{translate('Upload a file')}</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.txt"
                  />
                </label>
                <p className="pl-1">{translate('or drag and drop')}</p>
              </div>
              <p className="text-xs text-gray-500">
                {translate('PNG, JPG, GIF, PDF, TXT up to 5MB')}
              </p>
            </div>
          </div>
          
          {selectedFile && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                {translate('Selected file')}: {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {translate('Size')}: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? translate('Uploading...') : translate('Upload Record')}
        </button>
      </form>
    </div>
  );
}
