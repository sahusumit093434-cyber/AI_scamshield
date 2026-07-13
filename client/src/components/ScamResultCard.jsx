import React from 'react';
import { IoShieldCheckmark, IoWarning, IoAlertCircle, IoArrowForward } from 'react-icons/io5';

const ScamResultCard = ({ result }) => {
  if (!result) return null;

  const { scamScore, riskLevel, explanation, redFlags, recommendations } = result;

  const config = {
    Safe: {
      color: 'text-cyber-green',
      bg: 'bg-cyber-green/10',
      border: 'border-cyber-green/30 shadow-glow-green/10',
      glow: 'shadow-glow-blue',
      icon: <IoShieldCheckmark className="text-cyber-green text-3xl" />,
      label: 'Safe Content'
    },
    Suspicious: {
      color: 'text-cyber-yellow',
      bg: 'bg-cyber-yellow/10',
      border: 'border-cyber-yellow/30 shadow-glow-yellow/10',
      glow: 'shadow-glow-purple',
      icon: <IoWarning className="text-cyber-yellow text-3xl" />,
      label: 'Suspicious Content'
    },
    Dangerous: {
      color: 'text-cyber-red',
      bg: 'bg-cyber-red/10',
      border: 'border-cyber-red/30 shadow-glow-red/20',
      glow: 'shadow-glow-red',
      icon: <IoAlertCircle className="text-cyber-red text-3xl" />,
      label: 'Dangerous / Scam Confirmed'
    }
  };

  const status = config[riskLevel] || config.Suspicious;

  return (
    <div className={`cyber-glass rounded-2xl p-6 border ${status.border} transition-all duration-500`}>
      {/* Title / Score Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between border-b border-cyberdark-border/40 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${status.bg}`}>
            {status.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-100 uppercase tracking-wider">Analysis Result</h3>
            <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
          </div>
        </div>

        {/* Circular Score Meter */}
        <div className="relative flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle 
              cx="48" 
              cy="48" 
              r="40" 
              stroke="#151F32" 
              strokeWidth="8" 
              fill="transparent" 
            />
            <circle 
              cx="48" 
              cy="48" 
              r="40" 
              stroke={riskLevel === 'Safe' ? '#22C55E' : riskLevel === 'Suspicious' ? '#EAB308' : '#EF4444'} 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * scamScore) / 100}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-extrabold text-gray-100">{scamScore}%</span>
            <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Scam Score</span>
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-cyber-blue uppercase tracking-widest mb-2">AI Summary & Explanation</h4>
        <p className="text-sm leading-relaxed text-gray-300 bg-cyberdark-input/30 p-4 rounded-xl border border-cyberdark-border/20">
          {explanation}
        </p>
      </div>

      {/* Red Flags & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Red Flags */}
        <div>
          <h4 className="text-xs font-bold text-cyber-red uppercase tracking-widest mb-3">Red Flags Identified</h4>
          {redFlags && redFlags.length > 0 ? (
            <ul className="space-y-2">
              {redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-cyber-red font-bold shrink-0 mt-0.5">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No typical scam patterns detected.</p>
          )}
        </div>

        {/* Safety Recommendations */}
        <div>
          <h4 className="text-xs font-bold text-cyber-green uppercase tracking-widest mb-3">Safety Recommendations</h4>
          {recommendations && recommendations.length > 0 ? (
            <ul className="space-y-2">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <IoArrowForward className="text-cyber-green shrink-0 mt-1" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">Standard security protocols apply.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScamResultCard;
