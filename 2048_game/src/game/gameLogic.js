import { GRID_SIZE, SPAWN_PROBABILITY, WIN_TILE_VALUE, GAME_STATUS, DIRECTIONS } from './constants.js';
import { getEmptyCells, rotateGrid, generateTileId } from './gridUtils.js';

export const createEmptyGrid = () => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
};

export const spawnRandomTile = (grid) => {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) return grid;

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < SPAWN_PROBABILITY[2] ? 2 : 4;
  
  const newGrid = grid.map(r => [...r]);
  newGrid[row][col] = {
    value,
    id: generateTileId(),
    isNew: true,
    isMerged: false,
  };

  return newGrid;
};

export const initializeGame = () => {
  let grid = createEmptyGrid();
  grid = spawnRandomTile(grid);
  grid = spawnRandomTile(grid);

  return {
    grid,
    score: 0,
    bestScore: 0,
    status: GAME_STATUS.PLAYING,
    moveCount: 0,
  };
};

export const slideLeft = (grid) => {
  return grid.map(row => {
    const filtered = row.filter(cell => cell !== null);
    const merged = [];
    const mergedIds = new Set();
    let score = 0;
    let skip = false;

    for (let i = 0; i < filtered.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (i + 1 < filtered.length && filtered[i].value === filtered[i + 1].value) {
        const newValue = filtered[i].value * 2;
        merged.push({
          value: newValue,
          id: generateTileId(),
          isNew: false,
          isMerged: true,
        });
        score += newValue;
        mergedIds.add(filtered[i].id);
        mergedIds.add(filtered[i + 1].id);
        skip = true;
      } else {
        merged.push({
          ...filtered[i],
          isMerged: false,
        });
      }
    }

    while (merged.length < GRID_SIZE) {
      merged.push(null);
    }

    return { row: merged, score, mergedIds };
  });
};

export const slideAndMerge = (grid, direction) => {
  let workingGrid = grid.map(row => [...row]);
  let totalScore = 0;
  let allMergedIds = new Set();

  if (direction === DIRECTIONS.UP) {
    workingGrid = rotateGrid(workingGrid, 270);
  } else if (direction === DIRECTIONS.DOWN) {
    workingGrid = rotateGrid(workingGrid, 90);
  } else if (direction === DIRECTIONS.RIGHT) {
    workingGrid = rotateGrid(workingGrid, 180);
  }

  const result = slideLeft(workingGrid);
  workingGrid = result.map(r => r.row);
  totalScore = result.reduce((sum, r) => sum + r.score, 0);
  result.forEach(r => r.mergedIds.forEach(id => allMergedIds.add(id)));

  if (direction === DIRECTIONS.UP) {
    workingGrid = rotateGrid(workingGrid, 90);
  } else if (direction === DIRECTIONS.DOWN) {
    workingGrid = rotateGrid(workingGrid, 270);
  } else if (direction === DIRECTIONS.RIGHT) {
    workingGrid = rotateGrid(workingGrid, 180);
  }

  return {
    newGrid: workingGrid,
    mergedScore: totalScore,
    mergedTileIds: allMergedIds,
  };
};

export const isValidMove = (oldGrid, newGrid) => {
  return JSON.stringify(oldGrid) !== JSON.stringify(newGrid);
};

export const isGameWon = (grid) => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] && grid[row][col].value >= WIN_TILE_VALUE) {
        return true;
      }
    }
  }
  return false;
};

export const isGameLost = (grid) => {
  if (getEmptyCells(grid).length > 0) {
    return false;
  }

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const current = grid[row][col];
      if (!current) continue;

      if (col < GRID_SIZE - 1 && grid[row][col + 1]?.value === current.value) {
        return false;
      }
      if (row < GRID_SIZE - 1 && grid[row + 1][col]?.value === current.value) {
        return false;
      }
    }
  }

  return true;
};

export const applyMove = (state, direction) => {
  const { newGrid, mergedScore } = slideAndMerge(state.grid, direction);

  if (!isValidMove(state.grid, newGrid)) {
    return state;
  }

  const gridWithNewTile = spawnRandomTile(newGrid);
  const newScore = state.score + mergedScore;
  
  let newStatus = state.status;
  if (isGameWon(gridWithNewTile) && state.status === GAME_STATUS.PLAYING) {
    newStatus = GAME_STATUS.WON;
  } else if (isGameLost(gridWithNewTile)) {
    newStatus = GAME_STATUS.LOST;
  }

  return {
    ...state,
    grid: gridWithNewTile,
    score: newScore,
    bestScore: Math.max(state.bestScore, newScore),
    status: newStatus,
    moveCount: state.moveCount + 1,
  };
};
