/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

export const useWasmConverter = () => {
  const [wasm, setWasm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        // @ts-ignore - WASM module will be generated
        const module = await import("@/wasm/document_converter.js");
        await module.default();
        module.init();
        setWasm(module);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load WASM module:", err);
        setError(
          "WASM module not built yet. Run: cd rust-converter && .\\build.ps1"
        );
        setLoading(false);
      }
    };

    loadWasm();
  }, []);

  const convertMarkdownToHtml = (markdown: string): string => {
    if (!wasm) throw new Error("WASM module not loaded");
    return wasm.markdown_to_html(markdown);
  };

  const convertMarkdownToPdfHtml = (
    markdown: string,
    title?: string
  ): string => {
    if (!wasm) throw new Error("WASM module not loaded");
    return wasm.markdown_to_pdf_html(markdown, title);
  };

  const sanitizeLatex = (latex: string): string => {
    if (!wasm) throw new Error("WASM module not loaded");
    return wasm.sanitize_latex(latex);
  };

  const convertLatexToMathML = (formula: string): string => {
    if (!wasm) throw new Error("WASM module not loaded");
    return wasm.latex_formula_to_mathml(formula);
  };

  const batchConvertMarkdown = (documents: string[]): string[] => {
    if (!wasm) throw new Error("WASM module not loaded");
    return wasm.batch_markdown_to_html(documents);
  };

  return {
    loading,
    error,
    ready: !loading && !error && wasm !== null,
    convertMarkdownToHtml,
    convertMarkdownToPdfHtml,
    sanitizeLatex,
    convertLatexToMathML,
    batchConvertMarkdown,
  };
};
