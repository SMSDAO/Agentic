interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    success: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    warning: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}
