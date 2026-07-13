import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoShieldCheckmark, IoDocumentText, IoGlobe, IoImage, IoQrCode, IoAlertCircle, IoTrendingUp } from 'react-icons/io5';

const Home = () => {
  const [quickText, setQuickText] = useState('');
  const navigate = useNavigate();

  const handleQuickScan = (e) => {
    e.preventDefault();
    if (!quickText.trim()) return;
    // Redirect to text analyzer and pass state to scan immediately
    navigate('/analyzer/text', { state: { initialText: quickText } });
  };

  return (
    <div className="relative min-h-screen bg-[#080C14] overflow-hidden">
      {/* Decorative cyber grid and gradient rings */}
      <div className="absolute inset-0 cyber-grid z-0 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyber-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 mb-6">
            <IoShieldCheckmark className="text-cyber-blue" />
            <span className="text-xs font-semibold text-cyber-blue tracking-wider uppercase">ScamShield AI Platform 2.0</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Defend Yourself Against <br />
            <span className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-pink-500 bg-clip-text text-transparent">
              Online Scams with AI
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            Instantly detect phishing links, suspicious messages, fraudulent screenshots, and spoofed QR codes using real-time Machine Learning and OCR heuristics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="text-sm font-bold text-black bg-cyber-blue px-6 py-3 rounded-xl hover:shadow-glow-blue transition-all"
            >
              Get Started for Free
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-bold text-gray-300 bg-cyberdark-card hover:bg-cyberdark-input border border-cyberdark-border px-6 py-3 rounded-xl transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Quick Scan Console */}
        <div className="max-w-2xl mx-auto mb-20">
          <form onSubmit={handleQuickScan} className="cyber-glass rounded-2xl p-4 border border-cyber-blue/30 shadow-glow-blue/10">
            <h3 className="text-sm font-bold text-cyber-blue uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyber-blue animate-ping"></span>
              Rapid Text Scanner Node
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                placeholder="Paste WhatsApp message, SMS, email text or suspicious URL here..."
                className="flex-1 px-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium"
              />
              <button 
                type="submit"
                className="px-6 py-3 font-semibold text-white bg-cyber-blue/80 hover:bg-cyber-blue border border-cyber-blue/40 rounded-xl hover:shadow-glow-blue transition-all shrink-0 text-sm"
              >
                Scan Now
              </button>
            </div>
          </form>
        </div>

        {/* Scanners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40 hover:border-cyber-blue/50 transition-all hover:scale-[1.02] duration-300 group">
            <div className="p-3 bg-cyber-blue/10 rounded-lg text-cyber-blue w-fit mb-4 group-hover:bg-cyber-blue/20">
              <IoDocumentText className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">Text Analyzer</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Pasted message analysis checking for psychological triggers, threat words, and urgency scams.
            </p>
            <Link to="/analyzer/text" className="text-xs font-bold text-cyber-blue hover:underline">Launch Console &rarr;</Link>
          </div>

          <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40 hover:border-cyber-purple/50 transition-all hover:scale-[1.02] duration-300 group">
            <div className="p-3 bg-cyber-purple/10 rounded-lg text-cyber-purple w-fit mb-4 group-hover:bg-cyber-purple/20">
              <IoGlobe className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">URL Scanner</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Real-time checks on domain registrations, spelling variations, IP hosting, and phish databases.
            </p>
            <Link to="/analyzer/url" className="text-xs font-bold text-cyber-purple hover:underline">Launch Console &rarr;</Link>
          </div>

          <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40 hover:border-cyber-red/50 transition-all hover:scale-[1.02] duration-300 group">
            <div className="p-3 bg-cyber-red/10 rounded-lg text-cyber-red w-fit mb-4 group-hover:bg-cyber-red/20">
              <IoImage className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">Screenshot OCR</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Upload payment receipts or chat screenshots. Extracts text using OCR to scan for fraudulent patterns.
            </p>
            <Link to="/analyzer/screenshot" className="text-xs font-bold text-cyber-red hover:underline">Launch Console &rarr;</Link>
          </div>

          <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40 hover:border-cyber-yellow/50 transition-all hover:scale-[1.02] duration-300 group">
            <div className="p-3 bg-cyber-yellow/10 rounded-lg text-cyber-yellow w-fit mb-4 group-hover:bg-cyber-yellow/20">
              <IoQrCode className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">QR Scanner</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Scan or upload QR code images to resolve and analyze redirection targets before you visit them.
            </p>
            <Link to="/analyzer/qr" className="text-xs font-bold text-cyber-yellow hover:underline">Launch Console &rarr;</Link>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="cyber-glass rounded-2xl p-8 border border-cyberdark-border/40 flex flex-wrap justify-around items-center gap-8 text-center">
          <div>
            <span className="block text-4xl font-extrabold text-cyber-blue mb-1">1,245,900+</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Analyses Run</span>
          </div>
          <div className="h-10 w-px bg-cyberdark-border/50 hidden md:block"></div>
          <div>
            <span className="block text-4xl font-extrabold text-cyber-purple mb-1">98.9%</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detection Accuracy</span>
          </div>
          <div className="h-10 w-px bg-cyberdark-border/50 hidden md:block"></div>
          <div>
            <span className="block text-4xl font-extrabold text-cyber-red mb-1">15,400+</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scam Reports Lodged</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
