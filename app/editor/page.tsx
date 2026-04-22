"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CVTemplate } from "@/components/cv-template";
import { BoldTemplate } from "@/components/templates/bold";
import { ScarletTemplate } from "@/components/templates/scarlet";
import { GhostTemplate } from "@/components/templates/ghost";
import { TemplatePicker } from "@/components/template-picker";
import { CVData, CVScore } from "@/lib/types";
import { FONT_PAIRINGS, FontPairing } from "@/lib/fonts";
import { TemplateId, TEMPLATES } from "@/lib/templates";

function scoreLabel(total: number): { label: string; color: string } {
  if (total <= 20) return { label: "Terminal", color: "#e63946" };
  if (total <= 40) return { label: "Yikes", color: "#e07000" };
  if (total <= 60) return { label: "Mediocre", color: "#b59500" };
  if (total <= 80) return { label: "Decent", color: "#4a9e6b" };
  return { label: "Already good?", color: "#2d7d46" };
}

function CVRenderer({ templateId, data, fontPairing }: { templateId: TemplateId; data: CVData; fontPairing: FontPairing }) {
  switch (templateId) {
    case "bold": return <BoldTemplate data={data} />;
    case "scarlet": return <ScarletTemplate data={data} />;
    case "ghost": return <GhostTemplate data={data} fontPairing={fontPairing} />;
    default: return <CVTemplate data={data} fontPairing={fontPairing} />;
  }
}

