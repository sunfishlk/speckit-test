import { useEffect } from 'react';
import { DIRECTIONS } from '../game/constants.js';

export const useKeyboard = (onMove) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onMove(DIRECTIONS.UP);
          break;
        case 'ArrowDown':
          event.preventDefault();
          onMove(DIRECTIONS.DOWN);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onMove(DIRECTIONS.LEFT);
          break;
        case 'ArrowRight':
          event.preventDefault();
          onMove(DIRECTIONS.RIGHT);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMove]);
};
