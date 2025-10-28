import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({
  formData,
  error,
  isSubmitting,
  loginLoading,
  onFormDataChange,
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
          <h1>Crear cuenta</h1>
          <p>Regístrate para comenzar</p>
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
          {/* Nombre */}
          <div className="form-field">
            <label htmlFor="name">Nombre completo</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={onFormDataChange}
                placeholder="Tu nombre"
                disabled={isSubmitting || loginLoading}
                required
              />
              <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

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
                placeholder="Mínimo 6 caracteres"
                disabled={isSubmitting || loginLoading}
                required
              />
              <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onFormDataChange}
                placeholder="Repite tu contraseña"
                disabled={isSubmitting || loginLoading}
                required
              />
              <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || loginLoading || !formData.email || !formData.password || !formData.name || !formData.confirmPassword}
          >
            {isSubmitting || loginLoading ? (
              <span className="button-loading-state">
                <span className="spinner-new"></span>
                Procesando...
              </span>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="form-footer">
          <p>
            ¿Ya tienes una cuenta?{' '}
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
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;