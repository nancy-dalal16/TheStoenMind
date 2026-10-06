import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact form endpoint. Validates the message server-side.
 *
 * TODO: deliver the message. No email service is connected yet - set
 * CONTACT_WEBHOOK_URL (e.g. a Formspree / Resend / Zapier endpoint) to forward the JSON,
 * or replace the forward below with your provider's SDK.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const topic = String(body?.topic ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!name || !EMAIL.test(email) || !topic || message.length > 4000) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 422 });
  }

  const payload = { name, email, topic, message, receivedAt: new Date().toISOString() };

  if (process.env.CONTACT_WEBHOOK_URL) {
    const forwarded = await fetch(process.env.CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    if (!forwarded?.ok) {
      return NextResponse.json({ ok: false, error: "We couldn't send your message." }, { status: 502 });
    }
  } else {
    console.info("[contact] New message (no CONTACT_WEBHOOK_URL set - not delivered):", payload);
  }

  return NextResponse.json({ ok: true });
}
