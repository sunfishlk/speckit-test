# 2048 Game

A React-based implementation of the classic 2048 puzzle game with mobile-first design.

## Features

✅ **MVP Complete (User Story 1)**
- 4x4 grid gameplay
- Keyboard controls (arrow keys)
- Touch/swipe controls for mobile
- Score tracking
- Best score persistence (localStorage)
- Win detection (reach 2048)
- Game over detection
- Smooth animations

## How to Play

- **Desktop**: Use arrow keys (↑ ↓ ← →) to move tiles
- **Mobile**: Swipe in any direction to move tiles
- **Goal**: Combine tiles with the same number to reach 2048!

When two tiles with the same number touch, they merge into one tile with the sum of their values.

## Development

### Setup

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to play the game.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm run test
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling with mobile-first responsive design
- **localStorage** - Best score persistence
- **Vitest** - Testing framework (setup complete)

## Project Structure

```
src/
├── components/        # React UI components
│   ├── Game.jsx      # Main game container
│   ├── Grid.jsx      # 4x4 grid display
│   ├── Tile.jsx      # Individual tile
│   └── ScoreBoard.jsx # Score display
├── hooks/            # Custom React hooks
│   ├── useGameState.js  # Game state management
│   ├── useKeyboard.js   # Keyboard input
│   └── useTouch.js      # Touch/swipe gestures
├── game/             # Pure game logic (framework-independent)
│   ├── gameLogic.js     # Core game mechanics
│   ├── gridUtils.js     # Grid utilities
│   └── constants.js     # Game constants
├── utils/
│   └── storage.js       # localStorage wrapper
└── styles/           # CSS files
```

## Implementation Status

- ✅ Phase 1: Setup (T001-T007)
- ✅ Phase 2: Foundational (T008-T015)
- ✅ Phase 3: User Story 1 - Core Gameplay MVP (T016-T028)
- ⏳ Phase 4: User Story 2 - Enhanced Controls (T029-T035)
- ⏳ Phase 5: User Story 3 - Animations Polish (T036-T043)
- ⏳ Phase 6: Final Polish (T044-T051)

## Performance

- Targets 60fps animations
- Game logic executes in <16ms per move
- Mobile-first responsive (320px+)
- CSS GPU acceleration for smooth tile movements

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers (iOS Safari, Android Chrome)

## License

MIT

## Credits

Original 2048 game by Gabriele Cirulli.
This implementation created with React following clean architecture principles.
