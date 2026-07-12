import { useEffect, useState } from 'react';
import { Users, Building2, Tags, Plus, MoreHorizontal } from 'lucide-react';
import './Organization.css';

export const Organization = () => {
  const [activeTab, setActiveTab] = useState('DEPARTMENTS');
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const [deptRes, usersRes, catRes] = await Promise.all([
          fetch('/api/departments', { headers }),
          fetch('/api/users', { headers }),
          fetch('/api/categories', { headers })
        ]);

        setDepartments(await deptRes.json());
        setUsers(await usersRes.json());
        setCategories(await catRes.json());
      } catch (err) {
        console.error("Failed to fetch organization data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="org-page animation-fade-in">
      <div className="page-header">
        <div>
          <h1>Organization Setup</h1>
          <p>Manage departments, employees, and asset categories.</p>
        </div>
        <div className="quick-actions">
          <button className="btn btn-primary"><Plus size={16} /> Add New</button>
        </div>
      </div>

      <div className="tabs org-tabs">
        <button 
          className={`tab ${activeTab === 'DEPARTMENTS' ? 'active' : ''}`}
          onClick={() => setActiveTab('DEPARTMENTS')}
        >
          <Building2 size={18} /> Departments
        </button>
        <button 
          className={`tab ${activeTab === 'USERS' ? 'active' : ''}`}
          onClick={() => setActiveTab('USERS')}
        >
          <Users size={18} /> Employees
        </button>
        <button 
          className={`tab ${activeTab === 'CATEGORIES' ? 'active' : ''}`}
          onClick={() => setActiveTab('CATEGORIES')}
        >
          <Tags size={18} /> Categories
        </button>
      </div>

      <div className="card full-height-card">
        <div className="table-container">
          {loading ? (
            <div className="loading-state">Loading data...</div>
          ) : (
            <table>
              {activeTab === 'DEPARTMENTS' && (
                <>
                  <thead>
                    <tr>
                      <th>Department Name</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map(d => (
                      <tr key={d.id}>
                        <td className="font-medium">{d.name}</td>
                        <td><span className="badge badge-success">Active</span></td>
                        <td><button className="icon-btn"><MoreHorizontal size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
              
              {activeTab === 'USERS' && (
                <>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 50).map(u => ( // pagination mock
                      <tr key={u.id}>
                        <td className="font-medium">{u.firstName} {u.lastName}</td>
                        <td>{u.email}</td>
                        <td><span className="badge badge-secondary">{u.role}</span></td>
                        <td>{u.department?.name || 'N/A'}</td>
                        <td><span className="badge badge-success">Active</span></td>
                        <td><button className="icon-btn"><MoreHorizontal size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {activeTab === 'CATEGORIES' && (
                <>
                  <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(c => (
                      <tr key={c.id}>
                        <td className="font-medium">{c.name}</td>
                        <td><button className="icon-btn"><MoreHorizontal size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
