import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePageTransition } from '../hooks/usePageTransition';
import api from '../services/api';
import Loader from '../components/Loader/Loader';
import {
  TasksHeader,
  KanbanBoard,
  CreateTaskModal,
  EditTaskModal,
  TaskDetailsModal
} from '../components/Tasks';
import '../styles/Tasks.css';

const Tasks = () => {
  const { projectId } = useParams();
  const { user, logout, logoutLoading } = useAuth();
  const { isTransitioning, transitionTo } = usePageTransition();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [states, setStates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saving, setSaving] = useState(false);

  // Función para verificar si puede crear/editar tareas
  const canCreateTasks = useCallback(() => {
    if (!user || !project) return false;
    
    // Admin puede crear tareas
    if (user.role_id === 1) return true;
    
    // Owner del proyecto puede crear tareas
    if (project.owner_id === user.id) return true;
    
    return false;
  }, [user, project]);

  // Verificar acceso al proyecto
  useEffect(() => {
    const checkProjectAccess = async () => {
      try {
        const response = await api.get(`/projects/${projectId}`);
        setProject(response.data);
        setHasAccess(true);
      } catch (error) {
        console.error('Error verificando acceso al proyecto:', error);
        setHasAccess(false);
        setError('No tienes acceso a este proyecto');
      }
    };

    if (projectId) {
      checkProjectAccess();
    }
  }, [projectId]);

  
  // Cargar tareas del proyecto
  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get(`/tasks/project/${projectId}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error cargando tareas:', error);
      throw error;
    }
  }, [projectId]);
  
  // Cargar estados disponibles
  const fetchStates = useCallback(async () => {
    try {
      const response = await api.get('/projects/states');
      setStates(response.data);
    } catch (error) {
      console.error('Error cargando estados:', error);
      throw error;
    }
  }, []);
  
  // Cargar desarrolladores
  const fetchDevelopers = useCallback(async () => {
    try {
      const response = await api.get('/users');
      const devs = response.data.filter(u => u.role_id === 2);
      setUsers(devs);
    } catch (error) {
      console.error('Error cargando desarrolladores:', error);
      throw error;
    }
  }, []);
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      if (!hasAccess) return;

      try {
        setLoading(true);
        await Promise.all([
          fetchTasks(),
          fetchStates(),
          fetchDevelopers()
        ]);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setError('Error al cargar los datos del proyecto');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [hasAccess, fetchTasks, fetchStates, fetchDevelopers]); // AGREGAR DEPENDENCIAS
  
  // Crear tarea
  const handleCreateTask = async (taskData) => {
    if (!taskData.title || !taskData.state_id) {
      alert('Título y estado son requeridos');
      return;
    }

    setSaving(true);
    try {
      await api.post('/tasks', {
        ...taskData,
        project_id: projectId
      });
      
      await fetchTasks();
      setShowCreateModal(false);
      alert('✅ Tarea creada exitosamente');
    } catch (error) {
      console.error('Error creando tarea:', error);
      alert('❌ Error al crear la tarea');
    } finally {
      setSaving(false);
    }
  };

  // Actualizar tarea
  const handleUpdateTask = async (taskId, taskData) => {
    setSaving(true);
    try {
      await api.put(`/tasks/${taskId}`, taskData);
      
      await fetchTasks();
      setShowEditModal(false);
      setSelectedTask(null);
      alert('✅ Tarea actualizada exitosamente');
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      alert('❌ Error al actualizar la tarea');
    } finally {
      setSaving(false);
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
    
    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchTasks();
      alert('✅ Tarea eliminada exitosamente');
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      alert('❌ Error al eliminar la tarea');
    }
  };

  // Cambiar estado de tarea
  const handleMoveTask = async (taskId, newStateId) => {
    try {
      await api.put(`/tasks/${taskId}`, {
        state_id: newStateId
      });
      await fetchTasks();
    } catch (error) {
      console.error('Error moviendo tarea:', error);
      alert('❌ Error al mover la tarea');
    }
  };

  // Navegación
  const handleBackToProjects = async () => {
    await transitionTo('/projects', 1200);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  // Estados de carga
  if (isTransitioning) {
    return <Loader text="Navegando..." />;
  }

  if (logoutLoading) {
    return <Loader text="Cerrando sesión..." />;
  }

  if (loading) {
    return <Loader text="Cargando tareas del proyecto..." />;
  }

  if (error || !hasAccess) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h2>🔒 {error ? 'Error' : 'Acceso Denegado'}</h2>
          <p>{error || 'No tienes permisos para ver las tareas de este proyecto.'}</p>
          <button 
            className="primary-btn"
            onClick={handleBackToProjects}
          >
            🔙 Volver a Proyectos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <TasksHeader
        project={project}
        user={user}
        onBackToProjects={handleBackToProjects}
        onLogout={handleLogout}
        onCreateTask={canCreateTasks() ? () => setShowCreateModal(true) : null}
        canCreateTasks={canCreateTasks()}
      />

      <main className="tasks-main">
        <KanbanBoard
          tasks={tasks}
          states={states}
          user={user}
          project={project}
          onMoveTask={handleMoveTask}
          onEditTask={(task) => {
            setSelectedTask(task);
            setShowEditModal(true);
          }}
          onDeleteTask={handleDeleteTask}
          onViewTask={(task) => {
            setSelectedTask(task);
            setShowDetailsModal(true);
          }}
          canEditTasks={canCreateTasks()}
          canDeleteTasks={canCreateTasks()}
        />
      </main>

      {/* Modales */}
      {canCreateTasks() && (
        <CreateTaskModal
          show={showCreateModal}
          states={states}
          users={users}
          saving={saving}
          onSubmit={handleCreateTask}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      <EditTaskModal
        show={showEditModal}
        task={selectedTask}
        states={states}
        users={users}
        saving={saving}
        onSubmit={handleUpdateTask}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        canEdit={canCreateTasks()}
      />

      <TaskDetailsModal
        show={showDetailsModal}
        task={selectedTask}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTask(null);
        }}
        onEdit={canCreateTasks() ? () => {
          setShowDetailsModal(false);
          setShowEditModal(true);
        } : null}
        canEdit={canCreateTasks()}
      />
    </div>
  );
};

export default Tasks;