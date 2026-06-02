"use client";

import { useLiradsReport, liradsSegmentLabel } from "../report/ReportContext";
import { liradsRiskBg } from "@/lib/rads/lirads";

export default function ObservationSidebar() {
  const { state, dispatch, scoredObservations } = useLiradsReport();

  return (
    <div className="flex flex-col gap-1.5 md:min-w-[180px]">
      <p className="px-1 text-xs font-medium uppercase tracking-wider text-foreground/40">
        Observations
      </p>

      <div className="flex gap-1.5 overflow-x-auto md:flex-col">
        {scoredObservations.map((sn) => {
          const isActive = state.activeObservationId === sn.observation.id;
          const cat = sn.result?.category ?? "";
          const bg = cat ? liradsRiskBg(sn.result!.category) : "";
          const seg = liradsSegmentLabel(sn.observation.segment);
          const size = sn.sizeMmNum;

          return (
            <button
              key={sn.observation.id}
              onClick={() => dispatch({ type: "SET_ACTIVE_OBSERVATION", id: sn.observation.id })}
              className={`flex min-w-[150px] flex-col gap-0.5 rounded-lg border p-2.5 text-left text-xs transition-colors md:min-w-0 ${
                isActive
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{sn.observation.label}</span>
                {state.observations.length > 1 && (
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); dispatch({ type: "REMOVE_OBSERVATION", id: sn.observation.id }); }}
                    className="text-foreground/30 hover:text-red-500"
                  >
                    &times;
                  </span>
                )}
              </div>
              {seg && <span className="text-foreground/50">{seg}</span>}
              {size !== null && <span className="text-foreground/50">{size} mm</span>}
              {cat && (
                <span className={`mt-0.5 inline-block self-start rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${bg}`}>
                  {cat}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => dispatch({ type: "ADD_OBSERVATION" })}
        className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-foreground/40 hover:bg-muted hover:text-foreground/60"
      >
        + Add Observation
      </button>
    </div>
  );
}
