/**
 * Lightweight GA4 event wrapper.
 *
 * Pageview tracking is configured in the root layout (gtag `config`). This file
 * adds custom events for *actual tool usage* — so we can measure adoption
 * (structured reports generated per RADS system), not just page visits.
 *
 * Safe no-op during SSR or when gtag is unavailable (ad blockers, consent off).
 */

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "set",
      targetOrName: string,
      params?: GtagParams,
    ) => void;
  }
}

/** Send a GA4 custom event. */
export function trackEvent(name: string, params?: GtagParams): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/**
 * RADS calculator usage signal — fired when a user copies a generated report.
 * Copying the report is the strongest "the tool was actually used" event, far
 * more meaningful than a pageview for measuring clinical adoption.
 *
 * @param radsType registry slug (tirads, birads, lungrads, lirads, pirads, orads)
 * @param variant  "full" report vs "impression"-only copy
 */
export function trackRadsReportCopied(
  radsType: string,
  variant: "full" | "impression" = "full",
): void {
  trackEvent("rads_report_copied", { rads_type: radsType, variant });
}
