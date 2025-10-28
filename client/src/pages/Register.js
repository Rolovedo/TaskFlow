import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import {
  RegisterForm,
  RegisterLogo
} from '../components/Register';
import '../styles/Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, loginLoading } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting || loginLoading) {
      return;
    }

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setError('');
    setIsSubmitting(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message || 'Error al registrarse');
        setTimeout(() => {
          document.getElementById('email')?.focus();
        }, 100);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setError('Error de conexión. Por favor intenta de nuevo.');
    } 
    finally {
      setIsSubmitting(false);
    }
  };

  if (loginLoading) {
    return <Loader text="Creando cuenta" />;
  }

  return (
    <div className="login-wrapper">
      <RegisterForm
        formData={formData}
        error={error}
        isSubmitting={isSubmitting}
        loginLoading={loginLoading}
        onFormDataChange={handleChange}
        onSubmit={handleSubmit}
      />
      
      <RegisterLogo />
    </div>
  );
};

export default Register;