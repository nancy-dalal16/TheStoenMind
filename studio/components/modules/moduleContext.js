"use client";

import { createContext, useContext } from "react";

/** Lets each module card move itself (the array input owns the move handler). */
export const ModuleArrayContext = createContext(null);
export const useModuleArray = () => useContext(ModuleArrayContext);

export const newKey = () => Math.random().toString(36).slice(2, 12);
