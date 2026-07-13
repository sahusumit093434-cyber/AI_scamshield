import React, { useState } from 'react';
import { IoMailOutline, IoCallOutline, IoMapOutline, IoSend } from 'react-icons/io5';
import Toast from '../components/Toast.jsx';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setToast({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    // Simulate submission
    setToast({ type: 'success', message: 'Secure message dispatched. Ticket logged in node queue.' });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="relative min-h-screen bg-[#080C14] pt-12 pb-24">
      <div className="absolute inset-0 cyber-grid z-0 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-wide">
            Contact <span className="text-cyber-blue">Support Node</span>
          </h1>
          <p className="text-gray-400">
            Have questions about integrations, enterprise setups, or need account assistance? Get in touch with our security officers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-6">
            <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40 flex items-center gap-4">
              <div className="p-3 bg-cyber-blue/10 rounded-lg text-cyber-blue shrink-0">
                <IoMailOutline className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Email</h4>
                <p className="text-sm font-semibold text-gray-200">security@scamshield.ai</p>
              </div>
            </div>

            <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40 flex items-center gap-4">
              <div className="p-3 bg-cyber-purple/10 rounded-lg text-cyber-purple shrink-0">
                <IoCallOutline className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Hotline</h4>
                <p className="text-sm font-semibold text-gray-200">+1 (555) 019-2834</p>
              </div>
            </div>

            <div className="cyber-glass rounded-xl p-6 border border-cyberdark-border/40 flex items-center gap-4">
              <div className="p-3 bg-cyber-red/10 rounded-lg text-cyber-red shrink-0">
                <IoMapOutline className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">HQ Command</h4>
                <p className="text-sm font-semibold text-gray-200">100 Cyber Shield Dr, San Jose, CA</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 cyber-glass rounded-2xl p-8 border border-cyberdark-border/40">
            <h3 className="text-xl font-bold text-white mb-6">Dispatch Encrypted Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium"
                    placeholder="Agent Smith"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Email *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium"
                    placeholder="smith@agency.org"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium"
                  placeholder="Enterprise License Query"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message *</label>
                <textarea 
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-blue focus:outline-none transition-all text-sm font-medium resize-none"
                  placeholder="Type your message details here..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-cyber-blue/80 hover:bg-cyber-blue hover:shadow-glow-blue border border-cyber-blue/40 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                <IoSend />
                Send Secure Packet
              </button>
            </form>
          </div>
        </div>
      </div>

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

export default Contact;
