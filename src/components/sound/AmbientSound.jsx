"use client";

import { useEffect } from "react";
import { initAmbientSound } from "./ambientSound";
import SoundToggle from "./SoundToggle";

/** Mounted once in the root layout: starts the ambient sound and shows its floating switch. */
export default function AmbientSound() {
  useEffect(() => initAmbientSound(), []);
  return <SoundToggle />;
}
