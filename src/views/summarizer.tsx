import { useState } from "react";
import { useSummarizer } from "@/hooks/useSummarizer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Copy,
  FileText,
  RotateCcw,
  Download,
  Loader2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type SummaryLength = "short" | "medium" | "long";
type SummaryFormat = "paragraph" | "bullets" | "key-points";

const Summarizer = () => {
  const { summarize, loading, error } = useSummarizer({
    onSuccess: (summary) => {
      setOutput(summary);
      toast.success("Summary generated successfully!");
    },
    onError: (error) => {
      toast.error(`Summarization failed: ${error}`);
    },
  });

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("medium");
  const [summaryFormat, setSummaryFormat] =
    useState<SummaryFormat>("paragraph");
  const [detailLevel, setDetailLevel] = useState([50]);

  const handleSummarize = async () => {
    if (!input.trim()) {
      toast.error("Please enter some text to summarize");
      return;
    }

    try {
      await summarize({
        text: input,
        summaryLength,
        summaryFormat,
        detailLevel: detailLevel[0],
      });
    } catch {
      // Error already handled by the hook
    }
  };

  const handleCopy = () => {
    if (!output) {
      toast.error("No summary to copy");
      return;
    }

    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    if (!output) {
      toast.error("No summary to download");
      return;
    }

    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    toast.info("Reset complete");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      toast.error("Please upload a .txt file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      toast.success("File loaded successfully!");
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
  };

  const loadExample = () => {
    const example = `Artificial intelligence (AI) has become one of the most transformative technologies of the 21st century, revolutionizing industries ranging from healthcare to finance, transportation to entertainment. At its core, AI refers to computer systems designed to perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.

The field of AI encompasses several subdomains, including machine learning, where algorithms learn from data to improve their performance over time without being explicitly programmed. Deep learning, a subset of machine learning, uses neural networks with multiple layers to process complex patterns in large datasets. Natural language processing enables machines to understand and generate human language, powering applications like chatbots and virtual assistants.

Recent advances in AI have been driven by three key factors: the availability of massive amounts of data, increased computational power through GPUs and specialized hardware, and breakthroughs in algorithmic approaches. These developments have enabled AI systems to achieve superhuman performance in specific tasks, such as playing complex games like Go and chess, diagnosing certain medical conditions from imaging data, and generating realistic images and text.

However, the rapid advancement of AI also raises important ethical and societal concerns. Issues such as algorithmic bias, privacy implications, job displacement, and the potential for misuse require careful consideration. As AI systems become more integrated into critical decision-making processes, ensuring transparency, accountability, and fairness becomes paramount.

Looking ahead, the future of AI holds both tremendous promise and significant challenges. Researchers are working on developing more general AI systems that can transfer knowledge across different domains, improving AI's ability to explain its decisions, and creating AI that aligns with human values and ethics. The continued evolution of AI will likely reshape how we work, learn, and interact with technology in profound ways.`;

    setInput(example);
    setOutput("");
  };

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const outputWordCount = output.trim() ? output.trim().split(/\s+/).length : 0;
  const compressionRatio =
    wordCount > 0 && outputWordCount > 0
      ? Math.round((1 - outputWordCount / wordCount) * 100)
      : 0;

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Text Summarizer</h1>
        <p className="text-muted-foreground">
          Generate concise summaries of long texts with AI-powered intelligence
        </p>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Summary Settings</CardTitle>
          <CardDescription>
            Customize how your summary is generated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Summary Length</Label>
              <RadioGroup
                value={summaryLength}
                onValueChange={(v) => setSummaryLength(v as SummaryLength)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short" className="font-normal cursor-pointer">
                    Short (2-3 sentences)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label
                    htmlFor="medium"
                    className="font-normal cursor-pointer"
                  >
                    Medium (1-2 paragraphs)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long" id="long" />
                  <Label htmlFor="long" className="font-normal cursor-pointer">
                    Long (3-4 paragraphs)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Summary Format</Label>
              <Select
                value={summaryFormat}
                onValueChange={(v) => setSummaryFormat(v as SummaryFormat)}
              >
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                  <SelectItem value="bullets">Bullet Points</SelectItem>
                  <SelectItem value="key-points">Key Points</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail">Detail Level: {detailLevel[0]}%</Label>
            <Slider
              id="detail"
              value={detailLevel}
              onValueChange={setDetailLevel}
              max={100}
              step={10}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">
              Lower values create briefer summaries, higher values include more
              details
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-4">
        <Button onClick={handleSummarize} disabled={loading || !input.trim()}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Summarizing...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Summarize
            </>
          )}
        </Button>
        <Button onClick={loadExample} variant="outline">
          Load Example
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleCopy} variant="outline" disabled={!output}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button onClick={handleDownload} variant="outline" disabled={!output}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
            <input
              id="file-upload"
              type="file"
              accept=".txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Label>Original Text</Label>
            <span className="text-xs text-muted-foreground">
              {wordCount} words
            </span>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 resize-none font-mono text-sm"
            placeholder="Enter or paste your text here, or upload a file..."
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Label>Summary</Label>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>{outputWordCount} words</span>
              {compressionRatio > 0 && (
                <span className="text-green-600 dark:text-green-400">
                  {compressionRatio}% shorter
                </span>
              )}
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            className="flex-1 resize-none font-mono text-sm bg-muted"
            placeholder="Summary will appear here..."
          />
        </div>
      </div>
    </div>
  );
};

export default Summarizer;
