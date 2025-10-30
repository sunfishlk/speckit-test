<!--
Sync Impact Report:
Version Change: 1.0.0 → 2.0.0
Modified Principles:
  - I. "Three.js 架构优先" → "Code Quality Standards (NON-NEGOTIABLE)"
  - II. "模块化设计" → "Testing Standards (NON-NEGOTIABLE)"
  - III. "视角切换系统" → "User Experience Consistency"
  - IV. "性能优化" → "Performance Requirements"
  - V. "用户体验" → (removed, merged into III)
Added Sections:
  - "Testing Standards" as core principle II
  - "Quality Gates" section
  - Detailed amendment procedure in Governance
Removed Sections:
  - Original principle V merged into III
  - "开发规范" restructured into principles
Templates Status:
  ✅ plan-template.md - Constitution Check section aligns with new principles
  ✅ spec-template.md - Requirements section aligns with testing standards
  ✅ tasks-template.md - Task organization supports test-first workflow
Follow-up TODOs:
  - None - all placeholders filled
-->

# 3D Watch (3D看房) Constitution

## Core Principles

### I. Code Quality Standards (NON-NEGOTIABLE)

**Rationale**: High code quality ensures maintainability, reduces bugs, and enables team collaboration in a complex 3D rendering environment.

The project MUST adhere to:

- **TypeScript First**: All new code MUST be written in TypeScript with strict mode enabled. Type `any` is prohibited except with documented justification.
- **Three.js Best Practices**: Scene, Camera, and Renderer MUST be separated. Use Three.js native features before custom abstractions.
- **Modular Architecture**: Each module (SceneManager, CameraController, ModelLoader) MUST have single responsibility and clear interfaces.
- **Code Reviews**: All changes MUST be reviewed before merge. Reviewer MUST verify constitution compliance.
- **Naming Conventions**:
  - Classes: PascalCase (e.g., `CameraController`)
  - Methods/variables: camelCase (e.g., `switchViewpoint`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_TEXTURE_SIZE`)
  - Files: kebab-case (e.g., `camera-controller.ts`)
- **No Dead Code**: Unused imports, variables, or functions MUST be removed before commit.
- **Documentation**: Public APIs MUST have JSDoc comments explaining purpose, parameters, and return values.

### II. Testing Standards (NON-NEGOTIABLE)

**Rationale**: Tests ensure features work as intended and prevent regressions in critical 3D rendering and interaction logic.

The project MUST follow:

- **Test Categories**:
  - **Unit Tests**: Core logic, utilities, data transformations (if requested in spec)
  - **Integration Tests**: Module interactions, scene lifecycle, camera transitions (if requested in spec)
  - **Performance Tests**: Frame rate, memory usage, load times (MANDATORY for performance-critical features)
- **Test Requirements**:
  - Tests MUST be written BEFORE implementation when explicitly requested in feature spec
  - Performance tests MUST validate against constitution standards (see Section IV)
  - Tests MUST run in CI/CD pipeline
  - Failing tests BLOCK merges
- **Coverage Goals** (when tests are requested):
  - Core modules: 80% line coverage minimum
  - Utilities: 90% line coverage minimum
  - UI/interaction code: Best-effort coverage
- **Test Naming**: `test_[module]_[scenario]_[expected_result]`

### III. User Experience Consistency

**Rationale**: Consistent UX across devices and interactions ensures users can intuitively navigate 3D spaces.

The project MUST provide:

- **Responsive Design**: Application MUST work on mobile (iOS Safari 14+, Chrome Android 90+) and desktop (Chrome, Edge, Safari, Firefox latest 2 versions).
- **Interaction Feedback**:
  - Loading states MUST show progress indicators
  - Camera transitions MUST be smooth (no jarring jumps)
  - User actions MUST provide visual feedback within 100ms
- **Accessibility**:
  - Keyboard navigation MUST be supported for primary interactions
  - Controls MUST have clear labels
  - Error messages MUST be user-friendly and actionable
- **Visual Consistency**:
  - UI components MUST follow a unified design system
  - Colors, fonts, and spacing MUST be defined in configuration
  - Dark/light mode support if specified in feature requirements

### IV. Performance Requirements

**Rationale**: Poor performance degrades user experience and prevents adoption, especially on mobile devices.

The project MUST meet these benchmarks:

- **Frame Rate**:
  - Desktop: Target 60 FPS, minimum 30 FPS
  - Mobile: Target 30 FPS, minimum 24 FPS
  - Measured via Stats.js or Chrome DevTools
- **Loading Times**:
  - First contentful paint: < 1.5s
  - Model initial load: < 3s with progress indicator
  - View transitions: < 300ms
- **Memory Usage**:
  - Desktop: < 1GB total
  - Mobile: < 500MB total
  - No memory leaks (verify with Chrome DevTools heap snapshots)
- **Optimization Strategies MUST Include**:
  - LOD (Level of Detail) for models > 100K polygons
  - Texture compression (basis, ktx2 formats)
  - Frustum culling for off-screen objects
  - Lazy loading for non-critical assets
  - Debouncing/throttling for event handlers
- **Performance Testing**: New features affecting rendering MUST include performance benchmarks before merge.

## Quality Gates

All features MUST pass these gates before merging:

1. **Constitution Compliance**: Code review MUST verify adherence to all four principles.
2. **TypeScript Compilation**: Zero errors with `strict: true`.
3. **Linting**: Zero ESLint errors (warnings allowed if justified).
4. **Performance Validation**: Metrics MUST meet Section IV benchmarks on target devices.
5. **Browser Testing**: MUST pass manual testing on Chrome, Safari, Firefox (desktop + mobile).
6. **Documentation**: Public APIs and complex logic MUST have JSDoc comments.

## Technology Standards

### Core Stack

- **Rendering**: Three.js (latest stable)
- **Language**: TypeScript 5.x with strict mode
- **Build**: Vite (preferred) or Webpack
- **Model Formats**: GLTF/GLB (primary), FBX/OBJ (secondary)

### Project Structure

```
src/
├── core/          # Scene, Camera, Renderer initialization
├── controllers/   # CameraController, InteractionController
├── loaders/       # Model and asset loaders
├── utils/         # Pure functions, helpers
├── types/         # TypeScript type definitions
├── assets/        # Static resources (textures, models)
└── config/        # Configuration constants

tests/             # Only if tests requested in feature spec
├── unit/
├── integration/
└── performance/
```

## Governance

### Amendment Procedure

1. **Proposal**: Document proposed change with rationale and impact analysis.
2. **Review**: Team discusses and approves/rejects (consensus or majority vote).
3. **Version Bump**: Follow semantic versioning:
   - **MAJOR**: Backward-incompatible principle changes (e.g., removing a principle)
   - **MINOR**: New principle or section added
   - **PATCH**: Clarifications, typo fixes, non-semantic refinements
4. **Template Sync**: Update all `.specify/templates/` files to reflect changes.
5. **Migration**: If existing code affected, create migration plan before amendment ratification.

### Enforcement

- All code reviews MUST verify constitution compliance.
- Performance regressions MUST be justified or reverted.
- Complexity MUST be justified (see `plan-template.md` Complexity Tracking section).
- Constitution supersedes all other development practices.

### Violation Handling

- **Minor Violations** (naming, documentation): Fix in follow-up PR.
- **Major Violations** (missing tests for critical features, performance failures): BLOCK merge until resolved.

**Version**: 2.0.0 | **Ratified**: 2025-10-30 | **Last Amended**: 2025-10-30
