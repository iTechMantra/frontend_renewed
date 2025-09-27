// src/components/CampaignPanel.jsx
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { getPatientsByOwner } from '../services/storageService';
import { translate } from '../services/translationService';

export default function CampaignPanel() {
  const [asha, setAsha] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setAsha(currentUser);
      loadCampaignData(currentUser.id);
    }
    setLoading(false);
  }, []);

  const loadCampaignData = (ashaId) => {
    try {
      const ashaPatients = getPatientsByOwner('asha', ashaId);
      setPatients(ashaPatients);
    } catch (error) {
      console.error('Error loading campaign data:', error);
      setError('Failed to load campaign data');
    }
  };

  const getCampaignStats = () => {
    const totalPatients = patients.length;
    const thisMonth = new Date();
    thisMonth.setDate(1); // First day of current month
    
    const monthlyPatients = patients.filter(patient => 
      new Date(patient.createdAt) >= thisMonth
    ).length;
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const weeklyPatients = patients.filter(patient => 
      new Date(patient.createdAt) >= thisWeek
    ).length;
    
    // Calculate points (1 point per patient)
    const totalPoints = totalPatients;
    const monthlyPoints = monthlyPatients;
    const weeklyPoints = weeklyPatients;
    
    // Calculate rank based on total patients
    const allAshas = JSON.parse(localStorage.getItem('ashas') || '[]');
    const ashaRanks = allAshas.map(asha => {
      const ashaPatients = getPatientsByOwner('asha', asha.id);
      return {
        id: asha.id,
        name: asha.name,
        patientCount: ashaPatients.length
      };
    }).sort((a, b) => b.patientCount - a.patientCount);
    
    const currentRank = ashaRanks.findIndex(rank => rank.id === asha?.id) + 1;
    
    return {
      totalPatients,
      monthlyPatients,
      weeklyPatients,
      totalPoints,
      monthlyPoints,
      weeklyPoints,
      currentRank,
      totalAshas: allAshas.length
    };
  };

  const getAchievementLevel = (points) => {
    if (points >= 100) return { level: 'Gold', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (points >= 50) return { level: 'Silver', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    if (points >= 25) return { level: 'Bronze', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Starter', color: 'text-blue-600', bgColor: 'bg-blue-100' };
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

  if (!asha) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">{translate('Please log in to view campaign data')}</p>
      </div>
    );
  }

  const stats = getCampaignStats();
  const achievement = getAchievementLevel(stats.totalPoints);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {translate('Campaign Progress')}
      </h3>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Achievement Level */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800">
              {translate('Achievement Level')}
            </h4>
            <p className="text-sm text-gray-600">
              {translate('Current level based on your performance')}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full ${achievement.bgColor}`}>
            <span className={`font-bold ${achievement.color}`}>
              {achievement.level}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{translate('This Month')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.monthlyPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{translate('Total Points')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{translate('Rank')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                #{stats.currentRank} {translate('of')} {stats.totalAshas}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          {translate('Recent Patients')}
        </h4>
        
        {patients.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {translate('No patients registered yet')}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {translate('Start by adding your first patient to begin your campaign')}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {patients.slice(0, 10).map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                    <p className="text-xs text-gray-600">
                      {patient.age} {translate('years')} • {patient.village}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campaign Goals */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          {translate('Campaign Goals')}
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translate('Next Level')}: {translate('Silver')} (50 {translate('patients')})</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${Math.min((stats.totalPatients / 50) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translate('Monthly Target')}: 20 {translate('patients')}</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${Math.min((stats.monthlyPatients / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
          {translate('View Full Report')}
        </button>
        <button className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
          {translate('Share Progress')}
        </button>
      </div>
    </div>
  );
}
