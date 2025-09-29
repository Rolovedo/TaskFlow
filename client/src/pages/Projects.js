import React from 'react';
import { useAuth } from '../context/AuthContext';
import { usePageTransition } from '../hooks/usePageTransition';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const { user, logout, logoutLoading } = useAuth();
  const { isTransitioning, transitionTo } = usePageTransition();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  const handleBackToDashboard = async () => {
    await transitionTo('/dashboard', 1200);
  };

  // Mostrar loader durante transiciones de página
  if (isTransitioning) {
    return <Loader text="Navegando..." />;
  }

  // Mostrar loader durante logout
  if (logoutLoading) {
    return <Loader text="Cerrando Sesión" />;
  }

  return (
    <div className="projects-container">
      <header className="projects-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              onClick={handleBackToDashboard}
              className="back-button"
            >
              ← Volver al Dashboard
            </button>
            <h1>Mis Proyectos</h1>
          </div>
          <div className="user-menu">
            <span className="welcome-text">
              {user?.name || 'Usuario'}
            </span>
            <button 
              onClick={handleLogout} 
              className="logout-button"
              disabled={logoutLoading}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      
      <main className="projects-main">
        <div className="projects-content">
          <div className="projects-header-section">
            <h2>Gestión de Proyectos</h2>
            <p className="projects-subtitle">
              {user?.role_id === 1 ? 'Administra todos los proyectos del sistema' : 'Visualiza tus proyectos asignados'}
            </p>
          </div>

          <div className="projects-actions">
            <button className="create-project-btn">
              ➕ Nuevo Proyecto
            </button>
            <div className="projects-filters">
              <select className="filter-select">
                <option value="all">Todos los proyectos</option>
                <option value="active">Activos</option>
                <option value="completed">Completados</option>
              </select>
              <input 
                type="text" 
                placeholder="Buscar proyectos..." 
                className="search-input"
              />
            </div>
          </div>

          <div className="projects-placeholder">
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <h3>No hay proyectos disponibles</h3>
              <p>
                {user?.role_id === 1 
                  ? 'Comienza creando tu primer proyecto para organizar las tareas del equipo.'
                  : 'Aún no tienes proyectos asignados. Contacta con tu administrador.'
                }
              </p>
              {user?.role_id === 1 && (
                <button className="create-first-project-btn">
                  Crear Mi Primer Proyecto
                </button>
              )}
            </div>
          </div>

          <div className="projects-grid" style={{ display: 'none' }}>
            {/* Aquí irán las tarjetas de proyectos */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Projects;