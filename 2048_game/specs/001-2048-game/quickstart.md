# Quick Start: 2048 Web Game

**Purpose**: Get the development environment running in <5 minutes  
**Prerequisites**: Node.js 18+ and npm 9+ installed

## Setup (First Time)

### 1. Initialize Project

```bash
# From repository root
npm create vite@latest . -- --template react

# When prompted:
# - Project name: . (current directory)
# - Overwrite existing files: Y
# - Package name: 2048-game (or accept default)

# Install dependencies
npm install

# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 2. Update Vite Config for Tests

Create/update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
})
```

### 3. Create Test Setup

Create `tests/setup.js`:

```javascript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});
```

### 4. Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  }
}
```

---

## Daily Development Workflow

### Start Development Server

```bash
npm run dev
```

**Expected Output**:
```
VITE v5.0.0  ready in 300 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

Open browser to `http://localhost:5173`

**Hot Module Replacement (HMR)**: Changes auto-reload in browser.

---

### Run Tests

```bash
# Watch mode (re-runs on file changes)
npm run test

# Run once (for CI)
npm run test:run

# With UI (visual test runner)
npm run test:ui
```

**Expected Output**:
```
✓ tests/unit/gameLogic.test.js (15 tests)
✓ tests/unit/gridUtils.test.js (8 tests)
✓ tests/integration/gameplay.test.js (6 tests)

Test Files  3 passed (3)
     Tests  29 passed (29)
   Duration  1.2s
```

---

### Build for Production

```bash
npm run build
```

**Output**: Bundled files in `dist/` directory

```bash
# Preview production build locally
npm run preview
```

---

## Project Structure Reference

```
/
├── src/
│   ├── components/        # React UI components
│   │   ├── Game.jsx
│   │   ├── Grid.jsx
│   │   ├── Tile.jsx
│   │   ├── ScoreBoard.jsx
│   │   └── GameControls.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useGameState.js
│   │   ├── useKeyboard.js
│   │   └── useTouch.js
│   ├── game/             # Pure game logic (framework-independent)
│   │   ├── gameLogic.js
│   │   ├── gridUtils.js
│   │   └── constants.js
│   ├── utils/
│   │   └── storage.js
│   ├── styles/
│   │   ├── Game.css
│   │   ├── Grid.css
│   │   └── Tile.css
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
├── tests/
│   ├── unit/
│   │   ├── gameLogic.test.js
│   │   └── gridUtils.test.js
│   ├── integration/
│   │   └── gameplay.test.js
│   └── setup.js
├── public/
│   └── index.html
├── specs/                # Feature documentation
│   └── 001-2048-game/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       └── quickstart.md (this file)
├── vite.config.js
├── package.json
└── README.md
```

---

## Common Tasks

### Add a New Component

1. Create component file in `src/components/[Name].jsx`
2. Create styles in `src/styles/[Name].css`
3. Import and use in parent component

**Example**:
```javascript
// src/components/Tile.jsx
import '../styles/Tile.css';

export const Tile = ({ value, isNew, isMerged }) => {
  return (
    <div className={`tile tile-${value} ${isNew ? 'tile-new' : ''} ${isMerged ? 'tile-merged' : ''}`}>
      {value}
    </div>
  );
};
```

### Add Game Logic Function

1. Create/update function in `src/game/gameLogic.js`
2. Write tests in `tests/unit/gameLogic.test.js`
3. Run tests: `npm run test`

**TDD Workflow** (per Constitution):
```bash
# 1. Write failing test
# 2. Run: npm run test (should see red)
# 3. Implement function
# 4. Run: npm run test (should see green)
# 5. Refactor if needed
```

### Debug in Browser

1. Open DevTools (F12)
2. Check Console for errors
3. Use React DevTools extension for component inspection
4. Add `debugger` statement in code for breakpoints

---

## Mobile Testing

### Test on Physical Device

1. Start dev server with network access:
```bash
npm run dev -- --host
```

2. Note your local IP (e.g., `http://192.168.1.100:5173`)
3. Open on mobile device browser (same WiFi network)

### Test Touch Gestures

**Browser DevTools**:
- Chrome: DevTools → Toggle device toolbar (Ctrl+Shift+M)
- Firefox: DevTools → Responsive Design Mode (Ctrl+Shift+M)

**Gestures**:
- Swipe up/down/left/right to test tile movement
- Verify page doesn't scroll during swipes

---

## Troubleshooting

### Port 5173 Already in Use

```bash
# Kill process or use different port
npm run dev -- --port 3000
```

### Tests Not Finding Modules

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### HMR Not Working

1. Check browser console for connection errors
2. Try hard refresh (Ctrl+Shift+R)
3. Restart dev server

### localStorage Not Persisting

- Check browser privacy settings
- Ensure not in private/incognito mode
- Clear browser cache and test again

---

## Performance Monitoring

### Check FPS in Browser

**Chrome DevTools**:
1. Open DevTools → More Tools → Rendering
2. Enable "Frame Rendering Stats"
3. Play game and observe FPS counter (target: 60fps)

**Firefox DevTools**:
1. Open DevTools → Performance
2. Start recording while playing game
3. Check for 60fps in timeline

### Lighthouse Audit

```bash
# Build production version
npm run build
npm run preview

# Open Chrome DevTools → Lighthouse
# Run audit for Performance, Accessibility, Best Practices
```

**Target Scores**:
- Performance: >90
- Accessibility: >90 (WCAG AA)
- Best Practices: >90

---

## Git Workflow

### Commit Changes

```bash
# Stage changes
git add src/components/Tile.jsx src/styles/Tile.css

# Commit with descriptive message
git commit -m "feat: add Tile component with merge animation"

# Push to feature branch
git push origin 001-2048-game
```

**Commit Message Format**:
- `feat: ...` - New feature
- `fix: ...` - Bug fix
- `refactor: ...` - Code refactoring
- `test: ...` - Add/update tests
- `style: ...` - CSS/styling changes
- `docs: ...` - Documentation

---

## Next Steps

After quickstart setup:
1. Review `data-model.md` for state structure
2. Review `research.md` for technical decisions
3. Start implementing using `/speckit.tasks` command
4. Follow TDD: Write tests first, then implementation

---

## Resources

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Vitest Docs**: https://vitest.dev
- **React Testing Library**: https://testing-library.com/react
- **2048 Game Rules**: https://play2048.co (original game for reference)

---

## Support

Having issues? Check:
1. Node.js version: `node --version` (should be 18+)
2. npm version: `npm --version` (should be 9+)
3. All dependencies installed: `npm install`
4. No TypeScript errors if using TS
5. Browser console for runtime errors

**Constitution Compliance**: This quickstart follows mobile-first design (Principle III) and progressive enhancement (Principle V).
