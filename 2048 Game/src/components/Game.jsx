import React, { useCallback, useEffect } from 'react';
import { Grid } from './Grid.jsx';
import { ScoreBoard } from './ScoreBoard.jsx';
import { useGameState } from '../hooks/useGameState.js';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { useTouch } from '../hooks/useTouch.js';
import { loadBestScore, saveBestScore } from '../utils/storage.js';
import { GAME_STATUS } from '../game/constants.js';
import '../styles/Game.css';

export const Game = () => {
  const { state, dispatch } = useGameState(loadBestScore());

  useEffect(() => {
    if (state.status === GAME_STATUS.WON || state.status === GAME_STATUS.LOST) {
      saveBestScore(state.bestScore);
    }
  }, [state.status, state.bestScore]);

  const handleMove = useCallback((direction) => {
    if (state.status === GAME_STATUS.LOST) return;
    dispatch({ type: 'MOVE', direction });
  }, [dispatch, state.status]);

  const handleNewGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME' });
  }, [dispatch]);

  const handleContinue = useCallback(() => {
    dispatch({ type: 'CONTINUE_AFTER_WIN' });
  }, [dispatch]);

  useKeyboard(handleMove);
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouch(handleMove);

  return (
    <div
      className="game"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="game-header">
        <h1 className="game-title">2048</h1>
        <ScoreBoard score={state.score} bestScore={state.bestScore} />
      </div>

      <div className="game-controls">
        <button className="new-game-btn" onClick={handleNewGame}>
          New Game
        </button>
        <p className="game-instructions">
          Use arrow keys or swipe to move tiles
        </p>
      </div>

      <Grid grid={state.grid} />

      {state.status === GAME_STATUS.WON && (
        <div className="game-overlay game-overlay-won">
          <div className="overlay-content">
            <h2>You Win!</h2>
            <p>Score: {state.score}</p>
            <div className="overlay-buttons">
              <button onClick={handleContinue}>Continue</button>
              <button onClick={handleNewGame}>New Game</button>
            </div>
          </div>
        </div>
      )}

      {state.status === GAME_STATUS.LOST && (
        <div className="game-overlay game-overlay-lost">
          <div className="overlay-content">
            <h2>Game Over</h2>
            <p>Final Score: {state.score}</p>
            <button onClick={handleNewGame}>Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
};
