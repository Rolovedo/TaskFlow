import React from 'react';
import ProfileHeader from './ProfileHeader';
import AlertMessage from './AlertMessage';
import ChangePasswordForm from './ChangePasswordForm';
import ProjectsSection from './ProjectsSection';

const ProfileMainContent = ({ 
  message,
  showChangePassword,
  newPassword,
  confirmPassword,
  userProjects,
  loading,
  onToggleChangePassword,
  onLogout,
  onPasswordChange,
  onConfirmPasswordChange,
  onChangePasswordSubmit,
  onCancelChangePassword
}) => {
  return (
    <main className="profile-main-content">
      <ProfileHeader
        onToggleChangePassword={onToggleChangePassword}
        onLogout={onLogout}
      />

      <AlertMessage message={message} />

      <ChangePasswordForm
        show={showChangePassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        onPasswordChange={onPasswordChange}
        onConfirmPasswordChange={onConfirmPasswordChange}
        onSubmit={onChangePasswordSubmit}
        onCancel={onCancelChangePassword}
      />

      <ProjectsSection
        userProjects={userProjects}
        loading={loading}
      />
    </main>
  );
};

export default ProfileMainContent;