import React from 'react';
import KanbanColumn from './KanbanColumn';

const KanbanBoard = ({ tasks, states, user, onMoveTask, onEditTask, onDeleteTask, onViewTask }) => {
  // Mapeo de estados por defecto si no vienen de la BD
  const defaultStates = [
    { id: 1, name: 'To Do', state_order: 1, color: '#ef4444' },
    { id: 2, name: 'In Progress', state_order: 2, color: '#f59e0b' },
    { id: 3, name: 'Review', state_order: 3, color: '#8b5cf6' },
    { id: 4, name: 'Done', state_order: 4, color: '#10b981' }
  ];

  const kanbanStates = states.length > 0 ? states : defaultStates;

  // Agrupar tareas por estado
  const getTasksByState = (stateId) => {
    return tasks.filter(task => task.state_id === stateId);
  };

  const handleDrop = (e, targetStateId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && parseInt(taskId) !== targetStateId) {
      onMoveTask(parseInt(taskId), targetStateId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="kanban-board">
      <div className="kanban-columns">
        {kanbanStates
          .sort((a, b) => a.state_order - b.state_order)
          .map(state => (
            <KanbanColumn
              key={state.id}
              state={state}
              tasks={getTasksByState(state.id)}
              user={user}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onViewTask={onViewTask}
            />
          ))}
      </div>
    </div>
  );
};

export default KanbanBoard;