import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { user } = useAuth();
  
  return (
    <>
      <style>{`
        .auth-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-base);
        }
        .auth-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 40px;
          position: relative;
        }
        .auth-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.125rem;
          font-weight: 800;
          color: var(--text-primary);
          text-decoration: none;
          margin-bottom: auto;
        }
        .auth-header-icon {
          width: 32px;
          height: 32px;
          background: var(--text-primary);
          color: var(--bg-base);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .auth-content {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .auth-footer-text {
          margin-top: auto;
          font-size: 0.8rem;
          color: var(--text-muted);
          text-align: center;
        }
        .auth-right {
          flex: 1.2;
          background: var(--bg-surface);
          border-left: 1px solid var(--border-subtle);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
        }
        .auth-right::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, var(--border-subtle) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.3;
        }
        .auth-right::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%);
        }
        .auth-quote-wrapper {
          position: relative;
          z-index: 10;
          max-width: 500px;
          margin: 0 auto;
        }
        .auth-quote {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }
        .auth-author {
          font-size: 1rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .auth-author::before {
          content: '';
          display: block;
          width: 30px;
          height: 1px;
          background: var(--text-secondary);
        }
        @media (max-width: 900px) {
          .auth-right { display: none; }
          .auth-left { padding: 24px; }
        }
      `}</style>
      <div className="auth-layout">
        <div className="auth-left">
          <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/'} className="auth-header">
            <div className="auth-header-icon">🎓</div>
            Tech Academy
          </Link>
          
          <div className="auth-content fade-in">
            <Outlet />
          </div>

          <div className="auth-footer-text">
            © {new Date().getFullYear()} Tech Academy. Designed for excellence.
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-quote-wrapper fade-up">
            <p className="auth-quote">
              "Mastering technology is no longer an option, it's a necessity. Build the skills that will shape the future."
            </p>
            <div className="auth-author">Tech Academy Vision</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
