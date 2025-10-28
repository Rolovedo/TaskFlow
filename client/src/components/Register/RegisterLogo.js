import React from 'react';

const RegisterLogo = () => {
  return (
    <div className="login-logo-side">
      <div className="logo-content">
        {/* Logo principal con animación */}
        <div className="logo-animation">
          <div className="logo-circles">
            <svg width="280" height="280" viewBox="0 0 280 280">
              <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" />
              <circle cx="140" cy="140" r="100" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" />
              <circle cx="140" cy="140" r="80" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" />
            </svg>
          </div>
          
          <svg width="280" height="280" viewBox="0 0 280 280" className="logo-shape">
            <defs>
              <linearGradient id="logoGradientRegister" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            
            <path
              d="M140,40 Q160,70 180,80 Q190,90 180,110 Q170,130 180,150 Q190,170 170,180 Q150,190 140,210 Q130,190 110,180 Q90,170 100,150 Q110,130 100,110 Q90,90 100,80 Q120,70 140,40 Z"
              fill="url(#logoGradientRegister)"
              opacity="0.2"
            />
            <path
              d="M140,60 Q155,80 170,85 Q178,92 170,105 Q162,118 170,135 Q178,152 162,160 Q146,168 140,185 Q134,168 118,160 Q102,152 110,135 Q118,118 110,105 Q102,92 110,85 Q125,80 140,60 Z"
              fill="url(#logoGradientRegister)"
              opacity="0.4"
            />
            <path
              d="M140,80 Q150,95 160,98 Q166,103 160,113 Q154,123 160,133 Q166,143 154,148 Q142,153 140,165 Q138,153 126,148 Q114,143 120,133 Q126,123 120,113 Q114,103 120,98 Q130,95 140,80 Z"
              fill="url(#logoGradientRegister)"
              opacity="0.7"
            />
            
            <circle cx="140" cy="140" r="50" fill="#1E3A8A" />
            <text x="140" y="165" textAnchor="middle" fill="white" fontSize="60" fontWeight="bold" fontFamily="Arial, sans-serif">T</text>
          </svg>
        </div>

        {/* Texto del logo */}
        <div className="logo-text">
          <h1 className="logo-title">TASKFLOOW</h1>
          <div className="logo-subtitle">
            <p>TABLERO DE TAREAS</p>
            <p>ESTILO KANBAN</p>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="logo-decorations">
          <div className="decoration-bar bar-1"></div>
          <div className="decoration-bar bar-2"></div>
          <div className="decoration-bar bar-3"></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLogo;