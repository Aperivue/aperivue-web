"use client";

import { useId } from "react";
import { usePiradsReport } from "../report/ReportContext";
import { LabeledInput, LabeledSelect } from "@/components/rads/LabeledField";
import {
  PROSTATE_ZONES,
  PROSTATE_SIDES,
  PROSTATE_LEVELS,
  T2W_PZ_SCORES,
  T2W_TZ_SCORES,
  DWI_SCORES,
  DCE_OPTIONS,
  piradsRiskBg,
  type PiradsResult,
  type ProstateZone,
  type ProstateSide,
  type ProstateLevel,
  type DceResult,
} from "@/lib/rads/pirads";

export default function LesionDetailPanel() {
  const { dispatch, activeLesion, activeScored } = usePiradsReport();
  const l = activeLesion;

  const update = (payload: Record<string, unknown>) =>
    dispatch({ type: "UPDATE_LESION", id: l.id, payload });

  const dceId = useId();
  const result = activeScored.result;
  const t2wOptions = l.zone === "tz" ? T2W_TZ_SCORES : T2W_PZ_SCORES;
  const isPz = l.zone === "pz";
  const isTz = l.zone === "tz";
  const showDce = isPz && l.dwi === "3";
  const showDwiResolver = isTz && (l.t2w === "2" || l.t2w === "3");

  return (
    <div className="flex-1 space-y-3">
      {/* Label + location */}
      <div className="grid grid-cols-2 gap-3">
        <LabeledInput label="Label" type="text" value={l.label}
          onChange={(e) => update({ label: e.target.value })} />
        <LabeledInput label="Size (mm)" type="number" step="1" min="0" placeholder="e.g. 12"
          value={l.sizeMm}
          onChange={(e) => update({ sizeMm: e.target.value })} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <LabeledSelect label="Side" value={l.side}
          onChange={(e) => update({ side: e.target.value as ProstateSide })}>
          {PROSTATE_SIDES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
        </LabeledSelect>
        <LabeledSelect label="Level" value={l.level}
          onChange={(e) => update({ level: e.target.value as ProstateLevel })}>
          {PROSTATE_LEVELS.map((lv) => (<option key={lv.value} value={lv.value}>{lv.label}</option>))}
        </LabeledSelect>
        <LabeledSelect label="Zone" value={l.zone}
          onChange={(e) => update({ zone: e.target.value as ProstateZone })}>
          <option value="">Select zone...</option>
          {PROSTATE_ZONES.map((z) => (<option key={z.value} value={z.value}>{z.label}</option>))}
        </LabeledSelect>
      </div>

      {l.zone === "" && (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-foreground/60">
          Select a zone — DWI is the dominant sequence in the peripheral zone, T2W in the transition zone.
        </p>
      )}

      <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground/70">
        <input type="checkbox" checked={l.epe}
          onChange={() => update({ epe: !l.epe })}
          className="accent-primary" />
        Extraprostatic extension (EPE) — used for index-lesion tie-break
      </label>

      {/* Sequence scores */}
      <fieldset className="rounded-xl border border-border bg-surface p-4">
        <legend className="px-2 text-sm font-semibold">Sequence Scores (1–5)</legend>

        <SeqSelect
          label={`T2W${isTz ? " — dominant (TZ)" : ""}`}
          value={l.t2w}
          onChange={(v) => update({ t2w: v })}
          options={t2wOptions}
          emphasize={isTz}
        />
        <SeqSelect
          label={`DWI${isPz ? " — dominant (PZ)" : ""}`}
          value={l.dwi}
          onChange={(v) => update({ dwi: v })}
          options={DWI_SCORES}
          emphasize={isPz}
        />
        {showDwiResolver && (
          <p className="mb-2 text-xs text-foreground/60">
            {l.t2w === "2"
              ? "T2W is 2 in the transition zone — DWI ≥4 upgrades to PI-RADS 3."
              : "T2W is 3 in the transition zone — DWI 5 upgrades to PI-RADS 4, otherwise PI-RADS 3."}
          </p>
        )}

        {/* DCE — used to resolve PZ DWI 3 */}
        <div className="mt-1">
          <label htmlFor={dceId} className="mb-1 block text-xs font-medium text-foreground/60">
            DCE{showDce ? " — required (PZ, DWI 3)" : ""}
          </label>
          <select id={dceId} value={l.dce}
            onChange={(e) => update({ dce: e.target.value as DceResult })}
            className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm ${
              showDce && l.dce === "" ? "border-orange-300 dark:border-orange-700" : "border-border"
            }`}>
            <option value="">Select DCE...</option>
            {DCE_OPTIONS.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))}
          </select>
          <p className="mt-1 text-xs text-foreground/60">
            DCE only changes the category for a peripheral-zone DWI score of 3 (positive → 4, negative → 3).
          </p>
        </div>
      </fieldset>

      {/* Result */}
      {result ? (
        <ResultBanner result={result} />
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground/60">
          {l.zone === "" ? "Select a zone to begin." : "Enter the dominant-sequence score (and DCE if PZ DWI 3) to see the category."}
        </div>
      )}
    </div>
  );
}

function SeqSelect({
  label,
  value,
  onChange,
  options,
  emphasize,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: number; label: string }[];
  emphasize?: boolean;
}) {
  const id = useId();
  return (
    <div className="mb-3">
      <label htmlFor={id} className={`mb-1 block text-xs font-medium ${emphasize ? "text-primary" : "text-foreground/60"}`}>
        {label}
      </label>
      <select id={id} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
        <option value="">Not scored</option>
        {options.map((o) => (<option key={o.value} value={String(o.value)}>{o.label}</option>))}
      </select>
    </div>
  );
}

function ResultBanner({ result }: { result: PiradsResult }) {
  const bg = piradsRiskBg(result.score);
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <span className="text-lg font-bold">{result.category}</span>
      <span className="ml-2 text-sm text-foreground/70">{result.risk}</span>
      <div className="mt-2 border-t border-current/10 pt-2 text-sm">
        <p><span className="font-medium">Rationale:</span> {result.rationale}</p>
        <p className="mt-1 text-foreground/70"><span className="font-medium">Clinical note:</span> {result.clinicalNote}</p>
      </div>
    </div>
  );
}
