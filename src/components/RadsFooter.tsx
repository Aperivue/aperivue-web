import { SOCIAL_LINKS, externalProps } from "@/lib/social";

export default function RadsFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      {/* Info */}
      <div className="bg-muted px-6 py-6">
        <div className="mx-auto max-w-4xl space-y-4 text-xs text-foreground/50 leading-relaxed">
          {/* Disclaimer */}
          <p>
            <strong>Disclaimer:</strong> This tool is for educational and
            research purposes only. It is not a medical device and has not been
            cleared or approved by the FDA, KFDA/MFDS, or any regulatory
            authority. It is not intended for clinical diagnosis or treatment
            decisions. It does not replace professional medical judgment. Always
            correlate with clinical findings and institutional protocols.
          </p>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-2 border-t border-border pt-4 sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <a
                href="https://aperivue.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Aperivue
              </a>
              . All rights reserved.
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {SOCIAL_LINKS.filter((l) => l.label !== "Email").map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...externalProps}
                    className="hover:text-primary hover:underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-foreground/60">
              Powered by{" "}
              <a
                href="https://aperivue.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Aperivue
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
