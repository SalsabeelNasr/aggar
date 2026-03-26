'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/** Same surface as {@link WizardDetailCard} — use for a single control instead of nesting another card. */
export const wizardDetailSurfaceClassName =
  'bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm';

/** Outer card for wizard detail sections (state details step). */
export function WizardDetailCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(wizardDetailSurfaceClassName, className)}>
      {children}
    </div>
  );
}

export const wizardDetailSelectClassName =
  'border-2 border-secondary-200 rounded-lg p-3 bg-white w-full focus:border-primary-500 outline-none';

/** Section title; use with optional {@link WizardDetailLead} (often pass `className="mb-1"` before lead text). */
export function WizardDetailHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('font-heading font-bold text-secondary-900 block mb-3', className)}>{children}</div>
  );
}

/** Optional helper under a heading (mb-4 when followed by controls). */
export function WizardDetailLead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-secondary-600 text-sm mb-4', className)}>{children}</p>;
}

export function WizardDetailSelect({
  id,
  label,
  value,
  onChange,
  children,
  className,
}: {
  id?: string;
  label: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      {label != null && (
        <label htmlFor={id} className="font-heading font-bold text-secondary-900 block mb-3">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(wizardDetailSelectClassName, className)}
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
    </>
  );
}

type ChipOpt = { id: string; label: string };

/** Multi-select chip buttons (infrastructure, furnishing scope, smart home luxe, etc.). */
export function WizardDetailChipGrid({
  options,
  selectedIds,
  onToggle,
  columnsClassName,
  fullWidth,
  variant = 'chip',
}: {
  options: ChipOpt[];
  selectedIds: string[] | undefined;
  onToggle: (id: string) => void;
  /** Chip layout only; defaults to two columns from `sm`. For `choiceRow`, only optional extra classes (stack is always one per row). */
  columnsClassName?: string;
  fullWidth?: boolean;
  /** Same row sizing / borders as {@link WizardDetailRadioList} (checkbox for multi-select). */
  variant?: 'chip' | 'choiceRow';
}) {
  const set = new Set(selectedIds ?? []);
  const chipColumnsClass = columnsClassName ?? 'grid grid-cols-1 sm:grid-cols-2 gap-3';

  if (variant === 'choiceRow') {
    return (
      <div className={cn('flex w-full flex-col gap-2', columnsClassName)}>
        {options.map((opt) => {
          const selected = set.has(opt.id);
          return (
            <label
              key={opt.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer text-start transition-colors',
                fullWidth && 'w-full',
                selected
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-secondary-200 bg-white hover:border-primary-300'
              )}
            >
              <input
                type="checkbox"
                className="accent-primary-600 mt-1 shrink-0"
                checked={selected}
                onChange={() => onToggle(opt.id)}
              />
              <span className="text-base font-medium text-secondary-900">{opt.label}</span>
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <div className={chipColumnsClass}>
      {options.map((opt) => {
        const selected = set.has(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onToggle(opt.id)}
            className={cn(
              'px-3 py-2 rounded-xl border text-sm font-semibold text-start',
              fullWidth && 'w-full',
              selected
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white border-secondary-200 text-secondary-800 hover:border-primary-300'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

type RadioOpt = { id: string; label: string };

/** Single-select radio rows with consistent selected / hover states. */
export function WizardDetailRadioList({
  name,
  options,
  value,
  onSelect,
  className,
}: {
  name: string;
  options: RadioOpt[];
  value: string | undefined;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {options.map((opt) => {
        const checked = value === opt.id;
        return (
          <label
            key={opt.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors',
              checked
                ? 'border-primary-600 bg-primary-50'
                : 'border-secondary-200 hover:border-primary-300'
            )}
          >
            <input
              type="radio"
              name={name}
              className="accent-primary-600"
              checked={checked}
              onChange={() => onSelect(opt.id)}
            />
            <span className="text-base font-medium text-secondary-900">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}
