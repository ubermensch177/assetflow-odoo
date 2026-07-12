import React, { useEffect, useState } from 'react';
import { EmployeeDashboard } from './EmployeeDashboard';
import { 
  Package, 
  ArrowRightLeft, 
  Wrench, 
  CalendarClock, 
  AlertCircle, 
  CheckCircle2,
  Plus,
  Monitor
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const kpiRes = await fetch('/api/dashboard/kpis', { headers });
        const kpiData = await kpiRes.json();
        setKpis(kpiData);

        const actRes = await fetch('/api/dashboard/activities', { headers });
        const actData = await actRes.json();
        setActivities(actData);
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = {
    labels: ['IT', 'HR', 'Finance', 'Operations', 'Sales', 'Engineering'],
    datasets: [
      {
        label: 'Allocated Assets',
        data: [45, 12, 18, 30, 22, 60],
        backgroundColor: '#0F62FE',
        borderRadius: 4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#E0E0E0' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Operational Dashboard</h1>
          <p>Overview of enterprise asset lifecycle and current statuses.</p>
        </div>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => navigate('/assets')}><Plus size={16} /> Register Asset</button>
          <button className="btn btn-secondary" onClick={() => navigate('/booking')}><CalendarClock size={16} /> Book Resource</button>
          <button className="btn btn-secondary" onClick={() => navigate('/maintenance')}><Wrench size={16} /> Raise Maintenance</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="kpi-card glass-panel">
          <div className="kpi-icon icon-success"><CheckCircle2 size={24} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Assets Available</span>
            <span className="kpi-value">{kpis ? kpis.availableAssets : '...'}</span>
          </div>
        </div>
        
        <div className="kpi-card glass-panel">
          <div className="kpi-icon icon-primary"><Monitor size={24} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Assets Allocated</span>
            <span className="kpi-value">{kpis ? kpis.allocatedAssets : '...'}</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon icon-warning"><Wrench size={24} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Under Maintenance</span>
            <span className="kpi-value">{kpis ? kpis.maintenanceAssets : '...'}</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon icon-info"><CalendarClock size={24} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Active Bookings</span>
            <span className="kpi-value">{kpis ? kpis.activeBookings : '...'}</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon icon-secondary"><ArrowRightLeft size={24} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Pending Transfers</span>
            <span className="kpi-value">{kpis ? kpis.pendingTransfers : '...'}</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon icon-danger"><AlertCircle size={24} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Upcoming Returns</span>
            <span className="kpi-value">12</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="card chart-card">
          <h2>Department Allocation Overview</h2>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="card activity-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p className="activity-desc">{act.description}</p>
                    <span className="activity-time">{new Date(act.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading activities...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const [role, setRole] = useState<string>('EMPLOYEE');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setRole(user.role || 'EMPLOYEE');
    }
  }, []);

  if (role === 'EMPLOYEE') {
    return <EmployeeDashboard />;
  }
  
  return <AdminDashboard />;
};
