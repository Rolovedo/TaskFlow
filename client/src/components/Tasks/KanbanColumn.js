import React from 'react';
import TaskCard from './TaskCard';

const KanbanColumn = ({ state, tasks, user, onDrop, onDragOver, onEditTask, onDeleteTask, onViewTask }) => {
  const getStateIcon = (stateName) => {
    switch (stateName.toLowerCase()) {
      case 'to do':
      case 'pending':
        return '📋';
      case 'in progress':
        return '🚀';
      case 'review':
        return '👀';
      case 'done':
      case 'completed':
        return '✅';
      default:
        return '📌';
    }
  };

  const getStateColor = (stateName) => {
    switch (stateName.toLowerCase()) {
      case 'to do':
      case 'pending':
        return '#ef4444';
      case 'in progress':
        return '#f59e0b';
      case 'review':
        return '#8b5cf6';
      case 'done':
      case 'completed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div 
      className="kanban-column"
      onDrop={(e) => onDrop(e, state.id)}
      onDragOver={onDragOver}
    >
      <div 
        className="column-header"
        style={{ borderTopColor: state.color || getStateColor(state.name) }}
      >
        <div className="column-title">
          <span className="state-icon">{getStateIcon(state.name)}</span>
          <span className="state-name">{state.name}</span>
          <span className="task-count">({tasks.length})</span>
        </div>
      </div>

      <div className="column-content">
        {tasks.length === 0 ? (
          <div className="empty-column">
            <p>No hay tareas aquí</p>
            <span className="drop-hint">Arrastra una tarea aquí</span>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                user={user}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onView={onViewTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;