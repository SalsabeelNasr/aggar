import { useLocale } from 'next-intl';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const locale = useLocale();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-heading font-extrabold text-secondary-900 mb-4 tracking-tight">404</h1>
      <p className="text-xl text-secondary-600 mb-8 max-w-md">
        {locale === 'ar' ? 'عفواً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.' : 'Sorry, the page you are looking for does not exist or has been moved.'}
      </p>
      <Link href="/">
        <Button size="lg">{locale === 'ar' ? 'العودة للصفحة الرئيسية' : 'Return to Home'}</Button>
      </Link>
    </div>
  );
}
