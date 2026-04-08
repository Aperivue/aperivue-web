"use client";

import { useLungReport, parseMm } from "../report/ReportContext";
import {
  LUNG_NODULE_LOCATIONS,
  NODULE_TYPES,
  SCAN_TYPES,
  S_MODIFIER_OPTIONS,
  lungRadsRiskBg,
  type LungNoduleLocation,
  type NoduleType,
  type ScanType,
} from "@/lib/rads/lungrads";

export default function NoduleDetailPanel() {
  const { state, dispatch, activeNodule, activeScored } = useLungReport();
  const n = activeNodule;

  const update = (payload: Record<string, unknown>) =>
    dispatch({ type: "UPDATE_NODULE", id: n.id, payload });

  const result = activeScored.result;
  const showSolidComponent = n.noduleType === "part_solid";
  const showPriorSize = n.scanType === "growing" || n.scanType === "stable";

  return (
    <div className="flex-1 space-y-3">
      {/* Label + Location */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Label</label>
          <input type="text" value={n.label}
            onChange={(e) => update({ label: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Location</label>
          <select value={n.location}
            onChange={(e) => update({ location: e.target.value as LungNoduleLocation })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            {LUNG_NODULE_LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value}>{loc.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Nodule Type */}
      <fieldset className="rounded-xl border border-border bg-surface p-4">
        <legend className="px-2 text-sm font-semibold">Nodule Type</legend>
        <div className="grid gap-1.5">
          {NODULE_TYPES.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                n.noduleType === opt.value
                  ? "bg-primary/10 text-foreground font-medium"
                  : "hover:bg-muted text-foreground/70"
              }`}
            >
              <input
                type="radio"
                name={`ntype-${n.id}`}
                checked={n.noduleType === opt.value}
                onChange={() => update({ noduleType: opt.value as NoduleType })}
                className="mt-0.5 accent-primary"
              />
              <div>
                <span>{opt.label}</span>
                <p className="text-xs text-foreground/40">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Scan context */}
      <fieldset className="rounded-xl border border-border bg-surface p-4">
        <legend className="px-2 text-sm font-semibold">Scan Context</legend>
        <p className="mb-2 text-xs text-foreground/40">
          Is this nodule seen on a baseline scan, a new finding, stable, or growing?
        </p>
        <div className="grid gap-1.5">
          {SCAN_TYPES.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                n.scanType === opt.value
                  ? "bg-primary/10 text-foreground font-medium"
                  : "hover:bg-muted text-foreground/70"
              }`}
            >
              <input
                type="radio"
                name={`stype-${n.id}`}
                checked={n.scanType === opt.value}
                onChange={() => update({ scanType: opt.value as ScanType })}
                className="mt-0.5 accent-primary"
              />
              <div>
                <span>{opt.label}</span>
                <p className="text-xs text-foreground/40">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Size inputs */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/60">
              {n.noduleType === "ground_glass" ? "Nodule size (mm)" : "Longest diameter (mm)"}
            </label>
            <input
              type="number"
              step="1"
              min="0"
              placeholder="e.g. 12"
              value={n.sizeMm}
              onChange={(e) => update({ sizeMm: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </div>
          {showPriorSize && (
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground/60">
                Prior size (mm)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                placeholder="e.g. 8"
                value={n.priorSizeMm}
                onChange={(e) => update({ priorSizeMm: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>
        {showSolidComponent && (
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/60">
              Solid component size (mm)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              placeholder="e.g. 5"
              value={n.solidComponentMm}
              onChange={(e) => update({ solidComponentMm: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>

      {/* S Modifier */}
      <fieldset className="rounded-xl border border-border bg-surface p-4">
        <legend className="px-2 text-sm font-semibold">S Modifier — Additional Suspicious Features</legend>
        <p className="mb-2 text-xs text-foreground/40">
          Select any additional features that warrant upgrading to a category with the S modifier or 4X.
        </p>
        <div className="grid gap-1.5">
          {S_MODIFIER_OPTIONS.map((feat) => (
            <label
              key={feat.key}
              className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                n.sModifier[feat.key]
                  ? "bg-primary/10 text-foreground font-medium"
                  : "hover:bg-muted text-foreground/70"
              }`}
            >
              <input
                type="checkbox"
                checked={n.sModifier[feat.key]}
                onChange={() =>
                  update({ sModifier: { ...n.sModifier, [feat.key]: !n.sModifier[feat.key] } })
                }
                className="mt-0.5 accent-primary"
              />
              <div>
                <span>{feat.label}</span>
                <p className="text-xs text-foreground/40">{feat.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Result */}
      {result ? (
        <ResultBanner result={result} />
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground/40">
          {n.noduleType ? "Enter nodule size to see results." : "Select nodule type to begin."}
        </div>
      )}
    </div>
  );
}

// ── Result banner ────────────────────────────────────────────────────────

function ResultBanner({ result }: { result: NonNullable<ReturnType<typeof import("@/lib/rads/lungrads").scoreLungRads>> }) {
  const bg = lungRadsRiskBg(result.category);

  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-lg font-bold">{result.displayCategory}</span>
          <span className="ml-2 text-sm text-foreground/70">{result.level}</span>
          {result.sModifier && (
            <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
              S modifier
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 border-t border-current/10 pt-2 text-sm">
        <p><span className="font-medium">Recommendation:</span> {result.recommendation}</p>
        <p className="text-foreground/70"><span className="font-medium">Follow-up:</span> {result.followUpInterval}</p>
      </div>
    </div>
  );
}
