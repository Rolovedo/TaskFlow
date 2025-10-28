import React from 'react';
import '../../styles/Loader.css';

const Loader = ({ text = "Procesando" }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        {/* Partículas flotantes */}
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        
        {/* Loader infinito CSS puro */}
        <div className="infinity-loader"></div>
        
        <div className="loading-text">{text}</div>
      </div>
    </div>
  );
};

export default Loader;