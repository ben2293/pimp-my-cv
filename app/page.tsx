"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/upload-zone";
import { extractTextFromFile } from "@/lib/parser";
import { BeforeAfterSlider } from "@/components/before-after-slider";

const MAX_FREE_USES = 1;
const USAGE_KEY = "pimp_cv_uses";

type Status =
  | "idle"
  | "parsing"
  | "structuring"
  | "done"
  | "error"
  | "limit_reached";

export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [usesLeft, setUsesLeft] = useState(MAX_FREE_USES);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const used = parseInt(localStorage.getItem(USAGE_KEY) || "0", 10);
    setUsesLeft(Math.max(0, MAX_FREE_USES - used));
  }, []);

  async function handleFile(file: File) {
    const used = parseInt(localStorage.getItem(USAGE_KEY) || "0", 10);
    if (used >= MAX_FREE_USES) {
      setShowPaywall(true);
      return;
    }

    try {
      setStatus("parsing");
      setError("");

      const rawText = await extractTextFromFile(file);
      if (!rawText || rawText.trim().length < 50) {
        throw new Error("Could not extract text from file. Is it a scanned PDF?");
      }

      setStatus("structuring");
      const res = await fetch("/api/structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "API error");
      }

      const { cvData, score } = await res.json();
      sessionStorage.setItem("cv_data", JSON.stringify(cvData));
      if (score) sessionStorage.setItem("cv_score", JSON.stringify(score));

      const newUsed = used + 1;
      localStorage.setItem(USAGE_KEY, String(newUsed));
      setUsesLeft(Math.max(0, MAX_FREE_USES - newUsed));

      setStatus("done");
      router.push("/editor");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const isProcessing = status === "parsing" || status === "structuring";

  return (
    <>
    {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
    <main
      style={{
        minHeight: "100vh",
        background: "var(--cream)",
        padding: "0",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-fraunces)",
            fontWeight: 900,
            fontSize: "18px",
            letterSpacing: "-0.02em",
          }}
        >
          pimp<span style={{ color: "var(--accent)" }}>my</span>cv
        </span>
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "11px",
            color: "var(--ink-faint)",
          }}
        >
          {usesLeft > 0 ? `${usesLeft} free CV remaining` : "free tier used"}
        </span>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "40px 48px 48px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "16px",
          }}
        >
          ✦ Free · No signup · Instant ✦
        </div>

        <h1
          style={{
            fontFamily: "var(--font-fraunces)",
            fontWeight: 900,
            fontSize: "clamp(52px, 8vw, 110px)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            color: "var(--ink)",
            marginBottom: "24px",
          }}
        >
          Your CV is
          <br />
          <span style={{ color: "var(--accent)" }}>embarrassing</span>
          <br />
          Let's fix that<span style={{ display: "inline-block", width: "3px", background: "var(--ink)", marginLeft: "4px", animation: "blink 1s step-end infinite", verticalAlign: "baseline", height: "0.85em", position: "relative", top: "0.05em" }} />
        </h1>
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

        <p
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontSize: "16px",
            lineHeight: 1.7,
            color: "var(--ink-muted)",
            maxWidth: "520px",
            margin: "0 auto 48px",
          }}
        >
          Upload your cluttered, objective-filled, father's-name-having CV.
          Get back a clean, tastefully designed, impact-led resume in 10 seconds.
        </p>

        {/* Upload zone */}
        {false ? (
          <div>
          </div>
        ) : (
          <UploadZone onFile={handleFile} disabled={isProcessing} />
        )}

        {/* Status messages */}
        {isProcessing && (
          <div style={{ marginTop: "24px" }}>
            <ProcessingBar status={status} />
          </div>
        )}

        {status === "error" && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "#fee",
              border: "1px solid var(--accent)",
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "12px",
              color: "var(--accent)",
              textAlign: "left",
            }}
          >
            ✗ {error}
          </div>
        )}
      </section>

      {/* Before/After showcase */}
      <section style={{ maxWidth: "1200px", margin: "60px auto 0", padding: "0 48px 80px" }}>
        {/* Desktop: side by side */}
        <div className="ba-desktop" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "stretch" }}>
          <BeforeCard />
          <AfterCard />
        </div>
        {/* Mobile: drag slider */}
        <div className="ba-mobile" style={{ display: "none" }}>
          <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", textAlign: "center", marginBottom: "16px" }}>
            ← drag to compare →
          </p>
          <BeforeAfterSlider before={<BeforeCard />} after={<AfterCard />} />
        </div>
        <style>{`
          @media (max-width: 640px) {
            .ba-desktop { display: none !important; }
            .ba-mobile { display: block !important; }
          }
        `}</style>
      </section>

      {/* Footer */}
      <footer
        className="site-footer"
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "11px",
            color: "var(--ink-faint)",
          }}
        >
          No data stored. Processing happens via Claude AI.
        </span>
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "11px",
            color: "var(--ink-faint)",
          }}
        >
          v1.0 · Built in India
        </span>
      </footer>
      <style>{`
        @media (max-width: 640px) {
          .site-footer { flex-direction: column; gap: 6px; padding: 20px 24px; text-align: center; }
        }
      `}</style>
    </main>
    </>
  );
}

