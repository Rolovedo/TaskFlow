import React, { useState } from 'react';

const AssignDevelopersModal = ({ 
  project, 
  developers, 
  selectedDevs, 
  assignedDevelopers, // NUEVA PROP: desarrolladores ya asignados
  saving, 
  onSubmit, 
  onDevChange, 
  onRemoveDeveloper, // NUEVA PROP: función para remover desarrollador
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('assign'); // 'assign' o 'manage'

  if (!project) return null;

  // Filtrar desarrolladores no asignados para la pestaña de asignar
  const availableDevelopers = developers.filter(dev => 
    !assignedDevelopers.some(assigned => assigned.id === dev.id)
  );

  return (
    <div className="modal-overlay">
      <div className="modal assign-modal">
        <div className="modal-header">
          <h2>👥 Gestionar Desarrolladores</h2>
          <p className="project-name">Proyecto: <strong>{project.name}</strong></p>
        </div>

        {/* Pestañas */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'assign' ? 'active' : ''}`}
            onClick={() => setActiveTab('assign')}
          >
            ➕ Asignar Nuevos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            📋 Gestionar Asignados ({assignedDevelopers.length})
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'assign' ? (
            // PESTAÑA: ASIGNAR NUEVOS DESARROLLADORES
            <div className="assign-tab">
              <form onSubmit={onSubmit} className="modal-form">
                <label className="section-label">
                  Selecciona desarrolladores para asignar:
                </label>
                
                {availableDevelopers.length === 0 ? (
                  <div className="no-developers">
                    <p>✅ Todos los desarrolladores ya están asignados a este proyecto</p>
                  </div>
                ) : (
                  <div className="developers-grid">
                    {availableDevelopers.map((dev) => (
                      <label key={dev.id} className="developer-card">
                        <input
                          type="checkbox"
                          className="dev-checkbox"
                          checked={selectedDevs.includes(dev.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onDevChange([...selectedDevs, dev.id]);
                            } else {
                              onDevChange(selectedDevs.filter((id) => id !== dev.id));
                            }
                          }}
                        />
                        <div className="dev-avatar">
                          {dev.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="dev-info">
                          <span className="dev-name">{dev.name}</span>
                          <span className="dev-email">{dev.email}</span>
                        </div>
                        <div className="checkbox-indicator">
                          {selectedDevs.includes(dev.id) ? '✓' : ''}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  {availableDevelopers.length > 0 && (
                    <button 
                      type="submit" 
                      className="save-btn" 
                      disabled={saving || selectedDevs.length === 0}
                    >
                      {saving ? 'Asignando...' : `Asignar ${selectedDevs.length} Desarrollador${selectedDevs.length !== 1 ? 'es' : ''}`}
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            // PESTAÑA: GESTIONAR ASIGNADOS
            <div className="manage-tab">
              <label className="section-label">
                Desarrolladores asignados actualmente:
              </label>
              
              {assignedDevelopers.length === 0 ? (
                <div className="no-developers">
                  <p>📭 No hay desarrolladores asignados a este proyecto</p>
                </div>
              ) : (
                <div className="assigned-developers">
                  {assignedDevelopers.map((dev) => (
                    <div key={dev.id} className="assigned-dev-card">
                      <div className="dev-avatar assigned">
                        {dev.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="dev-info">
                        <span className="dev-name">{dev.name}</span>
                        <span className="dev-email">{dev.email}</span>
                      </div>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => onRemoveDeveloper(dev.id)}
                        title={`Remover a ${dev.name} del proyecto`}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={onClose}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignDevelopersModal;