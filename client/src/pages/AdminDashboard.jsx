import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  IoShieldSharp, IoPeople, IoAnalytics, IoTrash, IoLockClosed, IoLockOpen, 
  IoAdd, IoList, IoGlobe, IoDocumentText, IoWarning, IoShieldCheckmark 
} from 'react-icons/io5';
import Toast from '../components/Toast.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Blacklist additions state
  const [newUrl, setNewUrl] = useState('');
  const [newReason, setNewReason] = useState('');

  // Tab state: 'stats' | 'users' | 'blacklist'
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await axios.get('/api/admin/stats');
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      // Fetch users
      const usersRes = await axios.get('/api/admin/users');
      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }

      // Fetch blacklist
      const blacklistRes = await axios.get('/api/admin/blacklist');
      if (blacklistRes.data.success) {
        setBlacklist(blacklistRes.data.data);
      }
    } catch (error) {
      console.error('Failed to load admin stats:', error.message);
      setToast({ type: 'error', message: 'Failed to synchronize admin console records.' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id, currentStatus) => {
    try {
      const res = await axios.put(`/api/admin/users/${id}/block`);
      if (res.data.success) {
        setToast({ type: 'success', message: res.data.message });
        setUsers(users.map(u => u._id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Action failed.' });
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete user? This permanently purges account and logs.')) return;

    try {
      const res = await axios.delete(`/api/admin/users/${id}`);
      if (res.data.success) {
        setToast({ type: 'success', message: 'User logs and credentials purged.' });
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Delete user failed.' });
    }
  };

  const handleAddBlacklist = async (e) => {
    e.preventDefault();
    if (!newUrl.trim() || !newReason.trim()) return;

    try {
      const res = await axios.post('/api/admin/blacklist', { url: newUrl, reason: newReason });
      if (res.data.success) {
        setToast({ type: 'success', message: 'URL added to database blacklist.' });
        setBlacklist([res.data.data, ...blacklist]);
        setNewUrl('');
        setNewReason('');
        // Reload stats
        fetchAdminData();
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Failed to blacklist URL.' });
    }
  };

  const handleRemoveBlacklist = async (id) => {
    try {
      const res = await axios.delete(`/api/admin/blacklist/${id}`);
      if (res.data.success) {
        setToast({ type: 'success', message: 'URL removed from blacklist.' });
        setBlacklist(blacklist.filter(item => item._id !== id));
        // Reload stats
        fetchAdminData();
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to remove URL from blacklist.' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cyber-red uppercase tracking-wider flex items-center gap-2">
            <IoShieldSharp /> Administrator panel
          </h1>
          <p className="text-sm text-gray-400 font-medium">Verify stats, moderate community entries, and manage blacklisted hosts</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 bg-cyberdark-input/50 p-1 rounded-xl border border-cyberdark-border shrink-0">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'stats' ? 'bg-cyber-red text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Metrics
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'users' ? 'bg-cyber-red text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('blacklist')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'blacklist' ? 'bg-cyber-red text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Blacklist
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 border-4 border-cyber-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Tab 1: Stats/Metrics */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-6">
              {/* Quick totals widgets */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="cyber-glass rounded-xl p-5 border border-cyberdark-border/40 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Users</span>
                    <span className="text-2xl font-extrabold text-white">{stats.totalUsers}</span>
                  </div>
                  <IoPeople className="text-2xl text-cyber-blue" />
                </div>
                <div className="cyber-glass rounded-xl p-5 border border-cyberdark-border/40 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Analyses</span>
                    <span className="text-2xl font-extrabold text-white">{stats.totalAnalyses}</span>
                  </div>
                  <IoAnalytics className="text-2xl text-cyber-purple" />
                </div>
                <div className="cyber-glass rounded-xl p-5 border border-cyberdark-border/40 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Reports Lodged</span>
                    <span className="text-2xl font-extrabold text-white">{stats.totalReports}</span>
                  </div>
                  <IoDocumentText className="text-2xl text-cyber-yellow" />
                </div>
                <div className="cyber-glass rounded-xl p-5 border border-cyberdark-border/40 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Blacklisted URLs</span>
                    <span className="text-2xl font-extrabold text-white">{stats.totalBlockedUrls}</span>
                  </div>
                  <IoGlobe className="text-2xl text-cyber-red" />
                </div>
              </div>

              {/* Breakdown grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40">
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">Medium Frequency Breakdown</h3>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                      <span>Plain Text Scans:</span>
                      <span className="text-gray-200">{stats.breakdown.text}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                      <span>URL Probe Records:</span>
                      <span className="text-gray-200">{stats.breakdown.url}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                      <span>Screenshot OCR Scrapes:</span>
                      <span className="text-gray-200">{stats.breakdown.screenshot}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                      <span>QR Resolves:</span>
                      <span className="text-gray-200">{stats.breakdown.qr}</span>
                    </div>
                  </div>
                </div>

                <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40">
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">Severity Ratio Metrics</h3>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                      <span>Safe Verdicts:</span>
                      <span className="text-cyber-green font-bold">{stats.riskBreakdown.safe}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                      <span>Suspicious Vectors:</span>
                      <span className="text-cyber-yellow font-bold">{stats.riskBreakdown.suspicious}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                      <span>Dangerous Scams:</span>
                      <span className="text-cyber-red font-bold">{stats.riskBreakdown.dangerous}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Users management */}
          {activeTab === 'users' && (
            <div className="cyber-glass rounded-2xl border border-cyberdark-border/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-cyberdark-input/50 text-[10px] uppercase font-bold tracking-widest text-gray-400 border-b border-cyberdark-border/60">
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Email</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-center">Scans</th>
                      <th className="py-4 px-6 text-center">Reports</th>
                      <th className="py-4 px-6 text-right">Moderation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyberdark-border/20">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-cyberdark-input/20 transition-all">
                        <td className="py-4 px-6 text-sm font-bold text-gray-200">{u.name}</td>
                        <td className="py-4 px-6 text-sm font-mono text-gray-400">{u.email}</td>
                        <td className="py-4 px-6 text-xs font-bold uppercase tracking-wider">{u.role}</td>
                        <td className="py-4 px-6">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${u.status === 'active' ? 'text-cyber-green bg-cyber-green/10 border-cyber-green/20' : 'text-cyber-red bg-cyber-red/10 border-cyber-red/20'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-sm font-semibold">{u.totalAnalyses}</td>
                        <td className="py-4 px-6 text-center text-sm font-semibold">{u.totalReports}</td>
                        <td className="py-4 px-6 text-right">
                          {u.role !== 'admin' && (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleToggleBlock(u._id, u.status)}
                                className={`p-1.5 border rounded-lg transition-colors ${u.status === 'active' ? 'bg-cyber-yellow/10 border-cyber-yellow/20 text-cyber-yellow hover:bg-cyber-yellow/20' : 'bg-cyber-green/10 border-cyber-green/20 text-cyber-green hover:bg-cyber-green/20'}`}
                                title={u.status === 'active' ? 'Suspend Account' : 'Re-activate Account'}
                              >
                                {u.status === 'active' ? <IoLockClosed /> : <IoLockOpen />}
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(u._id)}
                                className="p-1.5 bg-cyber-red/10 border border-cyber-red/20 text-cyber-red rounded-lg hover:bg-cyber-red/20 transition-colors"
                                title="Purge User Logs"
                              >
                                <IoTrash />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: URL Blacklist moderation */}
          {activeTab === 'blacklist' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form card */}
              <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40 h-fit">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <IoAdd /> Blacklist Host
                </h3>
                
                <form onSubmit={handleAddBlacklist} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Host / URL</label>
                    <input 
                      type="text" required
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-lg border border-cyberdark-border focus:border-cyber-red focus:outline-none transition-all text-xs font-semibold"
                      placeholder="e.g. secure-phish-portal.tk"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Block Reason</label>
                    <input 
                      type="text" required
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      className="w-full px-3 py-2 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-lg border border-cyberdark-border focus:border-cyber-red focus:outline-none transition-all text-xs font-semibold"
                      placeholder="Impersonation of Paypal login"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-cyber-red text-white hover:shadow-glow-red rounded-xl font-bold transition-all text-xs"
                  >
                    Flag and Restrict Address
                  </button>
                </form>
              </div>

              {/* Blacklisted items list table */}
              <div className="lg:col-span-2 cyber-glass rounded-xl border border-cyberdark-border/40 overflow-hidden">
                <div className="p-4 bg-cyberdark-input/20 border-b border-cyberdark-border/30 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <IoList /> BLACKLIST LOGS ({blacklist.length})
                </div>

                {blacklist.length > 0 ? (
                  <div className="divide-y divide-cyberdark-border/20 max-h-96 overflow-y-auto">
                    {blacklist.map(item => (
                      <div key={item._id} className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-cyber-red font-mono">{item.url}</p>
                          <p className="text-xs text-gray-400 mt-1">Reason: {item.reason}</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveBlacklist(item._id)}
                          className="p-1.5 bg-cyber-green/10 border border-cyber-green/20 text-cyber-green rounded-lg hover:bg-cyber-green/20 transition-colors shrink-0"
                          title="Authorize Host"
                        >
                          <IoShieldCheckmark />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 italic text-center py-12">No restricted hosts mapped in database.</p>
                )}
              </div>
            </div>
          )}
        </>
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

export default AdminDashboard;
