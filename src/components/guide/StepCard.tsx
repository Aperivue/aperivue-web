"use client";

interface StepCardProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

export default function StepCard({ number, title, children }: StepCardProps) {
  return (
    <div className="relative rounded-2xl border border-border bg-surface p-6 md:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          {number}
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="mt-3 text-sm leading-relaxed text-foreground/70">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
