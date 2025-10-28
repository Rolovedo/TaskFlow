import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editingName, setEditingName] = useState(false);
  
  // Estados para editar nombre
  const [newName, setNewName] = useState('');
  
  // Estados para cambiar contraseña (sin pedir contraseña actual)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Proyectos recibidos:', response.data);
        
        // Filtrar proyectos donde el usuario es owner o está asignado
        const filteredProjects = response.data.filter(project => {
          const isOwner = project.owner_id === user.id;
          const isAssigned = project.usuarios_asignados && 
                        project.usuarios_asignados.toLowerCase().includes(user.name.toLowerCase());
          return isOwner || isAssigned;
        });
        
        console.log('Proyectos filtrados:', filteredProjects);
        setUserProjects(filteredProjects);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        setLoading(false);
      }
    };

    if (user) {
      setNewName(user.name);
      fetchUserProjects();
    }
  }, [user]);

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setMessage({ type: 'error', text: 'El nombre no puede estar vacío' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:4000/api/users/${user.id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar el usuario en localStorage
      const updatedUser = { ...user, name: newName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage({ type: 'success', text: 'Nombre actualizado correctamente' });
      setEditingName(false);
      
      // Recargar después de 1.5 segundos
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el nombre' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:4000/api/users/${user.id}`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: 'Contraseña cambiada correctamente' });
      setShowChangePassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Error al cambiar la contraseña' });
    }
  };

  const getRoleName = (roleId) => {
    return roleId === 1 ? 'admin' : 'developer';
  };

  if (!user) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="user-profile-page">
      {/* Sidebar lateral */}
      <aside className="profile-sidebar">
        <div className="sidebar-header">
          <button className="back-btn-sidebar" onClick={() => navigate('/projects')}>
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
                onChange={(e) => setNewName(e.target.value)}
                className="name-edit-input"
                placeholder="Nuevo nombre"
              />
              <div className="name-edit-buttons">
                <button className="btn-save-small" onClick={handleUpdateName}>
                  ✓
                </button>
                <button 
                  className="btn-cancel-small" 
                  onClick={() => {
                    setEditingName(false);
                    setNewName(user.name);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className="name-display-section">
              <h2 className="user-name">{user.name}</h2>
              <button 
                className="edit-name-btn" 
                onClick={() => setEditingName(true)}
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

      {/* Contenido principal */}
      <main className="profile-main-content">
        <header className="profile-top-bar">
          <h1>Perfil de Usuario</h1>
          <div className="top-bar-actions">
            <button className="change-password-link" onClick={() => setShowChangePassword(!showChangePassword)}>
              Cambiar Contraseña
            </button>
            <button className="logout-btn-profile" onClick={logout}>
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Mensajes */}
        {message.text && (
          <div className={`alert-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Modal cambiar contraseña */}
        {showChangePassword && (
          <div className="password-change-card">
            <h3>Cambiar Contraseña</h3>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="Nueva contraseña (mínimo 6 caracteres)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="password-input"
                required
              />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="password-input"
                required
              />
              <div className="password-form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowChangePassword(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sección de proyectos */}
        <section className="projects-view-section">
          <div className="section-header">
            <h2>Proyectos</h2>
            <a href="/Projects" className="view-all-link">Ver Todos</a>
          </div>

          {loading ? (
            <div className="projects-loading">Cargando proyectos...</div>
          ) : userProjects.length === 0 ? (
            <div className="no-projects-state">
              <div className="empty-folder-icon">📁</div>
              <p>No tienes proyectos asignados</p>
            </div>
          ) : (
            <div className="projects-grid-profile">
              {userProjects.map((project) => (
                <div key={project.id} className="project-item-card">
                  <div className="project-thumbnail">
                    <div className="project-icon-large">📊</div>
                  </div>
                  <div className="project-info-section">
                    <h3 className="project-title">{project.name}</h3>
                    <p className="project-desc-text">
                      {project.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserProfile;