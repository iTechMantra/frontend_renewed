// src/services/storageService.js
import { v4 as uuidv4 } from 'uuid';

// Initialize storage with default data
export const initializeStorage = () => {
  try {
    // Check if storage is already initialized
    if (localStorage.getItem('storageInitialized')) {
      return;
    }

    // Set all default data
    localStorage.setItem('medicines', JSON.stringify(getDefaultMedicines()));
    localStorage.setItem('users', JSON.stringify([]));
    localStorage.setItem('doctors', JSON.stringify(getDefaultDoctors()));
    localStorage.setItem('ashas', JSON.stringify([]));
    localStorage.setItem('patients', JSON.stringify([]));
    localStorage.setItem('healthRecords', JSON.stringify([]));
    localStorage.setItem('messages', JSON.stringify([]));
    localStorage.setItem('prescriptions', JSON.stringify([]));
    localStorage.setItem('visits', JSON.stringify([]));
    localStorage.setItem('orders', JSON.stringify([]));
    localStorage.setItem('pharmacies', JSON.stringify(getDefaultPharmacies()));
    localStorage.setItem('otps', JSON.stringify([]));
    localStorage.setItem('session', JSON.stringify({ current: null }));
    localStorage.setItem('doctorStats', JSON.stringify({}));
    localStorage.setItem('cart', JSON.stringify([]));
    localStorage.setItem('deliveries', JSON.stringify([]));
    localStorage.setItem('pharmacyMedicines', JSON.stringify([]));
    localStorage.setItem('bills', JSON.stringify([]));
    localStorage.setItem('pharmacyPrescriptions', JSON.stringify([]));
    
    // Mark as initialized
    localStorage.setItem('storageInitialized', 'true');
    
    console.log('Storage initialized successfully with clean data');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Default data generators
const getDefaultMedicines = () => {
  return [
    {
      id: 'med-1',
      name: 'Paracetamol',
      company: 'Generic',
      dosage: '500mg',
      category: 'Pain Relief',
      price: 25,
      description: 'Used for fever and pain relief'
    },
    {
      id: 'med-2',
      name: 'Amoxicillin',
      company: 'Generic',
      dosage: '250mg',
      category: 'Antibiotic',
      price: 45,
      description: 'Antibiotic for bacterial infections'
    },
    {
      id: 'med-3',
      name: 'Metformin',
      company: 'Generic',
      dosage: '500mg',
      category: 'Diabetes',
      price: 35,
      description: 'Used for type 2 diabetes management'
    },
    {
      id: 'med-4',
      name: 'Omeprazole',
      company: 'Generic',
      dosage: '20mg',
      category: 'Gastric',
      price: 30,
      description: 'Used for acid reflux and stomach ulcers'
    },
    {
      id: 'med-5',
      name: 'Atorvastatin',
      company: 'Generic',
      dosage: '10mg',
      category: 'Cholesterol',
      price: 50,
      description: 'Used to lower cholesterol levels'
    },
    {
      id: 'med-6',
      name: 'Aspirin',
      company: 'Bayer',
      dosage: '75mg',
      category: 'Blood Thinner',
      price: 15,
      description: 'Low-dose aspirin for heart protection'
    },
    {
      id: 'med-7',
      name: 'Losartan',
      company: 'Generic',
      dosage: '50mg',
      category: 'Blood Pressure',
      price: 40,
      description: 'Used for high blood pressure'
    },
    {
      id: 'med-8',
      name: 'Vitamin D3',
      company: 'HealthVit',
      dosage: '1000 IU',
      category: 'Vitamin',
      price: 20,
      description: 'Vitamin D supplement'
    }
  ];
};

const getDefaultDoctors = () => {
  return [
    {
      id: 'doctor-demo-456',
      name: 'Dr. Priya Sharma',
      phone: '+91-9876540001',
      specialization: 'General Medicine',
      hospital: 'Primary Health Center',
      experience: '8 years',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
};

const getDefaultPharmacies = () => {
  return [
    {
      id: 'pharmacy-1',
      name: 'HealthCare Pharmacy',
      phone: '+91-9876540101',
      address: 'Main Market, Demo Village',
      licenseNumber: 'DL-PHR-001',
      ownerName: 'Suresh Gupta',
      location: { lat: 28.6139, lng: 77.2090 },
      distance: '0.5 km',
      isOpen: true,
      openTime: '08:00 AM',
      closeTime: '10:00 PM',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pharmacy-2',
      name: 'City Medical Store',
      phone: '+91-9876540102',
      address: 'Hospital Road, Demo Village',
      licenseNumber: 'DL-PHR-002',
      ownerName: 'Meena Sharma',
      location: { lat: 28.6129, lng: 77.2080 },
      distance: '1.2 km',
      isOpen: true,
      openTime: '07:00 AM',
      closeTime: '11:00 PM',
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pharmacy-3',
      name: 'Apollo Pharmacy',
      phone: '+91-9876540103',
      address: 'Civil Lines, Demo Village',
      licenseNumber: 'DL-PHR-003',
      ownerName: 'Rajesh Verma',
      location: { lat: 28.6149, lng: 77.2100 },
      distance: '2.1 km',
      isOpen: false,
      openTime: '09:00 AM',
      closeTime: '09:00 PM',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pharmacy-4',
      name: 'MedPlus Health Services',
      phone: '+91-9876540104',
      address: 'Sector 12, Demo Village',
      licenseNumber: 'DL-PHR-004',
      ownerName: 'Priya Singh',
      location: { lat: 28.6110, lng: 77.2120 },
      distance: '3.0 km',
      isOpen: true,
      openTime: '08:30 AM',
      closeTime: '10:30 PM',
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pharmacy-5',
      name: '1mg Tata Digital',
      phone: '+91-9876540105',
      address: 'Shopping Complex, Demo Village',
      licenseNumber: 'DL-PHR-005',
      ownerName: 'Amit Kumar',
      location: { lat: 28.6160, lng: 77.2070 },
      distance: '2.8 km',
      isOpen: true,
      openTime: '24/7',
      closeTime: '24/7',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
};

// Generate default health records for any user
export const generateDefaultHealthRecords = (userId) => {
  return [
    {
      id: `record-${userId}-1`,
      patientId: userId,
      title: 'Blood Test Results',
      notes: 'Complete blood count and lipid profile. All values within normal range.',
      fileName: 'blood_test_report.pdf',
      uploadedBy: userId,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: `record-${userId}-2`,
      patientId: userId,
      title: 'X-Ray Chest',
      notes: 'Routine chest X-ray. No abnormalities detected. Lungs clear.',
      fileName: 'chest_xray.jpg',
      uploadedBy: userId,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: `record-${userId}-3`,
      patientId: userId,
      title: 'ECG Report',
      notes: 'Electrocardiogram shows normal sinus rhythm. Heart rate: 72 bpm.',
      fileName: 'ecg_report.pdf',
      uploadedBy: userId,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
};

// Generate default prescriptions for any user
export const generateDefaultPrescriptions = (userId) => {
  return [
    {
      id: `prescription-${userId}-1`,
      patientId: userId,
      doctorId: 'doctor-demo-456',
      doctorName: 'Dr. Priya Sharma',
      text: 'Metformin 500mg - Take twice daily after meals for diabetes management. Monitor blood sugar levels weekly.',
      medicines: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' }
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: `prescription-${userId}-2`,
      patientId: userId,
      doctorId: 'doctor-demo-456',
      doctorName: 'Dr. Priya Sharma',
      text: 'Paracetamol 500mg for fever and pain. Take as needed, maximum 3 times per day.',
      medicines: [
        { name: 'Paracetamol', dosage: '500mg', frequency: 'As needed (max 4/day)', duration: '5 days' }
      ],
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
};

// Generate default orders for any user
export const generateDefaultOrders = (userId) => {
  return [
    {
      id: `order-${userId}-1`,
      userId: userId,
      pharmacyId: 'pharmacy-1',
      pharmacyName: 'HealthCare Pharmacy',
      items: [
        { medicineId: 'med-3', medicineName: 'Metformin', quantity: 2, price: 35 },
        { medicineId: 'med-6', medicineName: 'Aspirin', quantity: 1, price: 15 }
      ],
      total: 85,
      status: 'delivered',
      deliveryAddress: 'Demo Village, PIN: 123456',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: `order-${userId}-2`,
      userId: userId,
      pharmacyId: 'pharmacy-2',
      pharmacyName: 'City Medical Store',
      items: [
        { medicineId: 'med-1', medicineName: 'Paracetamol', quantity: 3, price: 25 }
      ],
      total: 75,
      status: 'shipped',
      deliveryAddress: 'Demo Village, PIN: 123456',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      shippedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    }
  ];
};

// Generic storage helpers
export const readStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading storage key ${key}:`, error);
    return defaultValue;
  }
};

export const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing storage key ${key}:`, error);
    return false;
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

// Function to reset storage with fresh dummy data
export const resetWithDummyData = () => {
  try {
    localStorage.removeItem('storageInitialized');
    initializeStorage();
    return true;
  } catch (error) {
    console.error('Error resetting storage with dummy data:', error);
    return false;
  }
};

// User management
export const createUser = (userData) => {
  try {
    const users = readStorage('users', []);
    const newUser = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeStorage('users', users);
    
    // Create default data for the new user
    initializeUserData(newUser.id);
    
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
};

// Initialize default data for a user
export const initializeUserData = (userId) => {
  try {
    // Create patient record
    const patientData = {
      id: userId,
      name: 'User', // Will be updated when user data is available
      age: 'Not specified',
      phone: 'Not specified',
      village: 'Not specified',
      ownerRole: 'user',
      ownerId: userId,
      registeredBy: 'self',
      createdAt: new Date().toISOString()
    };
    createPatient(patientData);

    // Create default health records
    const defaultHealthRecords = generateDefaultHealthRecords(userId);
    defaultHealthRecords.forEach(record => {
      createHealthRecord(record);
    });

    // Create default prescriptions
    const defaultPrescriptions = generateDefaultPrescriptions(userId);
    defaultPrescriptions.forEach(prescription => {
      createPrescription(prescription);
    });

    // Create default orders
    const defaultOrders = generateDefaultOrders(userId);
    defaultOrders.forEach(order => {
      createOrder(order);
    });

    console.log(`Default data initialized for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error initializing user data:', error);
    return false;
  }
};

export const getUserByPhone = (phone) => {
  try {
    const users = readStorage('users', []);
    const user = users.find(user => user.phone === phone);
    
    // If user exists but doesn't have default data, initialize it
    if (user) {
      const healthRecords = getHealthRecordsByPatient(user.id);
      if (healthRecords.length === 0) {
        initializeUserData(user.id);
      }
    }
    
    return user;
  } catch (error) {
    console.error('Error getting user by phone:', error);
    return null;
  }
};

// Doctor management
export const createDoctor = (doctorData) => {
  try {
    const doctors = readStorage('doctors', []);
    const newDoctor = {
      id: uuidv4(),
      ...doctorData,
      createdAt: new Date().toISOString()
    };
    doctors.push(newDoctor);
    writeStorage('doctors', doctors);
    return { success: true, user: newDoctor };
  } catch (error) {
    console.error('Error creating doctor:', error);
    return { success: false, error: 'Failed to create doctor' };
  }
};

export const getDoctorByPhone = (phone) => {
  try {
    const doctors = readStorage('doctors', []);
    return doctors.find(doctor => doctor.phone === phone);
  } catch (error) {
    console.error('Error getting doctor by phone:', error);
    return null;
  }
};

// ASHA management
export const createAsha = (ashaData) => {
  try {
    const ashas = readStorage('ashas', []);
    const newAsha = {
      id: uuidv4(),
      ...ashaData,
      createdAt: new Date().toISOString()
    };
    ashas.push(newAsha);
    writeStorage('ashas', ashas);
    return { success: true, user: newAsha };
  } catch (error) {
    console.error('Error creating ASHA:', error);
    return { success: false, error: 'Failed to create ASHA' };
  }
};

export const getAshaByPhone = (phone) => {
  try {
    const ashas = readStorage('ashas', []);
    return ashas.find(asha => asha.phone === phone);
  } catch (error) {
    console.error('Error getting ASHA by phone:', error);
    return null;
  }
};

// Patient management
export const createPatient = (patientData) => {
  try {
    const patients = readStorage('patients', []);
    const newPatient = {
      id: uuidv4(),
      ...patientData,
      createdAt: new Date().toISOString()
    };
    patients.push(newPatient);
    writeStorage('patients', patients);
    return { success: true, patient: newPatient };
  } catch (error) {
    console.error('Error creating patient:', error);
    return { success: false, error: 'Failed to create patient' };
  }
};

export const getPatients = () => {
  try {
    return readStorage('patients', []);
  } catch (error) {
    console.error('Error getting patients:', error);
    return [];
  }
};

export const getPatientsByOwner = (ownerRole, ownerId) => {
  try {
    const patients = readStorage('patients', []);
    return patients.filter(patient => 
      patient.ownerRole === ownerRole && patient.ownerId === ownerId
    );
  } catch (error) {
    console.error('Error getting patients by owner:', error);
    return [];
  }
};

// Health records management
export const createHealthRecord = (recordData) => {
  try {
    const records = readStorage('healthRecords', []);
    const newRecord = {
      id: uuidv4(),
      ...recordData,
      createdAt: new Date().toISOString()
    };
    records.push(newRecord);
    writeStorage('healthRecords', records);
    return { success: true, record: newRecord };
  } catch (error) {
    console.error('Error creating health record:', error);
    return { success: false, error: 'Failed to create health record' };
  }
};

export const getHealthRecordsByPatient = (patientId) => {
  try {
    const records = readStorage('healthRecords', []);
    const userRecords = records.filter(record => record.patientId === patientId);
    
    // If no records found and this is a valid user, ensure default data exists
    if (userRecords.length === 0 && patientId) {
      const users = readStorage('users', []);
      const userExists = users.find(user => user.id === patientId);
      if (userExists) {
        initializeUserData(patientId);
        // Return the newly created records
        return readStorage('healthRecords', []).filter(record => record.patientId === patientId);
      }
    }
    
    return userRecords;
  } catch (error) {
    console.error('Error getting health records by patient:', error);
    return [];
  }
};

// Messages management
export const createMessage = (messageData) => {
  try {
    const messages = readStorage('messages', []);
    const newMessage = {
      id: uuidv4(),
      ...messageData,
      createdAt: new Date().toISOString()
    };
    messages.push(newMessage);
    writeStorage('messages', messages);
    return newMessage;
  } catch (error) {
    console.error('Error creating message:', error);
    return null;
  }
};

export const getMessagesByRoom = (roomId) => {
  try {
    const messages = readStorage('messages', []);
    return messages.filter(message => message.roomId === roomId);
  } catch (error) {
    console.error('Error getting messages by room:', error);
    return [];
  }
};

// Prescriptions management
export const createPrescription = (prescriptionData) => {
  try {
    const prescriptions = readStorage('prescriptions', []);
    const newPrescription = {
      id: uuidv4(),
      ...prescriptionData,
      createdAt: new Date().toISOString()
    };
    prescriptions.push(newPrescription);
    writeStorage('prescriptions', prescriptions);
    return { success: true, prescription: newPrescription };
  } catch (error) {
    console.error('Error creating prescription:', error);
    return { success: false, error: 'Failed to create prescription' };
  }
};

export const getPrescriptionsByPatient = (patientId) => {
  try {
    const prescriptions = readStorage('prescriptions', []);
    const userPrescriptions = prescriptions.filter(prescription => prescription.patientId === patientId);
    
    // If no prescriptions found and this is a valid user, ensure default data exists
    if (userPrescriptions.length === 0 && patientId) {
      const users = readStorage('users', []);
      const userExists = users.find(user => user.id === patientId);
      if (userExists) {
        initializeUserData(patientId);
        // Return the newly created prescriptions
        return readStorage('prescriptions', []).filter(prescription => prescription.patientId === patientId);
      }
    }
    
    return userPrescriptions;
  } catch (error) {
    console.error('Error getting prescriptions by patient:', error);
    return [];
  }
};

// Visits management
export const createVisit = (visitData) => {
  try {
    const visits = readStorage('visits', []);
    const newVisit = {
      id: uuidv4(),
      roomId: `room-${uuidv4()}`,
      ...visitData,
      createdAt: new Date().toISOString()
    };
    visits.push(newVisit);
    writeStorage('visits', visits);
    return newVisit;
  } catch (error) {
    console.error('Error creating visit:', error);
    return null;
  }
};

export const getWaitingVisits = () => {
  try {
    const visits = readStorage('visits', []);
    return visits.filter(visit => visit.status === 'waiting');
  } catch (error) {
    console.error('Error getting waiting visits:', error);
    return [];
  }
};

export const updateVisit = (visitId, updates) => {
  try {
    const visits = readStorage('visits', []);
    const visitIndex = visits.findIndex(visit => visit.id === visitId);
    
    if (visitIndex !== -1) {
      visits[visitIndex] = { ...visits[visitIndex], ...updates };
      writeStorage('visits', visits);
      return visits[visitIndex];
    }
    
    return null;
  } catch (error) {
    console.error('Error updating visit:', error);
    return null;
  }
};

// Doctor stats management
export const updateDoctorStats = (doctorId, stats) => {
  try {
    const doctorStats = readStorage('doctorStats', {});
    
    if (!doctorStats[doctorId]) {
      doctorStats[doctorId] = {
        attendedCount: 0,
        totalVisits: 0,
        lastUpdated: new Date().toISOString()
      };
    }
    
    doctorStats[doctorId] = {
      ...doctorStats[doctorId],
      ...stats,
      lastUpdated: new Date().toISOString()
    };
    
    writeStorage('doctorStats', doctorStats);
    return doctorStats[doctorId];
  } catch (error) {
    console.error('Error updating doctor stats:', error);
    return null;
  }
};

// Cart management
export const getCart = () => {
  try {
    return readStorage('cart', []);
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

export const addToCart = (medicine) => {
  try {
    const cart = getCart();
    const existingItem = cart.find(item => item.medicineId === medicine.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        medicineId: medicine.id,
        medicine: medicine,
        quantity: 1
      });
    }
    
    writeStorage('cart', cart);
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
};

export const clearCart = () => {
  try {
    writeStorage('cart', []);
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};

// Orders management
export const createOrder = (orderData) => {
  try {
    const orders = readStorage('orders', []);
    const newOrder = {
      id: uuidv4(),
      ...orderData,
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    writeStorage('orders', orders);
    return { success: true, order: newOrder };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Failed to create order' };
  }
};

export const getOrders = () => {
  try {
    return readStorage('orders', []);
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

// Medicines management
export const getMedicines = () => {
  try {
    return readStorage('medicines', []);
  } catch (error) {
    console.error('Error getting medicines:', error);
    return [];
  }
};

// Enhanced messaging functions
export const getMessagesBetweenUsers = (userId1, userId2) => {
  try {
    const messages = readStorage('messages', []);
    return messages.filter(message => 
      (message.senderId === userId1 && message.receiverId === userId2) ||
      (message.senderId === userId2 && message.receiverId === userId1)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } catch (error) {
    console.error('Error getting messages between users:', error);
    return [];
  }
};

export const createMessageBetweenUsers = (senderId, receiverId, text, senderRole) => {
  try {
    const messageData = {
      senderId,
      receiverId,
      text: text.trim(),
      senderRole,
      createdAt: new Date().toISOString()
    };
    return createMessage(messageData);
  } catch (error) {
    console.error('Error creating message between users:', error);
    return null;
  }
};

// Pharmacy management functions
export const createPharmacy = (pharmacyData) => {
  try {
    const pharmacies = readStorage('pharmacies', []);
    const newPharmacy = {
      id: uuidv4(),
      ...pharmacyData,
      createdAt: new Date().toISOString()
    };
    pharmacies.push(newPharmacy);
    writeStorage('pharmacies', pharmacies);
    return { success: true, pharmacy: newPharmacy };
  } catch (error) {
    console.error('Error creating pharmacy:', error);
    return { success: false, error: 'Failed to create pharmacy' };
  }
};

export const getPharmacies = () => {
  try {
    return readStorage('pharmacies', []);
  } catch (error) {
    console.error('Error getting pharmacies:', error);
    return [];
  }
};

export const getPharmacyById = (pharmacyId) => {
  try {
    const pharmacies = readStorage('pharmacies', []);
    return pharmacies.find(pharmacy => pharmacy.id === pharmacyId);
  } catch (error) {
    console.error('Error getting pharmacy by ID:', error);
    return null;
  }
};

export const getPharmacyByPhone = (phone) => {
  try {
    const pharmacies = readStorage('pharmacies', []);
    return pharmacies.find(pharmacy => pharmacy.phone === phone);
  } catch (error) {
    console.error('Error getting pharmacy by phone:', error);
    return null;
  }
};

// Medicine management for pharmacy
export const addMedicineToPharmacy = (pharmacyId, medicineData) => {
  try {
    const medicines = readStorage('pharmacyMedicines', []);
    const newMedicine = {
      medId: uuidv4(),
      pharmacyId,
      ...medicineData,
      createdAt: new Date().toISOString()
    };
    medicines.push(newMedicine);
    writeStorage('pharmacyMedicines', medicines);
    return { success: true, medicine: newMedicine };
  } catch (error) {
    console.error('Error adding medicine to pharmacy:', error);
    return { success: false, error: 'Failed to add medicine' };
  }
};

export const getMedicinesByPharmacy = (pharmacyId) => {
  try {
    const medicines = readStorage('pharmacyMedicines', []);
    return medicines.filter(medicine => medicine.pharmacyId === pharmacyId);
  } catch (error) {
    console.error('Error getting medicines by pharmacy:', error);
    return [];
  }
};

export const updatePharmacyMedicine = (medId, updates) => {
  try {
    const medicines = readStorage('pharmacyMedicines', []);
    const medicineIndex = medicines.findIndex(medicine => medicine.medId === medId);
    
    if (medicineIndex !== -1) {
      medicines[medicineIndex] = { ...medicines[medicineIndex], ...updates };
      writeStorage('pharmacyMedicines', medicines);
      return { success: true, medicine: medicines[medicineIndex] };
    }
    
    return { success: false, error: 'Medicine not found' };
  } catch (error) {
    console.error('Error updating pharmacy medicine:', error);
    return { success: false, error: 'Failed to update medicine' };
  }
};

export const deletePharmacyMedicine = (medId) => {
  try {
    const medicines = readStorage('pharmacyMedicines', []);
    const updatedMedicines = medicines.filter(medicine => medicine.medId !== medId);
    writeStorage('pharmacyMedicines', updatedMedicines);
    return { success: true };
  } catch (error) {
    console.error('Error deleting pharmacy medicine:', error);
    return { success: false, error: 'Failed to delete medicine' };
  }
};

// Billing system
export const createBill = (billData) => {
  try {
    const bills = readStorage('bills', []);
    const newBill = {
      billId: uuidv4(),
      ...billData,
      createdAt: new Date().toISOString()
    };
    bills.push(newBill);
    writeStorage('bills', bills);
    return { success: true, bill: newBill };
  } catch (error) {
    console.error('Error creating bill:', error);
    return { success: false, error: 'Failed to create bill' };
  }
};

export const getBillsByPharmacy = (pharmacyId) => {
  try {
    const bills = readStorage('bills', []);
    return bills.filter(bill => bill.pharmacyId === pharmacyId);
  } catch (error) {
    console.error('Error getting bills by pharmacy:', error);
    return [];
  }
};

// Prescription privacy functions
export const createPrescriptionForPharmacy = (prescriptionData, patientId) => {
  try {
    const prescriptions = readStorage('pharmacyPrescriptions', []);
    const newPrescription = {
      id: uuidv4(),
      patientId, // Only store patient ID, not full patient info
      ...prescriptionData,
      createdAt: new Date().toISOString()
    };
    prescriptions.push(newPrescription);
    writeStorage('pharmacyPrescriptions', prescriptions);
    return { success: true, prescription: newPrescription };
  } catch (error) {
    console.error('Error creating prescription for pharmacy:', error);
    return { success: false, error: 'Failed to create prescription' };
  }
};

export const getPrescriptionsForPharmacy = (pharmacyId) => {
  try {
    const prescriptions = readStorage('pharmacyPrescriptions', []);
    return prescriptions.filter(prescription => prescription.pharmacyId === pharmacyId);
  } catch (error) {
    console.error('Error getting prescriptions for pharmacy:', error);
    return [];
  }
};

// Migration function for existing data
export const migrateLegacyStorage = () => {
  try {
    // This function can be used to migrate existing data
    // when the storage schema changes
    console.log('Legacy storage migration completed');
    return true;
  } catch (error) {
    console.error('Error migrating legacy storage:', error);
    return false;
  }
};