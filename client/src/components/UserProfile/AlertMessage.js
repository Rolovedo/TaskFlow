import React from 'react';

const AlertMessage = ({ message }) => {
  if (!message.text) return null;

  return (
    <div className={`alert-message ${message.type}`}>
      {message.text}
    </div>
  );
};

export default AlertMessage;