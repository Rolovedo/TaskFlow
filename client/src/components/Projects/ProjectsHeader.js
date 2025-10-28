import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectsHeader = ({ user, onLogout, onBackToDashboard, logoutLoading }) => {
  const navigate = useNavigate();

  return (
    <header className="projects-header">
      <div className="header-content">
        <div className="header-left">
          <button onClick={onBackToDashboard} className="back-button">
            ← Volver
          </button>
          <h1 className="projects-title">Mis Proyectos</h1>
        </div>
        <div className="user-menu">
          <span className="welcome-text">{user?.name || 'Usuario'}</span>
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
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProjectsHeader;