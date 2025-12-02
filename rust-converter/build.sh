#!/bin/bash
# Build script for WASM module

echo "Building Rust WASM module..."

# Install wasm-pack if not already installed
if ! command -v wasm-pack &> /dev/null; then
    echo "wasm-pack not found. Installing..."
    cargo install wasm-pack
fi

# Build for web target
wasm-pack build --target web --out-dir ../src/wasm

echo "Build complete! WASM module available at src/wasm"
