import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, loginLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página
    e.stopPropagation(); // Detener propagación del evento
    
    // Evitar múltiples envíos
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
        // Enfocar el campo email para que el usuario pueda corregir
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

  // Mostrar el loader durante el proceso de login
  if (loginLoading) {
    return <Loader text="Iniciando Sesión" />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>TaskFlow</h1>
          <p>Iniciar Sesión</p>
        </div>
        
        <form 
          onSubmit={handleSubmit} 
          className="login-form"
          autoComplete="off"
          noValidate
        >
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Ingresa tu email"
              autoComplete="off"
              data-form-type="other"
              className={error ? 'input-error' : ''}
              disabled={isSubmitting || loginLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Ingresa tu contraseña"
              autoComplete="new-password"
              data-form-type="other"
              className={error ? 'input-error' : ''}
              disabled={isSubmitting || loginLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isSubmitting || loginLoading || !formData.email || !formData.password}
          >
            {isSubmitting || loginLoading ? (
              <span className="button-loading">
                <span className="spinner"></span>
                Procesando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Credenciales de prueba:</p>
          <small>
            <strong>Admin:</strong> admin@taskflow.com | admin123<br/>
            <strong>Developer:</strong> dev@taskflow.com | dev123
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;