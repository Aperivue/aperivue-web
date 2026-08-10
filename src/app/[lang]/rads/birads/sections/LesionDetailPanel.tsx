"use client";

import { useId } from "react";
import { useBiRadsReport } from "../report/ReportContext";
import type { BiRadsLesion } from "../report/types";
import type { BiRadsCategory } from "@/lib/rads/birads";
import {
  BIRADS_CATEGORIES,
  biRadsRiskBg,
  getCategoryInfo,
  LATERALITY_OPTIONS,
  CLOCK_POSITIONS,
  DEPTHS,
  // Mammography
  MAMMO_FINDING_TYPES,
  MAMMO_MASS_SHAPES,
  MAMMO_MASS_MARGINS,
  MAMMO_MASS_DENSITIES,
  CALC_MORPHOLOGIES,
  CALC_DISTRIBUTIONS,
  ASYMMETRY_TYPES,
  MAMMO_ASSOCIATED_FEATURE_OPTIONS,
  // Ultrasound
  US_FINDING_TYPES,
  US_MASS_SHAPES,
  US_MASS_ORIENTATIONS,
  US_MASS_MARGINS,
  US_ECHO_PATTERNS,
  US_POSTERIOR_FEATURES,
  US_SPECIAL_CASES,
  US_ASSOCIATED_FEATURE_OPTIONS,
  // MRI
  MRI_FINDING_TYPES,
  MRI_MASS_SHAPES,
  MRI_MASS_MARGINS,
  MRI_MASS_ENHANCEMENTS,
  MRI_NME_DISTRIBUTIONS,
  MRI_NME_PATTERNS,
  MRI_KINETIC_INITIAL,
  MRI_KINETIC_DELAYED,
  MRI_T2_SIGNALS,
  MRI_NON_ENHANCING_TYPES,
  MRI_ASSOCIATED_FEATURE_OPTIONS,
} from "@/lib/rads/birads";

