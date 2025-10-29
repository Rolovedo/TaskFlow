import React from 'react';

const CreateProjectModal = ({ 
  show, 
  newProject, 
  users, // NUEVA PROP: Lista de usuarios disponibles
  saving, 
  onSubmit, 
  onChange, 
  onClose 
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>📝 Crear Nuevo Proyecto</h2>
        <form onSubmit={onSubmit} className="modal-form">
          <label>Nombre del Proyecto</label>
          <input
            type="text"
            value={newProject.name}
            onChange={(e) => onChange({ ...newProject, name: e.target.value })}
            placeholder="Ingresa el nombre del proyecto"
            required
          />

          <label>Descripción</label>
          <textarea
            value={newProject.description}
            onChange={(e) => onChange({ ...newProject, description: e.target.value })}
            placeholder="Describe brevemente el proyecto (opcional)"
            rows="3"
          />

          <label>Dueño del Proyecto</label>
          <select
            value={newProject.owner_id || ''}
            onChange={(e) => onChange({ ...newProject, owner_id: parseInt(e.target.value) })}
            required
            className="owner-select"
          >
            <option value="">Seleccionar dueño del proyecto</option>
            {users && users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role_id === 1 ? 'Administrador' : 'Desarrollador'})
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Creando Proyecto...' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;