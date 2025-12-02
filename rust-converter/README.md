# Document Converter WASM Module

High-performance document conversion library built with Rust and compiled to WebAssembly.

## Features

- **Markdown to HTML**: Fast markdown parsing and HTML generation
- **Markdown to PDF-ready HTML**: Styled HTML output optimized for PDF conversion
- **LaTeX to MathML**: Convert LaTeX formulas to MathML format
- **Batch Processing**: Convert multiple documents efficiently

## Prerequisites

1. Install Rust: https://rustup.rs/
2. Install wasm-pack: `cargo install wasm-pack`

## Building

### Windows
```powershell
cd rust-converter
.\build.ps1
```

### Linux/Mac
```bash
cd rust-converter
chmod +x build.sh
./build.sh
```

This will compile the Rust code to WASM and output to `src/wasm/`.

## Usage in React

```typescript
import { useWasmConverter } from '@/hooks/useWasmConverter';

function MyComponent() {
  const { ready, convertMarkdownToHtml } = useWasmConverter();
  
  if (!ready) return <div>Loading...</div>;
  
  const html = convertMarkdownToHtml('# Hello World');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

## API

### `markdown_to_html(markdown: string): string`
Converts markdown to HTML.

### `markdown_to_pdf_html(markdown: string, title?: string): string`
Converts markdown to styled HTML ready for PDF conversion.

### `sanitize_latex(latex: string): string`
Sanitizes LaTeX input by removing dangerous commands.

### `latex_formula_to_mathml(formula: string): string`
Converts LaTeX formula to MathML format.

### `batch_markdown_to_html(documents: string[]): string[]`
Batch converts multiple markdown documents.

## Performance

WASM provides near-native performance for document conversion:
- 10-100x faster than JavaScript implementations
- Efficient memory usage
- No blocking of the main thread

## Future Enhancements

- Full LaTeX document parsing
- Direct PDF generation
- More output formats (DOCX, ODT)
- Advanced markdown extensions
- Syntax highlighting for code blocks
