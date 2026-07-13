import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  IoStatsChart, IoDocumentText, IoGlobe, IoImage, 
  IoQrCode, IoTime, IoPeople, IoPerson, IoShieldCheckmark, IoShieldSharp 
} from 'react-icons/io5';

const Sidebar = () => {
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <IoStatsChart className="text-lg shrink-0" /> },
    { to: '/analyzer/text', label: 'Text Analyzer', icon: <IoDocumentText className="text-lg shrink-0" /> },
    { to: '/analyzer/url', label: 'URL Scanner', icon: <IoGlobe className="text-lg shrink-0" /> },
    { to: '/analyzer/screenshot', label: 'Screenshot Scanner', icon: <IoImage className="text-lg shrink-0" /> },
    { to: '/analyzer/qr', label: 'QR Scanner', icon: <IoQrCode className="text-lg shrink-0" /> },
    { to: '/history', label: 'History', icon: <IoTime className="text-lg shrink-0" /> },
    { to: '/community', label: 'Community Forum', icon: <IoPeople className="text-lg shrink-0" /> },
    { to: '/profile', label: 'Profile Settings', icon: <IoPerson className="text-lg shrink-0" /> },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 bg-cyberdark-card border-r border-cyberdark-border/40 min-h-[calc(100vh-4rem)] p-4 flex flex-col gap-2">
      <div className="mb-4 px-3 py-2 bg-cyberdark-input/30 rounded-xl border border-cyberdark-border/20 flex items-center gap-2">
        <IoShieldCheckmark className="text-cyber-blue text-xl" />
        <div>
          <h4 className="text-xs font-bold text-gray-200 uppercase tracking-widest leading-none">Security Node</h4>
          <span className="text-[10px] text-cyber-blue font-mono">ONLINE // SECURE</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-cyberdark-input hover:text-cyber-blue ${
                isActive 
                  ? 'bg-cyber-blue/10 border-l-4 border-cyber-blue text-cyber-blue shadow-glow-blue/5' 
                  : 'text-gray-400'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}

        {/* Admin Dashboard (Only visible if user role === 'admin') */}
        {user && user.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-cyber-red/10 hover:text-cyber-red ${
                isActive 
                  ? 'bg-cyber-red/10 border-l-4 border-cyber-red text-cyber-red' 
                  : 'text-cyber-red/80 border border-cyber-red/10 bg-cyber-red/5'
              }`
            }
          >
            <IoShieldSharp className="text-lg shrink-0" />
            Admin Panel
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
