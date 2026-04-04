"use client";

import { useState, useCallback } from "react";
import {
  type TiradsSystem,
  type NoduleEntry,
  type NoduleLocation,
  NODULE_LOCATIONS,
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
} from "@/lib/rads/tirads";

// ── System tab selector ───────────────────────────────────────────────────

const SYSTEMS: { id: TiradsSystem; label: string; subtitle: string }[] = [
  { id: "acr", label: "ACR TI-RADS", subtitle: "2017" },
  { id: "ktirads", label: "K-TIRADS", subtitle: "2021" },
  { id: "eutirads", label: "EU-TIRADS", subtitle: "2017" },
];

// ── Nodule management ─────────────────────────────────────────────────────

let nextId = 1;
function createNodule(): NoduleEntry {
  const id = String(nextId++);
  return { id, label: `Nodule ${id}`, location: "", size: null };
}

// ── Main component ────────────────────────────────────────────────────────

export default function TiradsCalculator() {
  const [system, setSystem] = useState<TiradsSystem>("acr");
  const [nodules, setNodules] = useState<NoduleEntry[]>([createNodule()]);
  const [activeNoduleId, setActiveNoduleId] = useState(nodules[0].id);

  const activeNodule = nodules.find((n) => n.id === activeNoduleId) ?? nodules[0];

  const updateNodule = useCallback(
    (id: string, patch: Partial<NoduleEntry>) => {
      setNodules((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
    },
    [],
  );

  const addNodule = () => {
    const n = createNodule();
    setNodules((prev) => [...prev, n]);
    setActiveNoduleId(n.id);
  };

  const removeNodule = (id: string) => {
    setNodules((prev) => {
      const next = prev.filter((n) => n.id !== id);
      if (next.length === 0) {
        const fresh = createNodule();
        setActiveNoduleId(fresh.id);
        return [fresh];
      }
      if (activeNoduleId === id) setActiveNoduleId(next[0].id);
      return next;
    });
  };

  return (
    <div>
      {/* System selector */}
      <div className="mb-6 flex rounded-lg border border-border bg-muted p-1">
        {SYSTEMS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSystem(s.id)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              system === s.id
                ? "bg-surface text-foreground shadow-sm"
                : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            {s.label}
            <span className="ml-1 text-[10px] text-foreground/40">{s.subtitle}</span>
          </button>
        ))}
      </div>

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
          <label className="mb-1 block text-xs font-medium text-foreground/60">
            Location
          </label>
          <select
            value={activeNodule.location}
            onChange={(e) =>
              updateNodule(activeNodule.id, { location: e.target.value as NoduleLocation })
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            {NODULE_LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">
            Max diameter (cm)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g. 1.2"
            value={activeNodule.size ?? ""}
            onChange={(e) =>
              updateNodule(activeNodule.id, {
                size: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Calculator body */}
      {system === "acr" && <AcrCalculator nodule={activeNodule} />}
      {system === "ktirads" && <KtiradsCalculator nodule={activeNodule} />}
      {system === "eutirads" && <EutiradsCalculator nodule={activeNodule} />}
    </div>
  );
}

// ── ACR TI-RADS Calculator ────────────────────────────────────────────────

function AcrCalculator({ nodule }: { nodule: NoduleEntry }) {
  const [selections, setSelections] = useState<number[]>(ACR_FEATURES.map(() => 0));

  const handleSelect = useCallback((catIdx: number, optIdx: number) => {
    setSelections((prev) => {
      const next = [...prev];
      next[catIdx] = optIdx;
      return next;
    });
  }, []);

  const result: AcrResult = scoreAcrTirads(selections, nodule.size);

  return (
    <div className="space-y-4">
      {ACR_FEATURES.map((cat, catIdx) => (
        <fieldset key={cat.name} className="rounded-xl border border-border bg-surface p-4">
          <legend className="px-2 text-sm font-semibold">{cat.name}</legend>
          <p className="mb-2 text-xs text-foreground/40">{cat.description}</p>
          <div className="grid gap-1.5">
            {cat.options.map((opt, optIdx) => (
              <label
                key={opt.label}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  selections[catIdx] === optIdx
                    ? "bg-primary/10 text-foreground font-medium"
                    : "hover:bg-muted text-foreground/70"
                }`}
              >
                <input
                  type="radio"
                  name={`acr-${catIdx}`}
                  checked={selections[catIdx] === optIdx}
                  onChange={() => handleSelect(catIdx, optIdx)}
                  className="accent-primary"
                />
                <span className="flex-1">{opt.label}</span>
                <span className="text-xs text-foreground/40">{opt.points}pt</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <ResultCard
        system="ACR TI-RADS"
        category={result.category}
        level={result.level}
        risk={result.risk}
        fna={result.fna}
        followUp={result.followUp}
        extra={`${result.totalPoints} points`}
        nodule={nodule}
      />
    </div>
  );
}

// ── K-TIRADS Calculator ───────────────────────────────────────────────────

const K_COMPOSITIONS: { value: KtiradsComposition; label: string; desc: string }[] = [
  { value: "solid", label: "Solid", desc: "No obvious cystic component" },
  { value: "predominantly_solid", label: "Predominantly solid", desc: "Cystic portion \u2264 50%" },
  { value: "predominantly_cystic", label: "Predominantly cystic", desc: "Cystic portion > 50%" },
  { value: "cystic", label: "Pure cyst", desc: "No solid component; or partially cystic with intracystic echogenic foci + comet-tail artifact" },
  { value: "spongiform", label: "Spongiform", desc: "Microcystic changes > 50% of solid component" },
];

const K_ECHOGENICITIES: { value: KtiradsEchogenicity; label: string; desc: string }[] = [
  { value: "marked_hypo", label: "Marked hypoechogenicity", desc: "Hypoechoic relative to anterior neck muscles" },
  { value: "mild_hypo", label: "Mild hypoechogenicity", desc: "Hypoechoic relative to thyroid, hyperechoic relative to muscles" },
  { value: "isoechoic", label: "Isoechoic", desc: "Same as thyroid parenchyma" },
  { value: "hyperechoic", label: "Hyperechoic", desc: "Brighter than thyroid parenchyma" },
];

const K_SUSPICIOUS: { key: keyof KtiradsSuspiciousFeatures; label: string; desc: string }[] = [
  { key: "punctateEchogenicFoci", label: "Punctate echogenic foci (PEF)", desc: "Microcalcifications; \u2264 1 mm hyperechoic foci within solid component" },
  { key: "nonparallelOrientation", label: "Nonparallel orientation", desc: "Taller-than-wide shape (AP > transverse on axial)" },
  { key: "irregularMargin", label: "Irregular margin", desc: "Spiculated, microlobulated, or non-smooth edges" },
];

function KtiradsCalculator({ nodule }: { nodule: NoduleEntry }) {
  const [composition, setComposition] = useState<KtiradsComposition | null>(null);
  const [echogenicity, setEchogenicity] = useState<KtiradsEchogenicity | null>(null);
  const [entirelyCalcified, setEntirelyCalcified] = useState(false);
  const [suspicious, setSuspicious] = useState<KtiradsSuspiciousFeatures>({
    punctateEchogenicFoci: false,
    nonparallelOrientation: false,
    irregularMargin: false,
  });

  const needsEcho = composition !== null && composition !== "cystic" && !entirelyCalcified;
  const needsSusp = composition !== null && composition !== "cystic" && !entirelyCalcified;
  const isBenignPattern =
    composition === "cystic" ||
    (composition === "spongiform" && (echogenicity === "isoechoic" || echogenicity === "hyperechoic"));

  const result: KtiradsResult | null = scoreKtirads(
    composition, echogenicity, suspicious, entirelyCalcified, nodule.size,
  );

  return (
    <div className="space-y-4">
      {/* Composition */}
      <fieldset className="rounded-xl border border-border bg-surface p-4">
        <legend className="px-2 text-sm font-semibold">Composition</legend>
        <div className="mt-1 grid gap-1.5">
          {K_COMPOSITIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                composition === opt.value
                  ? "bg-primary/10 text-foreground font-medium"
                  : "hover:bg-muted text-foreground/70"
              }`}
            >
              <input
                type="radio"
                name="k-comp"
                checked={composition === opt.value}
                onChange={() => { setComposition(opt.value); if (opt.value === "cystic") setEntirelyCalcified(false); }}
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

      {/* Entirely calcified (special case → K-TIRADS 4) */}
      {composition && composition !== "cystic" && (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-colors hover:bg-muted">
          <input
            type="checkbox"
            checked={entirelyCalcified}
            onChange={() => setEntirelyCalcified(!entirelyCalcified)}
            className="accent-primary"
          />
          <div>
            <span className="font-medium">Entirely calcified nodule</span>
            <p className="text-xs text-foreground/40">
              Complete posterior acoustic shadowing, no identifiable soft tissue
            </p>
          </div>
        </label>
      )}

      {/* Echogenicity */}
      {needsEcho && !isBenignPattern && (
        <fieldset className="rounded-xl border border-border bg-surface p-4">
          <legend className="px-2 text-sm font-semibold">Echogenicity</legend>
          <p className="mb-2 text-xs text-foreground/40">
            Of the non-calcified solid component, relative to thyroid parenchyma and anterior neck muscles
          </p>
          <div className="grid gap-1.5">
            {K_ECHOGENICITIES.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  echogenicity === opt.value
                    ? "bg-primary/10 text-foreground font-medium"
                    : "hover:bg-muted text-foreground/70"
                }`}
              >
                <input
                  type="radio"
                  name="k-echo"
                  checked={echogenicity === opt.value}
                  onChange={() => setEchogenicity(opt.value)}
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
      )}

      {/* Suspicious US features */}
      {needsSusp && !isBenignPattern && (
        <fieldset className="rounded-xl border border-border bg-surface p-4">
          <legend className="px-2 text-sm font-semibold">Suspicious US Features</legend>
          <p className="mb-2 text-xs text-foreground/40">
            Select all that apply. These are the 3 features used in the 2021 K-TIRADS algorithm.
          </p>
          <div className="grid gap-1.5">
            {K_SUSPICIOUS.map((feat) => (
              <label
                key={feat.key}
                className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  suspicious[feat.key]
                    ? "bg-primary/10 text-foreground font-medium"
                    : "hover:bg-muted text-foreground/70"
                }`}
              >
                <input
                  type="checkbox"
                  checked={suspicious[feat.key]}
                  onChange={() =>
                    setSuspicious((prev) => ({ ...prev, [feat.key]: !prev[feat.key] }))
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
      )}

      {result ? (
        <ResultCard
          system="K-TIRADS"
          category={result.category}
          level={result.level}
          risk={result.risk}
          fna={result.fna}
          followUp={result.followUp}
          extra={result.pattern}
          nodule={nodule}
        />
      ) : (
        <Placeholder text="Select composition to see results." />
      )}
    </div>
  );
}

// ── EU-TIRADS Calculator ──────────────────────────────────────────────────

const EU_COMPOSITIONS: { value: EutiradsComposition; label: string; desc: string }[] = [
  { value: "cystic", label: "Purely cystic", desc: "Anechoic, no solid component" },
  { value: "spongiform", label: "Spongiform", desc: "Aggregation of multiple microcystic components" },
  { value: "solid_iso_hyper", label: "Solid — isoechoic or hyperechoic", desc: "No suspicious features" },
  { value: "mildly_hypo", label: "Solid — mildly hypoechoic", desc: "Hypoechoic relative to thyroid parenchyma" },
  { value: "markedly_hypo", label: "Solid — markedly hypoechoic", desc: "Hypoechoic relative to anterior neck muscles" },
];

function EutiradsCalculator({ nodule }: { nodule: NoduleEntry }) {
  const [composition, setComposition] = useState<EutiradsComposition | null>(null);
  const [hasHighRisk, setHasHighRisk] = useState(false);

  const showHighRisk = composition === "mildly_hypo";
  const result: EutiradsResult | null = scoreEutirads(composition, hasHighRisk, nodule.size);

  return (
    <div className="space-y-4">
      <fieldset className="rounded-xl border border-border bg-surface p-4">
        <legend className="px-2 text-sm font-semibold">Composition &amp; Echogenicity</legend>
        <div className="mt-1 grid gap-1.5">
          {EU_COMPOSITIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                composition === opt.value
                  ? "bg-primary/10 text-foreground font-medium"
                  : "hover:bg-muted text-foreground/70"
              }`}
            >
              <input
                type="radio"
                name="eu-comp"
                checked={composition === opt.value}
                onChange={() => setComposition(opt.value)}
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

      {showHighRisk && (
        <fieldset className="rounded-xl border border-border bg-surface p-4">
          <legend className="px-2 text-sm font-semibold">High-Risk Features</legend>
          <p className="mb-2 text-xs text-foreground/40">
            If present, upgrades from EU-TIRADS 4 to EU-TIRADS 5
          </p>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted">
            <input
              type="checkbox"
              checked={hasHighRisk}
              onChange={() => setHasHighRisk(!hasHighRisk)}
              className="accent-primary"
            />
            Any high-risk feature: irregular shape/margin, microcalcifications, rim calcification, or ETE
          </label>
        </fieldset>
      )}

      {result ? (
        <ResultCard
          system="EU-TIRADS"
          category={result.category}
          level={result.level}
          risk={result.risk}
          fna={result.fna}
          followUp={result.followUp}
          nodule={nodule}
        />
      ) : (
        <Placeholder text="Select composition to see results." />
      )}
    </div>
  );
}

// ── Shared result card ────────────────────────────────────────────────────

function ResultCard({
  system,
  category,
  level,
  risk,
  fna,
  followUp,
  extra,
  nodule,
}: {
  system: string;
  category: string;
  level: string;
  risk: string;
  fna: string;
  followUp: string;
  extra?: string;
  nodule: NoduleEntry;
}) {
  const bg = riskBg(category);
  const loc = NODULE_LOCATIONS.find((l) => l.value === nodule.location);
  const locStr = loc && loc.value ? loc.label : "";
  const sizeStr = nodule.size ? `${nodule.size} cm` : "";
  const noduleInfo = [locStr, sizeStr].filter(Boolean).join(", ");

  const handleCopy = () => {
    const lines = [
      `${system}: ${category} — ${level}`,
      `Malignancy risk: ${risk}`,
      noduleInfo ? `Nodule: ${noduleInfo}` : "",
      `FNA: ${fna}`,
      followUp ? `Follow-up: ${followUp}` : "",
      extra ? `(${extra})` : "",
    ].filter(Boolean);
    navigator.clipboard.writeText(lines.join("\n"));
  };

  return (
    <div className={`rounded-xl border p-5 ${bg}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">
            {system}
          </p>
          <p className="mt-1 text-2xl font-bold">{category}</p>
          <p className="mt-0.5 text-sm font-medium text-foreground/80">{level}</p>
          {extra && <p className="mt-1 text-xs text-foreground/50 italic">{extra}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs text-foreground/50">Malignancy Risk</p>
          <p className="mt-1 text-xl font-bold">{risk}</p>
          {noduleInfo && (
            <p className="mt-2 text-xs text-foreground/50">{noduleInfo}</p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-current/10 pt-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">
            FNA Recommendation
          </p>
          <p className="mt-0.5 text-sm font-semibold">{fna}</p>
        </div>
        {followUp && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">
              Follow-up
            </p>
            <p className="mt-0.5 text-sm">{followUp}</p>
          </div>
        )}
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

function Placeholder({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground/40">
      {text}
    </div>
  );
}
