import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  FileText,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Clock,
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
    { label: 'ID Cards', icon: CreditCard, val: 'id-card', color: 'hover:border-sky-400 hover:text-sky-600', gradient: 'from-sky-500/10 to-sky-600/5' },
    { label: 'Calculators', icon: Calculator, val: 'calculator', color: 'hover:border-purple-400 hover:text-purple-600', gradient: 'from-purple-500/10 to-purple-600/5' },
    { label: 'Electronics', icon: Laptop, val: 'electronics', color: 'hover:border-indigo-400 hover:text-indigo-600', gradient: 'from-indigo-500/10 to-indigo-600/5' },
    { label: 'Keys', icon: Key, val: 'keys', color: 'hover:border-amber-400 hover:text-amber-600', gradient: 'from-amber-500/10 to-amber-600/5' },
    { label: 'Wallets', icon: Briefcase, val: 'wallet', color: 'hover:border-emerald-400 hover:text-emerald-600', gradient: 'from-emerald-500/10 to-emerald-600/5' },
    { label: 'Bags', icon: ShoppingBag, val: 'bags', color: 'hover:border-teal-400 hover:text-teal-600', gradient: 'from-teal-500/10 to-teal-600/5' },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white py-24 sm:py-32 lg:py-40">
        {/* Glowing Background Spheres */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-indigo-600/30 rounded-full blur-[160px] animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[150px]" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-9">
            {/* Challenge Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-bold tracking-wide text-cyan-300 backdrop-blur-md shadow-inner animate-fade-in-up">
              <Sparkles size={18} className="text-amber-400" />
              AWS Deploy Challenge — Campus Lost & Found Platform
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
              Lost Something{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
                on Campus?
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-200/90 max-w-2xl mx-auto font-normal leading-relaxed">
              Find it faster. Report lost or found items, search by building location, and connect with fellow students securely.
            </p>

            {/* CTA Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
              <Link
                to="/report/lost"
                className="btn btn-lg py-4 px-8 bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/30 w-full sm:w-auto font-extrabold text-base rounded-2xl"
                id="hero-report-lost"
              >
                <AlertCircle size={20} />
                Report Lost Item
              </Link>
              <Link
                to="/report/found"
                className="btn btn-lg py-4 px-8 bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 w-full sm:w-auto font-extrabold text-base rounded-2xl"
                id="hero-report-found"
              >
                <CheckCircle size={20} />
                Report Found Item
              </Link>
              <Link
                to="/browse"
                className="btn btn-lg py-4 px-8 bg-white/10 hover:bg-white/20 text-white border border-white/25 w-full sm:w-auto font-bold backdrop-blur-md text-base rounded-2xl"
                id="hero-browse"
              >
                <Search size={20} />
                Browse Items
              </Link>
            </div>

            {/* Quick Search trigger */}
            <div className="pt-4 max-w-xl mx-auto">
              <div 
                onClick={() => navigate('/browse')}
                className="flex items-center gap-4 px-7 py-4.5 bg-white/10 hover:bg-white/20 border border-white/25 rounded-2xl cursor-pointer transition-all group backdrop-blur-md shadow-2xl"
              >
                <Search size={22} className="text-cyan-300 group-hover:scale-110 transition-transform" />
                <span className="text-slate-200 text-sm sm:text-base font-medium">
                  Search by calculator, ID card, keys, or library...
                </span>
                <ArrowRight size={20} className="ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== QUICK CATEGORIES STRIP ==================== */}
      <section className="py-14 sm:py-18 bg-white border-b border-surface-200/60">
        <div className="container">
          <div className="flex items-center justify-between gap-4 mb-8">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Popular Categories</span>
            <Link to="/browse" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1.5">
              View All Categories <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
            {categoriesQuick.map((cat) => (
              <Link
                key={cat.val}
                to={`/browse?category=${cat.val}`}
                className={`bg-surface-50 hover:bg-white rounded-3xl border border-surface-200/80 p-6 flex flex-col items-center gap-4 transition-all card-hover group text-center ${cat.color}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors shadow-xs border border-surface-200/60">
                  <cat.icon size={26} className="text-slate-700 group-hover:text-indigo-600 transition-colors" />
                </div>
                <span className="text-sm font-bold text-surface-800 truncate">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== METRICS DASHBOARD ==================== */}
      <section className="py-20 sm:py-24">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Real-Time Stats</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-surface-900 mt-2">Campus Dashboard</h2>
            <p className="text-surface-500 mt-3 text-base sm:text-lg max-w-lg mx-auto">Live overview of lost and found activity across all campus locations</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8" id="stats-section">
            {[
              { label: 'Lost Items', value: stats.totalLost, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200/60' },
              { label: 'Found Items', value: stats.totalFound, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200/60' },
              { label: 'Items Recovered', value: stats.recovered, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200/60' },
              { label: 'Active Reports', value: stats.active, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200/60' },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`bg-white rounded-3xl border ${stat.border} p-8 sm:p-9 card-hover flex flex-col items-center text-center gap-4 shadow-sm`}
              >
                <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center shrink-0 shadow-xs`}>
                  <stat.icon size={30} className={stat.color} />
                </div>
                <div>
                  <div className="text-4xl font-black text-surface-900">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-bold text-surface-500 mt-1.5 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-indigo-50/30 border-y border-surface-200/60" id="how-it-works">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">3-Step Process</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-surface-900 mt-2">How Campus L&F Works</h2>
            <p className="text-surface-500 mt-3 text-base sm:text-lg">Centralized, fast, and simple for every college student</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                icon: FileText,
                title: 'Report Item',
                description: 'Lost or found an item? Submit a simple report with details, building location, and your contact info.',
                bg: 'bg-indigo-50 text-indigo-600',
                accent: 'border-indigo-200/60',
              },
              {
                step: '02',
                icon: Search,
                title: 'Search & Match',
                description: 'Browse the live feed, search by item keywords, or filter by library, lab, and cafeteria locations.',
                bg: 'bg-emerald-50 text-emerald-600',
                accent: 'border-emerald-200/60',
              },
              {
                step: '03',
                icon: CheckCircle,
                title: 'Safely Recover',
                description: 'Contact the reporter directly, verify ownership, and recover your lost item smoothly!',
                bg: 'bg-amber-50 text-amber-600',
                accent: 'border-amber-200/60',
              },
            ].map((item) => (
              <div key={item.step} className={`bg-white rounded-3xl p-9 sm:p-10 text-center border ${item.accent} card-hover space-y-5 shadow-sm`}>
                <div className={`w-18 h-18 rounded-2xl ${item.bg} flex items-center justify-center mx-auto shadow-xs`}>
                  <item.icon size={34} />
                </div>
                <span className="inline-block text-xs font-black text-surface-400 uppercase tracking-widest">Step {item.step}</span>
                <h3 className="text-2xl font-extrabold text-surface-900">{item.title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed font-normal">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== RECENT REPORTS ==================== */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 sm:mb-14">
            <div>
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">Live Updates</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-surface-900 mt-2">Recent Campus Reports</h2>
              <p className="text-surface-500 text-base sm:text-lg mt-2">Latest lost and found items posted by students</p>
            </div>
            <Link to="/browse" className="btn btn-secondary font-bold px-6 py-3.5 rounded-2xl" id="view-all-link">
              View Marketplace
              <ArrowRight size={18} />
            </Link>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {items.map((item) => (
                <ItemCard key={item.itemId} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-surface-200/80">
              <div className="w-20 h-20 rounded-3xl bg-surface-100 flex items-center justify-center mx-auto mb-5">
                <Search size={36} className="text-surface-400" />
              </div>
              <h3 className="text-xl font-bold text-surface-800 mb-2">No Reports Yet</h3>
              <p className="text-surface-500 mb-6 max-w-md mx-auto">Items will appear here once they are loaded from DynamoDB.</p>
              <Link to="/report/lost" className="btn btn-primary">Report an Item</Link>
            </div>
          )}
        </div>
      </section>

      {/* ==================== AWS ARCHITECTURE BANNER ==================== */}
      <section className="py-12 pb-24">
        <div className="container">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-10 sm:p-14 text-white border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px]" />
            
            <div className="space-y-4 text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Zap size={15} /> AWS Weekend Challenge Architecture
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold">Powered by AWS Amplify & Amazon DynamoDB</h3>
              <p className="text-slate-300 text-base max-w-xl leading-relaxed">
                Built specifically as a serverless application: AWS Amplify for hosting & Amazon DynamoDB for live NoSQL database storage.
              </p>
            </div>
            <Link to="/report/lost" className="btn btn-lg py-4 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shrink-0 shadow-lg shadow-emerald-500/30 relative z-10 text-base rounded-2xl">
              Post a Report Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
