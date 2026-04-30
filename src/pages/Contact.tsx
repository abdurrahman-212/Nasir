import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="font-serif text-5xl font-bold text-slate-900 mb-6">Get in Touch</h1>
            <p className="text-slate-600 text-lg mb-10 max-w-md">
              Whether you have a query about scholarship, speaking engagements, or just want to connect, I'd love to hear from you.
            </p>

            <div className="space-y-8">
              <ContactItem 
                icon={<Mail size={24} />} 
                title="Email Me" 
                detail="azhari@example.com" 
              />
              <ContactItem 
                icon={<Phone size={24} />} 
                title="Call Me" 
                detail="+20 123 456 789" 
              />
              <ContactItem 
                icon={<MapPin size={24} />} 
                title="Location" 
                detail="Al-Azhar, Cairo, Egypt" 
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-brand-bg rounded-[40px] p-8 md:p-12 border border-brand-primary/5"
          >
            <div className="flex items-center space-x-3 mb-8">
              <MessageSquare className="text-brand-primary" />
              <h2 className="text-2xl font-bold text-slate-900">Send a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="Name" 
                  type="text" 
                  value={formData.name} 
                  onChange={(val) => setFormData({...formData, name: val})} 
                  required
                />
                <InputGroup 
                  label="Email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(val) => setFormData({...formData, email: val})} 
                  required
                />
              </div>
              <InputGroup 
                label="Subject" 
                type="text" 
                value={formData.subject} 
                onChange={(val) => setFormData({...formData, subject: val})} 
                required
              />
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Message</label>
                <textarea 
                  className="w-full bg-white rounded-2xl border border-brand-primary/10 p-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all h-32 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, title, detail }: { icon: React.ReactNode, title: string, detail: string }) {
  return (
    <div className="flex items-start space-x-6 group">
      <div className="bg-brand-bg w-14 h-14 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-xl font-medium text-slate-900">{detail}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, type, value, onChange, required }: { label: string, type: string, value: string, onChange: (val: string) => void, required?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{label}</label>
      <input 
        type={type} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-white rounded-2xl border border-brand-primary/10 px-4 py-3 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
      />
    </div>
  );
}
