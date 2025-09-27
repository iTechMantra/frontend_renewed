// src/components/NearestPharmacy.jsx
import { useState, useEffect } from 'react';
import { getPharmacies } from '../services/storageService';
import { translate } from '../services/translationService';

export default function NearestPharmacy({ userLocation, onPharmacySelect }) {
  const [pharmacies, setPharmacies] = useState([]);
  const [nearestPharmacies, setNearestPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPharmacies();
  }, []);

  const loadPharmacies = () => {
    try {
      const allPharmacies = getPharmacies();
      setPharmacies(allPharmacies);
      
      // If user location is provided, calculate distances
      if (userLocation) {
        calculateNearestPharmacies(allPharmacies, userLocation);
      } else {
        setNearestPharmacies(allPharmacies);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
      setLoading(false);
    }
  };

  const calculateNearestPharmacies = (pharmacies, userLocation) => {
    // Mock location calculation - in real app, you'd use proper geolocation API
    const pharmaciesWithDistance = pharmacies.map(pharmacy => {
      // Mock distance calculation (in real app, use Haversine formula or Google Maps API)
      const distance = Math.random() * 10 + 0.5; // Random distance between 0.5-10.5 km
      return {
        ...pharmacy,
        distance: Math.round(distance * 10) / 10
      };
    });

    // Sort by distance
    const sorted = pharmaciesWithDistance.sort((a, b) => a.distance - b.distance);
    setNearestPharmacies(sorted.slice(0, 5)); // Show top 5 nearest
  };

  const handlePharmacySelect = (pharmacy) => {
    if (onPharmacySelect) {
      onPharmacySelect(pharmacy);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {translate('Finding Nearest Pharmacies')}...
        </h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {userLocation ? translate('Nearest Pharmacies') : translate('Available Pharmacies')}
      </h3>
      
      {nearestPharmacies.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">
            {translate('No pharmacies found')}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {translate('Try refreshing or check back later')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {nearestPharmacies.map((pharmacy) => (
            <div
              key={pharmacy.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handlePharmacySelect(pharmacy)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{pharmacy.name}</h4>
                      <p className="text-sm text-gray-600">{pharmacy.address || translate('Address not available')}</p>
                      {pharmacy.phone && (
                        <p className="text-sm text-gray-500">{translate('Phone')}: {pharmacy.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {pharmacy.distance && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {pharmacy.distance} km
                      </span>
                    )}
                    {pharmacy.license && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {translate('Licensed')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePharmacySelect(pharmacy);
                    }}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    {translate('Select')}
                  </button>
                  
                  {pharmacy.phone && (
                    <a
                      href={`tel:${pharmacy.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors text-center"
                    >
                      {translate('Call')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!userLocation && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>{translate('Tip')}:</strong> {translate('Enable location services to see the nearest pharmacies to you')}
          </p>
        </div>
      )}
    </div>
  );
}
