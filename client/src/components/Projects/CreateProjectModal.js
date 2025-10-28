import React from 'react';

const CreateProjectModal = ({ 
  show, 
  newProject, 
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
          <label>Nombre</label>
          <input
            type="text"
            value={newProject.name}
            onChange={(e) => onChange({ ...newProject, name: e.target.value })}
            required
          />
          <label>Descripción</label>
          <textarea
            value={newProject.description}
            onChange={(e) => onChange({ ...newProject, description: e.target.value })}
          />
          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Guardando...' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;