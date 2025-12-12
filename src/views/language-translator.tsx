import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Copy,
  RotateCcw,
  Download,
  Loader2,
  Languages,
  ArrowRightLeft,
  Volume2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

interface Language {
  code: string;
  name: string;
}

// LibreTranslate supported languages
const LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "az", name: "Azerbaijani" },
  { code: "zh", name: "Chinese" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "hu", name: "Hungarian" },
  { code: "id", name: "Indonesian" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "fa", name: "Persian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sk", name: "Slovak" },
  { code: "es", name: "Spanish" },
  { code: "sv", name: "Swedish" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "vi", name: "Vietnamese" },
];

// LibreTranslate API endpoints (public instances)
const LIBRE_TRANSLATE_URLS = [
  "https://libretranslate.com",
  "https://translate.argosopentech.com",
  "https://translate.terraprint.co",
];

const LanguageTranslator = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState(LIBRE_TRANSLATE_URLS[0]);

  // Debounced language detection
  useEffect(() => {
    const detectLanguage = async (text: string) => {
      if (!text.trim()) return;

      try {
        const response = await fetch(`${apiUrl}/detect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: text.slice(0, 500) }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data[0]) {
            setDetectedLang(data[0].language);
          }
        }
      } catch {
        // Silent fail for detection
      }
    };

    const timer = setTimeout(() => {
      if (input.length > 10) {
        detectLanguage(input);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [input, apiUrl]);

  const handleTranslate = async () => {
    if (!input.trim()) {
      toast.error("Please enter text to translate");
      return;
    }

    setLoading(true);
    setError(null);

    // Try each API endpoint until one works
    for (const url of LIBRE_TRANSLATE_URLS) {
      try {
        const response = await fetch(`${url}/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: input,
            source: sourceLang === "auto" ? detectedLang || "en" : sourceLang,
            target: targetLang,
            format: "text",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setOutput(data.translatedText);
          setApiUrl(url); // Remember working URL
          toast.success("Translation complete!");
          setLoading(false);
          return;
        }
      } catch {
        continue; // Try next URL
      }
    }

    setError("Translation failed. Please try again later.");
    toast.error("Translation failed");
    setLoading(false);
  };

  const handleSwapLanguages = () => {
    if (sourceLang === "auto") return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInput(output);
    setOutput(input);
  };

  const handleCopy = () => {
    if (!output) {
      toast.error("No translation to copy");
      return;
    }
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    if (!output) {
      toast.error("No translation to download");
      return;
    }
    const content = `Source (${getLanguageName(
      sourceLang
    )}):\n${input}\n\nTranslation (${getLanguageName(targetLang)}):\n${output}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translation-${sourceLang}-to-${targetLang}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setDetectedLang(null);
    setError(null);
    toast.info("Reset complete");
  };

  const handleSpeak = (text: string, lang: string) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !file.type.startsWith("text/") &&
      !file.name.endsWith(".txt") &&
      !file.name.endsWith(".md")
    ) {
      toast.error("Please upload a text file");
      return;
    }

    try {
      const text = await file.text();
      setInput(text.slice(0, 10000)); // Limit to 10k chars
      toast.success("File loaded!");
    } catch {
      toast.error("Failed to read file");
    }
  };

  const getLanguageName = (code: string): string => {
    if (code === "auto") return "Auto-detect";
    return LANGUAGES.find((l) => l.code === code)?.name || code;
  };

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Language Translator</h1>
        <p className="text-muted-foreground">
          Translate text between 30+ languages using LibreTranslate
        </p>
      </div>

      {/* Language Selection */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Translation Settings</CardTitle>
          <CardDescription>Select source and target languages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Label>Source Language</Label>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">
                    Auto-detect{" "}
                    {detectedLang && `(${getLanguageName(detectedLang)})`}
                  </SelectItem>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapLanguages}
              disabled={sourceLang === "auto"}
              className="mt-6"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 space-y-2">
              <Label>Target Language</Label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <Button onClick={handleTranslate} disabled={loading || !input.trim()}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Languages className="h-4 w-4 mr-2" />
              Translate
            </>
          )}
        </Button>
        <Button variant="outline" asChild>
          <label className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
            <input
              type="file"
              accept=".txt,.md,text/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
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
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Text Areas */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Label className="flex items-center gap-2">
              Source Text
              {detectedLang && sourceLang === "auto" && (
                <span className="text-xs text-muted-foreground">
                  (Detected: {getLanguageName(detectedLang)})
                </span>
              )}
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {wordCount} words · {charCount} chars
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() =>
                  handleSpeak(
                    input,
                    sourceLang === "auto" ? detectedLang || "en" : sourceLang
                  )
                }
                disabled={!input}
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 resize-none font-mono text-sm"
            placeholder="Enter text to translate..."
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Label>Translation ({getLanguageName(targetLang)})</Label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleSpeak(output, targetLang)}
              disabled={!output}
            >
              <Volume2 className="h-3 w-3" />
            </Button>
          </div>
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            className="flex-1 resize-none font-mono text-sm"
            placeholder="Translation will appear here..."
          />
        </div>
      </div>
    </div>
  );
};

export default LanguageTranslator;
