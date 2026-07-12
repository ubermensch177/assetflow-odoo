import { useEffect, useState } from 'react';
import { Users, Building2, Tags, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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

  const handleEditCategory = async (id: number, currentName: string) => {
    const newName = prompt("Enter new category name:", currentName);
    if (!newName || newName === currentName) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        setCategories(categories.map(c => c.id === id ? { ...c, name: newName } : c));
      } else {
        alert("Failed to update category.");
      }
    } catch (err) {
      alert("Error updating category.");
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        alert("Failed to delete category (it may be in use).");
      }
    } catch (err) {
      alert("Error deleting category.");
    }
  };

  const handleEditUser = async (id: number, currentRole: string) => {
    const newRole = prompt("Enter new role (ADMIN, ASSET_MANAGER, DEPT_HEAD, EMPLOYEE):", currentRole);
    if (!newRole || newRole === currentRole) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map(u => u.id === id ? updatedUser : u));
      } else {
        alert("Failed to update user.");
      }
    } catch (err) {
      alert("Error updating user.");
    }
  };

  const handleDeleteUser = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the user "${name}"?`)) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      alert("Error deleting user.");
    }
  };

  const handleEditDepartment = async (id: number, currentName: string) => {
    const newName = prompt("Enter new department name:", currentName);
    if (!newName || newName === currentName) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/departments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        const updatedDept = await res.json();
        setDepartments(departments.map(d => d.id === id ? updatedDept : d));
      } else {
        alert("Failed to update department.");
      }
    } catch (err) {
      alert("Error updating department.");
    }
  };

  const handleDeleteDepartment = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the department "${name}"?`)) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setDepartments(departments.filter(d => d.id !== id));
      } else {
        alert("Failed to delete department (it may be in use).");
      }
    } catch (err) {
      alert("Error deleting department.");
    }
  };

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
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="icon-btn text-blue-500 hover:bg-blue-50" title="Edit" onClick={() => handleEditDepartment(d.id, d.name)}>
                              <Edit size={16}/>
                            </button>
                            <button className="icon-btn text-red-500 hover:bg-red-50" title="Delete" onClick={() => handleDeleteDepartment(d.id, d.name)}>
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        </td>
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
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="icon-btn text-blue-500 hover:bg-blue-50" title="Edit Role" onClick={() => handleEditUser(u.id, u.role)}>
                              <Edit size={16}/>
                            </button>
                            <button className="icon-btn text-red-500 hover:bg-red-50" title="Delete" onClick={() => handleDeleteUser(u.id, `${u.firstName} ${u.lastName}`)}>
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        </td>
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
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="icon-btn text-blue-500 hover:bg-blue-50" title="Edit" onClick={() => handleEditCategory(c.id, c.name)}>
                              <Edit size={16}/>
                            </button>
                            <button className="icon-btn text-red-500 hover:bg-red-50" title="Delete" onClick={() => handleDeleteCategory(c.id, c.name)}>
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        </td>
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
