import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const UAZAP_TOKEN = process.env.UAZAPTOKEN;
    const UAZAP_URL = process.env.UAZAPURL; // ex: https://api.uazap.com.br
    const GROUP_ID = process.env.UAZAPGROUPID; // ID do grupo "WeStack Leads"

    if (!UAZAP_TOKEN || !UAZAP_URL) {
      return NextResponse.json({ error: "Variáveis UAZAP não configuradas" }, { status: 500 });
    }

    // Envia mensagem no grupo via uazap
    const res = await fetch(`${UAZAP_URL}/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${UAZAP_TOKEN}`,
      },
      body: JSON.stringify({
        to: GROUP_ID,
        type: "text",
        text: message,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
