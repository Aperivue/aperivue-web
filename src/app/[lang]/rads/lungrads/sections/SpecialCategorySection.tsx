"use client";

import { useLungReport } from "../report/ReportContext";
import { SPECIAL_CATEGORIES, type SpecialCategory } from "@/lib/rads/lungrads";

export default function SpecialCategorySection() {
  const { state, dispatch } = useLungReport();

  return (
    <section className="rounded-xl border border-border p-4">
      <h3 className="mb-1 text-sm font-semibold">Pre-assessment</h3>
      <p className="mb-3 text-xs text-foreground/60">
        Select if the study is incomplete (Cat 0) or if there are no nodules / only benign findings (Cat 1).
        Otherwise, leave as &quot;None&quot; to proceed to nodule assessment.
      </p>
      <div className="grid gap-1.5">
        {SPECIAL_CATEGORIES.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              state.specialCategory === opt.value
                ? "bg-primary/10 text-foreground font-medium"
                : "hover:bg-muted text-foreground/70"
            }`}
          >
            <input
              type="radio"
              name="special-cat"
              checked={state.specialCategory === opt.value}
              onChange={() => dispatch({ type: "SET_SPECIAL_CATEGORY", value: opt.value as SpecialCategory })}
              className="mt-0.5 accent-primary"
            />
            <div className="flex-1">
              <span>{opt.label}</span>
              {opt.category && (
                <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-foreground/50">
                  Cat {opt.category}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
