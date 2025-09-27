// src/components/WaitingRoom.jsx
import { useState, useEffect } from 'react';
import { getWaitingVisits } from '../services/storageService';
import { translate } from '../services/translationService';

export default function WaitingRoom({ onAttendPatient }) {
  const [waitingVisits, setWaitingVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWaitingVisits();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadWaitingVisits, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadWaitingVisits = () => {
    try {
      const visits = getWaitingVisits();
      setWaitingVisits(visits);
    } catch (error) {
      console.error('Error loading waiting visits:', error);
      setError('Failed to load waiting visits');
    }
  };

  const handleAttendPatient = (visit) => {
    if (onAttendPatient) {
      onAttendPatient(visit);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return translate('Unknown');
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return translate('Just now');
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${translate('min ago')}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${translate('hr ago')}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return translate('High');
      case 'medium':
        return translate('Medium');
      case 'low':
        return translate('Low');
      default:
        return translate('Normal');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {translate('Waiting Room')}
        </h3>
        
        <button
          onClick={loadWaitingVisits}
          className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors"
        >
          {translate('Refresh')}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Waiting Visits */}
      <div className="space-y-4">
        {waitingVisits.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {translate('No patients waiting')}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {translate('Patients will appear here when they request consultations')}
            </p>
          </div>
        ) : (
          waitingVisits.map((visit) => (
            <div
              key={visit.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {visit.patientName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {translate('Visit ID')}: {visit.id.slice(-8)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{translate('Type')}:</span>
                      <span className="ml-2 text-gray-900 capitalize">
                        {visit.type || translate('Consultation')}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-gray-600">{translate('Priority')}:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(visit.priority)}`}>
                        {getPriorityText(visit.priority)}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-gray-600">{translate('Requested')}:</span>
                      <span className="ml-2 text-gray-900">
                        {formatTime(visit.createdAt)}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-gray-600">{translate('Status')}:</span>
                      <span className="ml-2 text-gray-900 capitalize">
                        {visit.status}
                      </span>
                    </div>
                  </div>

                  {visit.symptoms && visit.symptoms.length > 0 && (
                    <div className="mt-3">
                      <span className="text-gray-600 text-sm">{translate('Symptoms')}:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {visit.symptoms.map((symptom, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {visit.notes && (
                    <div className="mt-3">
                      <span className="text-gray-600 text-sm">{translate('Notes')}:</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {visit.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => handleAttendPatient(visit)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    {translate('Attend')}
                  </button>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {translate('Room')}: {visit.roomId?.slice(-8) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {waitingVisits.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {translate('Total waiting')}: {waitingVisits.length}
            </span>
            
            <div className="flex space-x-4">
              <span className="text-gray-600">
                {translate('High priority')}: {waitingVisits.filter(v => v.priority === 'high').length}
              </span>
              <span className="text-gray-600">
                {translate('Normal priority')}: {waitingVisits.filter(v => v.priority === 'normal').length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
