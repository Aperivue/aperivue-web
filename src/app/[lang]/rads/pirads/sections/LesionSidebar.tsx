"use client";

import { usePiradsReport } from "../report/ReportContext";
import { piradsRiskBg, PROSTATE_SIDES } from "@/lib/rads/pirads";

export default function LesionSidebar() {
  const { state, dispatch, scoredLesions } = usePiradsReport();

  return (
    <div className="flex flex-col gap-1.5 md:min-w-[170px]">
      <p className="px-1 text-xs font-medium uppercase tracking-wider text-foreground/40">Lesions</p>

      <div className="flex gap-1.5 overflow-x-auto md:flex-col">
        {scoredLesions.map((sn) => {
          const isActive = state.activeLesionId === sn.lesion.id;
          const score = sn.result?.score;
          const bg = score ? piradsRiskBg(score) : "";
          const side = PROSTATE_SIDES.find((s) => s.value === sn.lesion.side)?.label;
          const zone = sn.lesion.zone === "pz" ? "PZ" : sn.lesion.zone === "tz" ? "TZ" : "";

          return (
            <button
              key={sn.lesion.id}
              onClick={() => dispatch({ type: "SET_ACTIVE_LESION", id: sn.lesion.id })}
              className={`flex min-w-[140px] flex-col gap-0.5 rounded-lg border p-2.5 text-left text-xs transition-colors md:min-w-0 ${
                isActive ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{sn.lesion.label}</span>
                {state.lesions.length > 1 && (
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); dispatch({ type: "REMOVE_LESION", id: sn.lesion.id }); }}
                    className="text-foreground/30 hover:text-red-500"
                  >
                    &times;
                  </span>
                )}
              </div>
              {(side || zone) && <span className="text-foreground/50">{[side, zone].filter(Boolean).join(" · ")}</span>}
              {score && (
                <span className={`mt-0.5 inline-block self-start rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${bg}`}>
                  {sn.result!.category}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => dispatch({ type: "ADD_LESION" })}
        className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-foreground/40 hover:bg-muted hover:text-foreground/60"
      >
        + Add Lesion
      </button>
    </div>
  );
}
