import { Link, useNavigate } from 'react-router-dom';
import { enrollCourse } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const CourseCard = ({ course, enrolled = false, progress = 0, onIncrement }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);
  const [isLocalEnrolled, setIsLocalEnrolled] = useState(enrolled);

  const handleEnroll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await enrollCourse(course.id);
      setIsLocalEnrolled(true);
      // Optional: force a reload or update parent state
      window.location.href = '/dashboard'; 
    } catch (err) {
      console.error('Enrollment failed:', err);
      alert(err.response?.data?.message || 'Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <>
      <style>{`
        .course-card { display: flex; flex-direction: column; height: 100%; position: relative; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; background: var(--bg-card); transition: transform 0.2s, border-color 0.2s; }
        .course-card:hover { transform: translateY(-4px); border-color: var(--border); }
        .course-card-thumb {
          position: relative; aspect-ratio: 16/9; overflow: hidden;
          background: rgba(0,0,0,0.4);
          border-bottom: 1px solid var(--border-subtle);
        }
        .course-card-thumb img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .course-card:hover .course-card-thumb img { transform: scale(1.05); }
        .course-card-thumb-placeholder {
          width: 100%; height: 100%; display: flex; align-items: center;
          justify-content: center; font-size: 2.5rem; color: var(--text-muted);
        }
        .course-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; gap: 12px; }
        .course-card-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .course-card-category {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--text-primary);
        }
        .course-card-title {
          font-size: 1.1rem; font-weight: 700; color: var(--text-primary);
          line-height: 1.4; letter-spacing: -0.01em; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .course-card-desc {
          font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .course-card-instructor { font-size: 0.8rem; color: var(--text-muted); margin-top: auto; padding-top: 8px; }
        .course-card-footer {
          padding: 16px 24px; border-top: 1px solid var(--border-subtle);
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(0,0,0,0.15);
        }
        .course-card-stats { display: flex; align-items: center; gap: 16px; }
        .course-stat { font-size: 0.78rem; font-weight: 500; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; }
      `}</style>

      <Link to={`/courses/${course.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', height: '100%' }}>
        <div className="course-card">
          <div className="course-card-thumb">
            {course.thumbnail
              ? <img src={course.thumbnail} alt={course.title} loading="lazy" />
              : <div className="course-card-thumb-placeholder">📚</div>
            }
          </div>

          <div className="course-card-body">
            <div className="course-card-meta">
              <span className="course-card-category">{course.category}</span>
              <span className="badge">{course.level}</span>
            </div>
            <h3 className="course-card-title">{course.title}</h3>
            <p className="course-card-desc">{course.description}</p>
            <p className="course-card-instructor">Instructor: <strong style={{color: 'var(--text-secondary)'}}>{course.instructor}</strong></p>
          </div>

          <div className="course-card-footer" style={{ flexDirection: isLocalEnrolled ? 'column' : 'row', alignItems: isLocalEnrolled ? 'stretch' : 'center' }}>
            {isLocalEnrolled ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Progress</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{progress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'var(--text-primary)', transition: 'width 0.3s ease' }} />
                </div>
                <button 
                  className="btn btn-outline btn-sm" 
                  style={{ width: '100%', marginTop: '4px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onIncrement && progress < 100) onIncrement();
                    else navigate(`/courses/${course.id}`);
                  }}
                  disabled={progress === 100}
                >
                  {progress === 100 ? 'Course Completed 🎉' : 'Go to Course →'}
                </button>
              </div>
            ) : (
              <>
                <div className="course-card-stats">
                  <span className="course-stat">📖 {course.totalLessons}</span>
                  <span className="course-stat">⏱ {course.duration}</span>
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? '...' : 'Enroll Now'}
                </button>
              </>
            )}
          </div>
        </div>
      </Link>
    </>
  );
};

export default CourseCard;
