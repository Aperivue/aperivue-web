"use client";

import { useBiRadsReport } from "../report/ReportContext";
import { getCategoryInfo, biRadsRiskBg, type BiRadsCategory } from "@/lib/rads/birads";

export default function LesionSidebar() {
  const { state, dispatch, activeLesion } = useBiRadsReport();

  return (
    <div className="flex w-full flex-col gap-2 md:w-44 md:shrink-0">
      {state.lesions.map((lesion) => {
        const isActive = lesion.id === activeLesion.id;
        const cat = lesion.selectedCategory as BiRadsCategory | "";
        const info = cat ? getCategoryInfo(cat) : null;

        return (
          <button
            key={lesion.id}
            onClick={() => dispatch({ type: "SET_ACTIVE_LESION", id: lesion.id })}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
              isActive
                ? "border-primary bg-primary/5 font-medium text-primary"
                : "border-border bg-surface text-foreground/70 hover:border-primary/30"
            }`}
          >
            <span className="truncate">{lesion.label}</span>
            {info && (
              <span
                className={`ml-1.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold border ${biRadsRiskBg(cat as BiRadsCategory)}`}
              >
                {info.label.replace("BI-RADS ", "")}
              </span>
            )}
          </button>
        );
      })}

      <button
        onClick={() => dispatch({ type: "ADD_LESION" })}
        className="flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-foreground/40 transition-colors hover:border-primary/40 hover:text-primary/70"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add finding
      </button>

      {state.lesions.length > 1 && (
        <button
          onClick={() => dispatch({ type: "REMOVE_LESION", id: activeLesion.id })}
          className="rounded-lg border border-dashed border-red-200 px-3 py-2 text-sm text-red-400 transition-colors hover:border-red-400 hover:text-red-500 dark:border-red-800 dark:text-red-500"
        >
          Remove active
        </button>
      )}
    </div>
  );
}
