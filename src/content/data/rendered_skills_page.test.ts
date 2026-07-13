import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import counts from "./catalog_counts.snapshot.json";

/**
 * Gate the RENDERED page, not the dictionary.
 *
 * The dictionary gate passed while the live site still said "Requires Claude Code Desktop or
 * CLI" — because that sentence was hardcoded in JSX, split across an anchor tag, and the page
 * never read the dictionary key at all. A test that checks the copy a component is *supposed*
 * to use cannot see a component that uses something else. This one reads the built HTML.
 *
 * It runs only when `.next` exists (i.e. after `npm run build`), so `npm test` on a clean
 * checkout is not blocked; CI and the pre-deploy build both produce it.
 */
const PAGES = ["en", "ko"].map((lang) => ({
  lang,
  path: resolve(__dirname, `../../../.next/server/app/${lang}/skills.html`),
}));

const strip = (html: string) =>
  html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");

const built = PAGES.filter((p) => existsSync(p.path));

describe.skipIf(built.length === 0)("rendered skills page (built HTML)", () => {
  for (const { lang, path } of built) {
    const text = strip(readFileSync(path, "utf8"));

    it(`${lang}: names every host the installer supports`, () => {
      for (const host of ["Claude Code", "Codex", "Cursor", "Copilot"]) {
        expect(text, `${lang}: rendered page omits ${host}`).toContain(host);
      }
    });

    it(`${lang}: does not claim Claude Code is a requirement`, () => {
      // the exact sentence that survived a dictionary-only gate
      expect(text).not.toContain("Requires Claude Code Desktop");
      expect(text).not.toMatch(/Requires\s+Claude Code/);
    });

    it(`${lang}: shows the verification layer and its detector count`, () => {
      expect(text).toContain("MedSci-Audit");
      expect(text, `${lang}: rendered page omits the detector count`).toContain(
        String(counts.integrity_detectors),
      );
    });
  }
});
