import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePageTransition } from '../hooks/usePageTransition';
import axios from 'axios';
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

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:4000/api';

  // Verificar acceso al proyecto - usando useCallback para evitar re-renders
  const verifyProjectAccess = useCallback(async () => {
    try {
      const projectRes = await axios.get(`${API_URL}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProject(projectRes.data);
      setHasAccess(true);
      return projectRes.data; // Retornar los datos del proyecto
    } catch (error) {
      console.error('Error verificando acceso al proyecto:', error);
      if (error.response?.status === 403) {
        setError('No tienes permisos para acceder a este proyecto');
      } else if (error.response?.status === 404) {
        setError('Proyecto no encontrado');
      } else {
        setError('Error al cargar el proyecto');
      }
      setHasAccess(false);
      return null;
    }
  }, [API_URL, projectId, token]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Primero verificar acceso al proyecto
        const projectData = await verifyProjectAccess();
        if (!projectData) {
          setLoading(false);
          return;
        }

        // Cargar tareas (ya verificado el acceso en el endpoint)
        const tasksRes = await axios.get(`${API_URL}/tasks/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Obtener estados globales (estos son los mismos para todos)
        const statesRes = await axios.get(`${API_URL}/projects/states`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Cargar usuarios solo si es admin o owner del proyecto
        let usersData = [];
        if (user?.role_id === 1 || projectData.owner_id === user?.id) {
          try {
            const usersRes = await axios.get(`${API_URL}/users`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            usersData = usersRes.data;
          } catch (error) {
            console.warn('No se pudieron cargar los usuarios:', error);
            // No es crítico, continúa sin cargar usuarios
          }
        }

        setTasks(tasksRes.data);
        setStates(statesRes.data);
        setUsers(usersData);
      } catch (error) {
        console.error('Error cargando datos:', error);
        if (error.response?.status === 403) {
          setError('No tienes permisos para ver las tareas de este proyecto');
        } else {
          setError('Error al cargar los datos del proyecto');
        }
      } finally {
        setLoading(false);
      }
    };

    if (projectId && token && user) {
      loadData();
    }
  }, [projectId, token, user, verifyProjectAccess, API_URL]); // Incluir todas las dependencias

  // Función para recargar tareas
  const refreshTasks = useCallback(async () => {
    if (!hasAccess) return;
    
    try {
      const response = await axios.get(`${API_URL}/tasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error recargando tareas:', error);
      if (error.response?.status === 403) {
        setError('Ya no tienes permisos para ver las tareas de este proyecto');
        setHasAccess(false);
      }
    }
  }, [hasAccess, API_URL, projectId, token]);

  // Verificar permisos para crear/editar tareas
  const canCreateTasks = useCallback(() => {
    if (!user || !project) return false;
    
    // Admin puede crear siempre
    if (user.role_id === 1) return true;
    
    // Owner del proyecto puede crear
    if (project.owner_id === user.id) return true;
    
    return false;
  }, [user, project]);

  // Crear nueva tarea
  const handleCreateTask = async (taskData) => {
    if (!canCreateTasks()) {
      alert('❌ No tienes permisos para crear tareas en este proyecto');
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API_URL}/tasks`, {
        ...taskData,
        project_id: parseInt(projectId)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await refreshTasks();
      setShowCreateModal(false);
      alert('✅ Tarea creada exitosamente');
    } catch (error) {
      console.error('Error creando tarea:', error);
      if (error.response?.status === 403) {
        alert('❌ No tienes permisos para crear tareas en este proyecto');
      } else {
        alert('❌ Error al crear la tarea');
      }
    } finally {
      setSaving(false);
    }
  };

  // Actualizar tarea
  const handleUpdateTask = async (taskId, taskData) => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await refreshTasks();
      setShowEditModal(false);
      setSelectedTask(null);
      alert('✅ Tarea actualizada exitosamente');
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      if (error.response?.status === 403) {
        alert('❌ No tienes permisos para editar esta tarea');
      } else {
        alert('❌ Error al actualizar la tarea');
      }
    } finally {
      setSaving(false);
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
    
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await refreshTasks();
      alert('✅ Tarea eliminada exitosamente');
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      if (error.response?.status === 403) {
        alert('❌ No tienes permisos para eliminar esta tarea');
      } else {
        alert('❌ Error al eliminar la tarea');
      }
    }
  };

  // Cambiar estado de tarea (drag & drop)
  const handleMoveTask = async (taskId, newStateId) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, {
        state_id: newStateId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await refreshTasks();
    } catch (error) {
      console.error('Error moviendo tarea:', error);
      if (error.response?.status === 403) {
        alert('❌ No tienes permisos para mover esta tarea');
      } else {
        alert('❌ Error al mover la tarea');
      }
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

  if (error) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              className="primary-btn"
              onClick={handleBackToProjects}
            >
              🔙 Volver a Proyectos
            </button>
            <button 
              className="secondary-btn"
              onClick={() => window.location.reload()}
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h2>🔒 Acceso Denegado</h2>
          <p>No tienes permisos para ver las tareas de este proyecto.</p>
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
        onEdit={canCreateTasks() ? (() => {
          setShowDetailsModal(false);
          setShowEditModal(true);
        }) : null}
        canEdit={canCreateTasks()}
      />
    </div>
  );
};

export default Tasks;