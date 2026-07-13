import React from 'react';
import { IoShieldCheckmark, IoTerminal, IoServer, IoHardwareChip, IoPeopleOutline } from 'react-icons/io5';

const About = () => {
  return (
    <div className="relative min-h-screen bg-[#080C14] pt-12 pb-24">
      <div className="absolute inset-0 cyber-grid z-0 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 tracking-wide text-center">
          About <span className="text-cyber-blue">ScamShield AI</span>
        </h1>
        <p className="text-lg text-gray-300 text-center leading-relaxed mb-12">
          ScamShield AI is an intelligent cybersecurity application built to empower everyday web users against phishing, social engineering, and financial fraud using Artificial Intelligence.
        </p>

        {/* The Core Mission */}
        <div className="cyber-glass rounded-xl p-8 border border-cyberdark-border/40 mb-10">
          <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
            <IoShieldCheckmark className="text-cyber-blue text-2xl" />
            Our Mission
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Online scams have become increasingly sophisticated. Simple rules like "check the sender address" are no longer sufficient to stop modern generative AI phishing templates. We built ScamShield AI to provide users with equivalent defensive technology: deep language model classification, real-time OCR transcription of chat screenshot proofs, and rapid reputation checkers.
          </p>
          <p className="text-gray-300 leading-relaxed">
            By combining artificial intelligence checks with community-driven reporting, we aim to map out scam coordinates (domains, phone numbers, fake UPI payment IDs) and render them harmless.
          </p>
        </div>

        {/* Tech Stack Breakdown */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">The Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40">
            <IoTerminal className="text-cyber-blue text-3xl mb-4" />
            <h3 className="text-lg font-bold text-gray-200 mb-2">Frontend</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              React.js powered by Vite, structured with Tailwind CSS utilities, offering 60fps animations and glowing responsive panels.
            </p>
          </div>
          <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40">
            <IoServer className="text-cyber-purple text-3xl mb-4" />
            <h3 className="text-lg font-bold text-gray-200 mb-2">Backend</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Node.js and Express server enforcing strict security protocols (Helmet, CORS, Rate Limiting, JWT token claims).
            </p>
          </div>
          <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40">
            <IoHardwareChip className="text-cyber-red text-3xl mb-4" />
            <h3 className="text-lg font-bold text-gray-200 mb-2">AI Processing</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Google Gemini API for contextual language assessment, alongside Tesseract.js running client/server-side image OCR.
            </p>
          </div>
        </div>

        {/* Community focus */}
        <div className="cyber-glass rounded-xl p-8 border border-cyberdark-border/40 flex items-center gap-6">
          <IoPeopleOutline className="text-cyber-purple text-5xl shrink-0 hidden sm:block animate-bounce" />
          <div>
            <h3 className="text-lg font-bold text-gray-200 mb-2">Community Driven</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Our Community Reporting node allows users to flags scams they encounter. Other security nodes can comment, verify, and upvote, creating a crowd-sourced directory that automatically updates our reputation database in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
