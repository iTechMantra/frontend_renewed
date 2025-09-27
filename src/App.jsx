// src/App.jsx
import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeStorage } from './services/storageService';
import { initializeTranslations } from './services/translationService';
import TopNav from './components/TopNav';
import RequireAuth from './components/RequireAuth';

// Lazy load components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const UserLogin = lazy(() => import('./pages/UserLogin'));
const UserSignup = lazy(() => import('./pages/UserSignup'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const DoctorLogin = lazy(() => import('./pages/DoctorLogin'));
const DoctorSignup = lazy(() => import('./pages/DoctorSignup'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const AshaLogin = lazy(() => import('./pages/AshaLogin'));
const AshaSignup = lazy(() => import('./pages/AshaSignup'));
const AshaDashboard = lazy(() => import('./pages/AshaDashboard'));
const Pharmacy = lazy(() => import('./pages/Pharmacy'));
const PharmacyLogin = lazy(() => import('./pages/PharmacyLogin'));
const PharmacyDashboard = lazy(() => import('./pages/PharmacyDashboard'));

// Loading spinner
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please refresh the page and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Main App
function App() {
  useEffect(() => {
    initializeStorage();
    initializeTranslations();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <TopNav />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />

              {/* Pharmacy */}
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/pharmacy/login" element={<PharmacyLogin />} />
              <Route
                path="/pharmacy/dashboard"
                element={
                  <RequireAuth requiredRole="pharmacy">
                    <PharmacyDashboard />
                  </RequireAuth>
                }
              />

              {/* User */}
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/signup" element={<UserSignup />} />
              <Route
                path="/user/dashboard"
                element={
                  <RequireAuth requiredRole="user">
                    <UserDashboard />
                  </RequireAuth>
                }
              />

              {/* Doctor */}
              <Route path="/doctor/login" element={<DoctorLogin />} />
              <Route path="/doctor/signup" element={<DoctorSignup />} />
              <Route
                path="/doctor/dashboard"
                element={
                  <RequireAuth requiredRole="doctor">
                    <DoctorDashboard />
                  </RequireAuth>
                }
              />

              {/* ASHA */}
              <Route path="/asha/login" element={<AshaLogin />} />
              <Route path="/asha/signup" element={<AshaSignup />} />
              <Route
                path="/asha/dashboard"
                element={
                  <RequireAuth requiredRole="asha">
                    <AshaDashboard />
                  </RequireAuth>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-xl text-gray-600 mb-8">Page not found</p>
                      <button
                        onClick={() => (window.location.href = '/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Go Home
                      </button>
                    </div>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
