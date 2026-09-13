import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Share2,
  Check,
  Palette,
  Award,
  Eye,
  Copy,
  Building,
} from 'lucide-react';
import { getItemById, updateItem } from '../data/mockData';
import { formatDate, getTypeColor, getStatusColor } from '../utils/helpers';
import { getCategoryLabel, getLocationLabel } from '../data/constants';
import { useToast } from '../context/ToastContext';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [item, setItem] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loaded = getItemById(id);
    if (loaded) {
      setItem(loaded);
    }
  }, [id]);

  if (!item) {
    return (
      <div className="py-28 text-center container">
        <div className="w-20 h-20 rounded-3xl bg-surface-100 flex items-center justify-center mx-auto mb-6">
          <Eye size={36} className="text-surface-400" />
        </div>
        <h2 className="text-2xl font-bold text-surface-800 mb-3">Item Not Found</h2>
        <p className="text-surface-500 mb-8 max-w-md mx-auto">The requested item report does not exist or has been removed.</p>
        <Link to="/browse" className="btn btn-primary btn-lg">
          Back to Browse Marketplace
        </Link>
      </div>
    );
  }

  const isLost = item.type === 'LOST';

  const handleMarkResolved = () => {
    const updated = updateItem(item.itemId, { status: 'RESOLVED' });
    if (updated) {
      setItem(updated);
      addToast('Report status updated to RESOLVED!', 'success');
    }
  };

  const handleCopyContact = () => {
    navigator.clipboard.writeText(item.reporterContact);
    setCopied(true);
    addToast('Contact details copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className={`${isLost ? 'bg-gradient-to-br from-rose-600 via-red-600 to-rose-700' : 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700'} text-white`}>
        <div className="container py-10 sm:py-14">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Back to Browse Marketplace
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-white/20 backdrop-blur-md border border-white/30 tracking-wider uppercase">
              {isLost ? '🔴 LOST ITEM' : '🟢 FOUND ITEM'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-white/20 backdrop-blur-md border border-white/30 tracking-wider uppercase">
              STATUS: {item.status}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {item.itemName}
          </h1>
          <p className="text-white/80 text-sm sm:text-base mt-2">
            Reported on {formatDate(item.createdAt || item.date)} • Campus Lost & Found
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="container py-10 sm:py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Item Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Block */}
            <div className="bg-white rounded-3xl border border-surface-200/90 p-8 sm:p-10 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-surface-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Eye size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-surface-900">Item Description</h2>
                  <p className="text-xs text-surface-500">Details provided by the student reporter</p>
                </div>
              </div>

              <p className="text-base text-surface-700 leading-relaxed font-normal whitespace-pre-line pt-2">
                {item.description}
              </p>
            </div>

            {/* Item Attributes Grid Block */}
            <div className="bg-white rounded-3xl border border-surface-200/90 p-8 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-surface-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Tag size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-surface-900">Item Specification</h2>
                  <p className="text-xs text-surface-500">Categorization & campus location</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-5 bg-surface-50/80 rounded-2xl border border-surface-200/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">
                    <Tag size={14} className="text-indigo-600" /> Category
                  </div>
                  <div className="font-extrabold text-surface-900 text-base">
                    {getCategoryLabel(item.category)}
                  </div>
                </div>

                <div className="p-5 bg-surface-50/80 rounded-2xl border border-surface-200/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">
                    <Building size={14} className="text-indigo-600" /> Campus Location
                  </div>
                  <div className="font-extrabold text-surface-900 text-base">
                    {getLocationLabel(item.location)}
                  </div>
                </div>

                <div className="p-5 bg-surface-50/80 rounded-2xl border border-surface-200/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">
                    <Calendar size={14} className="text-indigo-600" /> Date Reported
                  </div>
                  <div className="font-extrabold text-surface-900 text-base">
                    {formatDate(item.date)}
                  </div>
                </div>

                {item.color && (
                  <div className="p-5 bg-surface-50/80 rounded-2xl border border-surface-200/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">
                      <Palette size={14} className="text-indigo-600" /> Color
                    </div>
                    <div className="font-extrabold text-surface-900 text-base">{item.color}</div>
                  </div>
                )}

                {item.brand && (
                  <div className="p-5 bg-surface-50/80 rounded-2xl border border-surface-200/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">
                      <Award size={14} className="text-indigo-600" /> Brand / Make
                    </div>
                    <div className="font-extrabold text-surface-900 text-base">{item.brand}</div>
                  </div>
                )}
              </div>

              {item.identifyingFeatures && (
                <div className="p-5 bg-surface-50/80 rounded-2xl border border-surface-200/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">
                    <Eye size={14} className="text-indigo-600" /> Identifying Marks / Features
                  </div>
                  <div className="font-semibold text-surface-800 text-sm leading-relaxed">{item.identifyingFeatures}</div>
                </div>
              )}
            </div>
          </div>

          {/* Reporter Sidebar Card (1 Col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border-2 border-indigo-200 p-8 shadow-md space-y-6 sticky top-28">
              <div className="flex items-center gap-3 pb-4 border-b border-surface-100">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <User size={24} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-black text-surface-900 text-lg">Reporter Contact</h3>
                  <p className="text-xs text-indigo-600 font-semibold">Student Verification Info</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block mb-1">Student Name</label>
                  <div className="text-xl font-extrabold text-surface-900">{item.reporterName}</div>
                </div>

                <div>
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block mb-1">Contact Email & Phone</label>
                  <div className="p-4 rounded-2xl bg-surface-50 border border-surface-200/80 text-sm font-semibold text-surface-800 break-all leading-relaxed">
                    {item.reporterContact}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="btn btn-primary btn-lg w-full font-bold shadow-md shadow-indigo-500/20"
                  id="contact-reporter-btn"
                >
                  <Mail size={18} />
                  Contact Reporter
                </button>

                <button
                  onClick={handleCopyContact}
                  className="btn btn-secondary w-full font-semibold"
                >
                  <Copy size={16} />
                  {copied ? 'Copied!' : 'Copy Contact Details'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Contact Reporter Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-surface-200 p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-surface-100 pb-4">
              <h3 className="font-bold text-xl text-surface-900">Contact Student Reporter</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-surface-400 hover:text-surface-700 font-bold p-2 hover:bg-surface-100 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-surface-600 leading-relaxed">
                You can connect directly with <strong>{item.reporterName}</strong> using the details below:
              </p>

              <div className="p-5 bg-surface-50 rounded-2xl border border-surface-200/80 font-mono text-sm break-all text-surface-900 select-all font-bold">
                {item.reporterContact}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleCopyContact}
                className="btn btn-primary flex-1 font-bold"
              >
                {copied ? <Check size={16} /> : <Share2 size={16} />}
                {copied ? 'Copied!' : 'Copy Details'}
              </button>

              <button
                onClick={() => setShowContactModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
