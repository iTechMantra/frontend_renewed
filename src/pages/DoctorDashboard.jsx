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
    healthRecords: [
      {
        id: 'hr1',
        type: 'Blood Test',
        date: '2024-09-15',
        result: 'Blood Sugar: 180 mg/dl, HbA1c: 7.2%',
        status: 'Completed'
      },
      {
        id: 'hr2',
        type: 'Prescription',
        date: '2024-09-20',
        result: 'Metformin 500mg twice daily',
        status: 'Active'
      }
    ],
    schemes: ['Ayushman Bharat', 'State Health Scheme'],
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
    healthRecords: [
      {
        id: 'hr3',
        type: 'Blood Test',
        date: '2024-09-10',
        result: 'Hemoglobin: 9.8 g/dL',
        status: 'Completed'
      }
    ],
    schemes: ['Ayushman Bharat'],
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
    healthRecords: [
      {
        id: 'hr4',
        type: 'X-Ray',
        date: '2024-09-05',
        result: 'Mild osteoarthritis in both knees',
        status: 'Completed'
      },
      {
        id: 'hr5',
        type: 'ECG',
        date: '2024-09-12',
        result: 'Normal sinus rhythm',
        status: 'Completed'
      }
    ],
    schemes: ['Senior Citizen Health Card', 'Ayushman Bharat'],
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
    healthRecords: [
      {
        id: 'hr6',
        type: 'Ultrasound',
        date: '2024-09-22',
        result: 'Single live fetus, 24 weeks gestation',
        status: 'Completed'
      }
    ],
    schemes: ['Pradhan Mantri Matru Vandana Yojana', 'State Health Scheme'],
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
    healthRecords: [
      {
        id: 'hr7',
        type: 'Pulmonary Test',
        date: '2024-09-08',
        result: 'Mild obstructive pattern',
        status: 'Completed'
      }
    ],
    schemes: ['Ayushman Bharat'],
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
    status: 'active',
    sentToPharmacy: false
  },
  {
    id: 'pr2',
    patientId: 'p2',
    patientName: 'Priya Sharma',
    doctorName: 'Dr. Sarah Johnson',
    text: 'Iron Folic Acid tablets - Take one daily with water\nVitamin C tablets - Take with iron tablet for better absorption\nIncrease green leafy vegetables in diet\nFollow up in 4 weeks',
    createdAt: '2024-09-24T11:15:00Z',
    status: 'active',
    sentToPharmacy: true
  },
  {
    id: 'pr3',
    patientId: 'p3',
    patientName: 'Mohan Das',
    doctorName: 'Dr. Sarah Johnson',
    text: 'Paracetamol 500mg - Take as needed for pain (max 3 times daily)\nPhysiotherapy exercises - 15 minutes twice daily\nWarm compress on affected joints\nAvoid heavy lifting\nFollow up in 2 weeks',
    createdAt: '2024-09-22T16:45:00Z',
    status: 'completed',
    sentToPharmacy: true
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

const ACTIVE_HEALTH_SCHEMES = [
  {
    id: 's1',
    name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
    description: 'Provides health coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization',
    coverage: '₹5 Lakh per family/year',
    eligibility: 'Families identified through SECC database',
    enrolledPatients: 3,
    status: 'Active'
  },
  {
    id: 's2',
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    description: 'Maternity benefit program providing financial assistance to pregnant women and lactating mothers',
    coverage: '₹5,000 in 3 installments',
    eligibility: 'Pregnant women and lactating mothers',
    enrolledPatients: 1,
    status: 'Active'
  },
  {
    id: 's3',
    name: 'Senior Citizen Health Insurance Scheme',
    description: 'Health insurance coverage for senior citizens with pre-existing diseases covered from day one',
    coverage: '₹1 Lakh per year',
    eligibility: 'Indian citizens above 60 years',
    enrolledPatients: 1,
    status: 'Active'
  },
  {
    id: 's4',
    name: 'West Bengal State Health Scheme',
    description: 'Comprehensive health coverage for residents of West Bengal',
    coverage: '₹2 Lakh per family/year',
    eligibility: 'Residents of West Bengal',
    enrolledPatients: 2,
    status: 'Active'
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
  const [healthSchemes] = useState(ACTIVE_HEALTH_SCHEMES);

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
        id:  `pr${prescriptions.length + 1}`,
        patientId,
        patientName: selectedPatient.name,
        doctorName: doctor.name,
        text: prescriptionText.trim(),
        createdAt: new Date().toISOString(),
        status: 'active',
        sentToPharmacy: false
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

  const handleSendToPharmacy = (prescriptionId) => {
    try {
      setPrescriptions(prev => 
        prev.map(pres => 
          pres.id === prescriptionId 
            ? { ...pres, sentToPharmacy: true }
            : pres
        )
      );
      
      alert('Prescription sent to pharmacy successfully!');
    } catch (error) {
      console.error('Error sending to pharmacy:', error);
      alert('Failed to send prescription to pharmacy');
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
              { key: 'schemes', label: translate('Health Schemes'), icon: '🏥' },
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
                    {translate('Welcome')}, {translate('Dr.')} {doctor.name} 👩‍⚕
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

                  <button
                    onClick={() => setSection('schemes')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">🏥</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Health Schemes')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Active government health schemes')}</p>
                    <div className="mt-2 text-purple-600 font-medium">{healthSchemes.length} active schemes</div>
                  </button>

                  <button
                    onClick={() => setSection('stats')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">📊</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Statistics')}</h3>
                    <p className="text-gray-600 text-sm">{translate('View performance metrics')}</p>
                    <div className="mt-2 text-indigo-600 font-medium">View analytics</div>
                  </button>

                  <button
                    onClick={() => setSection('profile')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">👤</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Profile')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Manage your profile')}</p>
                    <div className="mt-2 text-gray-600 font-medium">Dr. {doctor.name}</div>
                  </button>
                </div>
              </div>
            )}

            {/* Patients */}
            {section === 'patients' && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {translate('All Patients')} ({patients.length})
                    </h3>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        ASHA: {patients.filter(p => p.registeredBy === 'ASHA').length}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Self: {patients.filter(p => p.registeredBy === 'Self').length}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid gap-6">
                    {patients.map((patient) => (
                      <div key={patient.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="font-semibold text-gray-800 text-lg">{patient.name}</h4>
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
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">📱 {patient.phone}</p>
                                <p className="text-sm text-gray-600">📍 {patient.address}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {/* Medical History */}
                            {patient.medicalHistory.length > 0 && (
                              <div className="mb-3">
                                <h5 className="font-medium text-gray-700 text-sm mb-1">Medical History:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {patient.medicalHistory.map((condition, index) => (
                                    <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">
                                      {condition}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Health Records */}
                            {patient.healthRecords && patient.healthRecords.length > 0 && (
                              <div className="mb-3">
                                <h5 className="font-medium text-gray-700 text-sm mb-1">Health Records:</h5>
                                <div className="space-y-2">
                                  {patient.healthRecords.slice(0, 2).map((record) => (
                                    <div key={record.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                                      <span className="font-medium">{record.type}</span>
                                      <span className="text-gray-600">{record.date}</span>
                                      <span className={`px-1 py-0.5 rounded ${
                                        record.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {record.status}
                                      </span>
                                    </div>
                                  ))}
                                  {patient.healthRecords.length > 2 && (
                                    <p className="text-xs text-gray-500">
                                      +{patient.healthRecords.length - 2} more records
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Health Schemes */}
                            {patient.schemes && patient.schemes.length > 0 && (
                              <div>
                                <h5 className="font-medium text-gray-700 text-sm mb-1">Active Health Schemes:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {patient.schemes.map((scheme, index) => (
                                    <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                                      {scheme}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => handleStartVideoCall(patient)}
                              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                              📹 Video Call
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPatient(patient);
                                setSection('chat');
                              }}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                              💬 Chat
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPatient(patient);
                                setSection('chat');
                                document.getElementById('prescription-text')?.focus();
                              }}
                              className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                            >
                              💊 Prescribe
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
                      <div className="text-4xl mb-4">⏳</div>
                      <p className="text-lg">No patients waiting</p>
                      <p className="text-sm text-gray-400 mt-2">Patients will appear here when they request consultations</p>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
                          <span className="font-medium">Registered By:</span> {selectedPatient.registeredBy}
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">Medical History:</span> 
                          {selectedPatient.medicalHistory.join(', ')}
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">Health Schemes:</span> 
                          {selectedPatient.schemes?.join(', ') || 'None'}
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
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                prescription.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {prescription.status}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                prescription.sentToPharmacy
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {prescription.sentToPharmacy ? 'Sent to Pharmacy' : 'Pending'}
                              </span>
                            </div>
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
                            {!prescription.sentToPharmacy && (
                              <button 
                                onClick={() => handleSendToPharmacy(prescription.id)}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                              >
                                {translate('Send to Pharmacy')}
                              </button>
                            )}
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

            {/* Health Schemes */}
            {section === 'schemes' && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {translate('Active Health Schemes')} ({healthSchemes.length})
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {healthSchemes.map((scheme) => (
                      <div key={scheme.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-800 text-lg">{scheme.name}</h4>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {scheme.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">{scheme.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">Coverage:</span>
                            <span className="text-green-600 font-semibold">{scheme.coverage}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">Eligibility:</span>
                            <span className="text-gray-600">{scheme.eligibility}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">Enrolled Patients:</span>
                            <span className="text-blue-600 font-semibold">{scheme.enrolledPatients}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                            View Details
                          </button>
                          <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                            Enroll Patient
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Scheme Statistics */}
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-4">Scheme Enrollment Statistics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{healthSchemes.reduce((sum, scheme) => sum + scheme.enrolledPatients, 0)}</div>
                        <div className="text-sm text-gray-600">Total Enrollments</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{healthSchemes.length}</div>
                        <div className="text-sm text-gray-600">Active Schemes</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(healthSchemes.reduce((sum, scheme) => sum + scheme.enrolledPatients, 0) / patients.length * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Coverage Rate</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {healthSchemes.find(s => s.name.includes('Ayushman'))?.enrolledPatients || 0}
                        </div>
                        <div className="text-sm text-gray-600">Ayushman Bharat</div>
                      </div>
                    </div>
                  </div>
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
                      👩‍⚕
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {healthSchemes.reduce((sum, scheme) => sum + scheme.enrolledPatients, 0)}
                        </div>
                        <div className="text-sm text-gray-600">{translate('Scheme Enrollments')}</div>
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