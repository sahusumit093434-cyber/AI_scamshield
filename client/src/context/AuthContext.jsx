import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Set global base URL for convenience
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Sync token to Axios defaults on startup
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async (isBackground = false) => {
    try {
      if (!isBackground) {
        setLoading(true);
      }
      const response = await axios.get('/api/auth/profile');
      const data = response.data;
      if (data && (data.success || data.user)) {
        setUser(data.user || data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Profile fetch failed:', error.response?.data?.message || error.message);
      logout();
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const data = response.data;
      if (data && (data.success || data.token)) {
        const tokenVal = data.token;
        const userVal = data.user;
        localStorage.setItem('token', tokenVal);
        setToken(tokenVal);
        setUser(userVal);
        return { success: true };
      }
      return {
        success: false,
        message: data.message || 'Login failed. Please try again.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      const data = response.data;
      if (data && (data.success || data.token)) {
        const tokenVal = data.token;
        const userVal = data.user;
        localStorage.setItem('token', tokenVal);
        setToken(tokenVal);
        setUser(userVal);
        return { success: true };
      }
      return {
        success: false,
        message: data.message || 'Registration failed.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, reloadProfile: fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
