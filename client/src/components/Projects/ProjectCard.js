import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const ProjectCard = ({ 
  project, 
  user, 
  onEdit, 
  onDelete, 
  onAssignDevelopers 
}) => {
  const navigate = useNavigate();
  const [taskCount, setTaskCount] = useState(null);
  const [projectOwner, setProjectOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:4000/api';

  // Cargar información adicional del proyecto
  useEffect(() => {
    const loadProjectInfo = async () => {
      try {
        setLoading(true);
        
        // Cargar conteo de tareas
        const tasksResponse = await axios.get(`${API_URL}/tasks/project/${project.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTaskCount(tasksResponse.data.length);

        // Solo cargar info del dueño si es admin
        if (user?.role_id === 1) {
          const ownerResponse = await axios.get(`${API_URL}/users/${project.owner_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProjectOwner(ownerResponse.data);
        }
      } catch (error) {
        console.error('Error cargando información del proyecto:', error);
        setTaskCount(0); // Fallback
      } finally {
        setLoading(false);
      }
    };

    if (project.id && token) {
      loadProjectInfo();
    }
  }, [project.id, project.owner_id, user?.role_id, token]);

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

  // Obtener el estado del usuario en el proyecto
  const getUserProjectStatus = () => {
    if (!user) return { text: 'No autenticado', className: 'status-error' };

    if (user.role_id === 1) {
      return { text: 'Admin', className: 'status-admin' };
    }

    const isOwner = project.owner_id === user.id;
    const isAssigned = project.usuarios_asignados && 
      project.usuarios_asignados.toLowerCase().includes(user.name.toLowerCase());

    if (isOwner && isAssigned) {
      return { text: 'Dueño + Asignado', className: 'status-owner-assigned' };
    } else if (isOwner) {
      return { text: 'Dueño', className: 'status-owner' };
    } else if (isAssigned) {
      return { text: 'Asignado', className: 'status-assigned' };
    } else {
      return { text: 'Sin acceso', className: 'status-no-access' };
    }
  };

  const userStatus = getUserProjectStatus();

  // Navegar a las tareas del proyecto
  const handleCardClick = (e) => {
    // Solo navegar si no se hizo click en un botón
    if (!e.target.closest('.action-btn')) {
      navigate(`/projects/${project.id}/tasks`);
    }
  };

  // Prevenir propagación en botones de acción
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  // Función para obtener el color del contador de tareas
  const getTaskCountColor = (count) => {
    if (count === 0) return 'task-count-zero';
    if (count <= 5) return 'task-count-low';
    if (count <= 15) return 'task-count-medium';
    return 'task-count-high';
  };

  // Determinar si es admin para tamaño de carta
  const isAdmin = user?.role_id === 1;

  return (
    <StyledWrapper $isAdmin={isAdmin}>
      <div className="container noselect" onClick={handleCardClick}>
        <div id="card">
          <div className="card-content">
            <div className="card-glare" />
            <div className="cyber-lines">
              <span /><span /><span /><span />
            </div>
            
            {/* Header del proyecto */}
            <div className="project-header">
              <h3 className="project-title">{project.name}</h3>
              <span className={`project-status ${userStatus.className}`}>
                {userStatus.text}
              </span>
            </div>

            {/* Descripción */}
            <p className="project-description">
              {project.description || '"Sin descripción"'}
            </p>

            {/* Información del dueño (solo para admin) */}
            {isAdmin && (
              <div className="project-owner-info">
                <strong>Dueño:</strong>
                {loading ? (
                  <span className="loading-text">Cargando...</span>
                ) : projectOwner ? (
                  <div className="owner-display">
                    <div className="owner-avatar" title={projectOwner.name}>
                      {projectOwner.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="owner-name">{projectOwner.name}</span>
                  </div>
                ) : (
                  <span className="no-owner">No encontrado</span>
                )}
              </div>
            )}

            {/* Desarrolladores */}
            <div className="project-developers-section">
              <strong>Desarrolladores:</strong>
              {getDevelopersDisplay()}
            </div>

            {/* Meta información */}
            <div className="project-meta-info">
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span className="meta-text">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="meta-item">
                <span className="meta-icon">📋</span>
                <span className="meta-text">
                  {loading ? (
                    <span className="loading-count">...</span>
                  ) : (
                    <span className={`task-count ${getTaskCountColor(taskCount)}`}>
                      {taskCount} tareas
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Botones de acción (solo admin) */}
            {isAdmin && (
              <div className="action-buttons">
                <button
                  className="action-btn edit-btn"
                  onClick={(e) => handleActionClick(e, () => onEdit(project))}
                  title="Editar proyecto"
                >
                  <img
                    src={require('../../assets/editar.png')}
                    alt="Editar"
                    className="action-icon"
                  />
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={(e) => handleActionClick(e, () => onDelete(project.id))}
                  title="Eliminar proyecto"
                >
                  <img
                    src={require('../../assets/eliminar.png')}
                    alt="Eliminar"
                    className="action-icon"
                  />
                </button>
                <button
                  className="action-btn assign-btn"
                  onClick={(e) => handleActionClick(e, () => onAssignDevelopers(project))}
                  title="Asignar desarrolladores"
                >
                  <img
                    src={require('../../assets/asignar.png')}
                    alt="Asignar"
                    className="action-icon"
                  />
                </button>
              </div>
            )}

            {/* Elementos decorativos */}
            <div className="glowing-elements">
              <div className="glow-1" />
              <div className="glow-2" />
              <div className="glow-3" />
            </div>
            
            <div className="card-particles">
              <span /><span /><span /><span /><span /><span />
            </div>
            
            <div className="corner-elements">
              <span /><span /><span /><span />
            </div>
            
            <div className="scan-line" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    position: relative;
    /* Tamaño más uniforme para admin y desarrollador */
    width: ${props => props.$isAdmin ? '280px' : '280px'};
    /* ALTURA AUTO para ambos - permite que se ajuste al contenido */
    height: ${props => props.$isAdmin ? '420px' : '280px'};
    min-height: ${props => props.$isAdmin ? '340px' : '300px'};
    /* Altura máxima más controlada para admin */
    max-height: ${props => props.$isAdmin ? '400px' : '380px'};
    transition: all 200ms ease;
    cursor: pointer;
  }

  .container:hover {
    transform: translateY(-5px);
  }

  .container:active {
    transform: translateY(-2px) scale(0.98);
  }

  #card {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    transition: all 300ms ease;
    background: linear-gradient(45deg, #1a1a1a, #262626);
    border: 2px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.3),
      inset 0 0 20px rgba(0, 0, 0, 0.2);
  }

  .container:hover #card {
    border-color: rgba(0, 255, 170, 0.3);
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.4),
      0 0 20px rgba(0, 255, 170, 0.1),
      inset 0 0 20px rgba(0, 0, 0, 0.2);
  }

  .card-content {
    position: relative;
    width: 100%;
    height: 100%;
    padding: ${props => props.$isAdmin ? '1.4rem' : '1.2rem'};
    display: flex;
    flex-direction: column;
    gap: ${props => props.$isAdmin ? '0.9rem' : '0.8rem'};
    color: white;
    /* Ambos usan justify-content: space-between para distribución uniforme */
    justify-content: space-between;
  }

  /* Header del proyecto */
  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 10;
    gap: 0.5rem;
    /* No flex para admin - mantiene en la parte superior */
    flex-shrink: 0;
  }

  .project-title {
    color: white;
    font-size: ${props => props.$isAdmin ? '1.1rem' : '1.1rem'};
    font-weight: 700;
    margin: 0;
    flex: 1;
    line-height: 1.3;
    background: linear-gradient(45deg, #00ffaa, #00a2ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 10px rgba(0, 255, 170, 0.3));
  }

  .project-status {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    white-space: nowrap;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
  }

  .status-admin {
    background: rgba(124, 58, 237, 0.8);
    color: white;
    box-shadow: 0 0 15px rgba(124, 58, 237, 0.5);
  }

  .status-owner {
    background: rgba(220, 38, 38, 0.8);
    color: white;
    box-shadow: 0 0 15px rgba(220, 38, 38, 0.5);
  }

  .status-assigned {
    background: rgba(5, 150, 105, 0.8);
    color: white;
    box-shadow: 0 0 15px rgba(5, 150, 105, 0.5);
  }

  .status-owner-assigned {
    background: rgba(234, 88, 12, 0.8);
    color: white;
    box-shadow: 0 0 15px rgba(234, 88, 12, 0.5);
  }

  /* Descripción */
  .project-description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.85rem;
    line-height: 1.4;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    z-index: 10;
    /* No flex para admin - mantiene tamaño fijo */
    flex-shrink: 0;
  }

  /* Sección de contenido medio - para espaciar */
  .project-owner-info,
  .project-developers-section {
    z-index: 10;
    flex-shrink: 0;
  }

  .project-owner-info strong,
  .project-developers-section strong {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.8rem;
    display: block;
    margin-bottom: 0.5rem;
  }

  .owner-display {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .owner-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
  }

  .owner-name {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.8rem;
  }

  /* Desarrolladores */
  .developers-list {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .developer-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
  }

  .developer-count {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    font-weight: 500;
  }

  .no-developers {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
    font-style: italic;
  }

  /* Meta información - al final */
  .project-meta-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 10;
    /* Se posiciona al final con margin-top: auto */
    margin-top: auto;
    flex-shrink: 0;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .meta-icon {
    font-size: 0.9rem;
  }

  .meta-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.8rem;
  }

  .task-count {
    font-weight: 600;
    padding: 0.2rem 0.5rem;
    border-radius: 8px;
    font-size: 0.75rem;
  }

  .task-count-zero {
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .task-count-low {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }

  .task-count-medium {
    background: rgba(245, 158, 11, 0.2);
    color: #fcd34d;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .task-count-high {
    background: rgba(16, 185, 129, 0.2);
    color: #6ee7b7;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  /* Botones de acción - siempre al final */
  .action-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    z-index: 30;
    /* Eliminar margin-top: auto ya que meta-info lo tiene */
    position: relative;
    flex-shrink: 0;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    position: relative;
    z-index: 31;
  }

  .action-btn:hover {
    transform: scale(1.15);
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .action-btn:active {
    transform: scale(1.05);
    transition: transform 0.1s ease;
  }

  .action-icon {
    width: 16px;
    height: 16px;
    filter: brightness(0) invert(1);
    transition: filter 0.2s ease;
  }

  .edit-btn:hover {
    background: rgba(59, 130, 246, 0.3);
    border-color: rgba(59, 130, 246, 0.6);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }

  .edit-btn:hover .action-icon {
    filter: brightness(0) saturate(100%) invert(79%) sepia(49%) saturate(3200%) hue-rotate(2deg) brightness(97%) contrast(101%);
  }

  .delete-btn:hover {
    background: rgba(239, 68, 68, 0.3);
    border-color: rgba(239, 68, 68, 0.6);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
  }

  .delete-btn:hover .action-icon {
    filter: brightness(0) saturate(100%) invert(38%) sepia(99%) saturate(7471%) hue-rotate(349deg) brightness(97%) contrast(101%);
  }

  .assign-btn:hover {
    background: rgba(16, 185, 129, 0.3);
    border-color: rgba(16, 185, 129, 0.6);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
  }

  .assign-btn:hover .action-icon {
    filter: brightness(0) saturate(100%) invert(19%) sepia(84%) saturate(4291%) hue-rotate(214deg) brightness(97%) contrast(89%);
  }

  /* Estados de carga */
  .loading-text,
  .loading-count {
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
    animation: pulse 1.5s ease-in-out infinite;
  }

  /* Efectos decorativos */
  .card-glare {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      125deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.05) 45%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.05) 55%,
      rgba(255, 255, 255, 0) 100%
    );
    opacity: 0;
    transition: opacity 300ms;
  }

  .container:hover .card-glare {
    opacity: 1;
  }

  .cyber-lines span {
    position: absolute;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 255, 170, 0.3),
      transparent
    );
  }

  .cyber-lines span:nth-child(1) {
    top: 20%;
    left: 0;
    width: 100%;
    height: 1px;
    transform: scaleX(0);
    transform-origin: left;
    animation: lineGrow 3s linear infinite;
  }

  .cyber-lines span:nth-child(2) {
    top: 40%;
    right: 0;
    width: 100%;
    height: 1px;
    transform: scaleX(0);
    transform-origin: right;
    animation: lineGrow 3s linear infinite 1s;
  }

  .cyber-lines span:nth-child(3) {
    top: 60%;
    left: 0;
    width: 100%;
    height: 1px;
    transform: scaleX(0);
    transform-origin: left;
    animation: lineGrow 3s linear infinite 2s;
  }

  .cyber-lines span:nth-child(4) {
    top: 80%;
    right: 0;
    width: 100%;
    height: 1px;
    transform: scaleX(0);
    transform-origin: right;
    animation: lineGrow 3s linear infinite 1.5s;
  }

  .glowing-elements {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .glow-1,
  .glow-2,
  .glow-3 {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 170, 0.3) 0%,
      rgba(0, 255, 170, 0) 70%
    );
    filter: blur(15px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .glow-1 {
    top: -20px;
    left: -20px;
  }
  .glow-2 {
    top: 50%;
    right: -30px;
    transform: translateY(-50%);
  }
  .glow-3 {
    bottom: -20px;
    left: 30%;
  }

  .container:hover .glowing-elements div {
    opacity: 1;
  }

  .card-particles span {
    position: absolute;
    width: 3px;
    height: 3px;
    background: #00ffaa;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card-particles span:nth-child(1) {
    top: 40%;
    left: 20%;
  }
  .card-particles span:nth-child(2) {
    top: 60%;
    right: 20%;
  }
  .card-particles span:nth-child(3) {
    top: 20%;
    left: 40%;
  }
  .card-particles span:nth-child(4) {
    top: 80%;
    right: 40%;
  }
  .card-particles span:nth-child(5) {
    top: 30%;
    left: 60%;
  }
  .card-particles span:nth-child(6) {
    top: 70%;
    right: 60%;
  }

  .container:hover .card-particles span {
    animation: particleFloat 2s infinite;
  }

  .corner-elements span {
    position: absolute;
    width: 15px;
    height: 15px;
    border: 2px solid rgba(0, 255, 170, 0.3);
    transition: all 0.3s ease;
  }

  .corner-elements span:nth-child(1) {
    top: 10px;
    left: 10px;
    border-right: 0;
    border-bottom: 0;
  }

  .corner-elements span:nth-child(2) {
    top: 10px;
    right: 10px;
    border-left: 0;
    border-bottom: 0;
  }

  .corner-elements span:nth-child(3) {
    bottom: 10px;
    left: 10px;
    border-right: 0;
    border-top: 0;
  }

  .corner-elements span:nth-child(4) {
    bottom: 10px;
    right: 10px;
    border-left: 0;
    border-top: 0;
  }

  .container:hover .corner-elements span {
    border-color: rgba(0, 255, 170, 0.8);
    box-shadow: 0 0 10px rgba(0, 255, 170, 0.5);
  }

  .scan-line {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(0, 255, 170, 0.1),
      transparent
    );
    transform: translateY(-100%);
    animation: scanMove 2s linear infinite;
  }

  .noselect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Animaciones */
  @keyframes lineGrow {
    0% { transform: scaleX(0); opacity: 0; }
    50% { transform: scaleX(1); opacity: 1; }
    100% { transform: scaleX(0); opacity: 0; }
  }

  @keyframes scanMove {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }

  @keyframes particleFloat {
    0% { transform: translate(0, 0); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translate(calc(var(--x, 0) * 20px), calc(var(--y, 0) * 20px)); opacity: 0; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .container {
      width: ${props => props.$isAdmin ? '270px' : '260px'};
      min-height: ${props => props.$isAdmin ? '320px' : '280px'};
      max-height: ${props => props.$isAdmin ? '380px' : '350px'};
    }
    
    .card-content {
      padding: 1rem;
      gap: ${props => props.$isAdmin ? '0.7rem' : '0.6rem'};
    }
    
    .project-title {
      font-size: 1rem;
    }
    
    .project-status {
      font-size: 0.65rem;
      padding: 0.2rem 0.4rem;
    }
    
    .action-buttons {
      gap: 0.25rem;
    }
    
    .action-btn {
      width: 32px;
      height: 32px;
    }
  }

  @media (max-width: 480px) {
    .container {
      width: ${props => props.$isAdmin ? '250px' : '240px'};
      min-height: ${props => props.$isAdmin ? '300px' : '260px'};
      max-height: ${props => props.$isAdmin ? '360px' : '320px'};
    }
    
    .project-header {
      flex-direction: ${props => props.$isAdmin ? 'row' : 'column'};
      gap: ${props => props.$isAdmin ? '0.5rem' : '0.25rem'};
      align-items: ${props => props.$isAdmin ? 'flex-start' : 'stretch'};
    }
    
    .project-status {
      align-self: ${props => props.$isAdmin ? 'flex-start' : 'center'};
    }
  }
`;

export default ProjectCard;