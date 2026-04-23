import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link${isActive ? ' nav-link--active' : ''}`;

  return (
    <>
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(11, 17, 32, 0.92);
          border-bottom: 1px solid var(--border-subtle);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .navbar-brand-icon {
          width: 32px;
          height: 32px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
        }
        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition);
        }
        .nav-link:hover { color: var(--text-primary); background: var(--bg-hover); }
        .nav-link--active { color: var(--text-primary); background: var(--bg-card); }
        .navbar-actions { display: flex; align-items: center; gap: 10px; }
        .user-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px 5px 8px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1;
        }
        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1;
          flex-shrink: 0;
        }
        /* Mobile */
        .mobile-menu { display: none; }
        .hamburger { display: none; background: none; border: none; color: var(--text-secondary); font-size: 1.4rem; padding: 4px; line-height: 1; width: 32px; height: 32px; align-items: center; justify-content: center; }
        @media (max-width: 768px) {
          .navbar-nav { display: none; }
          .hamburger { display: flex; }
          .navbar-actions .btn { display: none; }
          .user-badge { display: none; }
          .mobile-menu {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 12px 16px 16px;
            border-top: 1px solid var(--border-subtle);
            background: var(--bg-surface);
          }
          .mobile-menu .nav-link { display: block; padding: 10px 12px; }
          .mobile-menu-hidden { display: none !important; }
        }
      `}</style>

      <nav className="navbar">
        <div className="container">
          <div className="navbar-inner">
            <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/'} className="navbar-brand">
              <div className="navbar-brand-icon">🎓</div>
              Tech Academy
            </Link>

            <div className="navbar-nav">
              <NavLink to="/" className={navLinkClass} end>Home</NavLink>
              <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
              {isAuthenticated && (
                user.role === 'admin' ? (
                  <NavLink to="/admin/dashboard" className={navLinkClass}>Admin Panel</NavLink>
                ) : (
                  <NavLink to="/dashboard" className={navLinkClass}>My Courses</NavLink>
                )
              )}
            </div>

            <div className="navbar-actions">
              {isAuthenticated ? (
                <>
                  <div className="user-badge">
                    <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
                    <span>{user?.name?.split(' ')[0]}</span>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                  <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                </>
              )}
              <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        <div className={menuOpen ? 'mobile-menu' : 'mobile-menu mobile-menu-hidden'}>
          <NavLink to="/" className={navLinkClass} end onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/courses" className={navLinkClass} onClick={() => setMenuOpen(false)}>Courses</NavLink>
          {isAuthenticated && (
            user.role === 'admin' ? (
              <NavLink to="/admin/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>Admin Panel</NavLink>
            ) : (
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>My Courses</NavLink>
            )
          )}
          <div style={{ height: 8 }} />
          {isAuthenticated ? (
            <button className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }} onClick={handleLogout}>Sign Out</button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
