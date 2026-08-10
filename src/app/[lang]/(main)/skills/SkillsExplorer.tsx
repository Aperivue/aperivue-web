"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { orderedCategories } from "@/lib/skillCategories";

type Skill = {
  name: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  isNew?: boolean;
};

type Labels = {
  searchPlaceholder: string;
  filterAll: string;
  resultsNone: string;
  categoryLabels: Record<string, string>;
};

export function SkillsExplorer({
  lang,
  skills,
  labels,
}: {
  lang: string;
  skills: Skill[];
  labels: Labels;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const categories = useMemo(() => orderedCategories(skills), [skills]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((s) => {
      if (active && s.category !== active) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.features.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [skills, query, active]);

  const chip = (key: string | null, label: string) => {
    const on = active === key || (key === null && active === null);
    return (
      <button
        key={key ?? "all"}
        type="button"
        onClick={() => setActive(key)}
        aria-pressed={on}
        className={
          "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " +
          (on
            ? "border-primary bg-primary text-white"
            : "border-border bg-surface text-foreground/60 hover:bg-muted")
        }
      >
        {label}
      </button>
    );
  };

  return (
    <div className="mt-8">
      {/* Controls */}
      <div className="flex flex-col gap-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          aria-label={labels.searchPlaceholder}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
        />
        <div className="flex flex-wrap gap-2">
          {chip(null, labels.filterAll)}
          {categories.map((c) => chip(c, labels.categoryLabels[c] ?? c))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-foreground/50">
          {labels.resultsNone}
        </p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((skill) => (
            <Link
              key={skill.name}
              href={`/${lang}/skills/${skill.name}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold group-hover:text-primary">
                  {skill.title}
                </h3>
                <span className="rounded-full bg-accent/10 px-3 py-0.5 text-[10px] font-mono text-accent-text">
                  {skill.name}
                </span>
                {skill.isNew && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    NEW
                  </span>
                )}
              </div>
              <p className="mt-3 flex-1 break-words text-sm leading-relaxed text-foreground/70">
                {skill.description}
              </p>
              <ul className="mt-4 space-y-1.5">
                {skill.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-foreground/60"
                  >
                    <span className="mt-0.5 text-primary">&#x2713;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <span className="mt-5 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                {labels.categoryLabels[skill.category] ?? skill.category} &rarr;
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
