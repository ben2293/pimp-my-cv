import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "pimpmycv <onboarding@resend.dev>",
        to: ["ben2293@gmail.com"],
        subject: "New waitlist signup",
        text: `${email} signed up for the pimpmycv waitlist.`,
      }),
    });
  }

  return NextResponse.json({ ok: true });
}
