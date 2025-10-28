import React from 'react';
// import '../../styles/Header.css';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ user, onLogout, logoutLoading }) => {
  const navigate = useNavigate();

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="dashboard-logo">TaskFlow</h1>
        </div>
        <div className="user-menu">
          <span className="welcome-text">
            Bienvenido, {user?.name || 'Usuario'}
          </span>
          <button 
              className="profile-icon-btn"
              onClick={() => navigate('/perfil')}
              title="Ver mi perfil"
            >
              <div className="profile-avatar-small">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>
          <button 
            onClick={onLogout} 
            className="logout-button"
            disabled={logoutLoading}
          >
            {logoutLoading ? 'Cerrando...' : 'Cerrar Sesión'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;