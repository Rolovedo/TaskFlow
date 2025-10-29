import React from 'react';

const WelcomeSection = ({ user, onNavigateToProjects }) => {
  return (
    <div className="welcome-section">
      <div className="welcome-header">
        <h2 className="welcome-title">¡Hola, {user?.name}!</h2>
        <p className="user-info">
          <span className="user-role-badge">
            {user?.role_id === 1 ? 'Administrador' : 'Desarrollador'}
          </span>
          <span className="user-email">{user?.email}</span>
        </p>
      </div>
      
      <div className="dashboard-content">
        <div className="content-header">
          <h3>Panel de Control</h3>
          <p className="content-subtitle">
            {user?.role_id === 1 
              ? 'Administra todos los aspectos del sistema desde aquí'
              : 'Accede a tus proyectos y tareas asignadas'
            }
          </p>
        </div>
        
        <div className="quick-actions">
          <button 
            onClick={onNavigateToProjects}
            className="primary-action-btn"
          >
            <span className="btn-icon"></span>
            Ver Proyectos
          </button>
          
          {user?.role_id === 1 && (
            <>
              <button className="secondary-action-btn">
                <span className="btn-icon"></span>
                Gestionar Usuarios
              </button>
              <button className="secondary-action-btn">
                <span className="btn-icon"></span>
                Reportes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;