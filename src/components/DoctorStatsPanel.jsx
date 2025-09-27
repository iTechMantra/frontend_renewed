// src/components/DoctorStatsPanel.jsx
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { translate } from '../services/translationService';

export default function DoctorStatsPanel() {
  const [doctor, setDoctor] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayPatients: 0,
    monthlyPatients: 0,
    totalVisits: 0,
    completedVisits: 0,
    pendingVisits: 0,
    averageRating: 0,
    totalHours: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setDoctor(currentUser);
      loadDoctorStats(currentUser.id);
    }
    setLoading(false);
  }, []);

  const loadDoctorStats = (doctorId) => {
    try {
      // Load visits data
      const visits = JSON.parse(localStorage.getItem('visits') || '[]');
      const doctorVisits = visits.filter(visit => visit.doctorId === doctorId);
      
      // Load patients data
      const patients = JSON.parse(localStorage.getItem('patients') || '[]');
      const doctorPatients = patients.filter(patient => 
        patient.assignedDoctorId === doctorId || 
        doctorVisits.some(visit => visit.patientId === patient.id)
      );
      
      // Calculate today's date
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      
      // Calculate statistics
      const todayVisits = doctorVisits.filter(visit => 
        new Date(visit.createdAt) >= todayStart
      );
      
      const monthlyVisits = doctorVisits.filter(visit => 
        new Date(visit.createdAt) >= monthStart
      );
      
      const completedVisits = doctorVisits.filter(visit => 
        visit.status === 'completed'
      );
      
      const pendingVisits = doctorVisits.filter(visit => 
        visit.status === 'waiting' || visit.status === 'in_progress'
      );
      
      // Calculate average rating (mock data)
      const averageRating = 4.5 + Math.random() * 0.5;
      
      // Calculate total hours (mock data)
      const totalHours = completedVisits.length * 0.5; // 30 minutes per visit
      
      setStats({
        totalPatients: doctorPatients.length,
        todayPatients: todayVisits.length,
        monthlyPatients: monthlyVisits.length,
        totalVisits: doctorVisits.length,
        completedVisits: completedVisits.length,
        pendingVisits: pendingVisits.length,
        averageRating: averageRating,
        totalHours: totalHours
      });
    } catch (error) {
      console.error('Error loading doctor stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {translate('Doctor Statistics')}
      </h3>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{translate('Total Patients')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{translate('Completed Visits')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedVisits}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{translate('Pending Visits')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingVisits}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{translate('Average Rating')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Performance */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-800 mb-3">
            {translate('Today\'s Performance')}
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{translate('Patients seen')}:</span>
              <span className="font-medium">{stats.todayPatients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{translate('Hours worked')}:</span>
              <span className="font-medium">{stats.totalHours.toFixed(1)}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{translate('Efficiency')}:</span>
              <span className="font-medium">
                {stats.todayPatients > 0 ? Math.round((stats.completedVisits / stats.totalVisits) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-800 mb-3">
            {translate('Monthly Overview')}
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{translate('Total visits')}:</span>
              <span className="font-medium">{stats.monthlyPatients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{translate('Completion rate')}:</span>
              <span className="font-medium">
                {stats.totalVisits > 0 ? Math.round((stats.completedVisits / stats.totalVisits) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{translate('Average per day')}:</span>
              <span className="font-medium">
                {Math.round(stats.monthlyPatients / 30)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          {translate('Performance Trend')}
        </h4>
        <div className="h-32 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
          <p className="text-gray-500 text-sm">
            {translate('Performance chart would be displayed here')}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex space-x-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          {translate('View Detailed Report')}
        </button>
        <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
          {translate('Export Data')}
        </button>
      </div>
    </div>
  );
}
