# Research: 2048 Web Game

**Phase**: 0 - Outline & Research  
**Date**: 2025-10-29  
**Purpose**: Resolve technical unknowns and establish best practices for React-based 2048 implementation

## Technical Decisions

### 1. Testing Framework Selection

**Decision**: Jest + React Testing Library

**Rationale**:
- Jest is the de facto standard for React testing (bundled with Create React App)
- React Testing Library promotes testing user behavior over implementation details
- Excellent React hooks support
- Fast execution with parallel test running
- Strong community support and documentation

**Alternatives Considered**:
- **Vitest**: Faster, modern alternative with ESM support. Rejected because Jest ecosystem is more mature for React projects and team familiarity typically higher
- **Cypress**: Excellent for E2E but overkill for component/unit tests. Could be added later for integration testing

**Implementation Notes**:
- Use `@testing-library/react` for component tests
- Use `@testing-library/user-event` for simulating user interactions
- Use `@testing-library/jest-dom` for DOM assertion matchers

---

### 2. React State Management Pattern

**Decision**: React hooks (useState + useReducer) with custom hooks

**Rationale**:
- No external state management library needed (aligns with Progressive Enhancement principle)
- `useReducer` perfect for complex game state with multiple state transitions
- Custom hooks (`useGameState`, `useKeyboard`, `useTouch`) provide clean separation of concerns
- Lightweight and framework-native solution
- Easy to test (can test reducer functions in isolation)

**Alternatives Considered**:
- **Redux**: Too heavyweight for single-component game state. Adds unnecessary complexity and bundle size
- **Zustand/Jotai**: Lightweight but still external dependencies. Not needed for localized game state
- **Context API**: Not needed - no prop drilling issues in shallow component tree

**Implementation Pattern**:
```javascript
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'MOVE': return applyMove(state, action.direction);
    case 'NEW_GAME': return initializeGame();
    case 'UPDATE_BEST_SCORE': return { ...state, bestScore: action.score };
    default: return state;
  }
};

const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return { state, dispatch };
};
```

---

### 3. CSS Animation Strategy for 60fps

**Decision**: CSS transforms + transitions with GPU acceleration

**Rationale**:
- `transform` and `opacity` are GPU-accelerated properties (composite-only changes)
- Avoid layout thrashing (no width/height/top/left animations)
- CSS transitions more performant than JavaScript animation for simple movements
- `will-change` hint for browser optimization
- Meets 60fps requirement (<16ms per frame)

**Best Practices**:
```css
.tile {
  transform: translate3d(0, 0, 0); /* Force GPU layer */
  transition: transform 150ms ease-in-out;
  will-change: transform;
}

.tile-merging {
  animation: merge 200ms ease-in-out;
}

@keyframes merge {
  50% { transform: scale(1.1); }
}
```

**Alternatives Considered**:
- **React Spring / Framer Motion**: Powerful animation libraries but add significant bundle size (20-40kb). CSS transitions sufficient for tile movements
- **JavaScript RAF loop**: Lower-level control but more complex, harder to maintain, and CSS is optimized by browser

**Performance Notes**:
- Use `transform: translate3d(x, y, 0)` instead of `translate(x, y)` to ensure GPU acceleration
- Limit concurrent animations to prevent jank
- Use `transitionend` event to know when animation completes

---

### 4. Touch Gesture Detection

**Decision**: Custom touch event handlers with swipe threshold detection

**Rationale**:
- Simple swipe gestures (4 directions) don't require heavy gesture library
- Touch events (`touchstart`, `touchmove`, `touchend`) well-supported in modern browsers
- ~50px swipe threshold for intentional moves
- Prevent default to block page scrolling

**Implementation Pattern**:
```javascript
const useTouch = (onSwipe) => {
  const [touchStart, setTouchStart] = useState(null);
  
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };
  
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
    
    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;
    const threshold = 50;
    
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
    } else if (Math.abs(dy) > threshold) {
      onSwipe(dy > 0 ? 'DOWN' : 'UP');
    }
    
    setTouchStart(null);
  };
  
  return { handleTouchStart, handleTouchEnd };
};
```

**Alternatives Considered**:
- **Hammer.js**: Comprehensive gesture library but 23kb minified. Overkill for simple 4-directional swipes
- **React Use Gesture**: Modern React hooks for gestures but adds dependency. Custom implementation is 20 lines

---

### 5. Grid Data Structure & Move Algorithm

**Decision**: 2D array (4x4) with immutable updates, slide-and-merge algorithm

**Rationale**:
- 2D array `grid[row][col]` intuitive and matches visual representation
- Immutable updates for React re-rendering and state history (potential undo feature)
- Slide-and-merge in two passes: (1) slide tiles, (2) merge adjacent same values
- Rotate grid for different directions (DRY principle - implement once for LEFT, rotate for others)

