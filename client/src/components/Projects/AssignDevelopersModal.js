import React from 'react';

const AssignDevelopersModal = ({ 
  project, 
  developers, 
  selectedDevs, 
  saving, 
  onSubmit, 
  onDevChange, 
  onClose 
}) => {
  if (!project) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>👥 Asignar Desarrolladores</h2>
        <form onSubmit={onSubmit} className="modal-form">
          <label>Selecciona los desarrolladores:</label>
          <div className="dev-list">
            {developers.map((dev) => (
              <label key={dev.id} className="dev-option">
                <input
                  type="checkbox"
                  checked={selectedDevs.includes(dev.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onDevChange([...selectedDevs, dev.id]);
                    } else {
                      onDevChange(selectedDevs.filter((id) => id !== dev.id));
                    }
                  }}
                />
                {dev.name}
              </label>
            ))}
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Guardando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignDevelopersModal;