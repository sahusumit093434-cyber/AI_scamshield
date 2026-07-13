import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { IoDocumentText, IoSparkles, IoTrash } from 'react-icons/io5';
import ScamResultCard from '../components/ScamResultCard.jsx';
import Toast from '../components/Toast.jsx';

const TextAnalyzer = () => {
  const location = useLocation();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  // Load state if quick-scanned from homepage
  useEffect(() => {
    if (location.state?.initialText) {
      setText(location.state.initialText);
      runAnalysis(location.state.initialText);
      // Clear navigation state history
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const runAnalysis = async (inputText) => {
    const targetText = inputText || text;
    if (!targetText.trim()) {
      setToast({ type: 'warning', message: 'Content buffer empty. Please paste text.' });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const res = await axios.post('/api/analyses/text', { text: targetText });
      if (res.data.success) {
        setResult(res.data.data.outputData);
        setToast({ type: 'success', message: 'Text scan completed. Risk factors isolated.' });
      }
    } catch (error) {
      console.error('Scan error:', error.message);
      setToast({ type: 'error', message: error.response?.data?.message || 'Text analysis failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Text Analyzer Console</h1>
        <p className="text-sm text-gray-400">Scan messages, emails, or SMS scripts for psychological threat patterns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Node */}
        <div className="lg:col-span-2 space-y-4">
          <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40 relative">
            <h3 className="text-sm font-bold text-cyber-blue uppercase tracking-widest mb-4 flex items-center gap-2">
              <IoDocumentText className="text-lg" />
              Content Buffer Input
            </h3>

            <textarea 
              rows="8"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium resize-none leading-relaxed"
              placeholder="Paste the suspicious SMS, WhatsApp chain-mail, or financial notification script here..."
            ></textarea>

            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => runAnalysis()}
                disabled={loading}
                className="flex-1 py-3 bg-cyber-blue text-black hover:shadow-glow-blue rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <IoSparkles className="text-lg animate-pulse" />
                    Execute AI Scrutiny
                  </>
                )}
              </button>

              <button 
                onClick={handleClear}
                disabled={loading}
                className="px-4 py-3 bg-cyberdark-input hover:bg-cyberdark-border border border-cyberdark-border/50 text-gray-400 hover:text-cyber-red rounded-xl transition-all"
                title="Clear input buffer"
              >
                <IoTrash className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Info panel / quick suggestions */}
        <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40 space-y-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Scanner Information</h3>
          <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
            <p>
              ScamShield AI inspects inputs for structural triggers such as:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong className="text-cyber-red">Urgency:</strong> Demanding instant transactions.</li>
              <li><strong className="text-cyber-purple">Prize-baiting:</strong> Claims of lottery / rewards.</li>
              <li><strong className="text-cyber-yellow">Credential harvesting:</strong> Asking for verification.</li>
            </ul>
            <p className="text-xs border-t border-cyberdark-border/30 pt-4 text-gray-500 font-mono">
              ENGINE NODE: GEMINI-1.5-FLASH
            </p>
          </div>
        </div>
      </div>

      {/* Output report card */}
      {loading && (
        <div className="cyber-glass rounded-2xl p-8 border border-cyber-blue/20 animate-pulse flex flex-col items-center justify-center py-16">
          <div className="h-10 w-10 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-cyber-blue font-mono uppercase tracking-widest">Isolating risk payloads...</p>
        </div>
      )}

      {result && <ScamResultCard result={result} />}

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

export default TextAnalyzer;
