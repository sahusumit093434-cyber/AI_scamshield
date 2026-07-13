import React, { useState } from 'react';
import axios from 'axios';
import { IoQrCode, IoSparkles, IoTrash, IoCloudUploadOutline, IoKeypadOutline } from 'react-icons/io5';
import ScamResultCard from '../components/ScamResultCard.jsx';
import Toast from '../components/Toast.jsx';

const QrScanner = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [qrText, setQrText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setQrText('');
    setResult(null);
  };

  const handleScanImage = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      setResult(null);

      const res = await axios.post('/api/analyses/qr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setResult(res.data.data.outputData);
        setToast({ type: 'success', message: 'QR Image decoded and scanned.' });
      }
    } catch (error) {
      console.error('QR upload scan error:', error.message);
      setToast({ type: 'error', message: error.response?.data?.message || 'QR Scan failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleScanText = async (e) => {
    e.preventDefault();
    if (!qrText.trim()) return;

    try {
      setLoading(true);
      setResult(null);

      const res = await axios.post('/api/analyses/qr', { qrData: qrText.trim() });
      
      if (res.data.success) {
        setResult(res.data.data.outputData);
        setToast({ type: 'success', message: 'QR payload analyzed.' });
      }
    } catch (error) {
      console.error('QR text scan error:', error.message);
      setToast({ type: 'error', message: error.response?.data?.message || 'QR payload analysis failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setQrText('');
    setResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">QR Code Safety Guard</h1>
        <p className="text-sm text-gray-400">Resolve redirected pathways behind QR codes before landing on spoofed payment portals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scan controllers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Method 1: File upload */}
          <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40">
            <h3 className="text-sm font-bold text-cyber-yellow uppercase tracking-widest mb-4 flex items-center gap-2">
              <IoQrCode className="text-lg" />
              Method A: Decrypt QR Image File
            </h3>

            {!preview ? (
              <label className="border-2 border-dashed border-cyberdark-border hover:border-cyber-yellow/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-cyberdark-input/10 group min-h-48">
                <IoCloudUploadOutline className="text-4xl text-gray-500 group-hover:text-cyber-yellow mb-2 transition-colors" />
                <span className="text-sm font-bold text-gray-300">Upload QR image file</span>
                <span className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (Max 5MB)</span>
                <input 
                  type="file"
                  required
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl border border-cyberdark-border/60 overflow-hidden max-h-48 flex items-center justify-center bg-black/40">
                  <img src={preview} alt="QR Preview" className="max-h-48 object-contain" />
                  {loading && (
                    <div className="absolute inset-x-0 w-full cyber-scanner-line pointer-events-none"></div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleScanImage}
                    disabled={loading}
                    className="flex-1 py-3 bg-cyber-yellow text-black hover:shadow-glow-yellow rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <IoSparkles className="text-lg" />
                        Decrypt & Scan Code
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleClear}
                    disabled={loading}
                    className="px-4 py-3 bg-cyberdark-input hover:bg-cyberdark-border border border-cyberdark-border/50 text-gray-400 hover:text-cyber-red rounded-xl transition-all"
                  >
                    <IoTrash className="text-lg" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Method 2: Raw data input */}
          <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40">
            <h3 className="text-sm font-bold text-cyber-yellow uppercase tracking-widest mb-4 flex items-center gap-2">
              <IoKeypadOutline className="text-lg" />
              Method B: Scan Pre-decoded QR Payload
            </h3>

            <form onSubmit={handleScanText} className="space-y-4">
              <input 
                type="text"
                required
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                className="w-full px-4 py-3 bg-cyberdark-input text-gray-100 placeholder-gray-500 rounded-xl border border-cyberdark-border focus:border-cyber-yellow focus:outline-none transition-all text-sm font-medium"
                placeholder="Paste underlying link or raw QR text (e.g. upi://pay?pa=scammer@paytm&pn=Refund)"
              />
              <button 
                type="submit"
                disabled={loading || !qrText.trim()}
                className="w-full py-3 bg-cyber-yellow text-black hover:shadow-glow-yellow rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <IoSparkles className="text-lg" />
                    Verify Payload Safety
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info box */}
        <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40 space-y-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">QR Threat Intelligence</h3>
          <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
            <p>
              Scammers deploy malicious QR codes in public places or chats. Scanning them redirects to spoofed login consoles or automatically triggers unauthorized UPI transfers.
            </p>
            <p>
              ScamShield AI breaks down target links before your browser executes them, screening for redirection and protocol risks.
            </p>
          </div>
        </div>
      </div>

      {/* Output report card */}
      {loading && (
        <div className="cyber-glass rounded-2xl p-8 border border-cyber-yellow/20 animate-pulse flex flex-col items-center justify-center py-16">
          <div className="h-10 w-10 border-4 border-cyber-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-cyber-yellow font-mono uppercase tracking-widest">Resolving QR payload targets...</p>
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

export default QrScanner;
