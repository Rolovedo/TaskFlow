import React from 'react';

const ProjectCard = ({ 
  project, 
  user, 
  onEdit, 
  onDelete, 
  onAssignDevelopers 
}) => {
  const getDevelopersDisplay = () => {
    if (!project.usuarios_asignados || project.usuarios_asignados.trim() === '') {
      return <span className="no-developers">Sin asignar</span>;
    }
    
    const developers = project.usuarios_asignados.split(',').map(name => name.trim());
    
    return (
      <div className="developers-list">
        {developers.slice(0, 3).map((dev, index) => (
          <div key={index} className="developer-avatar" title={dev}>
            {dev.charAt(0).toUpperCase()}
          </div>
        ))}
        {developers.length > 3 && (
          <span className="developer-count">+{developers.length - 3}</span>
        )}
      </div>
    );
  };

  // NUEVA FUNCIÓN: Obtener el estado del usuario en el proyecto
  const getUserProjectStatus = () => {
    if (!user) return { text: 'No autenticado', className: 'status-error' };

    // Si es administrador, siempre mostrar "Admin"
    if (user.role_id === 1) {
      return { text: 'Admin', className: 'status-admin' };
    }

    // Verificar si es el dueño del proyecto
    const isOwner = project.owner_id === user.id;
    
    // Verificar si está asignado al proyecto
    const isAssigned = project.usuarios_asignados && 
      project.usuarios_asignados.toLowerCase().includes(user.name.toLowerCase());

    if (isOwner && isAssigned) {
      return { text: 'Dueño + Asignado', className: 'status-owner-assigned' };
    } else if (isOwner) {
      return { text: 'Dueño', className: 'status-owner' };
    } else if (isAssigned) {
      return { text: 'Asignado', className: 'status-assigned' };
    } else {
      // Este caso no debería ocurrir si el filtrado funciona correctamente
      return { text: 'Sin acceso', className: 'status-no-access' };
    }
  };

  const userStatus = getUserProjectStatus();

  return (
    //container principal de la tarjeta
    <>
      <div className="card-header">
        <h3>{project.name}</h3>
        <span className={`project-status ${userStatus.className}`}>
          {userStatus.text}
        </span>
      </div>
      
      <p className="card-desc">
        {project.description || '"Sin descripción"'}
      </p>

      <div className="project-developers">
        <strong>Desarrolladores asignados:</strong>
        {getDevelopersDisplay()}
      </div>

      <div className="project-footer">
        <div className="project-meta">
          <span className="project-date">
            📅 Deadline: {new Date(project.created_at).toLocaleDateString()}
          </span>
          <span className="project-issues">
            📋 14 Issues
          </span>
        </div>

        {user?.role_id === 1 && (
          <div className="card-actions">
            <button
              className="action-btn edit-btn"
              onClick={() => onEdit(project)}
              title="Editar proyecto"
            >
              <img
                src={require('../../assets/editar.png')}
                alt="Editar"
                className="edit-icon"
              />
            </button>
            <button
              className="action-btn delete-btn"
              onClick={() => onDelete(project.id)}
              title="Eliminar proyecto"
            >
              <img
                src={require('../../assets/eliminar.png')}
                alt="Eliminar"
                className="delete-icon"
              />
            </button>
            <button
              className="action-btn assign-btn"
              onClick={() => onAssignDevelopers(project)}
              title="Asignar desarrolladores"
            >
              <img
                src={require('../../assets/asignar.png')}
                alt="Asignar"
                className="assign-icon"
              />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectCard;