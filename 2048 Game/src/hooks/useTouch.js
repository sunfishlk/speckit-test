import { useState, useCallback } from 'react';
import { DIRECTIONS } from '../game/constants.js';

const SWIPE_THRESHOLD = 50;

export const useTouch = (onSwipe) => {
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = useCallback((e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  }, []);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        onSwipe(dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT);
      }
    } else {
      if (Math.abs(dy) > SWIPE_THRESHOLD) {
        onSwipe(dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP);
      }
    }

    setTouchStart(null);
  }, [touchStart, onSwipe]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
