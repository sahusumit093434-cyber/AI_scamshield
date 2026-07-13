import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';

// Pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Features from './pages/Features.jsx';
import Pricing from './pages/Pricing.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TextAnalyzer from './pages/TextAnalyzer.jsx';
import UrlScanner from './pages/UrlScanner.jsx';
import ScreenshotScanner from './pages/ScreenshotScanner.jsx';
import QrScanner from './pages/QrScanner.jsx';
import History from './pages/History.jsx';
import Community from './pages/Community.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFound from './pages/NotFound.jsx';

// Helper component for standard pages container
const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
};

// Helper component for application/dashboard workspace container
const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 pt-16 flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-grow p-4 md:p-8 bg-[#080C14] max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Protected Route Guard
const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080C14]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-cyber-blue font-mono uppercase tracking-widest">Verifying Connection Node...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminRequired && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Static Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/features" element={<PublicLayout><Features /></PublicLayout>} />
          <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

          {/* Semi-Public Forums */}
          <Route path="/community" element={<PublicLayout><Community /></PublicLayout>} />

          {/* Protected Application Scanner Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/analyzer/text" element={<ProtectedRoute><AppLayout><TextAnalyzer /></AppLayout></ProtectedRoute>} />
          <Route path="/analyzer/url" element={<ProtectedRoute><AppLayout><UrlScanner /></AppLayout></ProtectedRoute>} />
          <Route path="/analyzer/screenshot" element={<ProtectedRoute><AppLayout><ScreenshotScanner /></AppLayout></ProtectedRoute>} />
          <Route path="/analyzer/qr" element={<ProtectedRoute><AppLayout><QrScanner /></AppLayout></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><AppLayout><History /></AppLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminRequired={true}><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />

          {/* 404 Route */}
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
