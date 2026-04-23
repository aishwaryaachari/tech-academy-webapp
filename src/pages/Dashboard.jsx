import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyEnrollments, unenrollCourse } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unenrolling, setUnenrolling] = useState(null);

  const load = async () => {
    try {
      const res = await fetchMyEnrollments();
      setEnrollments(res.data.enrollments);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleUnenroll = async (courseId, title) => {
    if (!window.confirm(`Unenroll from "${title}"?`)) return;
    setUnenrolling(courseId);
    try {
      await unenrollCourse(courseId);
      setEnrollments(p => p.filter(e => e.courseId !== courseId));
    } catch (e) { console.error(e); }
    finally { setUnenrolling(null); }
  };

  const completed = enrollments.filter(e => e.progress === 100).length;
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / enrollments.length)
    : 0;

  const progressColor = (p) => p === 100 ? '#4ade80' : p >= 50 ? '#60a5fa' : 'var(--text-primary)';

  const levelIcon = { Beginner: '🟢', Intermediate: '🟡', Advanced: '🔴' };

  return (
    <>
      <style>{`
        .db-header { background: var(--bg-surface); border-bottom: 1px solid var(--border-subtle); padding: 40px 0 36px; }
        .db-greeting { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
        .db-name { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; }
        .db-stats { display: flex; gap: 16px; margin-top: 28px; flex-wrap: wrap; }
        .db-stat {
          background: var(--bg-card); border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md); padding: 18px 28px;
          display: flex; flex-direction: column; gap: 4px; min-width: 130px;
        }
        .db-stat-value { font-size: 1.8rem; font-weight: 900; line-height: 1; }
        .db-stat-label { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }
        .db-body { padding: 48px 0 80px; }
        .course-list { display: flex; flex-direction: column; gap: 20px; }
        .course-row {
          background: var(--bg-card); border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg); overflow: hidden;
          display: grid; grid-template-columns: 160px 1fr auto;
          transition: border-color 0.2s;
        }
        .course-row:hover { border-color: var(--border); }
        .course-row-thumb { position: relative; overflow: hidden; background: var(--bg-surface); }
        .course-row-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .course-row-thumb-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
        .course-row-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 8px; }
        .course-row-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .course-row-category { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); }
        .course-row-title { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); line-height: 1.3; }
        .course-row-instructor { font-size: 0.78rem; color: var(--text-muted); }
        .course-row-progress-wrap { margin-top: 4px; }
        .course-row-progress-labels { display: flex; justify-content: space-between; font-size: 0.72rem; margin-bottom: 5px; }
        .course-row-progress-bar { width: 100%; height: 6px; background: var(--border-subtle); border-radius: 3px; overflow: hidden; }
        .course-row-progress-fill { height: 100%; border-radius: 3px; transition: width 0.4s ease; }
        .course-row-actions { padding: 20px 20px 20px 0; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; justify-content: center; }
        .completed-badge-full { display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 99px; background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); }
        @media (max-width: 700px) {
          .course-row { grid-template-columns: 1fr; }
          .course-row-thumb { height: 140px; }
          .course-row-actions { flex-direction: row; padding: 0 20px 20px; }
        }
      `}</style>

      {/* Header */}
      <div className="db-header">
        <div className="container">
          <p className="db-greeting">My Courses</p>
          <h1 className="db-name">Hello, {user?.name} 👋</h1>
          <div className="db-stats">
            <div className="db-stat">
              <span className="db-stat-value">{enrollments.length}</span>
              <span className="db-stat-label">Enrolled</span>
            </div>
            <div className="db-stat">
              <span className="db-stat-value" style={{ color: '#4ade80' }}>{completed}</span>
              <span className="db-stat-label">Completed</span>
            </div>
            <div className="db-stat">
              <span className="db-stat-value" style={{ color: progressColor(avgProgress) }}>{avgProgress}%</span>
              <span className="db-stat-label">Avg. Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="db-body">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <p className="section-label">Learning</p>
              <h2 className="section-title" style={{ fontSize: '1.5rem' }}>My Courses</h2>
            </div>
            <Link to="/courses" className="btn btn-outline btn-sm">Browse Courses →</Link>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : enrollments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <div className="empty-state-title">No courses yet</div>
              <p className="empty-state-text" style={{ marginBottom: 20 }}>Browse our catalog and enroll in your first course.</p>
              <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
            </div>
          ) : (
            <div className="course-list fade-up">
              {enrollments.map(e => {
                const prog = e.progress || 0;
                return (
                  <div key={e.id} className="course-row">
                    {/* Thumbnail */}
                    <div className="course-row-thumb">
                      {e.course?.thumbnail
                        ? <img src={e.course.thumbnail} alt={e.course.title} loading="lazy" />
                        : <div className="course-row-thumb-placeholder">📚</div>
                      }
                    </div>

                    {/* Info */}
                    <div className="course-row-body">
                      <div className="course-row-meta">
                        <span className="course-row-category">{e.course?.category}</span>
                        <span className="badge">{e.course?.level}</span>
                        {prog === 100 && <span className="completed-badge-full">✓ Completed</span>}
                      </div>
                      <div className="course-row-title">{e.course?.title}</div>
                      <div className="course-row-instructor">
                        👩‍💻 {e.course?.instructor} · ⏱ {e.course?.duration}
                      </div>
                      <div className="course-row-progress-wrap">
                        <div className="course-row-progress-labels">
                          <span style={{ color: 'var(--text-muted)' }}>Chapter Progress</span>
                          <span style={{ fontWeight: 700, color: progressColor(prog) }}>{prog}%</span>
                        </div>
                        <div className="course-row-progress-bar">
                          <div className="course-row-progress-fill" style={{ width: `${prog}%`, background: progressColor(prog) }} />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="course-row-actions">
                      <Link to={`/courses/${e.courseId}`} className="btn btn-primary btn-sm">
                        {prog === 0 ? 'Start →' : prog === 100 ? 'Review →' : 'Continue →'}
                      </Link>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}
                        onClick={() => handleUnenroll(e.courseId, e.course?.title)}
                        disabled={unenrolling === e.courseId}
                      >
                        {unenrolling === e.courseId ? '...' : 'Unenroll'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
