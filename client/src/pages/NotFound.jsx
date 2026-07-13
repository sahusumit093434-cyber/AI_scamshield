import React from 'react';
import { Link } from 'react-router-dom';
import { IoShieldSharp, IoHome } from 'react-icons/io5';

const NotFound = () => {
  return (
    <div className="relative min-h-screen bg-[#080C14] flex items-center justify-center pt-12 pb-24">
      <div className="absolute inset-0 cyber-grid z-0 pointer-events-none"></div>
      
      <div className="max-w-md mx-auto text-center px-4 relative z-10">
        <IoShieldSharp className="text-6xl text-cyber-red mx-auto mb-6 animate-bounce" />
        <h1 className="text-7xl font-extrabold text-white mb-2 tracking-wider">404</h1>
        <h2 className="text-xl font-bold text-gray-200 mb-4 uppercase tracking-widest">Access Restricted / Node Missing</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The requested security address does not exist or has been relocated to another sub-sector of the ScamShield system network.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 font-bold text-black bg-cyber-blue rounded-xl hover:shadow-glow-blue transition-all text-sm"
        >
          <IoHome />
          Return to Base Node
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
