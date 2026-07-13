import React, { useState } from 'react';
import axios from 'axios';
import { IoGlobe, IoSparkles, IoTrash, IoLinkOutline } from 'react-icons/io5';
import ScamResultCard from '../components/ScamResultCard.jsx';
import Toast from '../components/Toast.jsx';

const UrlScanner = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setToast({ type: 'warning', message: 'Address input empty.' });
      return;
    }

    // Quick regex validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (!urlPattern.test(url.trim())) {
      setToast({ type: 'error', message: 'Invalid URL format. Check prefix and domain.' });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const res = await axios.post('/api/analyses/url', { url: url.trim() });
      if (res.data.success) {
        setResult(res.data.data.outputData);
        setToast({ type: 'success', message: 'Domain reputation analysis loaded.' });
      }
    } catch (error) {
      console.error('URL scan error:', error.message);
      setToast({ type: 'error', message: error.response?.data?.message || 'URL Scan failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">URL Security Scanner</h1>
        <p className="text-sm text-gray-400">Scrutinize domains for typosquatting, blacklists, and character masquerades</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Node */}
        <div className="lg:col-span-2 space-y-4">
          <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40">
            <h3 className="text-sm font-bold text-cyber-purple uppercase tracking-widest mb-4 flex items-center gap-2">
              <IoGlobe className="text-lg" />
              Website Target Link
            </h3>

            <form onSubmit={handleScan} className="space-y-4">
              <div className="relative">
                <IoLinkOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                <input 
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-purple focus:outline-none transition-all text-sm font-medium"
                  placeholder="https://example-secure-bank-login.tk/auth"
                />
              </div>

              <div className="flex gap-3">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-cyber-purple text-white hover:shadow-glow-purple rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <IoSparkles className="text-lg animate-pulse" />
                      Probe Target URL
                    </>
                  )}
                </button>

                <button 
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="px-4 py-3 bg-cyberdark-input hover:bg-cyberdark-border border border-cyberdark-border/50 text-gray-400 hover:text-cyber-red rounded-xl transition-all"
                  title="Clear scanner"
                >
                  <IoTrash className="text-lg" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Panel */}
        <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40 space-y-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">URL Rep Heuristics</h3>
          <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
            <p>
              The scanner inspects URL patterns against:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong className="text-cyber-purple">TLD Danger:</strong> Cheap domain hosting extensions (.tk, .cf).</li>
              <li><strong className="text-cyber-purple">IP Hosting:</strong> Direct numeric IP locations.</li>
              <li><strong className="text-cyber-purple">Typosquatting:</strong> Characters mimicking famous brands.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Output report card */}
      {loading && (
        <div className="cyber-glass rounded-2xl p-8 border border-cyber-purple/20 animate-pulse flex flex-col items-center justify-center py-16">
          <div className="h-10 w-10 border-4 border-cyber-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-cyber-purple font-mono uppercase tracking-widest">Querying DNS databases...</p>
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

export default UrlScanner;
