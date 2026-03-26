'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { PackageDefinition, ServiceLine } from '@/lib/engines/packageEngine';
import {
  IMPROVEMENT_CONVERSATION,
  SERVICE_CONVERSATION,
  improvementToServiceId,
} from '@/lib/results/pathRecommendationCopy';
import type { ScoreImprovementRow } from '@/lib/results/resultsStatic';
import { formatMoney } from './utils';

type Lo = 'en' | 'ar';

export type Compliance209Recommendation = {
  lines: string[];
  urgent: boolean;
  showAddLicensing: boolean;
};

export interface PathRecommendationsSectionProps {
  lo: Lo;
  locale: string;
  compliance209Recommendation: Compliance209Recommendation | null;
  contextualImprovements: ScoreImprovementRow[];
  pkg: PackageDefinition;
  enabledServiceIds: string[];
  setEnabledServiceIds: React.Dispatch<React.SetStateAction<string[]>>;
  tier1InPlan: ServiceLine[];
  tier2InPlan: ServiceLine[];
  tier1OutOfPlan: ServiceLine[];
  tier2OutOfPlan: ServiceLine[];
  hasPhotoOutOfPlan: boolean;
  adjustedOptimizedNet: number;
  revenueOptimizedNet: number;
  resetPlan: () => void;
  addServiceToPlan: (id: string) => void;
  renderServiceRow: (s: ServiceLine, opts?: { lead?: { en: string; ar: string } }) => React.ReactNode;
  /** Shorter header when the parent already showed a conversational intro. */
  introSize?: 'full' | 'minimal';
}

