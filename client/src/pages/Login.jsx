import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Button from '../components/ui/Button';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('traveler@travelops.ai');
    setPassword('password123');
    setLoading(true);
    try {
      await login('traveler@travelops.ai', 'password123');
      navigate('/dashboard');
    } catch (err) {
      try {
        await authAPI.register({ name: 'Alex Explorer', email: 'traveler@travelops.ai', password: 'password123' });
        await login('traveler@travelops.ai', 'password123');
        navigate('/dashboard');
      } catch (e) {
        setError('Could not complete demo login. Please register below.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F6F3ED]">
      <div className="w-full max-w-md paper-card p-8 sm:p-10 bg-white border border-sand-border shadow-md">
        <div className="text-center pb-6 border-b border-sand-border mb-8">
          <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
            TRAVELER ACCESS
          </span>
          <h2 className="text-3xl font-serif text-ink tracking-tight uppercase">
            SIGN IN TO DOSSIER
          </h2>
          <p className="text-xs font-sans text-ink-muted mt-1">Access your saved itineraries and multi-agent plans</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/10 border border-red-800 text-red-900 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink mb-1.5 font-bold">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="traveler@example.com"
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
              Sign In →
            </Button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 bg-sand border border-sand-border text-ink text-xs font-mono uppercase font-bold tracking-wider hover:border-ink transition-colors"
            >
              1-Click Demo Traveler Login
            </button>
          </div>
        </form>

        <p className="text-center text-xs font-mono text-ink-muted mt-8 pt-4 border-t border-sand-border">
          Don't have an account?{' '}
          <Link to="/register" className="text-terracotta font-bold hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
