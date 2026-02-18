import { User as UserIcon } from 'lucide-react';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

export function Avatar({ src, alt, size = 'md', fallback }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center border border-white/10`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || 'Avatar'}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      ) : fallback ? (
        <span className="text-sm font-semibold text-white">{fallback}</span>
      ) : (
        <UserIcon className={`${iconSizes[size]} text-gray-400`} />
      )}
    </div>
  );
}
