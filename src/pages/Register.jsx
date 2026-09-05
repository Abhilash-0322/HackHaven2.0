import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, full_name: form.full_name || undefined });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Deploy Agent" subtitle="// create your ZenHeaven identity">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        <div>
          <label className="text-xs font-mono text-gray-500 mb-1 block">username</label>
          <input className="neon-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required minLength={3} />
        </div>
        <div>
          <label className="text-xs font-mono text-gray-500 mb-1 block">email</label>
          <input type="email" className="neon-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="text-xs font-mono text-gray-500 mb-1 block">display name</label>
          <input className="neon-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-mono text-gray-500 mb-1 block">password</label>
          <input type="password" className="neon-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
        </div>
        <button type="submit" className="neon-btn w-full" disabled={loading}>{loading ? 'Provisioning...' : 'Create Account'}</button>
        <p className="text-center text-xs text-gray-500 font-mono">
          Have an account? <Link to="/login" className="text-cyan-glow hover:underline">sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
