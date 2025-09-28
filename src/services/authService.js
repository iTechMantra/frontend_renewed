// src/services/authService.js
import { 
  createUser, getUserByPhone,
  createDoctor, getDoctorByPhone,
  createAsha, getAshaByPhone,
  createPharmacy, getPharmacyByPhone
} from './storageService';

// --------------------- SESSION MANAGEMENT ---------------------
export const setCurrentSession = (session) => {
  try {
    localStorage.setItem('session', JSON.stringify(session));
    return true;
  } catch (error) {
    console.error('Error setting session:', error);
    return false;
  }
};

export const getCurrentSession = () => {
  try {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : { current: null };
  } catch (error) {
    console.error('Error getting session:', error);
    return { current: null };
  }
};

export const getCurrentUser = () => {
  try {
    const session = getCurrentSession();
    if (!session.current) return null;
    const { role, id } = session.current;

    switch (role) {
      case 'user':
        return (JSON.parse(localStorage.getItem('users') || '[]')).find(u => u.id === id);
      case 'doctor':
        return (JSON.parse(localStorage.getItem('doctors') || '[]')).find(d => d.id === id);
      case 'asha':
        return (JSON.parse(localStorage.getItem('ashas') || '[]')).find(a => a.id === id);
      case 'pharmacy':
        return (JSON.parse(localStorage.getItem('pharmacies') || '[]')).find(p => p.id === id);
      default:
        return null;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getCurrentRole = () => {
  try {
    const session = getCurrentSession();
    return session.current ? session.current.role : null;
  } catch (error) {
    console.error('Error getting current role:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  try {
    const session = getCurrentSession();
    return !!session.current;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// --------------------- USER ---------------------
export const loginUser = (phone, password) => {
  try {
    const user = getUserByPhone(phone);
    if (!user) return { success: false, error: 'User not found' };
    if (user.password !== password) return { success: false, error: 'Invalid password' };

    setCurrentSession({ current: { role: 'user', id: user.id, name: user.name, loggedAt: new Date().toISOString() } });
    return { success: true, user };
  } catch (error) {
    console.error('Error logging in user:', error);
    return { success: false, error: 'Login failed' };
  }
};

export const registerUser = (userData) => {
  try {
    if (getUserByPhone(userData.phone)) return { success: false, error: 'User already exists' };
    return createUser(userData);
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Registration failed' };
  }
};

// --------------------- DOCTOR ---------------------
export const loginDoctor = (phone, password) => {
  try {
    const doctor = getDoctorByPhone(phone);
    if (!doctor) return { success: false, error: 'Doctor not found' };
    if (doctor.password !== password) return { success: false, error: 'Invalid password' };

    setCurrentSession({ current: { role: 'doctor', id: doctor.id, name: doctor.name, loggedAt: new Date().toISOString() } });
    return { success: true, user: doctor };
  } catch (error) {
    console.error('Error logging in doctor:', error);
    return { success: false, error: 'Login failed' };
  }
};

export const registerDoctor = (doctorData) => {
  try {
    if (getDoctorByPhone(doctorData.phone)) return { success: false, error: 'Doctor already exists' };
    return createDoctor(doctorData);
  } catch (error) {
    console.error('Error registering doctor:', error);
    return { success: false, error: 'Registration failed' };
  }
};

// --------------------- ASHA ---------------------
export const loginAsha = (phone, password) => {
  try {
    const asha = getAshaByPhone(phone);
    if (!asha) return { success: false, error: 'ASHA worker not found' };
    if (asha.password !== password) return { success: false, error: 'Invalid password' };

    setCurrentSession({ current: { role: 'asha', id: asha.id, name: asha.name, loggedAt: new Date().toISOString() } });
    return { success: true, user: asha };
  } catch (error) {
    console.error('Error logging in ASHA:', error);
    return { success: false, error: 'Login failed' };
  }
};

export const registerAsha = (ashaData) => {
  try {
    if (getAshaByPhone(ashaData.phone)) return { success: false, error: 'ASHA worker already exists' };
    return createAsha(ashaData);
  } catch (error) {
    console.error('Error registering ASHA:', error);
    return { success: false, error: 'Registration failed' };
  }
};

// --------------------- PHARMACY ---------------------
export const loginPharmacy = (phone) => {
  try {
    const pharmacy = getPharmacyByPhone(phone);
    if (!pharmacy) return { success: false, error: 'Pharmacy not found' };

    setCurrentSession({ current: { role: 'pharmacy', id: pharmacy.id, name: pharmacy.name, loggedAt: new Date().toISOString() } });
    return { success: true, user: pharmacy };
  } catch (error) {
    console.error('Error logging in pharmacy:', error);
    return { success: false, error: 'Login failed' };
  }
};

export const registerPharmacy = (pharmacyData) => {
  try {
    if (getPharmacyByPhone(pharmacyData.phone)) return { success: false, error: 'Pharmacy already exists' };
    return createPharmacy(pharmacyData);
  } catch (error) {
    console.error('Error registering pharmacy:', error);
    return { success: false, error: 'Registration failed' };
  }
};

// --------------------- LOGOUT ---------------------
export const logout = () => {
  try {
    setCurrentSession({ current: null });
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};