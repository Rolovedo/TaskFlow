import React from 'react';
// import '../../styles/RecentActivity.css';

const RecentActivity = ({ user }) => {
  // Datos simulados - más tarde vendrán de la API
  const activities = user?.role_id === 1 
    ? [
        { 
          type: 'project', 
          message: 'Nuevo proyecto "TaskFlow Mobile" creado',
          time: 'Hace 2 horas',
          user: 'Samuel Rodriguez'
        },
        { 
          type: 'user', 
          message: 'Usuario "María García" se unió al equipo',
          time: 'Hace 4 horas',
          user: 'Sistema'
        },
        { 
          type: 'task', 
          message: 'Tarea "API Login" completada',
          time: 'Hace 6 horas',
          user: 'Carlos López'
        }
      ]
    : [
        { 
          type: 'task', 
          message: 'Tarea "Componente Dashboard" asignada',
          time: 'Hace 1 hora',
          user: 'Admin'
        },
        { 
          type: 'project', 
          message: 'Agregado al proyecto "TaskFlow Web"',
          time: 'Hace 3 horas',
          user: 'Samuel Rodriguez'
        },
        { 
          type: 'task', 
          message: 'Tarea "Setup Database" completada',
          time: 'Hace 5 horas',
          user: user?.name
        }
      ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'project': return '📂';
      case 'user': return '👤';
      case 'task': return '✅';
      default: return '📝';
    }
  };

  return (
    <div className="activity-section">
      <h3 className="activity-title">Actividad Reciente</h3>
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-icon">
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <p className="activity-message">{activity.message}</p>
              <div className="activity-meta">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;