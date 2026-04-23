import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { fetchCourses } from '../api/client';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';

const STATS = [
  { value: '10+', label: 'Courses' },
  { value: '5', label: 'Categories' },
  { value: '100%', label: 'Free' },
  { value: '∞', label: 'Learners' },
];

const Home = () => {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  useEffect(() => {
    fetchCourses()
      .then(res => setFeatured(res.data.courses.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        .hero {
          position: relative;
          padding: 120px 0 100px;
          overflow: hidden;
          border-bottom: 1px solid var(--border-subtle);
        }
        /* Tech Grid Background */
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
          z-index: 0;
        }
        .hero-container {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .hero-label {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--text-primary);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 99px; padding: 6px 16px; margin-bottom: 32px;
          backdrop-filter: blur(8px);
        }
        .hero-label span {
          width: 6px; height: 6px; background: #fff; border-radius: 50%;
          box-shadow: 0 0 10px #fff;
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800; line-height: 1.1; letter-spacing: -0.04em;
          color: var(--text-primary); max-width: 900px; margin-bottom: 24px;
        }
        .hero-title span { color: var(--text-muted); }
        .hero-subtitle {
          font-size: 1.15rem; color: var(--text-secondary);
          max-width: 600px; line-height: 1.7; margin-bottom: 48px;
        }
        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
        
        .stats-bar {
          display: flex; gap: 0;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg); overflow: hidden;
          margin-top: 80px; background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          width: 100%; max-width: 900px;
        }
        .stat-item {
          flex: 1; padding: 24px; text-align: center;
          border-right: 1px solid var(--border-subtle);
        }
        .stat-item:last-child { border-right: none; }
        .stat-value { font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
        
        .featured-section { padding: 96px 0; position: relative; }
        .featured-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 48px; flex-wrap: wrap; gap: 16px;
        }
        @media (max-width: 768px) {
          .hero { padding: 80px 0 60px; }
          .stats-bar { flex-wrap: wrap; border-radius: var(--radius-md); }
          .stat-item { min-width: 50%; padding: 20px 16px; border-bottom: 1px solid var(--border-subtle); }
          .stat-item:nth-child(even) { border-right: none; }
          .stat-item:nth-last-child(-n+2) { border-bottom: none; }
        }
      `}</style>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-container fade-up">
          <div className="hero-label">
            <span /> Free Tech Education
          </div>
          <h1 className="hero-title">
            Master the skills that<br />
            <span>shape the future.</span>
          </h1>
          <p className="hero-subtitle">
            Premium, expert-led courses in web development, data science, and cloud computing. No paywalls, no credit cards required.
          </p>
          <div className="hero-actions">
            <Link to="/courses" className="btn btn-primary btn-lg">Explore Catalog</Link>
            <Link to="/register" className="btn btn-outline btn-lg">Start Learning</Link>
          </div>

          <div className="stats-bar">
            {STATS.map(s => (
              <div key={s.label} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <div>
              <p className="section-label">Curated</p>
              <h2 className="section-title">Popular Courses</h2>
            </div>
            <Link to="/courses" className="btn btn-outline">View All Courses →</Link>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="grid-courses fade-up">
              {featured.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
