import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Loader from '../components/Loader/Loader';
import { UsersTable, UserFormModal } from '../components/Users';
import '../styles/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Cargar usuarios
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Usar api.get en lugar de axios o fetch con URL hardcodeada
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear usuario
  const handleCreateUser = async (userData) => {
    try {
      // Usar api.post
      await api.post('/users/register', userData);
      await fetchUsers();
      alert('✅ Usuario creado exitosamente');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert('❌ Error al crear usuario');
    }
  };

  // Actualizar usuario
  const handleUpdateUser = async (userId, userData) => {
    try {
      // Usar api.put
      await api.put(`/users/${userId}`, userData);
      await fetchUsers();
      alert('✅ Usuario actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('❌ Error al actualizar usuario');
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      // Usar api.delete
      await api.delete(`/users/${userId}`);
      await fetchUsers();
      alert('✅ Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('❌ Error al eliminar usuario');
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Estados de carga
  if (loading) {
    return <Loader text="Cargando usuarios..." />;
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <h1>Gestión de Usuarios</h1>
      <button 
        className="primary-btn"
        onClick={() => {
          setSelectedUser(null);
          setShowModal(true);
        }}
      >
        ➕ Agregar Usuario
      </button>

      <UsersTable
        users={users}
        onEditUser={(user) => {
          setSelectedUser(user);
          setShowModal(true);
        }}
        onDeleteUser={handleDeleteUser}
      />

      {/* Modales */}
      {showModal && (
        <UserFormModal
          show={showModal}
          user={selectedUser}
          onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Users;