export function PathRecommendationsSection({
  lo,
  locale,
  compliance209Recommendation,
  contextualImprovements,
  pkg,
  enabledServiceIds,
  setEnabledServiceIds,
  tier1InPlan,
  tier2InPlan,
  tier1OutOfPlan,
  tier2OutOfPlan,
  hasPhotoOutOfPlan,
  adjustedOptimizedNet,
  revenueOptimizedNet,
  resetPlan,
  addServiceToPlan,
  renderServiceRow,
  introSize = 'full',
}: PathRecommendationsSectionProps) {
  const linkedServiceIds = React.useMemo(() => {
    const set = new Set<string>();
    for (const row of contextualImprovements) {
      const sid = improvementToServiceId(row.id, pkg);
      if (sid) set.add(sid);
    }
    return set;
  }, [contextualImprovements, pkg]);

  const otherInPlan = React.useMemo(() => {
    const all = [...tier1InPlan, ...tier2InPlan];
    return all.filter((s) => !linkedServiceIds.has(s.id));
  }, [tier1InPlan, tier2InPlan, linkedServiceIds]);

  const otherOutOfPlan = React.useMemo(() => {
    return [...tier1OutOfPlan, ...tier2OutOfPlan].filter((s) => !linkedServiceIds.has(s.id));
  }, [tier1OutOfPlan, tier2OutOfPlan, linkedServiceIds]);

  const renderImprovementBlock = (row: ScoreImprovementRow) => {
    const copy = IMPROVEMENT_CONVERSATION[row.id];
    const serviceId = improvementToServiceId(row.id, pkg);
    const service = serviceId ? pkg.services.find((s) => s.id === serviceId) : undefined;

    return (
      <div
        key={row.id}
        className="rounded-xl border border-primary-200/60 bg-gradient-to-b from-primary-50/40 to-white p-4 shadow-xs md:p-5"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-3">
          <h4 className="text-base font-semibold text-secondary-900">{row.title[lo]}</h4>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-primary-100 px-3 py-1 text-primary-900">
              {lo === 'ar' ? 'النقاط: ' : 'Score: '}
              {row.scoreGain[lo]}
            </span>
            <span className="rounded-full border border-secondary-200 bg-white px-3 py-1 text-secondary-700">{row.cost[lo]}</span>
          </div>
        </div>
        {copy && <p className="mt-3 text-sm leading-relaxed text-secondary-700">{copy[lo]}</p>}
        {service && (
          <div className="mt-4 border-t border-primary-100 pt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-secondary-500">
              {lo === 'ar' ? 'في عرض السعر' : 'In your quote'}
            </p>
            {renderServiceRow(service)}
          </div>
        )}
      </div>
    );
  };

  const renderLinkedOutOfPlanChips = () => {
    const chips: ServiceLine[] = [];
    const seen = new Set<string>();
    for (const row of contextualImprovements) {
      const sid = improvementToServiceId(row.id, pkg);
      if (!sid || seen.has(sid) || enabledServiceIds.includes(sid)) continue;
      const s = pkg.services.find((x) => x.id === sid);
      if (s) {
        seen.add(sid);
        chips.push(s);
      }
    }
    if (chips.length === 0) return null;
    return (
      <div className="mb-3 flex flex-wrap gap-2">
        {chips.map((s) => (
          <Button
            key={s.id}
            type="button"
            variant="outline"
            size="sm"
            className="shadow-xs"
            onClick={() => addServiceToPlan(s.id)}
          >
            {lo === 'ar' ? `+ ${s.name.ar}` : `+ ${s.name.en}`}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        {introSize === 'minimal' ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-secondary-600">
              {lo === 'ar'
                ? 'فعّل أو أوقف البنود أدناه — التكاليف والصافي يتحدثان فوراً.'
                : 'Toggle line items below — costs and net update instantly.'}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={resetPlan} className="w-full shrink-0 shadow-xs sm:w-auto">
              {lo === 'ar' ? 'إعادة التوصيات' : 'Reset to recommended'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <h3 className="text-base font-semibold text-secondary-900">
                {lo === 'ar' ? 'خطة التحسين والخدمات' : 'Your upgrade path & plan'}
              </h3>
              <p className="text-sm leading-relaxed text-secondary-600">
                {lo === 'ar'
                  ? 'التحسينات المرتبطة بالنقاط، بنود عرض السعر، وإضافات اختيارية — كل بند يوضح التكلفة والأثر.'
                  : 'Score-linked upgrades, quote lines, and optional add-ons — each shows fee and impact.'}
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={resetPlan} className="w-full shrink-0 shadow-xs sm:w-auto">
              {lo === 'ar' ? 'إعادة التوصيات' : 'Reset to recommended'}
            </Button>
          </div>
        )}
      </div>

      {compliance209Recommendation && (
        <div
          className={cn(
            'rounded-xl border p-4 shadow-xs md:p-5',
            compliance209Recommendation.urgent
              ? 'border-amber-200 bg-amber-50/90'
              : 'border-sky-200/80 bg-sky-50/50'
          )}
        >
          <h4 className="text-xs font-semibold uppercase tracking-wide text-secondary-600">
            {lo === 'ar' ? 'الامتثال (قرار ٢٠٩)' : 'Compliance (Decree 209)'}
          </h4>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-secondary-800">
            {compliance209Recommendation.lines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          {compliance209Recommendation.showAddLicensing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 shadow-xs"
              onClick={() => addServiceToPlan('licensing')}
            >
              {lo === 'ar' ? '+ ترخيص STR (قرار ٢٠٩)' : '+ STR licensing (Decree 209)'}
            </Button>
          )}
        </div>
      )}

      {introSize === 'full' && contextualImprovements.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">
            {lo === 'ar' ? 'أولويات ترفع النقاط' : 'Score priorities'}
          </p>
          <div className="space-y-4">{contextualImprovements.map(renderImprovementBlock)}</div>
        </div>
      )}

      {otherInPlan.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">
            {lo === 'ar' ? 'باقي بنود خطتك' : 'Rest of your plan'}
          </p>
          <p className="text-sm leading-relaxed text-secondary-600">
            {lo === 'ar'
              ? 'هذه البنود جزء من مسارك؛ سطر «لماذا» يوضح دورها بجانب التسعير.'
              : 'These stay on your path; the “why” line spells out their role next to pricing.'}
          </p>
          <div className="space-y-3">
            {otherInPlan.map((s) => renderServiceRow(s, { lead: SERVICE_CONVERSATION[s.id] }))}
          </div>
        </div>
      )}

      {introSize === 'full' &&
        tier1InPlan.length === 0 &&
        tier2InPlan.length === 0 &&
        contextualImprovements.length === 0 && (
        <p className="rounded-xl border border-dashed border-secondary-300 bg-white/60 p-4 text-sm text-secondary-600">
          {lo === 'ar'
            ? 'لا توجد خدمات في خطتك — أضف من القائمة أدناه.'
            : 'Nothing in your plan yet — add services from the list below.'}
        </p>
      )}

      {(tier1OutOfPlan.length > 0 || tier2OutOfPlan.length > 0) && (
        <div className="rounded-xl border border-dashed border-secondary-300 bg-secondary-50/50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-secondary-900">
            {lo === 'ar' ? 'غير مضمّن في خطتك' : 'Not in your plan'}
          </h3>
          <p className="mb-3 text-sm text-secondary-600">
            {lo === 'ar' ? 'أضف أي بند إلى الخطة عند الحاجة.' : 'Add any line back to your plan when you want it.'}
          </p>
          {renderLinkedOutOfPlanChips()}
          {hasPhotoOutOfPlan && (
            <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {lo === 'ar'
                ? `بدون تصوير احترافي نمذجنا يخفّض الحجز ~١٥٪ والصافي ~${formatMoney(revenueOptimizedNet - adjustedOptimizedNet, locale)} ج.م/شهر.`
                : `Without pro photos our model cuts bookings ~15% and net ~${formatMoney(revenueOptimizedNet - adjustedOptimizedNet, locale)} EGP/mo.`}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {otherOutOfPlan.map((s) => (
              <Button
                key={s.id}
                type="button"
                variant="outline"
                size="sm"
                className="shadow-xs"
                onClick={() => addServiceToPlan(s.id)}
              >
                {lo === 'ar' ? `+ ${s.name.ar}` : `+ ${s.name.en}`}
              </Button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
