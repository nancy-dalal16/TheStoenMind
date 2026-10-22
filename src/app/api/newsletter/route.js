import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Newsletter sign-up (Explore). Validates the address server-side.
 *
 * TODO: connect a mailing list. Set NEWSLETTER_WEBHOOK_URL (Mailchimp / Buttondown / Zapier /
 * a Sanity "subscriber" mutation endpoint…) to forward { email, source, receivedAt }, or replace
 * the forward below with your provider's SDK. Until then sign-ups are only logged.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Please enter a full email address." }, { status: 422 });
  }

  const payload = { email, source: "explore", receivedAt: new Date().toISOString() };

  if (process.env.NEWSLETTER_WEBHOOK_URL) {
    const forwarded = await fetch(process.env.NEWSLETTER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    if (!forwarded?.ok) {
      return NextResponse.json({ ok: false, error: "We couldn't sign you up just now." }, { status: 502 });
    }
  } else {
    console.info("[newsletter] Sign-up (no NEWSLETTER_WEBHOOK_URL set - not stored):", payload);
  }

  return NextResponse.json({ ok: true });
}
