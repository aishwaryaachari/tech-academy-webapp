import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!form.email) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data.token, res.data.user);
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        .password-hint { font-size: 0.74rem; color: var(--text-muted); margin-top: 6px; }
      `}</style>

      <h1 className="auth-title">Create account</h1>
      <p className="auth-subtitle">Start learning for free today.</p>

      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-name">Full Name</label>
          <input
            id="reg-name"
            className="form-input"
            type="text"
            name="name"
            placeholder="Jane Smith"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">Email Address</label>
          <input
            id="reg-email"
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
          <label className="form-label" htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            className="form-input"
            type="password"
            name="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          <p className="password-hint">At least 6 characters required</p>
        </div>
        <button id="register-submit" className="btn btn-primary btn-lg" style={{ marginTop: 8 }} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Free Account'}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
};

export default Register;