// ── Sub-components ────────────────────────────────────────────────────────

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-xs font-medium text-foreground/70">
      {children}
    </label>
  );
}

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label?: React.ReactNode;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const id = useId();
  const select = (
    <select
      id={label ? id : undefined}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
  return label ? (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {select}
    </div>
  ) : (
    select
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  const input = (
    <input
      id={label ? id : undefined}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none"
    />
  );
  return label ? (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {input}
    </div>
  ) : (
    input
  );
}

function NumberInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  const input = (
    <input
      id={label ? id : undefined}
      type="number"
      min={0}
      step={0.1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none"
    />
  );
  return label ? (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {input}
    </div>
  ) : (
    input
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <p className="mt-4 mb-2 text-[11px] font-semibold uppercase tracking-wider text-foreground/60">
      {title}
    </p>
  );
}

// ── Mammography descriptor panels ─────────────────────────────────────────

function MammoMassPanel({
  lesion,
  update,
}: {
  lesion: BiRadsLesion;
  update: (p: Partial<BiRadsLesion>) => void;
}) {
  return (
    <div className="space-y-3">
      <SelectField
        label="Shape"
        value={lesion.mammoMassShape}
        onChange={(v) => update({ mammoMassShape: v })}
        options={MAMMO_MASS_SHAPES.map((o) => ({ value: o.value, label: o.label }))}
      />
      <SelectField
        label="Margin"
        value={lesion.mammoMassMargin}
        onChange={(v) => update({ mammoMassMargin: v })}
        options={MAMMO_MASS_MARGINS.map((o) => ({ value: o.value, label: o.label }))}
      />
      <SelectField
        label="Density"
        value={lesion.mammoMassDensity}
        onChange={(v) => update({ mammoMassDensity: v })}
        options={MAMMO_MASS_DENSITIES.map((o) => ({ value: o.value, label: o.label }))}
      />
    </div>
  );
}

function MammoCalcPanel({
  lesion,
  update,
}: {
  lesion: BiRadsLesion;
  update: (p: Partial<BiRadsLesion>) => void;
}) {
  return (
    <div className="space-y-3">
      <SelectField
        label="Morphology"
        value={lesion.calcMorphology}
        onChange={(v) => update({ calcMorphology: v })}
        options={CALC_MORPHOLOGIES.map((o) => ({ value: o.value, label: o.label }))}
      />
      <SelectField
        label="Distribution"
        value={lesion.calcDistribution}
        onChange={(v) => update({ calcDistribution: v })}
        options={CALC_DISTRIBUTIONS.map((o) => ({ value: o.value, label: o.label }))}
      />
    </div>
  );
}

function MammoAssociatedFeaturesPanel({
  lesion,
  update,
}: {
  lesion: BiRadsLesion;
  update: (p: Partial<BiRadsLesion>) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {MAMMO_ASSOCIATED_FEATURE_OPTIONS.map((opt) => (
        <label key={opt.key} className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={lesion.mammoAssociated[opt.key]}
            onChange={(e) =>
              update({
                mammoAssociated: {
                  ...lesion.mammoAssociated,
                  [opt.key]: e.target.checked,
                },
              })
            }
            className="h-3.5 w-3.5 rounded border-border text-primary accent-primary"
          />
          <span className="text-xs text-foreground/70">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

// ── Ultrasound descriptor panels ──────────────────────────────────────────

function UsMassPanel({
  lesion,
  update,
}: {
  lesion: BiRadsLesion;
  update: (p: Partial<BiRadsLesion>) => void;
}) {
  return (
    <div className="space-y-3">
      <SelectField
        label="Shape"
        value={lesion.usMassShape}
        onChange={(v) => update({ usMassShape: v })}
        options={US_MASS_SHAPES.map((o) => ({ value: o.value, label: o.label }))}
      />
      <SelectField
        label="Orientation"
        value={lesion.usMassOrientation}
        onChange={(v) => update({ usMassOrientation: v })}
        options={US_MASS_ORIENTATIONS.map((o) => ({ value: o.value, label: o.label }))}
      />
      <SelectField
        label="Margin"
        value={lesion.usMassMargin}
        onChange={(v) => update({ usMassMargin: v })}
        options={US_MASS_MARGINS.map((o) => ({ value: o.value, label: o.label }))}
      />
      <SelectField
        label="Echo Pattern"
        value={lesion.usEchoPattern}
        onChange={(v) => update({ usEchoPattern: v })}
        options={US_ECHO_PATTERNS.map((o) => ({ value: o.value, label: o.label }))}
      />
      <SelectField
        label="Posterior Features"
        value={lesion.usPosteriorFeatures}
        onChange={(v) => update({ usPosteriorFeatures: v })}
        options={US_POSTERIOR_FEATURES.map((o) => ({ value: o.value, label: o.label }))}
      />
    </div>
  );
}

function UsAssociatedFeaturesPanel({
  lesion,
  update,
}: {
  lesion: BiRadsLesion;
  update: (p: Partial<BiRadsLesion>) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {US_ASSOCIATED_FEATURE_OPTIONS.map((opt) => (
        <label key={opt.key} className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={lesion.usAssociated[opt.key]}
            onChange={(e) =>
              update({
                usAssociated: {
                  ...lesion.usAssociated,
                  [opt.key]: e.target.checked,
                },
              })
            }
            className="h-3.5 w-3.5 rounded border-border text-primary accent-primary"
          />
          <span className="text-xs text-foreground/70">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

// ── MRI descriptor panels ─────────────────────────────────────────────────

function MriMassPanel({
  lesion,
  update,
}: {
  lesion: BiRadsLesion;
  update: (p: Partial<BiRadsLesion>) => void;
}) {
  return (
    <div className="space-y-3">
      <SelectField
        label="Shape"
        value={lesion.mriMassShape}
        onChange={(v) => update({ mriMassShape: v })}
        options={MRI_MASS_SHAPES.map((o) => ({ value: o.value, label: o.label }))}
      />
      <SelectField
        label="Margin"
        value={lesion.mriMassMargin}
        onChange={(v) => update({ mriMassMargin: v })}
        options={MRI_MASS_MARGINS.map((o) => ({ value: o.value, label: o.label }))}
      />
      <SelectField
        label="Internal Enhancement Pattern"
        value={lesion.mriMassEnhancement}
        onChange={(v) => update({ mriMassEnhancement: v })}
        options={MRI_MASS_ENHANCEMENTS.map((o) => ({ value: o.value, label: o.label }))}
      />
      <SelectField
        label="T2 Signal"
        value={lesion.mriT2Signal}
        onChange={(v) => update({ mriT2Signal: v })}
        options={MRI_T2_SIGNALS.map((o) => ({ value: o.value, label: o.label }))}
      />
    </div>
  );
}

function MriNmePanel({
  lesion,
  update,
}: {
  lesion: BiRadsLesion;
  update: (p: Partial<BiRadsLesion>) => void;
}) {
  return (
    <div className="space-y-3">
      <SelectField
        label="Distribution"
        value={lesion.mriNmeDistribution}
        onChange={(v) => update({ mriNmeDistribution: v })}
        options={MRI_NME_DISTRIBUTIONS.map((o) => ({ value: o.value, label: o.label }))}
      />
      <SelectField
        label="Internal Enhancement Pattern"
        value={lesion.mriNmePattern}
        onChange={(v) => update({ mriNmePattern: v })}
        options={MRI_NME_PATTERNS.map((o) => ({ value: o.value, label: o.label }))}
      />
    </div>
  );
}

function MriKineticPanel({
  lesion,
  update,
}: {
  lesion: BiRadsLesion;
  update: (p: Partial<BiRadsLesion>) => void;
}) {
  return (
    <div className="space-y-3">
      <SelectField
        label="Initial Phase Enhancement"
        value={lesion.mriKineticInitial}
        onChange={(v) => update({ mriKineticInitial: v })}
        options={MRI_KINETIC_INITIAL.map((o) => ({ value: o.value, label: o.label }))}
      />
      <div>
        <SelectField
          label="Delayed Phase (Kinetic Curve)"
          value={lesion.mriKineticDelayed}
          onChange={(v) => update({ mriKineticDelayed: v })}
          options={MRI_KINETIC_DELAYED.map((o) => ({ value: o.value, label: o.label }))}
        />
        {lesion.mriKineticDelayed === "washout" && (
          <p className="mt-1 text-[11px] text-orange-600 dark:text-orange-400">
            Type III (Washout) — suspicious pattern, consider biopsy
          </p>
        )}
        {lesion.mriKineticDelayed === "persistent" && (
          <p className="mt-1 text-[11px] text-green-700 dark:text-green-400">
            Type I (Persistent) — favors benign etiology
          </p>
        )}
      </div>
    </div>
  );
}

function MriAssociatedFeaturesPanel({
  lesion,
  update,
}: {
  lesion: BiRadsLesion;
  update: (p: Partial<BiRadsLesion>) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {MRI_ASSOCIATED_FEATURE_OPTIONS.map((opt) => (
        <label key={opt.key} className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={lesion.mriAssociated[opt.key]}
            onChange={(e) =>
              update({
                mriAssociated: {
                  ...lesion.mriAssociated,
                  [opt.key]: e.target.checked,
                },
              })
            }
            className="h-3.5 w-3.5 rounded border-border text-primary accent-primary"
          />
          <span className="text-xs text-foreground/70">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

// ── Category selector ─────────────────────────────────────────────────────

function CategorySelector({
  value,
  onChange,
}: {
  value: BiRadsCategory | "";
  onChange: (v: BiRadsCategory | "") => void;
}) {
  const info = value ? getCategoryInfo(value) : null;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
        {BIRADS_CATEGORIES.map((cat) => {
          const selected = value === cat.category;
          return (
            <button
              key={cat.category}
              onClick={() => onChange(selected ? "" : cat.category)}
              className={`rounded-md border px-2 py-1.5 text-xs font-semibold transition-colors ${
                selected
                  ? `${biRadsRiskBg(cat.category)} border-current`
                  : "border-border bg-surface text-foreground/50 hover:border-primary/30 hover:text-foreground/70"
              }`}
            >
              {cat.label.replace("BI-RADS ", "")}
            </button>
          );
        })}
      </div>

      {info && (
        <div className={`rounded-lg border p-3 ${biRadsRiskBg(value as BiRadsCategory)}`}>
          <p className="text-sm font-semibold">{info.label} — {info.level}</p>
          <p className="mt-0.5 text-xs text-foreground/60">
            Malignancy risk: {info.malignancyRisk}
          </p>
          <p className="mt-1 text-xs text-foreground/70">{info.management}</p>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function LesionDetailPanel() {
  const { state, dispatch, activeLesion } = useBiRadsReport();
  const mod = state.modality;

  function update(payload: Partial<BiRadsLesion>) {
    dispatch({ type: "UPDATE_LESION", id: activeLesion.id, payload });
  }

  const sizeUnit = mod === "us" ? "mm" : "cm";
  const notesId = useId();

  return (
    <div className="flex-1 space-y-4 min-w-0">
      {/* Finding label */}
      <TextInput
        label="Finding label"
        value={activeLesion.label}
        onChange={(v) => update({ label: v })}
        placeholder="e.g. Finding 1, Right breast mass"
      />

      {/* Location */}
      <SectionDivider title="Location" />
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Laterality"
          value={activeLesion.laterality}
          onChange={(v) => update({ laterality: v })}
          options={LATERALITY_OPTIONS}
        />
        <SelectField
          label="Clock position"
          value={activeLesion.clockPosition}
          onChange={(v) => update({ clockPosition: v })}
          options={CLOCK_POSITIONS}
        />
        <SelectField
          label="Depth"
          value={activeLesion.depth}
          onChange={(v) => update({ depth: v })}
          options={DEPTHS}
        />
        <NumberInput
          label="Distance from nipple (mm)"
          value={activeLesion.distanceFromNippleMm}
          onChange={(v) => update({ distanceFromNippleMm: v })}
          placeholder="e.g. 30"
        />
      </div>

      {/* Size */}
      <SectionDivider title={`Size (${sizeUnit})`} />
      <div className="grid grid-cols-3 gap-2">
        {(["sizeA", "sizeB", "sizeC"] as const).map((key, i) => (
          <NumberInput
            key={key}
            label={["L", "W", "H"][i]}
            value={activeLesion[key]}
            onChange={(v) => update({ [key]: v })}
            placeholder="—"
          />
        ))}
      </div>

      {/* Descriptors */}
      <SectionDivider title="Descriptors" />

      {mod === "mammo" ? (
        /* Mammography branch */
        <div className="space-y-3">
          <SelectField
            label="Finding type"
            value={activeLesion.mammoFindingType}
            onChange={(v) => update({ mammoFindingType: v })}
            options={MAMMO_FINDING_TYPES}
          />

          {activeLesion.mammoFindingType === "mass" && (
            <MammoMassPanel lesion={activeLesion} update={update} />
          )}
          {activeLesion.mammoFindingType === "calcifications" && (
            <MammoCalcPanel lesion={activeLesion} update={update} />
          )}
          {activeLesion.mammoFindingType === "asymmetry" && (
            <SelectField
              label="Asymmetry type"
              value={activeLesion.asymmetryType}
              onChange={(v) => update({ asymmetryType: v })}
              options={ASYMMETRY_TYPES.map((o) => ({ value: o.value, label: o.label }))}
            />
          )}

          {activeLesion.mammoFindingType &&
            activeLesion.mammoFindingType !== "no_finding" &&
            activeLesion.mammoFindingType !== "skin_lesion" && (
              <>
                <SectionDivider title="Associated features" />
                <MammoAssociatedFeaturesPanel lesion={activeLesion} update={update} />
              </>
            )}
        </div>
      ) : mod === "us" ? (
        /* Ultrasound branch */
        <div className="space-y-3">
          <SelectField
            label="Finding type"
            value={activeLesion.usFindingType}
            onChange={(v) => update({ usFindingType: v })}
            options={US_FINDING_TYPES}
          />

          {activeLesion.usFindingType === "mass" && (
            <UsMassPanel lesion={activeLesion} update={update} />
          )}
          {activeLesion.usFindingType === "special_case" && (
            <SelectField
              label="Special case"
              value={activeLesion.usSpecialCase}
              onChange={(v) => update({ usSpecialCase: v })}
              options={US_SPECIAL_CASES.map((o) => ({ value: o.value, label: o.label }))}
            />
          )}

          {activeLesion.usFindingType === "mass" && (
            <>
              <SectionDivider title="Associated features" />
              <UsAssociatedFeaturesPanel lesion={activeLesion} update={update} />
            </>
          )}
        </div>
      ) : (
        /* MRI branch */
        <div className="space-y-3">
          <div>
            <SelectField
              label="Finding type"
              value={activeLesion.mriFindingType}
              onChange={(v) => update({ mriFindingType: v })}
              options={MRI_FINDING_TYPES.map((o) => ({ value: o.value, label: o.label }))}
            />
            {activeLesion.mriFindingType && (
              <p className="mt-1 text-[11px] text-foreground/50">
                {MRI_FINDING_TYPES.find((o) => o.value === activeLesion.mriFindingType)?.desc}
              </p>
            )}
          </div>

          {activeLesion.mriFindingType === "mass" && (
            <MriMassPanel lesion={activeLesion} update={update} />
          )}

          {activeLesion.mriFindingType === "non_mass_enhancement" && (
            <MriNmePanel lesion={activeLesion} update={update} />
          )}

          {(activeLesion.mriFindingType === "mass" ||
            activeLesion.mriFindingType === "non_mass_enhancement") && (
            <>
              <SectionDivider title="Kinetic Analysis" />
              <MriKineticPanel lesion={activeLesion} update={update} />
            </>
          )}

          {activeLesion.mriFindingType === "non_enhancing_finding" && (
            <SelectField
              label="Non-enhancing finding type"
              value={activeLesion.mriNonEnhancingType}
              onChange={(v) => update({ mriNonEnhancingType: v })}
              options={MRI_NON_ENHANCING_TYPES.map((o) => ({ value: o.value, label: o.label }))}
            />
          )}

          {activeLesion.mriFindingType &&
            activeLesion.mriFindingType !== "no_finding" &&
            activeLesion.mriFindingType !== "non_enhancing_finding" && (
              <>
                <SectionDivider title="Associated features" />
                <MriAssociatedFeaturesPanel lesion={activeLesion} update={update} />
              </>
            )}
        </div>
      )}

      {/* BI-RADS Category */}
      <SectionDivider title="BI-RADS Assessment" />
      <CategorySelector
        value={activeLesion.selectedCategory}
        onChange={(v) => update({ selectedCategory: v })}
      />

      {/* Notes */}
      <div>
        <FieldLabel htmlFor={notesId}>Notes (optional)</FieldLabel>
        <textarea
          id={notesId}
          value={activeLesion.notes}
          onChange={(e) => update({ notes: e.target.value })}
          rows={2}
          placeholder="Additional notes for this finding..."
          className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}
