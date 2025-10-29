import React from 'react';

const ProjectsActions = ({ 
  user, 
  sortOrder, 
  searchTerm, 
  onCreateProject, 
  onSortChange, 
  onSearchChange 
}) => {
  return (
    <div className="projects-actions">
      {user?.role_id === 1 && (
        <button className="create-project-btn" onClick={onCreateProject}>
          Nuevo Proyecto
        </button>
      )}
      
      {/*barra de busqueda*/}
      <div className="search-projects">
        <input
          type="text"
          className="search-input"
          placeholder="Search for anything..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="projects-sort">
        <button
          className={`sort-btn ${sortOrder === 'recent' ? 'active' : ''}`}
          onClick={() => onSortChange('recent')}
        >
          📅 Más recientes
        </button>
        <button
          className={`sort-btn ${sortOrder === 'az' ? 'active' : ''}`}
          onClick={() => onSortChange('az')}
        >
          🔤 De A-Z
        </button>
      </div>
    </div>
  );
};

export default ProjectsActions;