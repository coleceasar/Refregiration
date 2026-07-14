import { Star } from 'lucide-react';

export function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizes[size]} ${
            star <= rating ? 'text-warning-400 fill-warning-400' : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  center = true,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? 'text-center max-w-2xl mx-auto' : ''}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
      {subtitle && <p className="text-gray-600 dark:text-gray-400 text-lg">{subtitle}</p>}
      <div className={`h-1.5 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-4 ${center ? 'mx-auto' : ''}`} />
    </div>
  );
}

export function formatPrice(price: number): string {
  return 'KSh ' + price.toLocaleString('en-KE');
}
