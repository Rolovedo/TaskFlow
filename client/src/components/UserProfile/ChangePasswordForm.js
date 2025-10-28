import React from 'react';

const ChangePasswordForm = ({ 
  show, 
  newPassword, 
  confirmPassword, 
  onPasswordChange, 
  onConfirmPasswordChange, 
  onSubmit, 
  onCancel 
}) => {
  if (!show) return null;

  return (
    <div className="password-change-card">
      <h3>Cambiar Contraseña</h3>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña (mínimo 6 caracteres)"
          value={newPassword}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="password-input"
          required
        />
        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          className="password-input"
          required
        />
        <div className="password-form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-save">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;