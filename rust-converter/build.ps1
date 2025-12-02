# PowerShell build script for WASM module

Write-Host "Building Rust WASM module..." -ForegroundColor Green

# Add cargo bin to PATH
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"

# Check if wasm-pack is installed
if (!(Get-Command wasm-pack -ErrorAction SilentlyContinue)) {
    Write-Host "wasm-pack not found. Installing..." -ForegroundColor Yellow
    cargo install wasm-pack --locked
    # Refresh PATH
    $env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
}

# Add wasm32 target if not present
rustup target add wasm32-unknown-unknown

# Build for web target
Write-Host "Compiling Rust to WebAssembly..." -ForegroundColor Cyan
& "$env:USERPROFILE\.cargo\bin\wasm-pack.exe" build --target web --out-dir ../src/wasm

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build complete! WASM module available at src/wasm" -ForegroundColor Green
} else {
    Write-Host "Build failed! Check errors above." -ForegroundColor Red
    exit 1
}
