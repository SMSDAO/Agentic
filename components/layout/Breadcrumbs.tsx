import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-500" />}
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-gray-400 hover:text-neon-blue transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? 'text-white font-medium' : 'text-gray-400'}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
