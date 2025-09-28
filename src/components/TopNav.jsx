import { useState } from 'react';
import { AiOutlineWifi, AiOutlineGlobal, AiOutlineHeart } from 'react-icons/ai';
import { translate, getToggleLanguage, getToggleLanguageName } from '../services/translationService';

export default function TopNav() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleLanguageToggle = () => {
    const newLang = getToggleLanguage();
    localStorage.setItem('appLanguage', newLang);
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20">
        
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md">
            <AiOutlineHeart className="text-3xl"/>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-2xl text-gray-900">E-Sannidhi</span>
            <span className="text-base text-gray-500">Connecting care, anytime anywhere</span>
          </div>
        </div>

        {/* Status & Language */}
        <div className="flex items-center space-x-4">
          {/* Online Status */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${
              isOnline
                ? 'bg-green-100 text-green-800 animate-pulse'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <AiOutlineWifi
              className={`w-4 h-4 ${isOnline ? 'text-green-500' : 'text-red-500'}`}
            />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={handleLanguageToggle}
            className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <AiOutlineGlobal className="mr-1" />
            {getToggleLanguageName() || 'EN'}
          </button>
        </div>
      </div>
    </nav>
  );
}
