import { useEffect, useState } from 'react';
import { AssetTable } from '../components/ui/AssetTable';
import { AssetCard } from '../components/ui/AssetCard';
import { AssetStatusBadge } from '../components/ui/AssetStatusBadge';
import { SearchToolbar } from '../components/ui/SearchToolbar';
import { AssetFilter } from '../components/ui/AssetFilter';
import { useNavigate } from 'react-router-dom';

export function Directory() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  
  const navigate = useNavigate();

  const fetchAssets = async () => {
    setLoading(true);
    try {
      // Build query string from filters and search
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      Object.keys(filters).forEach(k => {
        if (filters[k]) queryParams.append(k, filters[k]);
      });
      
      const response = await fetch(`http://localhost:5001/api/assets?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      }
    } catch (err) {
      console.error('Failed to fetch assets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const delay = setTimeout(() => {
      fetchAssets();
    }, 300);
    return () => clearTimeout(delay);
  }, [search, filters]);

  const columns = [
    { header: 'Asset Tag', accessor: 'assetTag', className: 'font-mono text-blue-600' },
    { header: 'Name / Model', accessor: 'name', className: 'font-medium' },
    { header: 'Category', accessor: 'category' },
    { header: 'Department', accessor: 'department' },
    { header: 'Status', accessor: (row: any) => <AssetStatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Asset Directory</h2>
          <p className="text-slate-500 mt-1">Manage and track your organization's assets</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <SearchToolbar 
          value={search} 
          onChange={setSearch} 
          placeholder="Search by Tag, Serial, Name..." 
        />
        <AssetFilter 
          filters={filters} 
          onChange={setFilters} 
          isOpen={isFilterOpen} 
          onToggle={() => setIsFilterOpen(!isFilterOpen)} 
        />
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading assets...</p>
          </div>
        </div>
      ) : assets.length === 0 ? (
        <div className="w-full p-8 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500">
          No assets match your search criteria.
        </div>
      ) : (
        <>
          {/* Mobile view - Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {assets.map(asset => (
              <AssetCard 
                key={asset.id} 
                asset={asset} 
                onClick={() => navigate(`/assets/${asset.id}`)} 
              />
            ))}
          </div>

          {/* Desktop view - Table */}
          <div className="hidden md:block">
            <AssetTable 
              data={assets} 
              columns={columns} 
              keyExtractor={(item: any) => item.id}
              onRowClick={(item: any) => navigate(`/assets/${item.id}`)}
              emptyMessage="No assets match your search criteria."
            />
          </div>
        </>
      )}
    </div>
  );
}
