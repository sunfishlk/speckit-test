# Quickstart Guide: 3D House Viewer

**Feature**: 001-3d-house-viewer  
**Last Updated**: 2025-10-30

Get the 3D house viewer running on your local machine in under 5 minutes.

---

## Prerequisites

- **Node.js**: 16.x or higher ([download](https://nodejs.org/))
- **npm**: 8.x or higher (comes with Node.js)
- **Modern browser**: Chrome, Safari, Firefox, or Edge (latest 2 versions)
- **Git**: For cloning the repository

Check your versions:
```bash
node --version  # Should be v16+ or v18+
npm --version   # Should be 8+
```

---

## Installation

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd 3D-watch
git checkout 001-3d-house-viewer
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- React 18+
- Three.js (latest stable)
- @react-three/fiber
- @react-three/drei
- GSAP 3.x
- Vite (build tool)
- Dev dependencies (ESLint, etc.)

**Expected time**: 1-2 minutes

---

## Running the App

### Development Server

```bash
npm run dev
```

This starts Vite dev server with HMR (Hot Module Replacement).

**Output**:
```
VITE v5.x.x  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### What You Should See

1. Loading indicator with progress bar
2. 3D house model rendering in the viewport
3. Viewpoint selection panel (e.g., "Front Entrance", "Living Room")
4. Interactive controls (drag to orbit, scroll to zoom)

**First load time**: 2-3 seconds (depending on model size)

---

## Project Structure Quick Tour

```
3D-watch/
├── src/
│   ├── components/         # React UI components
│   │   ├── Viewer3D.jsx   # Main 3D viewer
│   │   └── ViewportControls.jsx
│   ├── core/               # Three.js core
│   │   ├── scene-manager.js
│   │   ├── camera-controller.js
│   │   └── renderer-manager.js
│   ├── loaders/            # Asset loaders
│   │   └── model-loader.js
│   ├── controllers/        # Interaction logic
│   │   ├── orbit-controller.js
│   │   └── viewpoint-controller.js
│   ├── utils/              # Helpers
│   ├── config/             # Configuration
│   │   └── viewpoints.js  # Preset camera positions
│   └── App.jsx             # Entry point
├── public/
│   ├── models/             # 3D model files (.glb)
│   └── draco/              # Draco decoder WASM files
├── specs/001-3d-house-viewer/  # Feature documentation
└── package.json
```

---

## Configuration

### Sample 3D Model

Place your GLTF/GLB model in `public/models/`:

```
public/models/house.glb
```

Update model path in `src/App.jsx`:

```javascript
const MODEL_URL = '/models/house.glb'
```

### Viewpoint Configuration

Edit `src/config/viewpoints.js`:

```javascript
export const VIEWPOINTS = [
  {
    id: 'front',
    name: 'Front Entrance',
    position: { x: 15, y: 2, z: 15 },
    target: { x: 0, y: 1.5, z: 0 },
    fov: 75,
    category: 'exterior',
    order: 1
  },
  {
    id: 'living',
    name: 'Living Room',
    position: { x: 5, y: 1.8, z: 0 },
    target: { x: 0, y: 1.5, z: -5 },
    fov: 70,
    category: 'interior',
    order: 2
  }
  // Add more viewpoints...
]
```

### Performance Settings

Edit `src/config/performance.js`:

```javascript
export const PERFORMANCE_CONFIG = {
  targetFPS: 60,           // Desktop target
  minFPS: 30,              // Minimum acceptable
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  shadowsEnabled: true,    // Disable for better performance
  antialias: true,
  maxTextureSize: 2048     // Lower to 1024 for mobile
}
```

---

## Development Workflow

### Making Changes

1. **Edit files**: Vite HMR updates browser instantly
2. **Check console**: Watch for errors or warnings
3. **Test interactions**: Orbit, zoom, viewpoint switching
4. **Monitor performance**: Press **`** (backtick) to show Stats.js overlay

### Code Quality Checks

```bash
# Linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Type checking (JSDoc)
npm run check-types  # If configured
```

### Performance Testing

```bash
# Run FPS benchmark
npm run test:perf

# Memory profiling
npm run test:memory
```

---

## Building for Production

```bash
npm run build
```

**Output**: `dist/` directory with optimized bundle

**Preview production build**:
```bash
npm run preview
```

Opens production build at [http://localhost:4173/](http://localhost:4173/)

---

## Troubleshooting

### Issue: Model doesn't load

**Symptoms**: Loading spinner stays indefinitely

**Solutions**:
1. Check model file exists in `public/models/`
2. Check browser console for 404 errors
3. Verify model URL in code matches file path
4. Ensure model is valid GLTF/GLB (test in [gltf.report](https://gltf.report/))

### Issue: Low FPS / Laggy

**Symptoms**: < 30 FPS, choppy animations

**Solutions**:
1. Reduce model polygon count (< 100K recommended)
2. Compress textures (use KTX2 format)
3. Disable shadows: Set `shadowsEnabled: false` in config
4. Lower `pixelRatio` to 1.0
5. Check Chrome DevTools Performance tab

### Issue: WebGL context lost

**Symptoms**: "WebGL context lost" error

**Solutions**:
1. Close other GPU-intensive browser tabs
2. Update graphics drivers
3. Reduce memory usage (smaller textures)
4. Add WebGL context restore handler

### Issue: Draco decoder fails

**Symptoms**: "Could not load Draco decoder" error

**Solutions**:
1. Ensure `public/draco/` contains decoder files
2. Check `dracoDecoderPath` in ModelLoader constructor
3. Verify network tab shows decoder WASM loading
4. Use non-Draco compressed model as fallback

---

## Testing

### Manual Testing Checklist

- [ ] Model loads within 3 seconds
- [ ] FPS stays above 30 during orbit
- [ ] Zoom in/out works smoothly
- [ ] Pan with right-click works
- [ ] Viewpoint buttons trigger smooth transitions
- [ ] Loading indicator shows progress
- [ ] Error boundary catches model load failures
- [ ] Works on Chrome, Safari, Firefox
- [ ] Responsive on different screen sizes

### Automated Tests

```bash
# Run all tests
npm test

# Performance benchmarks
npm run test:perf

# E2E tests with Puppeteer
npm run test:e2e
```

---

## Next Steps

1. **Read the spec**: `specs/001-3d-house-viewer/spec.md`
2. **Review architecture**: `specs/001-3d-house-viewer/plan.md`
3. **Check contracts**: `specs/001-3d-house-viewer/contracts/`
4. **Implement tasks**: Generate with `/speckit.tasks`

---

## Useful Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm test` | Run tests |
| `npm run test:perf` | Performance benchmarks |

---

## Resources

- **Three.js Docs**: [threejs.org/docs](https://threejs.org/docs)
- **React Three Fiber**: [docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber)
- **Drei Helpers**: [github.com/pmndrs/drei](https://github.com/pmndrs/drei)
- **GSAP Animation**: [greensock.com/docs](https://greensock.com/docs)
- **GLTF Validator**: [gltf.report](https://gltf.report/)

---

## Getting Help

- **Check console**: Browser DevTools Console tab
- **Review logs**: Vite dev server output
- **Inspect network**: DevTools Network tab for failed requests
- **Profile performance**: DevTools Performance tab
- **Report issues**: Create GitHub issue with browser, error message, and steps to reproduce

---

**Happy coding! 🏠✨**
