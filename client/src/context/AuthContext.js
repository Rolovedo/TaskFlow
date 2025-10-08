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
      const [response] = await Promise.all([
        api.post('/users/login', { email, password }),
        new Promise(resolve => setTimeout(resolve, 2000))
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

  const register = async (userData) => {
    setLoginLoading(true);
    
    try {
      const [response] = await Promise.all([
        api.post('/users/register', userData),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      let errorMessage = 'Error al registrarse';
      
      if (error.response?.status === 409) {
        errorMessage = 'Este email ya está registrado.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.error || 'Datos inválidos. Verifica la información.';
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

const forgotPassword = async (email) => {
  setLoginLoading(true);
  
  try {
    // Verificar si el email existe
    await api.post('/users/verify-email', { email });
    
    // Si llegamos aquí, el email existe
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return { 
      success: true,
      message: '✅ Se ha enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada.'
    };
    
  } catch (error) {
    console.error('Error en forgot password:', error);
    
    // Si el correo no existe
    if (error.response?.status === 404) {
      return { 
        success: false,
        message: 'No existe una cuenta asociada a este correo electrónico.'
      };
    }
    
    // Email inválido
    if (error.response?.status === 400) {
      return { 
        success: false,
        message: 'Por favor ingresa un correo electrónico válido.'
      };
    }
    
    // Error de servidor
    if (error.response?.status === 500) {
      return { 
        success: false,
        message: 'Error del servidor. Intenta más tarde.'
      };
    }
    
    // Error de conexión
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return { 
        success: false,
        message: 'Error de conexión. Verifica tu internet.'
      };
    }
    
    return { 
      success: false,
      message: error.response?.data?.error || 'Error al procesar la solicitud.'
    };
  } finally {
    setLoginLoading(false);
  }
};

  const logout = async () => {
    setLogoutLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
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
    register,
    forgotPassword,
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