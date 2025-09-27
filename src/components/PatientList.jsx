// src/components/PatientList.jsx
import { useState, useEffect } from 'react';
import { getPatients } from '../services/storageService';
import { translate } from '../services/translationService';

export default function PatientList({ onSelectPatient, onStartConsultation }) {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    try {
      const allPatients = getPatients();
      setPatients(allPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
      setError('Failed to load patients');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOwnerChange = (e) => {
    setSelectedOwner(e.target.value);
  };

  const handlePatientSelect = (patient) => {
    if (onSelectPatient) {
      onSelectPatient(patient);
    }
  };

  const handleStartConsultation = (patient) => {
    if (onStartConsultation) {
      onStartConsultation(patient);
    }
  };

  // Filter patients based on search term and owner
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);
    
    const matchesOwner = !selectedOwner || patient.ownerRole === selectedOwner;
    
    return matchesSearch && matchesOwner;
  });

  // Get unique owners
  const owners = [...new Set(patients.map(patient => patient.ownerRole))];

  const getOwnerDisplayName = (ownerRole) => {
    switch (ownerRole) {
      case 'user':
        return translate('Self-registered');
      case 'asha':
        return translate('ASHA Worker');
      case 'doctor':
        return translate('Doctor');
      default:
        return ownerRole;
    }
  };

  const getOwnerColor = (ownerRole) => {
    switch (ownerRole) {
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'asha':
        return 'bg-purple-100 text-purple-800';
      case 'doctor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {translate('All Patients')}
        </h3>
        
        <button
          onClick={loadPatients}
          className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors"
        >
          {translate('Refresh')}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Search Patients')}
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={translate('Enter patient name, village, or phone number')}
          />
        </div>

        {/* Owner Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Registered By')}
          </label>
          <select
            value={selectedOwner}
            onChange={handleOwnerChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{translate('All Patients')}</option>
            {owners.map(owner => (
              <option key={owner} value={owner}>
                {getOwnerDisplayName(owner)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patients List */}
      <div className="space-y-4">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {translate('No patients found')}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {translate('Try adjusting your search terms or filters')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {patient.photo ? (
                        <img
                          src={patient.photo}
                          alt={patient.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <svg
                          className="w-6 h-6 text-blue-600"
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
                      <h4 className="font-medium text-gray-900">
                        {patient.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {patient.age} {translate('years')} • {patient.gender}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOwnerColor(patient.ownerRole)}`}>
                    {getOwnerDisplayName(patient.ownerRole)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">{translate('Village')}:</span>
                    <span className="ml-2 text-gray-900">{patient.village}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">{translate('Phone')}:</span>
                    <span className="ml-2 text-gray-900">{patient.phone}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">{translate('Registered')}:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {patient.notes && (
                  <div className="mt-3">
                    <span className="text-gray-600 text-sm">{translate('Notes')}:</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {patient.notes}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handlePatientSelect(patient)}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors"
                  >
                    {translate('View Profile')}
                  </button>
                  
                  <button
                    onClick={() => handleStartConsultation(patient)}
                    className="flex-1 px-3 py-2 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors"
                  >
                    {translate('Start Consult')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredPatients.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {translate('Showing')} {filteredPatients.length} {translate('of')} {patients.length} {translate('patients')}
            </span>
            
            <div className="flex space-x-4">
              {owners.map(owner => (
                <span key={owner} className="text-gray-600">
                  {getOwnerDisplayName(owner)}: {patients.filter(p => p.ownerRole === owner).length}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
