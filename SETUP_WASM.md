# WASM Converter Setup Guide

## Quick Start

### 1. Install Rust (if not already installed)

```powershell
# Using winget
winget install Rustlang.Rustup

# Or download from: https://rustup.rs/
```

After installation, restart your terminal.

### 2. Build the WASM Module

```powershell
# Option 1: Using npm script (recommended)
pnpm build:wasm

# Option 2: Manual build
cd rust-converter
.\build.ps1
```

This will:

- Install `wasm-pack` if needed
- Compile Rust code to WebAssembly
- Output files to `src/wasm/`

### 3. Run the App

```powershell
pnpm dev
```

The converter will now work! Navigate to the Converter page in your app.

## Troubleshooting

### "Rust not found"

- Install Rust from https://rustup.rs/
- Restart your terminal after installation
- Verify: `rustc --version`

### "wasm-pack not found"

The build script will auto-install it, but you can manually install:

```powershell
cargo install wasm-pack
```

### "WASM module not built yet" error in app

- Run `pnpm build:wasm` before starting the dev server
- Check that `src/wasm/` directory contains `.js` and `.wasm` files

### Build fails

- Make sure you're in the project root directory
- Check that `rust-converter/` folder exists
- Try: `cd rust-converter && cargo clean && .\build.ps1`

## Development Workflow

1. Make changes to `rust-converter/src/lib.rs`
2. Run `pnpm build:wasm`
3. Refresh your browser (Vite will hot-reload)

## Without WASM (Fallback)

If you don't want to use WASM, you can:

1. Remove the Converter route from your app
2. Or implement converters in pure TypeScript (slower but no build step)

The app will run fine without building WASM - the Converter page will just show an error message with instructions.
