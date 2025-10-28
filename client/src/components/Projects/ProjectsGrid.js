import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectsGrid = ({ 
  projects, 
  user, 
  onEditProject, 
  onDeleteProject, 
  onAssignDevelopers 
}) => {
  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          user={user}
          onEdit={onEditProject}
          onDelete={onDeleteProject}
          onAssignDevelopers={onAssignDevelopers}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;