"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

/**
 * Label + control helpers that own a stable `useId()` so the <label htmlFor>
 * always matches the control `id`. Each helper calls the hook once at its own
 * top level, so they are safe to render conditionally / in lists where calling
 * useId() directly would violate the Rules of Hooks.
 */

const LABEL_CLS = "mb-1 block text-xs font-medium text-foreground/60";
const CONTROL_CLS =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm";

export function LabeledInput({
  label,
  className,
  wrapperClassName,
  ...rest
}: { label: ReactNode; wrapperClassName?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className={LABEL_CLS}>
        {label}
      </label>
      <input id={id} className={className ?? CONTROL_CLS} {...rest} />
    </div>
  );
}

export function LabeledSelect({
  label,
  className,
  wrapperClassName,
  children,
  ...rest
}: { label: ReactNode; wrapperClassName?: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className={LABEL_CLS}>
        {label}
      </label>
      <select id={id} className={className ?? CONTROL_CLS} {...rest}>
        {children}
      </select>
    </div>
  );
}

export function LabeledTextarea({
  label,
  className,
  wrapperClassName,
  ...rest
}: { label: ReactNode; wrapperClassName?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className={LABEL_CLS}>
        {label}
      </label>
      <textarea id={id} className={className ?? CONTROL_CLS} {...rest} />
    </div>
  );
}
