"use client";

import { useLiradsReport } from "../report/ReportContext";
import {
  CONTRAST_AGENTS,
  type LiradsContrastAgent,
} from "@/lib/rads/lirads";
import type { LiradsModality } from "../report/types";

const MODALITIES: { id: LiradsModality; label: string; desc: string }[] = [
  { id: "ct", label: "CT", desc: "Multiphase contrast-enhanced CT" },
  { id: "mri", label: "MRI", desc: "Multiphase contrast-enhanced MRI" },
];

export default function ModalityTechniqueSection() {
  const { state, dispatch } = useLiradsReport();

  return (
    <section className="rounded-xl border border-border p-4">
      <h3 className="mb-1 text-sm font-semibold">Technique</h3>
      <p className="mb-3 text-xs text-foreground/40">
        Set the modality and contrast agent for the whole study. Diagnostic adequacy (the LR-NC gate)
        is assessed per observation below.
      </p>

      {/* Modality */}
      <div className="mb-3 flex rounded-lg border border-border bg-muted p-1">
        {MODALITIES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => dispatch({ type: "SET_MODALITY", value: mod.id })}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              state.modality === mod.id
                ? "bg-surface text-foreground shadow-sm"
                : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            {mod.label}
            <span className="ml-1 text-[10px] text-foreground/40">{mod.desc}</span>
          </button>
        ))}
      </div>

      {/* Contrast agent */}
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground/60">Contrast agent</label>
        <div className="grid gap-1.5">
          {CONTRAST_AGENTS.map((agent) => (
            <label
              key={agent.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                state.contrastAgent === agent.value
                  ? "bg-primary/10 text-foreground font-medium"
                  : "hover:bg-muted text-foreground/70"
              }`}
            >
              <input
                type="radio"
                name="contrast-agent"
                checked={state.contrastAgent === agent.value}
                onChange={() => dispatch({ type: "SET_CONTRAST_AGENT", value: agent.value as LiradsContrastAgent })}
                className="mt-0.5 accent-primary"
              />
              <div>
                <span>{agent.label}</span>
                <p className="text-xs text-foreground/40">{agent.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
