"use client";

import { AddIcon } from "@sanity/icons/Add";
import { useMemo, useState } from "react";
import { ModuleArrayContext } from "./moduleContext";
import ModulePicker from "./ModulePicker";
import { MODULE_CSS } from "./moduleStyles";

/**
 * Module list input (story content, Explore page sections), modelled on Kathart's
 * "Project Content": each module is a card (ModuleItem) - drag its header to reorder, or use
 * ↑ ↓ - with "+" between modules and a "+ Add module" bar at the end that opens the picker.
 * The drag state (which card is moving, where it will land) lives here so every card can
 * show the drop line.
 */
function AddModule({ schemaType, onValueCreate, onItemAppend, readOnly }) {
  const [open, setOpen] = useState(false);
  if (readOnly) return null;
  return (
    <>
      <button type="button" className="stm-add" onClick={() => setOpen(true)}>
        <AddIcon /> Add module
      </button>
      {open ? (
        <ModulePicker
          types={schemaType.of}
          onClose={() => setOpen(false)}
          onPick={(type) => {
            onItemAppend(onValueCreate(type));
            setOpen(false);
          }}
        />
      ) : null}
    </>
  );
}

export default function ModuleArrayInput(props) {
  const { onItemMove, value = [], readOnly } = props;
  // { from, over, place: "before" | "after" } while a card is being dragged
  const [drag, setDrag] = useState(null);
  // Each card finds its live position by _key (the index Sanity hands a moved item can be stale)
  const keys = useMemo(() => value.map((item) => item?._key), [value]);
  const context = useMemo(
    () => ({ onItemMove, count: value.length, keys, readOnly, drag, setDrag }),
    [onItemMove, value.length, keys, readOnly, drag],
  );

  return (
    <ModuleArrayContext.Provider value={context}>
      <style>{MODULE_CSS}</style>
      <div className={`stm-list ${drag ? "is-dragging" : ""}`}>{props.renderDefault({ ...props, arrayFunctions: AddModule })}</div>
    </ModuleArrayContext.Provider>
  );
}
