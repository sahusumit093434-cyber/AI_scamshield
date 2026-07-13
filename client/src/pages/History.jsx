import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoSearch, IoFilter, IoTrash, IoEye, IoChevronBack, IoChevronForward, IoCloseCircle } from 'react-icons/io5';
import ScamResultCard from '../components/ScamResultCard.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import Toast from '../components/Toast.jsx';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Query parameters state
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selected item modal for detailed view
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [page, type]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/analyses/history?page=${page}&type=${type}&search=${search}&limit=8`);
      if (res.data.success) {
        setHistory(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error('History fetch failed:', error.message);
      setToast({ type: 'error', message: 'Failed to retrieve analysis history.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to purge this scan record from your terminal history?')) return;
    
    try {
      const res = await axios.delete(`/api/analyses/${id}`);
      if (res.data.success) {
        setToast({ type: 'success', message: 'Scan record purged.' });
        // Refresh local items
        setHistory(history.filter(item => item._id !== id));
        if (selectedScan?._id === id) {
          setSelectedScan(null);
        }
      }
    } catch (error) {
      console.error('Delete scan log error:', error.message);
      setToast({ type: 'error', message: 'Failed to delete record.' });
    }
  };

  const riskBadgeStyles = {
    Safe: 'text-cyber-green bg-cyber-green/10 border-cyber-green/20',
    Suspicious: 'text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/20',
    Dangerous: 'text-cyber-red bg-cyber-red/10 border-cyber-red/20',
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Historical Scans Log</h1>
        <p className="text-sm text-gray-400">Review, inspect, or clear records of previous threat assessments</p>
      </div>

      {/* Query Filters */}
      <div className="cyber-glass rounded-xl p-4 border border-cyberdark-border/40">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search content or explanation..."
              className="w-full pl-10 pr-4 py-2.5 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-lg border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="flex w-full md:w-auto items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <IoFilter />
              Filter:
            </div>
            
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); setPage(1); }}
              className="bg-cyberdark-input border border-cyberdark-border text-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-cyber-blue"
            >
              <option value="">All Mediums</option>
              <option value="text">Text Analyses</option>
              <option value="url">URL Scans</option>
              <option value="screenshot">Screenshot OCRs</option>
              <option value="qr">QR Redirections</option>
            </select>

            <button 
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-cyber-blue/80 hover:bg-cyber-blue rounded-lg transition-all"
            >
              Query
            </button>
          </div>
        </form>
      </div>

      {/* Main List */}
      {loading ? (
        <SkeletonLoader type="list" count={5} />
      ) : history.length > 0 ? (
        <div className="cyber-glass rounded-2xl border border-cyberdark-border/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cyberdark-input/50 text-[10px] uppercase font-bold tracking-widest text-gray-400 border-b border-cyberdark-border/60">
                  <th className="py-4 px-6">Medium</th>
                  <th className="py-4 px-6">Scanned Input Context</th>
                  <th className="py-4 px-6 text-center">Score</th>
                  <th className="py-4 px-6">Risk Rating</th>
                  <th className="py-4 px-6">Date Scanned</th>
                  <th className="py-4 px-6 text-right">Terminal Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyberdark-border/20">
                {history.map((log) => (
                  <tr key={log._id} className="hover:bg-cyberdark-input/20 transition-all">
                    <td className="py-4 px-6 shrink-0">
                      <span className="text-xs uppercase px-2 py-0.5 font-mono font-bold bg-cyberdark-input border border-cyberdark-border/60 text-gray-300 rounded">
                        {log.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs md:max-w-md">
                      <p className="text-sm font-medium text-gray-300 truncate">
                        {log.inputData}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-center text-sm font-bold font-mono">
                      {log.outputData.scamScore}%
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${riskBadgeStyles[log.outputData.riskLevel] || riskBadgeStyles.Suspicious}`}>
                        {log.outputData.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedScan(log.outputData)}
                          className="p-1.5 bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/20 rounded-lg transition-colors"
                          title="Inspect results map"
                        >
                          <IoEye />
                        </button>
                        <button 
                          onClick={() => handleDelete(log._id)}
                          className="p-1.5 bg-cyber-red/10 hover:bg-cyber-red/20 text-cyber-red border border-cyber-red/20 rounded-lg transition-colors"
                          title="Purge log record"
                        >
                          <IoTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-cyberdark-border/40 p-4 bg-cyberdark-input/10">
              <span className="text-xs font-semibold text-gray-400">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 border border-cyberdark-border rounded-lg text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                >
                  <IoChevronBack />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 border border-cyberdark-border rounded-lg text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                >
                  <IoChevronForward />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="cyber-glass rounded-2xl p-12 text-center border border-cyberdark-border/40">
          <p className="text-gray-500 italic text-sm">No historical log coordinates recorded. Run scans to catalog.</p>
        </div>
      )}

      {/* Selected detailed result card overlay modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080C14]/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-cyberdark-card rounded-2xl border border-cyberdark-border p-6 shadow-2xl">
            <button 
              onClick={() => setSelectedScan(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              <IoCloseCircle />
            </button>
            <ScamResultCard result={selectedScan} />
          </div>
        </div>
      )}

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

export default History;
