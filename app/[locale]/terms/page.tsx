import type { Metadata } from 'next';
import type { ReactNode } from 'react';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isAr = params.locale === 'ar';
  return {
    title: isAr ? 'شروط الاستخدام | عقار' : 'Terms of Use | Aggar',
    description: isAr
      ? 'شروط استخدام منصة عقار والموافقة على معالجة البيانات.'
      : 'Terms of use for the Aggar platform and consent to data processing.',
  };
};

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-heading font-bold text-secondary-900 mb-3">{title}</h2>
      <ul className="list-disc pl-6 space-y-2 text-secondary-700 text-sm md:text-base leading-relaxed">
        {children}
      </ul>
    </section>
  );
}

export default function TermsPage({ params }: Props) {
  const isAr = params.locale === 'ar';

  if (isAr) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-secondary-900 mb-4">
          شروط الاستخدام
        </h1>
        <p className="text-secondary-600 mb-10 leading-relaxed">
          تاريخ السريان: بمجرد استخدامك للموقع أو التطبيق أو أي خدمة مرتبطة بـ «عقار»، فإنك تقر
          بقراءة هذه الشروط والموافقة عليها بالكامل دون قيد أو شرط، بما في ذلك ما يتعلق
          بجمع بياناتك ومعالجتها واستخدامها كما هو منصوص عليه أدناه.
        </p>

        <Section title="القبول والتفعيل">
          <>
            <li>يشكل أي وصول إلى الخدمة أو استخدامها قبولاً ملزماً لهذه الشروط.</li>
            <li>إذا لم توافق على أي بند، يجب التوقف فوراً عن استخدام الخدمة.</li>
            <li>يحق لمشغل المنصة رفض الخدمة أو تقييدها لأي مستخدم دون إشعار مسبق.</li>
          </>
        </Section>

        <Section title="وصف الخدمة">
          <>
            <li>توفر المنصة أدوات ومعلومات متعلقة بتقييم وإدارة الفرص العقارية أو الخدمات المرتبطة بها.</li>
            <li>قد تتغير أو تُعلّق أو تُزال ميزات الخدمة في أي وقت.</li>
          </>
        </Section>

        <Section title="ترخيص الاستخدام">
          <>
            <li>يُمنح ترخيص محدود، غير حصري، غير قابل للتحويل، لاستخدام الواجهة وفق هذه الشروط.</li>
            <li>يُحظر إعادة البيع، أو الهندسة العكسية، أو استخراج البيانات الضخم، أو الإضرار بالأنظمة.</li>
          </>
        </Section>

        <Section title="التزامات المستخدم">
          <>
            <li>تقديم معلومات صحيحة عند الطلب، وألا تستخدم الخدمة لأغراض غير قانونية أو احتيالية.</li>
            <li>ألا تحاول الوصول غير المصرح به لحسابات المستخدمين أو البنية التحتية.</li>
          </>
        </Section>

        <Section title="البيانات الشخصية والاستخدام">
          <>
            <li>
              باستخدامك للخدمة، توافق صراحة على جمع وتخزين ومعالجة وتجميع أي بيانات تقدمها أو
              تُستمد تلقائياً (بما في ذلك المعرفات التقنية وسجلات الاستخدام والموقع التقريبي حيث
              ينطبق ذلك)، لأغراض تشغيل وتحسين الخدمة والتحليلات والامتثال.
            </li>
            <li>
              يحق للمنصة مشاركة البيانات مع مزودي الخدمات والشركاء الضروريين لتشغيل المنتج، وبما
              يسمح به القانون، بما في ذلك للتسويق والاتصالات التروّجية حيث يُسمح قانوناً.
            </li>
            <li>
              توافق على استخدام البيانات لإنشاء نماذج مجمّعة وإحصاءات لا تكشف الهوية، ولتدريب
              محركات التحليل أو التحسين الداخلي حيث ينطبق ذلك.
            </li>
          </>
        </Section>

        <Section title="ملفات تعريف الارتباط والتخزين المحلي">
          <>
            <li>
              قد تستخدم المنصة ملفات تعريف الارتباط (كوكيز) والتخزين المحلي والمعرّفات المماثلة
              لتشغيل الخدمة وتخزين تفضيلاتك (بما في ذلك حفظ موافقتك على الكوكيز)، والجلسات،
              والأمان، والقياس والتحليلات، واختبار الأداء، إلى الحد الذي تسمح به إعدادات جهازك
              والقانون.
            </li>
            <li>
              بالموافقة عبر نافذة الكوكيز أو باستمرارك في استخدام الموقع بعد عرض الإشعار، توافق على
              استخدام تقنيات تتبع وقياس غير ضرورية للتشغيل الأساسي للموقع حيث يُسمح بذلك وفق هذه
              الشروط.
            </li>
            <li>يمكنك تغيير إعدادات المتصفح لتقييد الكوكيز؛ قد يؤثر ذلك على عمل بعض الميزات.</li>
          </>
        </Section>

        <Section title="الملكية الفكرية">
          <>
            <li>المحتوى والعلامات والبرمجيات الخاصة بالمنصة محمية؛ لا تمنحك هذه الشروط أي ملكية عليها.</li>
          </>
        </Section>

        <Section title="إخلاء المسؤولية">
          <>
            <li>الخدمة تُقدَّم «كما هي» و«حسب التوفر» دون ضمانات من أي نوع إلى أقصى حد يسمح به القانون.</li>
            <li>لا تضمن المنصة دقة كل المعلومات أو النتائج أو ملاءمة الخدمة لغرض معين.</li>
          </>
        </Section>

        <Section title="تحديد المسؤولية">
          <>
            <li>
              إلى أقصى حد يسمح به القانون المصري، لا تتحمل المنصة المسؤولية عن أي أضرار غير مباشرة
              أو تبعية أو خسارة أرباح أو بيانات أو فرص.
            </li>
            <li>
              إن وُجدت مسؤولية، فإجمالي التزام المنصة يقتصر على المبلغ الذي دفعته أنت للمنصة مقابل
              الخدمة في الأشهر الثلاثة السابقة للدعوى، أو صفر إن لم يكن هناك مبلغ مدفوع.
            </li>
          </>
        </Section>

        <Section title="التعويض">
          <>
            <li>
              توافق على الدفاع عن المنصة وتعويضها عن أي مطالبات ناشئة عن إساءة استخدامك للخدمة أو
              مخالفتك لهذه الشروط.
            </li>
          </>
        </Section>

        <Section title="التعديلات">
          <>
            <li>يجوز تعديل هذه الشروط أو الخدمة في أي وقت؛ يُعد استمرارك في الاستخدام موافقة على النسخة المحدثة.</li>
          </>
        </Section>

        <Section title="القانون الواجب التطبيق والاختصاص">
          <>
            <li>تخضع هذه الشروط لقوانين جمهورية مصر العربية وتُفسَّر وفقاً لها.</li>
            <li>تختص المحاكم المختصة في جمهورية مصر العربية بالنظر في النزاعات، بما لا يخل بأحكام إلزامية.</li>
          </>
        </Section>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-secondary-900 mb-4">
        Terms of Use
      </h1>
      <p className="text-secondary-600 mb-10 leading-relaxed">
        Effective upon use: by accessing or using the Aggar website, application, or related services,
        you acknowledge that you have read and agree to these terms in full, without reservation,
        including with respect to how your data is collected, processed, and used as described
        below.
      </p>

      <Section title="Acceptance">
        <>
          <li>Accessing or using the service constitutes binding acceptance of these terms.</li>
          <li>If you do not agree to any provision, you must stop using the service immediately.</li>
          <li>The operator may refuse or restrict service to any user without prior notice.</li>
        </>
      </Section>

      <Section title="Service description">
        <>
          <li>
            The platform provides tools and information related to evaluating and managing real
            estate opportunities or related services.
          </li>
          <li>Features may be changed, suspended, or discontinued at any time.</li>
        </>
      </Section>

      <Section title="License to use">
        <>
          <li>
            You receive a limited, non-exclusive, non-transferable license to use the interface in
            accordance with these terms.
          </li>
          <li>
            You may not resell, reverse engineer, scrape at scale, or harm systems or other users.
          </li>
        </>
      </Section>

      <Section title="User obligations">
        <>
          <li>Provide accurate information when requested; do not use the service for unlawful or fraudulent purposes.</li>
          <li>Do not attempt unauthorized access to accounts or infrastructure.</li>
        </>
      </Section>

      <Section title="Personal data and use">
        <>
          <li>
            By using the service, you expressly consent to the collection, storage, processing, and
            aggregation of any data you provide or that is collected automatically (including
            technical identifiers, usage logs, and approximate location where applicable) to operate,
            secure, and improve the service, for analytics, and for compliance.
          </li>
          <li>
            The platform may share data with service providers and partners as reasonably necessary
            to run the product, and for marketing or promotional communications where permitted by
            law.
          </li>
          <li>
            You agree that data may be used to create aggregated and anonymized insights and for
            internal analytics or optimization models where applicable.
          </li>
        </>
      </Section>

      <Section title="Cookies & local storage">
        <>
          <li>
            The platform may use cookies, local storage, and similar identifiers to operate the
            service, store your preferences (including saving your cookie consent), sessions,
            security, measurement and analytics, and performance testing, subject to your device
            settings and applicable law.
          </li>
          <li>
            By accepting via the cookie notice or by continuing to use the site after the notice is
            shown, you agree to the use of non-strictly-necessary tracking or measurement
            technologies where permitted under these terms.
          </li>
          <li>You can change browser settings to restrict cookies; some features may not work fully.</li>
        </>
      </Section>

      <Section title="Intellectual property">
        <>
          <li>Platform content, branding, and software are protected; these terms do not transfer ownership to you.</li>
        </>
      </Section>

      <Section title="Disclaimer">
        <>
          <li>The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties to the fullest extent allowed by law.</li>
          <li>The platform does not warrant that all information or outcomes will be accurate or fit a particular purpose.</li>
        </>
      </Section>

      <Section title="Limitation of liability">
        <>
          <li>
            To the maximum extent permitted by the laws of the Arab Republic of Egypt, the platform is
            not liable for indirect, consequential, lost profits, data loss, or lost opportunity.
          </li>
          <li>
            If any liability is found, total liability is limited to the amount you paid the platform
            for the service in the three months before the claim, or zero if no fees were paid.
          </li>
        </>
      </Section>

      <Section title="Indemnity">
        <>
          <li>
            You agree to defend and hold harmless the platform from claims arising from your misuse of
            the service or breach of these terms.
          </li>
        </>
      </Section>

      <Section title="Changes">
        <>
          <li>These terms or the service may be modified at any time; continued use constitutes acceptance of the updated terms.</li>
        </>
      </Section>

      <Section title="Governing law and jurisdiction">
        <>
          <li>These terms are governed by the laws of the Arab Republic of Egypt.</li>
          <li>The competent courts in Egypt have the non-exclusive jurisdiction, subject to any mandatory rules that cannot be waived.</li>
        </>
      </Section>
    </div>
  );
}
