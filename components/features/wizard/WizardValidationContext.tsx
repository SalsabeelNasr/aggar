'use client';

import * as React from 'react';

export type WizardFieldErrors = Record<string, string>;

export const WizardValidationContext = React.createContext<{
  errors: WizardFieldErrors;
} | null>(null);

export function useWizardFieldError(fieldKey: string) {
  const ctx = React.useContext(WizardValidationContext);
  const error = ctx?.errors[fieldKey];
  return {
    error,
    invalid: Boolean(error),
    /** Merge with your base input classes */
    errorRingClassName: error ? 'border-red-500 focus:border-red-500' : '',
  };
}

export function WizardStepErrorBanner({ fieldKeys }: { fieldKeys: string[] }) {
  const ctx = React.useContext(WizardValidationContext);
  const messages = React.useMemo(() => {
    if (!ctx) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const k of fieldKeys) {
      const msg = ctx.errors[k];
      if (msg && !seen.has(msg)) {
        seen.add(msg);
        out.push(msg);
      }
    }
    return out;
  }, [ctx, fieldKeys]);

  if (!messages.length) return null;

  return (
    <div
      className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm font-medium"
      role="alert"
    >
      <ul className="list-disc ms-5 space-y-1">
        {messages.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
