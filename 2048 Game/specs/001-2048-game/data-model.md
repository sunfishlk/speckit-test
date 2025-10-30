# Data Model: 2048 Web Game

**Phase**: 1 - Design & Contracts  
**Date**: 2025-10-29  
**Purpose**: Define core entities, state structure, and data relationships

## Core Entities

### 1. GameState

**Purpose**: Central state object containing all game data

**Fields**:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `grid` | `Tile[][]` | 4x4 2D array of tiles | Always 4x4, cells can be null |
| `score` | `number` | Current game score | >= 0 |
| `bestScore` | `number` | Historical best score | >= score initially |
| `status` | `GameStatus` | Current game state | enum: 'playing' \| 'won' \| 'lost' |
| `moveCount` | `number` | Number of moves made | >= 0 |

**Invariants**:
- `grid` must always be exactly 4x4 dimensions
- `bestScore >= score` after game ends
- `status` transitions: playing → won/lost (one-way, unless new game)

**State Transitions**:
```
Initial → playing
  ↓
playing → playing (on valid move)
playing → won (when 2048 tile created)
playing → lost (when no valid moves remain)
won → playing (on continue after win)
```

**Example**:
```javascript
{
  grid: [
    [2, 4, 8, 2],
    [4, 2, null, null],
    [null, null, 2, 4],
    [2, null, null, 8]
  ],
  score: 48,
  bestScore: 1024,
  status: 'playing',
  moveCount: 12
}
```

---

### 2. Tile

**Purpose**: Represents a single tile in the grid

**Fields**:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `value` | `number` | Tile value | Power of 2: 2, 4, 8, 16, ..., 2048, 4096, ... |
| `id` | `string` | Unique identifier | UUID or timestamp-based |
| `isNew` | `boolean` | Flag for newly spawned | Used for spawn animation |
| `isMerged` | `boolean` | Flag for just merged | Used for merge animation |

**Invariants**:
- `value` must be power of 2 (2^n where n >= 1)
- `id` must be unique across all tiles in current grid
- Animation flags (`isNew`, `isMerged`) reset after animation completes

**Example**:
```javascript
{
  value: 16,
  id: 'tile_1698765432_3',
  isNew: false,
  isMerged: true
}
```

**Null Tiles**:
- Empty grid cells represented as `null` (not a Tile object)
- Simplifies logic for empty cell checks

---

### 3. Move (Direction)

**Purpose**: Enum representing possible move directions

**Values**:
- `'UP'`
- `'DOWN'`
- `'LEFT'`
- `'RIGHT'`

**Usage**: Input from keyboard arrow keys or touch swipe gestures

---

### 4. GameStatus

**Purpose**: Enum representing game state

**Values**:

| Status | Description | UI Behavior |
|--------|-------------|-------------|
| `'playing'` | Game in progress | Accept move inputs |
| `'won'` | Player reached 2048 | Show win message, allow continue |
| `'lost'` | No valid moves left | Show game over message, disable moves |

---

## Data Relationships

```
GameState (1)
  │
  ├─> grid (4x4 array)
  │     └─> Tile | null (16 cells)
  │
  ├─> status: GameStatus
  └─> score, bestScore, moveCount (primitives)

Move (enum) ──input──> GameState reducer ──output──> new GameState
```

---

## State Management Architecture

### Reducer Pattern

```javascript
const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'MOVE':
      return handleMove(state, action.direction);
    
    case 'NEW_GAME':
      return initializeGame();
    
    case 'CONTINUE_AFTER_WIN':
      return { ...state, status: 'playing' };
    
    case 'UPDATE_BEST_SCORE':
      return { ...state, bestScore: Math.max(state.score, state.bestScore) };
    
    default:
      return state;
  }
};
```

### Actions

| Action Type | Payload | Description |
|-------------|---------|-------------|
| `MOVE` | `{ direction: Move }` | Apply move in direction |
| `NEW_GAME` | none | Reset game state |
| `CONTINUE_AFTER_WIN` | none | Keep playing after reaching 2048 |
| `UPDATE_BEST_SCORE` | none | Sync best score to localStorage |

---

## Persistence Strategy

### LocalStorage Schema

**Key**: `'game2048_bestScore'`  
**Value**: `string` (serialized number)

```javascript
// Storage interface
interface GameStorage {
  loadBestScore(): number;
  saveBestScore(score: number): void;
}
```

**Data Flow**:
1. On game init: Load `bestScore` from localStorage
2. On game end: Compare `score` vs `bestScore`, save higher value
3. On new game: Preserve `bestScore`, reset `score`

