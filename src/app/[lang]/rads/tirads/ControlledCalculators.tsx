"use client";

import {
  ACR_FEATURES,
  scoreAcrTirads,
  type AcrResult,
  type KtiradsComposition,
  type KtiradsEchogenicity,
  type KtiradsSuspiciousFeatures,
  scoreKtirads,
  type KtiradsResult,
  type EutiradsComposition,
  scoreEutirads,
  type EutiradsResult,
  riskBg,
  NODULE_LOCATIONS,
} from "@/lib/rads/tirads";

// ── Shared UI primitives ──────────────────────────────────────────────────

function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: T; label: string; desc?: string; extra?: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-1.5">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
            value === opt.value
              ? "bg-primary/10 text-foreground font-medium"
              : "hover:bg-muted text-foreground/70"
          }`}
        >
          <input
            type="radio"
            name={name}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="mt-0.5 accent-primary"
          />
          <div className="flex-1">
            <span>{opt.label}</span>
            {opt.desc && <p className="text-xs text-foreground/40">{opt.desc}</p>}
          </div>
          {opt.extra && <span className="text-xs text-foreground/40">{opt.extra}</span>}
        </label>
      ))}
    </div>
  );
}

function CheckGroup({
  options,
  values,
  onChange,
}: {
  options: { key: string; label: string; desc?: string }[];
  values: Record<string, boolean>;
  onChange: (key: string, val: boolean) => void;
}) {
  return (
    <div className="grid gap-1.5">
      {options.map((opt) => (
        <label
          key={opt.key}
          className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
            values[opt.key]
              ? "bg-primary/10 text-foreground font-medium"
              : "hover:bg-muted text-foreground/70"
          }`}
        >
          <input
            type="checkbox"
            checked={values[opt.key] ?? false}
            onChange={() => onChange(opt.key, !values[opt.key])}
            className="mt-0.5 accent-primary"
          />
          <div>
            <span>{opt.label}</span>
            {opt.desc && <p className="text-xs text-foreground/40">{opt.desc}</p>}
          </div>
        </label>
      ))}
    </div>
  );
}

function Fieldset({ legend, desc, children }: { legend: string; desc?: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border border-border bg-surface p-4">
      <legend className="px-2 text-sm font-semibold">{legend}</legend>
      {desc && <p className="mb-2 text-xs text-foreground/40">{desc}</p>}
      {children}
    </fieldset>
  );
}

// ── ACR TI-RADS (Controlled) ──────────────────────────────────────────────

export function AcrCalculatorControlled({
  selections,
  onSelectionChange,
  sizeCm,
}: {
  selections: number[];
  onSelectionChange: (catIdx: number, optIdx: number) => void;
  sizeCm: number | null;
}) {
  const result: AcrResult = scoreAcrTirads(selections, sizeCm);

  return (
    <div className="space-y-3">
      {ACR_FEATURES.map((cat, catIdx) => (
        <Fieldset key={cat.name} legend={cat.name} desc={cat.description}>
          <RadioGroup
            name={`acr-${catIdx}`}
            options={cat.options.map((opt, optIdx) => ({
              value: String(optIdx),
              label: opt.label,
              extra: `${opt.points}pt`,
            }))}
            value={String(selections[catIdx])}
            onChange={(v) => onSelectionChange(catIdx, parseInt(v, 10))}
          />
        </Fieldset>
      ))}
      <ResultBanner
        category={result.category}
        level={result.level}
        risk={result.risk}
        fna={result.fna}
        followUp={result.followUp}
        extra={`${result.totalPoints} points`}
      />
    </div>
  );
}

// ── K-TIRADS (Controlled) ─────────────────────────────────────────────────

const K_COMP_OPTIONS: { value: KtiradsComposition; label: string; desc: string }[] = [
  { value: "solid", label: "Solid", desc: "No obvious cystic component" },
  { value: "predominantly_solid", label: "Predominantly solid", desc: "Cystic portion \u2264 50%" },
  { value: "predominantly_cystic", label: "Predominantly cystic", desc: "Cystic portion > 50%" },
  { value: "cystic", label: "Pure cyst", desc: "No solid component; or partially cystic with intracystic echogenic foci + comet-tail" },
  { value: "spongiform", label: "Spongiform", desc: "Microcystic changes > 50% of solid component" },
];

const K_ECHO_OPTIONS: { value: KtiradsEchogenicity; label: string; desc: string }[] = [
  { value: "marked_hypo", label: "Marked hypoechogenicity", desc: "Relative to anterior neck muscles" },
  { value: "mild_hypo", label: "Mild hypoechogenicity", desc: "Hypoechoic to thyroid, hyperechoic to muscles" },
  { value: "isoechoic", label: "Isoechoic", desc: "Same as thyroid parenchyma" },
  { value: "hyperechoic", label: "Hyperechoic", desc: "Brighter than thyroid parenchyma" },
];

const K_SUSP_OPTIONS = [
  { key: "punctateEchogenicFoci", label: "Punctate echogenic foci (PEF)", desc: "\u2264 1 mm hyperechoic foci within solid component" },
  { key: "nonparallelOrientation", label: "Nonparallel orientation", desc: "Taller-than-wide (AP > transverse on axial)" },
  { key: "irregularMargin", label: "Irregular margin", desc: "Spiculated, microlobulated, or non-smooth edges" },
];

