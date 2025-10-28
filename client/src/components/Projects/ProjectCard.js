import React from 'react';

const ProjectCard = ({ 
  project, 
  user, 
  onEdit, 
  onDelete, 
  onAssignDevelopers 
}) => {
  return (
    <div className="project-card fancy-card">
      <div className="card-header">
        <h3>{project.name}</h3>
      </div>
      <p className="card-desc">{project.description || 'Sin descripción'}</p>

      <div className="project-developers">
        <strong>Desarrolladores:</strong>{' '}
        {project.usuarios_asignados && project.usuarios_asignados.trim() !== '' ? (
          <span>{project.usuarios_asignados}</span>
        ) : (
          <span>Sin asignar</span>
        )}
      </div>

      <small>📆 {new Date(project.created_at).toLocaleDateString()}</small>

      {user?.role_id === 1 && (
        <div className="card-actions">
          <button
            className="edit-btn"
            onClick={() => onEdit(project)}
          >
            ✏️ Editar
          </button>
          <button
            className="delete-btn"
            onClick={() => onDelete(project.id)}
          >
            🗑️ Eliminar
          </button>
          <button
            className="assign-btn"
            onClick={() => onAssignDevelopers(project)}
          >
            👥 Asignar developer
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;