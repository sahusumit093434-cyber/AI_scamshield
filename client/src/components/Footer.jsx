import React from 'react';
import { IoShieldHalf } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="bg-[#05070d] border-t border-cyberdark-border/40 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <IoShieldHalf className="text-cyber-blue text-lg" />
          <span className="font-bold text-sm tracking-wider text-gray-300">
            SCAMSHIELD AI
          </span>
        </div>
        <p className="text-xs text-gray-500 text-center max-w-md md:text-right">
          Disclaimer: ScamShield AI is an intelligent assistant designed to scan vectors for suspicious activity. Always cross-verify financial and credential claims directly with vendors before acting.
        </p>
        <div className="text-xs text-gray-500 font-mono">
          &copy; {new Date().getFullYear()} SCAMSHIELD // ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
};

export default Footer;
