// src/pages/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import {
  getHealthRecordsByPatient,
  getPrescriptionsByPatient,
  getOrders,
  getPharmacies,
  initializeStorage,
  readStorage
} from '../services/storageService';
import { translate } from '../services/translationService';
import HealthRecordUploader from '../components/HealthRecordUploader';
import MedicineSearch from '../components/MedicineSearch';
import MessageVideoSection from '../components/MessageVideoSection';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [section, setSection] = useState('home');
  const [healthRecords, setHealthRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Government services data
  const [governmentServices] = useState([
    {
      id: 1,
      name: 'Ayushman Bharat PM-JAY',
      description: 'Health insurance scheme providing free healthcare coverage',
      icon: '🛡️',
      link: 'https://pmjay.gov.in',
      category: 'Insurance',
      eligibility: 'Families based on SECC database',
      benefits: '₹5 lakh per family per year'
    },
    {
      id: 2,
      name: 'eSanjeevani Telemedicine',
      description: 'Free online medical consultation service',
      icon: '💻',
      link: 'https://esanjeevani.in',
      category: 'Telemedicine',
      eligibility: 'All Indian citizens',
      benefits: 'Free doctor consultations'
    },
    {
      id: 3,
      name: 'National Health Mission',
      description: 'Comprehensive healthcare infrastructure development',
      icon: '🏥',
      link: 'https://nhm.gov.in',
      category: 'Infrastructure',
      eligibility: 'All citizens',
      benefits: 'Improved healthcare facilities'
    },
    {
      id: 4,
      name: 'Pradhan Mantri Bhartiya Janaushadhi Pariyojana',
      description: 'Affordable quality generic medicines',
      icon: '💊',
      link: 'https://janaushadhi.gov.in',
      category: 'Medicines',
      eligibility: 'All citizens',
      benefits: '50-90% cheaper medicines'
    },
    {
      id: 5,
      name: 'National Telemedicine Service',
      description: '24x7 teleconsultation services',
      icon: '📞',
      link: 'https://telemedicine.icmr.org.in',
      category: 'Telemedicine',
      eligibility: 'All citizens',
      benefits: 'Round-the-clock medical advice'
    },
    {
      id: 6,
      name: 'Ayushman Bharat Digital Mission',
      description: 'Digital health ecosystem with health IDs',
      icon: '📱',
      link: 'https://abdm.gov.in',
      category: 'Digital Health',
      eligibility: 'All citizens',
      benefits: 'Digital health records'
    },
    {
      id: 7,
      name: 'National Mental Health Programme',
      description: 'Mental healthcare services and support',
      icon: '🧠',
      link: 'https://nmhp.gov.in',
      category: 'Mental Health',
      eligibility: 'All citizens',
      benefits: 'Free counseling and treatment'
    },
    {
      id: 8,
      name: 'Reproductive & Child Health',
      description: 'Maternal and child healthcare services',
      icon: '👶',
      link: 'https://nhm.gov.in',
      category: 'Maternal Health',
      eligibility: 'Pregnant women & children',
      benefits: 'Free checkups and care'
    }
  ]);

  const [healthSchemes] = useState([
    {
      id: 1,
      name: 'Ayushman Bharat Card',
      status: 'Active',
      validity: '2025-12-31',
      coverage: '₹5,00,000'
    },
    {
      id: 2,
      name: 'State Health Insurance',
      status: 'Active',
      validity: '2024-12-31',
      coverage: '₹2,00,000'
    },
    {
      id: 3,
      name: 'Senior Citizen Health Plan',
      status: 'Pending',
      validity: 'Not Activated',
      coverage: '₹3,00,000'
    }
  ]);

  const [healthTips] = useState([
    {
      id: 1,
      title: 'Preventive Health Checkup',
      description: 'Schedule regular health checkups for early disease detection',
      category: 'Prevention',
      icon: '🩺'
    },
    {
      id: 2,
      title: 'Vaccination Schedule',
      description: 'Stay updated with recommended vaccination schedules',
      category: 'Immunization',
      icon: '💉'
    },
    {
      id: 3,
      title: 'Healthy Diet',
      description: 'Follow balanced diet with seasonal fruits and vegetables',
      category: 'Nutrition',
      icon: '🍎'
    },
    {
      id: 4,
      title: 'Physical Activity',
      description: '30 minutes of daily exercise for better health',
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

    if (!currentUser) {
      navigate('/user/login');
      return;
    }

    setUser(currentUser);
    loadUserData(currentUser.id);
    setLoading(false);
  }, [navigate]);

  const loadUserData = (userId) => {
    try {
      const records = getHealthRecordsByPatient(userId);
      setHealthRecords(records || []);

      const userPrescriptions = getPrescriptionsByPatient(userId);
      setPrescriptions(userPrescriptions || []);

      const userOrders = getOrders().filter(order => order.userId === userId);
      setOrders(userOrders || []);
    } catch (error) {
      console.error('Error loading user data:', error);
      setHealthRecords([]);
      setPrescriptions([]);
      setOrders([]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHealthRecordUpload = (newRecord) => {
    setHealthRecords(prev => [...prev, newRecord]);
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

  const handleCreateOrder = () => {
    alert(translate('Order creation functionality would be implemented here'));
  };

  const handleServiceClick = (service) => {
    alert(`Redirecting to ${service.name}...\n\nWebsite: ${service.link}`);
    // In real implementation, you would use:
    // window.open(service.link, '_blank');
  };

  const handleApplyScheme = (scheme) => {
    alert(`Applying for ${scheme.name}...\n\nYou will be redirected to the official portal for application.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{translate('Loading dashboard...')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
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
              { key: 'profile', label: translate('Profile'), icon: '👤' },
              { key: 'records', label: translate('Health Records'), icon: '📋' },
              { key: 'prescriptions', label: translate('Prescriptions'), icon: '💊' },
              { key: 'medicine', label: translate('Medicine Search'), icon: '🔍' },
              { key: 'pharmacy', label: translate('Nearest Pharmacy'), icon: '🏥' },
              { key: 'orders', label: translate('Orders'), icon: '📦' },
              { key: 'chat', label: translate('Chat / Video'), icon: '💬' },
              { key: 'government', label: translate('Govt Services'), icon: '🇮🇳' },
              { key: 'schemes', label: translate('Health Schemes'), icon: '🛡️' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  section === item.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'hover:bg-blue-100 text-gray-700'
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
                    {translate('Welcome back')}, {user.name || translate('User')}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {translate('Access your health records, prescriptions, and connect with healthcare providers')}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{healthRecords.length}</div>
                      <div className="text-sm text-gray-600">{translate('Health Records')}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{prescriptions.length}</div>
                      <div className="text-sm text-gray-600">{translate('Prescriptions')}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{orders.length}</div>
                      <div className="text-sm text-gray-600">{translate('Orders')}</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{healthSchemes.length}</div>
                      <div className="text-sm text-gray-600">{translate('Health Schemes')}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <button
                    onClick={() => setSection('records')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">📋</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Health Records')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Upload and manage your health records')}</p>
                  </button>

                  <button
                    onClick={() => setSection('medicine')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">🔍</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Medicine Search')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Search for medicines and get information')}</p>
                  </button>

                  <button
                    onClick={() => setSection('government')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">🇮🇳</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Govt Services')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Access government health services')}</p>
                  </button>

                  <button
                    onClick={() => setSection('chat')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">💬</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Consult Doctor')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Start a video consultation with a doctor')}</p>
                  </button>
                </div>

                {/* Health Tips Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {translate('Health Tips & Recommendations')}
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
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tip.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Health Schemes Preview */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {translate('Active Health Schemes')}
                    </h3>
                    <button
                      onClick={() => setSection('schemes')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {translate('View All')} →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {healthSchemes.slice(0, 2).map((scheme) => (
                      <div
                        key={scheme.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-800">{scheme.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            scheme.status === 'Active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {scheme.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Coverage: {scheme.coverage}</p>
                          <p className="text-xs text-gray-500">Valid until: {scheme.validity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Government Services Section - MOVED BEFORE HEALTH SCHEMES */}
            {section === 'government' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {translate('Government of India Health Services')}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {translate('Access various healthcare services provided by the Government of India')}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {governmentServices.map((service) => (
                      <div
                        key={service.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleServiceClick(service)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{service.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-2">{service.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                            <div className="space-y-1 text-xs text-gray-500">
                              <div className="flex justify-between">
                                <span>Category:</span>
                                <span className="font-medium">{service.category}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Eligibility:</span>
                                <span className="font-medium text-green-600">{service.eligibility}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Benefits:</span>
                                <span className="font-medium text-blue-600">{service.benefits}</span>
                              </div>
                            </div>
                            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                              {translate('Access Service')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Services */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">
                    {translate('Emergency Health Services')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-red-300">
                      <div className="text-2xl mb-2">🚑</div>
                      <h4 className="font-semibold text-red-700 mb-2">Ambulance</h4>
                      <p className="text-sm text-gray-600 mb-2">24x7 Emergency Ambulance</p>
                      <a href="tel:108" className="text-red-600 font-semibold hover:text-red-800">Dial 108</a>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-red-300">
                      <div className="text-2xl mb-2">🏥</div>
                      <h4 className="font-semibold text-red-700 mb-2">Emergency Care</h4>
                      <p className="text-sm text-gray-600 mb-2">Emergency Medical Services</p>
                      <a href="tel:102" className="text-red-600 font-semibold hover:text-red-800">Dial 102</a>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-red-300">
                      <div className="text-2xl mb-2">📞</div>
                      <h4 className="font-semibold text-red-700 mb-2">Health Helpline</h4>
                      <p className="text-sm text-gray-600 mb-2">24x7 Health Advisory</p>
                      <a href="tel:104" className="text-red-600 font-semibold hover:text-red-800">Dial 104</a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Health Schemes Section */}
            {section === 'schemes' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    {translate('Your Health Schemes & Insurance')}
                  </h3>

                  {/* Active Schemes */}
                  <div className="mb-8">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">{translate('Active Schemes')}</h4>
                    <div className="space-y-4">
                      {healthSchemes.filter(scheme => scheme.status === 'Active').map((scheme) => (
                        <div
                          key={scheme.id}
                          className="border border-green-200 bg-green-50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-gray-800">{scheme.name}</h5>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                              {translate('Active')}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600">{translate('Coverage Amount')}</p>
                              <p className="font-semibold text-green-700">{scheme.coverage}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">{translate('Valid Until')}</p>
                              <p className="font-semibold text-gray-700">{scheme.validity}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                              {translate('View Details')}
                            </button>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                              {translate('Claim Benefits')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Schemes to Apply */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">{translate('Available Schemes')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          name: 'Ayushman Bharat PM-JAY',
                          description: 'Health insurance coverage for secondary and tertiary care',
                          coverage: '₹5 Lakh per family',
                          eligibility: 'Based on SECC criteria',
                          icon: '🛡️'
                        },
                        {
                          name: 'State Health Scheme',
                          description: 'Additional health coverage by state government',
                          coverage: '₹2-3 Lakh',
                          eligibility: 'State residents',
                          icon: '🏛️'
                        },
                        {
                          name: 'Senior Citizen Health Insurance',
                          description: 'Special health insurance for senior citizens',
                          coverage: '₹3 Lakh',
                          eligibility: 'Age 60+',
                          icon: '👴'
                        },
                        {
                          name: 'Maternity Benefit Scheme',
                          description: 'Financial assistance for pregnant women',
                          coverage: '₹6,000',
                          eligibility: 'Pregnant women',
                          icon: '🤰'
                        }
                      ].map((scheme, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="text-3xl">{scheme.icon}</div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-2">{scheme.name}</h5>
                              <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Coverage:</span>
                                  <span className="font-semibold text-green-600">{scheme.coverage}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Eligibility:</span>
                                  <span className="font-medium text-blue-600">{scheme.eligibility}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleApplyScheme(scheme)}
                                className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                              >
                                {translate('Apply Now')}
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

            {/* Profile Section */}
            {section === 'profile' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  {translate('User Profile')}
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {translate('Name')}
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">
                        {user.name || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {translate('Phone')}
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">
                        {user.phone || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {translate('Age')}
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">
                        {user.age ? `${user.age} ${translate('years')}` : 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {translate('Village')}
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">
                        {user.village || user.location?.name || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Account Created')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      {translate('Health Summary')}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{healthRecords.length}</div>
                        <div className="text-sm text-gray-600">{translate('Health Records')}</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{prescriptions.length}</div>
                        <div className="text-sm text-gray-600">{translate('Prescriptions')}</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{orders.length}</div>
                        <div className="text-sm text-gray-600">{translate('Orders')}</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {orders.length > 0 ? 'Recent' : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">{translate('Last Order')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <button
                      onClick={() => alert(translate('Profile editing functionality would be implemented here'))}
                      className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      {translate('Edit Profile')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other sections (records, prescriptions, medicine, pharmacy, orders, chat) remain the same */}
            {section === 'records' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {translate('Health Records')}
                  </h3>
                  
                  <HealthRecordUploader
                    patientId={user.id}
                    onUpload={handleHealthRecordUpload}
                  />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">
                    {translate('Your Health Records')}
                  </h4>
                  
                  {healthRecords.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      {translate('No health records uploaded yet')}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {healthRecords.map((record) => (
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
                  )}
                </div>
              </div>
            )}

            {section === 'prescriptions' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate('Prescriptions')}
                </h3>
                
                {prescriptions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {translate('No prescriptions received yet')}
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
                            <p className="text-gray-700 mb-2">{prescription.text}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{translate('Doctor')}: {prescription.doctorName || translate('Unknown')}</span>
                              <span>{translate('Date')}: {new Date(prescription.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors">
                              {translate('Download')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {section === 'medicine' && (
              <MedicineSearch
                onSelect={handleMedicineSelect}
                showAddToCart={true}
                onAddToCart={handleAddToCart}
              />
            )}

            {section === 'pharmacy' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate('Nearest Pharmacies')}
                </h3>
                
                <div className="space-y-4">
                  {getPharmacies().map((pharmacy) => (
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
                            onClick={() => alert(`${translate('Calling')} ${pharmacy.name}...`)}
                          >
                            {translate('Call')}
                          </button>
                          <button 
                            className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors"
                            onClick={() => alert(`${translate('Getting directions to')} ${pharmacy.name}...`)}
                          >
                            {translate('Directions')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === 'orders' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {translate('Orders')}
                  </h3>
                  <button
                    onClick={handleCreateOrder}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    {translate('Create Order')}
                  </button>
                </div>
                
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {translate('No orders placed yet')}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {translate('Order')} #{order.id.slice(-8)}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {translate('Status')}: <span className={`capitalize font-semibold ${
                                order.status === 'delivered' ? 'text-green-600' :
                                order.status === 'shipped' ? 'text-blue-600' :
                                order.status === 'processing' ? 'text-orange-600' :
                                'text-gray-600'
                              }`}>{order.status}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              {translate('Pharmacy')}: {order.pharmacyName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {translate('Date')}: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{order.total}</p>
                            <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors">
                              {translate('Track')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {section === 'chat' && (
              <MessageVideoSection />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}