import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  IoMegaphone, IoArrowUpCircleOutline, IoArrowUpCircle, IoChatbubbleEllipsesOutline, 
  IoSearch, IoFilter, IoClose, IoCloudUploadOutline, IoCalendarOutline 
} from 'react-icons/io5';
import Toast from '../components/Toast.jsx';

const Community = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filter and search states
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  // Report creation states
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '', description: '', website: '', phoneNumber: '', upiId: ''
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  // Active expanded report for commenting modal
  const [activeReport, setActiveReport] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchReports();
  }, [filterType]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/reports?search=${search}&filterType=${filterType}`);
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (error) {
      console.error('Reports fetch failed:', error.message);
      setToast({ type: 'error', message: 'Failed to retrieve community reports.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!newReport.title || !newReport.description) {
      setToast({ type: 'error', message: 'Title and description are required.' });
      return;
    }

    const formData = new FormData();
    formData.append('title', newReport.title);
    formData.append('description', newReport.description);
    formData.append('website', newReport.website);
    formData.append('phoneNumber', newReport.phoneNumber);
    formData.append('upiId', newReport.upiId);
    if (uploadFile) {
      formData.append('image', uploadFile);
    }

    try {
      const res = await axios.post('/api/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setToast({ type: 'success', message: 'Scam reported to the global community cluster!' });
        setNewReport({ title: '', description: '', website: '', phoneNumber: '', upiId: '' });
        setUploadFile(null);
        setUploadPreview(null);
        setShowReportForm(false);
        fetchReports();
      }
    } catch (error) {
      console.error('Report lodging failed:', error.message);
      setToast({ type: 'error', message: error.response?.data?.message || 'Failed to lodge report.' });
    }
  };

  const handleUpvote = async (reportId) => {
    if (!user) {
      setToast({ type: 'warning', message: 'Please log in to upvote scam reports.' });
      return;
    }

    try {
      const res = await axios.put(`/api/reports/${reportId}/upvote`);
      if (res.data.success) {
        setReports(reports.map(item => {
          if (item._id === reportId) {
            return { ...item, upvotes: res.data.upvotes };
          }
          return item;
        }));
        
        if (activeReport?._id === reportId) {
          setActiveReport({ ...activeReport, upvotes: res.data.upvotes });
        }
      }
    } catch (error) {
      console.error('Upvoting failed:', error.message);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setToast({ type: 'warning', message: 'Please log in to comment.' });
      return;
    }
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`/api/reports/${activeReport._id}/comment`, { text: commentText });
      if (res.data.success) {
        // Update active report comments list
        setActiveReport({ ...activeReport, comments: res.data.data });
        setCommentText('');
        // Sync community list
        setReports(reports.map(item => {
          if (item._id === activeReport._id) {
            return { ...item, comments: res.data.data };
          }
          return item;
        }));
      }
    } catch (error) {
      console.error('Add comment error:', error.message);
      setToast({ type: 'error', message: 'Failed to post comment.' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080C14] pt-6 pb-24">
      <div className="absolute inset-0 cyber-grid z-0 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <IoMegaphone className="text-cyber-purple" />
              Community Defense Node
            </h1>
            <p className="text-sm text-gray-400">Share active scams, verify warning signs, and catalog malicious coordinates</p>
          </div>
          {user ? (
            <button 
              onClick={() => setShowReportForm(true)}
              className="py-2.5 px-5 bg-cyber-purple hover:bg-cyber-purple/95 font-bold text-white rounded-xl hover:shadow-glow-purple transition-all text-sm shrink-0"
            >
              Lodge Scam Report
            </button>
          ) : (
            <span className="text-xs text-cyber-purple font-mono bg-cyber-purple/10 border border-cyber-purple/20 px-3 py-2 rounded-lg">
              LOGIN PORT TO POST REPORTS
            </span>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="cyber-glass rounded-xl p-4 border border-cyberdark-border/40 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-1/3">
            <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports or indicators..."
              className="w-full pl-10 pr-4 py-2.5 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-lg border border-cyberdark-border focus:border-cyber-purple focus:outline-none transition-all text-sm font-medium"
            />
          </form>

          <div className="flex w-full md:w-auto items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <IoFilter /> Filters:
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-cyberdark-input border border-cyberdark-border text-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-cyber-purple"
            >
              <option value="">All Categories</option>
              <option value="phone">Phone Scams Only</option>
              <option value="upi">UPI Scams Only</option>
              <option value="website">Website Redirection Scams</option>
            </select>
          </div>
        </div>

        {/* Reports Feed */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 border-4 border-cyber-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => {
              const isUpvoted = user && report.upvotes.includes(user.id);
              
              return (
                <div key={report._id} className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40 flex flex-col justify-between hover:border-cyber-purple/30 transition-all">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <span className="text-xs text-gray-500 font-mono flex items-center gap-1.5">
                        <IoCalendarOutline />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-bold text-cyber-blue font-mono bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-0.5 rounded">
                        @{report.username}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-100 mb-2 truncate">{report.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">{report.description}</p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {report.website && (
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-cyberdark-input border border-cyberdark-border text-cyber-blue rounded">
                          Link: {report.website}
                        </span>
                      )}
                      {report.phoneNumber && (
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-cyberdark-input border border-cyberdark-border text-cyber-purple rounded">
                          Tel: {report.phoneNumber}
                        </span>
                      )}
                      {report.upiId && (
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-cyberdark-input border border-cyberdark-border text-cyber-red rounded">
                          UPI: {report.upiId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons footer */}
                  <div className="border-t border-cyberdark-border/20 pt-4 flex items-center justify-between">
                    <button 
                      onClick={() => handleUpvote(report._id)}
                      className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                        isUpvoted ? 'text-cyber-purple' : 'text-gray-400 hover:text-cyber-purple'
                      }`}
                    >
                      {isUpvoted ? <IoArrowUpCircle className="text-2xl" /> : <IoArrowUpCircleOutline className="text-2xl" />}
                      <span>{report.upvotes.length} Upvotes</span>
                    </button>

                    <button 
                      onClick={() => setActiveReport(report)}
                      className="flex items-center gap-1.5 text-xs font-bold text-cyber-blue bg-cyber-blue/5 border border-cyber-blue/20 px-3.5 py-1.5 rounded-lg hover:bg-cyber-blue/10 transition-all"
                    >
                      <IoChatbubbleEllipsesOutline className="text-base" />
                      Comment ({report.comments.length})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="cyber-glass rounded-2xl p-16 text-center border border-cyberdark-border/40">
            <p className="text-gray-500 italic text-sm">No community reports matching query coordinates.</p>
          </div>
        )}

        {/* Modal: Add scam report */}
        {showReportForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080C14]/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-xl bg-cyberdark-card rounded-2xl border border-cyberdark-border p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <button 
                onClick={() => { setShowReportForm(false); setUploadPreview(null); setUploadFile(null); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              >
                <IoClose />
              </button>
              
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Lodge Community Scam Report</h3>
              
              <form onSubmit={handleCreateReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Scam Title *</label>
                  <input 
                    type="text" required
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    className="w-full px-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-purple focus:outline-none transition-all text-sm font-medium"
                    placeholder="WhatsApp Lottery Phishing SMS"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detailed Description *</label>
                  <textarea 
                    rows="3" required
                    value={newReport.description}
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                    className="w-full px-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-purple focus:outline-none transition-all text-sm font-medium resize-none"
                    placeholder="Explain the tactics, context, links received, and warn others..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Scam Website</label>
                    <input 
                      type="text"
                      value={newReport.website}
                      onChange={(e) => setNewReport({ ...newReport, website: e.target.value })}
                      className="w-full px-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-purple focus:outline-none transition-all text-sm font-medium"
                      placeholder="malicious-gift.gq"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <input 
                      type="text"
                      value={newReport.phoneNumber}
                      onChange={(e) => setNewReport({ ...newReport, phoneNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-purple focus:outline-none transition-all text-sm font-medium"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Scammer UPI ID</label>
                    <input 
                      type="text"
                      value={newReport.upiId}
                      onChange={(e) => setNewReport({ ...newReport, upiId: e.target.value })}
                      className="w-full px-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-purple focus:outline-none transition-all text-sm font-medium"
                      placeholder="cash-back-win@ybl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Screenshot Proof Attachment</label>
                  {!uploadPreview ? (
                    <label className="border border-dashed border-cyberdark-border hover:border-cyber-purple/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-cyberdark-input/10 group">
                      <IoCloudUploadOutline className="text-2xl text-gray-500 group-hover:text-cyber-purple mb-1" />
                      <span className="text-xs font-bold text-gray-300">Browse screenshot image file</span>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative rounded-xl border border-cyberdark-border/60 overflow-hidden max-h-32 flex items-center justify-center bg-black/40">
                      <img src={uploadPreview} alt="Screenshot Preview" className="max-h-32 object-contain" />
                      <button 
                        type="button" 
                        onClick={() => { setUploadFile(null); setUploadPreview(null); }}
                        className="absolute top-2 right-2 p-1 bg-black/80 rounded-full text-cyber-red"
                      >
                        <IoClose />
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-cyber-purple hover:bg-cyber-purple hover:shadow-glow-purple rounded-xl font-bold text-white transition-all"
                >
                  Post Report Packet
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Comments details view */}
        {activeReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080C14]/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-cyberdark-card rounded-2xl border border-cyberdark-border p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <button 
                onClick={() => { setActiveReport(null); setCommentText(''); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              >
                <IoClose />
              </button>

              <div className="mb-6">
                <span className="text-xs text-cyber-blue font-mono font-bold uppercase tracking-widest bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-0.5 rounded mb-2 inline-block">
                  REPORT LOG BY @{activeReport.username}
                </span>
                <h3 className="text-xl font-extrabold text-white mb-2">{activeReport.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed bg-cyberdark-input/20 p-4 rounded-xl border border-cyberdark-border/20 whitespace-pre-wrap">{activeReport.description}</p>
                
                {/* Proof screenshot if attached */}
                {activeReport.screenshotUrl && (
                  <div className="mt-4 rounded-xl border border-cyberdark-border overflow-hidden bg-black/40 flex justify-center max-h-64 p-2">
                    <img src={activeReport.screenshotUrl} alt="Report Proof" className="max-h-60 object-contain" />
                  </div>
                )}
              </div>

              {/* Upvote header */}
              <div className="border-t border-b border-cyberdark-border/40 py-3 flex items-center justify-between mb-6">
                <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Comments Cluster ({activeReport.comments.length})</span>
                <button 
                  onClick={() => handleUpvote(activeReport._id)}
                  className="flex items-center gap-1 text-sm font-bold text-cyber-purple"
                >
                  <IoArrowUpCircle className="text-2xl" />
                  <span>{activeReport.upvotes.length} Upvotes</span>
                </button>
              </div>

              {/* Comments list */}
              <div className="space-y-4 max-h-48 overflow-y-auto mb-6 pr-2">
                {activeReport.comments.length > 0 ? (
                  activeReport.comments.map((comment) => (
                    <div key={comment._id} className="bg-cyberdark-input/30 p-3 rounded-lg border border-cyberdark-border/20 flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-cyber-blue font-bold">@{comment.username}</span>
                        <span className="text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-semibold">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-600 italic text-center py-4">No comments posted yet. Add yours below.</p>
                )}
              </div>

              {/* Add comment form */}
              {user ? (
                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input 
                    type="text"
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-grow px-3 py-2 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-lg border border-cyberdark-border focus:border-cyber-purple focus:outline-none transition-all text-xs font-semibold"
                    placeholder="Enter security notes / warning confirmation..."
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-cyber-purple rounded-lg hover:bg-cyber-purple/95 shrink-0"
                  >
                    Post Note
                  </button>
                </form>
              ) : (
                <p className="text-xs text-cyber-purple text-center italic bg-cyber-purple/5 p-2 rounded border border-cyber-purple/10">Log in to contribute to thread comment logs.</p>
              )}
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
    </div>
  );
};

export default Community;
