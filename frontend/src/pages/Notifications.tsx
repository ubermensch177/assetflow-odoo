import { useEffect, useState } from 'react';
import { CheckCircle2, BellRing } from 'lucide-react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: any;
    
    const fetchNotifs = async (isFirstLoad = false) => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/notifications', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } finally {
        if (isFirstLoad) setLoading(false);
      }
    };
    
    fetchNotifs(true);
    interval = setInterval(() => fetchNotifs(false), 5000); // Polling every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container animation-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Notifications</h1>
          <p>Central communication hub and system alerts.</p>
        </div>
        <div className="quick-actions">
          <button className="btn btn-secondary"><CheckCircle2 size={16} /> Mark all as read</button>
        </div>
      </div>
      <div className="card full-height-card" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            <BellRing size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>You have no new notifications.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map(n => (
              <div key={n.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: n.isRead ? 'transparent' : '#E5F0FF', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{n.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{n.message}</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
