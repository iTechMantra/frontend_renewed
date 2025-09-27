// src/pages/DoctorDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import { getPatients, getWaitingVisits, updateVisit, createPrescription, updateDoctorStats, createPrescriptionForPharmacy } from '../services/storageService';
import { translate } from '../services/translationService';
import WaitingRoom from '../components/WaitingRoom';
import DoctorStatsPanel from '../components/DoctorStatsPanel';
import PatientList from '../components/PatientList';
import MessageVideoSection from '../components/MessageVideoSection';
import JitsiMeetingWrapper from '../components/JitsiMeetingWrapper';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [section, setSection] = useState('home');
  const [patients, setPatients] = useState([]);
  const [waitingVisits, setWaitingVisits] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeVideoRoom, setActiveVideoRoom] = useState(null);
  const [videoParticipant, setVideoParticipant] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'doctor') {
      navigate('/doctor/login');
      return;
    }
    
    setDoctor(currentUser);
    loadDoctorData();
    setLoading(false);
  }, [navigate]);

  const loadDoctorData = () => {
    try {
      // Load all patients (both user-registered and ASHA-added)
      const allPatients = getPatients();
      setPatients(allPatients);

      // Load waiting visits
      const waiting = getWaitingVisits();
      setWaitingVisits(waiting);
    } catch (error) {
      console.error('Error loading doctor data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAttendPatient = (visit) => {
    try {
      // Update visit status to in-progress
      const updatedVisit = updateVisit(visit.id, {
        status: 'in_progress',
        doctorId: doctor.id,
        attendedAt: new Date().toISOString()
      });

      if (updatedVisit) {
        // Remove from waiting list
        setWaitingVisits(prev => prev.filter(v => v.id !== visit.id));
        
        // Set selected patient
        const patient = patients.find(p => p.id === visit.patientId);
        if (patient) {
          setSelectedPatient(patient);
          setSection('chat');
        }
      }
    } catch (error) {
      console.error('Error attending patient:', error);
      alert('Failed to attend patient');
    }
  };

  const handleCompleteVisit = (patientId, prescriptionText) => {
    try {
      if (!prescriptionText.trim()) {
        alert('Please enter prescription details');
        return;
      }

      // Create prescription for patient
      const prescriptionData = {
        patientId,
        doctorId: doctor.id,
        doctorName: doctor.name,
        text: prescriptionText.trim(),
        createdAt: new Date().toISOString()
      };

      createPrescription(prescriptionData);

      // Also create prescription for pharmacy with patient ID only (privacy)
      const pharmacyPrescriptionData = {
        doctorId: doctor.id,
        doctorName: doctor.name,
        text: prescriptionText.trim(),
        pharmacyId: 'default-pharmacy', // In real app, this would be selected pharmacy
        createdAt: new Date().toISOString()
      };

      createPrescriptionForPharmacy(pharmacyPrescriptionData, patientId);

      // Update doctor stats
      updateDoctorStats(doctor.id, {
        attendedCount: 1
      });

      alert('Visit completed and prescription added successfully!');
      
      // Clear selected patient
      setSelectedPatient(null);
      setSection('home');
    } catch (error) {
      console.error('Error completing visit:', error);
      alert('Failed to complete visit');
    }
  };

  const handleStartVideoCall = (patient) => {
    const roomName = `doctor_consult_${patient.id}_${Date.now()}`;
    setActiveVideoRoom(roomName);
    setVideoParticipant(patient.name);
  };

  const handleEndVideoCall = () => {
    setActiveVideoRoom(null);
    setVideoParticipant('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{translate('Loading dashboard...')}</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navbar */}
      <header className="bg-white shadow-md flex justify-between items-center px-6 py-3">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shadow">
            🏛
          </div>
          <h1 className="text-xl font-bold text-green-700">{translate('E-Sannidhi')}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {translate('Dr.')} {doctor.name}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            {translate('Logout')}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-xl flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {[
              { key: 'home', label: translate('Home'), icon: '🏠' },
              { key: 'patients', label: translate('Patients'), icon: '👥' },
              { key: 'waiting', label: translate('Waiting Room'), icon: '⏳' },
              { key: 'chat', label: translate('Chat / Video'), icon: '💬' },
              { key: 'prescriptions', label: translate('Prescriptions'), icon: '💊' },
              { key: 'stats', label: translate('Statistics'), icon: '📊' },
              { key: 'profile', label: translate('Profile'), icon: '👤' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  section === item.key
                    ? 'bg-green-600 text-white shadow-md'
                    : 'hover:bg-green-100 text-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex justify-center items-start p-6 overflow-y-auto">
          <div className="w-full max-w-6xl">
            {/* Video Call */}
            {activeVideoRoom && (
              <div className="mb-6 bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold mb-2">
                  {translate('Video Call with')} {videoParticipant}
                </h3>
                <JitsiMeetingWrapper
                  roomName={activeVideoRoom}
                  displayName={doctor.name}
                  onEnd={handleEndVideoCall}
                />
                <button
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors"
                  onClick={handleEndVideoCall}
                >
                  {translate('End Call')}
                </button>
              </div>
            )}

            {/* Home */}
            {section === 'home' && (
              <div className="space-y-6">
                <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {translate('Welcome')}, {translate('Dr.')} {doctor.name} 👩‍⚕️
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {translate('Manage your patients and provide telemedicine services')}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
                      <div className="text-sm text-gray-600">{translate('Total Patients')}</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{waitingVisits.length}</div>
                      <div className="text-sm text-gray-600">{translate('Waiting')}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{doctor.specialization || 'N/A'}</div>
                      <div className="text-sm text-gray-600">{translate('Specialization')}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{doctor.licenseNumber || 'N/A'}</div>
                      <div className="text-sm text-gray-600">{translate('License')}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <button
                    onClick={() => setSection('waiting')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">⏳</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Waiting Room')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Attend waiting patients')}</p>
                  </button>

                  <button
                    onClick={() => setSection('patients')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">👥</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('All Patients')}</h3>
                    <p className="text-gray-600 text-sm">{translate('View and manage all patients')}</p>
                  </button>

                  <button
                    onClick={() => setSection('stats')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">📊</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Statistics')}</h3>
                    <p className="text-gray-600 text-sm">{translate('View your performance metrics')}</p>
                  </button>
                </div>
              </div>
            )}

            {/* Patients */}
            {section === 'patients' && (
              <PatientList
                onSelectPatient={setSelectedPatient}
                onStartConsultation={handleStartVideoCall}
              />
            )}

            {/* Waiting Room */}
            {section === 'waiting' && (
              <WaitingRoom onAttendPatient={handleAttendPatient} />
            )}

            {/* Chat / Video */}
            {section === 'chat' && (
              <div className="space-y-6">
                {selectedPatient ? (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {translate('Consultation with')} {selectedPatient.name}
                    </h3>
                    
                    <MessageVideoSection
                      userId={selectedPatient.id}
                      userName={selectedPatient.name}
                      messages={[]}
                      onSendMessage={() => {}}
                    />
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">
                        {translate('Complete Visit')}
                      </h4>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows="4"
                        placeholder={translate('Enter prescription details...')}
                        id="prescription-text"
                      />
                      <button
                        onClick={() => {
                          const prescriptionText = document.getElementById('prescription-text').value;
                          handleCompleteVisit(selectedPatient.id, prescriptionText);
                        }}
                        className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      >
                        {translate('Complete Visit')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-500">
                      {translate('Select a patient from the waiting room or patients list to start consultation')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Prescriptions */}
            {section === 'prescriptions' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate('Prescriptions')}
                </h3>
                <p className="text-gray-500 text-center py-8">
                  {translate('Prescriptions will appear here after completing patient visits')}
                </p>
              </div>
            )}

            {/* Statistics */}
            {section === 'stats' && (
              <DoctorStatsPanel />
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
                    <p className="mt-1 text-sm text-gray-900">{doctor.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Specialization')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{doctor.specialization || translate('Not specified')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Phone')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{doctor.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Email')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{doctor.email || translate('Not specified')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Location')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{doctor.location || translate('Not specified')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('License Number')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{doctor.licenseNumber || translate('Not specified')}</p>
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