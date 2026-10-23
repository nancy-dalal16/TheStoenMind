"use client";

import { AddIcon } from "@sanity/icons/Add";
import { ChevronDownIcon } from "@sanity/icons/ChevronDown";
import { ChevronUpIcon } from "@sanity/icons/ChevronUp";
import { CopyIcon } from "@sanity/icons/Copy";
import { DragHandleIcon } from "@sanity/icons/DragHandle";
import { TrashIcon } from "@sanity/icons/Trash";
import { useState } from "react";
import { newKey, useModuleArray } from "./moduleContext";
import ModulePicker from "./ModulePicker";

/** Gives every copied object (and nested array item) a fresh _key. */
function rekey(value) {
  if (Array.isArray(value)) return value.map(rekey);
  if (value && typeof value === "object") {
    const out = Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === "_key" ? v : rekey(v)]));
    if ("_key" in value) out._key = newKey();
    return out;
  }
  return value;
}

/** Where a card dropped before/after `target` ends up (array-move semantics). */
function landingIndex(from, target, place) {
  if (place === "before") return from < target ? target - 1 : target;
  return from < target ? target : target + 1;
}

/**
 * One module in the list: a header you can drag to reorder (with the module type, ↑ ↓,
 * duplicate and delete), the Studio's own row below (click it to edit), then a "+" line that
 * opens the picker to insert a module right after this one.
 */
export default function ModuleItem(props) {
  const { schemaType, parentSchemaType, value, onInsert, onRemove, readOnly } = props;
  const list = useModuleArray();
  const live = list?.keys?.indexOf(value?._key) ?? -1;
  const index = live >= 0 ? live : props.index;
  const [picking, setPicking] = useState(false);
  const last = list ? index >= list.count - 1 : true;
  const move = (to) => list?.onItemMove({ fromIndex: index, toIndex: to });
  const drag = list?.drag;
  const canDrag = Boolean(list) && !readOnly && list.count > 1;

  const dragging = drag?.from === index;
  const dropLine = drag && drag.over === index && drag.from !== index ? drag.place : null;

  const dragProps = canDrag
    ? {
        onDragOver: (e) => {
          if (!drag) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          const box = e.currentTarget.getBoundingClientRect();
          const place = e.clientY < box.top + box.height / 2 ? "before" : "after";
          if (drag.over !== index || drag.place !== place) list.setDrag({ ...drag, over: index, place });
        },
        onDrop: (e) => {
          if (!drag) return;
          e.preventDefault();
          const to = landingIndex(drag.from, index, drag.place ?? "after");
          if (to !== drag.from) list.onItemMove({ fromIndex: drag.from, toIndex: to });
          list.setDrag(null);
        },
      }
    : {};

  return (
    <div className={`stm-item ${dragging ? "is-source" : ""} ${dropLine ? `is-drop-${dropLine}` : ""}`} {...dragProps}>
      <div className="stm-card">
        <div
          className={`stm-card-head ${canDrag ? "is-draggable" : ""}`}
          draggable={canDrag}
          title={canDrag ? "Drag to move this module" : undefined}
          onDragStart={(e) => {
            // Only the header itself starts a drag (not a button inside it)
            if (e.target.closest("button")) return e.preventDefault();
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", String(index));
            const card = e.currentTarget.closest(".stm-card");
            if (card) e.dataTransfer.setDragImage(card, 24, 20);
            list.setDrag({ from: index, over: null, place: null });
          }}
          onDragEnd={() => list?.setDrag(null)}
        >
          <span className="stm-grip" aria-hidden="true">
            <DragHandleIcon />
          </span>
          <span className="stm-type">{schemaType.title ?? schemaType.name}</span>
          <span className="stm-index">
            {index + 1}
            {list ? ` / ${list.count}` : ""}
          </span>
          {readOnly ? null : (
            <span className="stm-tools">
              <button type="button" className="stm-icon" disabled={index === 0} onClick={() => move(index - 1)} title="Move up" aria-label="Move up">
                <ChevronUpIcon />
              </button>
              <button type="button" className="stm-icon" disabled={last} onClick={() => move(index + 1)} title="Move down" aria-label="Move down">
                <ChevronDownIcon />
              </button>
              <button
                type="button"
                className="stm-icon"
                title="Duplicate"
                aria-label="Duplicate"
                onClick={() => onInsert({ items: [rekey(value)], position: "after" })}
              >
                <CopyIcon />
              </button>
              <button type="button" className="stm-icon stm-danger" title="Delete" aria-label="Delete" onClick={onRemove}>
                <TrashIcon />
              </button>
            </span>
          )}
        </div>
        <div className="stm-card-body">{props.renderDefault(props)}</div>
      </div>

      {readOnly ? null : (
        <div className="stm-between">
          <button type="button" className="stm-plus" onClick={() => setPicking(true)} title="Add a module here" aria-label="Add a module here">
            <AddIcon />
          </button>
        </div>
      )}
      {picking ? (
        <ModulePicker
          types={parentSchemaType.of}
          onClose={() => setPicking(false)}
          onPick={(type) => {
            onInsert({ items: [{ _type: type.name, _key: newKey() }], position: "after", open: true });
            setPicking(false);
          }}
        />
      ) : null}
    </div>
  );
}
