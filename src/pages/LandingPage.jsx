import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  FileText,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  Clock,
  Users,
  AlertCircle,
  Sparkles,
  Zap,
  CreditCard,
  Laptop,
  Key,
  Calculator,
  Briefcase,
  ShoppingBag,
} from 'lucide-react';
import ItemCard from '../components/items/ItemCard';
import { getRecentItems, getStats, syncWithDynamoDB } from '../data/mockData';

export default function LandingPage() {
  const [items, setItems] = useState(() => getRecentItems(6));
  const [stats, setStats] = useState(() => getStats());
  const navigate = useNavigate();

  useEffect(() => {
    syncWithDynamoDB().then(() => {
      setItems(getRecentItems(6));
      setStats(getStats());
    });
  }, []);

  const categoriesQuick = [
    { label: 'ID Cards', icon: CreditCard, val: 'id-card', color: 'hover:border-sky-400 hover:text-sky-600' },
    { label: 'Calculators', icon: Calculator, val: 'calculator', color: 'hover:border-purple-400 hover:text-purple-600' },
    { label: 'Electronics', icon: Laptop, val: 'electronics', color: 'hover:border-indigo-400 hover:text-indigo-600' },
    { label: 'Keys', icon: Key, val: 'keys', color: 'hover:border-amber-400 hover:text-amber-600' },
    { label: 'Wallets', icon: Briefcase, val: 'wallet', color: 'hover:border-emerald-400 hover:text-emerald-600' },
    { label: 'Bags', icon: ShoppingBag, val: 'bags', color: 'hover:border-teal-400 hover:text-teal-600' },
  ];

  return (
    <div className="animate-fade-in space-y-12 pb-12">
      {/* ==================== ULTRA HERO SECTION ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-b-[2.5rem] sm:rounded-b-[4rem] shadow-2xl">
        {/* Glowing Background Mesh Spheres */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[150px] animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-emerald-500/20 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[180px]" />
        </div>

        <div className="container relative z-10 py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-7">
            {/* Sparkle Badge */}
            <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-bold tracking-wide text-cyan-300 backdrop-blur-md shadow-inner animate-fade-in-up">
              <Sparkles size={16} className="text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              AWS Deploy Challenge — Campus Lost & Found Platform
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white">
              Lost Something{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
                on Campus?
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-200/90 max-w-2xl mx-auto font-normal leading-relaxed">
              Find it faster. Report lost or found items, search by building location, and connect with fellow students securely.
            </p>

            {/* Call to Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
              <Link
                to="/report/lost"
                className="btn btn-lg bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/30 w-full sm:w-auto font-extrabold"
                id="hero-report-lost"
              >
                <AlertCircle size={18} />
                Report Lost Item
              </Link>
              <Link
                to="/report/found"
                className="btn btn-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 w-full sm:w-auto font-extrabold"
                id="hero-report-found"
              >
                <CheckCircle size={18} />
                Report Found Item
              </Link>
              <Link
                to="/browse"
                className="btn btn-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 w-full sm:w-auto font-bold backdrop-blur-md"
                id="hero-browse"
              >
                <Search size={18} />
                Browse Items
              </Link>
            </div>

            {/* Interactive Quick Search Bar */}
            <div className="pt-4 max-w-lg mx-auto">
              <div 
                onClick={() => navigate('/browse')}
                className="flex items-center gap-3 px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/25 rounded-2xl cursor-pointer transition-all group backdrop-blur-md shadow-xl"
              >
                <Search size={20} className="text-cyan-300 group-hover:scale-110 transition-transform" />
                <span className="text-slate-300 text-sm font-medium">
                  Search by calculator, ID card, keys, or library...
                </span>
                <ArrowRight size={18} className="ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== QUICK CATEGORIES STRIP ==================== */}
      <section className="py-2">
        <div className="container">
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Popular Categories</span>
            <Link to="/browse" className="text-xs font-bold text-indigo-600 hover:underline">View All &rarr;</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categoriesQuick.map((cat) => (
              <Link
                key={cat.val}
                to={`/browse?category=${cat.val}`}
                className={`bg-white rounded-2xl border border-surface-200/80 p-3.5 flex items-center gap-3 transition-all card-hover group ${cat.color}`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                  <cat.icon size={18} className="text-slate-700 group-hover:text-indigo-600" />
                </div>
                <span className="text-xs font-bold text-surface-800 truncate">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== METRICS DASHBOARD ==================== */}
      <section className="py-6">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" id="stats-section">
            {[
              { label: 'Lost Items', value: stats.totalLost, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200/60' },
              { label: 'Found Items', value: stats.totalFound, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200/60' },
              { label: 'Items Recovered', value: stats.recovered, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200/60' },
              { label: 'Active Reports', value: stats.active, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200/60' },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`bg-white rounded-3xl border ${stat.border} p-5 sm:p-6 card-hover flex items-center gap-4`}
              >
                <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center shrink-0 shadow-2xs`}>
                  <stat.icon size={26} className={stat.color} />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-surface-900">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-semibold text-surface-500 mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-12 bg-white rounded-3xl border border-surface-200/70 shadow-xs" id="how-it-works">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">3-Step Process</span>
            <h2 className="text-3xl font-extrabold text-surface-900 mt-1">How Campus L&F Works</h2>
            <p className="text-surface-500 mt-2 text-sm">Centralized, fast, and simple for every college student</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                icon: FileText,
                title: 'Report Item',
                description: 'Lost or found an item? Submit a simple report with details, building location, and your contact info.',
                bg: 'bg-indigo-50 text-indigo-600',
              },
              {
                step: '02',
                icon: Search,
                title: 'Search & Match',
                description: 'Browse the live feed, search by item keywords, or filter by library, lab, and cafeteria locations.',
                bg: 'bg-emerald-50 text-emerald-600',
              },
              {
                step: '03',
                icon: CheckCircle,
                title: 'Safely Recover',
                description: 'Contact the reporter directly, verify ownership, and mark the report as RESOLVED!',
                bg: 'bg-amber-50 text-amber-600',
              },
            ].map((item) => (
              <div key={item.step} className="bg-surface-50/80 rounded-3xl p-6 text-center border border-surface-200/60 card-hover space-y-3">
                <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mx-auto shadow-xs`}>
                  <item.icon size={28} />
                </div>
                <span className="text-xs font-black text-surface-400 uppercase tracking-widest">Step {item.step}</span>
                <h3 className="text-lg font-bold text-surface-900">{item.title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed font-normal">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== RECENT REPORTS ==================== */}
      <section className="py-10">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">Live Updates</span>
              <h2 className="text-3xl font-extrabold text-surface-900 mt-0.5">Recent Campus Reports</h2>
              <p className="text-surface-500 text-sm mt-0.5">Latest lost and found items posted by students</p>
            </div>
            <Link to="/browse" className="btn btn-secondary font-bold" id="view-all-link">
              View Marketplace
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item.itemId} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AWS ARCHITECTURE BANNER ==================== */}
      <section className="py-6">
        <div className="container">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Zap size={14} /> AWS Weekend Challenge Architecture
              </div>
              <h3 className="text-2xl font-bold">Powered by AWS Amplify & Amazon DynamoDB</h3>
              <p className="text-slate-300 text-sm max-w-xl">
                Built specifically as a 2-service serverless MVP: AWS Amplify for hosting & Amazon DynamoDB for NoSQL database storage.
              </p>
            </div>
            <Link to="/report/lost" className="btn btn-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold shrink-0 shadow-lg shadow-emerald-500/30">
              Post a Report Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
