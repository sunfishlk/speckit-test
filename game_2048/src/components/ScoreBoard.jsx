import React from 'react';

export const ScoreBoard = ({ score, bestScore }) => {
  return (
    <div className="scoreboard">
      <div className="score-container">
        <div className="score-label">SCORE</div>
        <div className="score-value">{score}</div>
      </div>
      <div className="score-container">
        <div className="score-label">BEST</div>
        <div className="score-value">{bestScore}</div>
      </div>
    </div>
  );
};
