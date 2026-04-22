import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert CV/resume transformer. Your job is to:
1. Score the ORIGINAL CV (before any improvements) on 4 axes
2. Extract all relevant professional information
3. Rewrite weak, passive bullets into impact-led, verb-first, metric-included bullets
4. Return ONLY valid JSON matching the schema below — no extra text, no markdown, no code fences

STRIP completely (do not include in output):
- Photographs or photo references
- Objective/Career Objective sections
- Date of birth, age, gender
- Marital status
- Father's name / parents' names
- Nationality (unless relevant for work authorization)
- Declarations ("I hereby declare...")
- Generic hobbies ("reading, traveling, cricket")
- Irrelevant personal details

LENGTH RULES — the output must fit on 1–2 A4 pages when printed:
- Summary: max 2 sentences
- Max 3–4 bullets per job role (pick the strongest)
- If there are more than 4 jobs, drop the oldest or least relevant ones
- Projects: max 3, description max 1 sentence each
- Skills: keep categories tight, max 6 items per category

REWRITE bullets using this formula:
- BAD: "Responsible for managing database migrations"
- GOOD: "Led database migration project across 3 environments, reducing downtime by 40%"
- BAD: "Was involved in frontend development"
- GOOD: "Built React dashboard used by 500+ daily active users"
- Convert "Responsible for X" → "Did X, achieving Y outcome"
- Add metrics/impact wherever you can infer or estimate them
- Start every bullet with a strong past-tense action verb

SCORING (score the ORIGINAL CV, be honest and harsh):
- content (0-25): depth and specificity of experience descriptions
- structure (0-25): logical flow, appropriate sections present, no junk sections
- impact (0-25): use of metrics, action verbs, quantified achievements
- presentation (0-25): no personal fluff, concise, no declarations/photos/DOB

JSON SCHEMA:
{
  "score": {
    "content": number,
    "structure": number,
    "impact": number,
    "presentation": number,
    "total": number
  },
  "cvData": {
    "name": "string",
    "title": "string — professional title/role (infer from experience if not stated)",
    "contact": {
      "email": "string?",
      "phone": "string?",
      "location": "string? — city, country only",
      "linkedin": "string?",
      "github": "string?",
      "website": "string?"
    },
    "summary": "string? — 2-3 sentence professional summary, rewritten if weak",
    "experience": [
      {
        "company": "string",
        "role": "string",
        "start": "string",
        "end": "string",
        "location": "string?",
        "bullets": ["string"]
      }
    ],
    "education": [
      {
        "institution": "string",
        "degree": "string",
        "field": "string?",
        "year": "string",
        "gpa": "string?"
      }
    ],
    "skills": { "category": ["skill"] },
    "projects": [
      {
        "name": "string",
        "description": "string",
        "tech": ["string"],
        "url": "string?"
      }
    ],
    "certifications": [{ "name": "string", "issuer": "string", "year": "string?" }],
    "achievements": ["string"]
  }
}

Return ONLY the JSON object. Nothing else.`;

export async function POST(req: NextRequest) {
  try {
    const { rawText } = await req.json();

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        { error: "CV text too short or empty" },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ] as any,
      messages: [
        {
          role: "user",
          content: `Here is the raw CV text to transform:\n\n${rawText}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    let jsonText = content.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonText);
    return NextResponse.json({ cvData: parsed.cvData, score: parsed.score });
  } catch (err) {
    console.error("Structure API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
