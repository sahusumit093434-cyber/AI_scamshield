import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { IoShieldHalf, IoMenu, IoClose, IoLogOut, IoPersonCircle, IoSettings, IoStatsChart } from 'react-icons/io5';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/community', label: 'Community' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#080C14]/90 backdrop-blur-md border-b border-cyberdark-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <IoShieldHalf className="text-cyber-blue text-2xl animate-pulse" />
              <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-white via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                SCAMSHIELD <span className="text-cyber-blue text-xs font-semibold uppercase tracking-widest bg-cyber-blue/10 px-2 py-0.5 rounded border border-cyber-blue/20">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors hover:text-cyber-blue ${isActive ? 'text-cyber-blue border-b-2 border-cyber-blue/80 pb-1' : 'text-gray-300'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Dashboard Shortcut */}
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-1.5 text-xs font-semibold text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/30 px-3.5 py-1.5 rounded-lg hover:bg-cyber-blue/20 transition-all shadow-glow-blue/10"
                >
                  <IoStatsChart className="text-sm" />
                  Dashboard
                </Link>

                {/* Profile Link */}
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <IoPersonCircle className="text-gray-300 text-3xl" />
                  <div className="text-left leading-none">
                    <p className="text-xs font-bold text-gray-200">{user.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{user.role}</p>
                  </div>
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-gray-400 hover:text-cyber-red rounded-lg transition-colors"
                  title="Logout"
                >
                  <IoLogOut className="text-xl" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="text-sm text-gray-300 hover:text-cyber-blue transition-colors px-3 py-1.5"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm font-semibold text-white bg-cyber-blue/80 hover:bg-cyber-blue hover:shadow-glow-blue border border-cyber-blue/40 px-4 py-2 rounded-lg transition-all"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <Link 
                to="/dashboard" 
                className="mr-3 text-cyber-blue bg-cyber-blue/10 p-1.5 rounded-lg hover:bg-cyber-blue/20 transition-all"
                title="Dashboard"
              >
                <IoStatsChart className="text-xl" />
              </Link>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-cyber-blue p-2 rounded-lg"
            >
              {mobileMenuOpen ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cyberdark-border bg-[#080C14] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyber-blue hover:bg-cyberdark-card"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-cyberdark-border/40 my-3 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2">
                  <IoPersonCircle className="text-gray-300 text-3xl" />
                  <div>
                    <p className="text-sm font-bold text-gray-200">{user.name}</p>
                    <p className="text-xs text-gray-400 font-semibold">{user.email}</p>
                  </div>
                </div>
                <Link 
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-cyber-blue hover:bg-cyber-blue/10"
                >
                  Go to Dashboard
                </Link>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-cyber-red hover:bg-cyber-red/10 rounded-md font-medium text-base"
                >
                  <IoLogOut className="text-lg" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-gray-300 hover:text-cyber-blue transition-colors rounded-md hover:bg-cyberdark-card"
                >
                  Log In
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 font-semibold text-white bg-cyber-blue/80 hover:bg-cyber-blue rounded-md border border-cyber-blue/40 transition-all"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
