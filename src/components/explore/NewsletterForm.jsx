"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Same field styling as the contact form
const FIELD =
  "h-14 w-full min-w-0 rounded-ui border border-field-line bg-field px-4 font-sans text-base text-fg placeholder:text-fg/45 transition-[border-color,box-shadow] duration-200 outline-none focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_22%,transparent)] aria-[invalid=true]:border-[#b4534b]";

/**
 * Email sign-up for the monthly letter. Posts to /api/newsletter, which forwards to
 * NEWSLETTER_WEBHOOK_URL when it's set (Mailchimp, Buttondown, a Zapier hook…).
 * `stacked` puts the button under the field (narrow columns). `copy` holds the Studio wording.
 */
export default function NewsletterForm({ id = "letter", stacked = false, copy = {} }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | invalid | sending | done | failed

  async function submit(event) {
    event.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setStatus("invalid");
      event.currentTarget.querySelector("input")?.focus();
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus(response.ok ? "done" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="font-serif text-body-lg text-fg">
        {copy.success ?? "Thank you."}
      </p>
    );
  }

  const invalid = status === "invalid";

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-3">
      <div className={`flex gap-3 ${stacked ? "flex-col" : "flex-col sm:flex-row"}`}>
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          autoComplete="email"
          placeholder={copy.placeholder ?? "you@example.com"}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (invalid) setStatus("idle");
          }}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : undefined}
          className={FIELD}
        />
        <Button type="submit" disabled={status === "sending"} className="shrink-0 disabled:cursor-wait disabled:opacity-70">
          {status === "sending" ? "…" : (copy.button ?? "Sign me up")}
        </Button>
      </div>
      {invalid ? (
        <p id={`${id}-error`} className="font-sans text-sm text-[#b4534b] dark:text-[#f2a8a1]">
          Please enter a full email address.
        </p>
      ) : null}
      {status === "failed" ? (
        <p role="alert" className="font-sans text-sm text-[#b4534b] dark:text-[#f2a8a1]">
          Something went wrong. Please try again in a moment.
        </p>
      ) : null}
    </form>
  );
}
