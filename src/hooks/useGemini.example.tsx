import { useGemini, PromptType } from "./useGemini";

// Example usage of the useGemini hook
export function ExampleComponent() {
  const { generateContent, loading, error } = useGemini({
    model: "gemini-2.0-flash-exp", // Optional: defaults to 'gemini-2.0-flash-exp'
  });

  const handleParaphrase = async () => {
    try {
      const result = await generateContent({
        prompt: "The quick brown fox jumps over the lazy dog.",
        type: PromptType.PARAPHRASER,
      });
      console.log("Paraphrased:", result);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSummarize = async () => {
    try {
      const result = await generateContent({
        prompt: "Long text to summarize...",
        type: PromptType.SUMMARIZER,
      });
      console.log("Summary:", result);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleConvert = async () => {
    try {
      const result = await generateContent({
        prompt: "Convert this markdown to HTML: # Hello World",
        type: PromptType.CONVERTER,
      });
      console.log("Converted:", result);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div>
      <button onClick={handleParaphrase} disabled={loading}>
        Paraphrase
      </button>
      <button onClick={handleSummarize} disabled={loading}>
        Summarize
      </button>
      <button onClick={handleConvert} disabled={loading}>
        Convert
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
