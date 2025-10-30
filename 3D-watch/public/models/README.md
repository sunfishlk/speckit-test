# 3D Models Directory

This directory should contain your 3D house models in GLTF or GLB format.

## Required Model

The application is configured to load a model at: `/models/house.glb`

## Getting Started

### Option 1: Use a Sample Model

Download a free house model from:
- **Sketchfab**: https://sketchfab.com/search?q=house&type=models&features=downloadable
- **Three.js Examples**: https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf
- **Poly Haven**: https://polyhaven.com/models

### Option 2: Create Your Own

Export your model from:
- **Blender** → File → Export → glTF 2.0 (.glb)
- **SketchUp** → Extensions → glTF Export
- **3ds Max** → Export → glTF

## Model Requirements

- **Format**: GLTF (.gltf + separate files) or GLB (.glb single file)
- **Polygon Count**: < 100,000 polygons for best performance
- **File Size**: < 5MB for fast loading
- **Textures**: Embedded or in same directory
- **Compression**: Draco compression recommended (optional)

## Model Optimization

To optimize your models for web:

1. **Reduce Polygons**: Use decimation/simplification tools
2. **Compress Textures**: Use 1024x1024 or 2048x2048 max
3. **Apply Draco Compression**:
   ```bash
   npm install -g gltf-pipeline
   gltf-pipeline -i input.gltf -o output.glb -d
   ```
4. **Remove Unused Data**: Clean up unused materials, textures

## Quick Test Model

For quick testing, you can use a simple placeholder by placing any .glb file as `house.glb` in this directory.

Alternatively, download this free model:
- **Simple House**: https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/

## Troubleshooting

- **Model not loading?** Check browser console for errors
- **Model too dark?** Adjust lighting in src/core/scene-manager.js
- **Model too large/small?** Camera constraints are in src/utils/constants.js
- **Performance issues?** Reduce polygon count or enable Draco compression
