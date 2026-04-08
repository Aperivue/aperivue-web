"use client";

import { useState, useCallback } from "react";
import {
  type LungNoduleEntry,
  type LungNoduleLocation,
  type NoduleType,
  type ScanType,
  type SpecialCategory,
  type SModifierFeatures,
  type LungRadsResult,
  LUNG_NODULE_LOCATIONS,
  NODULE_TYPES,
  SCAN_TYPES,
  SPECIAL_CATEGORIES,
  S_MODIFIER_OPTIONS,
  scoreLungRads,
  lungRadsRiskBg,
} from "@/lib/rads/lungrads";

// ── Nodule management ─────────────────────────────────────────────────────

let nextId = 1;
function createNodule(): LungNoduleEntry {
  const id = String(nextId++);
  return { id, label: `Nodule ${id}`, location: "", sizeMm: null, priorSizeMm: null };
}

// ── Nodule-level scoring state ────────────────────────────────────────────

interface NoduleState {
  noduleType: NoduleType;
  scanType: ScanType;
  solidComponentMm: number | null;
  sModifier: SModifierFeatures;
}

const defaultNoduleState: NoduleState = {
  noduleType: "",
  scanType: "baseline",
  solidComponentMm: null,
  sModifier: {
    spiculation: false,
    lymphadenopathy: false,
    directInvasion: false,
    pleuralEffusion: false,
    other: false,
  },
};

// ── Main component ────────────────────────────────────────────────────────

