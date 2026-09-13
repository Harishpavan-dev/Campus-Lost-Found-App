import { Link } from 'react-router-dom';
import { MapPin, Heart, Mail, ExternalLink, Code } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-900 text-surface-300 mt-auto">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapPin size={20} className="text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold text-white">CampusL&F</span>
                <span className="text-[10px] font-medium text-surface-500 tracking-wider uppercase">Lost & Found</span>
              </div>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed mb-4">
              A centralized, open platform for college students to report, search, and recover lost & found items on campus without any hassle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/browse', label: 'Browse Marketplace' },
                { to: '/report/lost', label: 'Report Lost Item' },
                { to: '/report/found', label: 'Report Found Item' },
                { to: '/my-reports', label: 'Manage Reports' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-surface-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Information</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/#how-it-works', label: 'How It Works' },
                { to: '/#about', label: 'About Campus L&F' },
                { to: '/#contact', label: 'Contact Support' },
                { label: 'Campus Privacy Policy' },
              ].map((link, i) => (
                <li key={i}>
                  {link.to ? (
                    <Link to={link.to} className="text-sm text-surface-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  ) : (
                    <span className="text-sm text-surface-500 cursor-not-allowed">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Connect</h4>
            <div className="space-y-3">
              <a
                href="https://github.com/Harishpavan-dev/Campus-Lost-Found-App"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors"
              >
                <Code size={16} />
                GitHub Repository
                <ExternalLink size={12} />
              </a>
              <a
                href="mailto:support@campuslf.edu"
                className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors"
              >
                <Mail size={16} />
                support@campuslf.edu
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-800">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-surface-500">
            © {currentYear} Campus Lost & Found. All rights reserved.
          </p>
          <p className="text-xs text-surface-500 flex items-center gap-1">
            Built with <Heart size={12} className="text-red-500" /> for AWS Weekend Challenge
          </p>
        </div>
      </div>
    </footer>
  );
}
