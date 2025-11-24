import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StatsCards = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //const API_URL = 'http://localhost:4000/api';

  // Fetch de estadísticas reales
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No token available');
        }
        
        console.log('Fetching stats for user:', user); // Debug
        
        const response = await api.get('/projects/admin/stats');
        setStats(response.data);
        
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setError('Error al cargar estadísticas');
        
        // Fallback a datos por defecto en caso de error
        const defaultStats = user?.role_id === 1 
          ? { totalProjects: 0, activeUsers: 0, pendingTasks: 0, completedToday: 0 }
          : { userProjects: 0, assignedTasks: 0, inProgressTasks: 0, completedTasks: 0 };
        
        setStats(defaultStats);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  // Configurar los datos para mostrar según el rol
  const getStatsConfig = () => {
    if (!stats) return [];

    return user?.role_id === 1 
      ? [
          { 
            title: 'Proyectos Totales', 
            value: stats.totalProjects?.toString() || '0', 
            icon: '📂', 
            color: 'blue'
          },
          { 
            title: 'Usuarios Activos', 
            value: stats.activeUsers?.toString() || '0', 
            icon: '👥', 
            color: 'green'
          },
          { 
            title: 'Tareas Pendientes', 
            value: stats.pendingTasks?.toString() || '0', 
            icon: '⏳', 
            color: 'orange'
          },
          { 
            title: 'Completadas Hoy', 
            value: stats.completedToday?.toString() || '0', 
            icon: '✅', 
            color: 'purple'
          }
        ]
      : [
          { 
            title: 'Mis Proyectos', 
            value: stats.userProjects?.toString() || '0', 
            icon: '📂', 
            color: 'blue'
          },
          { 
            title: 'Tareas Asignadas', 
            value: stats.assignedTasks?.toString() || '0', 
            icon: '📋', 
            color: 'green'
          },
          { 
            title: 'En Progreso', 
            value: stats.inProgressTasks?.toString() || '0', 
            icon: '🚀', 
            color: 'orange'
          },
          { 
            title: 'Completadas', 
            value: stats.completedTasks?.toString() || '0', 
            icon: '✅', 
            color: 'purple'
          }
        ];
  };

  const statsConfig = getStatsConfig();

  // Estado de carga
  if (loading) {
    return (
      <div className="stats-section">
        <h3 className="stats-title">Resumen</h3>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="stat-card loading">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-value">---</div>
                <div className="stat-title">Cargando...</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="stats-section">
        <h3 className="stats-title">Resumen</h3>
        <div className="stats-error">
          <div className="error-icon">⚠️</div>
          <p>No se pudieron cargar las estadísticas</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-section">
      <h3 className="stats-title">
        Resumen {user?.role_id === 1 ? '(Administrador)' : '(Desarrollador)'}
      </h3>
      <div className="stats-grid">
        {statsConfig.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicador de última actualización */}
      <div className="stats-footer">
        <span className="last-updated">
          Actualizado: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default StatsCards;