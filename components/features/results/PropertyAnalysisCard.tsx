import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { ManagementMode } from '@/models';

type Props = {
  lo: 'en' | 'ar';
  mgmtMode: ManagementMode;
  selectedPainPointsCount: number;
  hasUploadedPhotos: boolean;
  strengthsCount: number;
  issuesCount: number;
};

export function PropertyAnalysisCard({
  lo,
  mgmtMode,
  selectedPainPointsCount,
  hasUploadedPhotos,
  strengthsCount,
  issuesCount,
}: Props) {
  return (
    <Card className="w-full border-primary-200 bg-primary-50/50 shadow-xs">
      <CardHeader className="p-4 pb-1.5 pt-3">
        <CardTitle className="font-heading text-base font-semibold text-secondary-900">
          {lo === 'ar' ? 'توصية نمط الإدارة' : 'Your Property analysis'}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0 text-sm text-secondary-800">
        <div className="border-t border-secondary-200/80 pt-3" />
        <ul className="mt-2 list-disc space-y-1 ps-5">
          <li>
            {selectedPainPointsCount > 0
              ? mgmtMode === 'MANAGED'
                ? lo === 'ar'
                  ? 'سنركّز على هذه النقاط في خطتك ومع المشرف المخصص لك.'
                  : 'We will prioritize these pain points in your plan and onboarding.'
                : lo === 'ar'
                  ? 'بناءً على ما اخترته، التعاون في الإدارة أو DIY الكامل يعالجان أغلب هذه النقاط.'
                  : 'From what you selected, co-management or full DIY usually addresses these pain points.'
              : lo === 'ar'
                ? 'لا توجد نقاط تشغيلية حرجة مختارة حالياً؛ سنحافظ على خطة إدارة بسيطة وواضحة.'
                : 'No critical operational pain points selected yet, so we will keep your management plan simple and focused.'}
          </li>
          <li>
            {!hasUploadedPhotos
              ? lo === 'ar'
                ? 'تحليل الصور: لا توجد صور مرفوعة بعد؛ أضف صور الغرف لتحسين دقة التوصيات.'
                : 'Image analysis: no photos uploaded yet; add room photos to improve recommendation accuracy.'
              : strengthsCount === 0 && issuesCount === 0
                ? lo === 'ar'
                  ? 'تحليل الصور: جارٍ التحليل أو لا توجد ملاحظات مرئية كافية حالياً.'
                  : 'Image analysis: insights are pending or there are no notable visual findings yet.'
                : lo === 'ar'
                  ? `تحليل الصور: ${strengthsCount} نقاط قوة و${issuesCount} نقاط تحسين مرصودة.`
                  : `Image analysis: ${strengthsCount} strengths and ${issuesCount} improvement areas detected.`}
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

