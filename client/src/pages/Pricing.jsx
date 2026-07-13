import React from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoShieldHalf } from 'react-icons/io5';

const Pricing = () => {
  return (
    <div className="relative min-h-screen bg-[#080C14] pt-12 pb-24">
      <div className="absolute inset-0 cyber-grid z-0 pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-wide">
            Simple, Transparent <span className="text-cyber-blue">Pricing</span>
          </h1>
          <p className="text-gray-400">
            Get started for free or upgrade to Pro to unlock advanced AI models, API access, and bulk scanner features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="cyber-glass rounded-2xl p-8 border border-cyberdark-border/40 hover:border-gray-500/30 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-500/10 border border-gray-500/20 px-3 py-1 rounded-full w-fit block mb-4">Community Core</span>
              <h3 className="text-2xl font-extrabold text-white mb-1">Free Tier</h3>
              <p className="text-sm text-gray-400 mb-6">Essential scanning utilities for personal use.</p>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-extrabold text-white">$0</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">/ lifetime</span>
              </div>

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <IoCheckmarkCircle className="text-cyber-green text-lg shrink-0" />
                  <span>10 scam text scans per day</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <IoCheckmarkCircle className="text-cyber-green text-lg shrink-0" />
                  <span>Basic URL reputation checks</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <IoCheckmarkCircle className="text-cyber-green text-lg shrink-0" />
                  <span>Standard Screenshot OCR (3/day)</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <IoCheckmarkCircle className="text-cyber-green text-lg shrink-0" />
                  <span>Community Scam Forum access</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500 line-through">
                  <IoCloseCircle className="text-cyber-red text-lg shrink-0" />
                  <span>Unlimited Gemini AI insights</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500 line-through">
                  <IoCloseCircle className="text-cyber-red text-lg shrink-0" />
                  <span>Developer API endpoints</span>
                </li>
              </ul>
            </div>

            <button className="w-full py-3 px-4 rounded-xl font-bold bg-cyberdark-input hover:bg-cyberdark-border border border-cyberdark-border/40 text-gray-200 transition-all">
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="cyber-glass rounded-2xl p-8 border border-cyber-blue/40 shadow-glow-blue/10 hover:border-cyber-blue transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-cyber-blue text-black font-extrabold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
              RECOMMENDED
            </div>
            
            <div>
              <span className="text-xs font-bold text-cyber-blue uppercase tracking-widest bg-cyber-blue/10 border border-cyber-blue/20 px-3 py-1 rounded-full w-fit block mb-4">Enterprise Shield</span>
              <h3 className="text-2xl font-extrabold text-white mb-1">Pro Guard</h3>
              <p className="text-sm text-gray-400 mb-6">Advanced threat intelligence and model parameters.</p>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-extrabold text-white">$12</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">/ month</span>
              </div>

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <IoCheckmarkCircle className="text-cyber-green text-lg shrink-0" />
                  <span>Unlimited text scans (2k tokens/scan)</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <IoCheckmarkCircle className="text-cyber-green text-lg shrink-0" />
                  <span>Deep AI heuristic URL scanning</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <IoCheckmarkCircle className="text-cyber-green text-lg shrink-0" />
                  <span>Unlimited Screenshot OCR parsing</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <IoCheckmarkCircle className="text-cyber-green text-lg shrink-0" />
                  <span>Automatic malicious domain blocking</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <IoCheckmarkCircle className="text-cyber-green text-lg shrink-0" />
                  <span>Advanced Red Flags & Risk Explanations</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <IoCheckmarkCircle className="text-cyber-green text-lg shrink-0" />
                  <span>Developer API access key (100k req/mo)</span>
                </li>
              </ul>
            </div>

            <button className="w-full py-3 px-4 rounded-xl font-bold bg-cyber-blue text-black hover:shadow-glow-blue transition-all">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
