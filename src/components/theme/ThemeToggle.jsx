"use client";

import { useTheme } from "./ThemeProvider";
import Icon from "@/components/ui/Icon";
import { prepareOtherTheme } from "./themeStore";

/**
 * Both icons and labels are rendered and swapped with CSS, so the markup is
 * identical on server and client regardless of the visitor's theme.
 */
export default function ThemeToggle({ className = "" }) {
  const { toggleTheme } = useTheme();
  // Start loading the other theme's art as soon as the visitor shows intent,
  // so the switch itself can happen with every image already decoded.
  const warm = () => prepareOtherTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      onPointerEnter={warm}
      onFocus={warm}
      onPointerDown={warm}
      className={`toggle-spin inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-toggle-bg text-toggle-fg transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
    >
      <span className="flex dark:hidden">
        <Icon name="moon" />
      </span>
      <span className="hidden dark:flex">
        <Icon name="sun" />
      </span>
      <span className="sr-only">
        <span className="dark:hidden">Switch to dark theme</span>
        <span className="hidden dark:inline">Switch to light theme</span>
      </span>
    </button>
  );
}
