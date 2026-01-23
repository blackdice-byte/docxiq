import { useState } from "react";
import { Editor, Viewer } from "react-latex-editor";
import "react-latex-editor/styles";
import { Copy, Download, Sparkles, Wand2 } from "lucide-react";
import { copyAsDocx, downloadAsDocx } from "@/utils/export-to-docx";
import { toast } from "sonner";
import { aiService } from "@/services/ai.service";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export function EquationEditor() {
  const [content, setContent] = useState("<p>Start typing...</p>");
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [rawInput, setRawInput] = useState("");
  const [isFormatting, setIsFormatting] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  const handleCopyAsDocx = async () => {
    setIsCopying(true);
    try {
      const success = await copyAsDocx(content);
      if (success) {
        toast.success("Copied to clipboard as DOCX!");
      } else {
        toast.error("Failed to copy to clipboard");
      }
    } catch (error) {
      toast.error("Error copying to clipboard");
      console.error(error);
    } finally {
      setIsCopying(false);
    }
  };

  const handleDownloadAsDocx = async () => {
    setIsDownloading(true);
    try {
      const success = await downloadAsDocx(content, "equation-document.docx");
      if (success) {
        toast.success("Document downloaded successfully!");
      } else {
        toast.error("Failed to download document");
      }
    } catch (error) {
      toast.error("Error downloading document");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAIFormat = async () => {
    if (!rawInput.trim()) {
      toast.error("Please enter an equation to format");
      return;
    }

    setIsFormatting(true);
    try {
      const formatted = await aiService.formatEquation(rawInput);
      setContent(formatted);
      toast.success("Equation formatted with AI!");
    } catch (error) {
      toast.error("Failed to format equation");
      console.error(error);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleAIImprove = async () => {
    if (!content || content === "<p>Start typing...</p>") {
      toast.error("Please add some content to improve");
      return;
    }

    setIsImproving(true);
    try {
      const improved = await aiService.improveEquation(content);
      setContent(improved);
      toast.success("Equation improved with AI!");
    } catch (error) {
      toast.error("Failed to improve equation");
      console.error(error);
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] relative flex flex-col gap-4">
      {/* AI Formatting Section */}
      <Card className="p-4 bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-sm">AI Equation Formatter</h3>
          </div>
          <Textarea
            placeholder="Paste your equation here (e.g., 'x squared plus 2x plus 1', 'integral of x dx', 'sum from i=1 to n of i squared')..."
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            className="min-h-[80px] text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleAIFormat}
              disabled={isFormatting || !rawInput.trim()}
              size="sm"
              className="gap-2"
            >
              {isFormatting ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Formatting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Format with AI
                </>
              )}
            </Button>
            <Button
              onClick={handleAIImprove}
              disabled={isImproving}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {isImproving ? (
                <>
                  <Wand2 className="h-4 w-4 animate-pulse" />
                  Improving...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Improve Current
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          placeholder="Or type LaTeX directly here..."
          initialContent={content}
          onChange={setContent}
          className="h-full text-black"
        />
      </div>

      {/* Floating Viewer */}
      <div className="fixed bottom-4 right-4 w-[400px] max-w-[calc(100vw-2rem)] h-[400px] max-h-[50vh] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col">
        <div className="bg-gray-800 text-white px-4 py-2 font-semibold flex items-center justify-between">
          <span>Preview</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopyAsDocx}
              disabled={isCopying}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm transition-colors"
              title="Copy to clipboard as DOCX"
            >
              {isCopying ? (
                <>
                  <Copy className="w-4 h-4 animate-pulse" />
                  Copying...
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownloadAsDocx}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-sm transition-colors"
              title="Download as DOCX file"
            >
              {isDownloading ? (
                <>
                  <Download className="w-4 h-4 animate-bounce" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download
                </>
              )}
            </button>
          </div>
        </div>
        <div className="p-4 overflow-auto flex-1">
          <Viewer
            content={content}
            className="my-viewer"
            contentClassName="custom-content"
            enableMath={true}
            mathJaxConfig={{
              inlineMath: [["$", "$"]],
              displayMath: [["$$", "$$"]],
              packages: ["base", "ams"],
            }}
          />
        </div>
      </div>
    </div>
  );
}
