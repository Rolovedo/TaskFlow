import React from 'react';
import { useAuth } from '../context/AuthContext';
import { usePageTransition } from '../hooks/usePageTransition';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, logoutLoading } = useAuth();
  const { isTransitioning, transitionTo } = usePageTransition();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  const handleNavigateToProjects = async () => {
    await transitionTo('/projects', 1200);
  };

  // Mostrar loader durante transiciones de página
  if (isTransitioning) {
    return <Loader text="Cargando Proyectos" />;
  }

  // Mostrar loader durante logout
  if (logoutLoading) {
    return <Loader text="Cerrando Sesión" />;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>TaskFlow</h1>
          <div className="user-menu">
            <span className="welcome-text">
              Bienvenido, {user?.name || 'Usuario'}
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
      
      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>¡Hola, {user?.name}!</h2>
          <p className="user-info">
            {user?.role_id === 1 ? 'Administrador' : 'Desarrollador'} | {user?.email}
          </p>
          <div className="dashboard-placeholder">
            <h3>Panel de Control</h3>
            <p>Aquí se mostrarán los proyectos y tareas próximamente.</p>
            
            <button 
              onClick={handleNavigateToProjects}
              style={{
                marginTop: '2rem',
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Ver Proyectos
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;