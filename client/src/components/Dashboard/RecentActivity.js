import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Calcular tiempo relativo
const getRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Justo ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  return past.toLocaleDateString('es-ES');
};

// Generar actividad reciente basada en datos reales
const generateRecentActivity = (tasks, projects, user) => {
  const activities = [];
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Filtrar tareas según rol
  const relevantTasks = user.role_id === 1 
    ? tasks 
    : tasks.filter(t => 
        t.assigned_to_id === user.id || 
        t.created_by_id === user.id ||
        t.project_owner_id === user.id
      );

  // Tareas completadas recientemente
  relevantTasks
    .filter(t => t.state_name === 'Done' && new Date(t.updated_at) >= last24Hours)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 3)
    .forEach(task => {
      activities.push({
        type: 'task_completed',
        icon: '✅',
        message: `Tarea "${task.title}" completada`,
        user: task.assigned_to_name || 'Sin asignar',
        time: getRelativeTime(task.updated_at),
        timestamp: new Date(task.updated_at),
        priority: 'low'
      });
    });

  // Tareas creadas recientemente
  relevantTasks
    .filter(t => new Date(t.created_at) >= last24Hours)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2)
    .forEach(task => {
      activities.push({
        type: 'task_created',
        icon: '📝',
        message: `Nueva tarea "${task.title}" creada`,
        user: task.created_by_name,
        time: getRelativeTime(task.created_at),
        timestamp: new Date(task.created_at),
        priority: 'medium'
      });
    });

  // Tareas en progreso iniciadas recientemente
  relevantTasks
    .filter(t => t.state_name === 'In Progress' && new Date(t.updated_at) >= last24Hours)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 2)
    .forEach(task => {
      activities.push({
        type: 'task_progress',
        icon: '🚀',
        message: `Tarea "${task.title}" en progreso`,
        user: task.assigned_to_name || 'Sin asignar',
        time: getRelativeTime(task.updated_at),
        timestamp: new Date(task.updated_at),
        priority: 'medium'
      });
    });

  // Proyectos creados recientemente (solo admin)
  if (user.role_id === 1) {
    projects
      .filter(p => new Date(p.created_at) >= last24Hours)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 2)
      .forEach(project => {
        activities.push({
          type: 'project_created',
          icon: '📂',
          message: `Proyecto "${project.name}" creado`,
          user: project.owner_name,
          time: getRelativeTime(project.created_at),
          timestamp: new Date(project.created_at),
          priority: 'high'
        });
      });
  }

  // Si no hay actividad reciente, mostrar mensaje
  if (activities.length === 0) {
    return [{
      type: 'no_activity',
      icon: '💤',
      message: 'No hay actividad reciente en las últimas 24 horas',
      user: 'Sistema',
      time: 'Ahora',
      timestamp: now,
      priority: 'low'
    }];
  }

  // Ordenar por timestamp y limitar a 5
  return activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);
};

// Obtener tareas urgentes
const getUrgentTasks = (tasks, user) => {
  const now = new Date();
  const next48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  // Filtrar tareas según rol
  const relevantTasks = user.role_id === 1 
    ? tasks 
    : tasks.filter(t => t.assigned_to_id === user.id);

  const urgent = [];

  // Tareas vencidas
  const overdue = relevantTasks.filter(t => 
    t.due_date && 
    new Date(t.due_date) < now && 
    t.state_name !== 'Done'
  ).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  overdue.forEach(task => {
    urgent.push({
      id: task.id,
      type: 'overdue',
      icon: '🔴',
      message: `"${task.title}" - VENCIDA`,
      detail: `Proyecto: ${task.project_name}`,
      user: task.assigned_to_name || 'Sin asignar',
      time: `Venció ${getRelativeTime(task.due_date)}`,
      priority: 'critical',
      dueDate: task.due_date
    });
  });

  // Tareas próximas a vencer (48 horas)
  const upcoming = relevantTasks.filter(t => 
    t.due_date && 
    new Date(t.due_date) >= now &&
    new Date(t.due_date) <= next48Hours && 
    t.state_name !== 'Done'
  ).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  upcoming.forEach(task => {
    urgent.push({
      id: task.id,
      type: 'upcoming',
      icon: '⚠️',
      message: `"${task.title}" - Próxima a vencer`,
      detail: `Proyecto: ${task.project_name}`,
      user: task.assigned_to_name || 'Sin asignar',
      time: `Vence ${getRelativeTime(task.due_date)}`,
      priority: 'high',
      dueDate: task.due_date
    });
  });

  // Tareas de alta prioridad sin fecha de vencimiento
  const highPriority = relevantTasks.filter(t => 
    t.priority === 'high' && 
    !t.due_date && 
    t.state_name !== 'Done'
  ).slice(0, 3);

  highPriority.forEach(task => {
    urgent.push({
      id: task.id,
      type: 'high_priority',
      icon: '🔥',
      message: `"${task.title}" - Prioridad Alta`,
      detail: `Proyecto: ${task.project_name}`,
      user: task.assigned_to_name || 'Sin asignar',
      time: 'Sin fecha límite',
      priority: 'high',
      dueDate: null
    });
  });

  if (urgent.length === 0) {
    return [{
      type: 'no_urgent',
      icon: '✨',
      message: 'No hay tareas urgentes',
      detail: '¡Todo bajo control!',
      user: 'Sistema',
      time: '',
      priority: 'low'
    }];
  }

  return urgent.slice(0, 5);
};

