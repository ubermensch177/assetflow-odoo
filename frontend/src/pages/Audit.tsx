import { Fragment, useEffect, useState } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Modal } from '../components/Modal/Modal';

export const Audit = () => {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '' });

  const fetchAudits = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/audits', { headers: { 'Authorization': `Bearer ${token}` } });
        setAudits(await res.json());
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAudits();
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
        fetchAudits();
      }
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
                    </tr>
                    {expandedId === a.id && (
                      <tr style={{ backgroundColor: '#F8F9FB' }}>
                        <td colSpan={6} style={{ padding: '1rem 3rem' }}>
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
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Audit</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
