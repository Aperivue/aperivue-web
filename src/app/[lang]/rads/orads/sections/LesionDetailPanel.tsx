"use client";

import { useOradsReport } from "../report/ReportContext";
import { ORADS_LATERALITY, type UsLesionFields, type MriLesionFields } from "../report/types";
import {
  US_LESION_TYPES,
  CLASSIC_BENIGN_TYPES,
  COLOR_SCORES,
  MRI_LESION_TYPES,
  oradsRiskBg,
  type OradsResult,
} from "@/lib/rads/orads";

// Small labeled option lists for descriptors the engine does not ship as lists.
const PHYSIOLOGIC = [
  { value: "follicle", label: "Follicle" },
  { value: "corpus_luteum", label: "Corpus luteum" },
] as const;
const INNER_WALL = [
  { value: "smooth", label: "Smooth inner wall / septation(s)" },
  { value: "irregular", label: "Irregular (wall/septal projection < 3 mm)" },
] as const;
const CYST_CONTENT = [
  { value: "simple", label: "Simple (anechoic)" },
  { value: "nonsimple", label: "Non-simple (internal echoes / incomplete septations)" },
] as const;
const SOLID_COMPONENT = [
  { value: "none", label: "No solid component" },
  { value: "present", label: "Solid component present (protrudes ≥ 3 mm)" },
] as const;
const OUTER_CONTOUR = [
  { value: "smooth", label: "Smooth outer contour" },
  { value: "irregular", label: "Irregular outer contour" },
] as const;
const MRI_LOCULARITY = [
  { value: "unilocular", label: "Unilocular" },
  { value: "multilocular", label: "Multilocular" },
] as const;
const MRI_FLUID = [
  { value: "simple", label: "Simple fluid" },
  { value: "endometriotic", label: "Endometriotic (T2 shading)" },
  { value: "hemorrhagic", label: "Hemorrhagic" },
  { value: "proteinaceous", label: "Proteinaceous / mucinous" },
] as const;
const MRI_TIC = [
  { value: "low", label: "Low-risk time-intensity curve" },
  { value: "intermediate", label: "Intermediate-risk time-intensity curve" },
  { value: "high", label: "High-risk time-intensity curve" },
  { value: "no_dce", label: "DCE / TIC not available" },
] as const;
const MRI_NONDCE = [
  { value: "le_myometrium", label: "Enhances ≤ myometrium at 30–40 s" },
  { value: "gt_myometrium", label: "Enhances > myometrium at 30–40 s" },
] as const;

