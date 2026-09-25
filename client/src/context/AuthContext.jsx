import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser(res.data);
          }
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await authService.login(credentials);
      if (res.success) {
        setUser(res.data);
        toast.success(`Welcome back, ${res.data.name}! 👋`);
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.success) {
        setUser(res.data);
        toast.success(`Account created successfully! Welcome ${res.data.name} 🎉`);
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUserLocal = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
