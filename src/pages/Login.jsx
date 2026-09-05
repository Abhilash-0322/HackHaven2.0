import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await login(form); navigate(from, { replace: true }); }
    catch (err) { setError(err.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to access your ZenHeaven wellness dashboard">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <Input label="Username" name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required autoComplete="username" />
        <Input label="Password" name="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
        <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-clinical-500">Don&apos;t have an account? <Link to="/register" className="font-medium text-accent-600">Create one</Link></p>
    </AuthLayout>
  );
}
