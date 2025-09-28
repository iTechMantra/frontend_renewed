// src/pages/AshaFlow.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from '../services/authService';
import {
  initializeStorage,
  readStorage,
  getPatientsByAsha,
  addPatientToAsha,
  updatePatientHealthStatus,
  getPatientFullDetails,
  createCampaign,
  getCampaignsByAsha,
  updateCampaign,
  getHealthRecordsByPatient,
  getPrescriptionsByPatient,
  createHealthRecord,
  getUsers,
  getOrders,
  getMedicines,
  getPharmacies,
  createMessage,
  getMessagesBetweenUsers,
  getCombinedPatients,
  getAllPatientUsers
} from '../services/storageService';

export default function AshaFlow() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [section, setSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [patientDashboard, setPatientDashboard] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Form states
  const [newPatient, setNewPatient] = useState({
    name: "",
    phone: "",
    age: "",
    village: "",
    healthCondition: ""
  });

  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    targetVillage: "",
    campaignDate: ""
  });

  const [healthRecord, setHealthRecord] = useState({
    title: "",
    notes: "",
    healthStatus: "Good",
    bloodPressure: "",
    temperature: "",
    weight: ""
  });

  const [newHealthRecord, setNewHealthRecord] = useState({
    patientId: "",
    title: "",
    type: "general",
    description: "",
    date: new Date().toISOString().split('T')[0],
    file: null
  });

  // Government schemes for ASHA workers
  const [governmentSchemes] = useState([
    {
      id: 1,
      name: 'National Health Mission',
      description: 'Community health programs and initiatives',
      benefits: 'Training, supplies, and incentives for ASHA workers',
      link: 'https://nhm.gov.in',
      icon: '🏥'
    },
    {
      id: 2,
      name: 'Reproductive & Child Health',
      description: 'Maternal and child healthcare programs',
      benefits: 'Immunization drives, prenatal care support',
      link: 'https://nhm.gov.in',
      icon: '👶'
    },
    {
      id: 3,
      name: 'Janani Shishu Suraksha Karyakram',
      description: 'Free care for pregnant women and sick newborns',
      benefits: 'Transport, diagnostics, medicines, and diet',
      link: 'https://nhm.gov.in',
      icon: '🤰'
    },
    {
      id: 4,
      name: 'ASHA Benefit Package',
      description: 'Incentives and benefits for ASHA workers',
      benefits: 'Performance-based incentives, insurance coverage',
      link: 'https://nhm.gov.in',
      icon: '💰'
    },
    {
      id: 5,
      name: 'Ayushman Bharat',
      description: 'Health insurance scheme for eligible families',
      benefits: '₹5 lakh health coverage per family',
      link: 'https://pmjay.gov.in',
      icon: '🛡️'
    },
    {
      id: 6,
      name: 'Immunization Program',
      description: 'National immunization schedule implementation',
      benefits: 'Vaccines for children and pregnant women',
      link: 'https://nhm.gov.in',
      icon: '💉'
    }
  ]);

  useEffect(() => {
    initializeStorage();
    
    let currentUser = getCurrentUser();
    
    if (!currentUser) {
      const session = readStorage('session', null);
      if (session && session.current) {
        currentUser = session.current;
      }
    }

    if (!currentUser || currentUser.role !== 'asha') {
      navigate('/asha/login');
      return;
    }

    setUser(currentUser);
    loadAshaData(currentUser.id);
    setLoading(false);
  }, [navigate]);

  const loadAshaData = (ashaId) => {
    try {
      const combinedPatients = getCombinedPatients(ashaId);
      setPatients(combinedPatients);

      const ashaCampaigns = getCampaignsByAsha(ashaId);
      setCampaigns(ashaCampaigns);

      const allMedicines = getMedicines();
      setMedicines(allMedicines);
      setFilteredMedicines(allMedicines);

      const allPharmacies = getPharmacies();
      setPharmacies(allPharmacies);

      const users = getUsers();
      setAllUsers(users);

      const messages = getMessagesBetweenUsers(ashaId, 'doctor-demo-456');
      setChatMessages(messages);

    } catch (error) {
      console.error('Error loading ASHA data:', error);
    }
  };

  const getPatientDashboardData = (patientId) => {
    const healthRecords = getHealthRecordsByPatient(patientId);
    const prescriptions = getPrescriptionsByPatient(patientId);
    const orders = getOrders().filter(order => order.patientId === patientId);
    
    return {
      healthRecordsCount: healthRecords.length,
      prescriptionsCount: prescriptions.length,
      ordersCount: orders.length,
      healthRecords: healthRecords.slice(0, 5),
      prescriptions: prescriptions.slice(0, 5),
      orders: orders.slice(0, 5)
    };
  };

  // Add system patient to ASHA's personal list
  const handleAddToAshaList = (systemPatient) => {
    const patientData = {
      id: systemPatient.patientId,
      name: systemPatient.patientName,
      phone: systemPatient.patientPhone,
      age: systemPatient.patientAge,
      village: systemPatient.patientVillage,
      healthCondition: 'Added from system',
      registeredBy: user.id,
      registeredByName: user.name,
      createdAt: new Date().toISOString()
    };

    const result = addPatientToAsha(user.id, patientData);
    
    if (result.success) {
      alert(`${systemPatient.patientName} added to your ASHA patient list!`);
      loadAshaData(user.id);
    } else {
      alert('Failed to add patient to your list');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Medicine Search Functions
  const handleMedicineSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(term.toLowerCase()) ||
        medicine.company.toLowerCase().includes(term.toLowerCase()) ||
        medicine.category.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMedicines(filtered);
    }
  };

  const handleMedicineSelect = (medicine) => {
    alert(`Medicine Details:\n\nName: ${medicine.name}\nCompany: ${medicine.company}\nDosage: ${medicine.dosage}\nCategory: ${medicine.category}\nPrice: ₹${medicine.price}\nDescription: ${medicine.description}`);
  };

  const handleAddToCart = (medicine) => {
    alert(`${medicine.name} added to cart!`);
  };

  // Pharmacy Functions
  const handlePharmacySelect = (pharmacy) => {
    alert(`Selected Pharmacy: ${pharmacy.name}\nPhone: ${pharmacy.phone}\nAddress: ${pharmacy.address}\nDistance: ${pharmacy.distance}\nStatus: ${pharmacy.isOpen ? 'Open' : 'Closed'}`);
  };

  // Chat Functions
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = createMessage({
        senderId: user.id,
        receiverId: 'doctor-demo-456',
        text: chatMessage,
        senderRole: 'asha',
        createdAt: new Date().toISOString()
      });
      
      if (newMessage) {
        setChatMessages(prev => [...prev, newMessage]);
        setChatMessage('');
      }
    }
  };

  // Patient Management Functions
  const handleAddPatient = (e) => {
    e.preventDefault();
    
    if (!newPatient.name || !newPatient.phone) {
      alert('Please fill in required fields');
      return;
    }

    const patientData = {
      id: `patient-${Date.now()}`,
      name: newPatient.name,
      phone: newPatient.phone,
      age: newPatient.age,
      village: newPatient.village,
      healthCondition: newPatient.healthCondition,
      registeredBy: user.id,
      registeredByName: user.name,
      createdAt: new Date().toISOString()
    };

    const result = addPatientToAsha(user.id, patientData);
    
    if (result.success) {
      alert('Patient added successfully!');
      setNewPatient({ name: '', phone: '', age: '', village: '', healthCondition: '' });
      loadAshaData(user.id);
      setSection('patients');
    } else {
      alert('Failed to add patient');
    }
  };

  const handleViewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    const details = getPatientFullDetails(patient.patientId);
    setPatientDetails(details);
    setSection('patientDetails');
  };

  const handleViewPatientDashboard = (patient) => {
    setSelectedPatient(patient);
    
    const dashboardData = getPatientDashboardData(patient.patientId);
    setPatientDashboard(dashboardData);
    setSection('patientDashboard');
  };

  const handleAddHealthRecord = (e) => {
    e.preventDefault();
    
    if (!healthRecord.title || !selectedPatient) {
      alert('Please fill in required fields');
      return;
    }

    const recordData = {
      patientId: selectedPatient.patientId,
      title: healthRecord.title,
      notes: healthRecord.notes,
      healthStatus: healthRecord.healthStatus,
      vitalSigns: {
        bloodPressure: healthRecord.bloodPressure,
        temperature: healthRecord.temperature,
        weight: healthRecord.weight
      },
      recordedBy: user.id,
      recordedByName: user.name,
      createdAt: new Date().toISOString()
    };

    const result = createHealthRecord(recordData);
    
    if (result.success) {
      alert('Health record added successfully!');
      setHealthRecord({
        title: "",
        notes: "",
        healthStatus: "Good",
        bloodPressure: "",
        temperature: "",
        weight: ""
      });
      const details = getPatientFullDetails(selectedPatient.patientId);
      setPatientDetails(details);
    } else {
      alert('Failed to add health record');
    }
  };

  // Campaign Functions
  const handleCreateCampaign = (e) => {
    e.preventDefault();
    
    if (!newCampaign.title || !newCampaign.targetVillage) {
      alert('Please fill in required fields');
      return;
    }

    const campaignData = {
      ...newCampaign,
      id: `campaign-${Date.now()}`,
      ashaId: user.id,
      ashaName: user.name,
      participants: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const result = createCampaign(campaignData);
    
    if (result.success) {
      alert('Campaign created successfully!');
      setNewCampaign({ title: '', description: '', targetVillage: '', campaignDate: '' });
      loadAshaData(user.id);
      setSection('campaigns');
    } else {
      alert('Failed to create campaign');
    }
  };

  // Health Records Management
  const handleAddNewHealthRecord = (e) => {
    e.preventDefault();
    
    if (!newHealthRecord.patientId || !newHealthRecord.title) {
      alert('Please select a patient and enter record title');
      return;
    }

    const recordData = {
      patientId: newHealthRecord.patientId,
      title: newHealthRecord.title,
      type: newHealthRecord.type,
      description: newHealthRecord.description,
      recordedBy: user.id,
      recordedByName: user.name,
      createdAt: new Date().toISOString()
    };

    const result = createHealthRecord(recordData);
    
    if (result.success) {
      alert('Health record added successfully!');
      setNewHealthRecord({
        patientId: "",
        title: "",
        type: "general",
        description: "",
        date: new Date().toISOString().split('T')[0],
        file: null
      });
      loadAshaData(user.id);
    } else {
      alert('Failed to add health record');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ASHA dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-700">E-Sannidhi</h1>
              <span className="ml-4 text-sm text-gray-500">Connecting care, anytime anywhere</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.location || 'ASHA Worker'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-xl flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {[
              { key: 'home', label: 'Home', icon: '🏠' },
              { key: 'addPatient', label: 'Add Patient', icon: '👤' },
              { key: 'patients', label: 'Patients', icon: '👥' },
              { key: 'healthRecords', label: 'Health Records', icon: '📋' },
              { key: 'medicine', label: 'Medicine Search', icon: '🔍' },
              { key: 'pharmacy', label: 'Nearest Pharmacy', icon: '🏥' },
              { key: 'chat', label: 'Chat / Video', icon: '💬' },
              { key: 'campaigns', label: 'Campaign', icon: '📢' },
              { key: 'profile', label: 'Profile', icon: '⚙️' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  section === item.key
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'hover:bg-indigo-100 text-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex justify-center items-start p-6 overflow-y-auto">
          <div className="w-full max-w-6xl">
            {/* Home Section */}
            {section === 'home' && (
              <div className="space-y-6">
                <div className="bg-white shadow-lg rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome back, {user.name} 👩‍⚕️
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Manage your patients and provide community healthcare services
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
                      <div className="text-sm text-gray-600">Patients Added</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{campaigns.length}</div>
                      <div className="text-sm text-gray-600">Active Campaigns</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{user.location || 'Hubli'}</div>
                      <div className="text-sm text-gray-600">Location</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">ASHA</div>
                      <div className="text-sm text-gray-600">Role</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <button
                    onClick={() => setSection('addPatient')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">👤</div>
                    <h3 className="font-semibold text-gray-800 mb-2">Add Patient</h3>
                    <p className="text-gray-600 text-sm">Register new patients in your community</p>
                  </button>

                  <button
                    onClick={() => setSection('patients')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">👥</div>
                    <h3 className="font-semibold text-gray-800 mb-2">View Patients</h3>
                    <p className="text-gray-600 text-sm">Manage your registered patients</p>
                  </button>

                  <button
                    onClick={() => setSection('medicine')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">🔍</div>
                    <h3 className="font-semibold text-gray-800 mb-2">Medicine Search</h3>
                    <p className="text-gray-600 text-sm">Search for medicines and information</p>
                  </button>

                  <button
                    onClick={() => setSection('chat')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">💬</div>
                    <h3 className="font-semibold text-gray-800 mb-2">Consult Doctor</h3>
                    <p className="text-gray-600 text-sm">Connect with doctors for patient care</p>
                  </button>
                </div>

                {/* Campaign Progress */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Campaign Progress
                  </h3>
                  <p className="text-gray-600">
                    Track your community health impact and ongoing campaigns
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaigns.slice(0, 2).map((campaign) => (
                      <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800">{campaign.title}</h4>
                        <p className="text-sm text-gray-600">{campaign.targetVillage}</p>
                        <p className="text-xs text-gray-500">Status: {campaign.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Add Patient Section */}
            {section === 'addPatient' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Add New Patient</h3>
                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        value={newPatient.name}
                        onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                        required
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        value={newPatient.phone}
                        onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                        required
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Age</label>
                      <input
                        type="number"
                        value={newPatient.age}
                        onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Village</label>
                      <input
                        type="text"
                        value={newPatient.village}
                        onChange={(e) => setNewPatient({...newPatient, village: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Health Condition</label>
                    <textarea
                      value={newPatient.healthCondition}
                      onChange={(e) => setNewPatient({...newPatient, healthCondition: e.target.value})}
                      rows="3"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Add Patient
                  </button>
                </form>
              </div>
            )}

            {/* Patients List Section */}
            {section === 'patients' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Your Patients ({patients.length})
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({patients.filter(p => !p.isSystemPatient).length} manually added + {patients.filter(p => p.isSystemPatient).length} system patients)
                  </span>
                </h3>
                
                {patients.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No patients registered yet</p>
                    <button
                      onClick={() => setSection('addPatient')}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Add Your First Patient
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patients.map((patient) => (
                      <div 
                        key={patient.id} 
                        className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                          patient.isSystemPatient 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                patient.isSystemPatient ? 'bg-green-100' : 'bg-indigo-100'
                              }`}>
                                <span className={`font-semibold ${
                                  patient.isSystemPatient ? 'text-green-600' : 'text-indigo-600'
                                }`}>
                                  {patient.patientName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold text-gray-800">{patient.patientName}</h4>
                                  {patient.isSystemPatient && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                      System User
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">📞 {patient.patientPhone}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                              <span>Age: {patient.patientAge || 'N/A'}</span>
                              <span>Village: {patient.patientVillage}</span>
                              <span>Status: {patient.healthStatus}</span>
                              <span>
                                {patient.isSystemPatient ? 'System Registered' : `ASHA Registered: ${new Date(patient.registeredDate).toLocaleDateString()}`}
                              </span>
                            </div>
                            {patient.isSystemPatient && (
                              <p className="text-xs text-green-600 mt-2">
                                This patient registered through the user portal
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewPatientDetails(patient)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleViewPatientDashboard(patient)}
                              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                            >
                              View Dashboard
                            </button>
                            {patient.isSystemPatient && (
                              <button
                                onClick={() => handleAddToAshaList(patient)}
                                className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                                title="Add to your ASHA patient list"
                              >
                                Add to My List
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Health Records Section */}
            {section === 'healthRecords' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Health Records Management</h3>
                  
                  {/* Add New Health Record */}
                  <div className="mb-8">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Add New Health Record</h4>
                    <form onSubmit={handleAddNewHealthRecord} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Select Patient *</label>
                          <select
                            value={newHealthRecord.patientId}
                            onChange={(e) => setNewHealthRecord({...newHealthRecord, patientId: e.target.value})}
                            required
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select a patient</option>
                            {patients.map(patient => (
                              <option key={patient.id} value={patient.patientId}>
                                {patient.patientName} - {patient.patientPhone}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Record Title *</label>
                          <input
                            type="text"
                            value={newHealthRecord.title}
                            onChange={(e) => setNewHealthRecord({...newHealthRecord, title: e.target.value})}
                            required
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., Blood Test Report, Checkup"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Record Type</label>
                          <select
                            value={newHealthRecord.type}
                            onChange={(e) => setNewHealthRecord({...newHealthRecord, type: e.target.value})}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="general">General Checkup</option>
                            <option value="blood_test">Blood Test</option>
                            <option value="xray">X-Ray</option>
                            <option value="scan">Scan</option>
                            <option value="vaccination">Vaccination</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Date</label>
                          <input
                            type="date"
                            value={newHealthRecord.date}
                            onChange={(e) => setNewHealthRecord({...newHealthRecord, date: e.target.value})}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={newHealthRecord.description}
                          onChange={(e) => setNewHealthRecord({...newHealthRecord, description: e.target.value})}
                          rows="3"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter details about the health record..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Add Health Record
                      </button>
                    </form>
                  </div>

                  {/* All Health Records */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">All Health Records</h4>
                    {patients.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No patients available</p>
                    ) : (
                      <div className="space-y-4">
                        {patients.map(patient => {
                          const records = getHealthRecordsByPatient(patient.patientId);
                          return (
                            <div key={patient.id} className="border border-gray-200 rounded-lg p-4">
                              <h5 className="font-semibold text-gray-800 mb-3">
                                {patient.patientName} - {records.length} record(s)
                              </h5>
                              {records.length === 0 ? (
                                <p className="text-gray-500 text-sm">No health records yet</p>
                              ) : (
                                <div className="space-y-2">
                                  {records.slice(0, 3).map(record => (
                                    <div key={record.id} className="bg-gray-50 p-3 rounded-md">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h6 className="font-medium text-gray-800">{record.title}</h6>
                                          <p className="text-sm text-gray-600">{record.description || record.notes}</p>
                                          <p className="text-xs text-gray-500">
                                            {new Date(record.createdAt).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                          {record.type}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                  {records.length > 3 && (
                                    <p className="text-sm text-indigo-600 text-center">
                                      + {records.length - 3} more records
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Medicine Search Section */}
            {section === 'medicine' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Medicine Search</h3>
                
                {/* Search Bar */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search medicines by name, company, or category..."
                    value={searchTerm}
                    onChange={(e) => handleMedicineSearch(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Medicine Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedicines.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No medicines found matching your search.</p>
                    </div>
                  ) : (
                    filteredMedicines.map((medicine) => (
                      <div key={medicine.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-800 text-lg">{medicine.name}</h4>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            ₹{medicine.price}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Company:</span> {medicine.company}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Dosage:</span> {medicine.dosage}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Category:</span> {medicine.category}
                          </p>
                          {medicine.description && (
                            <p className="text-sm text-gray-600">
                              {medicine.description}
                            </p>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleMedicineSelect(medicine)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleAddToCart(medicine)}
                            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Statistics */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Medicine Database</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-indigo-600">{medicines.length}</div>
                      <div className="text-gray-600">Total Medicines</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">
                        {[...new Set(medicines.map(m => m.category))].length}
                      </div>
                      <div className="text-gray-600">Categories</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600">
                        {[...new Set(medicines.map(m => m.company))].length}
                      </div>
                      <div className="text-gray-600">Companies</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-orange-600">
                        {filteredMedicines.length}
                      </div>
                      <div className="text-gray-600">Showing</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nearest Pharmacy Section */}
            {section === 'pharmacy' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Nearest Pharmacies</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pharmacies.map((pharmacy) => (
                    <div key={pharmacy.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">{pharmacy.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          pharmacy.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {pharmacy.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600 flex items-center">
                          📞 {pharmacy.phone}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          📍 {pharmacy.address}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          🚶 {pharmacy.distance}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          ⏰ {pharmacy.openTime} - {pharmacy.closeTime}
                        </p>
                        <p className="text-sm text-gray-600">
                          Owner: {pharmacy.ownerName}
                        </p>
                      </div>

                      <button
                        onClick={() => handlePharmacySelect(pharmacy)}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Select Pharmacy
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pharmacy Statistics */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Pharmacy Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-indigo-600">{pharmacies.length}</div>
                      <div className="text-gray-600">Total Pharmacies</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">
                        {pharmacies.filter(p => p.isOpen).length}
                      </div>
                      <div className="text-gray-600">Open Now</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600">
                        {pharmacies.filter(p => p.openTime === '24/7').length}
                      </div>
                      <div className="text-gray-600">24/7 Service</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-orange-600">
                        {pharmacies.reduce((min, p) => {
                          const dist = parseFloat(p.distance);
                          return dist < min ? dist : min;
                        }, Infinity)} km
                      </div>
                      <div className="text-gray-600">Nearest</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chat/Video Section */}
            {section === 'chat' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Chat with Doctors</h3>
                
                <div className="flex flex-col h-96">
                  {/* Chat Messages */}
                  <div className="flex-1 border border-gray-200 rounded-lg p-4 mb-4 overflow-y-auto">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p>No messages yet. Start a conversation with a doctor!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chatMessages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                                message.senderId === user.id
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className={`text-xs mt-1 ${
                                message.senderId === user.id ? 'text-indigo-200' : 'text-gray-500'
                              }`}>
                                {new Date(message.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Start Video Call
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Request Consultation
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Campaign Section */}
            {section === 'campaigns' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Health Campaigns</h3>
                  
                  {/* Create Campaign Form */}
                  <div className="mb-8">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Create New Campaign</h4>
                    <form onSubmit={handleCreateCampaign} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Campaign Title *</label>
                          <input
                            type="text"
                            value={newCampaign.title}
                            onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                            required
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., Immunization Drive, Health Checkup"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Target Village *</label>
                          <input
                            type="text"
                            value={newCampaign.targetVillage}
                            onChange={(e) => setNewCampaign({...newCampaign, targetVillage: e.target.value})}
                            required
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., Hubli, Dharwad"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={newCampaign.description}
                          onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                          rows="3"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Describe the campaign objectives and activities..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Campaign Date</label>
                        <input
                          type="date"
                          value={newCampaign.campaignDate}
                          onChange={(e) => setNewCampaign({...newCampaign, campaignDate: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Create Campaign
                      </button>
                    </form>
                  </div>

                  {/* Existing Campaigns */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Your Campaigns ({campaigns.length})</h4>
                    {campaigns.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No campaigns created yet</p>
                        <p className="text-sm text-gray-600">Create your first health campaign to get started!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {campaigns.map((campaign) => (
                          <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="font-semibold text-gray-800">{campaign.title}</h5>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
                                campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {campaign.status}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                              <div className="flex items-center">
                                <span className="mr-1">📍</span>
                                {campaign.targetVillage}
                              </div>
                              <div className="flex items-center">
                                <span className="mr-1">👥</span>
                                {campaign.participants} participants
                              </div>
                              <div className="flex items-center">
                                <span className="mr-1">📅</span>
                                {campaign.campaignDate || 'Not scheduled'}
                              </div>
                              <div className="flex items-center">
                                <span className="mr-1">🔄</span>
                                {new Date(campaign.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="mt-4 flex space-x-2">
                              <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                                View Details
                              </button>
                              <button className="flex-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                                Update
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Section */}
            {section === 'profile' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Your Profile</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Profile Information */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Personal Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{user.email || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <p className="mt-1 text-sm text-gray-900">{user.location || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
                        <p className="mt-1 text-sm text-gray-900">{user.aadhaar || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Your Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-blue-800">Patients Registered</span>
                        <span className="text-lg font-bold text-blue-600">{patients.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-green-800">Active Campaigns</span>
                        <span className="text-lg font-bold text-green-600">{campaigns.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-purple-800">Health Records Added</span>
                        <span className="text-lg font-bold text-purple-600">
                          {patients.reduce((total, patient) => 
                            total + getHealthRecordsByPatient(patient.patientId).length, 0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium text-orange-800">Role</span>
                        <span className="text-lg font-bold text-orange-600">ASHA Worker</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-800 mb-3">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSection('addPatient')}
                          className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                        >
                          Add Patient
                        </button>
                        <button
                          onClick={() => setSection('campaigns')}
                          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                          Create Campaign
                        </button>
                        <button
                          onClick={() => setSection('healthRecords')}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          Add Records
                        </button>
                        <button
                          onClick={() => setSection('chat')}
                          className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                        >
                          Chat Doctor
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Patient Details Section */}
            {section === 'patientDetails' && selectedPatient && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Patient Details: {selectedPatient.patientName}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSection('patients')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Back to Patients
                      </button>
                      <button
                        onClick={() => handleViewPatientDashboard(selectedPatient)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        View Full Dashboard
                      </button>
                    </div>
                  </div>

                  {/* Patient Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-4">Basic Information</h4>
                      <div className="space-y-2">
                        <p><span className="font-medium">Name:</span> {selectedPatient.patientName}</p>
                        <p><span className="font-medium">Phone:</span> {selectedPatient.patientPhone}</p>
                        <p><span className="font-medium">Age:</span> {selectedPatient.patientAge || 'Not specified'}</p>
                        <p><span className="font-medium">Village:</span> {selectedPatient.patientVillage}</p>
                        <p><span className="font-medium">Health Status:</span> {selectedPatient.healthStatus}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-4">Health Records Summary</h4>
                      {patientDetails ? (
                        <div className="space-y-2">
                          <p><span className="font-medium">Total Health Records:</span> {patientDetails.healthRecordsCount}</p>
                          <p><span className="font-medium">Total Prescriptions:</span> {patientDetails.prescriptionsCount}</p>
                          <p><span className="font-medium">Last Visit:</span> {selectedPatient.lastVisit ? new Date(selectedPatient.lastVisit).toLocaleDateString() : 'No visits recorded'}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No detailed information available</p>
                      )}
                    </div>
                  </div>

                  {/* Add Health Record Form */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-800 mb-4">Add Health Record</h4>
                    <form onSubmit={handleAddHealthRecord} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Record Title *</label>
                          <input
                            type="text"
                            value={healthRecord.title}
                            onChange={(e) => setHealthRecord({...healthRecord, title: e.target.value})}
                            required
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Health Status</label>
                          <select
                            value={healthRecord.healthStatus}
                            onChange={(e) => setHealthRecord({...healthRecord, healthStatus: e.target.value})}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                            <option value="Critical">Critical</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
                          <input
                            type="text"
                            value={healthRecord.bloodPressure}
                            onChange={(e) => setHealthRecord({...healthRecord, bloodPressure: e.target.value})}
                            placeholder="120/80"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
                          <input
                            type="text"
                            value={healthRecord.temperature}
                            onChange={(e) => setHealthRecord({...healthRecord, temperature: e.target.value})}
                            placeholder="98.6"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                          <input
                            type="text"
                            value={healthRecord.weight}
                            onChange={(e) => setHealthRecord({...healthRecord, weight: e.target.value})}
                            placeholder="65"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                          value={healthRecord.notes}
                          onChange={(e) => setHealthRecord({...healthRecord, notes: e.target.value})}
                          rows="3"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Add Health Record
                      </button>
                    </form>
                  </div>
                </div>

                {/* Patient's Health Records */}
                {patientDetails && patientDetails.healthRecords.length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-medium text-gray-800 mb-4">Patient's Health Records</h4>
                    <div className="space-y-3">
                      {patientDetails.healthRecords.map((record) => (
                        <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium text-gray-800">{record.title}</h5>
                          <p className="text-sm text-gray-600">{record.notes}</p>
                          <p className="text-xs text-gray-500">
                            Recorded: {new Date(record.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Patient Dashboard Section */}
            {section === 'patientDashboard' && patientDashboard && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Patient Dashboard: {selectedPatient.patientName}
                    </h3>
                    <button
                      onClick={() => setSection('patients')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Back to Patients
                    </button>
                  </div>

                  {/* Patient Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{patientDashboard.healthRecordsCount}</div>
                      <div className="text-sm text-gray-600">Health Records</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{patientDashboard.prescriptionsCount}</div>
                      <div className="text-sm text-gray-600">Prescriptions</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{patientDashboard.ordersCount}</div>
                      <div className="text-sm text-gray-600">Medicine Orders</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">{selectedPatient.healthStatus}</div>
                      <div className="text-sm text-gray-600">Current Status</div>
                    </div>
                  </div>

                  {/* Recent Health Records */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Health Records</h4>
                    {patientDashboard.healthRecords.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No health records available</p>
                    ) : (
                      <div className="space-y-3">
                        {patientDashboard.healthRecords.slice(0, 5).map((record) => (
                          <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-800">{record.title}</h5>
                            <p className="text-sm text-gray-600">{record.notes}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(record.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Prescriptions */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Prescriptions</h4>
                    {patientDashboard.prescriptions.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No prescriptions available</p>
                    ) : (
                      <div className="space-y-3">
                        {patientDashboard.prescriptions.slice(0, 5).map((prescription) => (
                          <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-800">By Dr. {prescription.doctorName}</h5>
                            <p className="text-sm text-gray-600">{prescription.text}</p>
                            <div className="mt-2">
                              {prescription.medicines && prescription.medicines.map((medicine, index) => (
                                <div key={index} className="text-xs text-gray-500">
                                  {medicine.name} - {medicine.dosage} ({medicine.frequency})
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(prescription.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Orders */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Medicine Orders</h4>
                    {patientDashboard.orders.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No orders placed yet</p>
                    ) : (
                      <div className="space-y-3">
                        {patientDashboard.orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-800">{order.pharmacyName}</h5>
                                <p className="text-sm text-gray-600">Total: ₹{order.total}</p>
                                <p className={`text-xs ${
                                  order.status === 'delivered' ? 'text-green-600' : 
                                  order.status === 'shipped' ? 'text-blue-600' : 'text-yellow-600'
                                }`}>
                                  Status: {order.status}
                                </p>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-xs text-gray-500">
                                  {item.medicineName} x {item.quantity}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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