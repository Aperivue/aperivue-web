"use client";

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
} from "@/lib/rads/birads";

// ── Sub-components ────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-medium text-foreground/70">
      {children}
    </label>
  );
}

function SelectField<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
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
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none"
    />
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      min={0}
      step={0.1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none"
    />
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <p className="mt-4 mb-2 text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
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
      <div>
        <FieldLabel>Shape</FieldLabel>
        <SelectField
          value={lesion.mammoMassShape}
          onChange={(v) => update({ mammoMassShape: v })}
          options={MAMMO_MASS_SHAPES.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>
      <div>
        <FieldLabel>Margin</FieldLabel>
        <SelectField
          value={lesion.mammoMassMargin}
          onChange={(v) => update({ mammoMassMargin: v })}
          options={MAMMO_MASS_MARGINS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>
      <div>
        <FieldLabel>Density</FieldLabel>
        <SelectField
          value={lesion.mammoMassDensity}
          onChange={(v) => update({ mammoMassDensity: v })}
          options={MAMMO_MASS_DENSITIES.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>
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
      <div>
        <FieldLabel>Morphology</FieldLabel>
        <SelectField
          value={lesion.calcMorphology}
          onChange={(v) => update({ calcMorphology: v })}
          options={CALC_MORPHOLOGIES.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>
      <div>
        <FieldLabel>Distribution</FieldLabel>
        <SelectField
          value={lesion.calcDistribution}
          onChange={(v) => update({ calcDistribution: v })}
          options={CALC_DISTRIBUTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>
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
      <div>
        <FieldLabel>Shape</FieldLabel>
        <SelectField
          value={lesion.usMassShape}
          onChange={(v) => update({ usMassShape: v })}
          options={US_MASS_SHAPES.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>
      <div>
        <FieldLabel>Orientation</FieldLabel>
        <SelectField
          value={lesion.usMassOrientation}
          onChange={(v) => update({ usMassOrientation: v })}
          options={US_MASS_ORIENTATIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>
      <div>
        <FieldLabel>Margin</FieldLabel>
        <SelectField
          value={lesion.usMassMargin}
          onChange={(v) => update({ usMassMargin: v })}
          options={US_MASS_MARGINS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>
      <div>
        <FieldLabel>Echo Pattern</FieldLabel>
        <SelectField
          value={lesion.usEchoPattern}
          onChange={(v) => update({ usEchoPattern: v })}
          options={US_ECHO_PATTERNS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>
      <div>
        <FieldLabel>Posterior Features</FieldLabel>
        <SelectField
          value={lesion.usPosteriorFeatures}
          onChange={(v) => update({ usPosteriorFeatures: v })}
          options={US_POSTERIOR_FEATURES.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>
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

  return (
    <div className="flex-1 space-y-4 min-w-0">
      {/* Finding label */}
      <div>
        <FieldLabel>Finding label</FieldLabel>
        <TextInput
          value={activeLesion.label}
          onChange={(v) => update({ label: v })}
          placeholder="e.g. Finding 1, Right breast mass"
        />
      </div>

      {/* Location */}
      <SectionDivider title="Location" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Laterality</FieldLabel>
          <SelectField
            value={activeLesion.laterality}
            onChange={(v) => update({ laterality: v })}
            options={LATERALITY_OPTIONS}
          />
        </div>
        <div>
          <FieldLabel>Clock position</FieldLabel>
          <SelectField
            value={activeLesion.clockPosition}
            onChange={(v) => update({ clockPosition: v })}
            options={CLOCK_POSITIONS}
          />
        </div>
        <div>
          <FieldLabel>Depth</FieldLabel>
          <SelectField
            value={activeLesion.depth}
            onChange={(v) => update({ depth: v })}
            options={DEPTHS}
          />
        </div>
        <div>
          <FieldLabel>Distance from nipple (mm)</FieldLabel>
          <NumberInput
            value={activeLesion.distanceFromNippleMm}
            onChange={(v) => update({ distanceFromNippleMm: v })}
            placeholder="e.g. 30"
          />
        </div>
      </div>

      {/* Size */}
      <SectionDivider title={`Size (${sizeUnit})`} />
      <div className="grid grid-cols-3 gap-2">
        {(["sizeA", "sizeB", "sizeC"] as const).map((key, i) => (
          <div key={key}>
            <FieldLabel>{["L", "W", "H"][i]}</FieldLabel>
            <NumberInput
              value={activeLesion[key]}
              onChange={(v) => update({ [key]: v })}
              placeholder="—"
            />
          </div>
        ))}
      </div>

      {/* Descriptors */}
      <SectionDivider title="Descriptors" />

      {mod === "mammo" ? (
        <div className="space-y-3">
          <div>
            <FieldLabel>Finding type</FieldLabel>
            <SelectField
              value={activeLesion.mammoFindingType}
              onChange={(v) => update({ mammoFindingType: v })}
              options={MAMMO_FINDING_TYPES}
            />
          </div>

          {activeLesion.mammoFindingType === "mass" && (
            <MammoMassPanel lesion={activeLesion} update={update} />
          )}
          {activeLesion.mammoFindingType === "calcifications" && (
            <MammoCalcPanel lesion={activeLesion} update={update} />
          )}
          {activeLesion.mammoFindingType === "asymmetry" && (
            <div>
              <FieldLabel>Asymmetry type</FieldLabel>
              <SelectField
                value={activeLesion.asymmetryType}
                onChange={(v) => update({ asymmetryType: v })}
                options={ASYMMETRY_TYPES.map((o) => ({ value: o.value, label: o.label }))}
              />
            </div>
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
      ) : (
        <div className="space-y-3">
          <div>
            <FieldLabel>Finding type</FieldLabel>
            <SelectField
              value={activeLesion.usFindingType}
              onChange={(v) => update({ usFindingType: v })}
              options={US_FINDING_TYPES}
            />
          </div>

          {activeLesion.usFindingType === "mass" && (
            <UsMassPanel lesion={activeLesion} update={update} />
          )}
          {activeLesion.usFindingType === "special_case" && (
            <div>
              <FieldLabel>Special case</FieldLabel>
              <SelectField
                value={activeLesion.usSpecialCase}
                onChange={(v) => update({ usSpecialCase: v })}
                options={US_SPECIAL_CASES.map((o) => ({ value: o.value, label: o.label }))}
              />
            </div>
          )}

          {activeLesion.usFindingType === "mass" && (
            <>
              <SectionDivider title="Associated features" />
              <UsAssociatedFeaturesPanel lesion={activeLesion} update={update} />
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
        <FieldLabel>Notes (optional)</FieldLabel>
        <textarea
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
