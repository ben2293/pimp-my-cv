import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { images } = await req.json();

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            ...images.map((base64: string) => ({
              type: "image" as const,
              source: {
                type: "base64" as const,
                media_type: "image/jpeg" as const,
                data: base64,
              },
            })),
            {
              type: "text" as const,
              text: "Extract all text from this resume. Return only the extracted text, preserving the structure (sections, bullet points, dates) as closely as possible. No commentary.",
            },
          ],
        },
      ],
    });

    const result = message.content[0];
    if (result.type !== "text") {
      throw new Error("Unexpected response from Claude");
    }

    return NextResponse.json({ text: result.text });
  } catch (err) {
    console.error("OCR API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
