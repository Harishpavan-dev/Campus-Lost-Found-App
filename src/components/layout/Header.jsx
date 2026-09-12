import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Search, PlusCircle, Sparkles } from 'lucide-react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse Marketplace' },
    { to: '/report/lost', label: 'Report Lost' },
    { to: '/report/found', label: 'Report Found' },
    { to: '/my-reports', label: 'My Reports' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-surface-200/60 shadow-xs">
      <div className="container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Badge */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group" id="logo-link">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-500 flex items-center justify-center group-hover:scale-105 transition-all shadow-md shadow-indigo-500/25">
              <MapPin size={22} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-surface-900 tracking-tight">CampusL&F</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase">AWS Weekend Challenge</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 mx-4" id="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                  isActive(link.to)
                    ? 'text-indigo-700 bg-indigo-50/90 shadow-xs'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Quick Actions */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <Link to="/report/lost" className="btn btn-danger btn-sm font-bold shadow-sm">
              + Report Lost
            </Link>
            <Link to="/report/found" className="btn btn-success btn-sm font-bold shadow-sm">
              + Report Found
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden btn btn-ghost btn-icon p-2 text-surface-700 hover:bg-surface-100 rounded-xl"
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden animate-slide-down border-t border-surface-200 bg-white/95 backdrop-blur-xl shadow-xl">
          <div className="container py-4 space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  isActive(link.to)
                    ? 'text-indigo-700 bg-indigo-50 font-bold'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-surface-100 grid grid-cols-2 gap-2">
              <Link
                to="/report/lost"
                onClick={() => setMobileOpen(false)}
                className="btn btn-danger btn-sm w-full text-center font-bold"
              >
                + Report Lost
              </Link>
              <Link
                to="/report/found"
                onClick={() => setMobileOpen(false)}
                className="btn btn-success btn-sm w-full text-center font-bold"
              >
                + Report Found
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
