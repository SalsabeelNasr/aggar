'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import type { FurnishedPhotoChecklistId } from '@/models';
import { cn } from '@/lib/utils';
import { UploadCloud } from 'lucide-react';
import { WizardInlineFieldError, useWizardFieldError } from '@/components/features/wizard/WizardValidationContext';

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
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900">
          {isAr ? 'ممكن ترفع صور للعقار عشان نحللها بالذكاء الاصطناعي؟' : 'Upload photos of the property for AI analysis?'}
        </h2>
      </div>

      {showFurnishedChecklist && (
        <div className="mb-10 bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm">
          <div className="font-heading font-bold text-secondary-900 mb-3">
            {isAr ? 'هل عندك صور للحاجات دي؟' : 'Do you have photos for:'}
          </div>
          <p className="text-secondary-600 text-sm mb-4">
            {isAr
              ? 'ارفع صور بتوضح جودة الفرش والتفاصيل المهمة للضيوف.'
              : 'Help us with shots that clearly show quality and compliance.'}
          </p>
          <div
            data-wizard-field="furnishedPhotoChecklist"
            className={cn(
              'grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl p-2 -mx-1',
              checklistErr.invalid && 'border-2 border-red-500'
            )}
          >
            {(
              [
                {
                  id: 'balcony_window_view' as const,
                  en: 'View from balcony/window',
                  ar: 'الإطلالة من البلكونة أو الشباك',
                },
                {
                  id: 'kitchen_cabinets_cleanliness_proof' as const,
                  en: 'Inside kitchen cabinets (cleanliness proof)',
                  ar: 'دواليب المطبخ من جوه (إثبات نظافة)',
                },
                {
                  id: 'mattress_pillows_hotel_tuck' as const,
                  en: 'Close-up of mattress & pillows (Hotel-style tuck)',
                  ar: 'صورة قريبة للمرتبة والمخدات (فرش فندقي)',
                },
                {
                  id: 'smart_lock_keyless_entry' as const,
                  en: 'Smart Lock / Keyless Entry point',
                  ar: 'القفل الذكي أو مكان الدخول',
                },
                {
                  id: 'wifi_speed_screenshot_or_router' as const,
                  en: 'Wi-Fi Speed Test Screenshot or router photo',
                  ar: 'صورة لسرعة الواي فاي أو الراوتر',
                },
                {
                  id: 'fire_safety_smoke_detectors' as const,
                  en: 'Fire Safety Kit / Smoke Detectors',
                  ar: 'أدوات السلامة أو كاشف الدخان',
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
          <WizardInlineFieldError message={checklistErr.error} />
        </div>
      )}

      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center bg-white relative transition-colors hover:border-primary-400',
          photoErr.invalid ? 'border-red-400' : 'border-secondary-300'
        )}
      >
        <div className="flex flex-col items-center">
          <UploadCloud className="w-12 h-12 text-secondary-400 mb-4" />
          <p className="font-heading font-bold text-secondary-900 mb-1">
            {isAr ? 'ارفع من 5 لـ 10 صور (مطلوب)' : 'Upload 5–10 photos (required)'}
          </p>
          <p className="text-secondary-500 text-sm mb-4">
            {isAr ? 'صور الصالة، أوضة النوم، المطبخ، الحمام، والبلكونة.' : 'Living room, bedroom, kitchen, bathroom, balcony/view.'}
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
            data-wizard-field="photoUpload"
            htmlFor={fileInputId}
            className={cn(
              'px-6 py-2 font-medium rounded-lg transition-colors cursor-pointer inline-block border-2',
              photoErr.invalid
                ? 'bg-red-50 border-red-500 text-red-900'
                : 'bg-secondary-100 border-transparent text-secondary-900 hover:bg-secondary-200'
            )}
          >
            {isAr ? 'اختار الصور من جهازك' : 'Browse Files'}
          </label>

          <p className="mt-4 text-sm text-secondary-600">
            {uploadedCount > 0
              ? isAr
                ? `تم اختيار ${uploadedCount} صورة.`
                : `${uploadedCount} photo(s) selected.`
              : isAr
                ? 'لسه مفيش صور مختارة.'
                : 'No photos selected yet.'}
          </p>
          <WizardInlineFieldError message={photoErr.error} />
        </div>
      </div>
    </div>
  );
}
