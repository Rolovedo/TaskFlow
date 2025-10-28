import React from 'react';

const EmptyState = ({ user, onCreateProject }) => {
  return (
    <div className="projects-placeholder">
      <div className="empty-state">
        <div className="empty-icon">📂</div>
        <h3>No hay proyectos disponibles</h3>
        <p>
          {user?.role_id === 1
            ? 'Crea tu primer proyecto para comenzar.'
            : 'Aún no tienes proyectos asignados.'}
        </p>
        {user?.role_id === 1 && (
          <button
            className="create-first-project-btn"
            onClick={onCreateProject}
          >
            Crear Proyecto
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;