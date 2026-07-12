import { ShieldCheck } from 'lucide-react';

export function AssetDetailsCard({ asset }: { asset: any }) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <ShieldCheck className="text-blue-600" size={20} />
        Asset Specifications
      </h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        <div>
          <dt className="text-sm font-medium text-slate-500">Category</dt>
          <dd className="mt-1 text-sm text-slate-900 font-medium">{asset.category}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Department</dt>
          <dd className="mt-1 text-sm text-slate-900 font-medium">{asset.department}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Location</dt>
          <dd className="mt-1 text-sm text-slate-900 font-medium">{asset.location}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Condition</dt>
          <dd className="mt-1 text-sm text-slate-900 font-medium">{asset.condition}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Purchase Date</dt>
          <dd className="mt-1 text-sm text-slate-900 font-medium">{new Date(asset.purchaseDate).toLocaleDateString()}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Purchase Cost</dt>
          <dd className="mt-1 text-sm text-slate-900 font-medium">${asset.purchaseCost?.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Vendor</dt>
          <dd className="mt-1 text-sm text-slate-900 font-medium">{asset.vendor || 'N/A'}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Supplier</dt>
          <dd className="mt-1 text-sm text-slate-900 font-medium">{asset.supplier || 'N/A'}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Warranty Expiry</dt>
          <dd className="mt-1 text-sm text-slate-900 font-medium">
            {asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toLocaleDateString() : 'N/A'}
          </dd>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <dt className="text-sm font-medium text-slate-500">Remarks</dt>
          <dd className="mt-1 text-sm text-slate-900 font-medium">{asset.remarks || 'No remarks provided.'}</dd>
        </div>
      </dl>
    </div>
  );
}