export default function LesionDetailPanel() {
  const { state, dispatch, activeLesion, activeScored } = useOradsReport();
  const l = activeLesion;
  const isUs = state.system === "us";

  const update = (payload: Record<string, unknown>) =>
    dispatch({ type: "UPDATE_LESION", id: l.id, payload });
  const updateUs = (payload: Partial<UsLesionFields>) =>
    dispatch({ type: "UPDATE_US", id: l.id, payload });
  const updateMri = (payload: Partial<MriLesionFields>) =>
    dispatch({ type: "UPDATE_MRI", id: l.id, payload });

  const result = activeScored.result;

  return (
    <div className="flex-1 space-y-3">
      {/* Label + laterality + size */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Label</label>
          <input type="text" value={l.label}
            onChange={(e) => update({ label: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Laterality</label>
          <select value={l.laterality}
            onChange={(e) => update({ laterality: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            {ORADS_LATERALITY.map((x) => (<option key={x.value} value={x.value}>{x.label}</option>))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Size (cm)</label>
          <input type="number" step="0.1" min="0" placeholder="largest diameter"
            value={l.sizeCm}
            onChange={(e) => update({ sizeCm: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
        </div>
      </div>

      {isUs ? (
        <UsFields l={l} updateUs={updateUs} />
      ) : (
        <MriFields l={l} updateMri={updateMri} />
      )}

      {result ? (
        <ResultBanner result={result} />
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground/40">
          Select the lesion type and the required descriptors to assign an O-RADS score.
        </div>
      )}
    </div>
  );
}

// ── O-RADS US descriptors ───────────────────────────────────────────────────

function UsFields({ l, updateUs }: { l: { us: UsLesionFields }; updateUs: (p: Partial<UsLesionFields>) => void }) {
  const u = l.us;
  const isCyst = u.lesionType === "unilocular" || u.lesionType === "bilocular" || u.lesionType === "multilocular";
  const showColorScore =
    (isCyst && u.solidComponent === "present" && u.lesionType !== "unilocular") ||
    (u.lesionType === "multilocular" && u.solidComponent === "none" && u.innerWall === "smooth") ||
    (u.lesionType === "solid" && u.outerContour === "smooth");

  return (
    <fieldset className="rounded-xl border border-border bg-surface p-4 space-y-3">
      <legend className="px-2 text-sm font-semibold">O-RADS US v2022 — Lexicon Descriptors</legend>

      <Select label="Lesion type" value={u.lesionType} placeholder="Select lesion type..."
        options={US_LESION_TYPES.map((t) => ({ value: t.value, label: t.label }))}
        onChange={(v) => updateUs({ lesionType: v as UsLesionFields["lesionType"] })} />

      {u.lesionType === "physiologic" && (
        <Select label="Physiologic type" value={u.physiologicType} placeholder="Select..."
          options={PHYSIOLOGIC.map((x) => ({ value: x.value, label: x.label }))}
          onChange={(v) => updateUs({ physiologicType: v as UsLesionFields["physiologicType"] })} />
      )}

      {u.lesionType === "classic_benign" && (
        <Select label="Classic benign lesion" value={u.classicBenignType} placeholder="Select type..."
          options={CLASSIC_BENIGN_TYPES.map((x) => ({ value: x.value, label: x.label }))}
          onChange={(v) => updateUs({ classicBenignType: v as UsLesionFields["classicBenignType"] })} />
      )}

      {isCyst && (
        <Select label="Solid component" value={u.solidComponent} placeholder="Select..."
          options={SOLID_COMPONENT.map((x) => ({ value: x.value, label: x.label }))}
          onChange={(v) => updateUs({ solidComponent: v as UsLesionFields["solidComponent"] })} />
      )}

      {u.lesionType === "unilocular" && u.solidComponent === "present" && (
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Papillary projections (count)</label>
          <input type="number" step="1" min="0" placeholder="e.g. 2"
            value={u.papillaryProjections}
            onChange={(e) => updateUs({ papillaryProjections: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
          <p className="mt-1 text-xs text-foreground/40">≥ 4 papillary projections → O-RADS 5; fewer (or a non-pp solid component) → O-RADS 4.</p>
        </div>
      )}

      {isCyst && u.solidComponent === "none" && (
        <Select label="Inner wall / septation(s)" value={u.innerWall} placeholder="Select..."
          options={INNER_WALL.map((x) => ({ value: x.value, label: x.label }))}
          onChange={(v) => updateUs({ innerWall: v as UsLesionFields["innerWall"] })} />
      )}

      {u.lesionType === "unilocular" && u.solidComponent === "none" && (
        <Select label="Cyst content (descriptor)" value={u.cystContent} placeholder="Optional..."
          options={CYST_CONTENT.map((x) => ({ value: x.value, label: x.label }))}
          onChange={(v) => updateUs({ cystContent: v as UsLesionFields["cystContent"] })} />
      )}

      {u.lesionType === "solid" && (
        <Select label="Outer contour" value={u.outerContour} placeholder="Select..."
          options={OUTER_CONTOUR.map((x) => ({ value: x.value, label: x.label }))}
          onChange={(v) => updateUs({ outerContour: v as UsLesionFields["outerContour"] })} />
      )}

      {showColorScore && (
        <Select label="Color score (vascularity)" value={u.colorScore} placeholder="Select CS..."
          options={COLOR_SCORES.map((x) => ({ value: String(x.value), label: x.label }))}
          onChange={(v) => updateUs({ colorScore: v })} />
      )}

      {u.lesionType === "solid" && u.outerContour === "smooth" && (u.colorScore === "2" || u.colorScore === "3") && (
        <Checkbox label="Shadowing present (diffuse/broad)" checked={u.shadowing}
          onChange={() => updateUs({ shadowing: !u.shadowing })} />
      )}

      <div className="border-t border-border pt-3">
        <Checkbox label="Ascites and/or peritoneal nodules (not otherwise explained)"
          checked={u.ascitesNodules}
          onChange={() => updateUs({ ascitesNodules: !u.ascitesNodules })} />
      </div>
    </fieldset>
  );
}

// ── O-RADS MRI descriptors ──────────────────────────────────────────────────

function MriFields({ l, updateMri }: { l: { mri: MriLesionFields }; updateMri: (p: Partial<MriLesionFields>) => void }) {
  const m = l.mri;

  return (
    <fieldset className="rounded-xl border border-border bg-surface p-4 space-y-3">
      <legend className="px-2 text-sm font-semibold">O-RADS MRI 2022 — Descriptors</legend>

      <Select label="Lesion type" value={m.lesionType} placeholder="Select lesion type..."
        options={MRI_LESION_TYPES.map((t) => ({ value: t.value, label: t.label }))}
        onChange={(v) => updateMri({ lesionType: v as MriLesionFields["lesionType"] })} />

      {m.lesionType === "physiologic" && (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-foreground/40">
          Applies to a premenopausal follicle, corpus luteum, or hemorrhagic cyst ≤ 3 cm → O-RADS MRI 1. Set the menopausal status above (premenopausal). A normal postmenopausal ovary should be scored as &quot;No adnexal lesion&quot;.
        </p>
      )}

      {m.lesionType === "cystic_no_solid" && (
        <Select label="Locularity" value={m.locularity} placeholder="Select..."
          options={MRI_LOCULARITY.map((x) => ({ value: x.value, label: x.label }))}
          onChange={(v) => updateMri({ locularity: v as MriLesionFields["locularity"] })} />
      )}

      {m.lesionType === "cystic_no_solid" && m.locularity === "unilocular" && (
        <Select label="Fluid content" value={m.fluid} placeholder="Select..."
          options={MRI_FLUID.map((x) => ({ value: x.value, label: x.label }))}
          onChange={(v) => updateMri({ fluid: v as MriLesionFields["fluid"] })} />
      )}

      {m.lesionType === "cystic_no_solid" && m.locularity === "unilocular" && (m.fluid === "hemorrhagic" || m.fluid === "proteinaceous") && (
        <Checkbox label="Smooth wall enhancement present (upgrades to O-RADS MRI 3)" checked={m.wallEnhancement}
          onChange={() => updateMri({ wallEnhancement: !m.wallEnhancement })} />
      )}

      {m.lesionType === "fat" && (
        <Checkbox label="Large volume of enhancing solid tissue within the fatty lesion"
          checked={m.fatEnhancingSolid}
          onChange={() => updateMri({ fatEnhancingSolid: !m.fatEnhancingSolid })} />
      )}

      {m.lesionType === "solid_tissue" && (
        <Checkbox label="Solid tissue homogeneously dark on T2 AND high-b DWI (fibrous)"
          checked={m.darkT2Dwi}
          onChange={() => updateMri({ darkT2Dwi: !m.darkT2Dwi })} />
      )}

      {m.lesionType === "solid_tissue" && !m.darkT2Dwi && (
        <Select label="Enhancement (time-intensity curve)" value={m.tic} placeholder="Select TIC..."
          options={MRI_TIC.map((x) => ({ value: x.value, label: x.label }))}
          onChange={(v) => updateMri({ tic: v as MriLesionFields["tic"] })} />
      )}

      {m.lesionType === "solid_tissue" && !m.darkT2Dwi && m.tic === "no_dce" && (
        <Select label="Enhancement vs myometrium (no DCE)" value={m.nonDce} placeholder="Select..."
          options={MRI_NONDCE.map((x) => ({ value: x.value, label: x.label }))}
          onChange={(v) => updateMri({ nonDce: v as MriLesionFields["nonDce"] })} />
      )}

      <div className="border-t border-border pt-3">
        <Checkbox label="Peritoneal / mesenteric / omental nodularity or irregular thickening"
          checked={m.peritonealImplants}
          onChange={() => updateMri({ peritonealImplants: !m.peritonealImplants })} />
      </div>
    </fieldset>
  );
}

// ── Reusable inputs ──────────────────────────────────────────────────────────

function Select({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground/60">{label}</label>
      <select value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
        <option value="">{placeholder}</option>
        {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-foreground/70">
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 accent-primary" />
      {label}
    </label>
  );
}

function ResultBanner({ result }: { result: OradsResult }) {
  const bg = oradsRiskBg(result.score);
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <span className="text-lg font-bold">{result.category}</span>
      <span className="ml-2 text-sm text-foreground/70">{result.riskCategory} · {result.riskPercent}</span>
      <div className="mt-2 border-t border-current/10 pt-2 text-sm">
        <p><span className="font-medium">Rationale:</span> {result.rationale}</p>
        {result.note && <p className="mt-1 text-foreground/70"><span className="font-medium">Note:</span> {result.note}</p>}
        <p className="mt-1 text-foreground/70"><span className="font-medium">Management:</span> {result.management}</p>
      </div>
    </div>
  );
}
