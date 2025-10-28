// 🔹 Reemplaza SOLO tu archivo con este (mantiene todo igual)
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { usePageTransition } from '../hooks/usePageTransition';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const { user, logout, logoutLoading } = useAuth();
  const { isTransitioning, transitionTo } = usePageTransition();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [sortOrder, setSortOrder] = useState('recent');
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Estado para asignar desarrolladores
  const [assigningProject, setAssigningProject] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [selectedDevs, setSelectedDevs] = useState([]);

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:4000/api';

  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    } finally {
      setLoadingProjects(false);
    }
  }, [token]);

  const fetchDevelopers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users?role=developer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevelopers(res.data);
    } catch (error) {
      console.error('Error al cargar desarrolladores:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Crear proyecto
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name) return alert('El nombre del proyecto es obligatorio');
    setSaving(true);

    try {
      await axios.post(
        `${API_URL}/projects`,
        {
          name: newProject.name,
          description: newProject.description,
          owner_id: user?.id || 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProjects();
      setShowModal(false);
      setNewProject({ name: '', description: '' });
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      alert('No se pudo crear el proyecto');
    } finally {
      setSaving(false);
    }
  };

  // Editar proyecto
  const handleEditProject = async (e) => {
    e.preventDefault();
    if (!editingProject?.name) return alert('El nombre es obligatorio');
    setSaving(true);

    try {
      await axios.put(
        `${API_URL}/projects/${editingProject.id}`,
        {
          name: editingProject.name,
          description: editingProject.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProjects();
      setEditingProject(null);
    } catch (error) {
      console.error('Error al editar el proyecto:', error);
      alert('No se pudo editar el proyecto');
    } finally {
      setSaving(false);
    }
  };

  // Eliminar proyecto
  const handleDeleteProject = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este proyecto?')) return;
    try {
      await axios.delete(`${API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProjects();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      alert('No se pudo eliminar el proyecto');
    }
  };

  // ✅ Asignar desarrolladores (versión corregida que sí funciona con tu backend)
  const handleAssignDevelopers = async (e) => {
    e.preventDefault();
    if (!assigningProject || selectedDevs.length === 0) {
      alert('Selecciona al menos un desarrollador');
      return;
    }

    try {
      // Se envía uno por uno según tu API: /projects/:id/members
      await Promise.all(
        selectedDevs.map((userId) =>
          axios.post(
            `${API_URL}/projects/${assigningProject.id}/members`,
            { user_id: parseInt(userId) },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      alert('Desarrolladores asignados correctamente ✅');
      setAssigningProject(null);
      setSelectedDevs([]);
      await fetchProjects();
    } catch (error) {
      console.error('Error al asignar desarrolladores:', error.response?.data || error.message);
      alert('❌ No se pudieron asignar los desarrolladores');
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) navigate('/login');
  };

  const handleBackToDashboard = async () => {
    await transitionTo('/dashboard', 1200);
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortOrder === 'az') return a.name.localeCompare(b.name);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  if (isTransitioning) return <Loader text="Navegando..." />;
  if (logoutLoading) return <Loader text="Cerrando sesión..." />;

  return (
    <div className="projects-container">
      <header className="projects-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={handleBackToDashboard} className="back-button">
              ← Volver
            </button>
            <h1>Mis Proyectos</h1>
          </div>
          <div className="user-menu">
            <span className="welcome-text">{user?.name || 'Usuario'}</span>
            <button 
              className="profile-icon-btn"
              onClick={() => navigate('/perfil')}
              title="Ver mi perfil"
            >
              <div className="profile-avatar-small">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>
            <button onClick={handleLogout} className="logout-button" disabled={logoutLoading}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="projects-main">
        <div className="projects-content">
          <div className="projects-header-section">
            <h2>Gestión de Proyectos</h2>
            <p className="projects-subtitle">
              {user?.role_id === 1
                ? 'Administra todos los proyectos del sistema'
                : 'Visualiza tus proyectos asignados'}
            </p>
          </div>

          <div className="projects-actions">
            {user?.role_id === 1 && (
              <button className="create-project-btn" onClick={() => setShowModal(true)}>
                ➕ Nuevo Proyecto
              </button>
            )}
            <div className="projects-sort">
              <button
                className={`sort-btn ${sortOrder === 'recent' ? 'active' : ''}`}
                onClick={() => setSortOrder('recent')}
              >
                📅 Más recientes
              </button>
              <button
                className={`sort-btn ${sortOrder === 'az' ? 'active' : ''}`}
                onClick={() => setSortOrder('az')}
              >
                🔤 De A-Z
              </button>
            </div>
          </div>

          {loadingProjects ? (
            <Loader text="Cargando proyectos..." />
          ) : sortedProjects.length === 0 ? (
            <div className="projects-placeholder">
              <div className="empty-state">
                <div className="empty-icon">📂</div>
                <h3>No hay proyectos disponibles</h3>
                <p>
                  {user?.role_id === 1
                    ? 'Crea tu primer proyecto para comenzar.'
                    : 'Aún no tienes proyectos asignados.'}
                </p>
                {user?.role_id === 1 && (
                  <button
                    className="create-first-project-btn"
                    onClick={() => setShowModal(true)}
                  >
                    Crear Proyecto
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="projects-grid">
              {sortedProjects.map((project) => (
                <div key={project.id} className="project-card fancy-card">
                  <div className="card-header">
                    <h3>{project.name}</h3>
                  </div>
                  <p className="card-desc">{project.description || 'Sin descripción'}</p>

                 <div className="project-developers">
  <strong>Desarrolladores:</strong>{' '}
  {project.usuarios_asignados && project.usuarios_asignados.trim() !== '' ? (
    <span>{project.usuarios_asignados}</span>
  ) : (
    <span>Sin asignar</span>
  )}
</div>


                  <small>📆 {new Date(project.created_at).toLocaleDateString()}</small>

                  {user?.role_id === 1 && (
                    <div className="card-actions">
                      <button
                        className="edit-btn"
                        onClick={() => setEditingProject(project)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        🗑️ Eliminar
                      </button>
                      <button
                        className="assign-btn"
                        onClick={() => {
                          setAssigningProject(project);
                          fetchDevelopers();
                        }}
                      >
                        👥 Asignar developer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* === Modales (crear, editar, asignar) iguales que antes === */}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>📝 Crear Nuevo Proyecto</h2>
            <form onSubmit={handleCreateProject} className="modal-form">
              <label>Nombre</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                required
              />
              <label>Descripción</label>
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
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
      )}

      {/* Modal editar */}
      {editingProject && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>✏️ Editar Proyecto</h2>
            <form onSubmit={handleEditProject} className="modal-form">
              <label>Nombre</label>
              <input
                type="text"
                value={editingProject.name}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, name: e.target.value })
                }
                required
              />
              <label>Descripción</label>
              <textarea
                value={editingProject.description}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, description: e.target.value })
                }
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingProject(null)}
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
      )}

      {/* Modal asignar desarrolladores */}
      {assigningProject && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>👥 Asignar Desarrolladores</h2>
            <form onSubmit={handleAssignDevelopers} className="modal-form">
              <label>Selecciona los desarrolladores:</label>
              <div className="dev-list">
                {developers.map((dev) => (
                  <label key={dev.id} className="dev-option">
                    <input
                      type="checkbox"
                      checked={selectedDevs.includes(dev.id)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedDevs([...selectedDevs, dev.id]);
                        else
                          setSelectedDevs(selectedDevs.filter((id) => id !== dev.id));
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
                  onClick={() => setAssigningProject(null)}
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
      )}
    </div>
  );
};

export default Projects;
