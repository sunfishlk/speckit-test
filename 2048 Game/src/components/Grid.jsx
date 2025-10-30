import React from 'react';
import { Tile } from './Tile.jsx';
import '../styles/Grid.css';

export const Grid = ({ grid }) => {
  return (
    <div className="grid-container">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((tile, colIndex) => (
            <Tile key={tile ? tile.id : `empty-${rowIndex}-${colIndex}`} tile={tile} />
          ))}
        </div>
      ))}
    </div>
  );
};
