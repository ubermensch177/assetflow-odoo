import { useEffect, useState } from 'react';
import { Users, Building2, Tags, Plus, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal/Modal';
import './Organization.css';

export const Organization = () => {
  const [activeTab, setActiveTab] = useState('DEPARTMENTS');
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', headId: '', description: '', firstName: '', lastName: '', email: '', role: 'EMPLOYEE', departmentId: '' 
  });

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

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    
    let url = '';
    let payload = {};

    if (activeTab === 'DEPARTMENTS') {
      url = '/api/departments';
      payload = { name: formData.name, headId: formData.headId };
    } else if (activeTab === 'USERS') {
      url = '/api/users';
      payload = { 
        firstName: formData.firstName, lastName: formData.lastName, 
        email: formData.email, role: formData.role, departmentId: formData.departmentId 
      };
    } else if (activeTab === 'CATEGORIES') {
      url = '/api/categories';
      payload = { name: formData.name, description: formData.description };
    }

    try {
      const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', headId: '', description: '', firstName: '', lastName: '', email: '', role: 'EMPLOYEE', departmentId: '' });
        // Refresh by reloading page or re-fetching
        window.location.reload(); 
      } else {
        alert("Failed to add new entry.");
      }
    } catch (err) {
      console.error(err);
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
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={16} /> Add New</button>
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
                      <th>ID</th>
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
                        <td className="text-secondary font-mono text-sm">{u.id}</td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add New ${activeTab.slice(0, -1).toLowerCase()}`}>
        <form onSubmit={handleAddNew}>
          {activeTab === 'DEPARTMENTS' && (
            <>
              <div className="form-group">
                <label>Department Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Head User</label>
                <select value={formData.headId} onChange={e => setFormData({...formData, headId: e.target.value})}>
                  <option value="">None</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                </select>
              </div>
            </>
          )}

          {activeTab === 'USERS' && (
            <>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>First Name</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Last Name</label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Role</label>
                  <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="DEPT_HEAD">Department Head</option>
                    <option value="ASSET_MANAGER">Asset Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Department</label>
                  <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})}>
                    <option value="">None</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === 'CATEGORIES' && (
            <>
              <div className="form-group">
                <label>Category Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
