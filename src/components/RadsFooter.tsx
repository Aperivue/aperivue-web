export default function RadsFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      {/* YouTube CTA Banner */}
      <div className="bg-gradient-to-r from-primary to-accent-text px-6 py-6 text-center text-white">
        <p className="text-sm font-semibold">
          Learn radiology with evidence-based video content
        </p>
        <a
          href="https://youtube.com/@scrubcode"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block rounded-full border border-white/30 px-5 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
        >
          Watch ScrubCode on YouTube &#9654;
        </a>
      </div>

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