const PARSING_LINES = [
  "Cracking open your file...",
  "Excavating the damage...",
  "Found the objective section. Deleting.",
  "Father's name? Gone.",
  "Marital status? Not our business.",
  "Scanning for 'responsible for'...",
];

const STRUCTURING_LINES = [
  "Claude is judging your bullets...",
  "Turning 'responsible for' into actual achievements...",
  "Adding metrics you probably forgot...",
  "Making it sound like you did things on purpose...",
  "Removing the declaration. Nobody reads that.",
  "Verb-first rewrites in progress...",
  "Your future employer will never know.",
  "Almost done being brutal about this...",
];

function ProcessingBar({ status }: { status: Status }) {
  const [idx, setIdx] = useState(0);

  const lines = status === "parsing" ? PARSING_LINES : STRUCTURING_LINES;

  useEffect(() => {
    setIdx(0);
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % lines.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [status, lines.length]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "inline-block",
          width: "200px",
          height: "2px",
          background: "var(--border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "var(--accent)",
            animation: "slide 1.2s ease-in-out infinite",
          }}
        />
      </div>
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "11px",
          color: "var(--ink-muted)",
          marginTop: "10px",
        }}
      >
        {lines[idx]}
      </p>
      <style>{`
        @keyframes slide {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}

function BeforeCard() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #aaa",
        overflow: "hidden",
        fontSize: "10px",
        fontFamily: "Times New Roman, serif",
        color: "#000",
        lineHeight: 1.6,
      }}
    >
      {/* Label */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "10px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--ink-faint)",
          padding: "10px 14px 0",
        }}
      >
        ✗ Before
      </div>

      {/* The terrible CV */}
      <div style={{ padding: "10px 14px 14px" }}>
        {/* Word-style blue header banner */}
        <div
          style={{
            background: "#1F3864",
            color: "#fff",
            textAlign: "center",
            padding: "10px 8px",
            marginBottom: "8px",
          }}
        >
          <div style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "2px" }}>
            CURRICULUM VITAE
          </div>
        </div>

        {/* Photo + name row */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "8px", alignItems: "flex-start" }}>
          {/* Photo placeholder */}
          <div
            style={{
              width: "56px",
              height: "64px",
              flexShrink: 0,
              background: "#e0e0e0",
              border: "1px solid #bbb",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "8px",
              color: "#999",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "20px", lineHeight: 1 }}>👤</div>
            <div>Paste Photo</div>
          </div>

          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, textDecoration: "underline" }}>
              RAHUL KUMAR
            </div>
            <div style={{ fontSize: "9px", color: "#333", marginTop: "2px" }}>
              S/O Mr. Suresh Kumar
            </div>
            <div style={{ fontSize: "9px" }}>📞 +91-9876543210</div>
            <div style={{ fontSize: "9px" }}>✉ rahulkumar1998@gmail.com</div>
            <div style={{ fontSize: "9px" }}>
              DOB: 14/03/1998 | Gender: Male | Marital: Single
            </div>
          </div>
        </div>

        <WordSection title="CAREER OBJECTIVE">
          <p style={{ fontSize: "9px", fontStyle: "italic", color: "#444" }}>
            &quot;To seek a challenging and rewarding position in a reputed organisation
            where I can utilise my technical skills and contribute to the growth
            of the organisation as well as my own personal development.&quot;
          </p>
        </WordSection>

        <WordSection title="WORK EXPERIENCE">
          <p style={{ fontSize: "9.5px", fontWeight: 600 }}>
            TechSoft Solutions Pvt. Ltd. &nbsp;
            <span style={{ fontWeight: 400 }}>(June 2021 – Present)</span>
          </p>
          <p style={{ fontSize: "9px", fontStyle: "italic", color: "#555" }}>
            Designation: Software Developer
          </p>
          <ul style={{ paddingLeft: "14px", fontSize: "9px", margin: "3px 0" }}>
            <li>Responsible for managing and maintaining the company website</li>
            <li>Was involved in the development of new features for clients</li>
            <li>Handled client communications and requirement gathering</li>
            <li>Part of the team that worked on database related activities</li>
          </ul>
        </WordSection>

        <WordSection title="EDUCATIONAL QUALIFICATIONS">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px" }}>
            <thead>
              <tr style={{ background: "#D6E4F7" }}>
                <th style={{ border: "1px solid #aaa", padding: "2px 4px", textAlign: "left" }}>Degree</th>
                <th style={{ border: "1px solid #aaa", padding: "2px 4px", textAlign: "left" }}>Institution</th>
                <th style={{ border: "1px solid #aaa", padding: "2px 4px" }}>Year</th>
                <th style={{ border: "1px solid #aaa", padding: "2px 4px" }}>%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #aaa", padding: "2px 4px" }}>B.Tech (CSE)</td>
                <td style={{ border: "1px solid #aaa", padding: "2px 4px" }}>VIT University</td>
                <td style={{ border: "1px solid #aaa", padding: "2px 4px", textAlign: "center" }}>2021</td>
                <td style={{ border: "1px solid #aaa", padding: "2px 4px", textAlign: "center" }}>72%</td>
              </tr>
              <tr style={{ background: "#f9f9f9" }}>
                <td style={{ border: "1px solid #aaa", padding: "2px 4px" }}>12th (CBSE)</td>
                <td style={{ border: "1px solid #aaa", padding: "2px 4px" }}>DPS, Delhi</td>
                <td style={{ border: "1px solid #aaa", padding: "2px 4px", textAlign: "center" }}>2017</td>
                <td style={{ border: "1px solid #aaa", padding: "2px 4px", textAlign: "center" }}>81%</td>
              </tr>
            </tbody>
          </table>
        </WordSection>

        <WordSection title="TECHNICAL SKILLS">
          <p style={{ fontSize: "9px" }}>
            <b>Languages:</b> C, C++, Java, Python, HTML, CSS, JavaScript<br />
            <b>Tools:</b> MS Office, Tally, Photoshop (Basic)<br />
            <b>Operating System:</b> Windows XP/7/10, Linux (Basic)
          </p>
        </WordSection>

        <WordSection title="HOBBIES &amp; INTERESTS">
          <p style={{ fontSize: "9px" }}>
            Reading Books &nbsp;|&nbsp; Travelling &nbsp;|&nbsp; Playing Cricket &nbsp;|&nbsp; Listening to Music
          </p>
        </WordSection>

        <div style={{ borderTop: "1px solid #ccc", marginTop: "8px", paddingTop: "6px", fontSize: "8px", color: "#555" }}>
          <b>DECLARATION:</b> I hereby declare that the above furnished information is true and
          correct to the best of my knowledge and belief.
          <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "8px" }}>
            <span>Date: __________</span>
            <span>Place: __________</span>
            <span>Signature: __________</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WordSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "7px" }}>
      <div
        style={{
          background: "#D6E4F7",
          color: "#1F3864",
          fontWeight: 700,
          fontSize: "9.5px",
          padding: "2px 5px",
          letterSpacing: "0.5px",
          marginBottom: "3px",
          borderLeft: "3px solid #1F3864",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function AfterCard() {
  return (
    <div style={{ background: "#fff", border: "2px solid var(--ink)", fontFamily: "var(--font-inter-tight)", overflow: "hidden", minHeight: "100%" }}>
      <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", padding: "10px 20px 0" }}>
        ✓ After
      </div>

      <div style={{ padding: "12px 20px 18px" }}>
        <p style={{ fontFamily: "var(--font-fraunces)", fontWeight: 900, fontSize: "22px", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "3px" }}>
          Rahul Kumar
        </p>
        <p style={{ fontFamily: "var(--font-inter-tight)", fontSize: "8px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#666", marginBottom: "5px" }}>
          Software Developer
        </p>
        <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "8px", color: "#999", marginBottom: "12px" }}>
          rahulkumar1998@gmail.com · +91 9876543210 · Bangalore
        </p>

        <AfterSection label="Profile">
          <p style={{ fontSize: "8.5px", lineHeight: 1.6, color: "#444" }}>
            Software developer with 3+ years delivering web products for enterprise clients at TechSoft Solutions.
            Track record of owning features end-to-end — from requirement gathering through to production.
          </p>
        </AfterSection>

        <AfterSection label="Experience">
          <AfterEntry
            company="TechSoft Solutions Pvt. Ltd."
            role="Software Developer"
            dates="Jun 2021 – Present"
            bullets={[
              "Owned and rebuilt the company's client-facing website, cutting load time from 9s to 1.4s",
              "Delivered 6 new product features across Q3–Q4 2023, directly supporting 2 contract renewals",
              "Led client requirement sessions for 4 accounts; reduced back-and-forth cycles by 50%",
              "Managed a 3-person sub-team on a database migration project, delivered on schedule with zero downtime",
            ]}
          />
        </AfterSection>

        <AfterSection label="Education">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <span style={{ fontSize: "9.5px", fontWeight: 700 }}>VIT University</span>
              <div style={{ fontSize: "8.5px", color: "#666" }}>B.Tech, Computer Science · 7.2 CGPA</div>
            </div>
            <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7.5px", color: "#aaa" }}>2021</span>
          </div>
        </AfterSection>

        <AfterSection label="Skills">
          <div style={{ fontSize: "8.5px", lineHeight: 1.8 }}>
            <span style={{ fontWeight: 600 }}>Languages:</span> <span style={{ color: "#666" }}>C, C++, Java, Python, JavaScript</span><br />
            <span style={{ fontWeight: 600 }}>Web:</span> <span style={{ color: "#666" }}>HTML, CSS, React (basic)</span><br />
            <span style={{ fontWeight: 600 }}>Tools:</span> <span style={{ color: "#666" }}>Git, MS Office, Linux</span>
          </div>
        </AfterSection>

        <AfterSection label="Projects">
          <div style={{ marginBottom: "7px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "9px", fontWeight: 700 }}>Inventory Management System</span>
              <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7px", color: "#bbb" }}>Python · MySQL</span>
            </div>
            <p style={{ fontSize: "8px", color: "#666", margin: "2px 0 0", lineHeight: 1.5 }}>Built a desktop app to manage stock for 3 local businesses, reducing manual errors by ~80%.</p>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "9px", fontWeight: 700 }}>College Fest Portal</span>
              <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7px", color: "#bbb" }}>React · Node.js</span>
            </div>
            <p style={{ fontSize: "8px", color: "#666", margin: "2px 0 0", lineHeight: 1.5 }}>Event registration platform used by 1,200+ students across 14 events at VIT annual fest.</p>
          </div>
        </AfterSection>

        <AfterSection label="Achievements">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {["Ranked top 5% in CodeChef Division 3 contest (Jan 2023)", "Smart India Hackathon finalist, team of 6 (2022)", "Led college coding club of 80+ members for 2 consecutive years"].map((a, i) => (
              <li key={i} style={{ fontSize: "8px", color: "#555", lineHeight: 1.6, paddingLeft: "10px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>–</span>{a}
              </li>
            ))}
          </ul>
        </AfterSection>
      </div>
    </div>
  );
}

function AfterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <p style={{ fontFamily: "var(--font-inter-tight)", fontSize: "7px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "4px" }}>
        {label}
      </p>
      <div style={{ height: "1px", background: "var(--border)", marginBottom: "7px" }} />
      {children}
    </div>
  );
}

function AfterEntry({ company, role, dates, bullets }: { company: string; role: string; dates: string; bullets: string[] }) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <span style={{ fontSize: "9.5px", fontWeight: 700 }}>{company}</span>
          <div style={{ fontSize: "8.5px", color: "#666" }}>{role}</div>
        </div>
        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "7px", color: "#aaa", whiteSpace: "nowrap" }}>{dates}</span>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0" }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ paddingLeft: "10px", position: "relative", fontSize: "8.5px", lineHeight: 1.55, marginBottom: "2px", color: "#333" }}>
            <span style={{ position: "absolute", left: 0, color: "var(--accent)", fontWeight: 700 }}>–</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PaywallModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "rgba(245, 241, 232, 0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(255,255,255,0.75)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
          padding: "52px 48px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "16px" }}>🔒</div>

        <h2 style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "30px",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          color: "var(--ink)",
          marginBottom: "12px",
          lineHeight: 1.1,
        }}>
          You've used your free CV.
        </h2>

        <p style={{
          fontFamily: "var(--font-inter-tight)",
          fontSize: "15px",
          color: "var(--ink-muted)",
          lineHeight: 1.6,
          marginBottom: "32px",
        }}>
          Premium is coming soon — unlimited CVs, all templates, priority processing.
          Drop your email and we'll tell you when it's ready.
        </p>

        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <input
            type="email"
            placeholder="your@email.com"
            style={{
              flex: 1,
              fontFamily: "var(--font-inter-tight)",
              fontSize: "14px",
              border: "1px solid var(--border)",
              background: "var(--cream)",
              padding: "10px 14px",
              outline: "none",
              color: "var(--ink)",
            }}
          />
          <button style={{
            fontFamily: "var(--font-inter-tight)",
            fontWeight: 700,
            fontSize: "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "var(--ink)",
            color: "var(--cream)",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}>
            Notify me
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "11px",
            color: "var(--ink-faint)",
            background: "none",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          maybe later
        </button>
      </div>
    </div>
  );
}
