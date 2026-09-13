import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse Marketplace' },
    { to: '/my-reports', label: 'Manage Reports' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-surface-200/80 shadow-xs">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group" id="logo-link">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-500 flex items-center justify-center group-hover:scale-105 transition-all shadow-md shadow-indigo-500/20">
              <MapPin size={24} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-surface-900 tracking-tight">CampusL&F</span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase mt-0.5">AWS Lost & Found Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2" id="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                  isActive(link.to)
                    ? 'text-indigo-700 bg-indigo-50 font-bold shadow-xs'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Quick Action Buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link to="/report/lost" className="btn btn-danger font-bold shadow-sm" id="nav-report-lost">
              <AlertCircle size={16} />
              Report Lost
            </Link>
            <Link to="/report/found" className="btn btn-success font-bold shadow-sm" id="nav-report-found">
              <CheckCircle size={16} />
              Report Found
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden btn btn-ghost btn-icon p-2 text-surface-700 hover:bg-surface-100 rounded-xl"
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden animate-slide-down border-t border-surface-200 bg-white/98 backdrop-blur-xl shadow-2xl">
          <div className="container py-5 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 text-base font-semibold rounded-2xl transition-all ${
                  isActive(link.to)
                    ? 'text-indigo-700 bg-indigo-50 font-bold'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-surface-100 grid grid-cols-2 gap-3">
              <Link
                to="/report/lost"
                onClick={() => setMobileOpen(false)}
                className="btn btn-danger py-3.5 w-full text-center font-bold text-sm"
              >
                Report Lost
              </Link>
              <Link
                to="/report/found"
                onClick={() => setMobileOpen(false)}
                className="btn btn-success py-3.5 w-full text-center font-bold text-sm"
              >
                Report Found
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
