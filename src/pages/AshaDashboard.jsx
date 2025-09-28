// src/pages/AshaDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import { getPatientsByOwner, getHealthRecordsByPatient, getPrescriptionsByPatient } from '../services/storageService';
import { translate } from '../services/translationService';
import AshaPatientForm from '../components/AshaPatientForm';
import CampaignPanel from '../components/CampaignPanel';
import MedicineSearch from '../components/MedicineSearch';
import MessageVideoSection from '../components/MessageVideoSection';
import HealthRecordUploader from '../components/HealthRecordUploader';
import NearestPharmacy from '../components/NearestPharmacy';

export default function AshaDashboard() {
  const navigate = useNavigate();
  const [asha, setAsha] = useState(null);
  const [section, setSection] = useState('home');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'asha') {
      navigate('/asha/login');
      return;
    }
    
    setAsha(currentUser);
    loadAshaData(currentUser.id);
    setLoading(false);
  }, [navigate]);

  const loadAshaData = (ashaId) => {
    try {
      // Load ASHA's patients
      const ashaPatients = getPatientsByOwner('asha', ashaId);
      setPatients(ashaPatients);
    } catch (error) {
      console.error('Error loading ASHA data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePatientAdded = (newPatient) => {
    setPatients(prev => [...prev, newPatient]);
  };

  const handleHealthRecordUpload = (newRecord) => {
    // Refresh patient data to show new health record
    if (selectedPatient) {
      const updatedRecords = getHealthRecordsByPatient(selectedPatient.id);
      // You could update local state here if needed
    }
  };

  const handleMedicineSelect = (medicine) => {
    // This would open a modal with medicine details
    alert(`${translate('Medicine Details')}:\n\n${translate('Name')}: ${medicine.name}\n${translate('Company')}: ${medicine.company || translate('Not specified')}\n${translate('Dosage')}: ${medicine.dosage || translate('Not specified')}\n${translate('Category')}: ${medicine.category || translate('Not specified')}\n${translate('Price')}: ₹${medicine.price || translate('Not specified')}`);
  };

  const handleAddToCart = (medicine) => {
    // This would add medicine to cart
    alert(`${medicine.name} ${translate('added to cart')}!`);
  };

  const getPatientStats = (patient) => {
    const healthRecords = getHealthRecordsByPatient(patient.id);
    const prescriptions = getPrescriptionsByPatient(patient.id);
    
    return {
      healthRecords: healthRecords.length,
      prescriptions: prescriptions.length
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{translate('Loading dashboard...')}</p>
        </div>
      </div>
    );
  }

  if (!asha) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-xl flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {[
              { key: 'home', label: translate('Home'), icon: '🏠' },
              { key: 'add_patient', label: translate('Add Patient'), icon: '➕' },
              { key: 'patients', label: translate('Patients'), icon: '👥' },
              { key: 'records', label: translate('Health Records'), icon: '📋' },
              { key: 'medicine', label: translate('Medicine Search'), icon: '🔍' },
              { key: 'pharmacy', label: translate('Nearest Pharmacy'), icon: '🏥' },
              { key: 'chat', label: translate('Chat / Video'), icon: '💬' },
              { key: 'campaign', label: translate('Campaign'), icon: '🏆' },
              { key: 'profile', label: translate('Profile'), icon: '👤' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  section === item.key
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'hover:bg-purple-100 text-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          {/* Logout button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <span className="mr-3">🚪</span>
              {translate('Logout')}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex justify-center items-start p-6 overflow-y-auto">
          <div className="w-full max-w-6xl">
            {/* Home */}
            {section === 'home' && (
              <div className="space-y-6">
                <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {translate('Welcome back')}, {asha.name} 👩‍⚕️
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {translate('Manage your patients and provide community healthcare services')}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
                      <div className="text-sm text-gray-600">{translate('Patients Added')}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{asha.location || 'N/A'}</div>
                      <div className="text-sm text-gray-600">{translate('Location')}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">ASHA</div>
                      <div className="text-sm text-gray-600">{translate('Role')}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <button
                    onClick={() => setSection('add_patient')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">➕</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Add Patient')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Register new patients in your community')}</p>
                  </button>

                  <button
                    onClick={() => setSection('patients')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">👥</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('View Patients')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Manage your registered patients')}</p>
                  </button>

                  <button
                    onClick={() => setSection('medicine')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">🔍</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Medicine Search')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Search for medicines and information')}</p>
                  </button>

                  <button
                    onClick={() => setSection('chat')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">💬</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Consult Doctor')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Connect with doctors for patient care')}</p>
                  </button>

                  <button
                    onClick={() => setSection('campaign')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">🏆</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Campaign Progress')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Track your community health impact')}</p>
                  </button>
                </div>
              </div>
            )}

            {/* Add Patient */}
            {section === 'add_patient' && (
              <AshaPatientForm onPatientAdded={handlePatientAdded} />
            )}

            {/* Patients */}
            {section === 'patients' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate('Your Patients')}
                </h3>
                
                {patients.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {translate('No patients added yet. Start by adding your first patient!')}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {patients.map((patient) => {
                      const stats = getPatientStats(patient);
                      
                      return (
                        <div
                          key={patient.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                  {patient.photo ? (
                                    <img
                                      src={patient.photo}
                                      alt={patient.name}
                                      className="w-full h-full object-cover rounded-full"
                                    />
                                  ) : (
                                    <svg
                                      className="w-6 h-6 text-purple-600"
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
                                  <h4 className="font-medium text-gray-900">{patient.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    {patient.age} {translate('years')} • {patient.village}
                                  </p>
                                </div>
                              </div>

                              <div className="flex space-x-4 text-sm text-gray-600">
                                <span>{translate('Health Records')}: {stats.healthRecords}</span>
                                <span>{translate('Prescriptions')}: {stats.prescriptions}</span>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setSection('records');
                                }}
                                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors"
                              >
                                {translate('View Records')}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Health Records */}
            {section === 'records' && (
              <div className="space-y-6">
                {selectedPatient ? (
                  <div>
                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {translate('Health Records for')} {selectedPatient.name}
                      </h3>
                      <button
                        onClick={() => setSelectedPatient(null)}
                        className="text-sm text-purple-600 hover:underline"
                      >
                        {translate('← Back to all patients')}
                      </button>
                    </div>

                    <HealthRecordUploader
                      patientId={selectedPatient.id}
                      onUpload={handleHealthRecordUpload}
                    />

                    {/* Records List */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-md font-semibold text-gray-800 mb-4">
                        {translate('Health Records')}
                      </h4>
                      
                      {(() => {
                        const records = getHealthRecordsByPatient(selectedPatient.id);
                        return records.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">
                            {translate('No health records uploaded yet')}
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {records.map((record) => (
                              <div
                                key={record.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="font-medium text-gray-900">{record.title}</h5>
                                    <p className="text-sm text-gray-600">{record.notes}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {translate('Uploaded')}: {new Date(record.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2">
                                    {record.fileName && (
                                      <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors">
                                        {translate('View File')}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-500">
                      {translate('Select a patient to view their health records')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Medicine Search */}
            {section === 'medicine' && (
              <MedicineSearch
                onSelect={handleMedicineSelect}
                showAddToCart={true}
                onAddToCart={handleAddToCart}
              />
            )}

            {/* Nearest Pharmacy */}
            {section === 'pharmacy' && (
              <NearestPharmacy
                userLocation={asha.location}
                onPharmacySelect={(pharmacy) => {
                  alert(`${translate('Selected Pharmacy')}: ${pharmacy.name}\n${translate('Phone')}: ${pharmacy.phone || translate('Not available')}\n${translate('Address')}: ${pharmacy.address || translate('Not available')}`);
                }}
              />
            )}

            {/* Chat / Video */}
            {section === 'chat' && (
              <MessageVideoSection
                userId={asha.id}
                userName={asha.name}
                messages={[]}
                onSendMessage={() => {}}
                showCreateVisit={true}
                onVisitCreated={(visit) => {
                  alert(`${translate('Visit created successfully!')} ${translate('Visit ID')}: ${visit.id}`);
                }}
              />
            )}

            {/* Campaign */}
            {section === 'campaign' && (
              <CampaignPanel />
            )}

            {/* Profile */}
            {section === 'profile' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate('Profile')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Name')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{asha.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Phone')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{asha.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Email')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{asha.email || translate('Not specified')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Location')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{asha.location || translate('Not specified')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Aadhaar Number')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{asha.aadhaar || translate('Not specified')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}