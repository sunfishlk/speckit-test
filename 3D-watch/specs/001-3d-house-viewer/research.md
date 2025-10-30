# Research & Technology Decisions: 3D House Viewer

**Feature**: 001-3d-house-viewer  
**Date**: 2025-10-30  
**Status**: Complete

## Overview

This document consolidates research findings for implementing a React-based 3D house viewer using Three.js. All technology decisions have been evaluated against project requirements for performance (30+ FPS), load times (<3s), and browser compatibility.

---

## 1. React + Three.js Integration

### Decision: React Three Fiber (R3F)

**Rationale**:
- Declarative React components for Three.js objects reduces boilerplate
- Built-in hooks for animation loop, state management, and events
- Active community with 25K+ GitHub stars, maintained by Poimandres
- Performance optimized with automatic disposal and memory management
- Seamless integration with React ecosystem (suspense, error boundaries)

**Alternatives Considered**:
- **Vanilla Three.js + React**: More control but requires manual lifecycle management, ref handling, and cleanup
- **TreSS**: Newer library with smaller community, less stable API

**Implementation**:
```javascript
// React Three Fiber approach
<Canvas>
  <Scene>
    <Model url="/models/house.glb" />
    <OrbitControls />
  </Scene>
</Canvas>
```

**Trade-offs**:
- Pro: Faster development, cleaner code, automatic cleanup
- Con: Additional 40KB bundle size, slight learning curve for Three.js experts
- Mitigation: Bundle size acceptable given productivity gains

---

## 2. Camera Control System

### Decision: @react-three/drei OrbitControls + Custom Viewpoint Controller

**Rationale**:
- Drei's `<OrbitControls>` provides battle-tested mouse/touch interactions
- Includes damping, zoom limits, pan constraints out-of-box
- Custom viewpoint controller needed for smooth camera transitions (not provided by Drei)
- Combination meets all spec requirements (FR-003, FR-004, FR-008)

**Alternatives Considered**:
- **Custom from scratch**: Reinventing wheel for orbit/zoom/pan, high effort
- **Three.js OrbitControls directly**: Harder to integrate with React lifecycle

**Implementation Strategy**:
- Use Drei OrbitControls for manual navigation (User Story 2)
- Build ViewpointController for animated transitions (User Story 3)
- Use GSAP or Three.js Tween for camera animations

---

## 3. 3D Model Loading & Optimization

### Decision: GLTFLoader with Draco Compression + Lazy Loading

**Rationale**:
- GLTF/GLB is industry standard, widely supported (FR-001)
- Draco compression reduces model size by 70-90% (critical for <3s load time)
- Three.js GLTFLoader is mature and well-documented
- Lazy loading via React Suspense prevents blocking UI

**Alternatives Considered**:
- **FBX/OBJ formats**: Larger file sizes, no native compression
- **USDZ**: Apple-specific, limited cross-platform support

**Compression Strategy**:
- Use Draco for geometry compression
- KTX2/Basis Universal for texture compression (50-75% size reduction)
- Progressive loading: low-res preview → high-res swap

**Implementation**:
```javascript
import { useGLTF } from '@react-three/drei'

function Model({ url }) {
  const { scene } = useGLTF(url) // Automatic caching
  return <primitive object={scene} />
}

// Preload in background
useGLTF.preload('/models/house.glb')
```

---

## 4. Performance Monitoring & Optimization

### Decision: Stats.js + Custom Performance Hooks + Chrome DevTools

**Rationale**:
- Stats.js provides real-time FPS monitoring (meets constitution requirement)
- Custom React hooks track load times, memory usage
- Chrome DevTools Performance API for detailed profiling
- Satisfies SC-003 (30+ FPS), SC-001 (<3s load)

**Optimization Techniques**:

1. **Level of Detail (LOD)**:
   ```javascript
   <LOD>
     <mesh geometry={highRes} distance={10} />
     <mesh geometry={medRes} distance={50} />
     <mesh geometry={lowRes} distance={100} />
   </LOD>
   ```

2. **Frustum Culling**: Automatically handled by Three.js

3. **Texture Compression**: Use KTX2 format with BasisTextureLoader

4. **Debouncing**: Throttle resize events to 16ms (60 FPS)

5. **Instance Rendering**: For repeated objects (trees, furniture)

**Benchmark Requirements**:
- FPS benchmark: Measure during orbit, zoom, pan, viewpoint transition
- Load benchmark: Time from fetch start to first render
- Memory benchmark: Heap size before/after model load, detect leaks

---

## 5. State Management

### Decision: React Context + useReducer (No Redux)

**Rationale**:
- Lightweight solution for managing viewpoints, camera state, loading status
- React Context sufficient for shallow component tree (no deep prop drilling)
- useReducer for complex state transitions (loading → loaded → error)
- Avoids 30KB Redux overhead for simple state needs

**State Structure**:
```javascript
const ViewerContext = {
  currentViewpoint: { position, target, fov },
  availableViewpoints: [...],
  modelStatus: 'loading' | 'loaded' | 'error',
  cameraState: { position, target, zoom },
  settings: { quality, shadows, antialiasing }
}
```

