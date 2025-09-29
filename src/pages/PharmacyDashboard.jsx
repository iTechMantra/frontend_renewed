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
  const [reorderList, setReorderList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Medicine form state
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    company: '',
    quantity: '',
    price: '',
    category: '',
    expiryDate: '',
    stockAlert: 10
  });

  // Sell form state
  const [sellForm, setSellForm] = useState({
    medId: '',
    quantity: '',
    customerName: '',
    customerPhone: ''
  });

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');

  // Health schemes data
  const [healthSchemes] = useState([
    {
      id: 1,
      name: 'Jan Aushadhi Scheme',
      description: 'Provides quality generic medicines at affordable prices',
      icon: '💊',
      coveredMedicines: ['Paracetamol', 'Metformin', 'Amoxicillin', 'Cetirizine', 'Aspirin'],
      discount: '50-90%'
    },
    {
      id: 2,
      name: 'Pradhan Mantri Bhartiya Janaushadhi Pariyojana',
      description: 'Government initiative for affordable medicines',
      icon: '🏥',
      coveredMedicines: ['Omeprazole', 'Losartan', 'Vitamin D3', 'Atorvastatin'],
      discount: '60-80%'
    },
    {
      id: 3,
      name: 'State Health Scheme',
      description: 'State government health coverage',
      icon: '🛡️',
      coveredMedicines: ['Paracetamol', 'Amoxicillin', 'Cetirizine'],
      discount: 'Free'
    }
  ]);

  // Analytics data
  const [analytics] = useState({
    topMedicines: [
      { name: 'Paracetamol 500mg', sales: 45 },
      { name: 'Amoxicillin 250mg', sales: 32 },
      { name: 'Cetirizine 10mg', sales: 28 },
      { name: 'Metformin 500mg', sales: 25 },
      { name: 'Omeprazole 20mg', sales: 22 }
    ],
    commonConditions: [
      { condition: 'Fever & Cold', count: 35 },
      { condition: 'Diabetes', count: 28 },
      { condition: 'Hypertension', count: 24 },
      { condition: 'Acidity', count: 20 },
      { condition: 'Allergies', count: 18 }
    ],
    dailySales: [
      { day: 'Mon', sales: 12500 },
      { day: 'Tue', sales: 14200 },
      { day: 'Wed', sales: 11800 },
      { day: 'Thu', sales: 15600 },
      { day: 'Fri', sales: 13800 },
      { day: 'Sat', sales: 17200 },
      { day: 'Sun', sales: 9800 }
    ]
  });

  // Loyalty customers
  const [loyaltyCustomers] = useState([
    {
      id: 'CUST001',
      name: 'Rajesh Kumar',
      phone: '9876543210',
      totalPurchases: 8,
      totalAmount: 2850,
      discountEligible: true
    },
    {
      id: 'CUST002',
      name: 'Priya Sharma',
      phone: '9123456789',
      totalPurchases: 12,
      totalAmount: 4200,
      discountEligible: true
    },
    {
      id: 'CUST003',
      name: 'Mohammad Ali',
      phone: '9567890123',
      totalPurchases: 5,
      totalAmount: 1800,
      discountEligible: false
    }
  ]);

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

      // If no real data exists, use dummy data with enhanced fields
      if (pharmacyMedicines.length === 0) {
        pharmacyMedicines = [
          {
            medId: 'MED001',
            pharmacyId: pharmacyId,
            name: 'Paracetamol 500mg',
            company: 'Sun Pharma',
            quantity: 150,
            price: 25.50,
            category: 'Pain Relief',
            expiryDate: '2024-12-31',
            stockAlert: 10,
            batchNo: 'BATCH001'
          },
          {
            medId: 'MED002',
            pharmacyId: pharmacyId,
            name: 'Amoxicillin 250mg',
            company: 'Cipla',
            quantity: 80,
            price: 85.00,
            category: 'Antibiotic',
            expiryDate: '2024-10-15',
            stockAlert: 10,
            batchNo: 'BATCH002'
          },
          {
            medId: 'MED003',
            pharmacyId: pharmacyId,
            name: 'Cetirizine 10mg',
            company: 'Dr. Reddy\'s',
            quantity: 200,
            price: 15.75,
            category: 'Allergy',
            expiryDate: '2025-03-20',
            stockAlert: 10,
            batchNo: 'BATCH003'
          },
          {
            medId: 'MED004',
            pharmacyId: pharmacyId,
            name: 'Omeprazole 20mg',
            company: 'Lupin',
            quantity: 65,
            price: 120.00,
            category: 'Acidity',
            expiryDate: '2024-11-30',
            stockAlert: 10,
            batchNo: 'BATCH004'
          },
          {
            medId: 'MED005',
            pharmacyId: pharmacyId,
            name: 'Metformin 500mg',
            company: 'Torrent',
            quantity: 90,
            price: 45.25,
            category: 'Diabetes',
            expiryDate: '2025-01-15',
            stockAlert: 10,
            batchNo: 'BATCH005'
          },
          {
            medId: 'MED006',
            pharmacyId: pharmacyId,
            name: 'Aspirin 75mg',
            company: 'Bayer',
            quantity: 120,
            price: 32.00,
            category: 'Blood Thinner',
            expiryDate: '2024-09-30',
            stockAlert: 10,
            batchNo: 'BATCH006'
          },
          {
            medId: 'MED007',
            pharmacyId: pharmacyId,
            name: 'Losartan 25mg',
            company: 'Ranbaxy',
            quantity: 45,
            price: 95.50,
            category: 'Hypertension',
            expiryDate: '2024-08-20',
            stockAlert: 10,
            batchNo: 'BATCH007'
          },
          {
            medId: 'MED008',
            pharmacyId: pharmacyId,
            name: 'Vitamin D3 1000IU',
            company: 'Abbott',
            quantity: 180,
            price: 78.00,
            category: 'Supplement',
            expiryDate: '2025-06-30',
            stockAlert: 10,
            batchNo: 'BATCH008'
          },
          {
            medId: 'MED009',
            pharmacyId: pharmacyId,
            name: 'Atorvastatin 10mg',
            company: 'Sun Pharma',
            quantity: 8,
            price: 65.00,
            category: 'Cholesterol',
            expiryDate: '2024-07-15',
            stockAlert: 10,
            batchNo: 'BATCH009'
          },
          {
            medId: 'MED010',
            pharmacyId: pharmacyId,
            name: 'Ibuprofen 400mg',
            company: 'Cipla',
            quantity: 5,
            price: 28.50,
            category: 'Pain Relief',
            expiryDate: '2024-05-30',
            stockAlert: 10,
            batchNo: 'BATCH010'
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
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            qrCode: 'BILL001_QR'
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
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            qrCode: 'BILL002_QR'
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
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            qrCode: 'BILL003_QR'
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
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            qrCode: 'BILL004_QR'
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
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            qrCode: 'BILL005_QR'
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
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
          },
          {
            id: 'PRES002',
            patientId: 'PAT002',
            patientName: 'Meera Singh',
            text: 'Rx: Metformin 500mg - Take 1 tablet twice daily with meals\nOmeprazole 20mg - Take 1 tablet before breakfast\n\nDr. Suresh Reddy\nMBBS, MD Endocrinology',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
          },
          {
            id: 'PRES003',
            patientId: 'PAT003',
            patientName: 'Kiran Joshi',
            text: 'Rx: Cetirizine 10mg - Take 1 tablet at bedtime\nVitamin D3 1000IU - Take 1 tablet daily\n\nDr. Priya Nair\nMBBS, MD Dermatology',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
          },
          {
            id: 'PRES004',
            patientId: 'PAT004',
            patientName: 'Deepak Yadav',
            text: 'Rx: Losartan 25mg - Take 1 tablet daily in morning\nAspirin 75mg - Take 1 tablet daily after dinner\n\nDr. Rakesh Agarwal\nMBBS, MD Cardiology',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
          },
          {
            id: 'PRES005',
            patientId: 'PAT005',
            patientName: 'Kavya Menon',
            text: 'Rx: Paracetamol 500mg - Take 1 tablet every 6 hours as needed\nAmoxicillin 250mg - Take 1 tablet three times daily for 5 days\n\nDr. Vikram Shah\nMBBS, MBBS General Practice',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
          }
        ];
      }

      setMedicines(pharmacyMedicines);
      setBills(pharmacyBills);
      setPrescriptions(pharmacyPrescriptions);
      
      // Check for medicines needing reorder
      checkLowStockMedicines(pharmacyMedicines);
      checkExpiringMedicines(pharmacyMedicines);
    } catch (error) {
      console.error('Error loading pharmacy data:', error);
    }
  };

  const checkLowStockMedicines = (medicinesList) => {
    const lowStock = medicinesList.filter(med => med.quantity < med.stockAlert);
    if (lowStock.length > 0) {
      console.log(`Alert: ${lowStock.length} medicines are low on stock`);
    }
  };

  const checkExpiringMedicines = (medicinesList) => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const expiringSoon = medicinesList.filter(med => {
      const expiryDate = new Date(med.expiryDate);
      return expiryDate <= nextMonth && expiryDate >= today;
    });
    
    if (expiringSoon.length > 0) {
      console.log(`Alert: ${expiringSoon.length} medicines expiring this month`);
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
        price: parseFloat(medicineForm.price),
        category: medicineForm.category || 'General',
        expiryDate: medicineForm.expiryDate,
        stockAlert: parseInt(medicineForm.stockAlert) || 10,
        batchNo: `BATCH${String(medicines.length + 1).padStart(3, '0')}`
      });

      if (result.success) {
        setMedicines(prev => [...prev, result.medicine]);
        setMedicineForm({ 
          name: '', 
          company: '', 
          quantity: '', 
          price: '',
          category: '',
          expiryDate: '',
          stockAlert: 10
        });
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
      
      // Check if customer is eligible for discount
      const customer = loyaltyCustomers.find(cust => 
        cust.phone === sellForm.customerPhone || cust.name === sellForm.customerName
      );
      const discount = customer?.discountEligible ? 0.05 : 0; // 5% discount
      const finalTotal = total * (1 - discount);
      
      // Create bill
      const billData = {
        pharmacyId: pharmacy.id,
        items: [{
          medId: selectedMedicine.medId,
          name: selectedMedicine.name,
          quantity: parseInt(sellForm.quantity),
          price: selectedMedicine.price
        }],
        total: finalTotal,
        discount: discount * total,
        customerName: sellForm.customerName.trim(),
        customerPhone: sellForm.customerPhone.trim(),
        timestamp: new Date().toISOString(),
        qrCode: `BILL${String(bills.length + 1).padStart(3, '0')}_QR`
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
        
        // Fixed template literal
        alert(`Sale completed! Bill ID: ${result.bill.billId.slice(-8)}${discount > 0 ? ' (5% discount applied!)' : ''}`);
      } else {
        alert(result.error || 'Failed to create bill');
      }
    } catch (error) {
      console.error('Error selling medicine:', error);
      alert('Failed to process sale');
    }
  };

  const handleAddToReorder = (medicine) => {
    if (!reorderList.find(item => item.medId === medicine.medId)) {
      setReorderList(prev => [...prev, {
        ...medicine,
        reorderQuantity: medicine.stockAlert * 2
      }]);
      alert(`${medicine.name} added to reorder list`);
    }
  };

  const handleAutoReorder = () => {
    const lowStockMedicines = medicines.filter(med => med.quantity < med.stockAlert);
    setReorderList(lowStockMedicines.map(med => ({
      ...med,
      reorderQuantity: med.stockAlert * 2
    })));
    alert(`Added ${lowStockMedicines.length} low stock medicines to reorder list`);
  };

  const handleDownloadBill = (bill) => {
    // Simulate PDF download
    const billContent = `
      PHARMACY BILL
      Bill ID: ${bill.billId}
      Date: ${new Date(bill.timestamp).toLocaleDateString()}
      Customer: ${bill.customerName}
      Phone: ${bill.customerPhone || 'N/A'}
      
      Items:
      ${bill.items.map(item => `${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      
      ${bill.discount > 0 ? `Discount: ₹${bill.discount.toFixed(2)}\n` : ''}
      Total: ₹${bill.total.toFixed(2)}
      
      QR Code: ${bill.qrCode}
      Thank you for your purchase!
    `;
    
    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bill_${bill.billId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', color: 'red', text: 'Expired' };
    if (diffDays <= 30) return { status: 'warning', color: 'orange', text: 'Expiring Soon' };
    if (diffDays <= 90) return { status: 'alert', color: 'yellow', text: 'Near Expiry' };
    return { status: 'good', color: 'green', text: 'Valid' };
  };

  const getStockStatus = (quantity, stockAlert) => {
    if (quantity === 0) return { status: 'out', color: 'red', text: 'Out of Stock' };
    if (quantity < stockAlert) return { status: 'low', color: 'orange', text: 'Low Stock' };
    return { status: 'good', color: 'green', text: 'In Stock' };
  };

  // Filter medicines based on search and filters
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || medicine.category === filterCategory;
    const matchesStock = filterStock === 'all' || 
                        (filterStock === 'low' && medicine.quantity < medicine.stockAlert) ||
                        (filterStock === 'out' && medicine.quantity === 0) ||
                        (filterStock === 'expiring' && getExpiryStatus(medicine.expiryDate).status !== 'good');
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Get unique categories for filter
  const categories = [...new Set(medicines.map(med => med.category))];

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
              { key: 'analytics', label: translate('Analytics'), icon: '📊' },
              { key: 'health_schemes', label: translate('Health Schemes'), icon: '🏥' },
              { key: 'reorder', label: translate('Reorder List'), icon: '📦' },
              { key: 'loyalty', label: translate('Loyalty Program'), icon: '🎁' },
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

                  {/* Alerts Section */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Low Stock Alert */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-red-600">
                            {medicines.filter(med => med.quantity < med.stockAlert).length}
                          </div>
                          <div className="text-sm text-red-700">{translate('Low Stock Medicines')}</div>
                        </div>
                        <div className="text-2xl">📦</div>
                      </div>
                    </div>

                    {/* Expiry Alert */}
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-orange-600">
                            {medicines.filter(med => getExpiryStatus(med.expiryDate).status !== 'good').length}
                          </div>
                          <div className="text-sm text-orange-700">{translate('Medicines Expiring Soon')}</div>
                        </div>
                        <div className="text-2xl">🕒</div>
                      </div>
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

                  <button
                    onClick={() => setSection('analytics')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">📊</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Analytics')}</h3>
                    <p className="text-gray-600 text-sm">{translate('View sales and prescription analytics')}</p>
                  </button>

                  <button
                    onClick={() => setSection('reorder')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">📦</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Reorder List')}</h3>
                    <p className="text-gray-600 text-sm">{translate('Manage medicine reorders')}</p>
                  </button>

                  <button
                    onClick={() => setSection('health_schemes')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="text-3xl mb-3">🏥</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{translate('Health Schemes')}</h3>
                    <p className="text-gray-600 text-sm">{translate('View government health schemes')}</p>
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
                        {translate('Category')}
                      </label>
                      <select
                        value={medicineForm.category}
                        onChange={(e) => setMedicineForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        <option value="Pain Relief">Pain Relief</option>
                        <option value="Antibiotic">Antibiotic</option>
                        <option value="Allergy">Allergy</option>
                        <option value="Acidity">Acidity</option>
                        <option value="Diabetes">Diabetes</option>
                        <option value="Hypertension">Hypertension</option>
                        <option value="Cholesterol">Cholesterol</option>
                        <option value="Supplement">Supplement</option>
                        <option value="Blood Thinner">Blood Thinner</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('Expiry Date')}
                      </label>
                      <input
                        type="date"
                        value={medicineForm.expiryDate}
                        onChange={(e) => setMedicineForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('Stock Alert Level')}
                      </label>
                      <input
                        type="number"
                        value={medicineForm.stockAlert}
                        onChange={(e) => setMedicineForm(prev => ({ ...prev, stockAlert: e.target.value }))}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="10"
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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
                    {translate('Medicine Inventory')} ({medicines.length})
                  </h3>
                  
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    
                    <select
                      value={filterStock}
                      onChange={(e) => setFilterStock(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="all">All Stock</option>
                      <option value="low">Low Stock</option>
                      <option value="out">Out of Stock</option>
                      <option value="expiring">Expiring Soon</option>
                    </select>
                  </div>
                </div>
                
                {filteredMedicines.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {translate('No medicines found matching your criteria')}
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
                            {translate('Category')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Quantity')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Price')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Expiry')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Actions')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMedicines.map((medicine) => {
                          const stockStatus = getStockStatus(medicine.quantity, medicine.stockAlert);
                          const expiryStatus = getExpiryStatus(medicine.expiryDate);
                          
                          return (
                            <tr key={medicine.medId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {medicine.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {medicine.company || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {medicine.category}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  stockStatus.status === 'out' ? 'bg-red-100 text-red-800' :
                                  stockStatus.status === 'low' ? 'bg-orange-100 text-orange-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {medicine.quantity} {stockStatus.status !== 'good' && `(${stockStatus.text})`}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ₹{medicine.price}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  expiryStatus.status === 'expired' ? 'bg-red-100 text-red-800' :
                                  expiryStatus.status === 'warning' ? 'bg-orange-100 text-orange-800' :
                                  expiryStatus.status === 'alert' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {new Date(medicine.expiryDate).toLocaleDateString()} 
                                  {expiryStatus.status !== 'good' && ` (${expiryStatus.text})`}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  onClick={() => handleAddToReorder(medicine)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  {translate('Reorder')}
                                </button>
                                <button
                                  onClick={() => handleDeleteMedicine(medicine.medId)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  {translate('Delete')}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
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
                          const total = selectedMedicine ? (selectedMedicine.price * parseInt(sellForm.quantity || 0)) : 0;
                          
                          // Check for discount eligibility
                          const customer = loyaltyCustomers.find(cust => 
                            cust.phone === sellForm.customerPhone || cust.name === sellForm.customerName
                          );
                          const discount = customer?.discountEligible ? total * 0.05 : 0;
                          const finalTotal = total - discount;
                          
                          return (
                            <>
                              {total.toFixed(2)}
                              {discount > 0 && (
                                <span className="text-green-600 ml-2">
                                  (5% discount: -₹{discount.toFixed(2)})
                                </span>
                              )}
                              {discount > 0 && (
                                <div className="font-semibold text-green-700 mt-1">
                                  Final Amount: ₹{finalTotal.toFixed(2)}
                                </div>
                              )}
                            </>
                          );
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
                  {translate('Sales Bills')} ({bills.length})
                </h3>
                
                {bills.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {translate('No bills found')}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {bills.map((bill) => (
                      <div key={bill.billId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                        
                        <div className="space-y-1 mb-2">
                          {bill.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x {item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        
                        {bill.discount > 0 && (
                          <div className="flex justify-between text-sm text-green-600 mb-1">
                            <span>Discount (5%):</span>
                            <span>-₹{bill.discount.toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between font-medium">
                            <span>{translate('Total')}:</span>
                            <span>₹{bill.total.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleDownloadBill(bill)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                          >
                            {translate('Download PDF')}
                          </button>
                          <button
                            onClick={() => alert(`QR Code: ${bill.qrCode}\n\nScan for verification`)}
                            className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                          >
                            {translate('View QR Code')}
                          </button>
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
                  {translate('Prescriptions')} ({prescriptions.length})
                </h3>
                
                {prescriptions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {translate('No prescriptions received')}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                            <button
                              onClick={() => {
                                // Check medicine availability
                                const medicinesInPrescription = prescription.text.match(/[A-Za-z]+\s\d+mg/g) || [];
                                const unavailableMedicines = medicinesInPrescription.filter(medName => 
                                  !medicines.some(med => med.name.includes(medName.split(' ')[0]))
                                );
                                
                                if (unavailableMedicines.length > 0) {
                                  alert(`The following medicines are not available:\n${unavailableMedicines.join('\n')}\n\nSuggesting nearby pharmacies...`);
                                } else {
                                  alert('All medicines are available in stock!');
                                }
                              }}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                            >
                              {translate('Check Availability')}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics */}
            {section === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    {translate('Pharmacy Analytics')} 📊
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Medicines */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-4">{translate('Top Selling Medicines')}</h4>
                      <div className="space-y-3">
                        {analytics.topMedicines.map((medicine, index) => (
                          <div key={medicine.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                              <span className="text-sm text-gray-700">{medicine.name}</span>
                            </div>
                            <span className="text-sm font-medium text-green-600">{medicine.sales} sales</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Common Conditions */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-4">{translate('Most Common Conditions')}</h4>
                      <div className="space-y-3">
                        {analytics.commonConditions.map((condition, index) => (
                          <div key={condition.condition} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                              <span className="text-sm text-gray-700">{condition.condition}</span>
                            </div>
                            <span className="text-sm font-medium text-blue-600">{condition.count} cases</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Daily Sales Trend */}
                  <div className="mt-6 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-4">{translate('Weekly Sales Trend')}</h4>
                    <div className="flex items-end justify-between h-32">
                      {analytics.dailySales.map((day) => (
                        <div key={day.day} className="flex flex-col items-center space-y-2">
                          <div 
                            className="bg-yellow-500 rounded-t w-8 transition-all hover:bg-yellow-600"
                            style={{ height: `${(day.sales / 20000) * 100}px` }}
                            title={`₹${day.sales}`}
                          ></div>
                          <span className="text-xs text-gray-600">{day.day}</span>
                          <span className="text-xs font-medium">₹{(day.sales / 1000).toFixed(0)}k</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

           // Enhanced Health Schemes Section - PharmacyDashboard.jsx
{section === 'health_schemes' && (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {translate('Government Health Schemes - Punjab')} 🏥
          </h3>
          <p className="text-gray-600 mt-1">
            {translate('Partner with government schemes to serve rural communities and boost your business')}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700 font-medium">
            💰 Revenue Opportunity: Increased Customer Base + Government Reimbursements
          </p>
        </div>
      </div>

      {/* Business Benefits Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-800 mb-2">Pharmacy Business Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            <span>Guaranteed payments from government</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            <span>Increased footfall from scheme beneficiaries</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            <span>Build trust as community healthcare partner</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: 1,
            name: 'Mukh Mantri Punjab Health Scheme',
            description: 'Free treatment and medicines for eligible families in Punjab',
            icon: '🏥',
            coveredMedicines: ['Paracetamol', 'Metformin', 'Amoxicillin', 'Cetirizine', 'Aspirin', 'Insulin'],
            discount: '100% Free for Beneficiaries',
            reimbursement: 'Full price reimbursed by government',
            eligibility: 'BPL families, Senior citizens, SC/ST communities',
            enrollment: 'Simple online registration',
            patientVolume: 'High - Covers 75% of rural population',
            paymentCycle: 'Monthly reimbursement',
            benefits: [
              'Guaranteed monthly revenue',
              'Build long-term customer relationships',
              'Community trust and recognition'
            ]
          },
          {
            id: 2,
            name: 'Punjab Jan Aushadhi Scheme',
            description: 'Quality generic medicines at affordable prices',
            icon: '💊',
            coveredMedicines: ['Omeprazole', 'Losartan', 'Vitamin D3', 'Atorvastatin', 'Amlodipine'],
            discount: '50-90% cheaper than branded',
            reimbursement: 'Margin guaranteed by government',
            eligibility: 'All Punjab residents',
            enrollment: 'Automatic for registered pharmacies',
            patientVolume: 'Very High - Popular in villages',
            paymentCycle: 'Bi-weekly settlements',
            benefits: [
              'High volume, consistent sales',
              'Attract price-sensitive customers',
              'Competitive advantage in rural areas'
            ]
          },
          {
            id: 3,
            name: 'Punjab Health Insurance Scheme',
            description: 'Cashless treatment and medicines for critical illnesses',
            icon: '🛡️',
            coveredMedicines: ['Chemotherapy drugs', 'Chronic disease medications', 'Surgical supplies'],
            discount: 'Cashless claims',
            reimbursement: 'Direct insurance payments',
            eligibility: 'All Punjab residents with health cards',
            enrollment: 'Insurance partner registration',
            patientVolume: 'Medium but high-value',
            paymentCycle: '15-day claim processing',
            benefits: [
              'High-value medicine sales',
              'Build specialty medicine reputation',
              'Partner with major hospitals'
            ]
          },
          {
            id: 4,
            name: 'Punjab Matri Shakti Yojana',
            description: 'Maternal and child healthcare benefits',
            icon: '🤰',
            coveredMedicines: ['Prenatal vitamins', 'Iron supplements', 'Folic acid', 'Calcium'],
            discount: 'Free for pregnant women',
            reimbursement: 'Direct government transfer',
            eligibility: 'All pregnant women in Punjab',
            enrollment: 'ANM/ASHA worker referrals',
            patientVolume: 'Consistent - Regular prenatal care',
            paymentCycle: 'Monthly bulk payments',
            benefits: [
              'Regular recurring customers',
              'Build family healthcare relationships',
              'Community health worker partnerships'
            ]
          },
          {
            id: 5,
            name: 'Punjab Senior Citizen Health Plan',
            description: 'Comprehensive healthcare for elderly population',
            icon: '👵',
            coveredMedicines: ['Blood pressure medications', 'Diabetes drugs', 'Pain management', 'Multivitamins'],
            discount: 'Subsidized up to 75%',
            reimbursement: 'Quarterly government settlements',
            eligibility: 'Senior citizens (60+ years)',
            enrollment: 'Simple age verification',
            patientVolume: 'Loyal long-term customers',
            paymentCycle: 'Quarterly reimbursements',
            benefits: [
              'Stable monthly revenue',
              'Multiple medicine sales per customer',
              'Word-of-mouth referrals in villages'
            ]
          },
          {
            id: 6,
            name: 'Punjab Rural Health Initiative',
            description: 'Telemedicine linked pharmacy benefits',
            icon: '📱',
            coveredMedicines: ['All essential medicines', 'Chronic disease management', 'Emergency medications'],
            discount: 'Telemedicine consultation + medicines',
            reimbursement: 'Combined service package',
            eligibility: 'Rural telemedicine patients',
            enrollment: 'Automatic with telemedicine platform',
            patientVolume: 'Growing with digital adoption',
            paymentCycle: 'Real-time digital payments',
            benefits: [
              'First-mover advantage in digital health',
              'Expand beyond local catchment area',
              'Modern pharmacy positioning'
            ]
          }
        ].map((scheme) => {
          const availableMedicines = scheme.coveredMedicines.filter(medicine => 
            medicines.some(med => med.name.toLowerCase().includes(medicine.toLowerCase()))
          );
          const coveragePercentage = (availableMedicines.length / scheme.coveredMedicines.length) * 100;
          
          return (
            <div key={scheme.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{scheme.icon}</div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {coveragePercentage.toFixed(0)}% Stock Ready
                  </span>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-2">{scheme.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
              
              {/* Business Metrics */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium">Patient Volume:</span>
                    <div className="text-green-600">{scheme.patientVolume}</div>
                  </div>
                  <div>
                    <span className="font-medium">Payments:</span>
                    <div className="text-blue-600">{scheme.paymentCycle}</div>
                  </div>
                </div>
              </div>
              
              {/* Medicine Coverage */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-sm font-medium text-gray-700">Covered Medicines:</h5>
                  <span className="text-xs text-gray-500">{availableMedicines.length}/{scheme.coveredMedicines.length} in stock</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {scheme.coveredMedicines.map((medicine) => {
                    const isInStock = medicines.some(med => 
                      med.name.toLowerCase().includes(medicine.toLowerCase())
                    );
                    return (
                      <span 
                        key={medicine}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          isInStock 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-orange-100 text-orange-800 border border-orange-200'
                        }`}
                        title={isInStock ? 'In Stock - Ready for scheme sales' : 'Not in stock - Potential revenue loss'}
                      >
                        {medicine} {isInStock ? '✓' : '⚠'}
                      </span>
                    );
                  })}
                </div>
              </div>
              
              {/* Financial Benefits */}
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Your Benefits:</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  {scheme.benefits.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reimbursement:</span>
                  <span className="font-medium text-green-600">{scheme.reimbursement}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Eligibility:</span>
                  <span className="font-medium text-blue-600">{scheme.eligibility}</span>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <button 
                  onClick={() => {
                    if (availableMedicines.length === 0) {
                      alert(`🚨 Business Opportunity!\n\nYou don't have any ${scheme.name} medicines in stock.\n\nYou're missing out on:\n• ${scheme.patientVolume} patients\n• ${scheme.reimbursement}\n\nAdd these medicines to tap into government revenue!`);
                    } else {
                      alert(`✅ Great! You're ready for ${scheme.name}\n\nYou have ${availableMedicines.length} covered medicines in stock.\n\nExpected benefits:\n• ${scheme.patientVolume}\n• ${scheme.paymentCycle} payments\n• ${scheme.reimbursement}\n\nContact Punjab Health Department to enroll!`);
                    }
                  }}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    availableMedicines.length > 0
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {availableMedicines.length > 0 ? 'Ready to Enroll' : 'Stock Required - High Potential'}
                </button>
                
                <button 
                  onClick={() => {
                    const missingMedicines = scheme.coveredMedicines.filter(medicine => 
                      !medicines.some(med => med.name.toLowerCase().includes(medicine.toLowerCase()))
                    );
                    
                    if (missingMedicines.length > 0) {
                      const orderList = missingMedicines.map(med => `${med} - High Demand`).join('\n');
                      setReorderList(prev => [
                        ...prev,
                        ...missingMedicines.map(med => ({
                          medId: `SCHEME_${scheme.id}_${med}`,
                          name: `${med} - ${scheme.name}`,
                          quantity: 0,
                          reorderQuantity: 50,
                          scheme: scheme.name,
                          urgency: 'high'
                        }))
                      ]);
                      alert(`📋 Added ${missingMedicines.length} high-demand medicines to your reorder list!\n\nThese medicines are covered under ${scheme.name} and will bring:\n• ${scheme.patientVolume} patients\n• Guaranteed ${scheme.reimbursement}\n\nCheck your Reorder List to place bulk orders!`);
                    } else {
                      alert('🎉 Excellent! You have all covered medicines in stock. You are fully prepared to serve scheme beneficiaries and maximize your revenue!');
                    }
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  {(() => {
                    const missingCount = scheme.coveredMedicines.filter(medicine => 
                      !medicines.some(med => med.name.toLowerCase().includes(medicine.toLowerCase()))
                    ).length;
                    return missingCount > 0 ? `Add ${missingCount} Missing Medicines to Order List` : 'Fully Stocked - Ready for Business';
                  })()}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Revenue Potential Calculator */}
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {translate('Punjab Scheme Revenue Calculator')} 💰
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Current Scheme Performance</h4>
          <div className="space-y-3">
            {[
              { scheme: 'Mukh Mantri Scheme', potential: '₹45,000/month', current: '₹12,000/month' },
              { scheme: 'Jan Aushadhi', potential: '₹28,000/month', current: '₹8,000/month' },
              { scheme: 'Health Insurance', potential: '₹35,000/month', current: '₹5,000/month' },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{item.scheme}</span>
                <div className="text-right">
                  <div className="text-xs text-green-600">Potential: {item.potential}</div>
                  <div className="text-xs text-orange-600">Current: {item.current}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Business Growth Opportunity</h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Additional Monthly Revenue:</span>
              <span className="text-green-600 font-semibold">₹89,000</span>
            </div>
            <div className="flex justify-between">
              <span>New Customers Monthly:</span>
              <span className="text-blue-600 font-semibold">150+ families</span>
            </div>
            <div className="flex justify-between">
              <span>Government Partnerships:</span>
              <span className="text-purple-600 font-semibold">6 schemes available</span>
            </div>
          </div>
          <button 
            onClick={() => setSection('reorder')}
            className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-md hover:from-green-600 hover:to-blue-700 transition-colors"
          >
            Stock Scheme Medicines - Unlock Revenue
          </button>
        </div>
      </div>
    </div>

    {/* Success Stories from Punjab */}
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {translate('Punjab Pharmacy Success Stories')} 🌟
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            pharmacy: 'Malwa Medical Store, Ludhiana',
            growth: 'Revenue increased by 300%',
            story: 'Partnered with 4 government schemes, now serving 200+ scheme patients monthly'
          },
          {
            pharmacy: 'Majha Pharmacy, Amritsar',
            growth: 'Customer base grew 5x',
            story: 'Became primary Jan Aushadhi center, expanded to 3 new villages'
          },
          {
            pharmacy: 'Doaba Healthcare, Jalandhar',
            growth: 'Added 2 new staff members',
            story: 'Government scheme revenue now covers 60% of total business'
          }
        ].map((success, index) => (
          <div key={index} className="border border-green-200 bg-green-50 rounded-lg p-4">
            <h5 className="font-semibold text-green-800 mb-2">{success.pharmacy}</h5>
            <div className="text-sm text-green-700 mb-2">{success.growth}</div>
            <p className="text-xs text-green-600">{success.story}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

            {/* Reorder List */}
            {section === 'reorder' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {translate('Reorder List')} 📦
                  </h3>
                  <button
                    onClick={handleAutoReorder}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    {translate('Auto-Generate Reorder List')}
                  </button>
                </div>

                {reorderList.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      {translate('No medicines in reorder list')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {translate('Low stock medicines will be automatically added here')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">⚠️</div>
                        <div>
                          <h4 className="font-semibold text-yellow-800">
                            {reorderList.length} medicines need reordering
                          </h4>
                          <p className="text-sm text-yellow-700">
                            These medicines are running low on stock
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {translate('Medicine')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {translate('Current Stock')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {translate('Reorder Quantity')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {translate('Actions')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reorderList.map((item) => (
                            <tr key={item.medId}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                                {item.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.reorderQuantity || (item.stockAlert * 2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => {
                                    setReorderList(prev => prev.filter(i => i.medId !== item.medId));
                                    alert(`Reorder request sent for ${item.name}`);
                                  }}
                                  className="text-green-600 hover:text-green-900 mr-3"
                                >
                                  {translate('Send Order')}
                                </button>
                                <button
                                  onClick={() => setReorderList(prev => prev.filter(i => i.medId !== item.medId))}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  {translate('Remove')}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => {
                          alert(`Order placed for ${reorderList.length} medicines!`);
                          setReorderList([]);
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        {translate('Place All Orders')}
                      </button>
                      <button
                        onClick={() => setReorderList([])}
                        className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        {translate('Clear List')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Loyalty Program */}
            {section === 'loyalty' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  {translate('Customer Loyalty Program')} 🎁
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Loyalty Benefits Card */}
                  <div className="border border-purple-200 bg-purple-50 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-800 mb-3">Loyalty Benefits</h4>
                    <ul className="space-y-2 text-sm text-purple-700">
                      <li>✅ 5% discount after 5 purchases</li>
                      <li>✅ Priority prescription processing</li>
                      <li>✅ Free home delivery for loyal customers</li>
                      <li>✅ Early access to new medicines</li>
                    </ul>
                  </div>

                  {/* Program Stats */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Program Statistics</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>Total Loyal Customers: {loyaltyCustomers.filter(c => c.discountEligible).length}</p>
                      <p>Customers Near Discount: {loyaltyCustomers.filter(c => !c.discountEligible).length}</p>
                      <p>Total Discount Given: ₹{loyaltyCustomers.reduce((sum, cust) => sum + (cust.totalAmount * 0.05), 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mb-4">Loyal Customers</h4>
                {loyaltyCustomers.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {translate('No loyalty customers yet')}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Customer')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Phone')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Total Purchases')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Total Amount')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {translate('Discount Status')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {loyaltyCustomers.map((customer) => (
                          <tr key={customer.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {customer.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {customer.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {customer.totalPurchases}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{customer.totalAmount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                customer.discountEligible 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {customer.discountEligible ? '5% Discount Active' : `${5 - customer.totalPurchases} more for discount`}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {section === 'profile' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  {translate('Pharmacy Profile')} 👤
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('Pharmacy Name')}
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">{pharmacy.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('Phone')}
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">{pharmacy.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('Email')}
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">{pharmacy.email || translate('Not specified')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('Address')}
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">{pharmacy.address || translate('Not specified')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('License Number')}
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">{pharmacy.license || 'PHARM123456'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate('GST Number')}
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border">{pharmacy.gst || 'GSTIN789012345'}</p>
                    </div>
                  </div>
                </div>

                {/* Pharmacy Statistics */}
                <div className="mt-8 pt-6 border-t">
                  <h4 className="text-md font-medium text-gray-800 mb-4">
                    {translate('Pharmacy Statistics')}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{medicines.length}</div>
                      <div className="text-sm text-gray-600">{translate('Medicines')}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{bills.length}</div>
                      <div className="text-sm text-gray-600">{translate('Total Sales')}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{prescriptions.length}</div>
                      <div className="text-sm text-gray-600">{translate('Prescriptions')}</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        ₹{bills.reduce((sum, bill) => sum + bill.total, 0).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">{translate('Revenue')}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={() => alert(translate('Profile editing functionality would be implemented here'))}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                  >
                    {translate('Edit Profile')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}