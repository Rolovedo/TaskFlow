import React from 'react';

const TasksHeader = ({ project, user, onBackToProjects, onLogout, onCreateTask }) => {
  return (
    <header className="tasks-header">
      <div className="header-content">
        <div className="header-left">
          <button onClick={onBackToProjects} className="tasks-back-button">
            <div className="tasks-button-box">
              <span className="tasks-button-elem">
                <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                </svg>
              </span>
              <span className="tasks-button-elem">
                <svg viewBox="0 0 46 40">
                  <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                </svg>
              </span>
            </div>
          </button>
          
          <div className="project-info">
            <h1 className="project-title">{project?.name || 'Proyecto'}</h1>
            <span className="project-subtitle">Tablero de Tareas</span>
          </div>
        </div>

        <div className="header-right">
          <button className="create-task-btn" onClick={onCreateTask}>
            ➕ Nueva Tarea
          </button>
          
          <div className="user-menu">
            <span className="welcome-text">{user?.name || 'Usuario'}</span>
            <button onClick={onLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TasksHeader;