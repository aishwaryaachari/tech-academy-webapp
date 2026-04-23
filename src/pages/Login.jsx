import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <style>{`
        .auth-title { font-size: 2.2rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 8px; color: var(--text-primary); }
        .auth-subtitle { font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 36px; }
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .auth-footer { margin-top: 24px; font-size: 0.85rem; color: var(--text-muted); }
        .auth-footer a { color: var(--text-primary); font-weight: 600; text-decoration: none; transition: color var(--transition); }
        .auth-footer a:hover { color: var(--accent); }
        .demo-hint {
          margin-top: 32px; padding: 16px; background: rgba(255,255,255,0.02);
          border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
          font-size: 0.8rem; color: var(--text-muted); line-height: 1.6;
        }
      `}</style>

      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to continue learning.</p>

      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            className="form-input"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            className="form-input"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>
        <button id="login-submit" className="btn btn-primary btn-lg" style={{ marginTop: 8 }} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account? <Link to="/register">Create one free</Link>
      </div>

      <div className="demo-hint">
        <strong style={{ color: 'var(--text-secondary)' }}>Demo credentials</strong><br />
        Student: student@techacademy.com / student123<br />
        Admin: admin@techacademy.com / admin123
      </div>
    </div>
  );
};

export default Login;
