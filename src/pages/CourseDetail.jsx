import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchCourseById, enrollCourse, fetchMyEnrollments, fetchChapters, toggleChapterComplete } from '../api/client';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState(0);
  const [toggling, setToggling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState(null);

  const loadChapters = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetchChapters(id);
      setChapters(res.data.chapters);
    } catch { /* ignore */ }
  }, [id]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchCourseById(id);
        setCourse(res.data.course);
        setEnrollmentCount(res.data.enrollmentCount);

        if (isAuthenticated) {
          const myRes = await fetchMyEnrollments();
          const enrollment = myRes.data.enrollments.find(e => e.courseId === id);
          if (enrollment) {
            setIsEnrolled(true);
            setProgress(enrollment.progress || 0);
          }
        }

        await loadChapters();
      } catch {
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isAuthenticated, navigate, loadChapters]);

  const handleEnroll = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setEnrolling(true);
    setMessage(null);
    try {
      await enrollCourse(id);
      setIsEnrolled(true);
      setEnrollmentCount(p => p + 1);
      await loadChapters();
      setMessage({ type: 'success', text: 'Successfully enrolled! Start learning below.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Enrollment failed.' });
    } finally { setEnrolling(false); }
  };

  const handleToggleChapter = async (chapterId) => {
    if (!isEnrolled) return;
    setToggling(chapterId);
    try {
      const res = await toggleChapterComplete(chapterId);
      setProgress(res.data.progress);
      setChapters(prev => prev.map(ch =>
        ch.id === chapterId ? { ...ch, completed: res.data.completed } : ch
      ));
    } catch (err) {
      console.error(err);
    } finally { setToggling(null); }
  };

  const completedCount = chapters.filter(c => c.completed).length;
  const progressColor = (p) => p === 100 ? '#4ade80' : p >= 50 ? '#60a5fa' : 'var(--text-primary)';

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!course) return null;

  return (
    <>
      <style>{`
        .detail-hero { background: var(--bg-surface); border-bottom: 1px solid var(--border-subtle); padding: 48px 0; }
        .detail-grid { display: grid; grid-template-columns: 1fr 360px; gap: 48px; align-items: start; }
        .detail-breadcrumb { font-size: 0.78rem; color: var(--text-muted); margin-bottom: 20px; display: flex; align-items: center; gap: 6px; }
        .detail-breadcrumb a { color: var(--text-muted); transition: color var(--transition); }
        .detail-breadcrumb a:hover { color: var(--text-primary); }
        .detail-category { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; }
        .detail-title { font-size: 2rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 16px; }
        .detail-desc { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 24px; }
        .detail-instructor { font-size: 0.85rem; color: var(--text-muted); }
        .detail-instructor strong { color: var(--text-primary); }
        .detail-meta-row { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 20px; }
        .detail-meta-item { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--text-secondary); }

        /* Sidebar */
        .enroll-card { position: sticky; top: 84px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; }
        .enroll-card-thumb { aspect-ratio: 16/9; overflow: hidden; background: var(--bg-surface); }
        .enroll-card-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .enroll-card-body { padding: 24px; }
        .enroll-card-price { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px; }
        .enroll-card-price span { font-size: 0.85rem; font-weight: 400; color: var(--text-muted); margin-left: 6px; }
        .enroll-stats { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
        .enroll-stat { display: flex; justify-content: space-between; font-size: 0.83rem; padding-bottom: 10px; border-bottom: 1px solid var(--border-subtle); }
        .enroll-stat:last-child { border-bottom: none; }
        .enroll-stat-label { color: var(--text-muted); }
        .enroll-stat-value { color: var(--text-primary); font-weight: 500; }

        /* Progress bar in sidebar */
        .sidebar-progress-label { display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 6px; }
        .sidebar-progress-bar { width: 100%; height: 8px; background: var(--border-subtle); border-radius: 4px; overflow: hidden; margin-bottom: 16px; }
        .sidebar-progress-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }

        /* Detail body */
        .detail-body { padding: 56px 0 80px; }
        .detail-section { margin-bottom: 40px; }
        .detail-section-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; }

        /* Chapter list */
        .chapter-list { display: flex; flex-direction: column; gap: 8px; }
        .chapter-item {
          display: flex; align-items: center; gap: 14px;
          background: var(--bg-card); border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md); padding: 14px 18px;
          transition: all 0.2s ease; cursor: default;
        }
        .chapter-item.enrolled { cursor: pointer; }
        .chapter-item.enrolled:hover { border-color: var(--border); background: var(--bg-hover); }
        .chapter-item.done { border-color: rgba(74,222,128,0.25); background: rgba(74,222,128,0.04); }
        .chapter-check {
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid var(--border); flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; transition: all 0.2s ease;
        }
        .chapter-item.done .chapter-check { background: #4ade80; border-color: #4ade80; color: #000; }
        .chapter-item.toggling .chapter-check { opacity: 0.5; }
        .chapter-num { font-size: 0.72rem; font-weight: 700; color: var(--text-muted); min-width: 24px; }
        .chapter-info { flex: 1; }
        .chapter-title { font-size: 0.92rem; font-weight: 600; color: var(--text-primary); }
        .chapter-desc { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }
        .chapter-duration { font-size: 0.75rem; color: var(--text-muted); flex-shrink: 0; }
        .chapter-lock { font-size: 0.8rem; color: var(--text-muted); }

        @media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr; } .enroll-card { position: static; } }
      `}</style>

      <div className="detail-hero">
        <div className="container">
          <div className="detail-breadcrumb">
            <Link to="/">Home</Link> / <Link to="/courses">Courses</Link> / <span>{course.title}</span>
          </div>
          <div className="detail-grid">
            <div>
              <p className="detail-category">{course.category}</p>
              <h1 className="detail-title">{course.title}</h1>
              <p className="detail-desc">{course.description}</p>
              <p className="detail-instructor">Instructor: <strong>{course.instructor}</strong></p>
              <div className="detail-meta-row">
                <span className="detail-meta-item">📊 {course.level}</span>
                <span className="detail-meta-item">📖 {chapters.length} chapters</span>
                <span className="detail-meta-item">⏱ {course.duration}</span>
                <span className="detail-meta-item">👥 {enrollmentCount} enrolled</span>
              </div>
            </div>

            {/* Sidebar */}
            <div className="enroll-card">
              {course.thumbnail && (
                <div className="enroll-card-thumb">
                  <img src={course.thumbnail} alt={course.title} />
                </div>
              )}
              <div className="enroll-card-body">
                {isEnrolled && (
                  <>
                    <div className="sidebar-progress-label">
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Your Progress</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: progressColor(progress) }}>{progress}%</span>
                    </div>
                    <div className="sidebar-progress-bar">
                      <div className="sidebar-progress-fill" style={{ width: `${progress}%`, background: progressColor(progress) }} />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                      {completedCount} of {chapters.length} chapters completed
                    </div>
                  </>
                )}

                {!isEnrolled && (
                  <div className="enroll-card-price">Free<span>No credit card needed</span></div>
                )}

                {message && <div className={`alert alert-${message.type}`} style={{ marginBottom: 14 }}>{message.text}</div>}

                {user?.role === 'admin' ? (
                  <Link to="/admin/dashboard" className="btn btn-outline" style={{ width: '100%' }}>
                    Manage Course (Admin) →
                  </Link>
                ) : isEnrolled ? (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    {progress === 100
                      ? <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.9rem' }}>🎉 Course Completed!</div>
                      : <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Check off chapters below as you complete them.</div>
                    }
                  </div>
                ) : (
                  <button
                    id="enroll-btn"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? 'Enrolling...' : isAuthenticated ? 'Enroll Now — Free' : 'Sign In to Enroll'}
                  </button>
                )}

                <div className="enroll-stats">
                  <div className="enroll-stat"><span className="enroll-stat-label">Level</span><span className="enroll-stat-value">{course.level}</span></div>
                  <div className="enroll-stat"><span className="enroll-stat-label">Duration</span><span className="enroll-stat-value">{course.duration}</span></div>
                  <div className="enroll-stat"><span className="enroll-stat-label">Chapters</span><span className="enroll-stat-value">{chapters.length}</span></div>
                  <div className="enroll-stat"><span className="enroll-stat-label">Category</span><span className="enroll-stat-value">{course.category}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="container" style={{ maxWidth: 760 }}>

          {/* About */}
          <div className="detail-section">
            <h2 className="detail-section-title">About This Course</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem' }}>
              {course.description} Designed for <strong>{course.level.toLowerCase()}</strong> learners,
              this course covers everything you need about <strong>{course.category}</strong>.
              By the end you'll have hands-on projects to showcase in your portfolio.
            </p>
          </div>

          {/* Curriculum */}
          <div className="detail-section">
            <h2 className="detail-section-title">
              <span>Course Curriculum</span>
              {isEnrolled && (
                <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                  {completedCount}/{chapters.length} completed
                </span>
              )}
            </h2>
            <div className="chapter-list">
              {chapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  className={`chapter-item ${isEnrolled ? 'enrolled' : ''} ${ch.completed ? 'done' : ''} ${toggling === ch.id ? 'toggling' : ''}`}
                  onClick={() => isEnrolled && toggling !== ch.id && handleToggleChapter(ch.id)}
                  title={isEnrolled ? (ch.completed ? 'Click to mark incomplete' : 'Click to mark complete') : 'Enroll to track progress'}
                >
                  <div className="chapter-check">
                    {ch.completed && '✓'}
                  </div>
                  <span className="chapter-num">{String(idx + 1).padStart(2, '0')}</span>
                  <div className="chapter-info">
                    <div className="chapter-title" style={{ textDecoration: ch.completed ? 'line-through' : 'none', opacity: ch.completed ? 0.6 : 1 }}>
                      {ch.title}
                    </div>
                    {ch.description && <div className="chapter-desc">{ch.description}</div>}
                  </div>
                  <span className="chapter-duration">⏱ {ch.duration}</span>
                  {!isEnrolled && <span className="chapter-lock">🔒</span>}
                </div>
              ))}
            </div>
            {!isEnrolled && (
              <p style={{ marginTop: 16, fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Enroll to unlock progress tracking for all chapters.
              </p>
            )}
          </div>

          {/* Instructor */}
          <div className="detail-section">
            <h2 className="detail-section-title">About the Instructor</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                👩‍💻
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{course.instructor}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{course.category} Instructor · Tech Academy</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{course.instructor}</strong> is an industry expert
              with hands-on experience in {course.category}. Known for clear, practical teaching
              with real-world examples and project-driven learning.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default CourseDetail;
