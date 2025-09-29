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

// Dummy data for development
const DUMMY_PATIENTS = [
  {
    id: 'p1',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '+91-9876543210',
    address: 'Village: Bandargalli, Tehsil: Adra, District: Purulia, West Bengal',
    medicalHistory: ['Diabetes', 'Hypertension'],
    lastVisit: '2024-09-20T10:30:00Z',
    registeredBy: 'ASHA'
  },
  {
    id: 'p2',
    name: 'Priya Sharma',
    age: 32,
    gender: 'Female',
    phone: '+91-9123456789',
    address: 'Village: Jhalda, District: Purulia, West Bengal',
    medicalHistory: ['Anemia'],
    lastVisit: '2024-09-22T14:15:00Z',
    registeredBy: 'Self'
  },
  {
    id: 'p3',
    name: 'Mohan Das',
    age: 67,
    gender: 'Male',
    phone: '+91-8765432109',
    address: 'Village: Puncha, Tehsil: Baghmundi, District: Purulia, West Bengal',
    medicalHistory: ['Arthritis', 'Heart Disease'],
    lastVisit: '2024-09-18T09:45:00Z',
    registeredBy: 'ASHA'
  },
  {
    id: 'p4',
    name: 'Sunita Devi',
    age: 28,
    gender: 'Female',
    phone: '+91-7654321098',
    address: 'Village: Balarampur, District: Purulia, West Bengal',
    medicalHistory: ['Pregnancy - 6 months'],
    lastVisit: '2024-09-25T11:20:00Z',
    registeredBy: 'ASHA'
  },
  {
    id: 'p5',
    name: 'Amit Chakraborty',
    age: 38,
    gender: 'Male',
    phone: '+91-6543210987',
    address: 'Village: Raghunathpur, District: Purulia, West Bengal',
    medicalHistory: ['Asthma'],
    lastVisit: '2024-09-15T16:30:00Z',
    registeredBy: 'Self'
  }
];

const DUMMY_WAITING_VISITS = [
  {
    id: 'v1',
    patientId: 'p1',
    patientName: 'Rajesh Kumar',
    symptoms: 'High blood sugar, dizziness, frequent urination',
    urgency: 'Medium',
    waitTime: '25 minutes',
    scheduledTime: '2024-09-28T10:00:00Z',
    status: 'waiting'
  },
  {
    id: 'v2',
    patientId: 'p4',
    patientName: 'Sunita Devi',
    symptoms: 'Routine pregnancy checkup, mild nausea',
    urgency: 'Low',
    waitTime: '15 minutes',
    scheduledTime: '2024-09-28T10:30:00Z',
    status: 'waiting'
  },
  {
    id: 'v3',
    patientId: 'p3',
    patientName: 'Mohan Das',
    symptoms: 'Severe joint pain, difficulty walking',
    urgency: 'High',
    waitTime: '40 minutes',
    scheduledTime: '2024-09-28T09:30:00Z',
    status: 'waiting'
  }
];

const DUMMY_PRESCRIPTIONS = [
  {
    id: 'pr1',
    patientId: 'p1',
    patientName: 'Rajesh Kumar',
    doctorName: 'Dr. Sarah Johnson',
    text: 'Metformin 500mg - Take twice daily after meals\nInsulin Glargine - 10 units before bedtime\nBlood sugar monitoring - Check fasting glucose daily\nDiet: Low carb, high fiber diet recommended',
    createdAt: '2024-09-26T14:30:00Z',
    status: 'active'
  },
  {
    id: 'pr2',
    patientId: 'p2',
    patientName: 'Priya Sharma',
    doctorName: 'Dr. Sarah Johnson',
    text: 'Iron Folic Acid tablets - Take one daily with water\nVitamin C tablets - Take with iron tablet for better absorption\nIncrease green leafy vegetables in diet\nFollow up in 4 weeks',
    createdAt: '2024-09-24T11:15:00Z',
    status: 'active'
  },
  {
    id: 'pr3',
    patientId: 'p3',
    patientName: 'Mohan Das',
    doctorName: 'Dr. Sarah Johnson',
    text: 'Paracetamol 500mg - Take as needed for pain (max 3 times daily)\nPhysiotherapy exercises - 15 minutes twice daily\nWarm compress on affected joints\nAvoid heavy lifting\nFollow up in 2 weeks',
    createdAt: '2024-09-22T16:45:00Z',
    status: 'completed'
  }
];

