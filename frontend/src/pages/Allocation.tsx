import { useEffect, useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { Modal } from '../components/Modal/Modal';

export const Allocation = () => {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ assetId: '', userId: '', departmentId: '' });
  
    const fetchAllocations = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const [allocRes, assetRes, userRes, deptRes] = await Promise.all([
          fetch('/api/allocations', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/assets?limit=200', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/departments', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        const allocData = await allocRes.json();
        setAllocations(Array.isArray(allocData) ? allocData : []);
        const assetData = await assetRes.json();
        setAssets(assetData.data || []);
        const userData = await userRes.json();
        setUsers(Array.isArray(userData) ? userData : []);
        const deptData = await deptRes.json();
        setDepartments(Array.isArray(deptData) ? deptData : []);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.assetId || !formData.userId) {
      alert("Please select both an asset and a user.");
      return;
    }
    const token = localStorage.getItem('token');
    
    const payload = {
      ...formData,
      assetId: parseInt(formData.assetId),
      userId: parseInt(formData.userId),
      departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined
    };

    try {
      const res = await fetch('/api/allocations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ assetId: '', userId: '', departmentId: '' });
        fetchAllocations();
      } else {
        alert("Failed to allocate asset. Please check IDs.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container animation-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Allocation & Transfer</h1>
          <p>Manage asset assignments and track transfer history.</p>
        </div>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><ArrowRightLeft size={16} /> Transfer Asset</button>
        </div>
      </div>
      <div className="card full-height-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading allocations...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Asset Name</th>
                  <th>Assigned To</th>
                  <th>Department</th>
                  <th>Allocated Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500, color: 'var(--primary)' }}>{a.asset?.assetTag}</td>
                    <td>{a.asset?.name}</td>
                    <td>{a.user ? `${a.user.firstName} ${a.user.lastName}` : 'N/A'}</td>
                    <td>{a.department?.name || 'N/A'}</td>
                    <td>{new Date(a.allocatedDate).toLocaleDateString()}</td>
                    <td><span className={`badge ${a.status === 'ACTIVE' ? 'badge-success' : 'badge-secondary'}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Allocate Asset">
        <form onSubmit={handleAllocate}>
          <div className="form-group">
            <label>Asset</label>
            <select required value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})}>
              <option value="">Select an asset...</option>
              {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Assign to User</label>
            <select required value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})}>
              <option value="">Select a user...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Department (Optional)</label>
            <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})}>
              <option value="">None</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Allocate</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
