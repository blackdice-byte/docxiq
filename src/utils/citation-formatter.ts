// Citation types
export type SourceType = "book" | "website" | "journal" | "video";
export type CitationStyle = "apa" | "mla" | "chicago" | "harvard" | "ieee";

export interface Citation {
  id: string;
  sourceType: SourceType;
  authors: string;
  title: string;
  year: string;
  publisher?: string;
  url?: string;
  accessDate?: string;
  journalName?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  websiteName?: string;
  channelName?: string;
  videoUrl?: string;
  formatted?: Record<CitationStyle, string>;
}

// Style name mapping
export const CITATION_STYLE_NAMES: Record<CitationStyle, string> = {
  apa: "APA 7th Edition",
  mla: "MLA 9th Edition",
  chicago: "Chicago 17th Edition",
  harvard: "Harvard",
  ieee: "IEEE",
};

export const getStyleName = (style: CitationStyle): string => {
  return CITATION_STYLE_NAMES[style];
};

// Author formatting functions
export const formatAuthorAPA = (authors: string): string => {
  if (!authors) return "";
  const authorList = authors
    .split(/[,&]/)
    .map((a) => a.trim())
    .filter(Boolean);
  if (authorList.length === 1) return authorList[0];
  if (authorList.length === 2) return `${authorList[0]} & ${authorList[1]}`;
  return `${authorList.slice(0, -1).join(", ")}, & ${authorList[authorList.length - 1]}`;
};

export const formatAuthorMLA = (authors: string): string => {
  if (!authors) return "";
  const authorList = authors
    .split(/[,&]/)
    .map((a) => a.trim())
    .filter(Boolean);
  if (authorList.length === 1) return authorList[0];
  if (authorList.length === 2) return `${authorList[0]}, and ${authorList[1]}`;
  return `${authorList[0]}, et al.`;
};

// Main citation formatting function
export const formatManualCitation = (
  citation: Partial<Citation>,
  sourceType: SourceType,
  style: CitationStyle
): string => {
  const {
    authors = "",
    title = "",
    year = "",
    publisher = "",
    url = "",
    accessDate = "",
    journalName = "",
    volume = "",
    issue = "",
    pages = "",
    doi = "",
    websiteName = "",
    channelName = "",
    videoUrl = "",
  } = citation;

  switch (style) {
    case "apa":
      return formatAPACitation(sourceType, { authors, title, year, publisher, url, accessDate, journalName, volume, issue, pages, doi, websiteName, channelName, videoUrl });
    case "mla":
      return formatMLACitation(sourceType, { authors, title, year, publisher, url, accessDate, journalName, volume, issue, pages, doi, websiteName, channelName, videoUrl });
    case "chicago":
      return formatChicagoCitation(sourceType, { authors, title, year, publisher, url, journalName, volume, issue, pages, doi, websiteName, channelName, videoUrl });
    case "harvard":
      return formatHarvardCitation(sourceType, { authors, title, year, publisher, url, accessDate, journalName, volume, issue, pages, doi, websiteName, channelName, videoUrl });
    case "ieee":
      return formatIEEECitation(sourceType, { authors, title, year, publisher, url, accessDate, journalName, volume, issue, pages, doi, websiteName, channelName, videoUrl });
  }
  return "";
};

// Individual style formatters
const formatAPACitation = (sourceType: SourceType, data: Record<string, string>): string => {
  const { authors, title, year, publisher, url, accessDate, journalName, volume, issue, pages, doi, websiteName, channelName, videoUrl } = data;
  
  switch (sourceType) {
    case "book":
      return `${formatAuthorAPA(authors)}${year ? ` (${year})` : ""}. *${title}*${publisher ? `. ${publisher}` : ""}.`;
    case "website":
      return `${formatAuthorAPA(authors)}${year ? ` (${year})` : ""}. ${title}. ${websiteName || ""}. ${url ? `Retrieved ${accessDate || "n.d."} from ${url}` : ""}`;
    case "journal":
      return `${formatAuthorAPA(authors)}${year ? ` (${year})` : ""}. ${title}. *${journalName}*${volume ? `, ${volume}` : ""}${issue ? `(${issue})` : ""}${pages ? `, ${pages}` : ""}.${doi ? ` https://doi.org/${doi}` : ""}`;
    case "video":
      return `${channelName || authors}${year ? ` (${year})` : ""}. *${title}* [Video]. YouTube. ${videoUrl || ""}`;
  }
  return "";
};

