import { AssetStatusBadge } from './AssetStatusBadge';
import { Package } from 'lucide-react';

interface AssetCardProps {
  asset: any;
  onClick: () => void;
}

export function AssetCard({ asset, onClick }: AssetCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm active:bg-slate-50 transition-colors"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Package size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{asset.name}</h3>
            <p className="text-sm font-mono text-slate-500">{asset.assetTag}</p>
          </div>
        </div>
        <AssetStatusBadge status={asset.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-slate-500 block text-xs font-medium">Category</span>
          <span className="text-slate-700">{asset.category}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-xs font-medium">Department</span>
          <span className="text-slate-700">{asset.department}</span>
        </div>
      </div>
    </div>
  );
}