const getActivityIcon = (type) => {
  const icons = {
    task_completed: '✅',
    task_created: '📝',
    task_progress: '🚀',
    project_created: '📂',
    user_joined: '👤',
    no_activity: '💤',
    overdue: '🔴',
    upcoming: '⚠️',
    high_priority: '🔥',
    no_urgent: '✨'
  };
  return icons[type] || '📝';
};

const RecentActivity = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity'); // 'activity' o 'urgent'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        // Obtener proyectos y tareas
        const [projectsRes, tasksRes] = await Promise.all([
          axios.get(`${API_URL}/projects`, { headers }),
          axios.get(`${API_URL}/tasks`, { headers })
        ]);

        const projects = projectsRes.data;
        const tasks = tasksRes.data;

        // Generar actividad reciente real
        const recentActivities = generateRecentActivity(tasks, projects, user);
        setActivities(recentActivities);

        // Obtener tareas urgentes
        const urgent = getUrgentTasks(tasks, user);
        setUrgentTasks(urgent);

      } catch (error) {
        console.error('Error al cargar actividad:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="activity-section">
        <h3 className="activity-title">Cargando...</h3>
        <div className="activity-loading">⏳ Obteniendo datos...</div>
      </div>
    );
  }

  return (
    <div className="activity-section">
      <div className="activity-header">
        <h3 className="activity-title">Panel de Actividad</h3>
        <div className="activity-tabs">
          <button 
            className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            📊 Reciente
          </button>
          <button 
            className={`tab-btn ${activeTab === 'urgent' ? 'active' : ''}`}
            onClick={() => setActiveTab('urgent')}
          >
            🔥 Urgente
            {urgentTasks.filter(t => t.type !== 'no_urgent').length > 0 && (
              <span className="urgent-badge">
                {urgentTasks.filter(t => t.type !== 'no_urgent').length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="activity-list">
        {activeTab === 'activity' ? (
          // Actividad reciente
          activities.map((activity, index) => (
            <div 
              key={index} 
              className={`activity-item ${activity.priority}`}
            >
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
          ))
        ) : (
          // Tareas urgentes
          urgentTasks.map((task, index) => (
            <div 
              key={index} 
              className={`activity-item urgent-item ${task.priority}`}
            >
              <div className="activity-icon urgent-icon">
                {getActivityIcon(task.type)}
              </div>
              <div className="activity-content">
                <p className="activity-message">{task.message}</p>
                {task.detail && (
                  <p className="activity-detail">{task.detail}</p>
                )}
                <div className="activity-meta">
                  <span className="activity-user">{task.user}</span>
                  <span className="activity-time">{task.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activeTab === 'urgent' && urgentTasks.filter(t => t.type !== 'no_urgent').length > 0 && (
        <div className="activity-footer">
          <p className="urgent-summary">
            ⚡ {urgentTasks.filter(t => t.type === 'overdue').length} vencidas, 
            {' '}{urgentTasks.filter(t => t.type === 'upcoming').length} próximas
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;