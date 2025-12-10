import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BookOpen, Globe, FileText, Video, Wand2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Citation, type SourceType, type CitationStyle, CITATION_STYLE_NAMES } from "@/utils/citation-formatter";

interface CitationFormProps {
  sourceType: SourceType;
  citationStyle: CitationStyle;
  currentCitation: Partial<Citation>;
  useAI: boolean;
  onSourceTypeChange: (type: SourceType) => void;
  onStyleChange: (style: CitationStyle) => void;
  onInputChange: (field: keyof Citation, value: string) => void;
  onUseAIChange: (useAI: boolean) => void;
}

export const CitationForm = ({
  sourceType,
  citationStyle,
  currentCitation,
  useAI,
  onSourceTypeChange,
  onStyleChange,
  onInputChange,
  onUseAIChange,
}: CitationFormProps) => {
  return (
    <div className="space-y-4">
      {/* AI Toggle */}
      <div className="p-3 bg-muted rounded-md space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            <Label htmlFor="use-ai">Use AI for formatting</Label>
          </div>
          <Switch id="use-ai" checked={useAI} onCheckedChange={onUseAIChange} />
        </div>
        <p className="text-xs text-muted-foreground">
          {useAI
            ? "AI mode: Uses Gemini AI for precise formatting (requires API)"
            : "Manual mode: Uses built-in templates (faster, no API needed)"}
        </p>
      </div>

      {/* Source Type & Style */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Source Type</Label>
          <Select value={sourceType} onValueChange={(v) => onSourceTypeChange(v as SourceType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="book">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Book
                </div>
              </SelectItem>
              <SelectItem value="website">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Website
                </div>
              </SelectItem>
              <SelectItem value="journal">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Journal Article
                </div>
              </SelectItem>
              <SelectItem value="video">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" /> Video
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Citation Style</Label>
          <Select value={citationStyle} onValueChange={(v) => onStyleChange(v as CitationStyle)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CITATION_STYLE_NAMES).map(([key, name]) => (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Common Fields */}
      <div className="space-y-2">
        <Label htmlFor="authors">Author(s) *</Label>
        <Input
          id="authors"
          value={currentCitation.authors || ""}
          onChange={(e) => onInputChange("authors", e.target.value)}
          placeholder="e.g., Smith, John or Smith, J. & Doe, J."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={currentCitation.title || ""}
          onChange={(e) => onInputChange("title", e.target.value)}
          placeholder="Title of the work"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          value={currentCitation.year || ""}
          onChange={(e) => onInputChange("year", e.target.value)}
          placeholder="e.g., 2023"
        />
      </div>

      {/* Source-specific Fields */}
      {sourceType === "book" && (
        <BookFields currentCitation={currentCitation} onInputChange={onInputChange} />
      )}
      {sourceType === "website" && (
        <WebsiteFields currentCitation={currentCitation} onInputChange={onInputChange} />
      )}
      {sourceType === "journal" && (
        <JournalFields currentCitation={currentCitation} onInputChange={onInputChange} />
      )}
      {sourceType === "video" && (
        <VideoFields currentCitation={currentCitation} onInputChange={onInputChange} />
      )}
    </div>
  );
};

// Source-specific field components
const BookFields = ({ currentCitation, onInputChange }: { currentCitation: Partial<Citation>; onInputChange: (field: keyof Citation, value: string) => void }) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="publisher">Publisher</Label>
      <Input
        id="publisher"
        value={currentCitation.publisher || ""}
        onChange={(e) => onInputChange("publisher", e.target.value)}
        placeholder="Publisher name"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="pages">Pages</Label>
      <Input
        id="pages"
        value={currentCitation.pages || ""}
        onChange={(e) => onInputChange("pages", e.target.value)}
        placeholder="e.g., 45-67"
      />
    </div>
  </>
);

const WebsiteFields = ({ currentCitation, onInputChange }: { currentCitation: Partial<Citation>; onInputChange: (field: keyof Citation, value: string) => void }) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="websiteName">Website Name</Label>
      <Input
        id="websiteName"
        value={currentCitation.websiteName || ""}
        onChange={(e) => onInputChange("websiteName", e.target.value)}
        placeholder="e.g., BBC News"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="url">URL</Label>
      <Input
        id="url"
        value={currentCitation.url || ""}
        onChange={(e) => onInputChange("url", e.target.value)}
        placeholder="https://..."
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="accessDate">Access Date</Label>
      <Input
        id="accessDate"
        value={currentCitation.accessDate || ""}
        onChange={(e) => onInputChange("accessDate", e.target.value)}
        placeholder="e.g., December 7, 2025"
      />
    </div>
  </>
);

const JournalFields = ({ currentCitation, onInputChange }: { currentCitation: Partial<Citation>; onInputChange: (field: keyof Citation, value: string) => void }) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="journalName">Journal Name</Label>
      <Input
        id="journalName"
        value={currentCitation.journalName || ""}
        onChange={(e) => onInputChange("journalName", e.target.value)}
        placeholder="Journal name"
      />
    </div>
    <div className="grid grid-cols-3 gap-2">
      <div className="space-y-2">
        <Label htmlFor="volume">Volume</Label>
        <Input
          id="volume"
          value={currentCitation.volume || ""}
          onChange={(e) => onInputChange("volume", e.target.value)}
          placeholder="Vol."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="issue">Issue</Label>
        <Input
          id="issue"
          value={currentCitation.issue || ""}
          onChange={(e) => onInputChange("issue", e.target.value)}
          placeholder="Issue"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pages">Pages</Label>
        <Input
          id="pages"
          value={currentCitation.pages || ""}
          onChange={(e) => onInputChange("pages", e.target.value)}
          placeholder="pp."
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="doi">DOI</Label>
      <Input
        id="doi"
        value={currentCitation.doi || ""}
        onChange={(e) => onInputChange("doi", e.target.value)}
        placeholder="e.g., 10.1000/xyz123"
      />
    </div>
  </>
);

const VideoFields = ({ currentCitation, onInputChange }: { currentCitation: Partial<Citation>; onInputChange: (field: keyof Citation, value: string) => void }) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="channelName">Channel Name</Label>
      <Input
        id="channelName"
        value={currentCitation.channelName || ""}
        onChange={(e) => onInputChange("channelName", e.target.value)}
        placeholder="YouTube channel name"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="videoUrl">Video URL</Label>
      <Input
        id="videoUrl"
        value={currentCitation.videoUrl || ""}
        onChange={(e) => onInputChange("videoUrl", e.target.value)}
        placeholder="https://youtube.com/..."
      />
    </div>
  </>
);

export default CitationForm;