**Algorithm Overview**:
```javascript
// Slide left example
const slideLeft = (grid) => {
  return grid.map(row => {
    const filtered = row.filter(cell => cell !== 0); // Remove empties
    const merged = [];
    let skip = false;
    
    for (let i = 0; i < filtered.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }
      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        skip = true;
      } else {
        merged.push(filtered[i]);
      }
    }
    
    while (merged.length < 4) merged.push(0);
    return merged;
  });
};
```

**Best Practices**:
- Use rotation matrices for UP/DOWN/RIGHT (rotate → slideLeft → rotate back)
- Compare grid before/after to detect if move was valid (if no change, don't spawn new tile)
- Use Set for tracking which tiles merged (for animation)

---

### 6. Tile Value Generation Probability

**Decision**: 90% chance for tile value 2, 10% chance for tile value 4

**Rationale**:
- Matches original 2048 game mechanics
- Provides slight randomness without being too easy or too hard
- 4-tiles give occasional boost to help progress

**Implementation**:
```javascript
const getRandomTileValue = () => {
  return Math.random() < 0.9 ? 2 : 4;
};
```

---

### 7. LocalStorage Strategy for Best Score

**Decision**: localStorage with JSON serialization and error handling

**Rationale**:
- Persistent across browser sessions (FR-011)
- Synchronous API (no async complexity)
- ~5MB limit sufficient for small game state
- Graceful degradation if localStorage unavailable (private browsing)

**Implementation Pattern**:
```javascript
const STORAGE_KEY = 'game2048_bestScore';

export const loadBestScore = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (err) {
    console.warn('localStorage unavailable:', err);
    return 0;
  }
};

export const saveBestScore = (score) => {
  try {
    localStorage.setItem(STORAGE_KEY, score.toString());
  } catch (err) {
    console.warn('Failed to save best score:', err);
  }
};
```

---

### 8. Responsive Design Breakpoints

**Decision**: Mobile-first CSS with single breakpoint at 768px

**Rationale**:
- Mobile-first aligns with Constitution Principle III
- Single breakpoint sufficient for square game grid
- Use viewport units (vw, vh) for fluid scaling
- Minimum 320px width support (iPhone SE)

**CSS Strategy**:
```css
/* Mobile-first: 320px - 767px */
.game-container {
  width: 90vw;
  max-width: 500px;
  margin: 0 auto;
}

.tile {
  font-size: clamp(1.5rem, 5vw, 3rem);
}

/* Desktop: 768px+ */
@media (min-width: 768px) {
  .game-container {
    width: 500px;
  }
  
  .tile {
    font-size: 2rem;
  }
}
```

---

### 9. Game Logic Testing Strategy

**Decision**: Unit tests for pure functions, integration tests for user flows

**Rationale**:
- Pure game logic functions (`slideLeft`, `merge`, `spawnTile`) easy to unit test
- Integration tests verify complete user journeys (move → merge → score update → new tile)
- Component tests for UI behavior (button clicks, keyboard events)

**Test Coverage Priorities**:
1. **Critical (MUST test)**:
   - Move calculation correctness (all 4 directions)
   - Tile merging logic and score calculation
   - Win/loss detection
   - Valid move detection

2. **Important (SHOULD test)**:
   - Touch/keyboard input handling
   - Best score persistence
   - New game reset

3. **Nice to have**:
   - Animation completion
   - Edge cases (rapid inputs, boundary conditions)

---

### 10. Build Tool & Development Setup

**Decision**: Vite for build tooling

**Rationale**:
- Faster dev server than Webpack (ESM-based, no bundling in dev)
- Out-of-box React support with HMR
- Modern, minimal configuration
- Smaller production bundles
- Better DX (faster builds, faster HMR)

**Alternatives Considered**:
- **Create React App**: Deprecated/maintenance mode. Slower build times, Webpack-based
- **Next.js**: Overkill for static single-page game (no SSR/routing needed)
- **Parcel**: Good zero-config alternative but Vite has better React ecosystem

**Setup Commands**:
```bash
npm create vite@latest . -- --template react
npm install
npm run dev
```

---

## Open Questions Resolved

| Question | Answer |
|----------|--------|
| Testing framework? | Jest + React Testing Library |
| State management? | useReducer + custom hooks (no external library) |
| Animation approach? | CSS transforms with GPU acceleration |
| Touch gesture detection? | Custom hooks with touch events |
| Grid data structure? | 2D array with immutable updates |
| Tile spawn probability? | 90% for 2, 10% for 4 |
| Best score persistence? | localStorage with error handling |
| Build tool? | Vite |

---

## Dependencies to Install

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

**Note**: Changed to Vitest for testing to match Vite ecosystem (better integration, faster execution).

---

## Next Steps

All technical unknowns resolved. Ready for Phase 1: Design & Contracts.
- Proceed to data-model.md for entity definitions
- Generate quickstart.md for local development guide
- No backend contracts needed (frontend-only)
