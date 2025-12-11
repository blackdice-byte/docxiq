/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Citation, type SourceType, type CitationStyle, formatManualCitation } from "./citation-formatter";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// PDF Metadata interface
export interface PDFMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate: string;
  modificationDate: string;
  pageCount: number;
  extractedText: string;
  doi: string;
  isbn: string;
}
console.log("hello pdf extractor")

// Extract PDF metadata using pdf.js
export const extractPDFMetadata = async (file: File): Promise<PDFMetadata | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Get PDF metadata
    const metadata = await pdf.getMetadata();
    const info = metadata.info as Record<string, any>;
    console.log(metadata.metadata)

    // Extract text from first few pages
    let extractedText = "";
    const pagesToExtract = Math.min(3, pdf.numPages);

    for (let i = 1; i <= pagesToExtract; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        extractedText += pageText + " ";
      } catch (pageError) {
        console.warn(`Failed to extract text from page ${i}:`, pageError);
      }
    }

    // Parse dates
    const parseDate = (dateStr: string | undefined): string => {
      if (!dateStr) return "";
      try {
        // PDF dates are in format: D:YYYYMMDDHHmmSS
        const match = dateStr.match(/D:(\d{4})(\d{2})(\d{2})/);
        if (match) {
          return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return dateStr;
      } catch {
        return dateStr;
      }
    };

    // Extract DOI and ISBN from text
    const doiMatch = extractedText.match(/10\.\d{4,}\/[^\s]+/);
    const isbnMatch = extractedText.match(/ISBN[:\s]*([0-9-X]+)/i);

    return {
      title: info?.Title || file.name.replace(/\.pdf$/i, ""),
      author: info?.Author || "",
      subject: info?.Subject || "",
      keywords: info?.Keywords || "",
      creator: info?.Creator || "",
      producer: info?.Producer || "",
      creationDate: parseDate(info?.CreationDate),
      modificationDate: parseDate(info?.ModDate),
      pageCount: pdf.numPages,
      extractedText: extractedText.slice(0, 2000),
      doi: doiMatch ? doiMatch[0] : "",
      isbn: isbnMatch ? isbnMatch[1] : "",
    };
  } catch (error) {
    console.error("Failed to extract PDF metadata:", error);
    return null;
  }
};

// Extract metadata from document content
export const extractMetadataFromDocument = (
  content: string,
  filename: string
): Partial<Citation> => {
  // Extract title from filename
  const title = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

  // Extract year from content or filename
  const yearMatch = content.match(/\b(19|20)\d{2}\b/) || filename.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();

  // Extract author from content
  let authors = "";
  const authorPatterns = [
    /(?:by|author[s]?:?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /(?:written by|©)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
  ];
  for (const pattern of authorPatterns) {
    const match = content.match(pattern);
    if (match) {
      authors = match[1];
      break;
    }
  }
  if (!authors) authors = "[Author]";

  // Extract DOI
  const doiMatch = content.match(/10\.\d{4,}\/[^\s]+/);
  const doi = doiMatch ? doiMatch[0] : "";

  // Extract ISBN
  const isbnMatch = content.match(/ISBN[:\s]*([0-9-X]+)/i);
  const isbn = isbnMatch ? isbnMatch[1] : "";
  console.log(isbn)

  // Extract publisher
  const publisherMatch = content.match(
    /(?:publisher|published by|press|publishing)[:\s]*([A-Z][a-zA-Z\s]+)/i
  );
  const publisher = publisherMatch ? publisherMatch[1]?.trim() : "";

  return {
    authors,
    title,
    year,
    doi,
    publisher,
  };
};

// Detect source type from content/filename
export const detectSourceType = (content: string, filename: string): SourceType => {
  const lowerContent = content.toLowerCase();
  const lowerFilename = filename.toLowerCase();

  if (lowerFilename.includes("article") || lowerContent.includes("journal") || lowerContent.includes("doi:")) {
    return "journal";
  }
  if (lowerContent.includes("http") || lowerContent.includes("www.")) {
    return "website";
  }
  return "book";
};

// Generate manual citation from document
export const generateCitationFromDocument = (
  content: string,
  filename: string,
  style: CitationStyle
): string => {
  const metadata = extractMetadataFromDocument(content, filename);
  const sourceType = detectSourceType(content, filename);
  return formatManualCitation(metadata, sourceType, style);
};

// Extract metadata from URL
export const extractMetadataFromURL = (urlString: string): Partial<Citation> & { sourceType: SourceType } => {
  try {
    const url = new URL(urlString);

    // Extract website name from hostname
    const websiteName = url.hostname.replace(/^www\./, "").split(".")[0];
    const capitalizedWebsiteName = websiteName.charAt(0).toUpperCase() + websiteName.slice(1);

    // Extract title from pathname
    const pathParts = url.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || "";
    const title =
      lastPart
        .replace(/[-_]/g, " ")
        .replace(/\.[^/.]+$/, "")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") || capitalizedWebsiteName;

    // Determine source type
    let sourceType: SourceType = "website";
    if (url.hostname.includes("youtube") || url.hostname.includes("vimeo")) {
      sourceType = "video";
    }

    // Get current date for access date
    const today = new Date();
    const accessDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      sourceType,
      authors: "[Author/Organization]",
      title: title || "[Page Title]",
      year: new Date().getFullYear().toString(),
      websiteName: capitalizedWebsiteName,
      url: urlString,
      accessDate,
      channelName: sourceType === "video" ? capitalizedWebsiteName : "",
      videoUrl: sourceType === "video" ? urlString : "",
    };
  } catch {
    // Invalid URL, return basic data
    return {
      sourceType: "website",
      authors: "[Author]",
      title: "[Page Title]",
      year: new Date().getFullYear().toString(),
      websiteName: "[Website]",
      url: urlString,
      accessDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  }
};

// Generate manual citation from URL
export const generateCitationFromURL = (urlString: string, style: CitationStyle): string => {
  const { sourceType, ...metadata } = extractMetadataFromURL(urlString);
  return formatManualCitation(metadata, sourceType, style);
};

// Log file metadata for debugging
export const logFileMetadata = (file: File, content?: string): void => {
  console.log("=== FILE METADATA ===");
  console.log("Name:", file.name);
  console.log("Type (MIME):", file.type);
  console.log("Size (KB):", (file.size / 1024).toFixed(2));
  console.log("Last Modified:", new Date(file.lastModified).toISOString());

  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
  const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  console.log("Extension:", fileExtension);
  console.log("Name without extension:", fileNameWithoutExt);

  const yearMatch = file.name.match(/\b(19|20)\d{2}\b/);
  console.log("Year in filename:", yearMatch ? yearMatch[0] : "None");

  if (content) {
    console.log("=== CONTENT METADATA ===");
    console.log("Content length:", content.length);
    console.log("First 500 chars:", content.slice(0, 500));
    console.log("Line count:", content.split("\n").length);

    const contentYearMatch = content.match(/\b(19|20)\d{2}\b/);
    console.log("Year in content:", contentYearMatch ? contentYearMatch[0] : "None");

    const authorMatch = content.match(/(?:by|author[s]?:?|written by|©)\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/i);
    console.log("Author found:", authorMatch ? authorMatch[1] : "None");

    const doiMatch = content.match(/10\.\d{4,}\/[^\s]+/);
    console.log("DOI found:", doiMatch ? doiMatch[0] : "None");
  }

  console.log("=== END METADATA ===");
};
