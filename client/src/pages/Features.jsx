import React from 'react';
import { IoDocumentText, IoGlobe, IoImage, IoQrCode, IoPieChart, IoShieldCheckmark, IoPeople, IoKey } from 'react-icons/io5';

const Features = () => {
  const featureList = [
    {
      icon: <IoDocumentText className="text-cyber-blue text-2xl" />,
      title: 'Scam Text Analyzer',
      desc: 'Pasted messaging scanner. Employs Large Language Heuristics to analyze psychological pressure, false prizes, threat phrases, or phishing URLs. Saves historical audits dynamically.'
    },
    {
      icon: <IoGlobe className="text-cyber-purple text-2xl" />,
      title: 'Reputational URL Scanner',
      desc: 'Validates target domains and cross-references them against Safe Browsing records, typosquatting databases, character masquerade algorithms, and local admin blacklists.'
    },
    {
      icon: <IoImage className="text-cyber-red text-2xl" />,
      title: 'Screenshot OCR Analyzer',
      desc: 'Upload screenshots of suspicious chats, email warnings, or payment completions. The system OCR-scrapes text strings and inputs them into the AI engine.'
    },
    {
      icon: <IoQrCode className="text-cyber-yellow text-2xl" />,
      title: 'QR Code Guard',
      desc: 'Parses QR images to uncover underlying redirection paths, scanning targets for phishing signatures before you access them on mobile devices.'
    },
    {
      icon: <IoPieChart className="text-cyber-blue text-2xl" />,
      title: 'Threat Stats Dashboard',
      desc: 'Dynamic widgets compile total analyses, suspicious vectors found, and danger classification ratios, rendering them on rich SVG charts.'
    },
    {
      icon: <IoPeople className="text-cyber-purple text-2xl" />,
      title: 'Community Scam Database',
      desc: 'A user-facing forum to flag active scams. Support attachments, telephone reporting, website tags, comments, and community upvoting.'
    },
    {
      icon: <IoKey className="text-cyber-red text-2xl" />,
      title: 'Enterprise Encryption',
      desc: 'Enforces JWT token authentication on API routes, password hashing via bcrypt, rate-limiting, and express helmet headers to prevent script injections.'
    },
    {
      icon: <IoShieldCheckmark className="text-cyber-green text-2xl" />,
      title: 'Admin Control Center',
      desc: 'Provides authorized moderators with audit screens, user suspension toggles, community report moderations, and real-time blacklisting.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#080C14] pt-12 pb-24">
      <div className="absolute inset-0 cyber-grid z-0 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-wide">
            Platform <span className="text-cyber-blue">Capabilities</span>
          </h1>
          <p className="text-gray-400">
            A comprehensive suite of cybersecurity scanners and reporting utilities engineered to protect user credentials, funds, and identities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((f, idx) => (
            <div key={idx} className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40 hover:border-cyber-blue/40 hover:scale-[1.01] transition-all duration-300">
              <div className="p-3 bg-cyberdark-input/50 rounded-lg w-fit mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
