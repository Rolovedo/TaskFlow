import React from 'react';

const ProfileHeader = ({ onToggleChangePassword, onLogout }) => {
  return (
    <header className="profile-top-bar">
      <h1>Perfil de Usuario</h1>
      <div className="top-bar-actions">
        <button 
          className="change-password-link" 
          onClick={onToggleChangePassword}
        >
          Cambiar Contraseña
        </button>
        <button className="logout-btn-profile" onClick={onLogout}>
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default ProfileHeader;