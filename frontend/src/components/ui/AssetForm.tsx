
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const assetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  assetTag: z.string().min(1, 'Asset Tag is required'),
  serialNumber: z.string().min(1, 'Serial Number is required'),
  category: z.string().min(1, 'Category is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  purchaseDate: z.string().min(1, 'Purchase Date is required'),
  purchaseCost: z.number().min(0, 'Cost must be positive'),
  expectedLifetime: z.number().min(1, 'Expected Lifetime must be at least 1 month'),
  condition: z.string().min(1, 'Condition is required'),
  warrantyExpiry: z.string().optional(),
  vendor: z.string().optional(),
  supplier: z.string().optional(),
  remarks: z.string().optional(),
  sharedResource: z.boolean().optional(),
  assetImage: z.string().optional(),
});

type AssetFormData = z.infer<typeof assetSchema>;

interface AssetFormProps {
  initialData?: Partial<AssetFormData>;
  onSubmit: (data: AssetFormData) => void;
  isLoading?: boolean;
}

export function AssetForm({ initialData, onSubmit, isLoading }: AssetFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: initialData || { purchaseDate: new Date().toISOString().split('T')[0] },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Asset Name / Model *</label>
          <input 
            {...register('name')}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
            placeholder="e.g. MacBook Pro M3"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Asset Tag *</label>
          <input 
            {...register('assetTag')}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
            placeholder="e.g. LPT-2023-001"
          />
          {errors.assetTag && <p className="text-red-500 text-xs mt-1">{errors.assetTag.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Serial Number *</label>
          <input 
            {...register('serialNumber')}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
          {errors.serialNumber && <p className="text-red-500 text-xs mt-1">{errors.serialNumber.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Category *</label>
          <select 
            {...register('category')}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">Select Category</option>
            <option value="Laptops">Laptops</option>
            <option value="Monitors">Monitors</option>
            <option value="Peripherals">Peripherals</option>
            <option value="Furniture">Furniture</option>
            <option value="Mobile Devices">Mobile Devices</option>
            <option value="Networking">Networking</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Department *</label>
          <select 
            {...register('department')}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="IT Support">IT Support</option>
          </select>
          {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Location *</label>
          <input 
            {...register('location')}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Purchase Date *</label>
          <input 
            type="date"
            {...register('purchaseDate')}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
          {errors.purchaseDate && <p className="text-red-500 text-xs mt-1">{errors.purchaseDate.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Purchase Cost (USD) *</label>
          <input 
            type="number" step="0.01"
            {...register('purchaseCost', { valueAsNumber: true })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
          {errors.purchaseCost && <p className="text-red-500 text-xs mt-1">{errors.purchaseCost.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Expected Lifetime (Months) *</label>
          <input 
            type="number"
            {...register('expectedLifetime', { valueAsNumber: true })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
          {errors.expectedLifetime && <p className="text-red-500 text-xs mt-1">{errors.expectedLifetime.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Condition *</label>
          <select 
            {...register('condition')}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
          {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Vendor</label>
          <input 
            {...register('vendor')}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Supplier</label>
          <input 
            {...register('supplier')}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Warranty Expiry Date</label>
          <input 
            type="date"
            {...register('warrantyExpiry')}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Remarks</label>
          <textarea 
            {...register('remarks')}
            rows={3}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>

        <div className="space-y-1 md:col-span-2 flex items-center gap-3">
          <input 
            type="checkbox"
            {...register('sharedResource')}
            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
          />
          <label className="text-sm font-medium text-slate-700">This is a shared resource (can be used by multiple people)</label>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Asset Image / Documents (Optional)</label>
          <input 
            type="file"
            multiple
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
          <p className="text-xs text-slate-500 mt-1">File upload is mocked for UI demo purposes.</p>
        </div>

      </div>
      
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button 
          type="submit" 
          disabled={isLoading}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Asset'}
        </button>
      </div>
    </form>
  );
}
