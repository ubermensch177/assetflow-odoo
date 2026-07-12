import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Monitor, 
  ArrowRightLeft, 
  CalendarClock, 
  Wrench, 
  ClipboardCheck, 
  PieChart, 
  Bell,
  LogOut,
  Search
} from 'lucide-react';
import './Layout.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPT_HEAD', 'EMPLOYEE'] },
  { path: '/organization', label: 'Organization Setup', icon: Building2, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPT_HEAD'] },
  { path: '/assets', label: 'Assets', icon: Monitor, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPT_HEAD'] },
  { path: '/allocation', label: 'My Assets / Allocations', icon: ArrowRightLeft, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPT_HEAD', 'EMPLOYEE'] },
  { path: '/booking', label: 'Resource Booking', icon: CalendarClock, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPT_HEAD', 'EMPLOYEE'] },
  { path: '/maintenance', label: 'Maintenance / Helpdesk', icon: Wrench, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPT_HEAD', 'EMPLOYEE'] },
  { path: '/audit', label: 'Audit', icon: ClipboardCheck, roles: ['ADMIN', 'ASSET_MANAGER'] },
  { path: '/reports', label: 'Reports', icon: PieChart, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPT_HEAD'] },
  { path: '/notifications', label: 'Notifications', icon: Bell, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPT_HEAD', 'EMPLOYEE'] },
];

export const Layout = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{assets: any[], users: any[], departments: any[]} | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults(null);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setSearchResults(await res.json());
        }
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon"></div>
            <span>AssetFlow ERP</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.filter(item => {
            const userStr = localStorage.getItem('user');
            const role = userStr ? JSON.parse(userStr).role : 'EMPLOYEE';
            return item.roles.includes(role);
          }).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="topbar glass-panel">
          <div className="search-bar" style={{ position: 'relative' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Global Search (Asset, Employee, Serial...)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => setTimeout(() => setSearchQuery(''), 200)}
            />
            {searchQuery.length >= 2 && (
              <div className="search-dropdown" style={{
                position: 'absolute', top: '100%', left: 0, width: '400px', backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: '400px', overflowY: 'auto'
              }}>
                {isSearching ? <p style={{ fontSize: '0.875rem' }}>Searching...</p> : (
                  <>
                    {searchResults?.assets.length ? (
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Assets</h4>
                        {searchResults.assets.map((a: any) => (
                          <div key={a.id} className="cursor-pointer hover-row" style={{ padding: '0.5rem', borderRadius: '4px' }} onMouseDown={() => navigate(`/assets/${a.id}`)}>
                            <div style={{ fontWeight: 500 }}>{a.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{a.assetTag}</div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {searchResults?.users.length ? (
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Users</h4>
                        {searchResults.users.map((u: any) => (
                          <div key={u.id} className="cursor-pointer hover-row" style={{ padding: '0.5rem', borderRadius: '4px' }} onMouseDown={() => navigate(`/organization`)}>
                            <div style={{ fontWeight: 500 }}>{u.firstName} {u.lastName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {!searchResults?.assets.length && !searchResults?.users.length && !searchResults?.departments.length && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No results found.</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="topbar-actions">
            <button className="icon-btn" onClick={() => navigate('/notifications')}>
              <Bell size={20} />
              <span className="badge-dot"></span>
            </button>
            <div className="user-profile">
              <div className="avatar">
                {(() => {
                  const uStr = localStorage.getItem('user');
                  const u = uStr ? JSON.parse(uStr) : { firstName: 'S', lastName: 'A' };
                  return `${u.firstName?.charAt(0) || ''}${u.lastName?.charAt(0) || ''}`.toUpperCase();
                })()}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {(() => {
                    const uStr = localStorage.getItem('user');
                    const u = uStr ? JSON.parse(uStr) : { firstName: 'System', lastName: 'Admin' };
                    return `${u.firstName} ${u.lastName}`;
                  })()}
                </span>
                <span className="user-role">
                  {(() => {
                    const uStr = localStorage.getItem('user');
                    const u = uStr ? JSON.parse(uStr) : { role: 'ADMIN' };
                    return u.role;
                  })()}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
