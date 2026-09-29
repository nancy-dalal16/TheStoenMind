"use client";

import { useId, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { contactForm, inquiryTopics } from "@/lib/contact";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please tell us your name.";
  if (!values.email.trim()) errors.email = "Please add your email address.";
  else if (!EMAIL.test(values.email.trim())) errors.email = "That email address doesn't look quite right.";
  if (!values.topic) errors.topic = "Please choose what your message is about.";
  if (values.message.length > 4000) errors.message = "Please keep your message under 4,000 characters.";
  return errors;
}

const FIELD =
  "w-full rounded-lg border border-field-line bg-field px-4 font-sans text-base text-fg placeholder:text-fg/45 transition-[border-color,box-shadow] duration-200 outline-none focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_22%,transparent)] aria-[invalid=true]:border-[#b4534b]";

function Field({ id, label, required, error, children }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <label htmlFor={id} className="font-sans text-base leading-5 text-fg">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="font-sans text-sm text-[#b4534b] dark:text-[#f2a8a1]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** "Send a Message" card. Posts JSON to /api/contact. */
export default function ContactForm() {
  const id = useId();
  const formRef = useRef(null);
  const [values, setValues] = useState({ name: "", email: "", topic: "", message: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed

  const update = (event) => {
    const next = { ...values, [event.target.name]: event.target.value };
    setValues(next);
    if (touched[event.target.name]) setErrors(validate(next));
  };
  const blur = (event) => {
    setTouched((prev) => ({ ...prev, [event.target.name]: true }));
    setErrors(validate(values));
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, topic: true, message: true });
    if (Object.keys(found).length) {
      formRef.current?.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
      setValues({ name: "", email: "", topic: "", message: "" });
      setTouched({});
    } catch {
      setStatus("failed");
    }
  };

  const describe = (name) => (errors[name] && touched[name] ? `${id}-${name}-error` : undefined);
  const invalid = (name) => Boolean(errors[name] && touched[name]);

  return (
    <div data-reveal="left" className="flex flex-col gap-10 rounded-[20px] bg-surface-soft p-6 sm:p-12">
      <div className="flex flex-col text-fg">
        <h2 className="text-card">{contactForm.title}</h2>
        <p className="text-body-lg leading-[26px]">{contactForm.subtitle}</p>
      </div>

      {status === "sent" ? (
        <div role="status" className="flex flex-col items-start gap-4 rounded-2xl bg-surface p-8 text-fg motion-safe:animate-rise-in">
          <span className="flex size-10 items-center justify-center rounded-full bg-surface-tint text-primary">
            <Icon name="check" />
          </span>
          <p className="text-title">Thank you — your note is on its way.</p>
          <p className="text-body">We read every message by hand and will write back within 24–48 unhurried hours.</p>
          <Button onClick={() => setStatus("idle")} variant="inverse" size="sm" className="mt-2 border border-surface-line">
            Send another message
          </Button>
        </div>
      ) : (
        <form ref={formRef} noValidate onSubmit={submit} className="flex flex-col gap-10">
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-[30px] sm:flex-row">
              <Field id={`${id}-name`} label="Your name" required error={touched.name && errors.name}>
                <input
                  id={`${id}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Clara Vance"
                  value={values.name}
                  onChange={update}
                  onBlur={blur}
                  aria-required="true"
                  aria-invalid={invalid("name")}
                  aria-describedby={describe("name")}
                  className={`${FIELD} h-14`}
                />
              </Field>
              <Field id={`${id}-email`} label="Email address" required error={touched.email && errors.email}>
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="clara@example.com"
                  value={values.email}
                  onChange={update}
                  onBlur={blur}
                  aria-required="true"
                  aria-invalid={invalid("email")}
                  aria-describedby={describe("email")}
                  className={`${FIELD} h-14`}
                />
              </Field>
            </div>

            <Field id={`${id}-topic`} label="Nature of inquiry" required error={touched.topic && errors.topic}>
              <div className="relative">
                <select
                  id={`${id}-topic`}
                  name="topic"
                  value={values.topic}
                  onChange={update}
                  onBlur={blur}
                  aria-required="true"
                  aria-invalid={invalid("topic")}
                  aria-describedby={describe("topic")}
                  className={`${FIELD} h-14 cursor-pointer appearance-none pr-12 ${values.topic ? "" : "text-fg/45"}`}
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  {inquiryTopics.map((topic) => (
                    <option key={topic} value={topic} className="text-fg">
                      {topic}
                    </option>
                  ))}
                </select>
                <Icon
                  name="caret-down"
                  className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-fg"
                />
              </div>
            </Field>

            <Field id={`${id}-message`} label="Your message" error={touched.message && errors.message}>
              <textarea
                id={`${id}-message`}
                name="message"
                rows={4}
                placeholder="Share a thought, a question, or a wish…"
                value={values.message}
                onChange={update}
                onBlur={blur}
                aria-invalid={invalid("message")}
                aria-describedby={describe("message")}
                className={`${FIELD} min-h-32 resize-y py-4 leading-6`}
              />
            </Field>
          </div>

          <div className="flex flex-col items-start gap-4">
            <Button type="submit" iconEnd="arrow-right" disabled={status === "sending"} className="disabled:cursor-wait disabled:opacity-70">
              {status === "sending" ? "Sending…" : "Send Message"}
            </Button>
            {status === "failed" ? (
              <p role="alert" className="font-sans text-sm text-[#b4534b] dark:text-[#f2a8a1]">
                Something went wrong while sending. Please try again, or write to hello@thestoenmind.com.
              </p>
            ) : null}
          </div>
        </form>
      )}
    </div>
  );
}
