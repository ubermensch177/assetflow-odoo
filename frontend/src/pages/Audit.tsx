import { Fragment, useEffect, useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal/Modal';

export const Audit = () => {
  const [audits, setAudits] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', status: 'OPEN', assignedToId: '', startDate: '', endDate: '' });
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchAuditsAndUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const [auditsRes, usersRes] = await Promise.all([
          fetch('/api/audits', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (auditsRes.ok) setAudits(await auditsRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAuditsAndUsers();
  }, []);

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchAuditsAndUsers();
        setFormData({ name: '', status: 'OPEN', assignedToId: '', startDate: '', endDate: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this audit?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/audits/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchAuditsAndUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container animation-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Audit Cycles</h1>
          <p>Run periodic audit cycles and track discrepancies.</p>
        </div>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={16} /> Start Audit</button>
        </div>
      </div>
      <div className="card full-height-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading audits...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>Audit Name</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  {currentUser?.role === 'ADMIN' && <th style={{ width: '80px', textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {audits.map(a => (
                  <Fragment key={a.id}>
                    <tr className="cursor-pointer hover-row" onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}>
                      <td>{expandedId === a.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</td>
                      <td style={{ fontWeight: 600 }}>{a.name}</td>
                      <td>
                        <span className={`badge ${a.status === 'OPEN' ? 'badge-warning' : 'badge-success'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>{a.assignedTo?.firstName} {a.assignedTo?.lastName}</td>
                      <td>{new Date(a.startDate).toLocaleDateString()}</td>
                      <td>{a.endDate ? new Date(a.endDate).toLocaleDateString() : 'Ongoing'}</td>
                      {currentUser?.role === 'ADMIN' && (
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn-icon" style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={(e) => handleDelete(e, a.id)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                    {expandedId === a.id && (
                      <tr style={{ backgroundColor: '#F8F9FB' }}>
                        <td colSpan={currentUser?.role === 'ADMIN' ? 7 : 6} style={{ padding: '1rem 3rem' }}>
                          <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>Audited Assets</h4>
                          <table style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            <thead>
                              <tr>
                                <th>Asset Tag</th>
                                <th>Name</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {a.records.map((r: any) => (
                                <tr key={r.id}>
                                  <td style={{ color: 'var(--primary)', fontWeight: 500 }}>{r.asset?.assetTag}</td>
                                  <td>{r.asset?.name}</td>
                                  <td>
                                    <span className={`badge ${r.status === 'VERIFIED' ? 'badge-success' : 'badge-danger'}`}>
                                      {r.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Start New Audit Cycle">
        <form onSubmit={handleStartAudit}>
          <div className="form-group">
            <label>Audit Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Q4 Asset Audit 2024" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
          <div className="form-group">
            <label>Assigned To</label>
            <select value={formData.assignedToId} onChange={e => setFormData({...formData, assignedToId: e.target.value})}>
              <option value="">-- Assign to User (Default: Self) --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Audit</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
