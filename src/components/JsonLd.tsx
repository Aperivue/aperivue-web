/**
 * Renders a JSON-LD structured-data script. `<` is escaped to `<` to keep
 * the inline script XSS-safe.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
