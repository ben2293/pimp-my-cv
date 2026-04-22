"use client";

import { useState } from "react";
import { TEMPLATES, TemplateId } from "@/lib/templates";

type Props = {
  onSelect: (id: TemplateId) => void;
};

const PREVIEWS: Record<TemplateId, React.ReactNode> = {
  clean: (
    <div style={{ background: "#fff", height: "100%", padding: "12px", fontFamily: "var(--font-inter-tight)" }}>
      <div style={{ fontFamily: "var(--font-fraunces)", fontSize: "18px", fontWeight: 900, letterSpacing: "-0.03em", color: "#111", marginBottom: "2px" }}>
        Your Name
      </div>
      <div style={{ fontSize: "7px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: "8px" }}>Senior Engineer</div>
      <div style={{ height: "1px", background: "#e0dbd2", marginBottom: "6px" }} />
      <div style={{ fontSize: "6px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e63946", marginBottom: "4px" }}>Experience</div>
      <div style={{ height: "1px", background: "#e0dbd2", marginBottom: "5px" }} />
      {[1,2,3].map(i => <div key={i} style={{ height: "4px", background: "#eee", marginBottom: "3px", borderRadius: "1px", width: i === 1 ? "85%" : i === 2 ? "70%" : "60%" }} />)}
      <div style={{ fontSize: "6px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e63946", margin: "8px 0 4px" }}>Skills</div>
      <div style={{ height: "1px", background: "#e0dbd2", marginBottom: "5px" }} />
      <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
        {["React","Node","Python","SQL"].map(s => <span key={s} style={{ fontSize: "5px", border: "1px solid #ddd", padding: "1px 4px", color: "#666" }}>{s}</span>)}
      </div>
    </div>
  ),
  ghost: (
    <div style={{ background: "#fff", height: "100%", padding: "12px 12px 12px 18px", fontFamily: "var(--font-inter-tight)", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "10px", width: "2px", height: "100%", background: "#e63946" }} />
      <div style={{ fontFamily: "var(--font-fraunces)", fontSize: "16px", fontWeight: 900, color: "#111", marginBottom: "1px" }}>Your Name</div>
      <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "6px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#bbb", marginBottom: "10px" }}>Senior Engineer</div>
      {["Experience","Skills","Education"].map((s, i) => (
        <div key={s} style={{ marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#e63946" }}>{s}</span>
            <div style={{ flex: 1, height: "1px", background: "#eee" }} />
          </div>
          {[0,1].map(j => <div key={j} style={{ height: "3.5px", background: "#f0f0f0", marginBottom: "2px", width: j === 0 ? "80%" : "55%" }} />)}
        </div>
      ))}
    </div>
  ),
  scarlet: (
    <div style={{ background: "#f5f0e8", height: "100%", padding: "10px 12px", fontFamily: "var(--font-inter-tight)" }}>
      <div style={{ fontFamily: "var(--font-fraunces)", fontSize: "28px", fontWeight: 900, color: "#e63946", lineHeight: 0.9, letterSpacing: "-0.04em", marginBottom: "8px" }}>
        Your<br />Name
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "45px 1fr", gap: "6px" }}>
        <div style={{ borderRight: "1px solid #ddd", paddingRight: "5px" }}>
          {["Contact","Edu","Skills"].map(s => (
            <div key={s} style={{ marginBottom: "6px" }}>
              <div style={{ fontSize: "5px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#e63946", marginBottom: "2px" }}>{s}</div>
              <div style={{ height: "3px", background: "#e0dbd2", marginBottom: "2px", width: "80%" }} />
              <div style={{ height: "3px", background: "#e0dbd2", width: "60%" }} />
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e63946", marginBottom: "3px" }}>Experience</div>
          <div style={{ height: "1px", background: "#ddd", marginBottom: "4px" }} />
          {[85,70,60,75,55].map((w, i) => <div key={i} style={{ height: "3px", background: "#e8e3da", marginBottom: "2px", width: `${w}%` }} />)}
        </div>
      </div>
    </div>
  ),
  bold: (
    <div style={{ background: "#f0ebe0", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 12px 6px" }}>
        <div style={{ fontFamily: "var(--font-fraunces)", fontSize: "32px", fontWeight: 900, color: "#111", lineHeight: 0.88, textTransform: "uppercase", letterSpacing: "0.01em" }}>
          YOUR<br />NAME
        </div>
        <div style={{ fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#e63946", marginTop: "3px" }}>
          Senior Engineer
        </div>
      </div>
      <div style={{ height: "2px", background: "#111", margin: "0 12px 6px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", padding: "0 12px", flex: 1 }}>
        <div>
          <div style={{ fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#111", marginBottom: "2px" }}>Experience</div>
          <div style={{ height: "1.5px", background: "#111", marginBottom: "4px" }} />
          {[80,65,55].map((w,i) => <div key={i} style={{ height: "3px", background: "#ddd8ce", marginBottom: "2px", width: `${w}%` }} />)}
        </div>
        <div style={{ borderLeft: "1px solid #ccc", paddingLeft: "6px" }}>
          <div style={{ fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#111", marginBottom: "2px" }}>Skills</div>
          <div style={{ height: "1.5px", background: "#111", marginBottom: "4px" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
            {["React","TS","Node","SQL","AWS"].map(s => <span key={s} style={{ fontSize: "4.5px", border: "1px solid #111", padding: "1px 3px" }}>{s}</span>)}
          </div>
        </div>
      </div>
      <div style={{ background: "#111", padding: "5px 12px", marginTop: "auto" }}>
        <span style={{ fontSize: "8px", fontWeight: 900, color: "#e63946", letterSpacing: "0.08em" }}>CONTACT</span>
        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "5px", color: "#888", marginLeft: "8px" }}>email · phone · linkedin</span>
      </div>
    </div>
  ),
};

export function TemplatePicker({ onSelect }: Props) {
  const [hovered, setHovered] = useState<TemplateId | null>(null);
  const [selected, setSelected] = useState<TemplateId>("clean");

  function confirm() {
    onSelect(selected);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(10,10,10,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{ maxWidth: "860px", width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#e63946", marginBottom: "10px" }}>
            Step 2 of 2
          </p>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "36px", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", margin: 0 }}>
            Pick your template
          </h2>
          <p style={{ fontFamily: "var(--font-inter-tight)", fontSize: "14px", color: "#666", marginTop: "8px" }}>
            You can change this later in the editor.
          </p>
        </div>

        {/* Template grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => setSelected(tmpl.id)}
              onMouseEnter={() => setHovered(tmpl.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                cursor: "pointer",
                border: selected === tmpl.id ? "2px solid #e63946" : "2px solid transparent",
                outline: hovered === tmpl.id && selected !== tmpl.id ? "2px solid #444" : "none",
                transition: "border 0.1s, outline 0.1s",
                background: "#1a1a1a",
                overflow: "hidden",
              }}
            >
              {/* Preview */}
              <div style={{ height: "200px", overflow: "hidden" }}>
                {PREVIEWS[tmpl.id]}
              </div>

              {/* Label */}
              <div style={{ padding: "10px 12px", background: selected === tmpl.id ? "#e63946" : "#1a1a1a", transition: "background 0.1s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-fraunces)", fontSize: "16px", fontWeight: 900, letterSpacing: "-0.02em", color: "#fff" }}>
                    {tmpl.name}
                  </span>
                  {tmpl.premium && (
                    <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: selected === tmpl.id ? "#fff" : "#e63946", border: `1px solid ${selected === tmpl.id ? "#fff" : "#e63946"}`, padding: "1px 5px" }}>
                      Premium
                    </span>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-inter-tight)", fontSize: "11px", color: selected === tmpl.id ? "rgba(255,255,255,0.8)" : "#666", margin: "2px 0 0" }}>
                  {tmpl.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Confirm */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={confirm}
            style={{
              fontFamily: "var(--font-inter-tight)",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: "#e63946",
              color: "#fff",
              border: "none",
              padding: "14px 48px",
              cursor: "pointer",
            }}
          >
            Use {TEMPLATES.find(t => t.id === selected)?.name} →
          </button>
        </div>
      </div>
    </div>
  );
}
