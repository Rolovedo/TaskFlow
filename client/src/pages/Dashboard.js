import React from 'react';
import { useAuth } from '../context/AuthContext';
import { usePageTransition } from '../hooks/usePageTransition';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import {
  DashboardHeader,
  WelcomeSection,
  StatsCards,
  RecentActivity
} from '../components/Dashboard';
import '../styles/Dashboard.css';

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
      <DashboardHeader 
        user={user}
        onLogout={handleLogout}
        logoutLoading={logoutLoading}
      />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          <WelcomeSection 
            user={user}
            onNavigateToProjects={handleNavigateToProjects}
          />
          
          <div className="dashboard-grid">
            <div className="main-content">
              <StatsCards user={user} />
            </div>
            
            <div className="sidebar-content">
              <RecentActivity user={user} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;