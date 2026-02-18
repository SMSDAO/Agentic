import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconClass?: string;
  bgClass?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, iconClass, bgClass }: StatsCardProps) {
  return (
    <div className="neo-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgClass || 'bg-neon-blue/10'}`}>
          <Icon className={`w-6 h-6 ${iconClass || 'text-neon-blue'}`} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              trend.isPositive ? 'text-neon-green' : 'text-red-400'
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}
