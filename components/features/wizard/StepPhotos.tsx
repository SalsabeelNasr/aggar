'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type { FurnishedPhotoChecklistId } from '@/models';
import { cn } from '@/lib/utils';
import { UploadCloud } from 'lucide-react';
import { WizardStepErrorBanner, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

function toggleId<T extends string>(list: T[] | undefined, id: T): T[] {
  const current = new Set(list ?? []);
  if (current.has(id)) current.delete(id);
  else current.add(id);
  return Array.from(current);
}

export function StepPhotos() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const photoErr = useWizardFieldError('photoUpload');
  const checklistErr = useWizardFieldError('furnishedPhotoChecklist');

  const isAr = locale === 'ar';
  const selectedState = data.stateFlag;
  const showFurnishedChecklist = selectedState === 'FURNISHED';

  const fileInputId = 'wizard-photo-upload';
  const uploadedCount = data.photoUpload?.files?.length ?? 0;

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length < 1) return;
    const items = Array.from(files).map((f) => ({
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${f.name}-${f.size}-${f.lastModified}`,
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    updateData({
      photoUpload: {
        ...data.photoUpload,
        files: items,
        aiSignals: [],
        aiSummary: undefined,
      },
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <WizardStepErrorBanner fieldKeys={['photoUpload', 'furnishedPhotoChecklist']} />
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {isAr ? 'هل يمكنك رفع صور للعقار لتحليل الذكاء الاصطناعي؟' : 'Upload photos of the property for AI analysis?'}
        </h2>
      </div>

      {showFurnishedChecklist && (
        <div
          className={cn(
            'mb-10 bg-white border rounded-2xl p-6 shadow-sm',
            checklistErr.invalid ? 'border-red-500 border-2' : 'border-secondary-200'
          )}
        >
          <div className="font-heading font-bold text-secondary-900 mb-3">
            {isAr ? 'هل لديك صور لـ ما يلي؟' : 'Do you have photos for:'}
          </div>
          <p className="text-secondary-600 text-sm mb-4">
            {isAr
              ? 'ساعدنا برفع لقطات تكشف الجودة والامتثال بوضوح.'
              : 'Help us with shots that clearly show quality and compliance.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(
              [
                {
                  id: 'balcony_window_view' as const,
                  en: 'View from balcony/window',
                  ar: 'الإطلالة من البلكونة / الشباك',
                },
                {
                  id: 'kitchen_cabinets_cleanliness_proof' as const,
                  en: 'Inside kitchen cabinets (cleanliness proof)',
                  ar: 'داخل خزائن المطبخ (إثبات النظافة)',
                },
                {
                  id: 'mattress_pillows_hotel_tuck' as const,
                  en: 'Close-up of mattress & pillows (Hotel-style tuck)',
                  ar: 'لقطة قريبة للمرتبة والمخدات (طيّ فندقي)',
                },
                {
                  id: 'smart_lock_keyless_entry' as const,
                  en: 'Smart Lock / Keyless Entry point',
                  ar: 'قفل ذكي / نقطة دخول بدون مفتاح',
                },
                {
                  id: 'wifi_speed_screenshot_or_router' as const,
                  en: 'Wi-Fi Speed Test Screenshot or router photo',
                  ar: 'لقطة شاشة لاختبار سرعة الواي فاي أو صورة الراوتر',
                },
                {
                  id: 'fire_safety_smoke_detectors' as const,
                  en: 'Fire Safety Kit / Smoke Detectors',
                  ar: 'طقم السلامة من الحرائق / كاشفات الدخان',
                },
              ] satisfies { id: FurnishedPhotoChecklistId; en: string; ar: string }[]
            ).map((opt) => {
              const selected = (data.furnishedPhotoChecklist ?? []).includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer text-start',
                    selected ? 'border-primary-600 bg-primary-50' : 'border-secondary-200'
                  )}
                >
                  <input
                    type="checkbox"
                    className="accent-primary-600 mt-1"
                    checked={selected}
                    onChange={() =>
                      updateData({
                        furnishedPhotoChecklist: toggleId(data.furnishedPhotoChecklist, opt.id),
                      })
                    }
                  />
                  <span className="text-base font-medium">{isAr ? opt.ar : opt.en}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center bg-white relative overflow-hidden transition-colors hover:border-primary-400',
          photoErr.invalid ? 'border-red-400' : 'border-secondary-300'
        )}
      >
        <div className="flex flex-col items-center">
          <UploadCloud className="w-12 h-12 text-secondary-400 mb-4" />
          <p className="font-heading font-bold text-secondary-900 mb-1">
            {isAr ? 'ارفع 5–10 صور (مطلوب)' : 'Upload 5–10 photos (required)'}
          </p>
          <p className="text-secondary-500 text-sm mb-4">
            {isAr ? 'صور الصالة/غرفة النوم/المطبخ/الحمام/البلكونة.' : 'Living room, bedroom, kitchen, bathroom, balcony/view.'}
          </p>

          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
          <label
            htmlFor={fileInputId}
            className="px-6 py-2 bg-secondary-100 font-medium text-secondary-900 rounded-lg hover:bg-secondary-200 transition-colors cursor-pointer"
          >
            {isAr ? 'تصفح الملفات' : 'Browse Files'}
          </label>

          <p className="mt-4 text-sm text-secondary-600">
            {uploadedCount > 0
              ? isAr
                ? `تم اختيار ${uploadedCount} صورة.`
                : `${uploadedCount} photo(s) selected.`
              : isAr
                ? 'لم يتم اختيار صور بعد.'
                : 'No photos selected yet.'}
          </p>
        </div>
      </div>
    </div>
  );
}
