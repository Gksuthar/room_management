import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const linkClasses = ({ isActive }) => {
  const base = 'rounded-full px-4 py-2 text-sm font-medium transition';
  return isActive
    ? `${base} bg-amber-500 text-slate-900`
    : `${base} text-slate-700 hover:bg-slate-200/70`;
};

const AppLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fef3c7,#e2e8f0_35%,#f8fafc_80%)]">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
          {/* Logo */}
          <Link to="/dashboard" className="text-base font-black tracking-wide text-slate-900 sm:text-lg">
            Room Ledger
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 rounded-full bg-slate-100 p-1 md:flex">
            <NavLink to="/dashboard" className={linkClasses}>
              Dashboard
            </NavLink>
            <NavLink to="/add-expense" className={linkClasses}>
              Add Expense
            </NavLink>
            <NavLink to="/expenses" className={linkClasses}>
              Expense List
            </NavLink>
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white sm:inline-block">
              {currentUser?.name}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="hidden rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 sm:inline-block"
            >
              Logout
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex flex-col gap-1.5 rounded-lg p-2 text-slate-700 hover:bg-slate-200/70"
              aria-label="Toggle menu"
            >
              <span className={`h-0.5 w-5 bg-current transition ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 w-5 bg-current transition ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-5 bg-current transition ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="border-t border-slate-200 bg-slate-50/95 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-amber-500 text-slate-900' : 'text-slate-700 hover:bg-slate-200/70'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/add-expense"
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-amber-500 text-slate-900' : 'text-slate-700 hover:bg-slate-200/70'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Add Expense
              </NavLink>
              <NavLink
                to="/expenses"
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-amber-500 text-slate-900' : 'text-slate-700 hover:bg-slate-200/70'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Expense List
              </NavLink>
              <div className="border-t border-slate-200 pt-2">
                <div className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white mb-2">
                  {currentUser?.name}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
};

export default AppLayout;
