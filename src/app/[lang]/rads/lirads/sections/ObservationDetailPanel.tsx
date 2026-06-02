"use client";

import { useLiradsReport } from "../report/ReportContext";
import {
  LIRADS_SEGMENTS,
  DIAGNOSTIC_QUALITY_OPTIONS,
  APHE_OPTIONS,
  WASHOUT_OPTIONS,
  LRM_FEATURE_OPTIONS,
  ANCILLARY_MALIGNANCY_OPTIONS,
  ANCILLARY_BENIGN_OPTIONS,
  liradsRiskBg,
  type LiradsResult,
  type Aphe,
  type WashoutPhase,
  type LiradsSegment,
  type LiradsBenignity,
  type DiagnosticQuality,
  type LrmFeatures,
} from "@/lib/rads/lirads";

export default function ObservationDetailPanel() {
  const { dispatch, activeObservation, activeScored } = useLiradsReport();
  const o = activeObservation;

  const update = (payload: Record<string, unknown>) =>
    dispatch({ type: "UPDATE_OBSERVATION", id: o.id, payload });

  const result = activeScored.result;
  const isOverride = o.tumorInVein || o.benignity !== "" || o.aphe === "rim" || anyLrm(o.lrm);

  return (
    <div className="flex-1 space-y-3">
      {/* Label + segment + size */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Label</label>
          <input type="text" value={o.label}
            onChange={(e) => update({ label: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Segment</label>
          <select value={o.segment}
            onChange={(e) => update({ segment: e.target.value as LiradsSegment })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            {LIRADS_SEGMENTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Size (mm)</label>
          <input type="number" step="1" min="0" placeholder="e.g. 18"
            value={o.sizeMm}
            onChange={(e) => update({ sizeMm: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
        </div>
      </div>

      {/* Diagnostic quality (LR-NC gate, per observation) */}
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground/60">
          Diagnostic quality (LR-NC gate)
        </label>
        <select value={o.diagnosticQuality}
          onChange={(e) => update({ diagnosticQuality: e.target.value as DiagnosticQuality })}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
          {DIAGNOSTIC_QUALITY_OPTIONS.map((q) => (
            <option key={q.value} value={q.value}>{q.label}</option>
          ))}
        </select>
      </div>

      {/* Major features */}
      <fieldset className="rounded-xl border border-border bg-surface p-4">
        <legend className="px-2 text-sm font-semibold">Major Features</legend>

        <label className="mb-1 block text-xs font-medium text-foreground/60">
          Arterial phase hyperenhancement (APHE)
        </label>
        <div className="mb-3 grid gap-1.5">
          {APHE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                o.aphe === opt.value ? "bg-primary/10 text-foreground font-medium" : "hover:bg-muted text-foreground/70"
              }`}
            >
              <input type="radio" name={`aphe-${o.id}`} checked={o.aphe === opt.value}
                onChange={() => update({ aphe: opt.value as Aphe })}
                className="mt-0.5 accent-primary" />
              <div>
                <span>{opt.label}</span>
                <p className="text-xs text-foreground/40">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>

        <label className="mb-1 block text-xs font-medium text-foreground/60">Nonperipheral washout</label>
        <select value={o.washout}
          onChange={(e) => update({ washout: e.target.value as WashoutPhase })}
          className="mb-3 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
          <option value="">Select washout...</option>
          {WASHOUT_OPTIONS.map((w) => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>

        <div className="grid gap-1.5">
          <CheckRow label="Enhancing capsule" checked={o.enhancingCapsule}
            onChange={() => update({ enhancingCapsule: !o.enhancingCapsule })} />
          <CheckRow label="Threshold growth (≥50% in ≤6 months)" checked={o.thresholdGrowth}
            onChange={() => update({ thresholdGrowth: !o.thresholdGrowth })} />
        </div>
      </fieldset>

      {/* Override categories */}
      <fieldset className="rounded-xl border border-border bg-surface p-4">
        <legend className="px-2 text-sm font-semibold">Tumor in Vein / Benignity</legend>
        <div className="grid gap-1.5">
          <CheckRow label="Definite tumor in vein (LR-TIV)" checked={o.tumorInVein}
            onChange={() => update({ tumorInVein: !o.tumorInVein })} />
        </div>
        <label className="mb-1 mt-3 block text-xs font-medium text-foreground/60">Benign diagnosis</label>
        <select value={o.benignity}
          onChange={(e) => update({ benignity: e.target.value as LiradsBenignity })}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
          <option value="">Not a definite/probable benign entity</option>
          <option value="definite">Definitely benign (LR-1)</option>
          <option value="probable">Probably benign (LR-2)</option>
        </select>
        {o.benignity !== "" && (
          <p className="mt-1 text-xs text-foreground/40">
            A benign diagnosis is assigned before LR-M and the diagnostic table, so it overrides
            APHE, washout, and LR-M features.
          </p>
        )}
      </fieldset>

      {/* LR-M features */}
      <fieldset className="rounded-xl border border-border bg-surface p-4">
        <legend className="px-2 text-sm font-semibold">LR-M Features (probably/definitely malignant, not HCC-specific)</legend>
        <p className="mb-2 text-xs text-foreground/40">
          Rim APHE is selected above. Any feature here assigns LR-M.
        </p>
        <div className="grid gap-1.5">
          {LRM_FEATURE_OPTIONS.map((feat) => (
            <CheckRow key={feat.key} label={feat.label} desc={feat.desc}
              checked={o.lrm[feat.key]}
              onChange={() => update({ lrm: { ...o.lrm, [feat.key]: !o.lrm[feat.key] } })} />
          ))}
        </div>
      </fieldset>

      {/* Ancillary features */}
      <fieldset className="rounded-xl border border-border bg-surface p-4">
        <legend className="px-2 text-sm font-semibold">Ancillary Features</legend>
        <p className="mb-2 text-xs text-foreground/40">
          Favoring malignancy can upgrade by one category (never to LR-5); favoring benignity can
          downgrade. Both present → no adjustment.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-medium text-foreground/60">Favoring malignancy</p>
            <div className="grid gap-1.5">
              {ANCILLARY_MALIGNANCY_OPTIONS.map((feat) => (
                <CheckRow key={feat.key} label={feat.label}
                  checked={o.ancillaryMalignancy[feat.key]}
                  onChange={() => update({ ancillaryMalignancy: { ...o.ancillaryMalignancy, [feat.key]: !o.ancillaryMalignancy[feat.key] } })} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-foreground/60">Favoring benignity</p>
            <div className="grid gap-1.5">
              {ANCILLARY_BENIGN_OPTIONS.map((feat) => (
                <CheckRow key={feat.key} label={feat.label}
                  checked={o.ancillaryBenign[feat.key]}
                  onChange={() => update({ ancillaryBenign: { ...o.ancillaryBenign, [feat.key]: !o.ancillaryBenign[feat.key] } })} />
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      {/* Result */}
      {result ? (
        <ResultBanner result={result} />
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground/40">
          {isOverride
            ? "Complete the inputs to categorize."
            : "Select APHE and enter observation size to see the LI-RADS category."}
        </div>
      )}
    </div>
  );
}

function anyLrm(lrm: LrmFeatures): boolean {
  return Object.values(lrm).some(Boolean);
}

function CheckRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        checked ? "bg-primary/10 text-foreground font-medium" : "hover:bg-muted text-foreground/70"
      }`}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 accent-primary" />
      <div>
        <span>{label}</span>
        {desc && <p className="text-xs text-foreground/40">{desc}</p>}
      </div>
    </label>
  );
}

function ResultBanner({ result }: { result: LiradsResult }) {
  const bg = liradsRiskBg(result.category);
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <span className="text-lg font-bold">{result.category}</span>
      <div className="mt-2 border-t border-current/10 pt-2 text-sm">
        <p><span className="font-medium">Rationale:</span> {result.rationale}</p>
        <p className="mt-1 text-foreground/70"><span className="font-medium">Management:</span> {result.management}</p>
      </div>
    </div>
  );
}
