import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download, Trash2, BookOpen, Globe, FileText, Video, AlertCircle } from "lucide-react";
import { type Citation, type CitationStyle, type SourceType, getStyleName } from "@/utils/citation-formatter";
import { toast } from "sonner";

interface CitationListProps {
  citations: Citation[];
  citationStyle: CitationStyle;
  error?: string | null;
  onDelete: (id: string) => void;
  onCopyAll: () => void;
  onDownload: () => void;
}

const getSourceIcon = (type: SourceType) => {
  switch (type) {
    case "book":
      return <BookOpen className="h-4 w-4" />;
    case "website":
      return <Globe className="h-4 w-4" />;
    case "journal":
      return <FileText className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
  }
};

export const CitationList = ({
  citations,
  citationStyle,
  error,
  onDelete,
  onCopyAll,
  onDownload,
}: CitationListProps) => {
  const handleCopy = (text: string) => {
    if (!text) {
      toast.error("Nothing to copy");
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Generated Citations</CardTitle>
            <CardDescription>
              {citations.length} citation(s) in {getStyleName(citationStyle)}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyAll}
              disabled={citations.length === 0}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              disabled={citations.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
        <div className="space-y-3 max-h-[400px] overflow-auto">
          {citations.length > 0 ? (
            citations.map((citation) => (
              <div key={citation.id} className="p-3 border rounded-md bg-muted/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getSourceIcon(citation.sourceType)}
                    <p className="text-sm flex-1">
                      {citation.formatted?.[citationStyle] || "Generating..."}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(citation.formatted?.[citationStyle] || "")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(citation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No citations yet</p>
              <p className="text-xs mt-1">Fill in the form and click "Generate Citation"</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CitationList;
