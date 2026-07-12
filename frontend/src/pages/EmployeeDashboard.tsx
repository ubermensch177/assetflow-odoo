import React, { useEffect, useState } from 'react';
import { Package, Wrench, CalendarClock, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [allocations, setAllocations] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        const [allocRes, maintRes, bookRes] = await Promise.all([
          fetch('/api/allocations', { headers }),
          fetch('/api/maintenance', { headers }),
          fetch('/api/bookings', { headers })
        ]);

        if (allocRes.ok) setAllocations(await allocRes.json());
        if (maintRes.ok) setMaintenance(await maintRes.json());
        if (bookRes.ok) setBookings(await bookRes.json());
      } catch (err) {
        console.error("Failed to fetch employee dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { firstName: 'Employee' };

  if (loading) {
    return <div className="dashboard-page"><p>Loading portal...</p></div>;
  }

  return (
    <div className="dashboard-page animation-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Welcome, {user.firstName}</h1>
          <p>Your personal self-service portal for equipment and IT requests.</p>
        </div>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => navigate('/maintenance')}><Wrench size={16} /> Report Issue</button>
          <button className="btn btn-secondary" onClick={() => navigate('/booking')}><CalendarClock size={16} /> Book Resource</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        
        {/* My Equipment */}
        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.25rem' }}>
            <Package size={20} color="var(--primary)" /> My Assigned Equipment
          </h2>
          {allocations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {allocations.map(a => (
                <div key={a.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600 }}>{a.asset?.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tag: {a.asset?.assetTag}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>You have no assigned equipment.</p>
          )}
        </div>

        {/* Active IT Tickets */}
        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.25rem' }}>
            <Wrench size={20} color="var(--warning)" /> My IT Tickets
          </h2>
          {maintenance.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {maintenance.map(m => (
                <div key={m.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600 }}>{m.issue}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{m.asset?.name}</span>
                    <span className={`badge ${m.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}`}>{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No active IT tickets.</p>
          )}
        </div>

        {/* Upcoming Bookings */}
        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.25rem' }}>
            <CalendarClock size={20} color="var(--info)" /> Upcoming Bookings
          </h2>
          {bookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookings.map(b => (
                <div key={b.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600 }}>{b.asset?.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{new Date(b.startTime).toLocaleString()}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Purpose: {b.purpose}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No upcoming bookings.</p>
          )}
        </div>

      </div>
    </div>
  );
};
