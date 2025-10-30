import { useReducer } from 'react';
import { initializeGame, applyMove } from '../game/gameLogic.js';
import { GAME_STATUS } from '../game/constants.js';

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'MOVE':
      return applyMove(state, action.direction);
    
    case 'NEW_GAME':
      return {
        ...initializeGame(),
        bestScore: state.bestScore,
      };
    
    case 'CONTINUE_AFTER_WIN':
      return {
        ...state,
        status: GAME_STATUS.PLAYING,
      };
    
    case 'UPDATE_BEST_SCORE':
      return {
        ...state,
        bestScore: Math.max(state.score, state.bestScore),
      };
    
    case 'SET_BEST_SCORE':
      return {
        ...state,
        bestScore: action.bestScore,
      };
    
    default:
      return state;
  }
};

export const useGameState = (initialBestScore = 0) => {
  const initialState = {
    ...initializeGame(),
    bestScore: initialBestScore,
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);

  return { state, dispatch };
};
