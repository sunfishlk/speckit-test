# Implementation Plan: 2048 Web Game

**Branch**: `001-2048-game` | **Date**: 2025-10-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-2048-game/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a fully-functional 2048 puzzle game as a React web application. The game features a 4x4 grid where players combine tiles with matching numbers by swiping (mobile) or using arrow keys (desktop). Built with React for component architecture, using React hooks for state management, and CSS animations for smooth 60fps tile movements. The implementation prioritizes mobile-first design with progressive enhancement for desktop.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: JavaScript ES6+ with React 18.x  
**Primary Dependencies**: React 18, React DOM (no additional frameworks - per Progressive Enhancement principle)  
**Storage**: localStorage for best score persistence  
**Testing**: NEEDS CLARIFICATION - Jest + React Testing Library (standard React testing) or Vitest  
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, mobile browsers)
**Project Type**: web (frontend-only single-page application)  
**Performance Goals**: 60fps animations, <16ms game logic execution per move, <1s initial load  
**Constraints**: Mobile-first (works on 320px+ screens), touch and keyboard controls, no backend required  
**Scale/Scope**: Single-player browser game, ~10-15 React components, <2000 LOC total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Component-Based UI Architecture ✅
**Status**: PASS  
**Evidence**: Plan uses React components (Grid, Tile, ScoreBoard, GameControls, etc.) with clear separation. Each component has single responsibility.

### II. State Management Clarity ✅
**Status**: PASS  
**Evidence**: Using React hooks (useState, useReducer) for centralized game state. State updates through explicit actions, UI renders reactively.

### III. Mobile-First Responsive Design ✅
**Status**: PASS  
**Evidence**: Touch controls are primary (FR-004), keyboard secondary (FR-003). Responsive design from 320px+ (SC-006).

### IV. Performance & Smooth Animations ✅
**Status**: PASS  
**Evidence**: 60fps requirement explicit (FR-014, SC-002). <16ms game logic (performance goal). CSS transforms planned for GPU acceleration.

### V. Progressive Enhancement ⚠️
**Status**: NEEDS JUSTIFICATION  
**Issue**: React framework dependency conflicts with "core gameplay MUST work without frameworks" principle  
**Justification**: React chosen per user requirement ("react框架制作"). Modern React with hooks is lightweight. Core game logic will be pure JavaScript functions (testable, framework-independent). React used only for rendering layer. Alternative vanilla JS approach would require manual DOM management, conflicting with State Management Clarity principle.

**GATE DECISION**: CONDITIONAL PASS - Proceed with React but isolate game logic from framework.

## Project Structure

### Documentation (this feature)

```text
specs/001-2048-game/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (created)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (optional - no backend API)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── components/
│   ├── Game.jsx           # Main game container
│   ├── Grid.jsx           # 4x4 grid container
│   ├── Tile.jsx           # Individual tile component
│   ├── ScoreBoard.jsx     # Score and best score display
│   └── GameControls.jsx   # New game button, game status
├── hooks/
│   ├── useGameState.js    # Game state management hook
│   ├── useKeyboard.js     # Keyboard input hook
│   └── useTouch.js        # Touch gesture hook
├── game/
│   ├── gameLogic.js       # Pure functions: move, merge, spawn
│   ├── gridUtils.js       # Grid manipulation utilities
│   └── constants.js       # Grid size, tile values, probabilities
├── utils/
│   └── storage.js         # localStorage wrapper for best score
├── styles/
│   ├── Game.css
│   ├── Grid.css
│   └── Tile.css
├── App.jsx
├── index.jsx
└── index.css

tests/
├── unit/
│   ├── gameLogic.test.js
│   ├── gridUtils.test.js
│   └── components/
├── integration/
│   └── gameplay.test.js
└── setup.js

public/
├── index.html
└── manifest.json          # PWA manifest (optional enhancement)
```

**Structure Decision**: Web application structure (frontend-only). No backend needed as game logic runs entirely client-side. Using standard React project layout with clear separation:
- `/src/components/` - React UI components (per Constitution I)
- `/src/game/` - Pure game logic functions (framework-independent, testable)
- `/src/hooks/` - React hooks for state and input handling
- `/src/utils/` - Utility functions (storage)
- `/tests/` - Unit and integration tests

This structure supports Constitution principles: component isolation, testable game logic, and clear state management.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| React framework (violates Progressive Enhancement Principle V) | User explicitly requested "react框架制作" (React framework). React provides component architecture (Principle I) and state management clarity (Principle II). | Vanilla JS would require manual DOM updates and event handling, conflicting with State Management Clarity principle. React's declarative rendering and hooks provide cleaner architecture with minimal overhead (~140kb gzipped). Core game logic remains framework-independent in `/src/game/`. |
