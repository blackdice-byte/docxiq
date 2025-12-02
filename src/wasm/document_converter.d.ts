/* tslint:disable */
/* eslint-disable */

export class ConversionResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly error: string | undefined;
  readonly output: string;
  readonly success: boolean;
}

/**
 * Batch convert multiple markdown documents
 */
export function batch_markdown_to_html(documents: any): any;

export function init(): void;

/**
 * Convert LaTeX formula to MathML (basic implementation)
 */
export function latex_formula_to_mathml(formula: string): string;

/**
 * Convert Markdown to HTML
 */
export function markdown_to_html(markdown: string): string;

/**
 * Convert Markdown to PDF-ready HTML with styling
 */
export function markdown_to_pdf_html(markdown: string, title?: string | null): string;

/**
 * Sanitize LaTeX input
 */
export function sanitize_latex(latex: string): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_conversionresult_free: (a: number, b: number) => void;
  readonly batch_markdown_to_html: (a: any) => [number, number, number];
  readonly conversionresult_error: (a: number) => [number, number];
  readonly conversionresult_output: (a: number) => [number, number];
  readonly conversionresult_success: (a: number) => number;
  readonly init: () => void;
  readonly latex_formula_to_mathml: (a: number, b: number) => [number, number, number, number];
  readonly markdown_to_html: (a: number, b: number) => [number, number];
  readonly markdown_to_pdf_html: (a: number, b: number, c: number, d: number) => [number, number];
  readonly sanitize_latex: (a: number, b: number) => [number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
