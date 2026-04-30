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
