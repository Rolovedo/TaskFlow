import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoginLoading(true);
    
    try {
      // Simular un tiempo mínimo para mostrar el loader
      const [response] = await Promise.all([
        api.post('/users/login', { email, password }),
        new Promise(resolve => setTimeout(resolve, 2000)) // 2 segundos mínimo
      ]);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.response?.status === 401) {
        errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error del servidor. Intenta más tarde.';
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return { 
        success: false, 
        message: errorMessage 
      };
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    setLogoutLoading(true);
    
    try {
      // Simular tiempo de procesamiento para mostrar el loader
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 segundos
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      // Incluso si hay error, limpiamos los datos locales
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return { success: true };
    } finally {
      setLogoutLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    loginLoading,
    logoutLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};