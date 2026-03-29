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

export function WizardInlineFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-600 font-medium">{message}</p>;
}
