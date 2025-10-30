import React from 'react';
import '../styles/Tile.css';

export const Tile = ({ tile }) => {
  if (!tile) {
    return <div className="tile tile-empty"></div>;
  }

  const { value, isNew, isMerged } = tile;
  const tileClass = `tile tile-${value} ${isNew ? 'tile-new' : ''} ${isMerged ? 'tile-merged' : ''}`;

  return (
    <div className={tileClass}>
      {value}
    </div>
  );
};
