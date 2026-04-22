"use client";

import { useRef, useState, useCallback } from "react";

export function BeforeAfterSlider({
  before,
  after,
}: {
  before: React.ReactNode;
  after: React.ReactNode;
}) {
  const [pct, setPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newPct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPct(newPct);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
      onMouseMove={(e) => { if (dragging.current) move(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={(e) => { dragging.current = true; move(e.touches[0].clientX); }}
      onTouchMove={(e) => { move(e.touches[0].clientX); }}
      onTouchEnd={() => { dragging.current = false; }}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        cursor: "ew-resize",
        userSelect: "none",
        border: "1px solid var(--border)",
      }}
    >
      {/* After (full width, underneath) */}
      <div style={{ width: "100%", display: "block" }}>
        {after}
      </div>

      {/* Before (clipped overlay on left) */}
      <div style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        width: `${pct}%`,
      }}>
        <div style={{ width: containerRef.current?.offsetWidth ?? 600 }}>
          {before}
        </div>
      </div>

      {/* Divider line */}
      <div style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: `${pct}%`,
        width: "2px",
        background: "var(--ink)",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }}>
        {/* Handle */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "36px",
          height: "36px",
          background: "var(--ink)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 7L1 4M4 7L1 10M10 7L13 4M10 7L13 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="4" y1="7" x2="10" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "12px",
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: "9px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--ink-faint)",
        background: "rgba(255,255,255,0.85)",
        padding: "3px 8px",
        pointerEvents: "none",
        opacity: pct > 15 ? 1 : 0,
        transition: "opacity 0.15s",
      }}>
        ✗ Before
      </div>
      <div style={{
        position: "absolute",
        top: "10px",
        right: "12px",
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: "9px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--accent)",
        background: "rgba(255,255,255,0.85)",
        padding: "3px 8px",
        pointerEvents: "none",
        opacity: pct < 85 ? 1 : 0,
        transition: "opacity 0.15s",
      }}>
        ✓ After
      </div>
    </div>
  );
}
