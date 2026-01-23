const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

export const aiService = {
  async formatEquation(rawEquation: string): Promise<string> {
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a LaTeX equation formatter. Convert the following equation or mathematical expression into properly formatted LaTeX code.

Rules:
- Return ONLY the LaTeX code, no explanations
- Use proper LaTeX syntax with $ for inline math or $$ for display math
- Format fractions with \\frac{}{}, exponents with ^{}, subscripts with _{}
- Use proper mathematical symbols (\\alpha, \\beta, \\sum, \\int, etc.)
- Ensure proper spacing and grouping with {}
- For matrices, use \\begin{bmatrix}...\\end{bmatrix}
- Keep it clean and readable

Input equation:
${rawEquation}

Output only the formatted LaTeX code:`,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates[0]?.content?.parts[0]?.text || "";
      return text.trim();
    } catch (error) {
      console.error("AI formatting error:", error);
      throw new Error("Failed to format equation with AI");
    }
  },

  async improveEquation(equation: string): Promise<string> {
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a LaTeX equation optimizer. Improve the following LaTeX equation by:
- Fixing any syntax errors
- Improving readability and formatting
- Using proper mathematical notation
- Adding appropriate spacing
- Ensuring proper bracket matching

Return ONLY the improved LaTeX code, no explanations.

Input LaTeX:
${equation}

Improved LaTeX:`,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates[0]?.content?.parts[0]?.text || "";
      return text.trim();
    } catch (error) {
      console.error("AI improvement error:", error);
      throw new Error("Failed to improve equation with AI");
    }
  },
};
