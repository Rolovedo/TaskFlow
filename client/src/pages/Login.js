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
      {/* Lado izquierdo - Formulario */}
      <div className="login-form-side">
        <div className="login-form-container">
          {/* Logo pequeño arriba */}
          <div className="brand-logo">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <span className="brand-name">TaskFloow</span>
          </div>

          {/* Título */}
          <div className="login-header-new">
            <h1>Bienvenido de nuevo</h1>
            <p>Inicia sesión en tu cuenta</p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="error-message-new">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="login-form-new">
            {/* Email */}
            <div className="form-field">
              <label htmlFor="email">Correo electrónico</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  disabled={isSubmitting || loginLoading}
                  required
                />
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Contraseña */}
            <div className="form-field">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="········"
                  disabled={isSubmitting || loginLoading}
                  required
                />
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Remember me y Forgot password */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Recordarme</span>
              </label>
              <button
                type="button"
                className="forgot-password"
                onClick={() => {
                  // TODO: Implement forgot password logic or navigation
                }}
                style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || loginLoading || !formData.email || !formData.password}
            >
              {isSubmitting || loginLoading ? (
                <span className="button-loading-state">
                  <span className="spinner-new"></span>
                  Procesando...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="form-footer">
            <p>
              ¿No tienes una cuenta?{' '}
              <button
                type="button"
                className="signup-link"
                onClick={() => navigate('/signup')}
                style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Regístrate
              </button>
            </p>
          </div>

          {/* Credenciales de prueba */}
          <div className="credentials-box">
            <p className="credentials-title">Credenciales de prueba:</p>
            <div className="credentials-list">
              <p><strong>Admin:</strong> admin@taskflow.com | admin123</p>
              <p><strong>Developer:</strong> dev@taskflow.com | dev123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Logo */}
      <div className="login-logo-side">
        <div className="logo-content">
          {/* Logo principal con animación */}
          <div className="logo-animation">
            <div className="logo-circles">
              <svg width="280" height="280" viewBox="0 0 280 280">
                <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" />
                <circle cx="140" cy="140" r="100" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" />
                <circle cx="140" cy="140" r="80" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" />
              </svg>
            </div>
            
            <svg width="280" height="280" viewBox="0 0 280 280" className="logo-shape">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              
              <path
                d="M140,40 Q160,70 180,80 Q190,90 180,110 Q170,130 180,150 Q190,170 170,180 Q150,190 140,210 Q130,190 110,180 Q90,170 100,150 Q110,130 100,110 Q90,90 100,80 Q120,70 140,40 Z"
                fill="url(#logoGradient)"
                opacity="0.2"
              />
              <path
                d="M140,60 Q155,80 170,85 Q178,92 170,105 Q162,118 170,135 Q178,152 162,160 Q146,168 140,185 Q134,168 118,160 Q102,152 110,135 Q118,118 110,105 Q102,92 110,85 Q125,80 140,60 Z"
                fill="url(#logoGradient)"
                opacity="0.4"
              />
              <path
                d="M140,80 Q150,95 160,98 Q166,103 160,113 Q154,123 160,133 Q166,143 154,148 Q142,153 140,165 Q138,153 126,148 Q114,143 120,133 Q126,123 120,113 Q114,103 120,98 Q130,95 140,80 Z"
                fill="url(#logoGradient)"
                opacity="0.7"
              />
              
              <circle cx="140" cy="140" r="50" fill="#1E3A8A" />
              <text x="140" y="165" textAnchor="middle" fill="white" fontSize="60" fontWeight="bold" fontFamily="Arial, sans-serif">T</text>
            </svg>
          </div>

          {/* Texto del logo */}
          <div className="logo-text">
            <h1 className="logo-title">TASKFLOOW</h1>
            <div className="logo-subtitle">
              <p>TABLERO DE TAREAS</p>
              <p>ESTILO KANBAN</p>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="logo-decorations">
            <div className="decoration-bar bar-1"></div>
            <div className="decoration-bar bar-2"></div>
            <div className="decoration-bar bar-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;