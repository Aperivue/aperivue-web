/**
 * Server-rendered, indexable criteria block for a RADS calculator page.
 * Renders one assessment system (categories table + key decision rules) so it
 * is present in the prerendered HTML for search and AI citation.
 *
 * Multi-system calculators (e.g. O-RADS US + MRI) render this once per system.
 */

export type CriteriaRow = {
  category: string;
  risk: string;
  management: string;
};

export type CriteriaContent = {
  heading: string;
  caption?: string;
  columnLabels: { category: string; risk: string; management: string };
  categories: readonly CriteriaRow[];
  rulesHeading: string;
  rules: readonly string[];
};

export default function CriteriaSection({ content }: { content: CriteriaContent }) {
  return (
    <section className="mt-10 rounded-xl border border-border p-5">
      <h2 className="text-lg font-semibold tracking-tight">{content.heading}</h2>
      {content.caption && (
        <p className="mt-1 text-xs text-foreground/50">{content.caption}</p>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-foreground/50">
              <th scope="col" className="py-2 pr-4 font-medium">{content.columnLabels.category}</th>
              <th scope="col" className="py-2 pr-4 font-medium">{content.columnLabels.risk}</th>
              <th scope="col" className="py-2 font-medium">{content.columnLabels.management}</th>
            </tr>
          </thead>
          <tbody>
            {content.categories.map((row) => (
              <tr key={row.category} className="border-b border-border/60 align-top">
                <th scope="row" className="py-2 pr-4 font-semibold whitespace-nowrap">{row.category}</th>
                <td className="py-2 pr-4 text-foreground/70 whitespace-nowrap">{row.risk}</td>
                <td className="py-2 text-foreground/70">{row.management}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-5 text-sm font-semibold">{content.rulesHeading}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/70">
        {content.rules.map((rule, i) => (
          <li key={i}>{rule}</li>
        ))}
      </ul>
    </section>
  );
}
