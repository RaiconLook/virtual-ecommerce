import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    const RESEND_KEY = process.env.RESENDAPIKEY;
    if (!RESEND_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY não configurada" }, { status: 500 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from: "WeStack ML <onboarding@resend.dev>",
        to,
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
