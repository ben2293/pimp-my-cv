"use client";

import { CVData } from "@/lib/types";
import { FontPairing, FONT_PAIRINGS } from "@/lib/fonts";

type Props = { data: CVData; fontPairing?: FontPairing };

export function GhostTemplate({ data, fontPairing }: Props) {
  const fonts = fontPairing ?? FONT_PAIRINGS[0];

  const contact = [
    data.contact.email,
    data.contact.phone,
    data.contact.location,
    data.contact.linkedin,
    data.contact.github,
    data.contact.website,
  ].filter(Boolean);

  return (
    <div
      className="cv-sheet"
      style={{
        background: "#ffffff",
        fontFamily: fonts.bodyVar,
        paddingLeft: "20mm",
        borderLeft: "none",
        position: "relative",
      }}
    >
      {/* Left accent rule */}
      <div style={{ position: "absolute", top: 0, left: "12mm", width: "3px", height: "100%", background: "#e63946" }} />

      {/* Header */}
      <header style={{ marginBottom: "14mm" }}>
        <h1 style={{ fontFamily: fonts.headingVar, fontSize: "30pt", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, color: "#111", marginBottom: "4px" }}>
          {data.name}
        </h1>
        {data.title && (
          <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "8pt", letterSpacing: "0.18em", textTransform: "uppercase", color: "#888", marginBottom: "8px" }}>
            {data.title}
          </p>
        )}
        {contact.length > 0 && (
          <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7.5pt", color: "#aaa", lineHeight: 1.8 }}>
            {contact.join(" · ")}
          </p>
        )}
      </header>

      {data.summary && (
        <GhostSection label="Profile" fonts={fonts}>
          <p style={{ fontSize: "9pt", lineHeight: 1.7, color: "#444", fontStyle: "italic" }}>{data.summary}</p>
        </GhostSection>
      )}

      {data.experience.length > 0 && (
        <GhostSection label="Experience" fonts={fonts}>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: "8mm" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1px" }}>
                <span style={{ fontSize: "10pt", fontWeight: 700 }}>{exp.company}</span>
                <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7.5pt", color: "#bbb" }}>{exp.start} – {exp.end}</span>
              </div>
              <p style={{ fontSize: "8.5pt", color: "#777", marginBottom: "4px", fontStyle: "italic" }}>{exp.role}{exp.location ? ` · ${exp.location}` : ""}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {exp.bullets.map((b, j) => (
                  <li key={j} style={{ paddingLeft: "12px", position: "relative", fontSize: "9pt", lineHeight: 1.55, marginBottom: "2px", color: "#333" }}>
                    <span style={{ position: "absolute", left: 0, color: "#e63946" }}>–</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </GhostSection>
      )}

      {data.education.length > 0 && (
        <GhostSection label="Education" fonts={fonts}>
          {data.education.map((edu, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
              <div>
                <span style={{ fontSize: "10pt", fontWeight: 700 }}>{edu.institution}</span>
                <div style={{ fontSize: "8.5pt", color: "#777", fontStyle: "italic" }}>{edu.degree}{edu.field ? `, ${edu.field}` : ""}{edu.gpa ? ` · ${edu.gpa}` : ""}</div>
              </div>
              <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7.5pt", color: "#bbb" }}>{edu.year}</span>
            </div>
          ))}
        </GhostSection>
      )}

      {Object.keys(data.skills).length > 0 && (
        <GhostSection label="Skills" fonts={fonts}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {Object.entries(data.skills).map(([cat, items]) => (
              <div key={cat} style={{ display: "flex", gap: "8px", fontSize: "8.5pt" }}>
                <span style={{ fontWeight: 700, whiteSpace: "nowrap", minWidth: "80px" }}>{cat}</span>
                <span style={{ color: "#666" }}>{items.join(", ")}</span>
              </div>
            ))}
          </div>
        </GhostSection>
      )}

      {data.projects && data.projects.length > 0 && (
        <GhostSection label="Projects" fonts={fonts}>
          {data.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "9.5pt", fontWeight: 700 }}>{proj.name}</span>
                {proj.tech && <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7pt", color: "#bbb" }}>{proj.tech.join(" · ")}</span>}
              </div>
              <p style={{ fontSize: "8.5pt", color: "#666", margin: "1px 0 0" }}>{proj.description}</p>
            </div>
          ))}
        </GhostSection>
      )}
    </div>
  );
}

function GhostSection({ label, children, fonts }: { label: string; children: React.ReactNode; fonts: FontPairing }) {
  return (
    <section style={{ marginBottom: "10mm" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#e63946" }}>{label}</span>
        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
      </div>
      {children}
    </section>
  );
}