**Error Handling**:
- If localStorage unavailable (private mode), default `bestScore = 0`
- No crash on read/write failures (graceful degradation)

---

## Game Logic Functions (Pure)

### Core Operations

```javascript
// Pure function signatures (no side effects)

initializeGame(): GameState
  // Returns: New GameState with 2 random tiles, score 0

applyMove(state: GameState, direction: Move): GameState
  // Returns: New GameState after move, or same state if invalid

isValidMove(grid: Tile[][], direction: Move): boolean
  // Returns: true if move changes grid

isGameWon(grid: Tile[][]): boolean
  // Returns: true if any tile has value >= 2048

isGameLost(grid: Tile[][]): boolean
  // Returns: true if grid full AND no valid moves

spawnRandomTile(grid: Tile[][]): Tile[][]
  // Returns: New grid with one tile added (90% → 2, 10% → 4)

slideAndMerge(grid: Tile[][], direction: Move): {
  newGrid: Tile[][],
  mergedScore: number,
  mergedTileIds: Set<string>
}
  // Returns: Transformed grid, score gained, IDs of merged tiles
```

### Helper Functions

```javascript
getEmptyCells(grid: Tile[][]): Position[]
  // Returns: Array of {row, col} for null cells

rotateGrid(grid: Tile[][], degrees: 90 | 180 | 270): Tile[][]
  // Returns: Rotated grid (for UP/DOWN/RIGHT using LEFT logic)

generateTileId(): string
  // Returns: Unique ID for new tile
```

---

## Validation Rules

### Grid Constraints
- Must be 4x4 (4 rows × 4 columns)
- Each cell: `Tile` object or `null`
- Maximum 16 tiles at any time

### Tile Constraints
- Value must be power of 2
- Value typically in range [2, 131072] (2^1 to 2^17)
- ID must be unique within grid

### Score Constraints
- Score >= 0
- Score increases only on tile merge (by merged tile value)
- Best score never decreases

### Move Constraints
- Move valid only if grid changes
- After valid move, exactly one new tile spawns
- Invalid move → no state change, no new tile

---

## Performance Considerations

### State Updates
- **Immutable updates**: Never mutate state directly (React re-render requirement)
- **Shallow equality checks**: Use object spread `{...state}` for new references
- **Grid cloning**: Deep clone grid array for moves (`grid.map(row => [...row])`)

### Animation Tracking
- Use `tile.id` as React key for smooth animations
- Track `isNew` and `isMerged` flags for CSS transitions
- Reset animation flags after `transitionend` event (150-200ms)

### Memory
- Keep only current state (no undo history in MVP)
- Clean up event listeners on component unmount
- Tile ID generation lightweight (timestamp + index)

---

## Type Definitions (TypeScript)

```typescript
type TileValue = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | number;

interface Tile {
  value: TileValue;
  id: string;
  isNew: boolean;
  isMerged: boolean;
}

type Grid = (Tile | null)[][];

type GameStatus = 'playing' | 'won' | 'lost';

type Move = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface GameState {
  grid: Grid;
  score: number;
  bestScore: number;
  status: GameStatus;
  moveCount: number;
}

interface Position {
  row: number;
  col: number;
}

type GameAction =
  | { type: 'MOVE'; direction: Move }
  | { type: 'NEW_GAME' }
  | { type: 'CONTINUE_AFTER_WIN' }
  | { type: 'UPDATE_BEST_SCORE' };
```

---

## Testing Scenarios

### Data Integrity Tests

1. **Grid initialization**:
   - Verify exactly 2 tiles spawn
   - Verify grid is 4x4
   - Verify tiles have unique IDs

2. **Move validation**:
   - Vertical move on full column → no change
   - Horizontal move with space → tiles slide
   - Move with merge → correct value and score

3. **Merge logic**:
   - Two adjacent 2s → one 4
   - Three adjacent 2s → one 4 + one 2 (only one merge per tile per move)
   - Non-adjacent same values → no merge

4. **Win/Loss detection**:
   - 2048 tile created → status = 'won'
   - Grid full + no valid moves → status = 'lost'
   - Valid move exists → status = 'playing'

5. **Score calculation**:
   - Merge 2+2 → score +4
   - Multiple merges in one move → sum all merged values
   - Invalid move → score unchanged

---

## Next Steps

Data model complete. Proceed to:
- ✅ Generate quickstart.md for development setup
- ⏭ Skip contracts/ (no backend API)
- ⏭ Update agent context with React + Vite stack
