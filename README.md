# Pimp My CV

> Upload your shit Indian CV. Get a clean, Swiss-designed, impact-led resume in 10 seconds.

## Setup

```bash
# 1. Install deps
npm install

# 2. Copy pdfjs worker to public/
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/

# 3. Set up env
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# 4. Run
npm run dev
```

Open http://localhost:3000

## Stack

- **Next.js 14** App Router
- **Tailwind CSS** + custom CSS variables
- **Fonts**: Fraunces (headings) · Inter Tight (body) · JetBrains Mono (labels)
- **Colors**: Cream `#f5f1e8` · Ink `#111` · Accent Red `#e63946`
- **PDF parsing**: `pdfjs-dist` (client-side)
- **DOCX parsing**: `mammoth` (client-side)
- **AI**: Claude claude-sonnet-4-6 via `@anthropic-ai/sdk` with prompt caching
- **PDF export**: `window.print()` + `@media print`

## Flow

1. User uploads PDF/DOCX on landing page
2. Text extracted client-side (no file uploaded to server)
3. Raw text POSTed to `/api/structure`
4. Claude extracts fields + rewrites bullets
5. Structured JSON stored in `sessionStorage`
6. Editor page renders CV + allows field editing
7. `window.print()` exports as PDF

## Known bugs / v1 polish

- [ ] pdfjs worker path — if PDF parsing fails, check `public/pdf.worker.min.mjs` exists
- [ ] Webpack canvas alias — if build fails, check `next.config.js` has `config.resolve.alias.canvas = false`
- [ ] Scanned PDFs return empty text — show user-friendly error (already handled)
- [ ] Print layout — test in Chrome; Safari may need `-webkit-print-color-adjust`
- [ ] Mobile layout — editor two-column grid collapses below 768px (add responsive styles)
- [ ] Usage counter — stored in localStorage, can be cleared by user (by design for v1)

## Free usage limit

3 uses per browser (tracked in `localStorage` key `pimp_cv_uses`). No auth, no payments in v1.

## Vercel deployment

```bash
vercel
# Set ANTHROPIC_API_KEY in Vercel dashboard environment variables
```

## What Claude strips

- Career objectives
- Date of birth / age
- Marital status
- Father's name
- Nationality
- Declaration sections
- Generic hobbies

## What Claude rewrites

| Before | After |
|--------|-------|
| Responsible for managing database | Led database migration across 3 envs, reducing downtime 40% |
| Was involved in frontend dev | Built React dashboard used by 500+ DAU |
| Handled client communications | Managed 15+ client accounts, maintaining 98% satisfaction score |
