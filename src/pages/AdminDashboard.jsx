import { useEffect, useState } from 'react';
import { fetchCourses, deleteCourseAdmin, fetchAllUsersAdmin, fetchAllEnrollmentsAdmin } from '../api/client';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesRes, usersRes, enrollmentsRes] = await Promise.all([
        fetchCourses(), fetchAllUsersAdmin(), fetchAllEnrollmentsAdmin()
      ]);
      setCourses(coursesRes.data.courses);
      setUsers(usersRes.data.users);
      setEnrollments(enrollmentsRes.data.enrollments);
    } catch { setMessage({ type: 'error', text: 'Failed to load platform data.' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteCourseAdmin(id);
      setMessage({ type: 'success', text: 'Course deleted.' });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete.' });
    }
  };

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Build per-user progress map from enrollments
  const userProgress = users
    .filter(u => u.role === 'student')
    .map(u => {
      const ue = enrollments.filter(e => e.user?.id === u.id);
      const avg = ue.length > 0 ? Math.round(ue.reduce((s, e) => s + (e.progress || 0), 0) / ue.length) : 0;
      return { ...u, enrollments: ue, avg };
    });

  const progressColor = (p) => p === 100 ? '#4ade80' : p >= 50 ? '#60a5fa' : '#94a3b8';

  return (
    <>
      <style>{`
        .admin-header { background: var(--bg-surface); border-bottom: 1px solid var(--border-subtle); padding: 48px 0; }
        .admin-title { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
        .admin-subtitle { color: var(--text-secondary); font-size: 0.95rem; }
        .admin-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: -32px; margin-bottom: 48px; }
        .admin-stat-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm); }
        .admin-stat-value { font-size: 2rem; font-weight: 800; color: var(--text-primary); line-height: 1; margin-bottom: 8px; }
        .admin-stat-label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
        .admin-tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px; }
        .admin-tab { padding: 8px 16px; border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); background: transparent; border: none; cursor: pointer; transition: all var(--transition); }
        .admin-tab:hover { color: var(--text-primary); background: rgba(255,255,255,0.05); }
        .admin-tab.active { color: var(--text-inverse); background: var(--text-primary); }
        .admin-table-container { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 600px; }
        .admin-table th, .admin-table td { padding: 16px 24px; border-bottom: 1px solid var(--border-subtle); }
        .admin-table th { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); background: rgba(0,0,0,0.2); }
        .admin-table td { font-size: 0.9rem; color: var(--text-primary); }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: var(--bg-hover); }
        .progress-bar-wrap { width: 100%; height: 6px; background: var(--border-subtle); border-radius: 3px; overflow: hidden; margin-top: 4px; }
        .progress-bar-fill { height: 100%; border-radius: 3px; transition: width 0.4s ease; }
        .user-progress-row { padding: 20px 24px; border-bottom: 1px solid var(--border-subtle); }
        .user-progress-row:last-child { border-bottom: none; }
        .user-course-list { margin-top: 12px; display: flex; flex-direction: column; gap: 10px; }
        .user-course-item { background: rgba(0,0,0,0.15); border-radius: var(--radius-sm); padding: 12px 16px; }
        .user-course-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .user-course-title { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
        .user-course-pct { font-size: 0.8rem; font-weight: 700; }
        .completed-badge { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 8px; border-radius: 99px; background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
        @media (max-width: 768px) { .admin-stats { grid-template-columns: 1fr; } }
      `}</style>

      <div className="admin-header fade-in">
        <div className="container">
          <h1 className="admin-title">Admin Analytics Hub</h1>
          <p className="admin-subtitle">Welcome back, {user?.name}. Here is the platform overview.</p>
        </div>
      </div>

      <div className="page fade-up">
        <div className="container">
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-value">{users.length}</div>
              <div className="admin-stat-label">Total Users</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{enrollments.length}</div>
              <div className="admin-stat-label">Total Enrollments</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{courses.length}</div>
              <div className="admin-stat-label">Total Courses</div>
            </div>
          </div>

          {message && <div className={`alert alert-${message.type}`} style={{ marginBottom: 24 }}>{message.text}</div>}

          <div className="admin-tabs">
            {['courses', 'users', 'progress', 'enrollments'].map(tab => (
              <button key={tab} className={`admin-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab === 'progress' ? '📊 User Progress' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
            <div className="admin-table-container">

              {/* ── COURSES ── */}
              {activeTab === 'courses' && (
                <table className="admin-table">
                  <thead><tr>
                    <th>Course Title</th><th>Category</th><th>Level</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr></thead>
                  <tbody>
                    {courses.map(c => (
                      <tr key={c.id}>
                        <td><strong>{c.title}</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {c.instructor}</div></td>
                        <td>{c.category}</td>
                        <td><span className="badge">{c.level}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDeleteCourse(c.id, c.title)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {courses.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: 32 }}>No courses found.</td></tr>}
                  </tbody>
                </table>
              )}

              {/* ── USERS ── */}
              {activeTab === 'users' && (
                <table className="admin-table">
                  <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td>
                          <span className="badge" style={u.role === 'admin' ? { background: 'rgba(74,222,128,0.1)', borderColor: 'rgba(74,222,128,0.3)', color: '#86efac' } : {}}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{fmt(u.createdAt)}</td>
                      </tr>
                    ))}
                    {users.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: 32 }}>No users found.</td></tr>}
                  </tbody>
                </table>
              )}

              {/* ── USER PROGRESS ── */}
              {activeTab === 'progress' && (
                <div>
                  {userProgress.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>No student progress data available.</div>
                  )}
                  {userProgress.map(u => (
                    <div key={u.id} className="user-progress-row">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <strong style={{ fontSize: '1rem' }}>{u.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.enrollments.length} course{u.enrollments.length !== 1 ? 's' : ''}</span>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 2 }}>Avg. Progress</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: progressColor(u.avg) }}>{u.avg}%</div>
                          </div>
                        </div>
                      </div>

                      {u.enrollments.length > 0 && (
                        <div className="user-course-list">
                          {u.enrollments.map(e => (
                            <div key={e.id} className="user-course-item">
                              <div className="user-course-header">
                                <span className="user-course-title">{e.course?.title}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  {e.progress === 100 && <span className="completed-badge">✓ Completed</span>}
                                  <span className="user-course-pct" style={{ color: progressColor(e.progress) }}>{e.progress}%</span>
                                </div>
                              </div>
                              <div className="progress-bar-wrap">
                                <div className="progress-bar-fill" style={{ width: `${e.progress}%`, background: progressColor(e.progress) }} />
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                {e.course?.category} · {e.course?.level} · Enrolled {fmt(e.createdAt)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {u.enrollments.length === 0 && (
                        <div style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>No courses enrolled yet.</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── ENROLLMENTS ── */}
              {activeTab === 'enrollments' && (
                <table className="admin-table">
                  <thead><tr><th>Student</th><th>Course</th><th>Progress</th><th>Enrolled</th></tr></thead>
                  <tbody>
                    {enrollments.map(e => (
                      <tr key={e.id}>
                        <td><strong>{e.user?.name}</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.user?.email}</div></td>
                        <td><strong>{e.course?.title}</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.course?.category}</div></td>
                        <td style={{ minWidth: 140 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                            <span style={{ fontWeight: 700, color: progressColor(e.progress || 0) }}>{e.progress || 0}%</span>
                          </div>
                          <div className="progress-bar-wrap">
                            <div className="progress-bar-fill" style={{ width: `${e.progress || 0}%`, background: progressColor(e.progress || 0) }} />
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{fmt(e.createdAt)}</td>
                      </tr>
                    ))}
                    {enrollments.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: 32 }}>No enrollments found.</td></tr>}
                  </tbody>
                </table>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
