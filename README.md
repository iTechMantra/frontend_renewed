# E-Sannidhi Telemedicine Platform

A comprehensive telemedicine platform connecting patients, doctors, ASHA workers, and pharmacies for better healthcare access.

## Features

### 🏥 **Multi-Role Support**
- **Users**: Access telemedicine services, health records, and connect with healthcare providers
- **Doctors**: Provide telemedicine consultations, manage patients, and prescribe medications
- **ASHA Workers**: Register patients, provide basic care, and connect with doctors
- **Pharmacies**: Browse medicines, place orders, and get prescriptions delivered

### 🔧 **Core Features**
- **Video Consultations**: Secure video calls between patients and doctors
- **Health Records Management**: Digital storage and management of health records
- **AI Symptom Checker**: Preliminary health insights using AI-powered analysis
- **Medicine Search & Delivery**: Online medicine ordering with delivery tracking
- **Prescription Management**: Digital prescriptions with visibility across roles
- **Campaign Tracking**: ASHA workers can track community health impact
- **Multi-language Support**: Available in English and Punjabi

### 🚀 **Advanced Features**
- **A* Algorithm Medicine Tracking**: Real-time delivery tracking with pathfinding
- **OTP Authentication**: Secure login with OTP verification
- **Local Storage**: Complete offline functionality with data persistence
- **Responsive Design**: Mobile-first design with professional UI/UX
- **Real-time Updates**: Live updates for consultations and deliveries

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Video**: Jitsi Meet SDK
- **State Management**: React Hooks + Local Storage
- **Icons**: SVG Icons
- **Language**: JavaScript (ES6+)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd telemedicine-frontend-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional dependencies** (if not already installed)
   ```bash
   npm install uuid
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── HealthRecordUploader.jsx
│   ├── ProfileView.jsx
│   ├── MedicineSearch.jsx
│   ├── WaitingRoom.jsx
│   ├── DoctorStatsPanel.jsx
│   ├── PatientList.jsx
│   ├── AshaPatientForm.jsx
│   ├── CampaignPanel.jsx
│   ├── SymptomChecker.jsx
│   ├── PharmacySearch.jsx
│   ├── TopNav.jsx
│   ├── RequireAuth.jsx
│   ├── MedicineTracking.jsx
│   └── MessageVideoSection.jsx
├── pages/              # Page components
│   ├── LandingPage.jsx
│   ├── UserLogin.jsx
│   ├── UserSignup.jsx
│   ├── UserDashboard.jsx
│   ├── DoctorLogin.jsx
│   ├── DoctorSignup.jsx
│   ├── DoctorDashboard.jsx
│   ├── AshaLogin.jsx
│   ├── AshaSignup.jsx
│   ├── AshaDashboard.jsx
│   └── Pharmacy.jsx
├── services/           # Business logic and utilities
│   ├── storageService.js
│   ├── authService.js
│   ├── otpService.js
│   ├── aiSymptomService.js
│   ├── translationService.js
│   └── medicineTrackingService.js
├── App.jsx            # Main application component
└── main.jsx          # Application entry point
```

## How to Test

### 1. **User Flow Testing**
1. Go to landing page
2. Click "User" → "Login / Sign Up"
3. Create account with OTP verification
4. Login to dashboard
5. Test features:
   - Upload health records
   - Search medicines
   - Create orders
   - Start video consultations
   - View prescriptions

### 2. **Doctor Flow Testing**
1. Click "Doctor" → "Login / Sign Up"
2. Register as doctor with specialization
3. Login to dashboard
4. Test features:
   - View waiting room
   - Attend patients
   - Create prescriptions
   - View statistics
   - Video consultations

### 3. **ASHA Flow Testing**
1. Click "ASHA / Volunteer" → "Login / Sign Up"
2. Register as ASHA worker
3. Login to dashboard
4. Test features:
   - Add patients
   - Upload health records
   - View campaign progress
   - Medicine search
   - Video consultations

### 4. **Pharmacy Flow Testing**
1. Click "Pharmacy" on landing page
2. Test features:
   - Search medicines
   - Add to cart
   - Place orders
   - View order history

### 5. **Advanced Features Testing**
1. **AI Symptom Checker**:
   - Click "AI Symptom Checker" on landing page
   - Add symptoms and get analysis
   - Create teleconsultation

2. **Medicine Tracking**:
   - Place an order in pharmacy
   - View delivery tracking with A* algorithm
   - Simulate delivery progress

3. **Language Support**:
   - Toggle between English and Punjabi
   - Verify all text is translated

## Key Features Implementation

### 🔐 **Authentication System**
- OTP-based signup and login
- Role-based access control
- Session management with local storage
- Secure password handling

### 📱 **Responsive Design**
- Mobile-first approach
- Professional UI with Tailwind CSS
- Hover effects and transitions
- Accessible design patterns

### 🗄️ **Data Management**
- Local storage for offline functionality
- Structured data schema
- Migration support for existing data
- Real-time updates across components

### 🎥 **Video Integration**
- Jitsi Meet SDK integration
- Room management
- Participant handling
- Call controls

### 🤖 **AI Symptom Checker**
- Mock AI analysis
- Symptom database
- Condition suggestions
- Teleconsultation integration

### 🚚 **Medicine Tracking**
- A* pathfinding algorithm
- Real-time delivery updates
- Progress visualization
- ETA calculations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Notes

### Local Storage Schema
```javascript
{
  users: [...],
  doctors: [...],
  ashas: [...],
  patients: [...],
  healthRecords: [...],
  messages: [...],
  prescriptions: [...],
  visits: [...],
  medicines: [...],
  orders: [...],
  session: { current: {...} }
}
```

### Environment Variables
No environment variables required for basic functionality.

### Performance Considerations
- Lazy loading for large components
- Optimized re-renders with React hooks
- Efficient local storage operations
- Minimal bundle size

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Government of India Initiative - E-Sannidhi.

## Support

For support and assistance:
- Email: support@esannidhi.gov.in
- Documentation: [Link to documentation]
- Issues: [Link to issue tracker]

---

**E-Sannidhi** - Bringing healthcare closer to you! 🏥💙