'use client';

import * as React from 'react';
import { useEvaluationStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DiyGuideCtaProps {
  lo: 'en' | 'ar';
}

export function DiyGuideCta({ lo }: DiyGuideCtaProps) {
  const { updateDiyGuideLead, diyGuideLead } = useEvaluationStore();
  const [name, setName] = React.useState(diyGuideLead?.fullName ?? '');
  const [email, setEmail] = React.useState(diyGuideLead?.email ?? '');
  const [phone, setPhone] = React.useState(diyGuideLead?.phone ?? '');
  const [submitted, setSubmitted] = React.useState(!!diyGuideLead);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    updateDiyGuideLead({
      fullName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      requestedAtISO: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  return (
    <div className="rounded-xl border border-secondary-200 bg-gradient-to-br from-secondary-50 to-white p-5 shadow-xs">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg bg-secondary-100 p-2.5">
          <BookOpen className="h-5 w-5 text-secondary-600" />
        </div>
        <div>
          <h3 className="font-heading text-base font-semibold text-secondary-900">
            {lo === 'ar' ? 'مش جاهز تستثمر؟ خد دليل DIY مجاني' : 'Not ready to invest? Get a free DIY guide'}
          </h3>
          <p className="text-sm text-secondary-600">
            {lo === 'ar'
              ? 'دليل عملي خطوة بخطوة لتجهيز عقارك بنفسك.'
              : 'A practical step-by-step guide to prepare your property yourself.'}
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {lo === 'ar'
            ? 'تم التسجيل! سنرسل لك الدليل قريباً.'
            : "You're registered! We'll send you the guide soon."}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={lo === 'ar' ? 'الاسم الكامل' : 'Full name'}
            required
            className="w-full rounded-lg border border-secondary-200 px-3 py-2.5 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={lo === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
            required
            className="w-full rounded-lg border border-secondary-200 px-3 py-2.5 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={lo === 'ar' ? 'رقم الهاتف' : 'Phone number'}
            required
            className="w-full rounded-lg border border-secondary-200 px-3 py-2.5 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
          <Button type="submit" variant="outline" className="w-full shadow-xs">
            {lo === 'ar' ? 'أرسل لي الدليل' : 'Send me the guide'}
          </Button>
        </form>
      )}
    </div>
  );
}
