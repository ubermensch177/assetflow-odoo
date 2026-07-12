import { useEffect, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { Modal } from '../components/Modal/Modal';

export const Booking = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookableAssets, setBookableAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ assetId: '', startTime: '', endTime: '', purpose: '' });

  const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const [bookRes, assetRes] = await Promise.all([
          fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/assets?isBookable=true&limit=100', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        const bookData = await bookRes.json();
        setBookings(Array.isArray(bookData) ? bookData : []);
        const assetData = await assetRes.json();
        setBookableAssets(assetData.data || []);
      } finally {
        setLoading(false);
      }
    };
    
  useEffect(() => {
    fetchBookings();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.assetId) {
      alert("Please select an asset.");
      return;
    }
    const token = localStorage.getItem('token');
    
    const payload = {
      ...formData,
      assetId: parseInt(formData.assetId)
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ assetId: '', startTime: '', endTime: '', purpose: '' });
        fetchBookings();
      } else {
        alert("Failed to create booking.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container animation-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Resource Booking</h1>
          <p>Book shared resources like meeting rooms and company vehicles.</p>
        </div>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><CalendarClock size={16} /> Book Asset</button>
        </div>
      </div>
      <div className="card full-height-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading bookings...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Resource Name</th>
                  <th>Booked By</th>
                  <th>Purpose</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 500 }}>{b.asset?.name}</td>
                    <td>{b.user?.firstName} {b.user?.lastName}</td>
                    <td>{b.purpose}</td>
                    <td>{new Date(b.startTime).toLocaleString()}</td>
                    <td>{new Date(b.endTime).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        b.status === 'ONGOING' ? 'badge-primary' : 
                        b.status === 'UPCOMING' ? 'badge-warning' : 
                        'badge-secondary'
                      }`} style={{ backgroundColor: b.status === 'ONGOING' ? '#E5F0FF' : undefined, color: b.status === 'ONGOING' ? 'var(--primary)' : undefined }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book Resource">
        <form onSubmit={handleBook}>
          <div className="form-group">
            <label>Asset</label>
            <select required value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})}>
              <option value="">Select an asset...</option>
              {bookableAssets.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.assetTag}) - {a.status}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Start Time</label>
              <input required type="datetime-local" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>End Time</label>
              <input required type="datetime-local" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Purpose</label>
            <input required type="text" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Book Asset</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
