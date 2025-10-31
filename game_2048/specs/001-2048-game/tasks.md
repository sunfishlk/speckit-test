# Tasks: 2048 Web Game

**Input**: Design documents from `/specs/001-2048-game/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Tests are OPTIONAL per constitution - not included unless explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `src/` at repository root (frontend-only, no backend)
- All source files in `src/`, organized by type (components, hooks, game logic, utils, styles)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Vite + React project using npm create vite
- [X] T002 Install dependencies (react, react-dom, vitest, @testing-library/react)
- [X] T003 [P] Configure Vite config in vite.config.js for testing support
- [X] T004 [P] Create test setup file in tests/setup.js
- [X] T005 [P] Update package.json scripts (dev, build, test, preview)
- [X] T006 Create project directory structure (src/components, src/hooks, src/game, src/utils, src/styles, tests/unit, tests/integration)
- [X] T007 [P] Create public/index.html with meta tags for mobile viewport

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create game constants in src/game/constants.js (GRID_SIZE=4, TILE_VALUES, SPAWN_PROBABILITY)
- [X] T009 [P] Implement localStorage wrapper in src/utils/storage.js (loadBestScore, saveBestScore with error handling)
- [X] T010 [P] Create Grid utility functions in src/game/gridUtils.js (getEmptyCells, rotateGrid, generateTileId)
- [X] T011 Implement core game logic functions in src/game/gameLogic.js (initializeGame, slideLeft, slideAndMerge, isValidMove)
- [X] T012 [P] Implement win/loss detection in src/game/gameLogic.js (isGameWon, isGameLost)
- [X] T013 [P] Implement tile spawning in src/game/gameLogic.js (spawnRandomTile with 90/10 probability)
- [X] T014 Create game reducer in src/hooks/useGameState.js (gameReducer handling MOVE, NEW_GAME, CONTINUE_AFTER_WIN, UPDATE_BEST_SCORE)
- [X] T015 Implement useGameState hook in src/hooks/useGameState.js (wraps useReducer with game logic)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Play Basic 2048 Game (Priority: P1) 🎯 MVP

**Goal**: Implement core gameplay - 4x4 grid, tile movement, merging, scoring, win/loss detection

**Independent Test**: Load game → see 4x4 grid with 2 tiles → use arrow keys → tiles slide/merge → score updates → reach 2048 or game over

### Implementation for User Story 1

- [X] T016 [P] [US1] Create Tile component in src/components/Tile.jsx (displays tile value, uses tile.id as key)
- [X] T017 [P] [US1] Create Tile CSS in src/styles/Tile.css (basic styling, color by value)
- [X] T018 [US1] Create Grid component in src/components/Grid.jsx (renders 4x4 grid of Tiles, maps grid state to Tile components)
- [X] T019 [P] [US1] Create Grid CSS in src/styles/Grid.css (4x4 grid layout using CSS Grid)
- [X] T020 [US1] Create ScoreBoard component in src/components/ScoreBoard.jsx (displays current score and best score)
- [X] T021 [US1] Implement keyboard input hook in src/hooks/useKeyboard.js (listens for arrow keys, calls onMove callback)
- [X] T022 [P] [US1] Implement touch input hook in src/hooks/useTouch.js (detects swipe direction with 50px threshold, prevents page scroll)
- [X] T023 [US1] Create Game container component in src/components/Game.jsx (uses useGameState, useKeyboard, useTouch, renders Grid and ScoreBoard)
- [X] T024 [P] [US1] Create Game CSS in src/styles/Game.css (mobile-first responsive layout, 320px+ support)
- [X] T025 [US1] Implement move handler in src/components/Game.jsx (dispatch MOVE action, handle invalid moves)
- [X] T026 [US1] Implement win/loss UI in src/components/Game.jsx (show overlay when status='won' or status='lost')
- [X] T027 [US1] Integrate Game component into src/App.jsx
- [X] T028 [US1] Create global styles in src/index.css (mobile-first base styles, viewport setup)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - complete 2048 game playable with keyboard/touch

---

## Phase 4: User Story 2 - Game Controls & Restart (Priority: P2)

**Goal**: Add "New Game" button, best score persistence, prevent page scrolling on mobile

**Independent Test**: Play game → click "New Game" → grid resets → best score persists → mobile swipes don't scroll page

### Implementation for User Story 2

- [ ] T029 [P] [US2] Create GameControls component in src/components/GameControls.jsx (New Game button, game status display)
- [ ] T030 [US2] Add GameControls to Game component in src/components/Game.jsx (wire up NEW_GAME action)
- [ ] T031 [US2] Implement best score update logic in src/components/Game.jsx (dispatch UPDATE_BEST_SCORE on game end, call saveBestScore)
- [ ] T032 [US2] Load best score on mount in src/components/Game.jsx (useEffect to load from localStorage)
- [ ] T033 [P] [US2] Add touchmove preventDefault in src/hooks/useTouch.js (prevent page scroll during game swipes)
- [ ] T034 [US2] Add continue button to win overlay in src/components/Game.jsx (dispatch CONTINUE_AFTER_WIN action)
- [ ] T035 [P] [US2] Style GameControls in src/styles/Game.css (mobile-friendly button sizing, 44x44px touch targets)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - game has full UX controls and persistence

---

## Phase 5: User Story 3 - Smooth Animations & Visual Polish (Priority: P3)

**Goal**: Add CSS animations for tile movement, merging, and spawning at 60fps

**Independent Test**: Make moves → tiles animate smoothly → merges have scale effect → new tiles fade in → all at 60fps

### Implementation for User Story 3

- [ ] T036 [P] [US3] Add tile movement animations in src/styles/Tile.css (transform transitions with translate3d, 150ms duration)
- [ ] T037 [P] [US3] Add tile merge animation in src/styles/Tile.css (scale keyframe animation for isMerged flag)
- [ ] T038 [P] [US3] Add tile spawn animation in src/styles/Tile.css (fade-in/scale-in for isNew flag)
- [ ] T039 [P] [US3] Add GPU acceleration hints in src/styles/Tile.css (will-change: transform)
- [ ] T040 [US3] Implement animation flag reset in src/components/Tile.jsx (clear isNew/isMerged after transitionend)
- [ ] T041 [P] [US3] Add score change animation in src/styles/Game.css (score number transition)
- [ ] T042 [P] [US3] Add game overlay animations in src/styles/Game.css (fade-in for win/loss overlays)
- [ ] T043 [P] [US3] Optimize CSS for 60fps in src/styles/Tile.css (use only transform and opacity properties)

**Checkpoint**: All user stories should now be independently functional with polished animations

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T044 [P] Add responsive breakpoint styles in src/index.css (desktop 768px+ adjustments)
- [ ] T045 [P] Add tile color scheme in src/styles/Tile.css (distinct colors for each tile value 2-2048)
- [ ] T046 [P] Add WCAG AA contrast compliance check to all color combinations in src/styles/
- [ ] T047 [P] Optimize bundle size (verify React production build <200kb gzipped)
- [ ] T048 [P] Add meta tags for PWA in public/index.html (optional - theme-color, apple-touch-icon)
- [ ] T049 Test game on mobile devices (iOS Safari, Android Chrome) and verify 60fps animations
- [ ] T050 [P] Add README.md with game rules, how to play, development setup
- [ ] T051 Run quickstart.md validation (verify setup steps work from clean state)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 components but can be implemented independently
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Adds animations to US1 components but doesn't break core functionality

### Within Each User Story

**User Story 1 (Core Gameplay)**:
1. T016-T017 (Tile component + CSS) - can run in parallel
2. T018-T019 (Grid component + CSS) - depends on Tile, can run in parallel with each other
3. T020 (ScoreBoard) - independent, can run in parallel with T018-T019
4. T021-T022 (Input hooks) - can run in parallel
5. T023-T024 (Game container + CSS) - depends on all above
6. T025-T026 (Move handler + win/loss UI) - sequential, depends on T023
7. T027-T028 (Integration) - final steps

**User Story 2 (Controls & Restart)**:
1. T029 (GameControls component) - can start immediately after US1 T023
2. T030-T034 (Integration tasks) - sequential
3. T035 (Styling) - can run in parallel with T030-T034

**User Story 3 (Animations)**:
1. T036-T039 (CSS animations) - all can run in parallel
2. T040 (Animation flag reset) - depends on T036-T039
3. T041-T043 (Additional animations and optimizations) - can run in parallel

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within US1: T016-T017, T018-T019, T020, T021-T022 can all run in parallel
- Within US2: T029, T033, T035 can run in parallel
- Within US3: T036-T039, T041-T043 can all run in parallel

---

## Parallel Example: User Story 1 Core Components

```bash
# Launch all independent components for User Story 1 together:
Task: "Create Tile component in src/components/Tile.jsx"
Task: "Create Tile CSS in src/styles/Tile.css"
Task: "Create ScoreBoard component in src/components/ScoreBoard.jsx"
Task: "Implement keyboard input hook in src/hooks/useKeyboard.js"
Task: "Implement touch input hook in src/hooks/useTouch.js"

