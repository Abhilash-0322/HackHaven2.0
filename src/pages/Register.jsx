import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import QuoteBlock from '../components/ui/QuoteBlock';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/chat', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      <div className="hidden lg:flex lg:w-1/2 bg-editorial-ink text-cream p-12 flex-col justify-center">
        <h1 className="font-display text-4xl mb-8">ZenHeaven</h1>
        <QuoteBlock
          quote="You yourself, as much as anybody in the entire universe, deserve your love and affection."
          attribution="Buddha"
          className="border-terracotta text-cream/80 !text-xl"
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="editorial-byline mb-2">Join us</p>
            <h2 className="font-display text-3xl text-editorial-ink">Create account</h2>
            <p className="font-serif text-charcoal-light mt-2">Start your editorial on wellness</p>
          </div>

          {error && <Alert variant="error" className="mb-6">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
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
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
            />
            <Button type="submit" loading={loading} className="w-full">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center font-sans text-sm text-charcoal-muted">
            Already have an account?{' '}
            <Link to="/login" className="editorial-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
