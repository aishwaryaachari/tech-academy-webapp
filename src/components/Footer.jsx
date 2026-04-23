import { Link } from 'react-router-dom';

const Footer = () => (
  <>
    <style>{`
      .footer {
        border-top: 1px solid var(--border-subtle);
        background: var(--bg-surface);
        padding: 40px 0 28px;
      }
      .footer-inner {
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr;
        gap: 40px;
        margin-bottom: 36px;
      }
      .footer-brand {
        display: flex; align-items: center; gap: 8px;
        font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 10px;
        line-height: 1;
      }
      .footer-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.65; }
      .footer-col-title {
        font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
        text-transform: uppercase; color: var(--text-muted); margin-bottom: 14px;
      }
      .footer-links { list-style: none; display: flex; flex-direction: column; gap: 9px; }
      .footer-links a { font-size: 0.85rem; color: var(--text-secondary); transition: color var(--transition); }
      .footer-links a:hover { color: var(--text-primary); }
      .footer-bottom {
        padding-top: 20px; border-top: 1px solid var(--border-subtle);
        display: flex; align-items: center; justify-content: space-between;
        font-size: 0.78rem; color: var(--text-muted);
      }
      @media (max-width: 768px) {
        .footer-inner { grid-template-columns: 1fr; gap: 28px; }
        .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
      }
    `}</style>
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">🎓 Tech Academy</div>
            <p className="footer-desc">Empowering learners with practical, industry-relevant tech education.</p>
          </div>
          <div>
            <p className="footer-col-title">Platform</p>
            <ul className="footer-links">
              <li><Link to="/courses">Browse Courses</Link></li>
              <li><Link to="/register">Get Started</Link></li>
              <li><Link to="/dashboard">My Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <p className="footer-col-title">Categories</p>
            <ul className="footer-links">
              <li><Link to="/courses?category=Web Development">Web Development</Link></li>
              <li><Link to="/courses?category=Data Science">Data Science</Link></li>
              <li><Link to="/courses?category=Cloud %26 DevOps">Cloud & DevOps</Link></li>
              <li><Link to="/courses?category=Design">Design</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Tech Academy. All rights reserved.</span>
          <span>Built for learning.</span>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;