# Then once above complete, launch:
Task: "Create Grid component in src/components/Grid.jsx" (needs Tile)
Task: "Create Grid CSS in src/styles/Grid.css"

# Then once Grid complete:
Task: "Create Game container component in src/components/Game.jsx" (needs all above)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T015) - CRITICAL blocks all stories
3. Complete Phase 3: User Story 1 (T016-T028)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo playable 2048 game

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (T016-T028) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (T029-T035) → Test independently → Deploy/Demo (improved UX)
4. Add User Story 3 (T036-T043) → Test independently → Deploy/Demo (polished game)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T015)
2. Once Foundational is done:
   - Developer A: User Story 1 Core (T016-T024)
   - Developer B: User Story 1 Input hooks (T021-T022) + Polish tasks
   - Developer C: Start User Story 2 components (T029)
3. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 51

**By Phase**:
- Setup: 7 tasks
- Foundational: 8 tasks (BLOCKING)
- User Story 1 (P1 - MVP): 13 tasks
- User Story 2 (P2): 7 tasks
- User Story 3 (P3): 8 tasks
- Polish: 8 tasks

**By User Story**:
- US1 (Core Gameplay): 13 tasks - **This is your MVP**
- US2 (Controls & Restart): 7 tasks - UX enhancement
- US3 (Animations): 8 tasks - Visual polish

**Parallel Opportunities**: 29 tasks marked [P] can run in parallel with other tasks

**Critical Path**: Setup → Foundational → US1 → US2 → US3 → Polish (sequential phases, but tasks within stories can parallelize)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No tests included (per constitution - tests optional unless requested)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Focus on US1 first for fastest path to playable MVP
