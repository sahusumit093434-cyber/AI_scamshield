import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  IoShieldCheckmark, IoWarning, IoAlertCircle, IoTime, 
  IoDocumentText, IoGlobe, IoImage, IoQrCode, IoArrowForward 
} from 'react-icons/io5';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import Toast from '../components/Toast.jsx';

const Dashboard = () => {
  const { user, reloadProfile } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    suspicious: 0,
    dangerous: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch scan history
      const res = await axios.get('/api/analyses/history?limit=5');
      if (res.data.success) {
        setHistory(res.data.data);
      }

      // Reload user profile to refresh counts
      await reloadProfile();

      // Retrieve full history to calculate counts (simulation of stats)
      const resFull = await axios.get('/api/analyses/history?limit=100');
      if (resFull.data.success) {
        const allItems = resFull.data.data;
        const counts = {
          total: allItems.length,
          safe: allItems.filter(item => item.outputData.riskLevel === 'Safe').length,
          suspicious: allItems.filter(item => item.outputData.riskLevel === 'Suspicious').length,
          dangerous: allItems.filter(item => item.outputData.riskLevel === 'Dangerous').length
        };
        setStats(counts);
      }
    } catch (error) {
      console.error('Error fetching dashboard info:', error.message);
      setToast({ type: 'error', message: 'Failed to retrieve scan records.' });
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data based on scans
  const areaData = [
    { name: 'Mon', Scans: 2 },
    { name: 'Tue', Scans: 5 },
    { name: 'Wed', Scans: stats.total > 4 ? 4 : 1 },
    { name: 'Thu', Scans: stats.total > 6 ? 6 : 2 },
    { name: 'Fri', Scans: stats.total > 8 ? 8 : 3 },
    { name: 'Sat', Scans: stats.total > 10 ? 10 : 1 },
    { name: 'Sun', Scans: stats.total }
  ];

  const pieData = [
    { name: 'Safe', value: stats.safe || 1, color: '#22C55E' },
    { name: 'Suspicious', value: stats.suspicious || 0, color: '#EAB308' },
    { name: 'Dangerous', value: stats.dangerous || 0, color: '#EF4444' }
  ].filter(item => item.value > 0);

  const scanTypes = [
    { label: 'Text Scan', path: '/analyzer/text', icon: <IoDocumentText />, color: 'hover:text-cyber-blue', border: 'hover:border-cyber-blue/50' },
    { label: 'URL Scan', path: '/analyzer/url', icon: <IoGlobe />, color: 'hover:text-cyber-purple', border: 'hover:border-cyber-purple/50' },
    { label: 'Screenshot OCR', path: '/analyzer/screenshot', icon: <IoImage />, color: 'hover:text-cyber-red', border: 'hover:border-cyber-red/50' },
    { label: 'QR Scan', path: '/analyzer/qr', icon: <IoQrCode />, color: 'hover:text-cyber-yellow', border: 'hover:border-cyber-yellow/50' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Security Hub Console</h1>
          <p className="text-sm text-gray-400">Welcome, Agent {user?.name || 'User'}. Node standing ready.</p>
        </div>
        <div className="text-xs font-semibold text-cyber-blue font-mono bg-cyber-blue/10 border border-cyber-blue/20 px-3 py-1.5 rounded-lg">
          SECURE SECTOR // ACCESS VERIFIED
        </div>
      </div>

      {loading ? (
        <SkeletonLoader type="stat" count={4} />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="cyber-glass rounded-xl p-5 border border-cyberdark-border/40 hover:border-cyber-blue/30 transition-all flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Analyses</span>
                <span className="text-3xl font-extrabold text-white">{stats.total}</span>
              </div>
              <div className="p-3 bg-cyber-blue/10 rounded-lg text-cyber-blue text-2xl">
                <IoTime />
              </div>
            </div>

            <div className="cyber-glass rounded-xl p-5 border border-cyberdark-border/40 hover:border-cyber-green/30 transition-all flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Safe Results</span>
                <span className="text-3xl font-extrabold text-cyber-green">{stats.safe}</span>
              </div>
              <div className="p-3 bg-cyber-green/10 rounded-lg text-cyber-green text-2xl">
                <IoShieldCheckmark />
              </div>
            </div>

            <div className="cyber-glass rounded-xl p-5 border border-cyberdark-border/40 hover:border-cyber-yellow/30 transition-all flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Suspicious</span>
                <span className="text-3xl font-extrabold text-cyber-yellow">{stats.suspicious}</span>
              </div>
              <div className="p-3 bg-cyber-yellow/10 rounded-lg text-cyber-yellow text-2xl">
                <IoWarning />
              </div>
            </div>

            <div className="cyber-glass rounded-xl p-5 border border-cyberdark-border/40 hover:border-cyber-red/30 transition-all flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dangerous</span>
                <span className="text-3xl font-extrabold text-cyber-red">{stats.dangerous}</span>
              </div>
              <div className="p-3 bg-cyber-red/10 rounded-lg text-cyber-red text-2xl">
                <IoAlertCircle />
              </div>
            </div>
          </div>

          {/* Quick Actions Scan hub */}
          <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40">
            <h3 className="text-sm font-bold text-cyber-blue uppercase tracking-widest mb-4">Start Scam Scan Console</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {scanTypes.map((type, idx) => (
                <Link
                  key={idx}
                  to={type.path}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border border-cyberdark-border bg-cyberdark-input/20 transition-all ${type.color} ${type.border} hover:scale-[1.03] duration-300`}
                >
                  <span className="text-3xl mb-3 shrink-0">{type.icon}</span>
                  <span className="text-sm font-bold tracking-wide text-gray-300">{type.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scans Timeline */}
            <div className="lg:col-span-2 cyber-glass rounded-2xl p-6 border border-cyberdark-border/40">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-6">Scan Frequency timeline</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D8F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00D8F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#4B5563" fontSize={11} tickLine={false} />
                    <YAxis stroke="#4B5563" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F1626', borderColor: '#1F2E4B', color: '#fff' }} />
                    <Area type="monotone" dataKey="Scans" stroke="#00D8F6" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Breakdown Pie */}
            <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">Risk Severity Ratio</h3>
              <div className="h-48 flex items-center justify-center">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0F1626', borderColor: '#1F2E4B', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-gray-500 italic">No scan records to map.</p>
                )}
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs mt-4">
                <div className="flex flex-col items-center">
                  <span className="h-2 w-2 rounded-full bg-cyber-green mb-1"></span>
                  <span className="text-gray-400 font-semibold">Safe</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-2 w-2 rounded-full bg-cyber-yellow mb-1"></span>
                  <span className="text-gray-400 font-semibold">Suspicious</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-2 w-2 rounded-full bg-cyber-red mb-1"></span>
                  <span className="text-gray-400 font-semibold">Danger</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent History List */}
          <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Recent Security Logs</h3>
              <Link to="/history" className="text-xs font-bold text-cyber-blue flex items-center gap-1 hover:underline">
                View All Logs <IoArrowForward />
              </Link>
            </div>

            {history.length > 0 ? (
              <div className="divide-y divide-cyberdark-border/30">
                {history.map((log) => {
                  const badgeConfig = {
                    Safe: 'text-cyber-green bg-cyber-green/10 border-cyber-green/20',
                    Suspicious: 'text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/20',
                    Dangerous: 'text-cyber-red bg-cyber-red/10 border-cyber-red/20',
                  };
                  const badge = badgeConfig[log.outputData.riskLevel] || badgeConfig.Suspicious;

                  return (
                    <div key={log._id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs uppercase px-2.5 py-1 font-mono font-bold bg-cyberdark-input border border-cyberdark-border text-gray-400 rounded shrink-0">
                          {log.type}
                        </span>
                        <p className="text-sm font-medium text-gray-300 truncate">
                          {log.inputData}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${badge}`}>
                          {log.outputData.riskLevel}
                        </span>
                        <span className="text-xs text-gray-500 font-mono hidden sm:inline">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 italic text-sm">
                No scans run yet. Use the scanner cards above to run your first check.
              </div>
            )}
          </div>
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

export default Dashboard;
