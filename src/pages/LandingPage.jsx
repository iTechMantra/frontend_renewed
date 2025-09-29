// src/pages/LandingPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentSession } from "../services/authService";
import { initializeStorage } from "../services/storageService";
import { Shield, Clock, Users } from "lucide-react";
import {
  Brain,
  Video,
  FileText,
  Truck,
  Users as UsersIcon,
  MessageSquare,
  User,
  Stethoscope,
  Heart,
  Pill,
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import {
  translate,
  initializeTranslations,
  getToggleLanguage,
  getToggleLanguageName,
} from "../services/translationService";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Ref for Role Section
  const roleSectionRef = useRef(null);

  useEffect(() => {
    initializeStorage();
    initializeTranslations();

    const session = getCurrentSession();
    if (session?.current) {
      navigate(`/${session.current.role}/dashboard`);
      return;
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigate]);

  const handleRoleSelect = (role) => {
    switch (role) {
      case "user":
        navigate("/user/login");
        break;
      case "doctor":
        navigate("/doctor/login");
        break;
      case "asha":
        navigate("/asha/login");
        break;
      case "pharmacy":
        navigate("/pharmacy/dashboard");
        break;
      default:
        break;
    }
  };

  // Scroll to Role Section
  const scrollToRoles = () => {
    if (roleSectionRef.current) {
      roleSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Feature Card
  const FeatureCard = ({ icon, title, description, color }) => (
    <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div
        className={`${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-white" />,
      title: "AI Symptom Checker",
      description:
        "Advanced AI analyzes symptoms and provides preliminary health assessments with high accuracy.",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      icon: <Video className="h-6 w-6 text-white" />,
      title: "Video Consultations",
      description:
        "Secure, high-quality video calls with certified doctors from the comfort of your home.",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      icon: <FileText className="h-6 w-6 text-white" />,
      title: "Digital Health Records",
      description:
        "Centralized, encrypted health records accessible to you and your healthcare providers.",
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
    },
    {
      icon: <Truck className="h-6 w-6 text-white" />,
      title: "Medicine Delivery",
      description:
        "Fast, reliable delivery of prescribed medications directly to your doorstep.",
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      icon: <UsersIcon className="h-6 w-6 text-white" />,
      title: "Community Health",
      description:
        "Connect with local ASHA workers and participate in community health programs.",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support and emergency assistance when you need it most.",
      color: "bg-gradient-to-br from-red-500 to-red-600",
    },
  ];

  const roles = [
    {
      role: "user",
      title: "Patient",
      description:
        "Book consultations, access health records, and get AI-powered symptom analysis.",
      icon: <User className="h-8 w-8 text-white" />,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      role: "doctor",
      title: "Doctor",
      description:
        "Conduct video consultations, manage patient records, and provide expert care.",
      icon: <Stethoscope className="h-8 w-8 text-white" />,
      gradient: "bg-gradient-to-br from-teal-500 to-teal-600",
    },
    {
      role: "asha",
      title: "ASHA Worker",
      description:
        "Support community health initiatives and coordinate patient care.",
      icon: <Heart className="h-8 w-8 text-white" />,
      gradient: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      role: "pharmacy",
      title: "Pharmacy",
      description:
        "Manage prescriptions, provide medicine delivery, and track inventory.",
      icon: <Pill className="h-8 w-8 text-white" />,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
  ];

  const RoleCard = ({ role, title, description, icon, gradient }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={() => handleRoleSelect(role)}
      className="group cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 h-full"
    >
      <div
        className={`${gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-1 transition-transform duration-300">
        <span>Get Started →</span>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Healthcare{" "}
              <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Connecting Patients, Doctors, Asha Workers, and Pharmacies through
              cutting-edge telemedicine technology. Experience healthcare that's
              accessible, affordable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="flex items-center justify-center space-x-3 bg-white bg-opacity-70 rounded-xl p-4 backdrop-blur-sm">
                <Shield className="h-6 w-6 text-teal-600" />
                <span className="font-semibold text-gray-800">
                  Secure & Private
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-white bg-opacity-70 rounded-xl p-4 backdrop-blur-sm">
                <Clock className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-gray-800">
                  24/7 Available
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-white bg-opacity-70 rounded-xl p-4 backdrop-blur-sm">
                <Users className="h-6 w-6 text-green-600" />
                <span className="font-semibold text-gray-800">
                  Community Care
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToRoles}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started Today
              </button>
              <span className="border-2 border-gray-300 hover:border-teal-500 text-gray-700 hover:text-teal-600 font-semibold py-3 px-8 rounded-xl transition-all duration-300 bg-white hover:bg-teal-50">
                Learn More
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-5 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to access healthcare anywhere
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <Shield className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Step 1: Register</h3>
            <p className="text-gray-600">
              Sign up as a patient, doctor, ASHA, or pharmacy to access the
              platform
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <Clock className="text-4xl text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Step 2: Consult / Upload</h3>
            <p className="text-gray-600">
              Patients can consult doctors, upload health records, and track
              symptoms
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <Users className="text-4xl text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Step 3: Get Medicines</h3>
            <p className="text-gray-600">
              Order medicines online or visit nearby pharmacies for delivery
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform offers a complete suite of healthcare services
              designed to make quality medical care accessible to everyone,
              anywhere, anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section
        ref={roleSectionRef}
        className="py-16 md:py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Role
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your role to access personalized features and tools
              designed specifically for your healthcare needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {roles.map((role) => (
              <RoleCard key={role.role} {...role} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
