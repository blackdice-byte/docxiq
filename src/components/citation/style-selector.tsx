import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type CitationStyle, CITATION_STYLE_NAMES } from "@/utils/citation-formatter";

interface StyleSelectorProps {
  value: CitationStyle;
  onChange: (style: CitationStyle) => void;
  label?: string;
}

export const StyleSelector = ({ value, onChange, label = "Citation Style" }: StyleSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={(v) => onChange(v as CitationStyle)}>
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
  );
};

export default StyleSelector;
