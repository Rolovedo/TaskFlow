import React from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = ({ 
  email, 
  error, 
  success, 
  isSubmitting, 
  loginLoading, 
  onEmailChange, 
  onSubmit 
}) => {
  const navigate = useNavigate();

  return (
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
          <h1>¿Olvidaste tu contraseña?</h1>
          <p>Te enviaremos un enlace de recuperación</p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="error-message-new">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Mensaje de éxito */}
        {success && (
          <div className="success-message-new">
            <span>✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={onSubmit} className="login-form-new">
          {/* Email */}
          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onEmailChange}
                placeholder="tu@email.com"
                disabled={isSubmitting || loginLoading || !!success}
                required
              />
              <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || loginLoading || !email || !!success}
          >
            {isSubmitting || loginLoading ? (
              <span className="button-loading-state">
                <span className="spinner-new"></span>
                Procesando...
              </span>
            ) : (
              'Enviar enlace de recuperación'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="form-footer">
          <p>
            <button
              type="button"
              className="signup-link"
              onClick={() => navigate('/login')}
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: 0, 
                color: 'inherit', 
                textDecoration: 'underline', 
                cursor: 'pointer' 
              }}
            >
              ← Volver al inicio de sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;