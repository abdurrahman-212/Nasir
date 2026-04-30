import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand & Intro */}
          <div className="space-y-4">
            <h2 className="font-serif text-3xl font-bold text-brand-secondary">M.N. Azhari</h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              Student of Al-Azhar University, Cairo. Dedicated to Islamic studies, Arabic language, and education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-brand-secondary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-brand-secondary transition-colors">About Me</Link></li>
              <li><Link to="/education" className="hover:text-brand-secondary transition-colors">Education</Link></li>
              <li><Link to="/blog" className="hover:text-brand-secondary transition-colors">Publications</Link></li>
              <li><Link to="/contact" className="hover:text-brand-secondary transition-colors">Get in Touch</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-secondary">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-brand-secondary" />
                <span>azhari@example.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-brand-secondary" />
                <span>+20 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-brand-secondary" />
                <span>Cairo, Egypt / Dhaka, Bangladesh</span>
              </div>
            </div>
            {/* Socials */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-brand-secondary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-brand-secondary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-brand-secondary transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-brand-secondary transition-colors"><Instagram size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MD Nasir Uddin Azhari. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
