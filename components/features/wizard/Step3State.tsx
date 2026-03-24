'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useEvaluationStore } from '@/lib/store';
import { PropertyState } from '@/models';
import { cn } from '@/lib/utils';
import { Hammer, PaintRoller, Sofa, UploadCloud, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const states: { id: PropertyState; icon: any; ar: string; en: string; descEn: string; descAr: string }[] = [
  { id: 'shell_core', icon: Hammer, ar: 'على المحارة (طوب)', en: 'Shell & Core', descEn: 'Unfinished, needs full contracting.', descAr: 'يحتاج تشطيب وتأسيس كامل.' },
  { id: 'finished_empty', icon: PaintRoller, ar: 'نصف تشطيب / فاضي', en: 'Finished but Empty', descEn: 'Floors/walls done, needs furniture.', descAr: 'تشطيب كامل، جاهز للفرش.' },
  { id: 'fully_furnished', icon: Sofa, ar: 'مفروش بالكامل', en: 'Fully Furnished', descEn: 'Ready for guests.', descAr: 'جاهز للاستقبال فورا.' },
];

export function Step3State() {
  const locale = useLocale();
  const { data, updateData } = useEvaluationStore();
  const [isUploading, setIsUploading] = React.useState(false);
  const [isAnalyzed, setIsAnalyzed] = React.useState(data.mockedImageSignals!.length > 0);

  const handleUpload = () => {
    setIsUploading(true);
    // Mock upload and AI analysis delay
    setTimeout(() => {
      setIsUploading(false);
      setIsAnalyzed(true);
      updateData({ mockedImageSignals: ['natural_light', 'view_potential'] });
    }, 2500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-3">
          {locale === 'ar' ? 'ما هي حالة العقار الحالية؟' : 'What is the current state?'}
        </h2>
        <p className="text-secondary-600">
          {locale === 'ar' ? 'حدد الجاهزية وارفع صورة للتقييم الذكي.' : 'Select readiness and upload a photo for AI analysis.'}
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-10">
        {states.map((state) => {
          const isSelected = data.state === state.id;
          return (
            <button
              key={state.id}
              onClick={() => updateData({ state: state.id })}
              className={cn(
                'flex items-center p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none text-start',
                isSelected 
                  ? 'border-primary-600 bg-primary-50 shadow-sm' 
                  : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-secondary-50'
              )}
            >
              <div className={cn("p-3 rounded-lg mr-4 ml-4", isSelected ? "bg-primary-600 text-white" : "bg-secondary-100 text-secondary-600")}>
                <state.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className={cn("font-heading font-bold text-lg", isSelected ? "text-primary-900" : "text-secondary-900")}>
                  {locale === 'ar' ? state.ar : state.en}
                </h3>
                <p className="text-secondary-500 text-sm mt-1">{locale === 'ar' ? state.descAr : state.descEn}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mock Photo Upload UI */}
      <div className="border-2 border-dashed border-secondary-300 rounded-xl p-8 text-center bg-white relative overflow-hidden transition-colors hover:border-primary-400">
        <AnimatePresence mode="wait">
          {!isUploading && !isAnalyzed && (
            <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <UploadCloud className="w-12 h-12 text-secondary-400 mb-4" />
              <p className="font-heading font-bold text-secondary-900 mb-1">
                {locale === 'ar' ? 'ارفع صور العقار (اختياري)' : 'Upload photos (Optional)'}
              </p>
              <p className="text-secondary-500 text-sm mb-4">
                {locale === 'ar' ? 'احصل على تحليل بصري للتسعير.' : 'Get visual pricing insights.'}
              </p>
              <button onClick={handleUpload} className="px-6 py-2 bg-secondary-100 font-medium text-secondary-900 rounded-lg hover:bg-secondary-200 transition-colors">
                {locale === 'ar' ? 'تصفح الملفات' : 'Browse Files'}
              </button>
            </motion.div>
          )}

          {isUploading && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-4">
              <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
              <p className="font-heading font-bold text-primary-900">
                {locale === 'ar' ? 'جارِ تحليل الصور بذكاء...' : 'Running AI visual analysis...'}
              </p>
              <div className="w-full max-w-xs h-2 bg-secondary-100 rounded-full mt-4 overflow-hidden">
                <motion.div 
                  className="h-full bg-primary-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}

          {isAnalyzed && !isUploading && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="font-heading font-bold text-green-900 text-lg">
                {locale === 'ar' ? 'تم الرفع والتحليل!' : 'Photos analyzed successfully!'}
              </p>
              <p className="text-secondary-600 text-sm mt-2">
                {locale === 'ar' ? 'وجدنا بعض الإمكانيات الإضافية لرفع السعر.' : 'We found some positive pricing signals.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
