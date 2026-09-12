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
      <div className="py-20 text-center container">
        <h2 className="text-2xl font-bold text-surface-800 mb-2">Item Not Found</h2>
        <p className="text-surface-500 mb-6">The requested item report does not exist or has been removed.</p>
        <Link to="/browse" className="btn btn-primary">
          Back to Browse
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
    addToast('Contact info copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="container max-w-4xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to all reports
        </Link>

        {/* Main Details Card */}
        <div className="bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-100 pb-6">
            <div className="flex items-center gap-2">
              <span className={`badge ${getTypeColor(item.type)} font-bold text-xs`}>
                {isLost ? '🔴 LOST ITEM' : '🟢 FOUND ITEM'}
              </span>
              <span className={`badge ${getStatusColor(item.status)} font-semibold text-xs`}>
                STATUS: {item.status}
              </span>
            </div>

            <span className="text-xs text-surface-400">
              Reported on {formatDate(item.createdAt)}
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 mb-3">
              {item.itemName}
            </h1>
            <p className="text-base text-surface-600 leading-relaxed whitespace-pre-line bg-surface-50 p-4 rounded-2xl border border-surface-100">
              {item.description}
            </p>
          </div>

          {/* Key Details Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-surface-200/60">
              <div className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Category</div>
              <div className="font-bold text-surface-800 flex items-center gap-2">
                <Tag size={16} className="text-primary-600" />
                {getCategoryLabel(item.category)}
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-surface-200/60">
              <div className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Campus Location</div>
              <div className="font-bold text-surface-800 flex items-center gap-2">
                <MapPin size={16} className="text-primary-600" />
                {getLocationLabel(item.location)}
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-surface-200/60">
              <div className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Date Reported</div>
              <div className="font-bold text-surface-800 flex items-center gap-2">
                <Calendar size={16} className="text-primary-600" />
                {formatDate(item.date)}
              </div>
            </div>

            {item.color && (
              <div className="p-4 bg-white rounded-2xl border border-surface-200/60">
                <div className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Color</div>
                <div className="font-bold text-surface-800">{item.color}</div>
              </div>
            )}

            {item.brand && (
              <div className="p-4 bg-white rounded-2xl border border-surface-200/60">
                <div className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Brand / Make</div>
                <div className="font-bold text-surface-800">{item.brand}</div>
              </div>
            )}

            {item.identifyingFeatures && (
              <div className="p-4 bg-white rounded-2xl border border-surface-200/60 sm:col-span-2 lg:col-span-3">
                <div className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Identifying Features</div>
                <div className="font-medium text-surface-800 text-sm">{item.identifyingFeatures}</div>
              </div>
            )}
          </div>

          {/* Reporter Info Section */}
          <div className="p-5 rounded-2xl bg-primary-50/70 border border-primary-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Reported By</div>
              <div className="text-lg font-bold text-surface-900">{item.reporterName}</div>
              <div className="text-xs text-surface-500 mt-0.5">{item.reporterContact}</div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowContactModal(true)}
                className="btn btn-primary font-bold w-full sm:w-auto"
                id="contact-reporter-btn"
              >
                <Mail size={16} />
                Contact Reporter
              </button>

              {item.status === 'ACTIVE' && (
                <button
                  onClick={handleMarkResolved}
                  className="btn btn-secondary font-bold w-full sm:w-auto text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                  id="mark-resolved-btn"
                >
                  <CheckCircle size={16} className="text-emerald-600" />
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Simple Contact Reporter Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-surface-200 p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-surface-100 pb-3">
              <h3 className="font-bold text-lg text-surface-900">Contact Item Reporter</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-surface-400 hover:text-surface-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-surface-600">
                You can reach out directly to <strong>{item.reporterName}</strong> using the contact information below:
              </p>

              <div className="p-4 bg-surface-50 rounded-2xl border border-surface-200/80 font-mono text-sm break-all text-surface-800 select-all">
                {item.reporterContact}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleCopyContact}
                className="btn btn-primary flex-1 font-semibold"
              >
                {copied ? <Check size={16} /> : <Share2 size={16} />}
                {copied ? 'Copied!' : 'Copy Contact Info'}
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
