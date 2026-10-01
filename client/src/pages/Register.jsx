import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F6F3ED]">
      <div className="w-full max-w-md paper-card p-8 sm:p-10 bg-white border border-sand-border shadow-md">
        <div className="text-center pb-6 border-b border-sand-border mb-8">
          <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
            NEW TRAVELER
          </span>
          <h2 className="text-3xl font-serif text-ink tracking-tight uppercase">
            CREATE ACCOUNT
          </h2>
          <p className="text-xs font-sans text-ink-muted mt-1">Unlock autonomous multi-agent travel intelligence</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/10 border border-red-800 text-red-900 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink mb-1.5 font-bold">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Morgan"
              className="w-full bg-[#F6F3ED] border border-sand-border rounded-none px-4 py-2.5 text-ink text-xs sm:text-sm font-sans focus:outline-none focus:border-ink"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink mb-1.5 font-bold">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full bg-[#F6F3ED] border border-sand-border rounded-none px-4 py-2.5 text-ink text-xs sm:text-sm font-sans focus:outline-none focus:border-ink"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink mb-1.5 font-bold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F6F3ED] border border-sand-border rounded-none px-4 py-2.5 text-ink text-xs sm:text-sm font-sans focus:outline-none focus:border-ink"
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="md"
              variant="primary"
              isLoading={loading}
              className="w-full py-3"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Traveler Account →
            </Button>
          </div>
        </form>

        <p className="text-center text-xs font-mono text-ink-muted mt-8 pt-4 border-t border-sand-border">
          Already have an account?{' '}
          <Link to="/login" className="text-terracotta font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
