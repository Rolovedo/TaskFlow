import React from 'react';
// import '../../styles/StatsCards.css';

const StatsCards = ({ user }) => {
  // Datos simulados - más tarde vendrán de la API
  const stats = user?.role_id === 1 
    ? [
        { title: 'Proyectos Totales', value: '8', icon: '📂', color: 'blue' },
        { title: 'Usuarios Activos', value: '12', icon: '👥', color: 'green' },
        { title: 'Tareas Pendientes', value: '24', icon: '⏳', color: 'orange' },
        { title: 'Completadas Hoy', value: '6', icon: '✅', color: 'purple' }
      ]
    : [
        { title: 'Mis Proyectos', value: '3', icon: '📂', color: 'blue' },
        { title: 'Tareas Asignadas', value: '7', icon: '📋', color: 'green' },
        { title: 'En Progreso', value: '4', icon: '🚀', color: 'orange' },
        { title: 'Completadas', value: '15', icon: '✅', color: 'purple' }
      ];

  return (
    <div className="stats-section">
      <h3 className="stats-title">Resumen</h3>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;