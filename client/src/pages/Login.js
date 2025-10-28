import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import {
  LoginForm,
  LoginLogo
} from '../components/Login';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, loginLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (error) {
      setError('');
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting || loginLoading) {
      return;
    }
    
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Error al iniciar sesión');
        setTimeout(() => {
          document.getElementById('email')?.focus();
        }, 100);
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error de conexión. Por favor intenta de nuevo.');
    } 
    finally {
      setIsSubmitting(false);
    }
  };

  if (loginLoading) {
    return <Loader text="Iniciando Sesión" />;
  }

  return (
    <div className="login-wrapper">
      <LoginForm
        formData={formData}
        error={error}
        isSubmitting={isSubmitting}
        loginLoading={loginLoading}
        rememberMe={rememberMe}
        onFormDataChange={handleChange}
        onSubmit={handleSubmit}
        onRememberMeChange={handleRememberMeChange}
      />
      
      <LoginLogo />
    </div>
  );
};

export default Login;