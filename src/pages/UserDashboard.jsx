// src/pages/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import { getHealthRecordsByPatient, getPrescriptionsByPatient, getOrders } from '../services/storageService';
import { translate } from '../services/translationService';
import HealthRecordUploader from '../components/HealthRecordUploader';
import ProfileView from '../components/ProfileView';
import MedicineSearch from '../components/MedicineSearch';
import MessageVideoSection from '../components/MessageVideoSection';
import NearestPharmacy from '../components/NearestPharmacy';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [section, setSection] = useState('home');
  const [healthRecords, setHealthRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
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
      // Load health records
      const records = getHealthRecordsByPatient(userId);
      setHealthRecords(records);

      // Load prescriptions
      const userPrescriptions = getPrescriptionsByPatient(userId);
      setPrescriptions(userPrescriptions);

      // Load orders
      const userOrders = getOrders().filter(order => order.userId === userId);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHealthRecordUpload = (newRecord) => {
    setHealthRecords(prev => [...prev, newRecord]);
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleMedicineSelect = (medicine) => {
    // This would open a modal with medicine details
    alert(`${translate('Medicine Details')}:\n\n${translate('Name')}: ${medicine.name}\n${translate('Company')}: ${medicine.company || translate('Not specified')}\n${translate('Dosage')}: ${medicine.dosage || translate('Not specified')}\n${translate('Category')}: ${medicine.category || translate('Not specified')}\n${translate('Price')}: ₹${medicine.price || translate('Not specified')}`);
  };

  const handleAddToCart = (medicine) => {
    // This would add medicine to cart
    alert(`${medicine.name} ${translate('added to cart')}!`);
  };

  const handleCreateOrder = () => {
    // This would open order creation modal
    alert(translate('Order creation functionality would be implemented here'));
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
      {/* Top Navbar */}
      <header className="bg-white shadow-md flex justify-between items-center px-6 py-3">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow">
            🏛
          </div>
          <h1 className="text-xl font-bold text-blue-700">{translate('E-Sannidhi')}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {translate('Welcome')}, {user.name}
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
              { key: 'profile', label: translate('Profile'), icon: '👤' },
              { key: 'records', label: translate('Health Records'), icon: '📋' },
              { key: 'prescriptions', label: translate('Prescriptions'), icon: '💊' },
              { key: 'medicine', label: translate('Medicine Search'), icon: '🔍' },
              { key: 'pharmacy', label: translate('Nearest Pharmacy'), icon: '🏥' },
              { key: 'orders', label: translate('Orders'), icon: '📦' },
              { key: 'chat', label: translate('Chat / Video'), icon: '💬' },
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
        </div>

        {/* Main content */}
        <div className="flex-1 flex justify-center items-start p-6 overflow-y-auto">
          <div className="w-full max-w-6xl">
            {/* Home */}
            {section === 'home' && (
              <div className="space-y-6">
                <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {translate('Welcome back')}, {user.name} 👋
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {translate('Access your health records, prescriptions, and connect with healthcare providers')}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    onClick={() => setSection('chat')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">💬</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Consult Doctor')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Start a video consultation with a doctor')}</p>
                  </button>
                </div>
              </div>
            )}

            {/* Profile */}
            {section === 'profile' && (
              <ProfileView onUpdate={handleProfileUpdate} />
            )}

            {/* Health Records */}
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

                {/* Records List */}
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

            {/* Prescriptions */}
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
                userLocation={user.location}
                onPharmacySelect={(pharmacy) => {
                  alert(`${translate('Selected Pharmacy')}: ${pharmacy.name}\n${translate('Phone')}: ${pharmacy.phone || translate('Not available')}\n${translate('Address')}: ${pharmacy.address || translate('Not available')}`);
                }}
              />
            )}

            {/* Orders */}
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
                              {translate('Status')}: <span className="capitalize">{order.status}</span>
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

            {/* Chat / Video */}
            {section === 'chat' && (
              <MessageVideoSection
                userId={user.id}
                userName={user.name}
                messages={[]}
                onSendMessage={() => {}}
                showCreateVisit={true}
                onVisitCreated={(visit) => {
                  alert(`${translate('Visit created successfully!')} ${translate('Visit ID')}: ${visit.id}`);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}