# Tasks: 3D House Viewer

**Input**: Design documents from `/specs/001-3d-house-viewer/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Performance tests are MANDATORY per constitution. No unit/integration tests requested in spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single project structure: `src/`, `tests/`, `public/` at repository root per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize React + Vite project with package.json dependencies (React 18+, Three.js, @react-three/fiber, @react-three/drei, GSAP 3.x, Stats.js)
- [X] T002 [P] Configure Vite build settings in vite.config.js (GLTF asset handling, Draco decoder paths, tree-shaking for Three.js modules)
- [X] T003 [P] Configure ESLint with strict rules in .eslintrc.js (enforce JSDoc comments, naming conventions, no dead code)
- [X] T004 [P] Create project directory structure per plan.md (src/components, src/core, src/loaders, src/controllers, src/utils, src/types, src/config, src/assets, tests/performance, public/models, public/draco)
- [X] T005 [P] Setup public/index.html entry point with canvas container
- [X] T006 [P] Create public/styles.css with global styles and CSS reset
- [X] T007 [P] Download and place Draco decoder WASM files in public/draco/

**Checkpoint**: Project structure ready, dependencies installed, build system configured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 [P] Define JSDoc type definitions in src/types/index.js (Vector3, BoundingBox, HouseModel, Viewpoint, CameraState, CameraConstraints, SceneConfiguration, LoadingState)
- [X] T009 [P] Create configuration constants in src/utils/constants.js (default camera settings, performance targets, animation durations, interaction thresholds)
- [X] T010 [P] Implement performance monitoring utility in src/utils/performance-monitor.js (FPS tracking, memory usage, draw calls, triangle count)
- [X] T011 [P] Create animation utilities in src/utils/animation-utils.js (easing helpers, camera path optimization, transition utilities)
- [X] T012 Create React Context for viewer state in src/context/ViewerContext.jsx (state structure per data-model.md: currentModel, viewpoints, activeViewpoint, camera, scene, loading, ui, performance)
- [X] T013 Implement React ErrorBoundary component in src/components/ErrorBoundary.jsx (catch rendering errors, display user-friendly fallback UI)
- [X] T014 [P] Create WebGL capability detection utility in src/utils/webgl-detection.js (check WebGL support, detect version, return capability info)
- [X] T015 [P] Implement LoadingIndicator component in src/components/LoadingIndicator.jsx (progress bar, percentage display, loading animation)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic 3D House Viewing (Priority: P1) 🎯 MVP

**Goal**: Load and render a 3D house model in the browser from a default viewpoint, enabling remote property visualization

**Independent Test**: Open application with sample house model, verify 3D rendering appears within 3 seconds, confirm textures and lighting are visible, test on desktop and mobile devices

### Performance Tests for User Story 1 (MANDATORY)

> **NOTE: Setup performance benchmarks BEFORE implementing core features**

- [X] T016 [P] [US1] Create FPS benchmark in tests/performance/fps-benchmark.js (measure FPS during initial render, record baseline metrics)
- [X] T017 [P] [US1] Create load time benchmark in tests/performance/load-benchmark.js (measure model fetch time, parse time, first render time, validate <3s target)
- [X] T018 [P] [US1] Create memory benchmark in tests/performance/memory-benchmark.js (measure heap size before/after model load, detect memory leaks, validate <1GB desktop/<500MB mobile)

### Implementation for User Story 1

- [X] T019 [P] [US1] Implement ModelLoader class in src/loaders/model-loader.js per contracts/model-loader.md (GLTFLoader with Draco support, load() method, loadWithMetadata() method, progress tracking, error handling, caching)
- [X] T020 [P] [US1] Implement SceneManager class in src/core/scene-manager.js per contracts/scene-manager.md (scene initialization, lighting setup per SceneConfiguration from data-model.md, addObject/removeObject methods, dispose method)
- [X] T021 [P] [US1] Implement RendererManager class in src/core/renderer-manager.js (WebGL renderer configuration, antialias/shadow settings, pixel ratio handling, resize handling)
- [X] T022 [US1] Create Viewer3D component in src/components/Viewer3D.jsx (Canvas from React Three Fiber, integrate SceneManager, setup default camera, render loop, WebGL error handling)
- [X] T023 [US1] Configure default viewpoint in src/config/viewpoints.js (define DEFAULT_VIEWPOINT with position, target, fov per Viewpoint entity from data-model.md)
- [X] T024 [US1] Create sample HouseModel configuration in src/config/models.js (define default house model metadata per HouseModel entity from data-model.md)
- [ ] T025 [US1] Integrate ModelLoader into Viewer3D component (load model on mount, display LoadingIndicator during fetch, handle load errors with ErrorBoundary, add loaded model to scene)
- [ ] T026 [US1] Implement responsive canvas sizing in src/components/Viewer3D.jsx (handle window resize, maintain aspect ratio, adjust renderer pixel ratio based on device)
- [ ] T027 [US1] Create main App.jsx entry point (setup ViewerContext provider, render Viewer3D, configure initial model URL)
- [ ] T028 [US1] Add loading state management to ViewerContext (implement LoadingState transitions per data-model.md: idle → loading → loaded/error)
- [ ] T029 [US1] Run FPS, load time, and memory benchmarks for User Story 1 (validate 30+ FPS, <3s load, memory within limits)

**Checkpoint**: At this point, User Story 1 should be fully functional - 3D house model loads and renders from default viewpoint, meets performance targets

---

## Phase 4: User Story 2 - Mouse-based 3D Interaction (Priority: P2)

**Goal**: Enable users to explore the house using mouse controls (orbit, zoom, pan) for hands-on property assessment

**Independent Test**: Load 3D house model, perform left-click drag (verify orbit), scroll wheel (verify smooth zoom), right-click drag (verify pan), release mouse (verify damping stops smoothly), validate <100ms interaction response

### Performance Tests for User Story 2 (MANDATORY)

- [ ] T030 [P] [US2] Extend FPS benchmark in tests/performance/fps-benchmark.js (measure FPS during orbit, zoom, pan interactions, validate 30+ FPS mid-range/60 FPS desktop targets)
- [ ] T031 [P] [US2] Create interaction response benchmark in tests/performance/interaction-benchmark.js (measure input latency for mouse events, validate <100ms visual feedback)

### Implementation for User Story 2

- [ ] T032 [US2] Implement OrbitController wrapper in src/controllers/orbit-controller.js (integrate @react-three/drei OrbitControls, configure damping, set zoom limits from CameraConstraints, set pan bounds, enable right-click pan)
- [ ] T033 [US2] Calculate camera constraints from model bounding box in src/utils/camera-utils.js (compute minDistance/maxDistance based on model size, compute panBounds from boundingBox, prevent camera going underground)
- [ ] T034 [US2] Integrate OrbitControls into Viewer3D component (add OrbitControls from Drei to Canvas, pass camera constraints, handle enablePan setting)
- [ ] T035 [US2] Implement visual feedback for interactions in src/components/Viewer3D.jsx (cursor changes on hover, damping configuration for smooth stop)
- [ ] T036 [US2] Update CameraState in ViewerContext during manual control (sync camera position/target on user interaction, set activeViewpoint to null when user manually controls camera)
- [ ] T037 [US2] Add constraint validation in src/utils/camera-utils.js (enforce minDistance/maxDistance, enforce polar angle limits, enforce pan bounds)
- [ ] T038 [US2] Implement debounced performance monitoring in src/utils/performance-monitor.js (throttle Stats.js updates to 16ms, display FPS overlay with backtick key toggle)
- [ ] T039 [US2] Run FPS and interaction benchmarks for User Story 2 (validate smooth 30+ FPS during all mouse interactions, <100ms response time)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can view house model and interactively explore it with mouse

---

## Phase 5: User Story 3 - Preset Viewpoint Switching (Priority: P3)

**Goal**: Provide quick navigation to predefined viewpoints (e.g., front entrance, living room) for efficient guided property tours

**Independent Test**: Load 3D house model, click on viewpoint selection buttons, verify smooth camera transition (<1s), test multiple sequential viewpoint switches, confirm camera returns to exact predefined position/orientation

### Performance Tests for User Story 3 (MANDATORY)

- [ ] T040 [P] [US3] Create viewpoint transition benchmark in tests/performance/transition-benchmark.js (measure animation duration, measure frame rate during transitions, validate <1s completion and smooth 60 FPS)

### Implementation for User Story 3

- [ ] T041 [US3] Implement CameraController class in src/core/camera-controller.js per contracts/camera-controller.md (setViewpoint() with GSAP animation, getCurrentState() method, isAnimating() tracking, stopAnimation() method, reset() method, lookAt() method, event emitters for viewpoint-start/complete/camera-move)
- [ ] T042 [US3] Configure preset viewpoints in src/config/viewpoints.js (define 5-10 viewpoints per Viewpoint entity from data-model.md: front entrance, living room, kitchen, bedroom, backyard, etc. with proper positions, targets, FOV, categories, ordering)
- [ ] T043 [US3] Create ViewportControls UI component in src/components/ViewportControls.jsx (render viewpoint list from config, button for each viewpoint with name/icon, highlight active viewpoint, handle viewpoint selection clicks)
- [ ] T044 [US3] Integrate CameraController into Viewer3D component (instantiate CameraController with camera and constraints, connect to ViewerContext for state sync)
- [ ] T045 [US3] Implement viewpoint selection handler in src/components/ViewportControls.jsx (call CameraController.setViewpoint() on button click, update ViewerContext activeViewpoint, handle rapid sequential clicks, disable controls during animation)
- [ ] T046 [US3] Add GSAP camera animation in CameraController (animate camera position with power2.inOut easing, animate target/lookAt point, animate FOV if changed, set 0.8s default duration per research.md, support onComplete callback)
- [ ] T047 [US3] Update ViewerContext on viewpoint transitions (sync activeViewpoint ID, set CameraState.isAnimating flag during transition, emit events for transition start/complete)
- [ ] T048 [US3] Add viewpoint hover preview in ViewportControls component (show tooltip with viewpoint description, optional preview thumbnail if available)
- [ ] T049 [US3] Implement animation interruption handling in CameraController (allow user to interrupt animation with mouse drag, kill GSAP tweens on new interaction, blend smoothly to user control)
- [ ] T050 [US3] Run viewpoint transition benchmarks for User Story 3 (validate <1s transitions, 60 FPS during animation, smooth easing)

**Checkpoint**: All user stories should now be independently functional - complete 3D house viewer with viewing, interaction, and guided navigation

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final production readiness

- [ ] T051 [P] Implement texture compression support in src/loaders/texture-loader.js (KTX2 format loading with BasisTextureLoader, fallback to standard textures, 50-75% size reduction)
- [ ] T052 [P] Add LOD (Level of Detail) support in SceneManager (THREE.LOD for multi-resolution models, distance-based switching, performance optimization for large models)
- [ ] T053 [P] Implement adaptive quality settings in src/utils/performance-monitor.js (detect low FPS <30, auto-reduce shadow quality/texture size/pixel ratio, notify user of quality adjustments)
- [ ] T054 [P] Add touch controls support in src/controllers/orbit-controller.js (touch gestures for mobile orbit/zoom/pan, pinch-to-zoom, two-finger pan)
- [ ] T055 [P] Implement keyboard navigation for accessibility in src/components/ViewportControls.jsx (arrow keys to navigate viewpoint list, Enter to select, Tab navigation, focus indicators)
- [ ] T056 [P] Add proper ARIA labels and semantic HTML in UI components (accessible labels for viewpoint buttons, screen reader descriptions, alt text for icons)
- [ ] T057 [P] Create fallback UI for WebGL unsupported browsers in src/components/FallbackMessage.jsx (static property images, friendly error message, browser upgrade suggestions)
- [ ] T058 [P] Implement WebGL context lost/restore handlers in src/core/renderer-manager.js (listen for webglcontextlost event, display message, restore renderer on webglcontextrestored)
- [ ] T059 Add error recovery for model load failures in src/loaders/model-loader.js (retry mechanism with exponential backoff, detailed error messages, user-friendly fallback)
- [ ] T060 [P] Optimize bundle size in vite.config.js (tree-shake unused Three.js modules, lazy load GSAP, code splitting for large components, analyze with rollup-plugin-visualizer)
- [ ] T061 [P] Add Stats.js performance overlay toggle in src/components/Viewer3D.jsx (backtick key to show/hide FPS/memory stats, positioned top-left corner, styled for visibility)
- [ ] T062 Code cleanup and JSDoc documentation review (verify all public APIs have JSDoc comments, consistent naming conventions, remove any dead code)
- [ ] T063 Run full performance benchmark suite across all user stories (FPS, load time, memory, transitions, interactions - validate all targets met)
- [ ] T064 Cross-browser testing (Chrome, Safari, Firefox, Edge latest 2 versions, verify WebGL compatibility, test on macOS/Windows/Linux)
- [ ] T065 Responsive testing on multiple devices (desktop 1920x1080, laptop 1366x768, tablet 1024x768, mobile 375x667, verify rendering and controls work)
- [ ] T066 Validate quickstart.md instructions (fresh clone, npm install, npm run dev, verify app runs, test all manual checklist items from quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational (Phase 2) completion
  - User stories CAN proceed in parallel (if team has multiple developers)
  - OR sequentially in priority order: US1 (P1) → US2 (P2) → US3 (P3)
- **Polish (Phase 6)**: Depends on all user stories (Phase 3-5) being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on Foundational (Phase 2) - No dependencies on other user stories
- **User Story 2 (P2)**: Depends only on Foundational (Phase 2) - Enhances US1 but independently testable
- **User Story 3 (P3)**: Depends only on Foundational (Phase 2) - Enhances US1/US2 but independently testable

### Within Each User Story

**User Story 1**:
- Performance test setup (T016-T018) can all run in parallel [P]
- Core implementation (T019-T021) can run in parallel [P] → blocking for T022-T029
- T022 (Viewer3D) must complete before T025 (integration)
- T025 must complete before T026-T028
- T029 (benchmarks) must be last

**User Story 2**:
- Performance test setup (T030-T031) can run in parallel [P]
- T032-T033 can run in parallel, then T034
- T035-T038 follow sequentially
- T039 (benchmarks) must be last

**User Story 3**:
- T040 (performance test) runs independently [P]
- T041-T042 can run in parallel [P]
- T043-T044 can run in parallel [P]
- T045-T049 follow sequentially
- T050 (benchmarks) must be last

### Parallel Opportunities

**Phase 1 (Setup)**: T002, T003, T004, T005, T006, T007 all marked [P] can run in parallel after T001

**Phase 2 (Foundational)**: T008, T009, T010, T011, T014, T015 all marked [P] can run in parallel

**User Story 1**: T016, T017, T018 (tests) and T019, T020, T021 (core modules) can all run in parallel

**User Story 2**: T030, T031 (tests) can run in parallel

**User Story 3**: T041, T042 (controller + config) and T043, T044 (UI components) can run in parallel

**Phase 6 (Polish)**: T051-T061 (most polish tasks) marked [P] can run in parallel

**Cross-Story Parallelism**: Once Phase 2 completes, US1, US2, and US3 can be worked on by different developers simultaneously

---

## Parallel Example: User Story 1

```bash
# Launch all performance test setup together:
Task: "T016 [P] [US1] Create FPS benchmark in tests/performance/fps-benchmark.js"
Task: "T017 [P] [US1] Create load time benchmark in tests/performance/load-benchmark.js"  
Task: "T018 [P] [US1] Create memory benchmark in tests/performance/memory-benchmark.js"

