import { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const Reports = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/reports/analytics', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setAnalytics(await res.json());
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="page-container"><div className="loading-state">Loading Analytics...</div></div>;
  if (!analytics) return <div className="page-container"><div className="loading-state">Failed to load analytics.</div></div>;

  const { kpis, charts, vendorPerformance, procurementSuggestions } = analytics;

  // Chart Data Preparation
  const deptData = {
    labels: charts.deptAllocations.map((d: any) => d.name),
    datasets: [{
      data: charts.deptAllocations.map((d: any) => d.count),
      backgroundColor: ['#0F62FE', '#24A148', '#FA4D56', '#8A3FFC', '#F1C21B', '#002D9C']
    }]
  };

  const conditionLabels = charts.assetCondition.map((c: any) => c.condition);
  const conditionData = {
    labels: conditionLabels,
    datasets: [{
      label: 'Asset Condition',
      data: charts.assetCondition.map((c: any) => c._count.id),
      backgroundColor: ['#0F62FE', '#24A148', '#FA4D56', '#F1C21B']
    }]
  };

  const vendorChartData = {
    labels: vendorPerformance.map((v: any) => v.vendor),
    datasets: [
      {
        label: 'Total Maint. Cost ($)',
        data: vendorPerformance.map((v: any) => v.totalMaintenanceCost),
        backgroundColor: '#FA4D56'
      },
      {
        label: 'Avg Health Score',
        data: vendorPerformance.map((v: any) => v.avgHealthScore),
        backgroundColor: '#24A148'
      }
    ]
  };

  return (
    <div className="page-container animation-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="page-header">
        <h1>Enterprise Analytics</h1>
        <p>Comprehensive insights, lifecycle ROI, and procurement forecasting.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="card kpi-card">
          <span style={{ color: 'var(--text-secondary)' }}>Total Portfolio Value</span>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>${kpis.totalPortfolioValue?.toLocaleString()}</h2>
        </div>
        <div className="card kpi-card">
          <span style={{ color: 'var(--text-secondary)' }}>Lifecycle Maint. Costs</span>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--danger)' }}>${kpis.totalMaintenanceCost?.toLocaleString()}</h2>
        </div>
        <div className="card kpi-card">
          <span style={{ color: 'var(--text-secondary)' }}>Capacity (Available)</span>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--success)' }}>{kpis.availableAssets} / {kpis.totalAssets}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Top Vendors (Maintenance Cost vs Health)</h3>
          <div style={{ height: '300px' }}>
            <Bar data={vendorChartData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Department Allocation Mix</h3>
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Pie data={deptData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 600, color: 'var(--danger)' }}>Procurement Action Required (Replacement Candidates)</h3>
        {procurementSuggestions.length > 0 ? (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem 0' }}>Asset Tag</th>
                <th>Name</th>
                <th>Health Score</th>
                <th>Total Cost of Ownership</th>
              </tr>
            </thead>
            <tbody>
              {procurementSuggestions.map((a: any) => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 0', fontWeight: 500 }}>{a.assetTag}</td>
                  <td>{a.name}</td>
                  <td><span className="badge badge-warning">{a.healthScore}/100</span></td>
                  <td>${a.tco?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No assets currently require replacement.</p>
        )}
      </div>

    </div>
  );
};
