"use client";

import { useState } from "react";

interface OsTabProps {
  mac: React.ReactNode;
  windows: React.ReactNode;
}

export default function OsTab({ mac, windows }: OsTabProps) {
  const [os, setOs] = useState<"mac" | "windows">("mac");

  return (
    <div>
      <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
        <button
          onClick={() => setOs("mac")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            os === "mac"
              ? "bg-surface text-foreground shadow-sm"
              : "text-foreground/50 hover:text-foreground/70"
          }`}
        >
          macOS
        </button>
        <button
          onClick={() => setOs("windows")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            os === "windows"
              ? "bg-surface text-foreground shadow-sm"
              : "text-foreground/50 hover:text-foreground/70"
          }`}
        >
          Windows
        </button>
      </div>
      <div className="mt-4">{os === "mac" ? mac : windows}</div>
    </div>
  );
}
