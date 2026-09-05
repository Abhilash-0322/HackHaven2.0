import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import QuoteBlock from '../components/ui/QuoteBlock';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/chat';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      <div className="hidden lg:flex lg:w-1/2 bg-editorial-ink text-cream p-12 flex-col justify-center">
        <h1 className="font-display text-4xl mb-8">ZenHeaven</h1>
        <QuoteBlock
          quote="Almost everything will work again if you unplug it for a few minutes, including you."
          attribution="Anne Lamott"
          className="border-terracotta text-cream/80 !text-xl"
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="editorial-byline mb-2">Welcome back</p>
            <h2 className="font-display text-3xl text-editorial-ink">Sign in</h2>
            <p className="font-serif text-charcoal-light mt-2">Continue your wellness journey</p>
          </div>

          {error && <Alert variant="error" className="mb-6">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
            <Button type="submit" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center font-sans text-sm text-charcoal-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="editorial-link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