# Launch all core modules together:
Task: "T019 [P] [US1] Implement ModelLoader class in src/loaders/model-loader.js"
Task: "T020 [P] [US1] Implement SceneManager class in src/core/scene-manager.js"
Task: "T021 [P] [US1] Implement RendererManager class in src/core/renderer-manager.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T015) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T016-T029)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Load sample house model
   - Verify 3D rendering works
   - Run performance benchmarks
   - Test on desktop and mobile
5. Deploy/demo basic 3D house viewer

### Incremental Delivery

1. **Foundation**: Setup + Foundational → Project structure ready
2. **MVP Release**: Add User Story 1 → Test independently → Deploy (basic viewing capability)
3. **Enhanced Release**: Add User Story 2 → Test independently → Deploy (add mouse interactions)
4. **Full Release**: Add User Story 3 → Test independently → Deploy (add guided navigation)
5. **Production**: Add Phase 6 Polish → Final testing → Production release

Each increment adds measurable value and can be demonstrated/shipped independently.

### Parallel Team Strategy

With 2-3 developers after Foundational phase completes:

1. **All developers**: Complete Phase 1 + Phase 2 together (foundational work)
2. **Once Phase 2 done, split work**:
   - **Developer A**: User Story 1 (T016-T029) - Core viewing
   - **Developer B**: User Story 2 (T030-T039) - Mouse interactions  
   - **Developer C**: User Story 3 (T040-T050) - Viewpoint switching
