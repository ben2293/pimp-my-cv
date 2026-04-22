"use client";

import { CVData } from "@/lib/types";

type Props = { data: CVData };

export function ScarletTemplate({ data }: Props) {
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
        background: "#f5f0e8",
        fontFamily: "var(--font-inter-tight), sans-serif",
        padding: "14mm 14mm 14mm 14mm",
      }}
    >
      <style>{`
        @media print {
          .scarlet-header { margin-bottom: 6mm !important; }
          .scarlet-name { font-size: 38pt !important; }
          .scarlet-body { break-before: avoid; page-break-before: avoid; }
          .scarlet-sidebar { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      {/* Big name header */}
      <header className="scarlet-header" style={{ marginBottom: "10mm" }}>
        <h1 className="scarlet-name" style={{
          fontFamily: "var(--font-fraunces), serif",
          fontWeight: 900,
          fontSize: "52pt",
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
          color: "#e63946",
          margin: 0,
        }}>
          {data.name}
        </h1>
        {data.title && (
          <p style={{
            fontFamily: "var(--font-inter-tight)",
            fontSize: "9.5pt",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#666",
            marginTop: "6px",
          }}>
            {data.title}
          </p>
        )}
      </header>

      {/* Two-column body */}
      <div className="scarlet-body" style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0 12mm" }}>

        {/* Left sidebar */}
        <div className="scarlet-sidebar" style={{ borderRight: "1px solid #ddd", paddingRight: "10mm" }}>
          {/* Contact */}
          <ScarletSideLabel>Contact</ScarletSideLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "10mm" }}>
            {contact.map((c, i) => (
              <span key={i} style={{ fontSize: "7.5pt", color: "#555", lineHeight: 1.5, wordBreak: "break-all" }}>{c}</span>
            ))}
          </div>


          {/* Education */}
          {data.education.length > 0 && (
            <>
              <ScarletSideLabel>Education</ScarletSideLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10mm" }}>
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <p style={{ fontSize: "8pt", fontWeight: 700, color: "#111", margin: 0 }}>{edu.degree}</p>
                    <p style={{ fontSize: "7.5pt", color: "#666", margin: "1px 0 0" }}>{edu.institution}</p>
                    <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7pt", color: "#aaa", margin: "1px 0 0" }}>{edu.year}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Skills */}
          {Object.keys(data.skills).length > 0 && (
            <>
              <ScarletSideLabel>Skills</ScarletSideLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {Object.entries(data.skills).map(([cat, items]) => (
                  <div key={cat}>
                    <p style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", margin: "0 0 2px" }}>{cat}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                      {items.map((skill, i) => (
                        <span key={i} style={{ fontSize: "7pt", color: "#444", padding: "1px 5px", border: "1px solid #ccc", lineHeight: 1.6 }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <>
              <ScarletSideLabel style={{ marginTop: "10mm" }}>Certifications</ScarletSideLabel>
              {data.certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: "5px" }}>
                  <p style={{ fontSize: "7.5pt", fontWeight: 700, color: "#111", margin: 0 }}>{c.name}</p>
                  <p style={{ fontSize: "7pt", color: "#888", margin: "1px 0 0" }}>{c.issuer}{c.year ? ` · ${c.year}` : ""}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right main */}
        <div>
          {/* Summary */}
          {data.summary && (
            <div style={{ marginBottom: "10mm" }}>
              <p style={{ fontSize: "9.5pt", lineHeight: 1.7, color: "#333", fontStyle: "italic", borderLeft: "2px solid #e63946", paddingLeft: "10px" }}>
                {data.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div style={{ marginBottom: "10mm" }}>
              <ScarletMainLabel>Experience</ScarletMainLabel>
              {data.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: "8mm" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <p style={{ fontSize: "10.5pt", fontWeight: 700, color: "#111", margin: 0 }}>{exp.role}</p>
                    <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7.5pt", color: "#bbb", whiteSpace: "nowrap" }}>{exp.start} – {exp.end}</span>
                  </div>
                  <p style={{ fontSize: "8.5pt", color: "#888", margin: "1px 0 6px", fontStyle: "italic" }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {exp.bullets.map((b, j) => (
                      <li key={j} style={{ paddingLeft: "12px", position: "relative", fontSize: "9pt", lineHeight: 1.6, marginBottom: "3px", color: "#333" }}>
                        <span style={{ position: "absolute", left: 0, color: "#e63946", fontWeight: 700 }}>–</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div style={{ marginBottom: "10mm" }}>
              <ScarletMainLabel>Projects</ScarletMainLabel>
              {data.projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: "6mm" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <p style={{ fontSize: "10pt", fontWeight: 700, color: "#111", margin: 0 }}>{proj.name}</p>
                    {proj.tech && <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7pt", color: "#bbb" }}>{proj.tech.join(" · ")}</span>}
                  </div>
                  <p style={{ fontSize: "9pt", color: "#555", margin: "3px 0 0", lineHeight: 1.5 }}>{proj.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          {data.achievements && data.achievements.length > 0 && (
            <div>
              <ScarletMainLabel>Achievements</ScarletMainLabel>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {data.achievements.map((a, i) => (
                  <li key={i} style={{ paddingLeft: "12px", position: "relative", fontSize: "9pt", lineHeight: 1.55, marginBottom: "3px", color: "#333" }}>
                    <span style={{ position: "absolute", left: 0, color: "#e63946", fontWeight: 700 }}>–</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScarletSideLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontFamily: "var(--font-inter-tight)", fontSize: "7.5pt", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#e63946", marginBottom: "6px", ...style }}>
      {children}
    </p>
  );
}

function ScarletMainLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <p style={{ fontFamily: "var(--font-inter-tight)", fontSize: "8pt", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e63946", margin: "0 0 4px" }}>
        {children}
      </p>
      <div style={{ height: "1px", background: "#e0dbd2" }} />
    </div>
  );
}
