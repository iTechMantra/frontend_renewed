// src/pages/PharmacyDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import { 
  getMedicinesByPharmacy, 
  addMedicineToPharmacy, 
  updatePharmacyMedicine, 
  deletePharmacyMedicine,
  getBillsByPharmacy,
  createBill,
  getPrescriptionsForPharmacy
} from '../services/storageService';
import { translate } from '../services/translationService';

export default function PharmacyDashboard() {
  const navigate = useNavigate();
  const [pharmacy, setPharmacy] = useState(null);
  const [section, setSection] = useState('home');
  const [medicines, setMedicines] = useState([]);
  const [bills, setBills] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Medicine form state
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    company: '',
    quantity: '',
    price: ''
  });

  // Sell form state
  const [sellForm, setSellForm] = useState({
    medId: '',
    quantity: '',
    customerName: '',
    customerPhone: ''
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'pharmacy') {
      navigate('/pharmacy/login');
      return;
    }
    
    setPharmacy(currentUser);
    loadPharmacyData(currentUser.id);
    setLoading(false);
  }, [navigate]);

  const loadPharmacyData = (pharmacyId) => {
    try {
      // Try to get real data first
      let pharmacyMedicines = getMedicinesByPharmacy(pharmacyId);
      let pharmacyBills = getBillsByPharmacy(pharmacyId);
      let pharmacyPrescriptions = getPrescriptionsForPharmacy(pharmacyId);

      // If no real data exists, use dummy data
      if (pharmacyMedicines.length === 0) {
        pharmacyMedicines = [
          {
            medId: 'MED001',
            pharmacyId: pharmacyId,
            name: 'Paracetamol 500mg',
            company: 'Sun Pharma',
            quantity: 150,
            price: 25.50
          },
          {
            medId: 'MED002',
            pharmacyId: pharmacyId,
            name: 'Amoxicillin 250mg',
            company: 'Cipla',
            quantity: 80,
            price: 85.00
          },
          {
            medId: 'MED003',
            pharmacyId: pharmacyId,
            name: 'Cetirizine 10mg',
            company: 'Dr. Reddy\'s',
            quantity: 200,
            price: 15.75
          },
          {
            medId: 'MED004',
            pharmacyId: pharmacyId,
            name: 'Omeprazole 20mg',
            company: 'Lupin',
            quantity: 65,
            price: 120.00
          },
          {
            medId: 'MED005',
            pharmacyId: pharmacyId,
            name: 'Metformin 500mg',
            company: 'Torrent',
            quantity: 90,
            price: 45.25
          },
          {
            medId: 'MED006',
            pharmacyId: pharmacyId,
            name: 'Aspirin 75mg',
            company: 'Bayer',
            quantity: 120,
            price: 32.00
          },
          {
            medId: 'MED007',
            pharmacyId: pharmacyId,
            name: 'Losartan 25mg',
            company: 'Ranbaxy',
            quantity: 45,
            price: 95.50
          },
          {
            medId: 'MED008',
            pharmacyId: pharmacyId,
            name: 'Vitamin D3 1000IU',
            company: 'Abbott',
            quantity: 180,
            price: 78.00
          }
        ];
      }

      if (pharmacyBills.length === 0) {
        pharmacyBills = [
          {
            billId: 'BILL001',
            pharmacyId: pharmacyId,
            items: [
              { medId: 'MED001', name: 'Paracetamol 500mg', quantity: 2, price: 25.50 }
            ],
            total: 51.00,
            customerName: 'Rajesh Kumar',
            customerPhone: '9876543210',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
          },
          {
            billId: 'BILL002',
            pharmacyId: pharmacyId,
            items: [
              { medId: 'MED003', name: 'Cetirizine 10mg', quantity: 1, price: 15.75 },
              { medId: 'MED001', name: 'Paracetamol 500mg', quantity: 1, price: 25.50 }
            ],
            total: 41.25,
            customerName: 'Priya Sharma',
            customerPhone: '9123456789',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
          },
          {
            billId: 'BILL003',
            pharmacyId: pharmacyId,
            items: [
              { medId: 'MED004', name: 'Omeprazole 20mg', quantity: 1, price: 120.00 }
            ],
            total: 120.00,
            customerName: 'Mohammad Ali',
            customerPhone: '9567890123',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
          },
          {
            billId: 'BILL004',
            pharmacyId: pharmacyId,
            items: [
              { medId: 'MED002', name: 'Amoxicillin 250mg', quantity: 2, price: 85.00 },
              { medId: 'MED008', name: 'Vitamin D3 1000IU', quantity: 1, price: 78.00 }
            ],
            total: 248.00,
            customerName: 'Sunita Devi',
            customerPhone: '9234567890',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
          },
          {
            billId: 'BILL005',
            pharmacyId: pharmacyId,
            items: [
              { medId: 'MED005', name: 'Metformin 500mg', quantity: 3, price: 45.25 }
            ],
            total: 135.75,
            customerName: 'Amit Patel',
            customerPhone: '9345678901',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
          }
        ];
      }

      if (pharmacyPrescriptions.length === 0) {
        pharmacyPrescriptions = [
          {
            id: 'PRES001',
            patientId: 'PAT001',
            patientName: 'Ravi Gupta',
            text: 'Rx: Amoxicillin 250mg - Take 1 tablet twice daily for 7 days\nParacetamol 500mg - Take as needed for fever/pain\n\nDr. Anjali Verma\nMBBS, MD Internal Medicine',
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
            status: 'pending'
          },
          {
            id: 'PRES002',
            patientId: 'PAT002',
            patientName: 'Meera Singh',
            text: 'Rx: Metformin 500mg - Take 1 tablet twice daily with meals\nOmeprazole 20mg - Take 1 tablet before breakfast\n\nDr. Suresh Reddy\nMBBS, MD Endocrinology',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            status: 'pending'
          },
          {
            id: 'PRES003',
            patientId: 'PAT003',
            patientName: 'Kiran Joshi',
            text: 'Rx: Cetirizine 10mg - Take 1 tablet at bedtime\nVitamin D3 1000IU - Take 1 tablet daily\n\nDr. Priya Nair\nMBBS, MD Dermatology',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
            status: 'completed'
          },
          {
            id: 'PRES004',
            patientId: 'PAT004',
            patientName: 'Deepak Yadav',
            text: 'Rx: Losartan 25mg - Take 1 tablet daily in morning\nAspirin 75mg - Take 1 tablet daily after dinner\n\nDr. Rakesh Agarwal\nMBBS, MD Cardiology',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            status: 'pending'
          },
          {
            id: 'PRES005',
            patientId: 'PAT005',
            patientName: 'Kavya Menon',
            text: 'Rx: Paracetamol 500mg - Take 1 tablet every 6 hours as needed\nAmoxicillin 250mg - Take 1 tablet three times daily for 5 days\n\nDr. Vikram Shah\nMBBS, MBBS General Practice',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            status: 'completed'
          }
        ];
      }

      setMedicines(pharmacyMedicines);
      setBills(pharmacyBills);
      setPrescriptions(pharmacyPrescriptions);
    } catch (error) {
      console.error('Error loading pharmacy data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddMedicine = (e) => {
    e.preventDefault();
    
    if (!medicineForm.name.trim() || !medicineForm.quantity || !medicineForm.price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = addMedicineToPharmacy(pharmacy.id, {
        name: medicineForm.name.trim(),
        company: medicineForm.company.trim(),
        quantity: parseInt(medicineForm.quantity),
        price: parseFloat(medicineForm.price)
      });

      if (result.success) {
        setMedicines(prev => [...prev, result.medicine]);
        setMedicineForm({ name: '', company: '', quantity: '', price: '' });
        alert('Medicine added successfully!');
      } else {
        alert(result.error || 'Failed to add medicine');
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('Failed to add medicine');
    }
  };

  const handleUpdateMedicine = (medId, updates) => {
    try {
      const result = updatePharmacyMedicine(medId, updates);
      if (result.success) {
        setMedicines(prev => prev.map(med => 
          med.medId === medId ? result.medicine : med
        ));
        alert('Medicine updated successfully!');
      } else {
        alert(result.error || 'Failed to update medicine');
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      alert('Failed to update medicine');
    }
  };

  const handleDeleteMedicine = (medId) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        const result = deletePharmacyMedicine(medId);
        if (result.success) {
          setMedicines(prev => prev.filter(med => med.medId !== medId));
          alert('Medicine deleted successfully!');
        } else {
          alert(result.error || 'Failed to delete medicine');
        }
      } catch (error) {
        console.error('Error deleting medicine:', error);
        alert('Failed to delete medicine');
      }
    }
  };

  const handleSellMedicine = (e) => {
    e.preventDefault();
    
    if (!sellForm.medId || !sellForm.quantity || !sellForm.customerName) {
      alert('Please fill in all required fields');
      return;
    }

    const selectedMedicine = medicines.find(med => med.medId === sellForm.medId);
    if (!selectedMedicine) {
      alert('Medicine not found');
      return;
    }

    if (parseInt(sellForm.quantity) > selectedMedicine.quantity) {
      alert('Insufficient stock');
      return;
    }

    try {
      const total = selectedMedicine.price * parseInt(sellForm.quantity);
      
      // Create bill
      const billData = {
        pharmacyId: pharmacy.id,
        items: [{
          medId: selectedMedicine.medId,
          name: selectedMedicine.name,
          quantity: parseInt(sellForm.quantity),
          price: selectedMedicine.price
        }],
        total,
        customerName: sellForm.customerName.trim(),
        customerPhone: sellForm.customerPhone.trim(),
        timestamp: new Date().toISOString()
      };

      const result = createBill(billData);
      if (result.success) {
        // Update medicine quantity
        handleUpdateMedicine(selectedMedicine.medId, {
          quantity: selectedMedicine.quantity - parseInt(sellForm.quantity)
        });

        // Update bills list
        setBills(prev => [...prev, result.bill]);
        
        // Reset form
        setSellForm({ medId: '', quantity: '', customerName: '', customerPhone: '' });
        
        alert("Sale completed! Bill ID: ${result.bill.billId.slice(-8)}");
      } else {
        alert(result.error || 'Failed to create bill');
      }
    } catch (error) {
      console.error('Error selling medicine:', error);
      alert('Failed to process sale');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{translate('Loading dashboard...')}</p>
        </div>
      </div>
    );
  }

  if (!pharmacy) {
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
              { key: 'add_medicine', label: translate('Add Medicine'), icon: '➕' },
              { key: 'view_medicines', label: translate('View Medicines'), icon: '💊' },
              { key: 'sell_medicine', label: translate('Sell Medicine'), icon: '💰' },
              { key: 'view_bills', label: translate('View Bills'), icon: '🧾' },
              { key: 'prescriptions', label: translate('Prescriptions'), icon: '📋' },
              { key: 'profile', label: translate('Profile'), icon: '👤' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  section === item.key
                    ? 'bg-yellow-600 text-white shadow-md'
                    : 'hover:bg-yellow-100 text-gray-700'
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
                    {translate('Welcome back')}, {pharmacy.name} 🏥
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {translate('Manage your pharmacy inventory and sales')}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{medicines.length}</div>
                      <div className="text-sm text-gray-600">{translate('Total Medicines')}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{bills.length}</div>
                      <div className="text-sm text-gray-600">{translate('Total Bills')}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{prescriptions.length}</div>
                      <div className="text-sm text-gray-600">{translate('Prescriptions')}</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        ₹{bills.reduce((sum, bill) => sum + bill.total, 0).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">{translate('Total Revenue')}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <button
                    onClick={() => setSection('add_medicine')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">➕</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Add Medicine')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Add new medicines to inventory')}</p>
                  </button>

                  <button
                    onClick={() => setSection('sell_medicine')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">💰</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Sell Medicine')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Process customer sales')}</p>
                  </button>

                  <button
                    onClick={() => setSection('view_bills')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">🧾</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('View Bills')}</h3>
                    <p className="text-gray-600 text-sm">{translate('View sales history and bills')}</p>
                  </button>
                </div>
              </div>
            )}

            {/* Add Medicine */}
            {section === 'add_medicine' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate('Add New Medicine')}
                </h3>
                
                <form onSubmit={handleAddMedicine} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('Medicine Name')} *
                      </label>
                      <input
                        type="text"
                        value={medicineForm.name}
                        onChange={(e) => setMedicineForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder={translate('Enter medicine name')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('Company')}
                      </label>
                      <input
                        type="text"
                        value={medicineForm.company}
                        onChange={(e) => setMedicineForm(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder={translate('Enter company name')}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('Quantity')} *
                      </label>
                      <input
                        type="number"
                        value={medicineForm.quantity}
                        onChange={(e) => setMedicineForm(prev => ({ ...prev, quantity: e.target.value }))}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder={translate('Enter quantity')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('Price (₹)')} *
                      </label>
                      <input
                        type="number"
                        value={medicineForm.price}
                        onChange={(e) => setMedicineForm(prev => ({ ...prev, price: e.target.value }))}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder={translate('Enter price')}
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                  >
                    {translate('Add Medicine')}
                  </button>
                </form>
              </div>
            )}

            {/* View Medicines */}
            {section === 'view_medicines' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate('Medicine Inventory')}
                </h3>
                
                {medicines.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {translate('No medicines in inventory')}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Name')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Company')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Quantity')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Price')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Actions')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {medicines.map((medicine) => (
                          <tr key={medicine.medId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {medicine.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {medicine.company || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={medicine.quantity < 20 ? 'text-red-600 font-semibold' : ''}>
                                {medicine.quantity}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{medicine.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDeleteMedicine(medicine.medId)}
                                className="text-red-600 hover:text-red-900"
                              >
                                {translate('Delete')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          {/* Sell Medicine */}
            {section === 'sell_medicine' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate('Sell Medicine')}
                </h3>
                
                <form onSubmit={handleSellMedicine} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('Select Medicine')} *
                    </label>
                    <select
                      value={sellForm.medId}
                      onChange={(e) => setSellForm(prev => ({ ...prev, medId: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="">{translate('Choose a medicine')}</option>
                      {medicines.map((medicine) => (
                        <option key={medicine.medId} value={medicine.medId}>
                          {medicine.name} - Stock: {medicine.quantity} - ₹{medicine.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('Quantity')} *
                      </label>
                      <input
                        type="number"
                        value={sellForm.quantity}
                        onChange={(e) => setSellForm(prev => ({ ...prev, quantity: e.target.value }))}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder={translate('Enter quantity')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('Customer Name')} *
                      </label>
                      <input
                        type="text"
                        value={sellForm.customerName}
                        onChange={(e) => setSellForm(prev => ({ ...prev, customerName: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder={translate('Enter customer name')}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('Customer Phone')}
                    </label>
                    <input
                      type="tel"
                      value={sellForm.customerPhone}
                      onChange={(e) => setSellForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder={translate('Enter customer phone')}
                    />
                  </div>
                  
                  {sellForm.medId && sellForm.quantity && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">{translate('Sale Summary')}</h4>
                      <p className="text-sm text-gray-600">
                        {translate('Total Amount')}: ₹{(() => {
                          const selectedMedicine = medicines.find(med => med.medId === sellForm.medId);
                          return selectedMedicine ? (selectedMedicine.price * parseInt(sellForm.quantity || 0)).toFixed(2) : 0;
                        })()}
                      </p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    {translate('Process Sale')}
                  </button>
                </form>
              </div>
            )}

            {/* View Bills */}
            {section === 'view_bills' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate('Sales Bills')}
                </h3>
                
                {bills.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {translate('No bills found')}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {bills.map((bill) => (
                      <div key={bill.billId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">
                            {translate('Bill')} #{bill.billId.slice(-8)}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(bill.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <p>{translate('Customer')}: {bill.customerName}</p>
                          {bill.customerPhone && <p>{translate('Phone')}: {bill.customerPhone}</p>}
                        </div>
                        
                        <div className="space-y-1">
                          {bill.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x {item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between font-medium">
                            <span>{translate('Total')}:</span>
                            <span>₹{bill.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                
                {prescriptions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {translate('No prescriptions received')}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {translate('Prescription')} #{prescription.id.slice(-8)}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {translate('Patient')}: {prescription.patientName}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500">
                              {new Date(prescription.createdAt).toLocaleDateString()}
                            </span>
                            <div className="mt-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                prescription.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {translate(prescription.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                            {prescription.text}
                          </pre>
                        </div>
                        
                        {prescription.status === 'pending' && (
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => {
                                // Mark as completed
                                const updatedPrescriptions = prescriptions.map(p => 
                                  p.id === prescription.id ? { ...p, status: 'completed' } : p
                                );
                                setPrescriptions(updatedPrescriptions);
                              }}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                            >
                              {translate('Mark as Completed')}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                      {translate('Pharmacy Name')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{pharmacy.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Phone')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{pharmacy.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Email')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{pharmacy.email || translate('Not specified')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translate('Address')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{pharmacy.address || translate('Not specified')}</p>
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