**Alternatives Considered**:
- **Redux**: Overkill for this scope, adds complexity
- **Zustand**: Good alternative, but Context adequate for MVP
- **Jotai/Recoil**: Atomic state not needed

---

## 6. Camera Animation System

### Decision: GSAP (GreenSock Animation Platform)

**Rationale**:
- Industry-standard animation library with precise easing
- Smooth camera transitions meeting <1s requirement (SC-005)
- Powerful timeline system for complex animation sequences
- Better performance than CSS transitions for 3D transforms
- 50KB gzipped, worth it for quality

**Alternatives Considered**:
- **Three.js Tween.js**: Less polished, smaller community
- **Framer Motion**: React-focused but heavier for 3D use
- **react-spring**: Great for UI, not optimized for 3D camera paths

**Implementation**:
```javascript
gsap.to(camera.position, {
  x: targetViewpoint.position.x,
  y: targetViewpoint.position.y,
  z: targetViewpoint.position.z,
  duration: 0.8,
  ease: 'power2.inOut',
  onUpdate: () => camera.lookAt(targetViewpoint.target)
})
```

---

## 7. Build System & Tooling

### Decision: Vite

**Rationale**:
- Fast HMR (Hot Module Replacement) for rapid development
- Native ES modules, no bundling in dev mode
- Optimized production builds with Rollup
- Better Three.js support than Create React App
- Aligns with constitution preference (Vite preferred)

**Configuration**:
- Enable GLTF asset handling
- Configure Draco/KTX2 decoder paths
- Tree-shaking for Three.js modules (reduce bundle size)

**Alternatives Considered**:
- **Webpack**: Slower dev server, more configuration
- **Create React App**: Limited customization, slower

---

## 8. Error Handling & Fallbacks

### Decision: React Error Boundaries + Progressive Enhancement

**Rationale**:
- Error boundaries catch rendering errors gracefully (FR-009)
- WebGL capability detection with fallback messages
- Progressive enhancement for older browsers

**Strategy**:
```javascript
// WebGL detection
if (!WebGLRenderingContext) {
  return <FallbackMessage />
}

// Error boundary for model loading
<ErrorBoundary fallback={<ErrorUI />}>
  <Suspense fallback={<LoadingIndicator />}>
    <Model3D />
  </Suspense>
</ErrorBoundary>
```

**Fallback Scenarios**:
- No WebGL: Static images + message
- Model load failure: Error message + retry button
- Low FPS: Auto-reduce quality settings

---

## 9. Testing Strategy

### Decision: Jest + React Testing Library + Puppeteer + Custom Perf Tests

**Rationale**:
- Jest for unit tests (utilities, helpers)
- React Testing Library for component tests
- Puppeteer for browser automation (E2E scenarios)
- Custom performance benchmarks (constitution requirement)

**Test Coverage**:
- Unit: Viewpoint calculations, animation utilities
- Integration: Component interactions, state updates
- Performance: FPS, load time, memory usage (MANDATORY)
- E2E: Full user scenarios with Puppeteer

---

## 10. Browser Compatibility

### Decision: Target WebGL 2.0 with WebGL 1.0 Fallback

**Rationale**:
- WebGL 2.0 for better performance (instancing, MRT)
- Three.js automatically falls back to WebGL 1.0
- Covers 95%+ of target browsers (Chrome, Safari, Firefox, Edge latest 2 versions)

**Polyfills/Fallbacks**:
- ResizeObserver polyfill for older Safari
- Intersection Observer for lazy loading
- Pointer Events for unified mouse/touch handling

---

## Technology Stack Summary

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| Framework | React | 18+ | User requirement, modern hooks/suspense |
| 3D Engine | Three.js | Latest stable | User requirement, industry standard |
| React Integration | React Three Fiber | Latest | Declarative, performance, ecosystem |
| Helpers | @react-three/drei | Latest | Battle-tested controls & utilities |
| Animation | GSAP | 3.x | Smooth camera transitions, easing |
| Build Tool | Vite | Latest | Fast dev, optimized builds |
| State | React Context | Built-in | Lightweight, sufficient scope |
| Testing | Jest + RTL | Latest | Standard React testing |
| Performance | Stats.js + Custom | Latest | Real-time monitoring |
| Model Format | GLTF/GLB | 2.0 | Industry standard, compression |

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Large model files slow load time | High | Draco compression, lazy loading, LOD |
| Low FPS on mobile | High | Auto quality adjustment, texture downscaling |
| Memory leaks | Medium | React Three Fiber auto-disposal, heap monitoring |
| Browser compatibility | Medium | WebGL detection, progressive fallbacks |
| JavaScript vs TypeScript | Low | JSDoc annotations, strict ESLint, migration path |

---

## Next Steps

1. ✅ Research complete - all technology decisions finalized
2. ⏳ Generate data-model.md with entity definitions
3. ⏳ Create contracts for module interfaces
4. ⏳ Write quickstart.md for developer setup
5. ⏳ Ready for implementation task generation
