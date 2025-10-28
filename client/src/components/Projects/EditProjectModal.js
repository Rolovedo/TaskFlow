import React from 'react';

const EditProjectModal = ({ 
  project, 
  saving, 
  onSubmit, 
  onChange, 
  onClose 
}) => {
  if (!project) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>✏️ Editar Proyecto</h2>
        <form onSubmit={onSubmit} className="modal-form">
          <label>Nombre</label>
          <input
            type="text"
            value={project.name}
            onChange={(e) => onChange({ ...project, name: e.target.value })}
            required
          />
          <label>Descripción</label>
          <textarea
            value={project.description}
            onChange={(e) => onChange({ ...project, description: e.target.value })}
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
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;