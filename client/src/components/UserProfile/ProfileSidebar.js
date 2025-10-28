import React from 'react';
// import { useNavigate } from 'react-router-dom';

const ProfileSidebar = ({ 
  user, 
  editingName, 
  newName, 
  onBackClick, 
  onEditNameToggle, 
  onNameChange, 
  onUpdateName, 
  onCancelEdit 
}) => {
  const getRoleName = (roleId) => {
    return roleId === 1 ? 'admin' : 'developer';
  };

  return (
    <aside className="profile-sidebar">
      <div className="sidebar-header">
        <button className="back-btn-sidebar" onClick={onBackClick}>
          ← Volver
        </button>
      </div>

      <div className="profile-user-card">
        <div className="user-avatar-large">
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        {editingName ? (
          <div className="name-edit-section">
            <input
              type="text"
              value={newName}
              onChange={(e) => onNameChange(e.target.value)}
              className="name-edit-input"
              placeholder="Nuevo nombre"
            />
            <div className="name-edit-buttons">
              <button className="btn-save-small" onClick={onUpdateName}>
                ✓
              </button>
              <button className="btn-cancel-small" onClick={onCancelEdit}>
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="name-display-section">
            <h2 className="user-name">{user.name}</h2>
            <button 
              className="edit-name-btn" 
              onClick={onEditNameToggle}
              title="Editar nombre"
            >
              ✏️
            </button>
          </div>
        )}
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <span className="detail-icon">👤</span>
          <span className="detail-label">{user.name}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">💼</span>
          <span className="detail-label">{getRoleName(user.role_id)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">✉️</span>
          <span className="detail-label">{user.email}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🆔</span>
          <span className="detail-label">Role ID: {user.role_id}</span>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;