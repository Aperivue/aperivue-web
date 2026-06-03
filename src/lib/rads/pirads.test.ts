import { describe, it, expect } from "vitest";
import { scorePirads, type PiradsInput, type ProstateZone, type DceResult } from "./pirads";

// ---------------------------------------------------------------------------
// Regression / invariant harness for the PI-RADS v2.1 assessment categories.
// Does NOT replace radiologist reconciliation against the PI-RADS v2.1 source
// (Turkbey et al., Eur Urol 2019). Expected values are hand-curated.
// ---------------------------------------------------------------------------

function base(overrides: Partial<PiradsInput> = {}): PiradsInput {
  return { zone: "pz", t2w: null, dwi: 4, dce: "", ...overrides };
}

function cat(overrides: Partial<PiradsInput>): number | null {
  return scorePirads(base(overrides))?.score ?? null;
}

// ── Peripheral zone (DWI dominant) ─────────────────────────────────────────

describe("PZ — DWI is dominant", () => {
  it("DWI maps directly except score 3", () => {
    expect(cat({ zone: "pz", dwi: 1 })).toBe(1);
    expect(cat({ zone: "pz", dwi: 2 })).toBe(2);
    expect(cat({ zone: "pz", dwi: 4 })).toBe(4);
    expect(cat({ zone: "pz", dwi: 5 })).toBe(5);
  });
  it("DWI 3 + DCE negative → PI-RADS 3", () => {
    expect(cat({ zone: "pz", dwi: 3, dce: "negative" })).toBe(3);
  });
  it("DWI 3 + DCE positive → PI-RADS 4", () => {
    expect(cat({ zone: "pz", dwi: 3, dce: "positive" })).toBe(4);
  });
  it("DWI 3 + DCE unavailable/inadequate → PI-RADS 3 (DWI category final)", () => {
    expect(cat({ zone: "pz", dwi: 3, dce: "unavailable" })).toBe(3);
  });
  it("DWI 3 + DCE not yet selected → null (must select DCE)", () => {
    expect(cat({ zone: "pz", dwi: 3, dce: "" })).toBeNull();
  });
  it("DCE does not change PZ when DWI ≠ 3", () => {
    expect(cat({ zone: "pz", dwi: 2, dce: "positive" })).toBe(2);
    expect(cat({ zone: "pz", dwi: 4, dce: "negative" })).toBe(4);
  });
});

// ── Transition zone (T2W dominant) ─────────────────────────────────────────

describe("TZ — T2W is dominant (v2.1 DWI upgrade)", () => {
  it("T2W 1/4/5 are terminal regardless of DWI", () => {
    expect(cat({ zone: "tz", t2w: 1, dwi: 5 })).toBe(1);
    expect(cat({ zone: "tz", t2w: 4, dwi: 1 })).toBe(4);
    expect(cat({ zone: "tz", t2w: 5, dwi: 1 })).toBe(5);
  });
  it("T2W 2 + DWI ≤3 → PI-RADS 2", () => {
    expect(cat({ zone: "tz", t2w: 2, dwi: 1 })).toBe(2);
    expect(cat({ zone: "tz", t2w: 2, dwi: 3 })).toBe(2);
  });
  // v2.1 update: a transition-zone T2W 2 with DWI ≥4 is upgraded to PI-RADS 3.
  it("T2W 2 + DWI ≥4 → upgraded to PI-RADS 3", () => {
    expect(cat({ zone: "tz", t2w: 2, dwi: 4 })).toBe(3);
    expect(cat({ zone: "tz", t2w: 2, dwi: 5 })).toBe(3);
  });
  it("T2W 2 + DWI not assessed → null (DWI required to finalize)", () => {
    expect(cat({ zone: "tz", t2w: 2, dwi: null })).toBeNull();
  });
  it("T2W 3 + DWI ≤4 → PI-RADS 3", () => {
    expect(cat({ zone: "tz", t2w: 3, dwi: 1 })).toBe(3);
    expect(cat({ zone: "tz", t2w: 3, dwi: 4 })).toBe(3);
  });
  it("T2W 3 + DWI 5 → PI-RADS 4", () => {
    expect(cat({ zone: "tz", t2w: 3, dwi: 5 })).toBe(4);
  });
  it("T2W 3 + DWI not assessed → null", () => {
    expect(cat({ zone: "tz", t2w: 3, dwi: null })).toBeNull();
  });
});

// ── Incomplete input ───────────────────────────────────────────────────────

describe("incomplete input → null", () => {
  it("no zone → null", () => {
    expect(cat({ zone: "" })).toBeNull();
  });
  it("PZ without DWI → null", () => {
    expect(cat({ zone: "pz", dwi: null })).toBeNull();
  });
  it("TZ without T2W → null", () => {
    expect(cat({ zone: "tz", t2w: null })).toBeNull();
  });
});

// ── Fuzz invariants ────────────────────────────────────────────────────────

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Independent oracle (not the engine) — transcribes the PI-RADS v2.1 tables.
function oracle(input: PiradsInput): number | null {
  if (input.zone === "") return null;
  if (input.zone === "pz") {
    if (input.dwi === null) return null;
    if (input.dwi === 3) return input.dce === "" ? null : input.dce === "positive" ? 4 : 3;
    return input.dwi;
  }
  // TZ
  if (input.t2w === null) return null;
  if (input.t2w === 1) return 1;
  if (input.t2w === 4) return 4;
  if (input.t2w === 5) return 5;
  if (input.dwi === null) return null;
  if (input.t2w === 2) return input.dwi >= 4 ? 3 : 2;
  return input.dwi === 5 ? 4 : 3; // t2w === 3
}

describe("fuzz invariants (10,000 random lesions)", () => {
  it("matches the independent oracle and holds structural invariants", () => {
    const rnd = mulberry32(0x9e37);
    const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
    const zones: ProstateZone[] = ["", "pz", "tz"];
    const scores: (number | null)[] = [null, 1, 2, 3, 4, 5];
    const dces: DceResult[] = ["", "negative", "positive", "unavailable"];

    for (let i = 0; i < 10000; i++) {
      const input: PiradsInput = {
        zone: pick(zones),
        t2w: pick(scores),
        dwi: pick(scores),
        dce: pick(dces),
      };
      const res = scorePirads(input);
      const expected = oracle(input);

      // A: engine agrees with the independent oracle.
      expect(res?.score ?? null).toBe(expected);

      if (res === null) continue;

      // B: a result is always a valid 1–5 category with non-empty text.
      expect(res.score).toBeGreaterThanOrEqual(1);
      expect(res.score).toBeLessThanOrEqual(5);
      expect(res.category).toBe(`PI-RADS ${res.score}`);
      expect(res.risk.length).toBeGreaterThan(0);
      expect(res.clinicalNote.length).toBeGreaterThan(0);

      // C: PI-RADS 5 only when the dominant sequence is 5.
      if (res.score === 5) {
        if (input.zone === "pz") expect(input.dwi).toBe(5);
        else expect(input.t2w).toBe(5);
      }
    }
  });
});
