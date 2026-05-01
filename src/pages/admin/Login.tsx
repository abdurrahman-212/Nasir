import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('[AUTH] Attempting login for:', username);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('[AUTH] Non-JSON response:', text);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        toast.success('Welcome back, Azhari!');
        navigate('/admin/dashboard');
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error: any) {
      console.error('[AUTH] Login error:', error);
      toast.error(error.message || 'Connection failed. Please check if your backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-bg px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-xl border border-brand-primary/5 p-12"
      >
        <div className="text-center mb-10">
          <div className="bg-brand-primary w-20 h-20 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-brand-primary/20">
            <Lock size={32} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-slate-500 mt-2">Secure access for Nasir Uddin Azhari</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-brand-bg rounded-2xl border border-brand-primary/10 pl-12 pr-4 py-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-bg rounded-2xl border border-brand-primary/10 pl-12 pr-4 py-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
          >
            <span>{isLoading ? 'Authenticating...' : 'Login Now'}</span>
            <LogIn size={18} />
          </button>
        </form>
        
        <p className="text-center text-xs text-slate-400 mt-8">
          Restricted access. All attempts are logged.
        </p>
      </motion.div>
    </div>
  );
}