const formatMLACitation = (sourceType: SourceType, data: Record<string, string>): string => {
  const { authors, title, year, publisher, url, accessDate, journalName, volume, issue, pages, doi, websiteName, channelName, videoUrl } = data;
  
  switch (sourceType) {
    case "book":
      return `${formatAuthorMLA(authors)}. *${title}*. ${publisher || ""}${year ? `, ${year}` : ""}.`;
    case "website":
      return `${formatAuthorMLA(authors)}. "${title}." *${websiteName || ""}*${year ? `, ${year}` : ""}${url ? `, ${url}` : ""}. Accessed ${accessDate || "n.d."}.`;
    case "journal":
      return `${formatAuthorMLA(authors)}. "${title}." *${journalName}*${volume ? `, vol. ${volume}` : ""}${issue ? `, no. ${issue}` : ""}${year ? `, ${year}` : ""}${pages ? `, pp. ${pages}` : ""}.${doi ? ` DOI: ${doi}` : ""}`;
    case "video":
      return `"${title}." YouTube, uploaded by ${channelName || authors}${year ? `, ${year}` : ""}, ${videoUrl || ""}.`;
  }
  return "";
};

const formatChicagoCitation = (sourceType: SourceType, data: Record<string, string>): string => {
  const { authors, title, year, publisher, url, journalName, volume, issue, pages, doi, websiteName, channelName, videoUrl } = data;
  
  switch (sourceType) {
    case "book":
      return `${formatAuthorMLA(authors)}. *${title}*. ${publisher || ""}${year ? `, ${year}` : ""}.`;
    case "website":
      return `${formatAuthorMLA(authors)}. "${title}." ${websiteName || ""}${year ? `. ${year}` : ""}. ${url || ""}`;
    case "journal":
      return `${formatAuthorMLA(authors)}. "${title}." *${journalName}* ${volume || ""}${issue ? `, no. ${issue}` : ""} (${year || "n.d."})${pages ? `: ${pages}` : ""}.${doi ? ` https://doi.org/${doi}` : ""}`;
    case "video":
      return `${channelName || authors}. "${title}." YouTube video${year ? `, ${year}` : ""}. ${videoUrl || ""}`;
  }
  return "";
};

const formatHarvardCitation = (sourceType: SourceType, data: Record<string, string>): string => {
  const { authors, title, year, publisher, url, accessDate, journalName, volume, issue, pages, doi, websiteName, channelName, videoUrl } = data;
  
  switch (sourceType) {
    case "book":
      return `${formatAuthorAPA(authors)} (${year || "n.d."}) *${title}*. ${publisher || ""}.`;
    case "website":
      return `${formatAuthorAPA(authors)} (${year || "n.d."}) ${title}. [online] ${websiteName || ""}. Available at: ${url || ""} [Accessed ${accessDate || "n.d."}].`;
    case "journal":
      return `${formatAuthorAPA(authors)} (${year || "n.d."}) '${title}', *${journalName}*${volume ? `, ${volume}` : ""}${issue ? `(${issue})` : ""}${pages ? `, pp. ${pages}` : ""}.${doi ? ` doi: ${doi}` : ""}`;
    case "video":
      return `${channelName || authors} (${year || "n.d."}) *${title}*. [video] Available at: ${videoUrl || ""}`;
  }
  return "";
};

const formatIEEECitation = (sourceType: SourceType, data: Record<string, string>): string => {
  const { authors, title, year, publisher, url, accessDate, journalName, volume, issue, pages, doi, websiteName, channelName, videoUrl } = data;
  
  switch (sourceType) {
    case "book":
      return `${authors}, *${title}*. ${publisher || ""}${year ? `, ${year}` : ""}.`;
    case "website":
      return `${authors}, "${title}," ${websiteName || ""}${year ? `, ${year}` : ""}. [Online]. Available: ${url || ""}. [Accessed: ${accessDate || "n.d."}].`;
    case "journal":
      return `${authors}, "${title}," *${journalName}*${volume ? `, vol. ${volume}` : ""}${issue ? `, no. ${issue}` : ""}${pages ? `, pp. ${pages}` : ""}${year ? `, ${year}` : ""}.${doi ? ` doi: ${doi}` : ""}`;
    case "video":
      return `${channelName || authors}, "${title}," YouTube${year ? `, ${year}` : ""}. [Online Video]. Available: ${videoUrl || ""}`;
  }
  return "";
};

// Generate unique ID
export const generateCitationId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
