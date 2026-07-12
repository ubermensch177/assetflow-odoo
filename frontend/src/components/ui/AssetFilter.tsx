import { Filter } from 'lucide-react';

interface AssetFilterProps {
  filters: any;
  onChange: (filters: any) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function AssetFilter({ filters, onChange, isOpen, onToggle }: AssetFilterProps) {
  const updateFilter = (key: string, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <>
      <button 
        onClick={onToggle}
        className={`flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 ${isOpen ? 'bg-slate-100' : 'bg-white'}`}
      >
        <Filter size={18} />
        Filters
      </button>

      {isOpen && (
        <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 mt-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select 
              value={filters.status || ''}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Allocated">Allocated</option>
              <option value="Reserved">Reserved</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Lost">Lost</option>
              <option value="Retired">Retired</option>
              <option value="Disposed">Disposed</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select 
              value={filters.category || ''}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Laptops">Laptops</option>
              <option value="Monitors">Monitors</option>
              <option value="Mobile Devices">Mobile Devices</option>
              <option value="Networking">Networking</option>
              <option value="Peripherals">Peripherals</option>
              <option value="Furniture">Furniture</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select 
              value={filters.department || ''}
              onChange={(e) => updateFilter('department', e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="IT Support">IT Support</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
            <select 
              value={filters.condition || ''}
              onChange={(e) => updateFilter('condition', e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Conditions</option>
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
              <option value="Broken">Broken</option>
            </select>
          </div>
        </div>
      )}
    </>
  );
}
