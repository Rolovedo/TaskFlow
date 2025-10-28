import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { usePageTransition } from '../hooks/usePageTransition';
import Loader from '../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import {
  ProjectsHeader,
  ProjectsActions,
  ProjectsGrid,
  EmptyState,
  CreateProjectModal,
  EditProjectModal,
  AssignDevelopersModal
} from '../components/Projects';
import '../styles/Projects.css';

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

  // Handlers
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

  const handleAssignDevelopers = async (e) => {
    e.preventDefault();
    if (!assigningProject || selectedDevs.length === 0) {
      alert('Selecciona al menos un desarrollador');
      return;
    }

    try {
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

  const handleAssignDevelopersOpen = (project) => {
    setAssigningProject(project);
    fetchDevelopers();
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortOrder === 'az') return a.name.localeCompare(b.name);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  if (isTransitioning) return <Loader text="Navegando..." />;
  if (logoutLoading) return <Loader text="Cerrando sesión..." />;

  return (
    <div className="projects-container">
      <ProjectsHeader
        user={user}
        onLogout={handleLogout}
        onBackToDashboard={handleBackToDashboard}
        logoutLoading={logoutLoading}
      />

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

          <ProjectsActions
            user={user}
            sortOrder={sortOrder}
            onCreateProject={() => setShowModal(true)}
            onSortChange={setSortOrder}
          />

          {loadingProjects ? (
            <Loader text="Cargando proyectos..." />
          ) : sortedProjects.length === 0 ? (
            <EmptyState
              user={user}
              onCreateProject={() => setShowModal(true)}
            />
          ) : (
            <ProjectsGrid
              projects={sortedProjects}
              user={user}
              onEditProject={setEditingProject}
              onDeleteProject={handleDeleteProject}
              onAssignDevelopers={handleAssignDevelopersOpen}
            />
          )}
        </div>
      </main>

      {/* Modales */}
      <CreateProjectModal
        show={showModal}
        newProject={newProject}
        saving={saving}
        onSubmit={handleCreateProject}
        onChange={setNewProject}
        onClose={() => setShowModal(false)}
      />

      <EditProjectModal
        project={editingProject}
        saving={saving}
        onSubmit={handleEditProject}
        onChange={setEditingProject}
        onClose={() => setEditingProject(null)}
      />

      <AssignDevelopersModal
        project={assigningProject}
        developers={developers}
        selectedDevs={selectedDevs}
        saving={saving}
        onSubmit={handleAssignDevelopers}
        onDevChange={setSelectedDevs}
        onClose={() => setAssigningProject(null)}
      />
    </div>
  );
};

export default Projects;
