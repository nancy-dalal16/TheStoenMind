"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initAmbientSound, setSoundScene } from "./ambientSound";
import SoundToggle from "./SoundToggle";

/**
 * Mounted once in the root layout: plays the ambient sound and shows its floating switch.
 * The track follows the page (About has its own) and the theme (day / night).
 */
export default function AmbientSound() {
  const pathname = usePathname();
  // Declared first so the page is known before the first play() picks a track.
  useEffect(() => setSoundScene(pathname), [pathname]);
  useEffect(() => initAmbientSound(), []);
  return <SoundToggle />;
}
