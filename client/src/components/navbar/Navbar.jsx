import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, ArrowRight, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Plan', href: '/plan' },
    { name: 'Explore', href: '/#destinations' },
    { name: 'My Trips', href: '/dashboard' },
    { name: 'How It Works', href: '/#how-it-works' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F6F3ED]/90 backdrop-blur-md border-b border-sand-border shadow-sm'
          : 'bg-[#F6F3ED] border-b border-sand-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Typographic Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex flex-col">
              <span className="font-sans font-extrabold text-base sm:text-lg tracking-[0.2em] text-ink uppercase">
                AI TRAVELOPS
              </span>
              <span className="text-[9px] font-mono tracking-widest text-ink-muted uppercase -mt-0.5">
                Multi-Agent Travel System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-xs font-semibold tracking-wider uppercase transition-colors relative py-1 ${
                    isActive
                      ? 'text-terracotta font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-terracotta'
                      : 'text-ink/80 hover:text-terracotta'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 border border-sand-border bg-white hover:border-ink transition-all"
                >
                  <span className="text-xs font-semibold text-ink uppercase tracking-wider">{user?.name}</span>
                  <span className="text-[10px] font-mono text-terracotta">●</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-sand-border p-2 shadow-xl z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-semibold text-ink hover:bg-sand transition-colors uppercase tracking-wider"
                    >
                      Dossier & Trips
                    </Link>
                    <Link
                      to="/saved"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-semibold text-ink hover:bg-sand transition-colors uppercase tracking-wider"
                    >
                      Saved Plans
                    </Link>
                    <div className="my-1 border-t border-sand-border" />
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-terracotta hover:bg-terracotta/10 transition-colors uppercase tracking-wider"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-semibold tracking-wider uppercase text-ink hover:text-terracotta px-3 py-2"
                >
                  Login
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/plan')}
                >
                  Plan a Trip
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-sand-border text-ink hover:bg-sand"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F3ED] border-b border-sand-border px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-bold tracking-widest uppercase text-ink hover:text-terracotta py-1"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-sand-border">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-xs font-bold uppercase tracking-wider text-terracotta"
              >
                Sign Out ({user?.name})
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>
                  Login
                </Button>
                <Button variant="primary" size="sm" onClick={() => { setMobileMenuOpen(false); navigate('/plan'); }}>
                  Plan a Trip →
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
