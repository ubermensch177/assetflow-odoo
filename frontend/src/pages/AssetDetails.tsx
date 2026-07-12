import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const AssetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`/api/assets/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          setAsset(await res.json());
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [id]);

  if (loading) return <div className="page-container"><div className="loading-state">Loading asset details...</div></div>;
  if (!asset) return <div className="page-container"><div className="loading-state text-danger">Asset not found.</div></div>;

  const intl = asset.intelligence || {};

  // Calculate dynamic utilization timeline based on allocations and bookings
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  // Simplified dynamic metric: baseline 60% + variations based on number of recent bookings
  const bookingCount = asset.bookings ? asset.bookings.length : 0;
  const dynamicUtilization = months.map((_, idx) => Math.min(100, 60 + (bookingCount * 2) + (idx * 5) - (intl.downtimeDays > 10 ? 15 : 0)));

  const timelineData = {
    labels: months,
    datasets: [{
      label: 'Utilization %',
      data: dynamicUtilization,
      borderColor: '#0F62FE',
      tension: 0.4
    }]
  };

  return (
    <div className="page-container animation-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div className="page-header" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={() => navigate('/assets')} className="icon-btn" style={{ background: 'white', padding: '0.5rem', borderRadius: '8px' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {asset.name} 
            <span className={`badge ${asset.status === 'AVAILABLE' ? 'badge-success' : 'badge-warning'}`}>{asset.status}</span>
          </h1>
          <p>Tag: {asset.assetTag} | Category: {asset.category?.name}</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(asset.assetTag)}`} 
            alt={`QR Code for ${asset.assetTag}`}
            style={{ borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', padding: '4px' }}
          />
        </div>
      </div>

      {intl.replacementRecommendation && (
        <div style={{ backgroundColor: '#FFF1F1', border: '1px solid #FA4D56', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center', color: '#DA1E28' }}>
          <AlertTriangle size={24} />
          <div>
            <h4 style={{ fontWeight: 600 }}>Replacement Recommended</h4>
            <p style={{ fontSize: '0.875rem' }}>This asset has a low health score or its maintenance costs exceed 70% of its value.</p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="card kpi-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Health Score</span>
            <Activity size={20} color={intl.healthScore > 70 ? 'var(--success)' : 'var(--danger)'} />
          </div>
          <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>{intl.healthScore}/100</h2>
        </div>
        
        <div className="card kpi-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Useful Life</span>
            <Calendar size={20} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>{intl.remainingUsefulLifeMonths} mo</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Warranty: {intl.warrantyDaysLeft} days left</span>
        </div>

        <div className="card kpi-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total Cost of Ownership</span>
            <DollarSign size={20} color="var(--warning)" />
          </div>
          <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>${intl.tco?.toLocaleString()}</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Downtime: {intl.downtimeDays || 0} days</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Utilization Timeline</h3>
          <div style={{ height: '300px' }}>
            <Line data={timelineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontWeight: 600 }}>Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Purchase Date</span><span>{new Date(asset.purchaseDate).toLocaleDateString()}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Purchase Cost</span><span>${asset.purchaseCost?.toLocaleString()}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Location</span><span>{asset.location || 'HQ'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Department</span><span>{asset.department?.name || 'Unassigned'}</span></div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Maintenance History</h3>
        {asset.maintenanceReqs && asset.maintenanceReqs.length > 0 ? (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.5rem 0' }}>Issue</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {asset.maintenanceReqs.map((req: any) => (
                <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 0' }}>{req.issue}</td>
                  <td><span className="badge badge-secondary">{req.status}</span></td>
                  <td>${req.cost?.toLocaleString() || '0'}</td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No maintenance records found.</p>
        )}
      </div>
      
    </div>
  );
};
