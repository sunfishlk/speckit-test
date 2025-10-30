# Draco Decoder Files

This directory should contain the Draco decoder WASM files for compressed GLTF model support.

## Installation

Download the Draco decoder files from the Three.js repository:

```bash
# Option 1: Download from CDN (recommended for development)
# The ModelLoader will automatically use CDN-hosted decoders if local files are not available

# Option 2: Copy from node_modules after installing three
cp -r node_modules/three/examples/jsm/libs/draco/* public/draco/
```

## Required Files

- `draco_decoder.wasm`
- `draco_wasm_wrapper.js`  
- `draco_decoder.js`

## Usage

The ModelLoader class in `src/loaders/model-loader.js` is configured to use these decoder files automatically.

If the files are not present locally, the loader will fall back to CDN-hosted decoders from:
`https://www.gstatic.com/draco/versioned/decoders/`

## Note

For production builds, it's recommended to:
1. Host the decoder files alongside your app
2. Use the latest stable Draco version compatible with your Three.js version
3. Configure the correct path in the ModelLoader constructor