export default function EditorPage() {
  const router = useRouter();
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [score, setScore] = useState<CVScore | null>(null);
  const [selectedFont, setSelectedFont] = useState<FontPairing>(FONT_PAIRINGS[0]);
  const [templateId, setTemplateId] = useState<TemplateId | null>(null);
  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("cv_data");
    const storedScore = sessionStorage.getItem("cv_score");
    if (!stored) { router.replace("/"); return; }
    try {
      setCvData(JSON.parse(stored));
      if (storedScore) setScore(JSON.parse(storedScore));
    } catch { router.replace("/"); }
  }, [router]);


  function updateField(path: string[], value: unknown) {
    if (!cvData) return;
    const updated = structuredClone(cvData);
    let obj: Record<string, unknown> = updated as unknown as Record<string, unknown>;
    for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]] as Record<string, unknown>;
    obj[path[path.length - 1]] = value;
    setCvData(updated);
    sessionStorage.setItem("cv_data", JSON.stringify(updated));
  }

  if (!cvData) return (
    <div style={{ minHeight: "100vh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jetbrains-mono)", fontSize: "12px", color: "#444" }}>
      Loading...
    </div>
  );

  // Show template picker first
  if (!templateId) return <TemplatePicker onSelect={(id) => setTemplateId(id)} />;

  const verdict = score ? scoreLabel(score.total) : null;
  const currentTemplate = TEMPLATES.find(t => t.id === templateId)!;
  const showFontPicker = !currentTemplate.lockedFonts;

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      {/* Toolbar */}
      <div className="no-print" style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--ink)", color: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <button onClick={() => router.push("/")} style={{ fontFamily: "var(--font-inter-tight)", fontSize: "12px", background: "none", border: "none", color: "#999", cursor: "pointer" }}>
            ← Back
          </button>
          <span style={{ fontFamily: "var(--font-fraunces)", fontWeight: 900, fontSize: "16px", letterSpacing: "-0.02em" }}>
            pimp<span style={{ color: "var(--accent)" }}>my</span>cv
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setTemplateId(null)}
            style={{ fontFamily: "var(--font-inter-tight)", fontSize: "12px", background: "none", border: "1px solid #444", color: "#aaa", padding: "6px 14px", cursor: "pointer" }}
          >
            Change template
          </button>
          <button onClick={() => window.print()} style={{ fontFamily: "var(--font-inter-tight)", fontWeight: 700, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", background: "var(--accent)", color: "#fff", border: "none", padding: "8px 20px", cursor: "pointer" }}>
            Download PDF
          </button>
        </div>
      </div>

      {/* Score banner */}
      {score && verdict && (
        <div className="no-print" style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "14px 32px", display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
          <div>
            <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "9px", color: "var(--ink-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Original CV score</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "2px" }}>
              <span style={{ fontFamily: "var(--font-fraunces)", fontSize: "34px", fontWeight: 900, lineHeight: 1, color: verdict.color }}>{score.total}</span>
              <span style={{ fontFamily: "var(--font-inter-tight)", fontSize: "11px", color: "var(--ink-muted)" }}>/100</span>
              <span style={{ fontFamily: "var(--font-inter-tight)", fontWeight: 700, fontSize: "13px", color: verdict.color }}>— {verdict.label}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            {[
              { label: "Content", val: score.content },
              { label: "Structure", val: score.structure },
              { label: "Impact", val: score.impact },
              { label: "Presentation", val: score.presentation },
            ].map(({ label, val }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-fraunces)", fontSize: "20px", fontWeight: 700, lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7.5px", color: "var(--ink-faint)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "2px" }}>{label}</div>
                <div style={{ width: "40px", height: "3px", background: "var(--border)", marginTop: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${(val / 25) * 100}%`, height: "100%", background: verdict.color }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginLeft: "auto", fontFamily: "var(--font-inter-tight)", fontSize: "12px", color: "var(--ink-muted)", textAlign: "right", lineHeight: 1.5 }}>
            We fixed all of it. Download when ready.
          </div>
        </div>
      )}

      {/* Editor layout */}
      <div className="no-print" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "32px", maxWidth: "1400px", margin: "0 auto", padding: "32px", alignItems: "start" }}>

        {/* Sidebar */}
        <aside style={{ background: "#fff", border: "1px solid var(--border)", padding: "18px", maxHeight: "calc(100vh - 180px)", overflowY: "auto", position: "sticky", top: score ? "150px" : "72px" }}>

          {/* Font picker — only for non-locked templates */}
          {showFontPicker && (
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
                Typeface
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "16px" }}>
                {FONT_PAIRINGS.map((p) => (
                  <button key={p.id} onClick={() => setSelectedFont(p)} style={{ border: selectedFont.id === p.id ? "2px solid var(--ink)" : "1px solid var(--border)", background: selectedFont.id === p.id ? "var(--ink)" : "#fff", color: selectedFont.id === p.id ? "var(--cream)" : "var(--ink)", padding: "8px 10px", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontFamily: p.headingVar, fontSize: "13px", fontWeight: 700, lineHeight: 1 }}>{p.name}</div>
                    <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7.5px", color: selectedFont.id === p.id ? "#aaa" : "var(--ink-faint)", marginTop: "2px" }}>{p.tagline}</div>
                  </button>
                ))}
              </div>
              <div style={{ height: "1px", background: "var(--border)", marginBottom: "16px" }} />
            </div>
          )}

          <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>Edit Fields</p>

          <EditField label="Name" value={cvData.name} onChange={(v) => updateField(["name"], v)} />
          <EditField label="Title" value={cvData.title || ""} onChange={(v) => updateField(["title"], v)} />
          <EditField label="Email" value={cvData.contact.email || ""} onChange={(v) => updateField(["contact", "email"], v)} />
          <EditField label="Phone" value={cvData.contact.phone || ""} onChange={(v) => updateField(["contact", "phone"], v)} />
          <EditField label="Location" value={cvData.contact.location || ""} onChange={(v) => updateField(["contact", "location"], v)} />
          <EditField label="LinkedIn" value={cvData.contact.linkedin || ""} onChange={(v) => updateField(["contact", "linkedin"], v)} />
          <EditField label="GitHub" value={cvData.contact.github || ""} onChange={(v) => updateField(["contact", "github"], v)} />
          <EditField label="Summary" value={cvData.summary || ""} onChange={(v) => updateField(["summary"], v)} multiline />

          {cvData.experience.map((exp, i) => (
            <div key={i} style={{ marginTop: "18px", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "9px", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                  Exp {i + 1}: {exp.company || "New"}
                </p>
                <button onClick={() => {
                  const u = structuredClone(cvData);
                  u.experience.splice(i, 1);
                  setCvData(u);
                  sessionStorage.setItem("cv_data", JSON.stringify(u));
                }} style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "9px", color: "#bbb", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  ✕ remove
                </button>
              </div>
              <EditField label="Company" value={exp.company} onChange={(v) => {
                const u = structuredClone(cvData); u.experience[i].company = v; setCvData(u); sessionStorage.setItem("cv_data", JSON.stringify(u));
              }} />
              <EditField label="Role" value={exp.role} onChange={(v) => {
                const u = structuredClone(cvData); u.experience[i].role = v; setCvData(u); sessionStorage.setItem("cv_data", JSON.stringify(u));
              }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                <EditField label="Start" value={exp.start} onChange={(v) => {
                  const u = structuredClone(cvData); u.experience[i].start = v; setCvData(u); sessionStorage.setItem("cv_data", JSON.stringify(u));
                }} />
                <EditField label="End" value={exp.end} onChange={(v) => {
                  const u = structuredClone(cvData); u.experience[i].end = v; setCvData(u); sessionStorage.setItem("cv_data", JSON.stringify(u));
                }} />
              </div>
              {exp.bullets.map((bullet, j) => (
                <EditField key={j} label={`Bullet ${j + 1}`} value={bullet} multiline onChange={(v) => {
                  const u = structuredClone(cvData); u.experience[i].bullets[j] = v; setCvData(u); sessionStorage.setItem("cv_data", JSON.stringify(u));
                }} />
              ))}
              <button onClick={() => {
                const u = structuredClone(cvData);
                u.experience[i].bullets.push("");
                setCvData(u);
                sessionStorage.setItem("cv_data", JSON.stringify(u));
              }} style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "9px", color: "var(--ink-muted)", background: "none", border: "1px dashed var(--border)", padding: "4px 10px", cursor: "pointer", width: "100%", marginTop: "4px" }}>
                + add bullet
              </button>
            </div>
          ))}

          {/* Add experience */}
          <button
            onClick={() => {
              const u = structuredClone(cvData);
              u.experience.push({ company: "", role: "", start: "", end: "Present", location: "", bullets: [""] });
              setCvData(u);
              sessionStorage.setItem("cv_data", JSON.stringify(u));
            }}
            style={{ fontFamily: "var(--font-inter-tight)", fontWeight: 600, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--ink)", color: "var(--cream)", border: "none", padding: "8px 0", cursor: "pointer", width: "100%", marginTop: "16px" }}
          >
            + Add Experience
          </button>
        </aside>

        {/* CV preview */}
        <div ref={cvRef} style={{ display: "flex", justifyContent: "center" }}>
          <CVRenderer templateId={templateId} data={cvData} fontPairing={selectedFont} />
        </div>
      </div>

      {/* Print-only: just the bare CV, no chrome */}
      <div className="print-only">
        <CVRenderer templateId={templateId} data={cvData} fontPairing={selectedFont} />
      </div>

      <style>{`
        .print-only { display: none; }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .cv-sheet { box-shadow: none !important; margin: 0 !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
}

function EditField({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label style={{ display: "block", fontFamily: "var(--font-jetbrains-mono)", fontSize: "8px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "3px" }}>
        {label}
      </label>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={{ width: "100%", fontFamily: "var(--font-inter-tight)", fontSize: "12px", border: "1px solid var(--border)", background: "var(--cream)", padding: "5px 7px", resize: "vertical", outline: "none", color: "var(--ink)" }} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", fontFamily: "var(--font-inter-tight)", fontSize: "12px", border: "1px solid var(--border)", background: "var(--cream)", padding: "5px 7px", outline: "none", color: "var(--ink)" }} />
      }
    </div>
  );
}
