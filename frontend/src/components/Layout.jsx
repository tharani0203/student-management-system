import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Students', to: '/students' },
  { label: 'Add Student', to: '/students/new' },
];

function Layout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-icon">S</div>
          <div>
            <h2>Student</h2>
            <small>Management</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">College Admin</p>
            <h1>Student Management System</h1>
          </div>
          <button className="primary-btn" onClick={() => window.location.assign('/students/new')}>
            Quick Add Student
          </button>
        </header>

        <div className="content-wrapper">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
