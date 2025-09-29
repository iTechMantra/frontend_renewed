// src/pages/AshaDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import { 
  getPatientsByOwner, 
  getHealthRecordsByPatient, 
  getPrescriptionsByPatient,
  initializeStorage,
  readStorage
} from '../services/storageService';
import { translate } from '../services/translationService';
import AshaPatientForm from '../components/AshaPatientForm';
import CampaignPanel from '../components/CampaignPanel';
import MedicineSearch from '../components/MedicineSearch';
import MessageVideoSection from '../components/MessageVideoSection';
import HealthRecordUploader from '../components/HealthRecordUploader';

export default function AshaDashboard() {
  const navigate = useNavigate();
  const [asha, setAsha] = useState(null);
  const [section, setSection] = useState('home');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy patients data
  const [dummyPatients] = useState([
    {
      id: 'pat_001',
      name: 'Priya Sharma',
      age: 28,
      gender: 'Female',
      phone: '+91 98765 43210',
      village: 'Rampur',
      photo: null,
      healthConditions: ['Pregnancy - 6 months', 'Anemia'],
      lastVisit: '2024-01-15',
      nextVisit: '2024-02-15',
      ownerId: 'asha_001',
      ownerType: 'asha',
      createdAt: '2023-06-15'
    },
    {
      id: 'pat_002',
      name: 'Ramesh Kumar',
      age: 65,
      gender: 'Male',
      phone: '+91 87654 32109',
      village: 'Rampur',
      photo: null,
      healthConditions: ['Diabetes', 'Hypertension'],
      lastVisit: '2024-01-10',
      nextVisit: '2024-02-10',
      ownerId: 'asha_001',
      ownerType: 'asha',
      createdAt: '2023-07-20'
    },
    {
      id: 'pat_003',
      name: 'Sunita Devi',
      age: 32,
      gender: 'Female',
      phone: '+91 76543 21098',
      village: 'Rampur',
      photo: null,
      healthConditions: ['Pregnancy - 8 months', 'Normal'],
      lastVisit: '2024-01-18',
      nextVisit: '2024-01-25',
      ownerId: 'asha_001',
      ownerType: 'asha',
      createdAt: '2023-08-10'
    },
    {
      id: 'pat_004',
      name: 'Vikram Singh',
      age: 45,
      gender: 'Male',
      phone: '+91 65432 10987',
      village: 'Rampur',
      photo: null,
      healthConditions: ['Asthma', 'Allergies'],
      lastVisit: '2024-01-12',
      nextVisit: '2024-02-12',
      ownerId: 'asha_001',
      ownerType: 'asha',
      createdAt: '2023-09-05'
    },
    {
      id: 'pat_005',
      name: 'Laxmi Bai',
      age: 70,
      gender: 'Female',
      phone: '+91 94321 09876',
      village: 'Rampur',
      photo: null,
      healthConditions: ['Arthritis', 'BP Medication'],
      lastVisit: '2024-01-08',
      nextVisit: '2024-02-08',
      ownerId: 'asha_001',
      ownerType: 'asha',
      createdAt: '2023-10-12'
    }
  ]);

  // Dummy health records for patients
  const [dummyHealthRecords] = useState([
    {
      id: 'rec_001',
      patientId: 'pat_001',
      title: 'Pregnancy Checkup - Month 6',
      type: 'checkup',
      notes: 'Regular pregnancy checkup. Fetal heartbeat normal. Blood pressure: 120/80. Weight: 58kg.',
      fileName: 'pregnancy_checkup_jan.pdf',
      createdAt: '2024-01-15'
    },
    {
      id: 'rec_002',
      patientId: 'pat_002',
      title: 'Diabetes Monitoring',
      type: 'test',
      notes: 'Blood sugar levels: Fasting - 110 mg/dL, Postprandial - 160 mg/dL. Medication adjusted.',
      fileName: 'diabetes_report.pdf',
      createdAt: '2024-01-10'
    },
    {
      id: 'rec_003',
      patientId: 'pat_003',
      title: 'Ultrasound Report',
      type: 'scan',
      notes: '8-month pregnancy ultrasound. Baby development normal. Expected delivery: Feb 2024.',
      fileName: 'ultrasound_jan.pdf',
      createdAt: '2024-01-18'
    }
  ]);

  // Dummy prescriptions
  const [dummyPrescriptions] = useState([
    {
      id: 'pres_001',
      patientId: 'pat_001',
      doctorName: 'Dr. Anjali Mehta',
      text: 'Iron tablets - 1 daily\nCalcium supplements - 1 daily\nFolic acid - continue',
      createdAt: '2024-01-15'
    },
    {
      id: 'pres_002',
      patientId: 'pat_002',
      doctorName: 'Dr. Rajesh Kumar',
      text: 'Metformin 500mg - 1 tablet twice daily\nGlimepride 2mg - 1 tablet morning\nRegular walking recommended',
      createdAt: '2024-01-10'
    }
  ]);

  // Health schemes data
  const [healthSchemes] = useState([
    {
      id: 1,
      name: 'Pradhan Mantri Matru Vandana Yojana',
      description: 'Maternity benefit program for pregnant women',
      icon: '🤰',
      category: 'Maternal Health',
      eligibility: 'Pregnant women & lactating mothers',
      benefits: '₹5,000 in 3 installments'
    },
    {
      id: 2,
      name: 'Janani Shishu Suraksha Karyakram',
      description: 'Free delivery and C-section services',
      icon: '👶',
      category: 'Childbirth',
      eligibility: 'All pregnant women',
      benefits: 'Free delivery care'
    },
    {
      id: 3,
      name: 'Mission Indradhanush',
      description: 'Immunization program for children',
      icon: '💉',
      category: 'Immunization',
      eligibility: 'Children under 2 years',
      benefits: 'Free vaccination'
    },
    {
      id: 4,
      name: 'Anaemia Mukt Bharat',
      description: 'Program to reduce anaemia prevalence',
      icon: '🩸',
      category: 'Nutrition',
      eligibility: 'Children, adolescents, women',
      benefits: 'Iron folic acid supplements'
    }
  ]);

  // Health awareness programs
  const [awarenessPrograms] = useState([
    {
      id: 1,
      title: 'Immunization Drive',
      description: 'Weekly immunization camp for children under 5 years',
      date: 'Every Tuesday',
      time: '10:00 AM - 2:00 PM',
      location: 'Rampur Health Center',
      icon: '💉',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Prenatal Care Workshop',
      description: 'Education on pregnancy care and nutrition',
      date: '15th February 2024',
      time: '11:00 AM - 1:00 PM',
      location: 'Community Hall',
      icon: '🤰',
      status: 'Upcoming'
    },
    {
      id: 3,
      title: 'Diabetes Screening Camp',
      description: 'Free blood sugar testing and consultation',
      date: '20th January 2024',
      time: '9:00 AM - 4:00 PM',
      location: 'Rampur Health Center',
      icon: '🩸',
      status: 'Completed'
    },
    {
      id: 4,
      title: 'Nutrition Awareness Session',
      description: 'Importance of balanced diet for families',
      date: '5th February 2024',
      time: '3:00 PM - 5:00 PM',
      location: 'Anganwadi Center',
      icon: '🍎',
      status: 'Upcoming'
    }
  ]);

  // Health tips for community
  const [healthTips] = useState([
    {
      id: 1,
      title: 'Hand Hygiene',
      description: 'Importance of regular hand washing to prevent infections',
      category: 'Hygiene',
      icon: '🧼'
    },
    {
      id: 2,
      title: 'Safe Drinking Water',
      description: 'Always drink boiled or filtered water',
      category: 'Prevention',
      icon: '💧'
    },
    {
      id: 3,
      title: 'Balanced Diet',
      description: 'Include seasonal fruits and vegetables in daily meals',
      category: 'Nutrition',
      icon: '🍎'
    },
    {
      id: 4,
      title: 'Regular Exercise',
      description: '30 minutes of walking daily for better health',
      category: 'Fitness',
      icon: '🚶'
    }
  ]);

  useEffect(() => {
    initializeStorage();

    let currentUser = getCurrentUser();

    if (!currentUser) {
      const session = readStorage('session', null);
      if (session && session.current) {
        currentUser = session.current;
      } else {
        currentUser = readStorage('currentUser', null);
      }
    }

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
      // Load ASHA's patients - combine dummy data with any existing patients
      const existingPatients = getPatientsByOwner('asha', ashaId) || [];
      const allPatients = [...dummyPatients, ...existingPatients];
      setPatients(allPatients);
    } catch (error) {
      console.error('Error loading ASHA data:', error);
      // Fallback to dummy data
      setPatients(dummyPatients);
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
    const details = [
      translate('Name') + ': ' + medicine.name,
      translate('Company') + ': ' + (medicine.company || translate('Not specified')),
      translate('Dosage') + ': ' + (medicine.dosage || translate('Not specified')),
      translate('Category') + ': ' + (medicine.category || translate('Not specified')),
      translate('Price') + ': ₹' + (medicine.price || translate('Not specified'))
    ];
    alert(translate('Medicine Details') + ':\n\n' + details.join('\n'));
  };

  const handleAddToCart = (medicine) => {
    alert((medicine.name || translate('Medicine')) + ' ' + translate('added to cart') + '!');
  };

  const getPatientStats = (patient) => {
    try {
      const healthRecords = [...dummyHealthRecords, ...(getHealthRecordsByPatient(patient.id) || [])].filter(
        record => record.patientId === patient.id
      );
      const prescriptions = [...dummyPrescriptions, ...(getPrescriptionsByPatient(patient.id) || [])].filter(
        prescription => prescription.patientId === patient.id
      );
      
      return {
        healthRecords: healthRecords.length,
        prescriptions: prescriptions.length
      };
    } catch (error) {
      console.error('Error getting patient stats:', error);
      return {
        healthRecords: 0,
        prescriptions: 0
      };
    }
  };

  const getPatientHealthRecords = (patientId) => {
    try {
      return [...dummyHealthRecords, ...(getHealthRecordsByPatient(patientId) || [])].filter(
        record => record.patientId === patientId
      );
    } catch (error) {
      console.error('Error getting health records:', error);
      return dummyHealthRecords.filter(record => record.patientId === patientId);
    }
  };

  const getPatientPrescriptions = (patientId) => {
    try {
      return [...dummyPrescriptions, ...(getPrescriptionsByPatient(patientId) || [])].filter(
        prescription => prescription.patientId === patientId
      );
    } catch (error) {
      console.error('Error getting prescriptions:', error);
      return dummyPrescriptions.filter(prescription => prescription.patientId === patientId);
    }
  };

  const handleProgramRegister = (program) => {
    alert(`Registering patients for: ${program.title}\n\nDate: ${program.date}\nTime: ${program.time}\nLocation: ${program.location}`);
  };

  const handleSchemeApply = (scheme) => {
    alert(`Helping patient apply for: ${scheme.name}\n\nBenefits: ${scheme.benefits}\nEligibility: ${scheme.eligibility}`);
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
              { key: 'prescriptions', label: translate('Prescriptions'), icon: '💊' },
              { key: 'medicine', label: translate('Medicine Search'), icon: '🔍' },
              { key: 'pharmacy', label: translate('Nearest Pharmacy'), icon: '🏥' },
              { key: 'orders', label: translate('Medicine Orders'), icon: '📦' },
              { key: 'chat', label: translate('Chat / Video'), icon: '💬' },
              { key: 'campaign', label: translate('Campaign'), icon: '🏆' },
              { key: 'health_schemes', label: translate('Health Schemes'), icon: '🛡' },
              { key: 'awareness', label: translate('Awareness Programs'), icon: '📢' },
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
            {/* Home Section */}
            {section === 'home' && (
              <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {translate('Welcome back')}, {asha.name} 👩‍⚕
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {translate('Manage your patients and provide community healthcare services')}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{patients.length}</div>
                      <div className="text-sm text-gray-600">{translate('Patients')}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">12</div>
                      <div className="text-sm text-gray-600">{translate('This Month Visits')}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">8</div>
                      <div className="text-sm text-gray-600">{translate('Pending Follow-ups')}</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">4</div>
                      <div className="text-sm text-gray-600">{translate('Active Programs')}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    onClick={() => setSection('awareness')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">📢</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Awareness Programs')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Manage community health programs')}</p>
                  </button>
                </div>

                {/* Health Tips Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {translate('Community Health Tips')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {healthTips.map((tip) => (
                      <div
                        key={tip.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="text-2xl mb-2">{tip.icon}</div>
                        <h4 className="font-medium text-gray-800 mb-2">{tip.title}</h4>
                        <p className="text-sm text-gray-600">{tip.description}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {tip.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Programs Preview */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {translate('Upcoming Health Programs')}
                    </h3>
                    <button
                      onClick={() => setSection('awareness')}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      {translate('View All')} →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {awarenessPrograms.filter(p => p.status === 'Upcoming').slice(0, 2).map((program) => (
                      <div
                        key={program.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{program.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 mb-1">{program.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{program.description}</p>
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>📅 {program.date} | 🕒 {program.time}</p>
                              <p>📍 {program.location}</p>
                            </div>
                            <button
                              onClick={() => handleProgramRegister(program)}
                              className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                            >
                              {translate('Register Patients')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Patients Preview */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {translate('Recent Patients')}
                    </h3>
                    <button
                      onClick={() => setSection('patients')}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      {translate('View All')} →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patients.slice(0, 2).map((patient) => {
                      const stats = getPatientStats(patient);
                      return (
                        <div
                          key={patient.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{patient.name}</h4>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {patient.age} {translate('years')}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>📞 {patient.phone}</p>
                            <p>🏠 {patient.village}</p>
                            <p>📋 {translate('Health Records')}: {stats.healthRecords}</p>
                            <p className="text-xs text-gray-500">
                              {translate('Next Visit')}: {patient.nextVisit}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Health Schemes Section */}
            {section === 'health_schemes' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {translate('Government Health Schemes')}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {translate('Help your patients access various healthcare schemes provided by the Government')}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {healthSchemes.map((scheme) => (
                      <div
                        key={scheme.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{scheme.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-2">{scheme.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
                            <div className="space-y-1 text-xs text-gray-500">
                              <div className="flex justify-between">
                                <span>Category:</span>
                                <span className="font-medium">{scheme.category}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Eligibility:</span>
                                <span className="font-medium text-green-600">{scheme.eligibility}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Benefits:</span>
                                <span className="font-medium text-blue-600">{scheme.benefits}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleSchemeApply(scheme)}
                              className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                              {translate('Help Patient Apply')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scheme Application Status */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {translate('Recent Scheme Applications')}
                  </h3>
                  <div className="space-y-4">
                    {[
                      { patient: 'Priya Sharma', scheme: 'Pradhan Mantri Matru Vandana Yojana', status: 'Approved', date: '2024-01-10' },
                      { patient: 'Sunita Devi', scheme: 'Janani Shishu Suraksha Karyakram', status: 'Pending', date: '2024-01-18' },
                      { patient: 'Ramesh Kumar', scheme: 'Ayushman Bharat', status: 'Approved', date: '2024-01-05' }
                    ].map((application, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-800">{application.patient}</h5>
                            <p className="text-sm text-gray-600">{application.scheme}</p>
                            <p className="text-xs text-gray-500">Applied: {application.date}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            application.status === 'Approved' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Awareness Programs Section */}
            {section === 'awareness' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    {translate('Community Health Awareness Programs')}
                  </h3>

                  {/* Upcoming Programs */}
                  <div className="mb-8">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">{translate('Upcoming Programs')}</h4>
                    <div className="space-y-4">
                      {awarenessPrograms.filter(p => p.status === 'Upcoming').map((program) => (
                        <div
                          key={program.id}
                          className="border border-blue-200 bg-blue-50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start space-x-3">
                              <div className="text-2xl">{program.icon}</div>
                              <div>
                                <h5 className="font-semibold text-gray-800">{program.title}</h5>
                                <p className="text-sm text-gray-600">{program.description}</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {translate('Upcoming')}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600">{translate('Date & Time')}</p>
                              <p className="font-semibold text-gray-700">{program.date} | {program.time}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">{translate('Location')}</p>
                              <p className="font-semibold text-gray-700">{program.location}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleProgramRegister(program)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                              {translate('Register Patients')}
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                              {translate('View Details')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Completed Programs */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">{translate('Completed Programs')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {awarenessPrograms.filter(p => p.status === 'Completed').map((program) => (
                        <div
                          key={program.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="text-3xl">{program.icon}</div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-2">{program.title}</h5>
                              <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Date:</span>
                                  <span className="font-semibold text-gray-700">{program.date}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Location:</span>
                                  <span className="font-medium text-blue-600">{program.location}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Participants:</span>
                                  <span className="font-medium text-green-600">45 families</span>
                                </div>
                              </div>
                              <button className="w-full mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                                {translate('View Report')}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Patient Section */}
            {section === 'add_patient' && (
              <AshaPatientForm onPatientAdded={handlePatientAdded} />
            )}

            {/* Patients Section */}
            {section === 'patients' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate('Your Patients')} ({patients.length})
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
                                    {patient.age} {translate('years')} • {patient.gender} • {patient.village}
                                  </p>
                                </div>
                              </div>

                              <div className="mb-2">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">{translate('Health Conditions')}:</span> {patient.healthConditions.join(', ')}
                                </p>
                              </div>

                              <div className="flex space-x-4 text-sm text-gray-600">
                                <span>{translate('Health Records')}: {stats.healthRecords}</span>
                                <span>{translate('Prescriptions')}: {stats.prescriptions}</span>
                                <span>{translate('Last Visit')}: {patient.lastVisit}</span>
                                <span>{translate('Next Visit')}: {patient.nextVisit}</span>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setSection('records');
                                }}
                                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors"
                              >
                                {translate('View Records')}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setSection('prescriptions');
                                }}
                                className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors"
                              >
                                {translate('Prescriptions')}
                              </button>
                              <button className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-md hover:bg-purple-200 transition-colors">
                                {translate('Schedule Visit')}
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

            {/* Health Records Section */}
            {section === 'records' && (
              <div className="space-y-6">
                {selectedPatient ? (
                  <div>
                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {translate('Health Records for')} {selectedPatient.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedPatient.age} {translate('years')} • {selectedPatient.village} • {selectedPatient.healthConditions.join(', ')}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedPatient(null)}
                          className="text-sm text-purple-600 hover:underline"
                        >
                          {translate('← Back to all patients')}
                        </button>
                      </div>
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
                        const records = getPatientHealthRecords(selectedPatient.id);
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
                                    <button className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors">
                                      {translate('Share')}
                                    </button>
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

            {/* Prescriptions Section */}
            {section === 'prescriptions' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate('Patient Prescriptions')}
                </h3>
                
                {!selectedPatient ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      {translate('Select a patient to view their prescriptions')}
                    </p>
                    <button
                      onClick={() => setSection('patients')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      {translate('View Patients')}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="bg-purple-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">{selectedPatient.name}</h4>
                          <p className="text-sm text-gray-600">
                            {selectedPatient.age} {translate('years')} • {selectedPatient.village}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedPatient(null)}
                          className="text-sm text-purple-600 hover:underline"
                        >
                          {translate('← Back to all patients')}
                        </button>
                      </div>
                    </div>

                    {(() => {
                      const prescriptions = getPatientPrescriptions(selectedPatient.id);
                      return prescriptions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          {translate('No prescriptions available for this patient')}
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {prescriptions.map((prescription) => (
                            <div
                              key={prescription.id}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 mb-2">
                                    {translate('Prescription')} #{prescription.id.slice(-8)}
                                  </h5>
                                  <div className="bg-gray-50 p-3 rounded-md mb-3">
                                    <p className="text-gray-700 whitespace-pre-line">{prescription.text}</p>
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>{translate('Doctor')}: {prescription.doctorName || translate('Unknown')}</span>
                                    <span>{translate('Date')}: {new Date(prescription.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors">
                                    {translate('Download')}
                                  </button>
                                  <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors">
                                    {translate('Share')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Medicine Search Section */}
            {section === 'medicine' && (
              <MedicineSearch
                onSelect={handleMedicineSelect}
                showAddToCart={true}
                onAddToCart={handleAddToCart}
              />
            )}

            {/* Pharmacy Section */}
            {section === 'pharmacy' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate('Nearest Pharmacies')}
                </h3>
                
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      name: 'Rampur Medical Store',
                      address: 'Main Road, Rampur',
                      phone: '+91 98765 43210',
                      distance: '0.5 km',
                      isOpen: true,
                      openTime: '8:00 AM',
                      closeTime: '10:00 PM'
                    },
                    {
                      id: 2,
                      name: 'City Pharmacy',
                      address: 'Market Street, Rampur',
                      phone: '+91 87654 32109',
                      distance: '1.2 km',
                      isOpen: true,
                      openTime: '9:00 AM',
                      closeTime: '9:00 PM'
                    },
                    {
                      id: 3,
                      name: '24/7 Medical',
                      address: 'Highway Road, Rampur',
                      phone: '+91 76543 21098',
                      distance: '2.5 km',
                      isOpen: true,
                      openTime: '24/7',
                      closeTime: '24/7'
                    }
                  ].map((pharmacy) => (
                    <div
                      key={pharmacy.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-semibold text-gray-900">{pharmacy.name}</h5>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              pharmacy.isOpen 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {pharmacy.isOpen ? translate('Open') : translate('Closed')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{pharmacy.address}</p>
                          <p className="text-sm text-gray-600 mb-1">{pharmacy.phone}</p>
                          <p className="text-sm text-gray-600 mb-1">{pharmacy.distance} away</p>
                          <p className="text-xs text-gray-500">
                            {pharmacy.openTime === '24/7' ? 
                              translate('Open 24/7') : 
                              `${translate('Hours')}: ${pharmacy.openTime} - ${pharmacy.closeTime}`
                            }
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button 
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors"
                            onClick={() => alert($`{translate('Calling')} ${pharmacy.name}...`)}
                          >
                            {translate('Call')}
                          </button>
                          <button 
                            className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors"
                            onClick={() => alert($`{translate('Getting directions to')} ${pharmacy.name}...`)}
                          >
                            {translate('Directions')}
                          </button>
                          <button 
                            className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-md hover:bg-purple-200 transition-colors"
                            onClick={() => alert(`${translate('Ordering medicines from')} ${pharmacy.name}...`)}
                          >
                            {translate('Order Medicines')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Section */}
            {section === 'orders' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  {translate('Medicine Orders for Patients')}
                </h3>

                <div className="space-y-6">
                  {[
                    {
                      id: 'ord_001',
                      patientName: 'Priya Sharma',
                      medicines: ['Iron Tablets', 'Calcium Supplements', 'Folic Acid'],
                      pharmacy: 'Rampur Medical Store',
                      status: 'delivered',
                      total: 450,
                      createdAt: '2024-01-16'
                    },
                    {
                      id: 'ord_002',
                      patientName: 'Ramesh Kumar',
                      medicines: ['Metformin 500mg', 'Glimepride 2mg'],
                      pharmacy: 'City Pharmacy',
                      status: 'shipped',
                      total: 320,
                      createdAt: '2024-01-18'
                    },
                    {
                      id: 'ord_003',
                      patientName: 'Sunita Devi',
                      medicines: ['Prenatal Vitamins', 'Iron Syrup'],
                      pharmacy: '24/7 Medical',
                      status: 'processing',
                      total: 280,
                      createdAt: '2024-01-19'
                    }
                  ].map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {translate('Order for')} {order.patientName}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {translate('Order')} #{order.id.slice(-8)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full capitalize ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">{translate('Medicines')}:</span> {order.medicines.join(', ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {translate('Pharmacy')}: {order.pharmacy}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {translate('Order Date')}: {order.createdAt}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">₹{order.total}</span>
                          <button className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-md hover:bg-purple-200 transition-colors">
                            {translate('Track')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {translate('Place New Order')}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {translate('Order medicines for your patients from nearby pharmacies')}
                  </p>
                  <button
                    onClick={() => setSection('medicine')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    {translate('Browse Medicines')}
                  </button>
                </div>
              </div>
            )}

            {/* Chat / Video Section */}
            {section === 'chat' && (
              <MessageVideoSection 
                userId={asha.id}
                userName={asha.name}
                userRole="asha"
              />
            )}

            {/* Campaign Section */}
            {section === 'campaign' && (
              <CampaignPanel />
            )}

            {/* Profile Section */}
            {section === 'profile' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  {translate('ASHA Worker Profile')}
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {translate('Name')}
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">
                        {asha.name || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {translate('Phone')}
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">
                        {asha.phone || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {translate('Email')}
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">
                        {asha.email || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {translate('Location')}
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">
                        {asha.location || asha.village || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Aadhaar Number')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">
                      {asha.aadhaar || 'N/A'}
                    </p>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      {translate('Work Summary')}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{patients.length}</div>
                        <div className="text-sm text-gray-600">{translate('Patients')}</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">12</div>
                        <div className="text-sm text-gray-600">{translate('This Month Visits')}</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">8</div>
                        <div className="text-sm text-gray-600">{translate('Programs')}</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">4</div>
                        <div className="text-sm text-gray-600">{translate('Active Schemes')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <button
                      onClick={() => alert(translate('Profile editing functionality would be implemented here'))}
                      className="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                    >
                      {translate('Edit Profile')}
                    </button>
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