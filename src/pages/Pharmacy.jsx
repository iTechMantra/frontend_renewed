// src/pages/Pharmacy.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMedicines, getCart, addToCart, clearCart, createOrder } from '../services/storageService';
import { translate } from '../services/translationService';
import PharmacySearch from '../components/PharmacySearch';

export default function Pharmacy() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [section, setSection] = useState('search'); // 'search', 'cart', 'orders'
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const allMedicines = getMedicines();
      setMedicines(allMedicines);
      
      const cartData = getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading pharmacy data:', error);
    }
  };

  const handleAddToCart = (medicine) => {
    try {
      addToCart(medicine);
      loadData(); // Refresh cart
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleRemoveFromCart = (medicineId) => {
    try {
      const updatedCart = cart.filter(item => item.medicineId !== medicineId);
      setCart(updatedCart);
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleUpdateQuantity = (medicineId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(medicineId);
      return;
    }

    try {
      const updatedCart = cart.map(item => 
        item.medicineId === medicineId 
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!orderForm.name.trim()) {
      alert('Name is required');
      return;
    }

    if (!orderForm.phone.trim()) {
      alert('Phone number is required');
      return;
    }

    if (!orderForm.address.trim()) {
      alert('Address is required');
      return;
    }

    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        name: orderForm.name.trim(),
        phone: orderForm.phone.trim(),
        address: orderForm.address.trim(),
        notes: orderForm.notes.trim(),
        items: cart.map(item => ({
          medicineId: item.medicineId,
          medicineName: item.medicine.name,
          quantity: item.quantity,
          price: item.medicine.price || 0
        })),
        total: cart.reduce((sum, item) => sum + (item.medicine.price || 0) * item.quantity, 0),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      createOrder(orderData);
      
      // Clear cart
      clearCart();
      setCart([]);
      
      // Reset form
      setOrderForm({
        name: '',
        phone: '',
        address: '',
        notes: ''
      });
      
      alert('Order placed successfully! A pharmacist will contact you soon.');
      setSection('search');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.medicine.price || 0) * item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold shadow">
                🏛
              </div>
              <h1 className="text-xl font-bold text-yellow-700">{translate('E-Sannidhi Pharmacy')}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSection('search')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  section === 'search' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {translate('Search')}
              </button>
              
              <button
                onClick={() => setSection('cart')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                  section === 'cart' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {translate('Cart')}
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        {section === 'search' && (
          <PharmacySearch
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Cart Section */}
        {section === 'cart' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {translate('Shopping Cart')}
              </h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-12">
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
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    {translate('Your cart is empty')}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {translate('Add some medicines to get started')}
                  </p>
                  <button
                    onClick={() => setSection('search')}
                    className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    {translate('Start Shopping')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.medicineId}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.medicine.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.medicine.company} • {item.medicine.dosage}
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          ₹{item.medicine.price || 0} {translate('each')}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.medicineId, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.medicineId, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ₹{(item.medicine.price || 0) * item.quantity}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveFromCart(item.medicineId)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Order Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>{translate('Total')}:</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                    
                    <button
                      onClick={() => setSection('orders')}
                      className="w-full mt-4 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                    >
                      {translate('Proceed to Checkout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Section */}
        {section === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {translate('Place Order')}
              </h2>
              
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('Full Name')} *
                    </label>
                    <input
                      type="text"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder={translate('Enter your full name')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('Phone Number')} *
                    </label>
                    <input
                      type="tel"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder={translate('Enter phone number')}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('Delivery Address')} *
                  </label>
                  <textarea
                    value={orderForm.address}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, address: e.target.value }))}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder={translate('Enter complete delivery address')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('Notes')} (Optional)
                  </label>
                  <textarea
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder={translate('Any special instructions or notes')}
                  />
                </div>
                
                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">{translate('Order Summary')}</h3>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.medicineId} className="flex justify-between text-sm">
                        <span>{item.medicine.name} x {item.quantity}</span>
                        <span>₹{(item.medicine.price || 0) * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-300 pt-2 flex justify-between font-medium">
                      <span>{translate('Total')}:</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setSection('cart')}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    {translate('Back to Cart')}
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? translate('Placing Order...') : translate('Place Order')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
