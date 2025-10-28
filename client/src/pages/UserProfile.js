import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ProfileSidebar,
  ProfileMainContent
} from '../components/UserProfile';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editingName, setEditingName] = useState(false);
  
  // Estados para editar nombre
  const [newName, setNewName] = useState('');
  
  // Estados para cambiar contraseña
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

  // Handlers para el sidebar
  const handleBackClick = () => {
    navigate('/projects');
  };

  const handleEditNameToggle = () => {
    setEditingName(true);
  };

  const handleNameChange = (value) => {
    setNewName(value);
  };

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

  const handleCancelEdit = () => {
    setEditingName(false);
    setNewName(user.name);
  };

  // Handlers para el contenido principal
  const handleToggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
  };

  const handleLogout = () => {
    logout();
  };

  const handlePasswordChange = (value) => {
    setNewPassword(value);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
  };

  const handleChangePasswordSubmit = async (e) => {
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

  const handleCancelChangePassword = () => {
    setShowChangePassword(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  if (!user) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="user-profile-page">
      <ProfileSidebar
        user={user}
        editingName={editingName}
        newName={newName}
        onBackClick={handleBackClick}
        onEditNameToggle={handleEditNameToggle}
        onNameChange={handleNameChange}
        onUpdateName={handleUpdateName}
        onCancelEdit={handleCancelEdit}
      />
      
      <ProfileMainContent
        message={message}
        showChangePassword={showChangePassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        userProjects={userProjects}
        loading={loading}
        onToggleChangePassword={handleToggleChangePassword}
        onLogout={handleLogout}
        onPasswordChange={handlePasswordChange}
        onConfirmPasswordChange={handleConfirmPasswordChange}
        onChangePasswordSubmit={handleChangePasswordSubmit}
        onCancelChangePassword={handleCancelChangePassword}
      />
    </div>
  );
};

export default UserProfile;