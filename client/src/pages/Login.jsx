import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { IoShieldCheckmark, IoLockClosed, IoMail, IoLogIn } from 'react-icons/io5';
import Toast from '../components/Toast.jsx';

const Login = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();

  // If already logged in, push to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ type: 'error', message: 'Please fill in all details.' });
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        setToast({ type: 'success', message: 'Authentication approved. Session token generated.' });
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
            <h2 className="text-2xl font-extrabold text-white tracking-wide">Secure Terminal Sign In</h2>
            <p className="text-sm text-gray-400 mt-1">Provide credentials to sync encryption keys</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Access Email</label>
              <div className="relative">
                <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium"
                  placeholder="agent@scamshield.ai"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Decryption Password</label>
              <div className="relative">
                <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-cyber-blue text-black hover:shadow-glow-blue rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <IoLogIn className="text-xl" />
                  Decrypt Account
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="border-t border-cyberdark-border/40 mt-6 pt-6 text-center text-sm">
            <span className="text-gray-400">New node in system? </span>
            <Link to="/register" className="text-cyber-blue font-bold hover:underline">Register Port</Link>
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

export default Login;
