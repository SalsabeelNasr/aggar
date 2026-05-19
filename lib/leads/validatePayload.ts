import { z } from 'zod';
import type { LeadSubmitPayload } from '@/lib/leads/types';

const localeSchema = z.enum(['en', 'ar']);

const partnerSchema = z.object({
  type: z.literal('partner'),
  locale: localeSchema,
  partner: z.object({
    companyName: z.string().min(1),
    primaryService: z.string().min(1),
    operatingZones: z.string().min(1),
    portfolioUrl: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
  }),
});

const evaluationSchema = z.object({
  type: z.literal('evaluation'),
  locale: localeSchema,
  lead: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    whatsapp: z.string().min(1),
    preferredContactTime: z.enum(['morning', 'afternoon', 'evening']),
    consentToPartnerNetwork: z.boolean(),
    submittedAtISO: z.string().optional(),
  }),
  wizard: z.record(z.unknown()),
  reportId: z.string().nullable().optional(),
});

const diySchema = z.object({
  type: z.literal('diy_guide'),
  locale: localeSchema,
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
});

const leadPayloadSchema = z.discriminatedUnion('type', [partnerSchema, evaluationSchema, diySchema]);

export function parseLeadPayload(body: unknown): LeadSubmitPayload | null {
  const parsed = leadPayloadSchema.safeParse(body);
  if (!parsed.success) return null;
  return parsed.data as LeadSubmitPayload;
}
