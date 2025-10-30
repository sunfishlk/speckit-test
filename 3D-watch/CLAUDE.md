# Claude Code Context

## Project: 3D House Viewer

### Technology Stack

**Language/Version**: JavaScript (ES6+) with optional TypeScript for type safety  
**Primary Framework**: React 18+, Three.js (latest stable), React Three Fiber, Drei (React Three.js helpers)  
**Storage**: Static file hosting for 3D models (GLTF/GLB), local state management via React Context/hooks  
**Build Tool**: Vite  
**Testing**: Jest + React Testing Library, Puppeteer, custom performance benchmarks  
**Animation**: GSAP 3.x  
**Target Platform**: Modern web browsers with WebGL 2.0 support

### Project Structure

```
src/
├── components/          # React UI components
├── core/                # Three.js core modules (scene, camera, renderer)
├── loaders/             # Asset loaders (models, textures)
├── controllers/         # Interaction controllers (orbit, viewpoints)
├── utils/               # Utilities and helpers
├── types/               # JSDoc type definitions
├── config/              # Configuration constants
└── assets/              # Static assets

tests/
└── performance/         # Performance benchmarks
```

### Key Commands

```bash
# Development
npm run dev              # Start dev server (Vite)
npm run build            # Production build
npm run preview          # Preview production build

# Quality
npm run lint             # ESLint
npm run lint:fix         # Auto-fix issues

# Testing
npm test                 # Run tests
npm run test:perf        # Performance benchmarks
```

### Current Feature

**Branch**: 001-3d-house-viewer  
**Spec**: specs/001-3d-house-viewer/spec.md  
**Plan**: specs/001-3d-house-viewer/plan.md

### Performance Requirements

- **FPS**: 30+ (target 60 on desktop)
- **Load Time**: < 3s for models
- **Memory**: < 1GB desktop, < 500MB mobile
- **Interaction Response**: < 100ms

### Constitution Notes

- ⚠️ Using JavaScript with JSDoc instead of TypeScript (user requirement)
- Mitigation: Strict ESLint rules, comprehensive JSDoc annotations
- All other constitution principles (code quality, testing, UX, performance) enforced

---

**Last Updated**: 2025-10-30  
**Feature**: 001-3d-house-viewer
