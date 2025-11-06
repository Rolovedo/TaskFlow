import React from 'react';

const TaskDetailsModal = ({ show, task, onClose, onEdit }) => {
  if (!show || !task) return null;

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.state_name !== 'Done';
  };

  return (
    <div className="modal-overlay">
      <div className="modal task-details-modal">
        <div className="modal-header">
          <div className="task-details-header">
            <h2>📋 Detalles de la Tarea</h2>
            <span className="task-id">ID: #{task.id}</span>
          </div>
        </div>

        <div className="task-details-content">
          {/* Título y Estado */}
          <div className="detail-section">
            <div className="task-title-section">
              <h1 className="task-main-title">{task.title}</h1>
              <div className="task-state-badge">
                <span className={`state-indicator state-${task.state_name?.toLowerCase().replace(' ', '-')}`}>
                  {task.state_name || 'Sin estado'}
                </span>
              </div>
            </div>
          </div>

          {/* Información básica */}
          <div className="detail-section">
            <h3>📝 Información</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Prioridad:</label>
                <div className="priority-display">
                  <span 
                    className="priority-indicator"
                    style={{ color: getPriorityColor(task.priority) }}
                  >
                    {getPriorityIcon(task.priority)}
                  </span>
                  <span className="priority-text">
                    {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Sin definir'}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <label>Asignado a:</label>
                <div className="assignee-display">
                  {task.assigned_to_name ? (
                    <>
                      <div className="assignee-avatar">
                        {task.assigned_to_name.charAt(0).toUpperCase()}
                      </div>
                      <span>{task.assigned_to_name}</span>
                    </>
                  ) : (
                    <span className="no-assignee">Sin asignar</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {task.description && (
            <div className="detail-section">
              <h3>📄 Descripción</h3>
              <div className="description-content">
                {task.description}
              </div>
            </div>
          )}

          {/* Fechas */}
          <div className="detail-section">
            <h3>📅 Fechas</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Fecha límite:</label>
                <div className={`date-display ${isOverdue(task.due_date) ? 'overdue' : ''}`}>
                  {isOverdue(task.due_date) && <span className="overdue-icon">⚠️</span>}
                  <span>{formatDate(task.due_date)}</span>
                </div>
              </div>

              <div className="detail-item">
                <label>Creada:</label>
                <span className="date-text">{formatDateTime(task.created_at)}</span>
              </div>

              <div className="detail-item">
                <label>Última actualización:</label>
                <span className="date-text">{formatDateTime(task.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Proyecto */}
          <div className="detail-section">
            <h3>📂 Proyecto</h3>
            <div className="project-info">
              <span className="project-name">{task.project_name || 'Sin proyecto'}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cerrar
          </button>
          {/* <button type="button" className="edit-btn" onClick={onEdit}>
            ✏️ Editar Tarea
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;