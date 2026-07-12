import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Download, ScanLine, Search, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal/Modal';
import { exportToCSV } from '../utils/csvExport';
import './Assets.css';

export const Assets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [scannedTag, setScannedTag] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '', assetTag: '', categoryId: 1, departmentId: '', purchaseDate: '', purchaseCost: 0, expectedLifetime: 60
  });

  const fetchAssets = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [assetRes, catRes, deptRes] = await Promise.all([
          fetch('/api/assets', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/departments', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (assetRes.ok) {
          const data = await assetRes.json();
          setAssets(data.data || data);
        }
        if (catRes.ok) setCategories(await catRes.json());
        if (deptRes.ok) setDepartments(await deptRes.json());
      } catch (err) {
        console.error("Failed to fetch assets data");
      } finally {
        setLoading(false);
      }
    };
  
  useEffect(() => {
    fetchAssets();
  }, []);

  const handleRegisterAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const payload = {
      ...formData,
      categoryId: parseInt(formData.categoryId.toString()),
      departmentId: formData.departmentId ? parseInt(formData.departmentId.toString()) : null,
      purchaseCost: parseFloat(formData.purchaseCost.toString()),
      expectedLifetime: parseInt(formData.expectedLifetime.toString()),
      purchaseDate: new Date(formData.purchaseDate).toISOString()
    };

    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', assetTag: '', categoryId: 1, departmentId: '', purchaseDate: '', purchaseCost: 0, expectedLifetime: 60 });
        fetchAssets(); // Refresh table
      } else {
        console.error("Failed to register asset:", await res.text());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedTag) return;
    const found = assets.find(a => a.assetTag.toLowerCase() === scannedTag.toLowerCase());
    if (found) {
      navigate(`/assets/${found.id}`);
    } else {
      alert("Asset Tag not found in current inventory.");
    }
    setIsQRModalOpen(false);
    setScannedTag('');
  };

  const handleEditAsset = async (e: React.MouseEvent, id: number, currentName: string) => {
    e.stopPropagation();
    const newName = prompt("Enter new asset name:", currentName);
    if (!newName || newName === currentName) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/assets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        fetchAssets();
      } else {
        alert("Failed to update asset.");
      }
    } catch (err) {
      alert("Error updating asset.");
    }
  };

  const handleDeleteAsset = async (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete the asset "${name}"?`)) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/assets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchAssets();
      } else {
        alert("Failed to delete asset.");
      }
    } catch (err) {
      alert("Error deleting asset.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'AVAILABLE': return <span className="badge badge-success">Available</span>;
      case 'ALLOCATED': return <span className="badge badge-info">Allocated</span>;
      case 'UNDER_MAINTENANCE': return <span className="badge badge-warning">Maintenance</span>;
      case 'RESERVED': return <span className="badge badge-secondary">Reserved</span>;
      case 'LOST':
      case 'DISPOSED':
      case 'RETIRED': return <span className="badge badge-danger">{status.toLowerCase()}</span>;
      default: return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.assetTag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || a.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="assets-page animation-fade-in">
      <div className="page-header">
        <div>
          <h1>Central Asset Registry</h1>
          <p>Manage all enterprise assets, inventory, and shared resources.</p>
        </div>
        <div className="quick-actions">
          <button className="btn btn-secondary" onClick={() => setIsQRModalOpen(true)}><ScanLine size={16} /> QR Scan</button>
          <button className="btn btn-secondary" onClick={() => exportToCSV(assets, 'assets_export')}><Download size={16} /> Export CSV</button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={16} /> Register Asset</button>
        </div>
      </div>

      <div className="card full-height-card">
        <div className="table-toolbar">
          <div className="search-bar inline-search">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or asset tag..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="ALLOCATED">Allocated</option>
              <option value="UNDER_MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-state">Loading assets...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Department</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map(asset => (
                  <tr key={asset.id} className="cursor-pointer hover-row" onClick={() => navigate(`/assets/${asset.id}`)}>
                    <td className="font-medium text-primary">{asset.assetTag}</td>
                    <td>{asset.name}</td>
                    <td>{asset.category?.name}</td>
                    <td>{asset.department?.name || 'Unassigned'}</td>
                    <td>{asset.condition}</td>
                    <td>{getStatusBadge(asset.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                        <button className="icon-btn text-blue-500 hover:bg-blue-50" title="Edit" onClick={(e) => handleEditAsset(e, asset.id, asset.name)}>
                          <Edit size={16}/>
                        </button>
                        <button className="icon-btn text-red-500 hover:bg-red-50" title="Delete" onClick={(e) => handleDeleteAsset(e, asset.id, asset.name)}>
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Asset">
        <form onSubmit={handleRegisterAsset}>
          <div className="form-group">
            <label>Asset Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. MacBook Pro M3" />
          </div>
          <div className="form-group">
            <label>Asset Tag</label>
            <input required type="text" value={formData.assetTag} onChange={e => setFormData({...formData, assetTag: e.target.value})} placeholder="e.g. AST-9001" />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Category</label>
              <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: parseInt(e.target.value)})}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Department</label>
              <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})}>
                <option value="">None</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Purchase Date</label>
              <input required type="date" value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Purchase Cost ($)</label>
              <input required type="number" value={formData.purchaseCost} onChange={e => setFormData({...formData, purchaseCost: parseFloat(e.target.value)})} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Asset</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} title="Simulate QR Scan">
        <form onSubmit={handleQRSubmit}>
          <div className="form-group">
            <label>Scan Barcode / Enter Asset Tag</label>
            <input required type="text" value={scannedTag} onChange={e => setScannedTag(e.target.value)} placeholder="e.g. AST-1001" autoFocus />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsQRModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Process Scan</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
