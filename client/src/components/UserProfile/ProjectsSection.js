import React from 'react';

const ProjectsSection = ({ userProjects, loading }) => {
  return (
    <section className="projects-view-section">
      <div className="section-header">
        <h2>Proyectos</h2>
        <a href="/Projects" className="view-all-link">Ver Todos</a>
      </div>

      {loading ? (
        <div className="projects-loading">Cargando proyectos...</div>
      ) : userProjects.length === 0 ? (
        <div className="no-projects-state">
          <div className="empty-folder-icon">📁</div>
          <p>No tienes proyectos asignados</p>
        </div>
      ) : (
        <div className="projects-grid-profile">
          {userProjects.map((project) => (
            <div key={project.id} className="project-item-card">
              <div className="project-thumbnail">
                <div className="project-icon-large">📊</div>
              </div>
              <div className="project-info-section">
                <h3 className="project-title">{project.name}</h3>
                <p className="project-desc-text">
                  {project.description || 'Sin descripción'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;