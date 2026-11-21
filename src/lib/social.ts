/**
 * The public contact and social links, in display order.
 * One list for the About contact block, the site footer and the RADS footer,
 * so adding or retiring a channel happens in one place.
 */
export interface SocialLink {
  label: string;
  href: string;
  text: string;
  external: boolean;
}

export const CONTACT_EMAIL = "contact@aperivue.com";

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Email", href: `mailto:${CONTACT_EMAIL}`, text: CONTACT_EMAIL, external: false },
  { label: "GitHub", href: "https://github.com/aperivue", text: "github.com/aperivue", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/eugene8998/", text: "linkedin.com/in/eugene8998", external: true },
  { label: "Facebook", href: "https://www.facebook.com/eugene.nam3/", text: "facebook.com/eugene.nam3", external: true },
  { label: "Threads", href: "https://www.threads.com/@eugene8998", text: "threads.com/@eugene8998", external: true },
];

export const externalProps = { target: "_blank", rel: "noopener noreferrer" } as const;
