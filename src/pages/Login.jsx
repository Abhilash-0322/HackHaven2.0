import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ username: form.username, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Agent Access" subtitle="// authenticate to enter ZenHeaven">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        <div>
          <label className="text-xs font-mono text-gray-500 mb-1 block">username</label>
          <input className="neon-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required autoComplete="username" />
        </div>
        <div>
          <label className="text-xs font-mono text-gray-500 mb-1 block">password</label>
          <input type="password" className="neon-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
        </div>
        <button type="submit" className="neon-btn w-full" disabled={loading}>{loading ? 'Connecting...' : 'Initialize Session'}</button>
        <p className="text-center text-xs text-gray-500 font-mono">
          No account? <Link to="/register" className="text-cyan-glow hover:underline">register agent</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
