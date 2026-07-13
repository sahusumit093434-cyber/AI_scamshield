import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { IoShieldCheckmark, IoLockClosed, IoMail, IoPerson, IoPersonAdd } from 'react-icons/io5';
import Toast from '../components/Toast.jsx';

const Register = () => {
  const { register, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  // If logged in, redirect
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setToast({ type: 'error', message: 'Please fill in all details.' });
      return;
    }

    if (password !== confirmPassword) {
      setToast({ type: 'error', message: 'Credentials mismatch: passwords do not match.' });
      return;
    }

    if (password.length < 6) {
      setToast({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    try {
      setLoading(true);
      const res = await register(name, email, password);
      if (res.success) {
        setToast({ type: 'success', message: 'Node registered successfully! Profile established.' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setToast({ type: 'error', message: res.message });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Connection timeout. Check database connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080C14] flex items-center justify-center pt-12 pb-24">
      <div className="absolute inset-0 cyber-grid z-0 pointer-events-none"></div>
      
      <div className="w-full max-w-md mx-auto px-4 relative z-10">
        <div className="cyber-glass rounded-2xl p-8 border border-cyberdark-border/40 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <IoShieldCheckmark className="text-5xl text-cyber-blue mx-auto mb-3 animate-pulse" />
            <h2 className="text-2xl font-extrabold text-white tracking-wide">Register Port Node</h2>
            <p className="text-sm text-gray-400 mt-1">Establish credentials to join the defense cluster</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Agent Name</label>
              <div className="relative">
                <IoPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Agent Email</label>
              <div className="relative">
                <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium"
                  placeholder="john@scamshield.ai"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Security Password</label>
              <div className="relative">
                <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium"
                  placeholder="•••••••• (Min 6 chars)"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Confirm Security Password</label>
              <div className="relative">
                <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-cyber-blue text-black hover:shadow-glow-blue rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <IoPersonAdd className="text-xl" />
                  Initialize Port
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="border-t border-cyberdark-border/40 mt-5 pt-5 text-center text-sm">
            <span className="text-gray-400">Already registered? </span>
            <Link to="/login" className="text-cyber-blue font-bold hover:underline">Sign In Terminal</Link>
          </div>
        </div>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Register;
