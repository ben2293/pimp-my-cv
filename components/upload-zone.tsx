"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  onFile: (file: File) => void;
  disabled?: boolean;
};

export function UploadZone({ onFile, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-none transition-all duration-150 cursor-pointer",
        "flex flex-col items-center justify-center gap-3 p-12 text-center",
        dragging
          ? "border-accent bg-accent/5"
          : "border-border hover:border-ink",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{ minHeight: "200px" }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "var(--ink-faint)" }}
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <polyline points="9 15 12 12 15 15" />
      </svg>

      <div>
        <p
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontWeight: 600,
            fontSize: "15px",
            color: "var(--ink)",
          }}
        >
          {dragging ? "Drop it here" : "Drop your CV here"}
        </p>
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "11px",
            color: "var(--ink-faint)",
            marginTop: "4px",
          }}
        >
          PDF or DOCX · max 10MB
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) inputRef.current?.click();
        }}
        style={{
          fontFamily: "var(--font-inter-tight)",
          fontWeight: 600,
          fontSize: "12px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: "var(--ink)",
          color: "var(--cream)",
          padding: "8px 20px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Upload
      </button>
    </div>
  );
}