export function KtiradsCalculatorControlled({
  composition,
  echogenicity,
  suspicious,
  entirelyCalcified,
  onCompositionChange,
  onEchogenicityChange,
  onSuspiciousChange,
  onEntirelyCalcifiedChange,
  sizeCm,
}: {
  composition: KtiradsComposition | null;
  echogenicity: KtiradsEchogenicity | null;
  suspicious: KtiradsSuspiciousFeatures;
  entirelyCalcified: boolean;
  onCompositionChange: (v: KtiradsComposition) => void;
  onEchogenicityChange: (v: KtiradsEchogenicity) => void;
  onSuspiciousChange: (key: string, val: boolean) => void;
  onEntirelyCalcifiedChange: (v: boolean) => void;
  sizeCm: number | null;
}) {
  const result: KtiradsResult | null = scoreKtirads(composition, echogenicity, suspicious, entirelyCalcified, sizeCm);

  const needsEcho = composition !== null && composition !== "cystic" && !entirelyCalcified;
  const isBenignPattern =
    composition === "cystic" ||
    (composition === "spongiform" && (echogenicity === "isoechoic" || echogenicity === "hyperechoic"));
  const needsSusp = needsEcho && !isBenignPattern;

  return (
    <div className="space-y-3">
      <Fieldset legend="Composition">
        <RadioGroup
          name="k-comp"
          options={K_COMP_OPTIONS}
          value={composition}
          onChange={onCompositionChange}
        />
      </Fieldset>

      {composition && composition !== "cystic" && (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm hover:bg-muted">
          <input type="checkbox" checked={entirelyCalcified} onChange={() => onEntirelyCalcifiedChange(!entirelyCalcified)} className="accent-primary" />
          <div>
            <span className="font-medium">Entirely calcified nodule</span>
            <p className="text-xs text-foreground/40">Complete posterior acoustic shadowing, no soft tissue</p>
          </div>
        </label>
      )}

      {needsEcho && !isBenignPattern && (
        <Fieldset legend="Echogenicity" desc="Relative to thyroid parenchyma and anterior neck muscles">
          <RadioGroup name="k-echo" options={K_ECHO_OPTIONS} value={echogenicity} onChange={onEchogenicityChange} />
        </Fieldset>
      )}

      {needsSusp && (
        <Fieldset legend="Suspicious US Features" desc="The 3 features per 2021 K-TIRADS algorithm">
          <CheckGroup
            options={K_SUSP_OPTIONS}
            values={suspicious as unknown as Record<string, boolean>}
            onChange={onSuspiciousChange}
          />
        </Fieldset>
      )}

      {result ? (
        <ResultBanner
          category={result.category}
          level={result.level}
          risk={result.risk}
          fna={result.fna}
          followUp={result.followUp}
          extra={result.pattern}
        />
      ) : (
        <Placeholder text="Select composition to see results." />
      )}
    </div>
  );
}

// ── EU-TIRADS (Controlled) ────────────────────────────────────────────────

const EU_COMP_OPTIONS: { value: EutiradsComposition; label: string; desc: string }[] = [
  { value: "cystic", label: "Purely cystic", desc: "Anechoic, no solid component" },
  { value: "spongiform", label: "Spongiform", desc: "Aggregation of microcystic components" },
  { value: "solid_iso_hyper", label: "Solid \u2014 isoechoic or hyperechoic", desc: "" },
  { value: "mildly_hypo", label: "Solid \u2014 mildly hypoechoic", desc: "Hypoechoic relative to thyroid" },
  { value: "markedly_hypo", label: "Solid \u2014 markedly hypoechoic", desc: "Hypoechoic relative to muscles" },
];

export function EutiradsCalculatorControlled({
  composition,
  hasHighRisk,
  onCompositionChange,
  onHighRiskChange,
  sizeCm,
}: {
  composition: EutiradsComposition | null;
  hasHighRisk: boolean;
  onCompositionChange: (v: EutiradsComposition) => void;
  onHighRiskChange: (v: boolean) => void;
  sizeCm: number | null;
}) {
  const result: EutiradsResult | null = scoreEutirads(composition, hasHighRisk, sizeCm);

  return (
    <div className="space-y-3">
      <Fieldset legend="Composition & Echogenicity">
        <RadioGroup name="eu-comp" options={EU_COMP_OPTIONS} value={composition} onChange={onCompositionChange} />
      </Fieldset>

      {composition === "mildly_hypo" && (
        <Fieldset legend="High-Risk Features" desc="If present, upgrades to EU-TIRADS 5">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted">
            <input type="checkbox" checked={hasHighRisk} onChange={() => onHighRiskChange(!hasHighRisk)} className="accent-primary" />
            Any: irregular shape/margin, microcalcifications, rim calcification, or ETE
          </label>
        </Fieldset>
      )}

      {result ? (
        <ResultBanner category={result.category} level={result.level} risk={result.risk} fna={result.fna} followUp={result.followUp} />
      ) : (
        <Placeholder text="Select composition to see results." />
      )}
    </div>
  );
}

// ── Shared result banner (compact, inline) ────────────────────────────────

function ResultBanner({
  category, level, risk, fna, followUp, extra,
}: {
  category: string; level: string; risk: string; fna: string; followUp: string; extra?: string;
}) {
  const bg = riskBg(category);
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-lg font-bold">{category}</span>
          <span className="ml-2 text-sm text-foreground/70">{level}</span>
          {extra && <p className="text-xs text-foreground/50 italic">{extra}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs text-foreground/50">Risk</p>
          <p className="text-lg font-bold">{risk}</p>
        </div>
      </div>
      <div className="mt-2 border-t border-current/10 pt-2 text-sm">
        <p><span className="font-medium">FNA:</span> {fna}</p>
        {followUp && <p className="text-foreground/70"><span className="font-medium">Follow-up:</span> {followUp}</p>}
      </div>
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-foreground/40">
      {text}
    </div>
  );
}
