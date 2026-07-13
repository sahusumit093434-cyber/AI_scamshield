import React, { useState } from 'react';
import axios from 'axios';
import { IoImage, IoSparkles, IoTrash, IoCloudUploadOutline } from 'react-icons/io5';
import ScamResultCard from '../components/ScamResultCard.jsx';
import Toast from '../components/Toast.jsx';

const ScreenshotScanner = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setToast({ type: 'error', message: 'Only image files (JPEG, PNG, WebP) are supported.' });
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    // Reset output
    setOcrText('');
    setResult(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setToast({ type: 'warning', message: 'Please drop or browse an image file.' });
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      setOcrText('');
      setResult(null);
      
      const res = await axios.post('/api/analyses/screenshot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setOcrText(res.data.extractedText);
        setResult(res.data.data.outputData);
        setToast({ type: 'success', message: 'Screenshot scan complete. Text payload analyzed.' });
      }
    } catch (error) {
      console.error('Screenshot scan failed:', error.message);
      setToast({ type: 'error', message: error.response?.data?.message || 'Screenshot analysis failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setOcrText('');
    setResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Screenshot Scanner</h1>
        <p className="text-sm text-gray-400">Extract chat transcripts, payment slips, or threat emails via OCR and analyze risk levels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Node */}
        <div className="lg:col-span-2 space-y-4">
          <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40">
            <h3 className="text-sm font-bold text-cyber-red uppercase tracking-widest mb-4 flex items-center gap-2">
              <IoImage className="text-lg" />
              Screenshot File Upload
            </h3>

            {!preview ? (
              <label className="border-2 border-dashed border-cyberdark-border hover:border-cyber-red/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-cyberdark-input/10 group min-h-64">
                <IoCloudUploadOutline className="text-4xl text-gray-500 group-hover:text-cyber-red mb-3 transition-colors" />
                <span className="text-sm font-bold text-gray-300">Click or Drag & Drop image here</span>
                <span className="text-xs text-gray-500 mt-1">Supports PNG, JPG, JPEG, WebP (Max 5MB)</span>
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
                {/* Image Preview Container */}
                <div className="relative rounded-xl border border-cyberdark-border/60 overflow-hidden max-h-80 flex items-center justify-center bg-black/40">
                  <img src={preview} alt="Upload Preview" className="max-h-80 object-contain" />
                  
                  {/* Scanner Glowing Line overlay during OCR scan */}
                  {loading && (
                    <div className="absolute inset-x-0 w-full cyber-scanner-line pointer-events-none"></div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex-1 py-3 bg-cyber-red text-white hover:shadow-glow-red rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <IoSparkles className="text-lg animate-pulse" />
                        Run OCR & AI Analysis
                      </>
                    )}
                  </button>

                  <button 
                    onClick={handleClear}
                    disabled={loading}
                    className="px-4 py-3 bg-cyberdark-input hover:bg-cyberdark-border border border-cyberdark-border/50 text-gray-400 hover:text-cyber-red rounded-xl transition-all"
                    title="Clear file"
                  >
                    <IoTrash className="text-lg" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* OCR Result Box */}
        <div className="cyber-glass rounded-2xl p-6 border border-cyberdark-border/40 space-y-4 flex flex-col">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">OCR Decrypted Text</h3>
          <div className="flex-1 bg-cyberdark-input/50 p-4 rounded-xl border border-cyberdark-border/20 text-xs font-mono text-gray-400 overflow-y-auto max-h-64 leading-relaxed whitespace-pre-wrap">
            {loading ? (
              <div className="flex flex-col gap-2">
                <span className="h-3 w-1/2 bg-cyberdark-border rounded animate-pulse"></span>
                <span className="h-3 w-full bg-cyberdark-border rounded animate-pulse"></span>
                <span className="h-3 w-3/4 bg-cyberdark-border rounded animate-pulse"></span>
              </div>
            ) : ocrText ? (
              ocrText
            ) : (
              <span className="italic text-gray-600">Extracted text will render here once scanning node is complete.</span>
            )}
          </div>
        </div>
      </div>

      {/* Output report card */}
      {loading && (
        <div className="cyber-glass rounded-2xl p-8 border border-cyber-red/20 animate-pulse flex flex-col items-center justify-center py-16">
          <div className="h-10 w-10 border-4 border-cyber-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-cyber-red font-mono uppercase tracking-widest">Extracting screen characters...</p>
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

export default ScreenshotScanner;
