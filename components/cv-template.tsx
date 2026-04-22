"use client";

import { CVData } from "@/lib/types";
import { FontPairing, FONT_PAIRINGS } from "@/lib/fonts";

type Props = {
  data: CVData;
  fontPairing?: FontPairing;
};

export function CVTemplate({ data, fontPairing }: Props) {
  const fonts = fontPairing ?? FONT_PAIRINGS[0];

  const contactItems = [
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
      id="cv-print-area"
      style={{ fontFamily: fonts.bodyVar } as React.CSSProperties}
    >
      {/* Header */}
      <header style={{ marginBottom: "16mm" }}>
        <h1 className="cv-name" style={{ fontFamily: fonts.headingVar }}>{data.name}</h1>
        {data.title && <p className="cv-title">{data.title}</p>}
        {contactItems.length > 0 && (
          <div className="cv-contact">
            {contactItems.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        )}
      </header>

      {/* Summary */}
      {data.summary && (
        <Section label="Profile">
          <p style={{ fontSize: "9.5pt", lineHeight: 1.6, color: "#333" }}>
            {data.summary}
          </p>
        </Section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <Section label="Experience">
          <div style={{ display: "flex", flexDirection: "column", gap: "10mm" }}>
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="cv-entry-header">
                  <div>
                    <span className="cv-company">{exp.company}</span>
                    {exp.location && (
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains-mono)",
                          fontSize: "7.5pt",
                          color: "var(--ink-faint)",
                          marginLeft: "8px",
                        }}
                      >
                        {exp.location}
                      </span>
                    )}
                    <div className="cv-role">{exp.role}</div>
                  </div>
                  <span className="cv-date">
                    {exp.start} – {exp.end}
                  </span>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="cv-bullets">
                    {exp.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <Section label="Education">
          <div style={{ display: "flex", flexDirection: "column", gap: "6mm" }}>
            {data.education.map((edu, i) => (
              <div key={i} className="cv-entry-header">
                <div>
                  <span className="cv-company">{edu.institution}</span>
                  <div className="cv-role">
                    {edu.degree}
                    {edu.field ? `, ${edu.field}` : ""}
                    {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                  </div>
                </div>
                <span className="cv-date">{edu.year}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      {Object.keys(data.skills).length > 0 && (
        <Section label="Skills">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "4px 16px",
            }}
          >
            {Object.entries(data.skills).map(([cat, items]) => (
              <div key={cat} style={{ display: "flex", gap: "6px" }}>
                <span className="cv-skill-category">{cat}:</span>
                <span className="cv-skill-list">{items.join(", ")}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <Section label="Projects">
          <div style={{ display: "flex", flexDirection: "column", gap: "6mm" }}>
            {data.projects.map((proj, i) => (
              <div key={i}>
                <div className="cv-entry-header">
                  <span className="cv-company">
                    {proj.url ? (
                      <a
                        href={proj.url}
                        style={{ color: "var(--accent)", textDecoration: "none" }}
                      >
                        {proj.name}
                      </a>
                    ) : (
                      proj.name
                    )}
                  </span>
                  {proj.tech && proj.tech.length > 0 && (
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains-mono)",
                        fontSize: "7pt",
                        color: "var(--ink-faint)",
                      }}
                    >
                      {proj.tech.join(" · ")}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "9pt",
                    color: "var(--ink-muted)",
                    marginTop: "2px",
                    lineHeight: 1.5,
                  }}
                >
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <Section label="Certifications">
          <div style={{ display: "flex", flexDirection: "column", gap: "3mm" }}>
            {data.certifications.map((cert, i) => (
              <div key={i} className="cv-entry-header">
                <div>
                  <span className="cv-company" style={{ fontWeight: 600 }}>
                    {cert.name}
                  </span>
                  <span
                    style={{
                      fontSize: "8.5pt",
                      color: "var(--ink-muted)",
                      marginLeft: "6px",
                    }}
                  >
                    · {cert.issuer}
                  </span>
                </div>
                {cert.year && (
                  <span className="cv-date">{cert.year}</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Achievements */}
      {data.achievements && data.achievements.length > 0 && (
        <Section label="Achievements">
          <ul className="cv-bullets">
            {data.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "10mm" }}>
      <p className="cv-section-label">{label}</p>
      <div className="cv-divider" />
      {children}
    </section>
  );
}
