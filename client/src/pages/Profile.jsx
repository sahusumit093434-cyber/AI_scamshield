import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { IoPersonCircle, IoShieldCheckmark, IoShieldSharp, IoAnalytics, IoCalendarOutline, IoDocumentText, IoMegaphone } from 'react-icons/io5';
import Toast from '../components/Toast.jsx';

const Profile = () => {
  const { user, logout, reloadProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      await reloadProfile();
    } catch (err) {
      console.error('Failed to load profile details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Node Credentials</h1>
        <p className="text-sm text-gray-400">View and verify system credentials and platform statistics</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Credentials details card */}
          <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40 space-y-6">
            <div className="flex flex-col items-center text-center gap-3">
              <IoPersonCircle className="text-8xl text-gray-400" />
              <div>
                <h3 className="text-xl font-extrabold text-white leading-none mb-1">{user?.name}</h3>
                <span className="text-xs font-mono text-gray-400">{user?.email}</span>
              </div>

              {user?.role === 'admin' ? (
                <span className="text-xs font-bold text-cyber-red font-mono bg-cyber-red/10 border border-cyber-red/20 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <IoShieldSharp /> Administrator Node
                </span>
              ) : (
                <span className="text-xs font-bold text-cyber-blue font-mono bg-cyber-blue/10 border border-cyber-blue/20 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <IoShieldCheckmark /> Security Node
                </span>
              )}
            </div>

            <div className="border-t border-cyberdark-border/30 pt-4 space-y-4 text-sm font-medium">
              <div className="flex justify-between items-center text-gray-400">
                <span className="flex items-center gap-1.5"><IoCalendarOutline /> Registered On:</span>
                <span className="text-gray-200 font-mono">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span className="flex items-center gap-1.5"><IoAnalytics /> Operational Status:</span>
                <span className="text-cyber-green font-semibold">Active</span>
              </div>
            </div>

            <button 
              onClick={logout}
              className="w-full mt-4 py-3 bg-cyber-red/10 border border-cyber-red/30 hover:bg-cyber-red/20 text-cyber-red rounded-xl font-bold text-sm transition-all"
            >
              Sign Out Terminal Session
            </button>
          </div>

          {/* User statistics summary */}
          <div className="lg:col-span-2 cyber-glass rounded-2xl p-6 border border-cyberdark-border/40 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-300 uppercase tracking-widest mb-6">Security Metrics Summary</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Analyses ran */}
                <div className="bg-cyberdark-input/20 p-5 rounded-xl border border-cyberdark-border/30 flex items-center gap-4">
                  <div className="p-3 bg-cyber-blue/10 rounded-lg text-cyber-blue text-3xl">
                    <IoDocumentText />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Scans Run</span>
                    <span className="text-2xl font-extrabold text-white">{user?.totalAnalyses || 0}</span>
                  </div>
                </div>

                {/* Scams reported */}
                <div className="bg-cyberdark-input/20 p-5 rounded-xl border border-cyberdark-border/30 flex items-center gap-4">
                  <div className="p-3 bg-cyber-purple/10 rounded-lg text-cyber-purple text-3xl">
                    <IoMegaphone />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Community Reports</span>
                    <span className="text-2xl font-extrabold text-white">{user?.totalReports || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cyber note disclaimer */}
            <div className="border-t border-cyberdark-border/20 pt-6 mt-6 text-sm text-gray-400 leading-relaxed">
              <p>
                <strong>Security Officer Notice:</strong> Please protect your decryption credentials. All logs scanned on the system are cataloged and mapped under your encrypted session UUID to maintain audit integrity.
              </p>
            </div>
          </div>
        </div>
      )}

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

export default Profile;
