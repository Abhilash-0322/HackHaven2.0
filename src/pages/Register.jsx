import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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
    try { await register(form); navigate('/home', { replace: true }); }
    catch (err) { setError(err.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start your clinical wellness journey with ZenHeaven">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <Input label="Full name" name="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} autoComplete="name" />
        <Input label="Username" name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required autoComplete="username" />
        <Input label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
        <Input label="Password" name="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} autoComplete="new-password" />
        <Button type="submit" className="w-full" loading={loading}>Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-clinical-500">Already have an account? <Link to="/login" className="font-medium text-accent-600">Sign in</Link></p>
    </AuthLayout>
  );
}
