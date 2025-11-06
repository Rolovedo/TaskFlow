import React from 'react';

const TaskCard = ({ task, user, onEdit, onDelete, onView }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id.toString());
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.state_name !== 'Done';
  };

  const canEditOrDelete = () => {
    // Admin puede todo
    if (user.role_id === 1) return true;
    
    // Owner del proyecto puede todo
    if (user.id === task.project_owner_id) return true;
    
    // Usuario asignado puede editar pero no eliminar
    return user.id === task.assigned_to_id;
  };

  const canDelete = () => {
    // Solo admin u owner del proyecto pueden eliminar
    return user.role_id === 1 || user.id === task.project_owner_id;
  };

  return (
    <div 
      className={`task-card ${isOverdue(task.due_date) ? 'overdue' : ''}`}
      draggable={canEditOrDelete()}
      onDragStart={handleDragStart}
      onClick={() => onView(task)}
    >
      <div className="task-header">
        <div className="task-priority">
          <span 
            className="priority-indicator"
            style={{ color: getPriorityColor(task.priority) }}
            title={`Prioridad: ${task.priority || 'Sin definir'}`}
          >
            {getPriorityIcon(task.priority)}
          </span>
        </div>
        
        {canEditOrDelete() && (
          <div className="task-actions" onClick={(e) => e.stopPropagation()}>
            <button 
              className="task-action-btn edit-btn"
              onClick={() => onEdit(task)}
              title="Editar tarea"
            >
              ✏️
            </button>
            {canDelete() && (
              <button 
                className="task-action-btn delete-btn"
                onClick={() => onDelete(task.id)}
                title="Eliminar tarea"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>

      <div className="task-content">
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p className="task-description">
            {task.description.length > 100 
              ? `${task.description.substring(0, 100)}...` 
              : task.description
            }
          </p>
        )}
      </div>

      <div className="task-footer">
        {task.assigned_to_name && (
          <div className="task-assignee">
            <div className="assignee-avatar">
              {task.assigned_to_name.charAt(0).toUpperCase()}
            </div>
            <span className="assignee-name">{task.assigned_to_name}</span>
          </div>
        )}

        {task.due_date && (
          <div className={`task-due-date ${isOverdue(task.due_date) ? 'overdue' : ''}`}>
            <span className="due-icon">📅</span>
            <span className="due-text">{formatDate(task.due_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;