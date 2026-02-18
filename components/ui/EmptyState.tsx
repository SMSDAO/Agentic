import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && (
        <div className="p-4 rounded-full bg-gray-500/10 mb-4">
          <Icon className="w-12 h-12 text-gray-500" />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-400 mb-6 max-w-md">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="neo-button"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
