import { useState, useCallback } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Copy,
  RotateCcw,
  Download,
  Upload,
  FileSpreadsheet,
  Code,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import * as XLSX from "xlsx";

type OutputFormat = "html" | "markdown" | "json" | "xlsx";

const CSVConverter = () => {
  const [csvInput, setCsvInput] = useState("");
  const [parsedData, setParsedData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [hasHeader, setHasHeader] = useState(true);
  const [delimiter, setDelimiter] = useState(",");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("html");
  const [output, setOutput] = useState("");
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  // Parse CSV data
  const parseCSV = useCallback(
    (text: string) => {
      if (!text.trim()) {
        setParsedData([]);
        setHeaders([]);
        return;
      }

      const result = Papa.parse<string[]>(text, {
        delimiter: delimiter === "auto" ? undefined : delimiter,
        skipEmptyLines: true,
      });

      if (result.data.length > 0) {
        if (hasHeader) {
          setHeaders(result.data[0]);
          setParsedData(result.data.slice(1));
        } else {
          const colCount = result.data[0].length;
          setHeaders(
            Array.from({ length: colCount }, (_, i) => `Column ${i + 1}`)
          );
          setParsedData(result.data);
        }
      }
    },
    [delimiter, hasHeader]
  );

  // Handle CSV input change
  const handleInputChange = (value: string) => {
    setCsvInput(value);
    parseCSV(value);
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [".csv", ".tsv", ".txt"];
    const isValid = validTypes.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!isValid) {
      toast.error("Please upload a CSV, TSV, or TXT file");
      return;
    }

    try {
      const text = await file.text();
      setCsvInput(text);
      parseCSV(text);
      toast.success("File loaded successfully!");
    } catch {
      toast.error("Failed to read file");
    }
  };

  // Convert to HTML table
  const toHTML = (): string => {
    if (parsedData.length === 0) return "";

    let html = '<table border="1" cellpadding="8" cellspacing="0">\n';
    html += "  <thead>\n    <tr>\n";
    headers.forEach((h) => {
      html += `      <th>${escapeHtml(h)}</th>\n`;
    });
    html += "    </tr>\n  </thead>\n";
    html += "  <tbody>\n";
    parsedData.forEach((row) => {
      html += "    <tr>\n";
      row.forEach((cell) => {
        html += `      <td>${escapeHtml(cell)}</td>\n`;
      });
      html += "    </tr>\n";
    });
    html += "  </tbody>\n</table>";
    return html;
  };

  // Convert to Markdown table
  const toMarkdown = (): string => {
    if (parsedData.length === 0) return "";

    let md = "| " + headers.join(" | ") + " |\n";
    md += "| " + headers.map(() => "---").join(" | ") + " |\n";
    parsedData.forEach((row) => {
      md += "| " + row.join(" | ") + " |\n";
    });
    return md;
  };

  // Convert to JSON
  const toJSON = (): string => {
    if (parsedData.length === 0) return "[]";

    const jsonData = parsedData.map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || "";
      });
      return obj;
    });
    return JSON.stringify(jsonData, null, 2);
  };

  // Escape HTML special characters
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  // Generate output based on format
  const handleConvert = () => {
    if (parsedData.length === 0) {
      toast.error("No data to convert");
      return;
    }

    let result = "";
    switch (outputFormat) {
      case "html":
        result = toHTML();
        break;
      case "markdown":
        result = toMarkdown();
        break;
      case "json":
        result = toJSON();
        break;
      case "xlsx":
        downloadXLSX();
        return;
    }
    setOutput(result);
    toast.success(`Converted to ${outputFormat.toUpperCase()}!`);
  };

  // Download as XLSX
  const downloadXLSX = () => {
    if (parsedData.length === 0) {
      toast.error("No data to export");
      return;
    }

    const wsData = [headers, ...parsedData];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "converted-data.xlsx");
    toast.success("Downloaded as XLSX!");
  };

  // Copy output
  const handleCopy = () => {
    if (!output) {
      toast.error("No output to copy");
      return;
    }
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  // Download output
  const handleDownload = () => {
    if (!output) {
      toast.error("No output to download");
      return;
    }

    const extensions: Record<OutputFormat, string> = {
      html: "html",
      markdown: "md",
      json: "json",
      xlsx: "xlsx",
    };

    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted-data.${extensions[outputFormat]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  // Reset
  const handleReset = () => {
    setCsvInput("");
    setParsedData([]);
    setHeaders([]);
    setOutput("");
    toast.info("Reset complete");
  };

  // Load example
  const loadExample = () => {
    const example = `Name,Age,City,Country
John Doe,28,New York,USA
Jane Smith,34,London,UK
Carlos Garcia,45,Madrid,Spain
Yuki Tanaka,31,Tokyo,Japan
Marie Dupont,29,Paris,France`;
    setCsvInput(example);
    parseCSV(example);
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">CSV to Table Converter</h1>
        <p className="text-muted-foreground">
          Convert CSV data to HTML tables, Markdown, JSON, or Excel format
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left Panel - Input */}
        <div className="flex flex-col space-y-4">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">CSV Input</CardTitle>
              <CardDescription>Paste CSV data or upload a file</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
              {/* Options */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Label htmlFor="delimiter">Delimiter:</Label>
                  <Select value={delimiter} onValueChange={setDelimiter}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=",">Comma (,)</SelectItem>
                      <SelectItem value=";">Semicolon (;)</SelectItem>
                      <SelectItem value="\t">Tab</SelectItem>
                      <SelectItem value="|">Pipe (|)</SelectItem>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="has-header"
                    checked={hasHeader}
                    onCheckedChange={setHasHeader}
                  />
                  <Label htmlFor="has-header">First row is header</Label>
                </div>
              </div>

              {/* File Upload */}
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV
                    <input
                      type="file"
                      accept=".csv,.tsv,.txt"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </Button>
                <Button variant="outline" onClick={loadExample}>
                  Load Example
                </Button>
              </div>

              {/* Text Input */}
              <Textarea
                value={csvInput}
                onChange={(e) => handleInputChange(e.target.value)}
                className="flex-1 resize-none font-mono text-sm"
                placeholder="Paste your CSV data here..."
              />

              {/* Stats */}
              {parsedData.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {parsedData.length} rows × {headers.length} columns
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Output */}
        <div className="flex flex-col space-y-4">
          {/* Output Format & Actions */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Label>Output Format:</Label>
                  <Select
                    value={outputFormat}
                    onValueChange={(v) => setOutputFormat(v as OutputFormat)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="html">HTML Table</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleConvert}
                  disabled={parsedData.length === 0}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Convert
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!output}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={!output}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview / Code Tabs */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <Tabs
                value={activeView}
                onValueChange={(v) => setActiveView(v as "preview" | "code")}
              >
                <TabsList>
                  <TabsTrigger value="preview">
                    <Eye className="h-4 w-4 mr-1" /> Preview
                  </TabsTrigger>
                  <TabsTrigger value="code">
                    <Code className="h-4 w-4 mr-1" /> Code
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {activeView === "preview" ? (
                parsedData.length > 0 ? (
                  <div className="overflow-auto max-h-[400px] border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {headers.map((header, i) => (
                            <TableHead key={i} className="font-semibold">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedData.slice(0, 100).map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {parsedData.length > 100 && (
                      <p className="text-sm text-muted-foreground p-2 text-center">
                        Showing first 100 rows of {parsedData.length}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <FileSpreadsheet className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>No data to preview</p>
                    </div>
                  </div>
                )
              ) : (
                <Textarea
                  value={output}
                  readOnly
                  className="h-full resize-none font-mono text-sm"
                  placeholder="Converted output will appear here..."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CSVConverter;