3. **Stories complete independently**, then integrate
4. **All developers**: Phase 6 Polish together

---

## Performance Validation Checklist

Before considering feature complete, ALL performance targets MUST be met:

- [ ] FPS: 30+ on mid-range devices during all interactions (target 60 on desktop)
- [ ] Load Time: <3s for models (including fetch + parse + first render)
- [ ] Memory: <1GB desktop, <500MB mobile (no memory leaks)
- [ ] Interaction Response: <100ms visual feedback for all mouse actions
- [ ] Transitions: <1s for viewpoint switches with smooth 60 FPS
- [ ] First Contentful Paint: <1.5s
- [ ] Browser Compatibility: 95%+ on Chrome, Safari, Firefox, Edge (latest 2 versions)

---

## Notes

- **[P] tasks**: Different files, no dependencies, can run in parallel
- **[Story] label**: Maps task to specific user story (US1, US2, US3) for traceability
- **Performance tests MANDATORY**: Constitution requires performance benchmarks before merge
- **Each user story independently testable**: Can stop after any phase and have working feature
- **Verify targets met**: Run benchmarks after each user story phase
- **Commit frequently**: After each task or logical group of tasks
- **JSDoc required**: All public APIs must have JSDoc comments (mitigates TypeScript absence)
- **No unit/integration tests**: Not requested in spec, focus on performance tests

---

## Task Count Summary

- **Phase 1 (Setup)**: 7 tasks
- **Phase 2 (Foundational)**: 8 tasks  
- **Phase 3 (User Story 1)**: 14 tasks (3 performance tests + 11 implementation)
- **Phase 4 (User Story 2)**: 10 tasks (2 performance tests + 8 implementation)
- **Phase 5 (User Story 3)**: 11 tasks (1 performance test + 10 implementation)
- **Phase 6 (Polish)**: 16 tasks

**Total**: 66 tasks

**Parallel opportunities**: 32 tasks marked [P] can run in parallel within their phases

**MVP scope (recommended)**: Phase 1 + Phase 2 + Phase 3 = 29 tasks
