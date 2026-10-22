"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";

/**
 * "Copy link" pill. On touch devices with the Web Share sheet it opens that instead.
 */
export default function ShareButton({ title }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function share() {
    const url = window.location.href.split("#")[0];
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* closed the sheet */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button type="button" onClick={share} className="ex-share hover-pill">
      <Icon name={copied ? "check" : "link"} width={18} height={18} />
      <span aria-live="polite">{copied ? "Link copied" : "Share this story"}</span>
    </button>
  );
}
