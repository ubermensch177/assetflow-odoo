import { Clock } from 'lucide-react';

export function AssetTimeline({ asset }: { asset: any }) {
  const purchaseDate = new Date(asset.purchaseDate);
  const expectedRetirement = new Date(purchaseDate);
  expectedRetirement.setMonth(purchaseDate.getMonth() + (asset.expectedLifetime || 0));

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <Clock className="text-blue-600" size={20} />
        Lifecycle Timeline
      </h3>
      <div className="relative border-l-2 border-slate-200 ml-3 md:ml-4 space-y-8">
        
        {/* Render actual events based on history if available, for now static endpoints */}
        <div className="relative pl-6">
          <div className="absolute w-4 h-4 bg-slate-300 rounded-full -left-[9px] top-1 border-4 border-white"></div>
          <p className="text-sm text-slate-500 font-medium">Expected Retirement</p>
          <p className="text-slate-800 font-medium mt-1">{expectedRetirement.toLocaleDateString()}</p>
        </div>

        {asset.allocations?.map((alloc: any, i: number) => (
          <div key={`alloc-${i}`} className="relative pl-6">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 border-4 border-white"></div>
            <p className="text-sm text-slate-500 font-medium">Allocated to {alloc.assignedTo}</p>
            <p className="text-slate-800 font-medium mt-1">{new Date(alloc.assignedDate).toLocaleDateString()}</p>
          </div>
        ))}

        <div className="relative pl-6">
          <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-[9px] top-1 border-4 border-white"></div>
          <p className="text-sm text-slate-500 font-medium">Purchased</p>
          <p className="text-slate-800 font-medium mt-1">{purchaseDate.toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
