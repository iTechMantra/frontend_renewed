// src/services/authService.js
import { createUser, getUserByPhone } from './storageService';
import { createDoctor, getDoctorByPhone } from './storageService';
import { createAsha, getAshaByPhone } from './storageService';

// Session management
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
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(user => user.id === id);
      case 'doctor':
        const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
        return doctors.find(doctor => doctor.id === id);
      case 'asha':
        const ashas = JSON.parse(localStorage.getItem('ashas') || '[]');
        return ashas.find(asha => asha.id === id);
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

// User authentication
export const loginUser = (phone, password) => {
  try {
    const user = getUserByPhone(phone);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    if (user.password !== password) {
      return { success: false, error: 'Invalid password' };
    }
    
    // Set session
    const session = {
      current: {
        role: 'user',
        id: user.id,
        name: user.name,
        loggedAt: new Date().toISOString()
      }
    };
    setCurrentSession(session);
    
    return { success: true, user };
  } catch (error) {
    console.error('Error logging in user:', error);
    return { success: false, error: 'Login failed' };
  }
};

export const registerUser = (userData) => {
  try {
    // Check if user already exists
    const existingUser = getUserByPhone(userData.phone);
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }
    
    const result = createUser(userData);
    return result;
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Registration failed' };
  }
};

// Doctor authentication
export const loginDoctor = (phone, password) => {
  try {
    const doctor = getDoctorByPhone(phone);
    
    if (!doctor) {
      return { success: false, error: 'Doctor not found' };
    }
    
    if (doctor.password !== password) {
      return { success: false, error: 'Invalid password' };
    }
    
    // Set session
    const session = {
      current: {
        role: 'doctor',
        id: doctor.id,
        name: doctor.name,
        loggedAt: new Date().toISOString()
      }
    };
    setCurrentSession(session);
    
    return { success: true, user: doctor };
  } catch (error) {
    console.error('Error logging in doctor:', error);
    return { success: false, error: 'Login failed' };
  }
};

export const registerDoctor = (doctorData) => {
  try {
    // Check if doctor already exists
    const existingDoctor = getDoctorByPhone(doctorData.phone);
    if (existingDoctor) {
      return { success: false, error: 'Doctor already exists' };
    }
    
    const result = createDoctor(doctorData);
    return result;
  } catch (error) {
    console.error('Error registering doctor:', error);
    return { success: false, error: 'Registration failed' };
  }
};

// ASHA authentication
export const loginAsha = (phone, password) => {
  try {
    const asha = getAshaByPhone(phone);
    
    if (!asha) {
      return { success: false, error: 'ASHA worker not found' };
    }
    
    if (asha.password !== password) {
      return { success: false, error: 'Invalid password' };
    }
    
    // Set session
    const session = {
      current: {
        role: 'asha',
        id: asha.id,
        name: asha.name,
        loggedAt: new Date().toISOString()
      }
    };
    setCurrentSession(session);
    
    return { success: true, user: asha };
  } catch (error) {
    console.error('Error logging in ASHA:', error);
    return { success: false, error: 'Login failed' };
  }
};

export const registerAsha = (ashaData) => {
  try {
    // Check if ASHA already exists
    const existingAsha = getAshaByPhone(ashaData.phone);
    if (existingAsha) {
      return { success: false, error: 'ASHA worker already exists' };
    }
    
    const result = createAsha(ashaData);
    return result;
  } catch (error) {
    console.error('Error registering ASHA:', error);
    return { success: false, error: 'Registration failed' };
  }
};

// Logout
export const logout = () => {
  try {
    const session = { current: null };
    setCurrentSession(session);
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};
