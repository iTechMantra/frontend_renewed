// src/components/MedicineSearch.jsx
import { useState, useEffect } from 'react';
import { getMedicines } from '../services/storageService';
import { translate } from '../services/translationService';

export default function MedicineSearch({ onSelect, showAddToCart = false, onAddToCart }) {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = () => {
    try {
      const allMedicines = getMedicines();
      setMedicines(allMedicines);
    } catch (error) {
      console.error('Error loading medicines:', error);
      setError('Failed to load medicines');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleMedicineSelect = (medicine) => {
    if (onSelect) {
      onSelect(medicine);
    }
  };

  const handleAddToCart = (medicine) => {
    if (onAddToCart) {
      onAddToCart(medicine);
    }
  };

  // Filter medicines based on search term and category
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || medicine.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(medicines.map(medicine => medicine.category))];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {translate('Medicine Search')}
      </h3>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Search Medicines')}
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={translate('Enter medicine name, company, or description')}
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('Category')}
          </label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{translate('All Categories')}</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredMedicines.length === 0 ? (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {translate('No medicines found')}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {translate('Try adjusting your search terms or category filter')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {medicine.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {medicine.company}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {medicine.category}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {medicine.dosage}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{medicine.price}
                    </p>
                  </div>
                </div>

                {medicine.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {medicine.description}
                  </p>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMedicineSelect(medicine)}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors"
                  >
                    {translate('View Details')}
                  </button>
                  
                  {showAddToCart && (
                    <button
                      onClick={() => handleAddToCart(medicine)}
                      className="flex-1 px-3 py-2 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors"
                    >
                      {translate('Add to Cart')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {filteredMedicines.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          {translate('Showing')} {filteredMedicines.length} {translate('of')} {medicines.length} {translate('medicines')}
        </div>
      )}
    </div>
  );
}
