import { GRID_SIZE } from './constants.js';

export const getEmptyCells = (grid) => {
  const emptyCells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells;
};

export const rotateGrid = (grid, degrees) => {
  const size = grid.length;
  let rotated = grid.map(row => [...row]);

  if (degrees === 90) {
    rotated = grid[0].map((_, colIndex) =>
      grid.map(row => row[colIndex]).reverse()
    );
  } else if (degrees === 180) {
    rotated = grid.map(row => [...row].reverse()).reverse();
  } else if (degrees === 270) {
    rotated = grid[0].map((_, colIndex) =>
      grid.map(row => row[size - 1 - colIndex])
    );
  }

  return rotated;
};

export const generateTileId = () => {
  return `tile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
