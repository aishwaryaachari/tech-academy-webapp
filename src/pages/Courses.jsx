import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCourses } from '../api/client';
import CourseCard from '../components/CourseCard';

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Design', 'Cloud & DevOps', 'Cybersecurity', 'Database', 'Mobile Development'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'All';
  const activeLevel = searchParams.get('level') || 'All';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (activeLevel !== 'All') params.level = activeLevel;
    if (search.trim()) params.search = search.trim();

    fetchCourses(params)
      .then(res => setCourses(res.data.courses))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, activeLevel, search]);

  const setFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value === 'All') p.delete(key);
    else p.set(key, value);
    setSearchParams(p);
  };

  return (
    <>
      <style>{`
        .courses-page { padding: 48px 0 80px; }
        .courses-header { margin-bottom: 36px; }
        .search-bar {
          display: flex; align-items: center; gap: 12px;
          background: var(--bg-card); border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md); padding: 10px 16px;
          margin-bottom: 24px; max-width: 480px;
        }
        .search-bar input {
          flex: 1; background: none; border: none; outline: none;
          font-size: 0.9rem; color: var(--text-primary);
        }
        .search-bar input::placeholder { color: var(--text-muted); }
        .filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
        .filter-row-label { font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; }
        .filter-btn {
          padding: 5px 14px; border-radius: 99px; font-size: 0.8rem; font-weight: 500;
          border: 1px solid var(--border-subtle); background: transparent;
          color: var(--text-secondary); cursor: pointer; transition: all var(--transition);
        }
        .filter-btn:hover { border-color: var(--border); color: var(--text-primary); }
        .filter-btn.active {
          background: var(--text-primary); color: var(--text-inverse);
          border-color: var(--text-primary);
        }
        .courses-count { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 28px; }
        .filters-section {
          background: var(--bg-card); border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md); padding: 20px 24px; margin-bottom: 32px;
        }
      `}</style>

      <div className="courses-page">
        <div className="container">
          <div className="courses-header">
            <p className="section-label">Catalog</p>
            <h1 className="section-title">All Courses</h1>
            <p className="section-subtitle">Browse our full catalog of free, expert-led courses.</p>
          </div>

          {/* Search */}
          <div className="search-bar">
            <span style={{ color: 'var(--text-muted)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search courses, instructors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="course-search"
            />
            {search && (
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div>
              <p className="filter-row-label">Category</p>
              <div className="filter-row">
                {CATEGORIES.map(c => (
                  <button key={c} className={`filter-btn${activeCategory === c ? ' active' : ''}`}
                    onClick={() => setFilter('category', c)}>{c}</button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <p className="filter-row-label">Level</p>
              <div className="filter-row">
                {LEVELS.map(l => (
                  <button key={l} className={`filter-btn${activeLevel === l ? ' active' : ''}`}
                    onClick={() => setFilter('level', l)}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-title">No courses found</div>
              <p className="empty-state-text">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <>
              <p className="courses-count">{courses.length} course{courses.length !== 1 ? 's' : ''} found</p>
              <div className="grid-courses fade-up">
                {courses.map(c => <CourseCard key={c.id} course={c} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Courses;
