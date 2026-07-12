import { History } from 'lucide-react';

export function AssetHistoryTable({ history }: { history: any[] }) {
  if (!history || history.length === 0) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <History className="text-blue-600" size={20} />
          Audit Log
        </h3>
        <p className="text-slate-500">No history available for this asset.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <History className="text-blue-600" size={20} />
        Audit Log
      </h3>
      <div className="space-y-6">
        {history.map((log: any, i: number) => (
          <div key={i} className="flex gap-4">
            <div className="mt-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full ring-4 ring-slate-100"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{log.action}</p>
              <p className="text-sm text-slate-500 mt-0.5">{log.details}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span>{new Date(log.date).toLocaleString()}</span>
                <span>&bull;</span>
                <span>By {log.performedBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
