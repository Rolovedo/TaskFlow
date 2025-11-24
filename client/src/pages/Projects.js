import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ 
    name: '', 
    description: '', 
    owner_id: '' // NUEVO CAMPO
  });
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Estado para asignar desarrolladores
  const [assigningProject, setAssigningProject] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [assignedDevelopers, setAssignedDevelopers] = useState([]); // NUEVO: desarrolladores asignados
  const [allUsers, setAllUsers] = useState([]);
  const [selectedDevs, setSelectedDevs] = useState([]);

  const token = localStorage.getItem('token');
  //const API_URL = 'http://localhost:4000/api';

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get('/projects', {
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
      const res = await api.get('/users?role=developer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevelopers(res.data);
    } catch (error) {
      console.error('Error al cargar desarrolladores:', error);
    }
  };

  // NUEVA FUNCIÓN: Cargar todos los usuarios
  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }, [token]);

  // NUEVA FUNCIÓN: Obtener desarrolladores asignados a un proyecto
  const fetchAssignedDevelopers = async (projectId) => {
    try {
      const res = await api.get(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Extraer desarrolladores del campo usuarios_asignados
      if (res.data.usuarios_asignados && res.data.usuarios_asignados !== 'ninguno') {
        const devNames = res.data.usuarios_asignados.split(', ');
        
        // Obtener detalles completos de los desarrolladores
        const allDevsRes = await api.get('/users?role=developer', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const assignedDevs = allDevsRes.data.filter(dev => 
          devNames.includes(dev.name)
        );
        
        setAssignedDevelopers(assignedDevs);
      } else {
        setAssignedDevelopers([]);
      }
    } catch (error) {
      console.error('Error al cargar desarrolladores asignados:', error);
      setAssignedDevelopers([]);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (user?.role_id === 1) {
      fetchAllUsers(); // Solo cargar usuarios si es admin
    }
  }, [fetchProjects, fetchAllUsers, user]);

  // Función de filtrado por rol (sin cambios)
  const getFilteredProjectsByRole = (projectsList) => {
    if (!user) return [];
    if (user.role_id === 1) {
      return projectsList;
    }
    return projectsList.filter(project => {
      const isOwner = project.owner_id === user.id;
      const isAssigned = project.usuarios_asignados && 
        project.usuarios_asignados.toLowerCase().includes(user.name.toLowerCase());
      return isOwner || isAssigned;
    });
  };

  // ACTUALIZAR: Manejar creación con owner_id
  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!newProject.name) {
      alert('El nombre del proyecto es obligatorio');
      return;
    }
    
    if (!newProject.owner_id) {
      alert('Debe seleccionar un dueño para el proyecto');
      return;
    }

    setSaving(true);

    try {
      await api.post(
        '/projects',
        {
          name: newProject.name,
          description: newProject.description,
          owner_id: newProject.owner_id, // Usar el owner_id seleccionado
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchProjects();
      setShowModal(false);
      setNewProject({ name: '', description: '', owner_id: '' }); // Resetear owner_id
      alert('✅ Proyecto creado exitosamente');
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      alert('❌ No se pudo crear el proyecto');
    } finally {
      setSaving(false);
    }
  };

  // NUEVA FUNCIÓN: Manejar apertura del modal
  const handleOpenCreateModal = () => {
    if (user?.role_id === 1) {
      fetchAllUsers(); // Asegurar que tenemos los usuarios actualizados
    }
    setNewProject({ name: '', description: '', owner_id: '' });
    setShowModal(true);
  };

  // Handlers existentes (sin cambios)...
  const handleEditProject = async (e) => {
    e.preventDefault();
    if (!editingProject?.name) return alert('El nombre es obligatorio');
    setSaving(true);

    try {
      await api.put(
        `/projects/${editingProject.id}`,
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
      await api.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProjects();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      alert('No se pudo eliminar el proyecto');
    }
  };

  // NUEVA FUNCIÓN: Remover desarrollador del proyecto
  const handleRemoveDeveloper = async (userId) => {
    if (!assigningProject) return;
    
    const developer = assignedDevelopers.find(dev => dev.id === userId);
    const confirmMessage = `¿Estás seguro de que deseas remover a "${developer?.name}" del proyecto "${assigningProject.name}"?`;
    
    if (!window.confirm(confirmMessage)) return;

    try {
      await api.delete(
        `/projects/${assigningProject.id}/members/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`✅ ${developer?.name} ha sido removido del proyecto`);
      
      // Actualizar listas
      await fetchAssignedDevelopers(assigningProject.id);
      await fetchProjects();
    } catch (error) {
      console.error('Error al remover desarrollador:', error);
      alert(`❌ No se pudo remover a ${developer?.name} del proyecto`);
    }
  };

  // ACTUALIZAR: Función para abrir modal de asignación
  const handleAssignDevelopersOpen = async (project) => {
    setAssigningProject(project);
    setSelectedDevs([]);
    
    // Cargar desarrolladores disponibles y asignados
    await Promise.all([
      fetchDevelopers(),
      fetchAssignedDevelopers(project.id)
    ]);
  };

  // ACTUALIZAR: Función para asignar desarrolladores
  const handleAssignDevelopers = async (e) => {
    e.preventDefault();
    if (!assigningProject || selectedDevs.length === 0) {
      alert('Selecciona al menos un desarrollador');
      return;
    }

    try {
      await Promise.all(
        selectedDevs.map((userId) =>
          api.post(
            `/projects/${assigningProject.id}/members`,
            { user_id: parseInt(userId) },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      const count = selectedDevs.length;
      alert(`✅ ${count} desarrollador${count !== 1 ? 'es' : ''} asignado${count !== 1 ? 's' : ''} correctamente`);
      
      setSelectedDevs([]);
      
      // Actualizar listas
      await fetchAssignedDevelopers(assigningProject.id);
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

  // Lógica de filtrado y ordenamiento (sin cambios)
  const filteredAndSortedProjects = getFilteredProjectsByRole(projects)
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
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
          <ProjectsActions
            user={user}
            sortOrder={sortOrder}
            searchTerm={searchTerm}
            onCreateProject={handleOpenCreateModal} // CAMBIADO: usar nueva función
            onSortChange={setSortOrder}
            onSearchChange={setSearchTerm}
          />

          {loadingProjects ? (
            <Loader text="Cargando proyectos..." />
          ) : filteredAndSortedProjects.length === 0 ? (
            <EmptyState
              user={user}
              onCreateProject={handleOpenCreateModal} // CAMBIADO: usar nueva función
            />
          ) : (
            <ProjectsGrid
              projects={filteredAndSortedProjects}
              user={user}
              sortOrder={sortOrder}
              searchTerm={searchTerm}
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
        users={allUsers} // NUEVA PROP: pasar lista de usuarios
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
        assignedDevelopers={assignedDevelopers} // NUEVA PROP
        selectedDevs={selectedDevs}
        saving={saving}
        onSubmit={handleAssignDevelopers}
        onDevChange={setSelectedDevs}
        onRemoveDeveloper={handleRemoveDeveloper} // NUEVA PROP
        onClose={() => {
          setAssigningProject(null);
          setSelectedDevs([]);
          setAssignedDevelopers([]);
        }}
      />
    </div>
  );
};

export default Projects;
