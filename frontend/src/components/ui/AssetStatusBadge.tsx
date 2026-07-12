import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AssetStatusBadgeProps {
  status: string;
  className?: string;
}

export function AssetStatusBadge({ status, className }: AssetStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'allocated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reserved': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'under maintenance': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      case 'retired': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'disposed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          getStatusColor(status)
        ),
        className
      )}
    >
      {status}
    </span>
  );
}
