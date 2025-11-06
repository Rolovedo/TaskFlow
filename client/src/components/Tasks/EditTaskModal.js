import React, { useState, useEffect } from 'react';

const EditTaskModal = ({ show, task, states, users, saving, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    state_id: 1,
    assigned_to: '',
    due_date: ''
  });

  // Cargar datos de la tarea cuando se abre el modal
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        state_id: task.state_id || 1,
        assigned_to: task.assigned_to_id || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    const submitData = {
      ...formData,
      assigned_to: formData.assigned_to || null,
      due_date: formData.due_date || null
    };

    onSubmit(task.id, submitData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      state_id: 1,
      assigned_to: '',
      due_date: ''
    });
    onClose();
  };

  if (!show || !task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal task-modal">
        <div className="modal-header">
          <h2>✏️ Editar Tarea</h2>
          <p className="task-id">ID: #{task.id}</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label>Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Título de la tarea"
              required
            />
          </div>

          <div className="form-row">
            <label>Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descripción detallada (opcional)"
              rows="3"
            />
          </div>

          <div className="form-row-group">
            <div className="form-row">
              <label>Estado</label>
              <select
                value={formData.state_id}
                onChange={(e) => setFormData({...formData, state_id: parseInt(e.target.value)})}
              >
                {states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Prioridad</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="low">🟢 Baja</option>
                <option value="medium">🟡 Media</option>
                <option value="high">🔴 Alta</option>
              </select>
            </div>
          </div>

          <div className="form-row-group">
            <div className="form-row">
              <label>Asignar a</label>
              <select
                value={formData.assigned_to}
                onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
              >
                <option value="">Sin asignar</option>
                {users.filter(user => user.role_id === 2).map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Fecha límite</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;