const DUMMY_MESSAGES = [
  {
    id: 'm1',
    patientId: 'p1',
    senderId: 'p1',
    senderName: 'Rajesh Kumar',
    message: 'Doctor, my blood sugar is showing 180 mg/dl this morning. Should I be worried?',
    timestamp: '2024-09-28T08:30:00Z',
    type: 'text'
  },
  {
    id: 'm2',
    patientId: 'p1',
    senderId: 'doctor',
    senderName: 'Dr. Sarah Johnson',
    message: 'That is elevated. Please continue your medication and avoid sugary foods today. We will discuss this in detail during our consultation.',
    timestamp: '2024-09-28T08:45:00Z',
    type: 'text'
  }
];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [section, setSection] = useState('home');
  const [patients, setPatients] = useState(DUMMY_PATIENTS);
  const [waitingVisits, setWaitingVisits] = useState(DUMMY_WAITING_VISITS);
  const [prescriptions, setPrescriptions] = useState(DUMMY_PRESCRIPTIONS);
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
    
    // Set dummy doctor data if not available
    const dummyDoctor = currentUser || {
      id: 'd1',
      name: 'Sarah Johnson',
      role: 'doctor',
      specialization: 'General Medicine',
      phone: '+91-9876543210',
      email: 'dr.sarah@esannidhi.gov.in',
      location: 'Purulia District Hospital, West Bengal',
      licenseNumber: 'WB-12345-GM',
      experience: '8 years',
      attendedCount: 142,
      rating: 4.8
    };
    
    setDoctor(dummyDoctor);
    loadDoctorData();
    setLoading(false);
  }, [navigate]);

  const loadDoctorData = () => {
    try {
      // In real app, this would load from API/storage
      // For now, using dummy data already set in state
      console.log('Loading doctor data...');
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
      setWaitingVisits(prev => prev.filter(v => v.id !== visit.id));
      
      // Set selected patient
      const patient = patients.find(p => p.id === visit.patientId);
      if (patient) {
        setSelectedPatient(patient);
        setSection('chat');
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

      // Create new prescription
      const newPrescription = {
        id: `pr${prescriptions.length + 1}`,
        patientId,
        patientName: selectedPatient.name,
        doctorName: doctor.name,
        text: prescriptionText.trim(),
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      setPrescriptions(prev => [newPrescription, ...prev]);

      alert('Visit completed and prescription added successfully!');
      
      // Clear selected patient
      setSelectedPatient(null);
      setSection('prescriptions');
    } catch (error) {
      console.error('Error completing visit:', error);
      alert('Failed to complete visit');
    }
  };

  const handleStartVideoCall = (patient) => {
    const roomName = `doctor_consult_${patient.id}_${Date.now()}`;
    setActiveVideoRoom(roomName);
    setVideoParticipant(patient.name);
    setSelectedPatient(patient);
    setSection('chat');
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
                      <div className="text-2xl font-bold text-green-600">{doctor.attendedCount || 142}</div>
                      <div className="text-sm text-gray-600">{translate('Patients Treated')}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{doctor.rating || '4.8'}⭐</div>
                      <div className="text-sm text-gray-600">{translate('Rating')}</div>
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
                    <div className="mt-2 text-orange-600 font-medium">{waitingVisits.length} waiting</div>
                  </button>

                  <button
                    onClick={() => setSection('patients')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">👥</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('All Patients')}</h3>
                    <p className="text-gray-600 text-sm">{translate('View and manage all patients')}</p>
                    <div className="mt-2 text-blue-600 font-medium">{patients.length} total patients</div>
                  </button>

                  <button
                    onClick={() => setSection('prescriptions')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">💊</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Recent Prescriptions')}</h3>
                    <p className="text-gray-600 text-sm">{translate('View recent prescriptions')}</p>
                    <div className="mt-2 text-green-600 font-medium">{prescriptions.length} prescriptions</div>
                  </button>
                </div>
              </div>
            )}

            {/* Patients */}
            {section === 'patients' && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {translate('All Patients')} ({patients.length})
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    {patients.map((patient) => (
                      <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-800">{patient.name}</h4>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {patient.age} yrs, {patient.gender}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                patient.registeredBy === 'ASHA' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {patient.registeredBy}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">📱 {patient.phone}</p>
                            <p className="text-sm text-gray-600 mb-2">📍 {patient.address}</p>
                            {patient.medicalHistory.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {patient.medicalHistory.map((condition, index) => (
                                  <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">
                                    {condition}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-gray-500">
                              Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleStartVideoCall(patient)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                              📹 Video Call
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPatient(patient);
                                setSection('chat');
                              }}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              💬 Chat
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Waiting Room */}
            {section === 'waiting' && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {translate('Waiting Room')} ({waitingVisits.length} waiting)
                  </h3>
                </div>
                <div className="p-6">
                  {waitingVisits.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No patients waiting
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {waitingVisits.map((visit) => (
                        <div key={visit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-800">{visit.patientName}</h4>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  visit.urgency === 'High' ? 'bg-red-100 text-red-800' :
                                  visit.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {visit.urgency} Priority
                                </span>
                                <span className="text-xs text-gray-500">
                                  Waiting: {visit.waitTime}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Symptoms:</strong> {visit.symptoms}
                              </p>
                              <p className="text-xs text-gray-500">
                                Scheduled: {new Date(visit.scheduledTime).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleAttendPatient(visit)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Attend Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chat / Video */}
            {section === 'chat' && (
              <div className="space-y-6">
                {selectedPatient ? (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {translate('Consultation with')} {selectedPatient.name}
                    </h3>
                    
                    {/* Patient Info */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Age:</span> {selectedPatient.age}
                        </div>
                        <div>
                          <span className="font-medium">Gender:</span> {selectedPatient.gender}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {selectedPatient.phone}
                        </div>
                        <div>
                          <span className="font-medium">Medical History:</span> 
                          {selectedPatient.medicalHistory.join(', ')}
                        </div>
                      </div>
                    </div>
                    
                    <MessageVideoSection
                      userId={selectedPatient.id}
                      userName={selectedPatient.name}
                      messages={DUMMY_MESSAGES.filter(m => m.patientId === selectedPatient.id)}
                      onSendMessage={() => {}}
                    />
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">
                        {translate('Complete Visit & Add Prescription')}
                      </h4>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows="4"
                        placeholder={translate('Enter prescription details...\n\nExample:\nParacetamol 500mg - Take twice daily after meals\nRest for 2-3 days\nIncrease fluid intake\nFollow up in 1 week if symptoms persist')}
                        id="prescription-text"
                      />
                      <button
                        onClick={() => {
                          const prescriptionText = document.getElementById('prescription-text').value;
                          handleCompleteVisit(selectedPatient.id, prescriptionText);
                        }}
                        className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      >
                        {translate('Complete Visit & Save Prescription')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-gray-500 mb-4">
                      {translate('Select a patient from the waiting room or patients list to start consultation')}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => setSection('waiting')}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        View Waiting Room ({waitingVisits.length})
                      </button>
                      <button
                        onClick={() => setSection('patients')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View All Patients
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Prescriptions */}
            {section === 'prescriptions' && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {translate('Recent Prescriptions')} ({prescriptions.length})
                  </h3>
                </div>
                <div className="p-6">
                  {prescriptions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4">💊</div>
                      <p>{translate('No prescriptions yet. Complete patient visits to add prescriptions.')}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {prescriptions.map((prescription) => (
                        <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-800">{prescription.patientName}</h4>
                              <p className="text-sm text-gray-600">
                                {translate('Prescribed by')}: {prescription.doctorName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(prescription.createdAt).toLocaleDateString()} at{' '}
                                {new Date(prescription.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              prescription.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {prescription.status}
                            </span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-medium text-gray-800 mb-2">{translate('Prescription Details')}:</h5>
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                              {prescription.text}
                            </pre>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                              {translate('Print')}
                            </button>
                            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                              {translate('Send to Pharmacy')}
                            </button>
                            <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors">
                              {translate('Edit')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Statistics */}
            {section === 'stats' && (
              <DoctorStatsPanel />
            )}

            {/* Profile */}
            {section === 'profile' && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {translate('Doctor Profile')}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-3xl mr-4">
                      👩‍⚕️
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">{translate('Dr.')} {doctor.name}</h4>
                      <p className="text-gray-600">{doctor.specialization || translate('General Medicine')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {translate('Full Name')}
                        </label>
                        <p className="text-gray-900">{doctor.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {translate('Specialization')}
                        </label>
                        <p className="text-gray-900">{doctor.specialization || translate('General Medicine')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {translate('Phone Number')}
                        </label>
                        <p className="text-gray-900">{doctor.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {translate('Experience')}
                        </label>
                        <p className="text-gray-900">{doctor.experience || '8 years'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {translate('Email')}
                        </label>
                        <p className="text-gray-900">{doctor.email || 'dr.sarah@esannidhi.gov.in'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {translate('Location')}
                        </label>
                        <p className="text-gray-900">{doctor.location || 'Purulia District Hospital, West Bengal'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {translate('License Number')}
                        </label>
                        <p className="text-gray-900">{doctor.licenseNumber || 'WB-12345-GM'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {translate('Rating')}
                        </label>
                        <p className="text-gray-900">{doctor.rating || '4.8'}/5.0 ⭐</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-3">{translate('Performance Metrics')}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{doctor.attendedCount || 142}</div>
                        <div className="text-sm text-gray-600">{translate('Patients Treated')}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{prescriptions.length}</div>
                        <div className="text-sm text-gray-600">{translate('Prescriptions')}</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">{doctor.rating || '4.8'}⭐</div>
                        <div className="text-sm text-gray-600">{translate('Average Rating')}</div>
                      </div>
                    </div>
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