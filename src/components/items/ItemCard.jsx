import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  ArrowRight,
  CreditCard,
  Laptop,
  Key,
  BookOpen,
  ShoppingBag,
  Shirt,
  Droplet,
  Calculator,
  FileText,
  HelpCircle,
  Briefcase,
  User,
  Tag,
} from 'lucide-react';
import { formatDate, getTypeColor } from '../../utils/helpers';
import { getCategoryLabel, getLocationLabel } from '../../data/constants';

// Get category visual icon & color theme
const getCategoryMeta = (cat) => {
  switch (cat) {
    case 'id-card':
      return { icon: CreditCard, color: 'text-sky-600 bg-sky-50 border-sky-200/80' };
    case 'electronics':
      return { icon: Laptop, color: 'text-indigo-600 bg-indigo-50 border-indigo-200/80' };
    case 'keys':
      return { icon: Key, color: 'text-amber-600 bg-amber-50 border-amber-200/80' };
    case 'books':
      return { icon: BookOpen, color: 'text-blue-600 bg-blue-50 border-blue-200/80' };
    case 'calculator':
      return { icon: Calculator, color: 'text-purple-600 bg-purple-50 border-purple-200/80' };
    case 'bags':
      return { icon: ShoppingBag, color: 'text-teal-600 bg-teal-50 border-teal-200/80' };
    case 'clothing':
      return { icon: Shirt, color: 'text-rose-600 bg-rose-50 border-rose-200/80' };
    case 'water-bottle':
      return { icon: Droplet, color: 'text-cyan-600 bg-cyan-50 border-cyan-200/80' };
    case 'documents':
      return { icon: FileText, color: 'text-emerald-600 bg-emerald-50 border-emerald-200/80' };
    case 'wallet':
      return { icon: Briefcase, color: 'text-amber-700 bg-amber-50 border-amber-200/80' };
    default:
      return { icon: HelpCircle, color: 'text-surface-600 bg-surface-100 border-surface-200' };
  }
};

export default function ItemCard({ item }) {
  const isLost = item.type === 'LOST';
  const catMeta = getCategoryMeta(item.category);
  const CatIcon = catMeta.icon;

  return (
    <div
      className="bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-7 flex flex-col justify-between card-hover group relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      id={`item-card-${item.itemId}`}
    >
      <div>
        {/* Top Bar: Icon + Category + Status Badges */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${catMeta.color} border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300`}>
              <CatIcon size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-surface-900">{getCategoryLabel(item.category)}</span>
              {item.brand ? (
                <span className="text-[11px] text-surface-400 font-medium">{item.brand}</span>
              ) : (
                <span className="text-[11px] text-surface-400 font-medium">Campus L&F</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`badge ${getTypeColor(item.type)} px-2.5 py-1 text-[11px] font-extrabold shadow-2xs`}>
              {isLost ? '🔴 LOST' : '🟢 FOUND'}
            </span>
            {item.status === 'RESOLVED' && (
              <span className="badge badge-resolved px-2.5 py-1 text-[11px] font-bold">
                ✓ RESOLVED
              </span>
            )}
          </div>
        </div>

        {/* Item Title */}
        <h3 className="font-extrabold text-surface-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
          {item.itemName}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-surface-600 line-clamp-2 leading-relaxed mb-5 font-normal">
          {item.description}
        </p>

        {/* Rich Metadata Pills Bar - Fills empty space perfectly */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100/80 text-surface-700 text-xs font-semibold border border-surface-200/50">
            <MapPin size={13} className="text-indigo-600" />
            <span className="truncate max-w-[140px]">{getLocationLabel(item.location)}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100/80 text-surface-600 text-xs font-medium border border-surface-200/50">
            <Calendar size={13} className="text-indigo-600" />
            <span>{formatDate(item.date)}</span>
          </div>

          {item.color && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
              <Tag size={13} />
              <span>{item.color}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="pt-4 border-t border-surface-100/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-surface-500 truncate">
          <User size={13} className="text-surface-400 shrink-0" />
          <span>By <strong className="text-surface-800 font-semibold">{item.reporterName}</strong></span>
        </div>

        <Link
          to={`/item/${item.itemId}`}
          className="btn btn-primary btn-sm px-4 py-2 group-hover:bg-indigo-700 transition-all font-bold text-xs shadow-sm shadow-indigo-500/20 shrink-0 rounded-xl"
        >
          View Details
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
