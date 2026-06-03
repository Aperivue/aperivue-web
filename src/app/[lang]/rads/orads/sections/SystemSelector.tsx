"use client";

import { useOradsReport } from "../report/ReportContext";
import type { OradsSystem } from "../report/types";

const SYSTEMS: { value: OradsSystem; label: string; sub: string }[] = [
  { value: "us", label: "O-RADS US", sub: "v2022 · ultrasound" },
  { value: "mri", label: "O-RADS MRI", sub: "2022 · MRI" },
];

export default function SystemSelector() {
  const { state, dispatch } = useOradsReport();

  return (
    <div className="flex gap-2">
      {SYSTEMS.map((s) => {
        const active = state.system === s.value;
        return (
          <button
            key={s.value}
            onClick={() => dispatch({ type: "SET_SYSTEM", system: s.value })}
            className={`flex-1 rounded-xl border px-4 py-3 text-left transition-colors ${
              active ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:bg-muted"
            }`}
          >
            <span className="block text-sm font-semibold">{s.label}</span>
            <span className="block text-xs text-foreground/50">{s.sub}</span>
          </button>
        );
      })}
    </div>
  );
}
