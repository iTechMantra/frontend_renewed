// src/components/MedicineTracking.jsx
import { useState, useEffect } from 'react';
import { medicineTrackingService } from '../services/medicineTrackingService';
import { translate } from '../services/translationService';

export default function MedicineTracking({ patientId, patientName }) {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDeliveries();
  }, [patientId]);

  const loadDeliveries = () => {
    try {
      const patientDeliveries = medicineTrackingService.getPatientDeliveries(patientId);
      setDeliveries(patientDeliveries);
    } catch (error) {
      console.error('Error loading deliveries:', error);
      setError('Failed to load delivery information');
    }
  };

  const handleStartDelivery = (medicine) => {
    setLoading(true);
    setError('');

    try {
      // Create a sample delivery route
      const startLocation = { name: 'Central Pharmacy', x: 5, y: 5 };
      const endLocation = { name: 'Patient Location', x: 15, y: 15 };
      const obstacles = [
        { x: 8, y: 8 },
        { x: 9, y: 9 },
        { x: 10, y: 10 }
      ];

      const route = medicineTrackingService.createDeliveryRoute(
        startLocation,
        endLocation,
        obstacles
      );

      if (route) {
        const deliveryData = {
          medicineId: medicine.id,
          medicineName: medicine.name,
          patientId,
          patientName,
          fromLocation: startLocation,
          toLocation: endLocation,
          route,
          estimatedArrival: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
        };

        const delivery = medicineTrackingService.startDelivery(deliveryData);
        setDeliveries(prev => [...prev, delivery]);
        setSelectedDelivery(delivery);
      } else {
        setError('Failed to create delivery route');
      }
    } catch (error) {
      console.error('Error starting delivery:', error);
      setError('Failed to start delivery');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateProgress = (deliveryId) => {
    try {
      const updatedDelivery = medicineTrackingService.simulateDeliveryProgress(deliveryId);
      if (updatedDelivery) {
        setDeliveries(prev => 
          prev.map(d => d.id === deliveryId ? updatedDelivery : d)
        );
        
        if (selectedDelivery?.id === deliveryId) {
          setSelectedDelivery(updatedDelivery);
        }
      }
    } catch (error) {
      console.error('Error simulating progress:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return translate('Pending');
      case 'in_transit':
        return translate('In Transit');
      case 'delivered':
        return translate('Delivered');
      default:
        return translate('Unknown');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return translate('Unknown');
    return new Date(timestamp).toLocaleString();
  };

  const getProgressPercentage = (delivery) => {
    if (!delivery.route || !delivery.route.path) return 0;
    const totalSteps = delivery.route.path.length;
    const currentStep = delivery.currentStep || 0;
    return Math.min((currentStep / totalSteps) * 100, 100);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {translate('Medicine Tracking')} - {patientName}
      </h3>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Deliveries List */}
      <div className="space-y-4 mb-6">
        {deliveries.length === 0 ? (
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {translate('No deliveries found')}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {translate('Deliveries will appear here when medicines are ordered')}
            </p>
          </div>
        ) : (
          deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {delivery.medicineName}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}
                    >
                      {getStatusText(delivery.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{translate('From')}:</span>
                      <span className="ml-2 text-gray-900">{delivery.fromLocation.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{translate('To')}:</span>
                      <span className="ml-2 text-gray-900">{delivery.toLocation.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{translate('Started')}:</span>
                      <span className="ml-2 text-gray-900">{formatTime(delivery.startedAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{translate('ETA')}:</span>
                      <span className="ml-2 text-gray-900">{formatTime(delivery.estimatedArrival)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {delivery.status === 'in_transit' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{translate('Progress')}</span>
                        <span>{Math.round(getProgressPercentage(delivery))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(delivery)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => setSelectedDelivery(delivery)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors"
                  >
                    {translate('View Details')}
                  </button>
                  
                  {delivery.status === 'in_transit' && (
                    <button
                      onClick={() => handleSimulateProgress(delivery.id)}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors"
                    >
                      {translate('Simulate Progress')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delivery Details Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {translate('Delivery Details')}
                </h3>
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{translate('Medicine')}</h4>
                  <p className="text-gray-700">{selectedDelivery.medicineName}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{translate('Route Information')}</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p><strong>{translate('From')}:</strong> {selectedDelivery.fromLocation.name}</p>
                    <p><strong>{translate('To')}:</strong> {selectedDelivery.toLocation.name}</p>
                    <p><strong>{translate('Distance')}:</strong> {selectedDelivery.route?.distance || 0} {translate('steps')}</p>
                    <p><strong>{translate('Estimated Time')}:</strong> {selectedDelivery.route?.estimatedTime || 0} {translate('minutes')}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{translate('Current Status')}</h4>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedDelivery.status)}`}
                    >
                      {getStatusText(selectedDelivery.status)}
                    </span>
                    {selectedDelivery.status === 'in_transit' && (
                      <span className="text-sm text-gray-600">
                        {Math.round(getProgressPercentage(selectedDelivery))}% {translate('complete')}
                      </span>
                    )}
                  </div>
                </div>

                {selectedDelivery.status === 'in_transit' && selectedDelivery.route?.path && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{translate('Delivery Path')}</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-5 gap-1 text-xs">
                        {selectedDelivery.route.path.map((step, index) => (
                          <div
                            key={index}
                            className={`p-1 rounded text-center ${
                              index <= (selectedDelivery.currentStep || 0)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {index + 1}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {translate('Current step')}: {selectedDelivery.currentStep || 0} / {selectedDelivery.route.path.length}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{translate('Timeline')}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{translate('Started')}:</span>
                      <span>{formatTime(selectedDelivery.startedAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{translate('Estimated Arrival')}:</span>
                      <span>{formatTime(selectedDelivery.estimatedArrival)}</span>
                    </div>
                    {selectedDelivery.deliveredAt && (
                      <div className="flex justify-between text-sm">
                        <span>{translate('Delivered')}:</span>
                        <span>{formatTime(selectedDelivery.deliveredAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
