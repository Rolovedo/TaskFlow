import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import {
  ForgotPasswordForm,
  LogoSide
} from '../components/ForgotPassword';
import '../styles/Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { forgotPassword, loginLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    
    if (error) {
      setError('');
    }
    if (success) {
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting || loginLoading) {
      return;
    }
    
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.message || 'Error al procesar la solicitud');
        setTimeout(() => {
          document.getElementById('email')?.focus();
        }, 100);
      }
    } catch (error) {
      console.error('Error en forgot password:', error);
      setError('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loginLoading) {
    return <Loader text="Procesando solicitud" />;
  }

  return (
    <div className="login-wrapper">
      <ForgotPasswordForm
        email={email}
        error={error}
        success={success}
        isSubmitting={isSubmitting}
        loginLoading={loginLoading}
        onEmailChange={handleChange}
        onSubmit={handleSubmit}
      />
      
      <LogoSide />
    </div>
  );
};

export default ForgotPassword;