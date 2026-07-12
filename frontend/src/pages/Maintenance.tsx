import { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import { Modal } from '../components/Modal/Modal';

export const Maintenance = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ assetId: '', issue: '', priority: 'MEDIUM' });

  const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/maintenance', { headers: { 'Authorization': `Bearer ${token}` } });
        setRequests(await res.json());
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const payload = {
      ...formData,
      assetId: parseInt(formData.assetId)
    };

    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchRequests();
      } else {
        alert("Failed to report issue.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container animation-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Maintenance</h1>
          <p>Track maintenance requests and repair history.</p>
        </div>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Wrench size={16} /> Report Issue</button>
        </div>
      </div>
      <div className="card full-height-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading maintenance...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Issue Description</th>
                  <th>Requested By</th>
                  <th>Status</th>
                  <th>Cost</th>
                  <th>Resolved At</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500, color: 'var(--primary)' }}>{r.asset?.assetTag}</td>
                    <td>{r.issue}</td>
                    <td>{r.requester?.firstName} {r.requester?.lastName}</td>
                    <td>
                      <span className={`badge ${
                        r.status === 'RESOLVED' ? 'badge-success' : 
                        r.status === 'PENDING' ? 'badge-warning' : 
                        'badge-info'
                      }`}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{r.cost ? `$${r.cost.toFixed(2)}` : '-'}</td>
                    <td>{r.resolvedAt ? new Date(r.resolvedAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report Maintenance Issue">
        <form onSubmit={handleReport}>
          <div className="form-group">
            <label>Asset ID</label>
            <input required type="number" value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Issue Description</label>
            <input required type="text" value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Report</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
