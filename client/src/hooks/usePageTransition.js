import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const transitionTo = async (path, delay = 1500) => {
    setIsTransitioning(true);
    
    // Esperar el tiempo del loader
    await new Promise(resolve => setTimeout(resolve, delay));
    
    navigate(path);
    setIsTransitioning(false);
  };

  return {
    isTransitioning,
    transitionTo
  };
};