export default function LungRadsCalculator() {
  const [specialCategory, setSpecialCategory] = useState<SpecialCategory>("");
  const [nodules, setNodules] = useState<LungNoduleEntry[]>([createNodule()]);
  const [activeNoduleId, setActiveNoduleId] = useState(nodules[0].id);
  const [noduleStates, setNoduleStates] = useState<Record<string, NoduleState>>({
    [nodules[0].id]: { ...defaultNoduleState },
  });

  const activeNodule = nodules.find((n) => n.id === activeNoduleId) ?? nodules[0];
  const activeNS = noduleStates[activeNoduleId] ?? defaultNoduleState;

  const updateNodule = useCallback(
    (id: string, patch: Partial<LungNoduleEntry>) => {
      setNodules((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
    },
    [],
  );

  const updateNS = useCallback(
    (id: string, patch: Partial<NoduleState>) => {
      setNoduleStates((prev) => ({
        ...prev,
        [id]: { ...(prev[id] ?? defaultNoduleState), ...patch },
      }));
    },
    [],
  );

  const addNodule = () => {
    const n = createNodule();
    setNodules((prev) => [...prev, n]);
    setActiveNoduleId(n.id);
    setNoduleStates((prev) => ({ ...prev, [n.id]: { ...defaultNoduleState } }));
  };

  const removeNodule = (id: string) => {
    setNodules((prev) => {
      const next = prev.filter((n) => n.id !== id);
      if (next.length === 0) {
        const fresh = createNodule();
        setActiveNoduleId(fresh.id);
        setNoduleStates((p) => ({ ...p, [fresh.id]: { ...defaultNoduleState } }));
        return [fresh];
      }
      if (activeNoduleId === id) setActiveNoduleId(next[0].id);
      return next;
    });
  };

  // Compute result for active nodule
  const result: LungRadsResult | null = specialCategory
    ? scoreLungRads(specialCategory, "", null, "baseline", null, defaultNoduleState.sModifier)
    : scoreLungRads("", activeNS.noduleType, activeNodule.sizeMm, activeNS.scanType, activeNS.solidComponentMm, activeNS.sModifier);

  const showNoduleAssessment = !specialCategory;

  return (
    <div>
      {/* Pre-assessment (Cat 0/1) */}
      <fieldset className="mb-4 rounded-xl border border-border bg-surface p-4">
        <legend className="px-2 text-sm font-semibold">Pre-assessment</legend>
        <p className="mb-2 text-xs text-foreground/40">
          Select if applicable, otherwise leave as &quot;None&quot; to score individual nodules.
        </p>
        <div className="grid gap-1.5">
          {SPECIAL_CATEGORIES.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                specialCategory === opt.value
                  ? "bg-primary/10 text-foreground font-medium"
                  : "hover:bg-muted text-foreground/70"
              }`}
            >
              <input
                type="radio"
                name="special"
                checked={specialCategory === opt.value}
                onChange={() => setSpecialCategory(opt.value as SpecialCategory)}
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
      </fieldset>

      {showNoduleAssessment && (
        <>
          {/* Nodule tabs */}
          <div className="mb-4 flex items-center gap-2 overflow-x-auto">
            {nodules.map((n) => (
              <button
                key={n.id}
                onClick={() => setActiveNoduleId(n.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeNoduleId === n.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground/50 hover:bg-muted"
                }`}
              >
                {n.label}
                {nodules.length > 1 && (
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); removeNodule(n.id); }}
                    className="ml-1 text-foreground/30 hover:text-red-500"
                  >
                    &times;
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={addNodule}
              className="rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-foreground/40 hover:bg-muted hover:text-foreground/60"
            >
              + Add Nodule
            </button>
          </div>

          {/* Nodule info (location + size) */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground/60">Location</label>
              <select
                value={activeNodule.location}
                onChange={(e) => updateNodule(activeNodule.id, { location: e.target.value as LungNoduleLocation })}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              >
                {LUNG_NODULE_LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground/60">
                {activeNS.noduleType === "ground_glass" ? "Nodule size (mm)" : "Longest diameter (mm)"}
              </label>
              <input
                type="number"
                step="1"
                min="0"
                placeholder="e.g. 12"
                value={activeNodule.sizeMm ?? ""}
                onChange={(e) =>
                  updateNodule(activeNodule.id, {
                    sizeMm: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Nodule Type */}
          <fieldset className="mb-4 rounded-xl border border-border bg-surface p-4">
            <legend className="px-2 text-sm font-semibold">Nodule Type</legend>
            <div className="grid gap-1.5">
              {NODULE_TYPES.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeNS.noduleType === opt.value
                      ? "bg-primary/10 text-foreground font-medium"
                      : "hover:bg-muted text-foreground/70"
                  }`}
                >
                  <input
                    type="radio"
                    name="ntype"
                    checked={activeNS.noduleType === opt.value}
                    onChange={() => updateNS(activeNodule.id, { noduleType: opt.value as NoduleType })}
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
          <fieldset className="mb-4 rounded-xl border border-border bg-surface p-4">
            <legend className="px-2 text-sm font-semibold">Scan Context</legend>
            <div className="grid gap-1.5">
              {SCAN_TYPES.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeNS.scanType === opt.value
                      ? "bg-primary/10 text-foreground font-medium"
                      : "hover:bg-muted text-foreground/70"
                  }`}
                >
                  <input
                    type="radio"
                    name="stype"
                    checked={activeNS.scanType === opt.value}
                    onChange={() => updateNS(activeNodule.id, { scanType: opt.value as ScanType })}
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

          {/* Solid component (part-solid only) */}
          {activeNS.noduleType === "part_solid" && (
            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium text-foreground/60">
                Solid component size (mm)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                placeholder="e.g. 5"
                value={activeNS.solidComponentMm ?? ""}
                onChange={(e) =>
                  updateNS(activeNodule.id, {
                    solidComponentMm: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
            </div>
          )}

          {/* S Modifier */}
          <fieldset className="mb-4 rounded-xl border border-border bg-surface p-4">
            <legend className="px-2 text-sm font-semibold">S Modifier</legend>
            <p className="mb-2 text-xs text-foreground/40">
              Additional suspicious features that may upgrade the category.
            </p>
            <div className="grid gap-1.5">
              {S_MODIFIER_OPTIONS.map((feat) => (
                <label
                  key={feat.key}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeNS.sModifier[feat.key]
                      ? "bg-primary/10 text-foreground font-medium"
                      : "hover:bg-muted text-foreground/70"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={activeNS.sModifier[feat.key]}
                    onChange={() =>
                      updateNS(activeNodule.id, {
                        sModifier: { ...activeNS.sModifier, [feat.key]: !activeNS.sModifier[feat.key] },
                      })
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
        </>
      )}

      {/* Result */}
      {result ? (
        <ResultCard result={result} nodule={showNoduleAssessment ? activeNodule : null} />
      ) : (
        !specialCategory && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground/40">
            Select nodule type and enter size to see results.
          </div>
        )
      )}
    </div>
  );
}

// ── Result card ──────────────────────────────────────────────────────────

function ResultCard({
  result,
  nodule,
}: {
  result: LungRadsResult;
  nodule: LungNoduleEntry | null;
}) {
  const bg = lungRadsRiskBg(result.category);
  const loc = nodule ? LUNG_NODULE_LOCATIONS.find((l) => l.value === nodule.location) : null;
  const locStr = loc && loc.value ? loc.label : "";
  const sizeStr = nodule?.sizeMm ? `${nodule.sizeMm} mm` : "";
  const noduleInfo = [locStr, sizeStr].filter(Boolean).join(", ");

  const handleCopy = () => {
    const lines = [
      `${result.displayCategory} — ${result.level}`,
      noduleInfo ? `Nodule: ${noduleInfo}` : "",
      `Recommendation: ${result.recommendation}`,
      `Follow-up: ${result.followUpInterval}`,
      result.sModifier ? "(S modifier applied)" : "",
    ].filter(Boolean);
    navigator.clipboard.writeText(lines.join("\n"));
  };

  return (
    <div className={`rounded-xl border p-5 ${bg}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">
            Lung-RADS v2022
          </p>
          <p className="mt-1 text-2xl font-bold">{result.displayCategory}</p>
          <p className="mt-0.5 text-sm font-medium text-foreground/80">{result.level}</p>
          {result.sModifier && (
            <span className="mt-1 inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
              S modifier
            </span>
          )}
        </div>
        <div className="text-right">
          {noduleInfo && (
            <p className="text-xs text-foreground/50">{noduleInfo}</p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-current/10 pt-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">
            Recommendation
          </p>
          <p className="mt-0.5 text-sm font-semibold">{result.recommendation}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">
            Follow-up
          </p>
          <p className="mt-0.5 text-sm">{result.followUpInterval}</p>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="mt-4 rounded-lg border border-border bg-surface/80 px-4 py-2 text-xs font-medium text-foreground/60 transition-colors hover:bg-surface hover:text-foreground"
      >
        Copy to Clipboard
      </button>
    </div>
  );
}
