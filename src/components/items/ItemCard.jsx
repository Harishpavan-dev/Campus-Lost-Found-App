import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Tag,
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
} from 'lucide-react';
import { formatDate, getTypeColor, getStatusColor } from '../../utils/helpers';
import { getCategoryLabel, getLocationLabel } from '../../data/constants';

// Get category visual icon & color theme
const getCategoryMeta = (cat) => {
  switch (cat) {
    case 'id-card':
      return { icon: CreditCard, color: 'text-sky-600 bg-sky-50' };
    case 'electronics':
      return { icon: Laptop, color: 'text-indigo-600 bg-indigo-50' };
    case 'keys':
      return { icon: Key, color: 'text-amber-600 bg-amber-50' };
    case 'books':
      return { icon: BookOpen, color: 'text-blue-600 bg-blue-50' };
    case 'calculator':
      return { icon: Calculator, color: 'text-purple-600 bg-purple-50' };
    case 'bags':
      return { icon: ShoppingBag, color: 'text-teal-600 bg-teal-50' };
    case 'clothing':
      return { icon: Shirt, color: 'text-rose-600 bg-rose-50' };
    case 'water-bottle':
      return { icon: Droplet, color: 'text-cyan-600 bg-cyan-50' };
    case 'documents':
      return { icon: FileText, color: 'text-emerald-600 bg-emerald-50' };
    case 'wallet':
      return { icon: Briefcase, color: 'text-amber-700 bg-amber-50' };
    default:
      return { icon: HelpCircle, color: 'text-surface-600 bg-surface-100' };
  }
};

export default function ItemCard({ item }) {
  const isLost = item.type === 'LOST';
  const catMeta = getCategoryMeta(item.category);
  const CatIcon = catMeta.icon;

  return (
    <div
      className="bg-white rounded-3xl border border-surface-200/80 p-5 sm:p-6 flex flex-col justify-between card-hover group h-full relative overflow-hidden"
      id={`item-card-${item.itemId}`}
    >
      <div>
        {/* Header Badges & Category Icon Box */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl ${catMeta.color} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform duration-300`}>
            <CatIcon size={24} />
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={`badge ${getTypeColor(item.type)} shadow-2xs`}>
              {isLost ? '🔴 LOST' : '🟢 FOUND'}
            </span>
            <span className={`badge ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
        </div>

        {/* Item Title */}
        <h3 className="font-extrabold text-surface-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
          {item.itemName}
        </h3>

        {/* Description */}
        <p className="text-sm text-surface-600 line-clamp-2 leading-relaxed mb-5 font-normal">
          {item.description}
        </p>

        {/* Info Pill Metadata Grid */}
        <div className="space-y-2 text-xs text-surface-600 pt-3 border-t border-surface-100/80 mb-4">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-surface-400 shrink-0" />
            <span className="font-semibold text-surface-800">{getCategoryLabel(item.category)}</span>
            {item.brand && (
              <span className="text-surface-400 font-normal">({item.brand})</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-surface-400 shrink-0" />
            <span className="truncate font-medium">{getLocationLabel(item.location)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-surface-400 shrink-0" />
            <span className="font-medium text-surface-500">{formatDate(item.date)}</span>
          </div>
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="pt-3 border-t border-surface-100 flex items-center justify-between gap-2">
        <span className="text-xs text-surface-400 truncate">
          By <span className="font-semibold text-surface-700">{item.reporterName}</span>
        </span>

        <Link
          to={`/item/${item.itemId}`}
          className="btn btn-secondary btn-sm group-hover:btn-primary transition-all font-bold shadow-2xs"
        >
          View Item
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
