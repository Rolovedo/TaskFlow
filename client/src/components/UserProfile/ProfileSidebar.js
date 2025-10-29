import React from 'react';

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

        <button onClick={onBackClick} className="button">
          <div className="button-box">
            <span className="button-elem">
              <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
                ></path>
              </svg>
            </span>
            <span class="button-elem">
              <svg viewBox="0 0 46 40">
                <path
                  d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
                ></path>
              </svg>
            </span>
          </div>
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