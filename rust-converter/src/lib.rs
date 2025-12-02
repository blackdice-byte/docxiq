use wasm_bindgen::prelude::*;
use pulldown_cmark::{html, Parser};

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

/// Convert Markdown to HTML
#[wasm_bindgen]
pub fn markdown_to_html(markdown: &str) -> String {
    let parser = Parser::new(markdown);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);
    html_output
}

/// Convert Markdown to PDF-ready HTML with styling
#[wasm_bindgen]
pub fn markdown_to_pdf_html(markdown: &str, title: Option<String>) -> String {
    let parser = Parser::new(markdown);
    let mut body = String::new();
    html::push_html(&mut body, parser);
    
    let title_str = title.unwrap_or_else(|| "Document".to_string());
    
    format!(
        r#"<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            color: #333;
        }}
        h1, h2, h3, h4, h5, h6 {{
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
        }}
        code {{
            background: #f6f8fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }}
        pre {{
            background: #f6f8fa;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
        }}
        blockquote {{
            border-left: 4px solid #ddd;
            padding-left: 16px;
            color: #666;
            margin: 16px 0;
        }}
        table {{
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }}
        th {{
            background: #f6f8fa;
        }}
    </style>
</head>
<body>
{}
</body>
</html>"#,
        title_str, body
    )
}

/// Sanitize LaTeX input
#[wasm_bindgen]
pub fn sanitize_latex(latex: &str) -> String {
    // Basic sanitization - remove potentially dangerous commands
    latex
        .replace("\\input", "")
        .replace("\\include", "")
        .replace("\\write", "")
        .replace("\\openout", "")
        .trim()
        .to_string()
}

/// Convert LaTeX formula to MathML (basic implementation)
#[wasm_bindgen]
pub fn latex_formula_to_mathml(formula: &str) -> Result<String, JsValue> {
    // This is a simplified version - for production, you'd want a full LaTeX parser
    let sanitized = sanitize_latex(formula);
    
    // Basic conversion for simple formulas
    let mathml = format!(
        r#"<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mrow>
    <mtext>{}</mtext>
  </mrow>
</math>"#,
        sanitized
    );
    
    Ok(mathml)
}

#[wasm_bindgen]
pub struct ConversionResult {
    success: bool,
    output: String,
    error: Option<String>,
}

#[wasm_bindgen]
impl ConversionResult {
    #[wasm_bindgen(getter)]
    pub fn success(&self) -> bool {
        self.success
    }
    
    #[wasm_bindgen(getter)]
    pub fn output(&self) -> String {
        self.output.clone()
    }
    
    #[wasm_bindgen(getter)]
    pub fn error(&self) -> Option<String> {
        self.error.clone()
    }
}

/// Batch convert multiple markdown documents
#[wasm_bindgen]
pub fn batch_markdown_to_html(documents: JsValue) -> Result<JsValue, JsValue> {
    let docs: Vec<String> = serde_wasm_bindgen::from_value(documents)?;
    let results: Vec<String> = docs
        .iter()
        .map(|md| markdown_to_html(md))
        .collect();
    
    serde_wasm_bindgen::to_value(&results)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}
