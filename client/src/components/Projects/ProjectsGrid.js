import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';

const ProjectsGrid = ({ 
  projects, 
  user, 
  sortOrder, // Para detectar cambios de orden
  searchTerm, // NUEVA PROP: Para detectar cambios de búsqueda
  onEditProject, 
  onDeleteProject, 
  onAssignDevelopers 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevSortOrder, setPrevSortOrder] = useState(sortOrder);
  const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
  const [prevProjectsLength, setPrevProjectsLength] = useState(projects.length);

  // Detectar cambios que requieren animación
  useEffect(() => {
    const sortOrderChanged = prevSortOrder !== null && prevSortOrder !== sortOrder;
    const searchTermChanged = prevSearchTerm !== null && prevSearchTerm !== searchTerm;
    const projectsCountChanged = prevProjectsLength !== projects.length && prevProjectsLength > 0;

    // Activar animación si cambió el orden, la búsqueda, o el número de proyectos mostrados
    if (sortOrderChanged || searchTermChanged || projectsCountChanged) {
      setIsAnimating(true);
      
      // Quitar animación después de que termine
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 800);
      
      // Actualizar valores previos
      setPrevSortOrder(sortOrder);
      setPrevSearchTerm(searchTerm);
      setPrevProjectsLength(projects.length);
      
      return () => clearTimeout(timer);
    } else {
      // Actualizar valores previos sin animación en el primer render
      if (prevSortOrder === null) setPrevSortOrder(sortOrder);
      if (prevSearchTerm === null) setPrevSearchTerm(searchTerm);
      if (prevProjectsLength === 0) setPrevProjectsLength(projects.length);
    }
  }, [sortOrder, searchTerm, projects.length, prevSortOrder, prevSearchTerm, prevProjectsLength]);

  return (
    <div className={`projects-grid ${isAnimating ? 'transitioning' : ''}`}>
      {projects.map((project, index) => (
        <div
          key={project.id}
          className={`project-card ${isAnimating ? 'animate-reorder' : ''}`}
        >
          <ProjectCard
            project={project}
            user={user}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
            onAssignDevelopers={onAssignDevelopers}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectsGrid;