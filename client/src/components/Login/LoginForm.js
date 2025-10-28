import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({
  formData,
  error,
  isSubmitting,
  loginLoading,
  rememberMe,
  onFormDataChange,
  onSubmit,
  onRememberMeChange
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
        <form onSubmit={onSubmit} className="login-form-new">
          {/* Email */}
          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onFormDataChange}
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
                onChange={onFormDataChange}
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
                onChange={onRememberMeChange}
              />
              <span>Recordarme</span>
            </label>
            <button
              type="button"
              className="forgot-password"
              onClick={() => navigate('/forgot-password')}
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: 0, 
                color: 'inherit', 
                textDecoration: 'underline', 
                cursor: 'pointer' 
              }}
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
              onClick={() => navigate('/Register')}
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: 0, 
                color: 'inherit', 
                textDecoration: 'underline', 
                cursor: 'pointer' 
              }}
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
  );
};

export default LoginForm;