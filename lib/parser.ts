"use client";

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    return extractFromPDF(file);
  } else if (ext === "docx" || ext === "doc") {
    return extractFromDOCX(file);
  }
  throw new Error("Unsupported file type. Upload a PDF or DOCX.");
}

async function extractFromPDF(file: File): Promise<string> {
  // Try pdfjs first (free, client-side, works for text-based PDFs)
  try {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      pages.push(pageText);
    }

    const text = pages.join("\n\n");
    if (text.trim().length >= 50) return text;
  } catch {
    // pdfjs failed — fall through to Claude
  }

  // Fallback: scanned/image-based PDF — use Claude native PDF reading
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/parse-pdf", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Could not parse PDF. Please try again.");
  }

  const { text } = await res.json();
  return text;
}

async function extractFromDOCX(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  if (result.messages && result.messages.some((m: { type: string }) => m.type === "error")) {
    throw new Error("Could not read DOCX file. The file may be corrupted.");
  }
  return result.value;
}
