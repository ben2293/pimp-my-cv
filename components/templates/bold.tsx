"use client";

import { CVData } from "@/lib/types";

type Props = { data: CVData };

// BOLD — Our take: ink-black name instead of blue, red accents, cleaner grid, no photo slot.
// Inspired by editorial design but distinctly ours.

export function BoldTemplate({ data }: Props) {
  const contact = [
    data.contact.email && { label: "E", value: data.contact.email },
    data.contact.phone && { label: "Ph", value: data.contact.phone },
    data.contact.linkedin && { label: "In", value: data.contact.linkedin },
    data.contact.github && { label: "GH", value: data.contact.github },
    data.contact.location && { label: "📍", value: data.contact.location },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div
      className="cv-sheet"
      style={{
        background: "#f0ebe0",
        fontFamily: "var(--font-inter-tight), sans-serif",
        padding: "12mm 14mm 0 14mm",
        display: "flex",
        flexDirection: "column",
        minHeight: "297mm",
      }}
    >
      {/* MASSIVE NAME */}
      <header style={{ marginBottom: "8mm" }}>
        <h1
          style={{
            fontFamily: "var(--font-bebas-neue), var(--font-fraunces), serif",
            fontSize: "72pt",
            fontWeight: 400,
            lineHeight: 0.88,
            letterSpacing: "0.01em",
            color: "#111",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {data.name}
        </h1>
        {data.title && (
          <p style={{
            fontFamily: "var(--font-inter-tight)",
            fontSize: "9pt",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#e63946",
            marginTop: "6px",
          }}>
            {data.title}
          </p>
        )}
        {data.summary && (
          <p style={{
            fontSize: "8.5pt",
            lineHeight: 1.6,
            color: "#555",
            marginTop: "6px",
            maxWidth: "420px",
          }}>
            {data.summary}
          </p>
        )}
      </header>

      {/* Thick rule */}
      <div style={{ height: "3px", background: "#111", marginBottom: "8mm" }} />

      {/* Two-column body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8mm", flex: 1 }}>

        {/* Left: Experience + Education */}
        <div>
          {data.experience.length > 0 && (
            <BoldSection title="Experience">
              {data.experience.map((exp, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: "6px", marginBottom: "7mm" }}>
                  {/* Date column */}
                  <div style={{ paddingTop: "1px" }}>
                    <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "6.5pt", color: "#aaa", lineHeight: 1.5, textTransform: "uppercase" }}>
                      {exp.start}<br />{exp.end}
                    </p>
                  </div>
                  {/* Content */}
                  <div>
                    <p style={{ fontSize: "9.5pt", fontWeight: 800, color: "#111", margin: 0, letterSpacing: "-0.01em" }}>{exp.role}</p>
                    <p style={{ fontSize: "8pt", color: "#e63946", fontWeight: 600, margin: "1px 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{exp.company}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {exp.bullets.map((b, j) => (
                        <li key={j} style={{ paddingLeft: "10px", position: "relative", fontSize: "8.5pt", lineHeight: 1.5, marginBottom: "2px", color: "#333" }}>
                          <span style={{ position: "absolute", left: 0, color: "#e63946", fontWeight: 700 }}>›</span>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </BoldSection>
          )}

          {data.education.length > 0 && (
            <BoldSection title="Education">
              {data.education.map((edu, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: "6px", marginBottom: "5mm" }}>
                  <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "6.5pt", color: "#aaa", paddingTop: "1px" }}>{edu.year}</p>
                  <div>
                    <p style={{ fontSize: "9pt", fontWeight: 800, color: "#111", margin: 0 }}>{edu.institution}</p>
                    <p style={{ fontSize: "8pt", color: "#666", margin: "1px 0 0", fontStyle: "italic" }}>{edu.degree}{edu.field ? `, ${edu.field}` : ""}{edu.gpa ? ` · ${edu.gpa}` : ""}</p>
                  </div>
                </div>
              ))}
            </BoldSection>
          )}
        </div>

        {/* Right: Skills + Projects + Certs */}
        <div style={{ borderLeft: "1px solid #ccc", paddingLeft: "8mm" }}>
          {Object.keys(data.skills).length > 0 && (
            <BoldSection title="Skills">
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {Object.entries(data.skills).map(([cat, items]) => (
                  <div key={cat}>
                    <p style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#111", margin: "0 0 3px" }}>{cat}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                      {items.map((skill, i) => (
                        <span key={i} style={{
                          fontSize: "7.5pt",
                          color: "#111",
                          padding: "2px 6px",
                          border: "1px solid #111",
                          lineHeight: 1.5,
                          fontWeight: 500,
                        }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </BoldSection>
          )}

          {data.projects && data.projects.length > 0 && (
            <BoldSection title="Projects">
              {data.projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: "5mm" }}>
                  <p style={{ fontSize: "9pt", fontWeight: 800, color: "#111", margin: 0 }}>{proj.name}</p>
                  {proj.tech && proj.tech.length > 0 && (
                    <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7pt", color: "#e63946", margin: "1px 0 2px" }}>{proj.tech.join(" · ")}</p>
                  )}
                  <p style={{ fontSize: "8.5pt", color: "#555", margin: 0, lineHeight: 1.5 }}>{proj.description}</p>
                </div>
              ))}
            </BoldSection>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <BoldSection title="Certifications">
              {data.certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: "4mm" }}>
                  <p style={{ fontSize: "9pt", fontWeight: 700, color: "#111", margin: 0 }}>{c.name}</p>
                  <p style={{ fontSize: "7.5pt", color: "#888", margin: "1px 0 0" }}>{c.issuer}{c.year ? ` · ${c.year}` : ""}</p>
                </div>
              ))}
            </BoldSection>
          )}

          {data.achievements && data.achievements.length > 0 && (
            <BoldSection title="Achievements">
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {data.achievements.map((a, i) => (
                  <li key={i} style={{ paddingLeft: "10px", position: "relative", fontSize: "8.5pt", lineHeight: 1.5, marginBottom: "2px", color: "#333" }}>
                    <span style={{ position: "absolute", left: 0, color: "#e63946", fontWeight: 700 }}>›</span>{a}
                  </li>
                ))}
              </ul>
            </BoldSection>
          )}
        </div>
      </div>

      {/* Contact footer bar */}
      <div style={{
        background: "#111",
        color: "#fff",
        padding: "8px 14mm",
        marginTop: "auto",
        marginLeft: "-14mm",
        marginRight: "-14mm",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        flexWrap: "wrap",
      }}>
        <span style={{ fontFamily: "var(--font-bebas-neue), var(--font-fraunces)", fontSize: "14pt", letterSpacing: "0.08em", color: "#e63946", marginRight: "8px" }}>
          CONTACT
        </span>
        {contact.map(({ label, value }, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7pt", color: "#888", textTransform: "uppercase" }}>{label}</span>
            <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7.5pt", color: "#ccc" }}>{value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function BoldSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "8mm" }}>
      <p style={{
        fontFamily: "var(--font-inter-tight)",
        fontSize: "7pt",
        fontWeight: 800,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#111",
        margin: "0 0 3px",
      }}>
        {title}
      </p>
      <div style={{ height: "2px", background: "#111", marginBottom: "6px" }} />
      {children}
    </section>
  );
}
