import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectsHeader = ({ user, onLogout, onBackToDashboard, logoutLoading }) => {
  const navigate = useNavigate();

  return (
    <header className="projects-header">
      <div className="header-content">
        <div className="header-left">

          <button onClick={onBackToDashboard} className="button">
            <div className="button-box">
              <span className="button-elem">
                <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
                  ></path>
                </svg>
              </span>
              <span class="button-elem">
                <svg viewBox="0 0 46 40">
                  <path
                    d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
                  ></path>
                </svg>
              </span>
            </div>
          </button>


          <h1 className="projects-title">{user?.role_id === 1
                ? 'Todos los Proyectos'
                : 'Mis Proyectos'}</h1>
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