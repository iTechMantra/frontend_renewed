// src/components/Footer.jsx
import React from 'react';
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'Doctors', href: '#' },
    { name: 'ASHA Network', href: '#' },
    { name: 'Pharmacies', href: '#' },
    { name: 'Help Center', href: '#' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Medical Disclaimer', href: '#' },
    { name: 'Cookie Policy', href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-2 rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">E-Sannidhi</h3>
                <p className="text-sm text-gray-400">Healthcare for Everyone</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Revolutionizing healthcare delivery through technology, connecting communities 
              with quality medical care when they need it most.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <button
                  key={index}
                  className="w-8 h-8 bg-gray-800 hover:bg-teal-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-teal-400 text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-teal-400 text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-teal-400" />
                <span className="text-gray-300 text-sm">+91 1800-123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-teal-400" />
                <span className="text-gray-300 text-sm">support@esannidhi.in</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-teal-400 mt-1" />
                <span className="text-gray-300 text-sm leading-relaxed">
                  Digital Health Hub<br />
                  Bangalore, Karnataka<br />
                  India - 560001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 E-Sannidhi. All rights reserved. Built with care for better healthcare.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>🇮🇳 Made in India</span>
              <span>•</span>
              <span>ISO 27001 Certified</span>
              <span>•</span>
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
