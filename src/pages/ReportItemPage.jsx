import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  FileText,
  User,
  Mail,
  Phone,
  Check,
  Search,
  PlusCircle,
  Sparkles,
  MapPin,
  Tag,
  Calendar,
} from 'lucide-react';
import { addItem } from '../data/mockData';
import { CATEGORIES, LOCATIONS, getCategoryLabel, getLocationLabel } from '../data/constants';
import { useToast } from '../context/ToastContext';

export default function ReportItemPage() {
  const { type: urlType } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const reportType = urlType === 'found' ? 'FOUND' : 'LOST';

  const [formData, setFormData] = useState({
    type: reportType,
    itemName: '',
    category: 'electronics',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: 'library',
    color: '',
    brand: '',
    identifyingFeatures: '',
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
  });

  const [errors, setErrors] = useState({});
  const [submittedItem, setSubmittedItem] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.itemName.trim()) errs.itemName = 'Item name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.reporterName.trim()) errs.reporterName = 'Student name is required';
    if (!formData.reporterEmail.trim()) {
      errs.reporterEmail = 'Student email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.reporterEmail)) {
      errs.reporterEmail = 'Please enter a valid email address';
    }
    if (!formData.reporterPhone.trim()) errs.reporterPhone = 'Phone number is required to contact you';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Combine email and phone for unified contact record
    const payload = {
      ...formData,
      reporterContact: `${formData.reporterEmail} | ${formData.reporterPhone}`,
    };

    const newItem = addItem(payload);
    setSubmittedItem(newItem);
    setShowSuccessModal(true);
    addToast(
      `${reportType === 'LOST' ? 'Lost' : 'Found'} item reported successfully!`,
      'success'
    );
  };

  const handleReportAnother = () => {
    setShowSuccessModal(false);
    setSubmittedItem(null);
    setFormData({
      type: reportType,
      itemName: '',
      category: 'electronics',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: 'library',
      color: '',
      brand: '',
      identifyingFeatures: '',
      reporterName: '',
      reporterEmail: '',
      reporterPhone: '',
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Colored Header Banner */}
      <div className={`${reportType === 'LOST' ? 'bg-gradient-to-br from-rose-500 via-red-500 to-rose-600' : 'bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600'} text-white`}>
        <div className="container py-10 sm:py-14">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              {reportType === 'LOST' ? <AlertCircle size={28} /> : <CheckCircle size={28} />}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Report {reportType === 'LOST' ? 'Lost' : 'Found'} Item
              </h1>
              <p className="text-white/70 text-sm mt-1">Fill in the details below to post a report. No account login needed!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10 sm:py-14 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Item Information Card */}
          <div className="bg-white rounded-3xl border border-surface-200/80 p-7 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <FileText size={20} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="font-bold text-surface-900 text-lg">Item Information</h2>
                <p className="text-xs text-surface-500">Basic details about the item</p>
              </div>
            </div>

            {/* Report Type Selector */}
            <div>
              <label className="form-label mb-2.5">Report Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`py-4 px-5 rounded-2xl text-sm font-bold border-2 transition-all ${
                    formData.type === 'LOST'
                      ? 'bg-red-50 text-red-600 border-red-300 ring-2 ring-red-500/20 shadow-sm'
                      : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
                  }`}
                  onClick={() => setFormData({ ...formData, type: 'LOST' })}
                >
                  🔴 Report Lost Item
                </button>
                <button
                  type="button"
                  className={`py-4 px-5 rounded-2xl text-sm font-bold border-2 transition-all ${
                    formData.type === 'FOUND'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
                  }`}
                  onClick={() => setFormData({ ...formData, type: 'FOUND' })}
                >
                  🟢 Report Found Item
                </button>
              </div>
            </div>

            {/* Item Name */}
            <div>
              <label className="form-label mb-2">Item Name *</label>
              <input
                type="text"
                className="form-input py-3.5"
                placeholder="e.g., Casio Scientific Calculator FX-991EX, Blue Student ID Card..."
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                id="item-name-input"
              />
              {errors.itemName && <p className="form-error mt-2">{errors.itemName}</p>}
            </div>

            {/* Category & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="form-label mb-2">Category *</label>
                <select
                  className="form-input py-3.5"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  id="category-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label mb-2">Campus Location *</label>
                <select
                  className="form-input py-3.5"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  id="location-select"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Color Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="form-label mb-2">Date Lost/Found *</label>
                <input
                  type="date"
                  className="form-input py-3.5"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  id="date-input"
                />
              </div>

              <div>
                <label className="form-label mb-2">Item Color (Optional)</label>
                <input
                  type="text"
                  className="form-input py-3.5"
                  placeholder="e.g. Navy Blue, Black, Silver..."
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  id="color-input"
                />
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="form-label mb-2">Brand / Make (Optional)</label>
              <input
                type="text"
                className="form-input py-3.5"
                placeholder="e.g. Apple, Casio, Jansport, Dell..."
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                id="brand-input"
              />
            </div>

            {/* Description */}
            <div>
              <label className="form-label mb-2">Description *</label>
              <textarea
                rows={4}
                className="form-input py-3.5"
                placeholder="Provide details about where and how the item was lost or found..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                id="description-input"
              />
              {errors.description && <p className="form-error mt-2">{errors.description}</p>}
            </div>

            {/* Identifying Features */}
            <div>
              <label className="form-label mb-2">Identifying Features (Optional)</label>
              <input
                type="text"
                className="form-input py-3.5"
                placeholder="e.g. Scratch on top cover, keychain attached, initial written inside..."
                value={formData.identifyingFeatures}
                onChange={(e) => setFormData({ ...formData, identifyingFeatures: e.target.value })}
                id="features-input"
              />
            </div>
          </div>

          {/* Student Reporter Mandatory Verification Card */}
          <div className="bg-white rounded-3xl border-2 border-indigo-200 p-7 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <User size={20} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="font-bold text-surface-900 text-lg">Student Identification (Required)</h2>
                <p className="text-xs text-indigo-600 font-medium">No login required! Provide your email & phone so others can identify & contact you.</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="form-label mb-2">Your Full Name *</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input
                    type="text"
                    className="form-input pl-11 py-3.5"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.reporterName}
                    onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                    id="reporter-name-input"
                  />
                </div>
                {errors.reporterName && <p className="form-error mt-2">{errors.reporterName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Student Email */}
                <div>
                  <label className="form-label mb-2">Student Email ID *</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                      type="email"
                      className="form-input pl-11 py-3.5"
                      placeholder="e.g. rahul@campus.edu"
                      value={formData.reporterEmail}
                      onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                      id="reporter-email-input"
                    />
                  </div>
                  {errors.reporterEmail && <p className="form-error mt-2">{errors.reporterEmail}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="form-label mb-2">Phone / WhatsApp Number *</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                      type="text"
                      className="form-input pl-11 py-3.5"
                      placeholder="e.g. +91 9876543210"
                      value={formData.reporterPhone}
                      onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                      id="reporter-phone-input"
                    />
                  </div>
                  {errors.reporterPhone && <p className="form-error mt-2">{errors.reporterPhone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`btn btn-lg w-full font-bold text-white text-base py-5 shadow-lg ${
                formData.type === 'LOST' ? 'btn-danger shadow-rose-500/20' : 'btn-success shadow-emerald-500/20'
              }`}
              id="submit-report-btn"
            >
              {formData.type === 'LOST' ? (
                <><AlertCircle size={20} /> Submit Lost Item Report</>
              ) : (
                <><CheckCircle size={20} /> Submit Found Item Report</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ==================== SUCCESS POP-UP CONFIRMATION MODAL ==================== */}
      {showSuccessModal && submittedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl border border-surface-200 p-8 sm:p-10 max-w-lg w-full shadow-2xl space-y-6 text-center relative overflow-hidden">
            {/* Header Icon */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg ${
              submittedItem.type === 'LOST' ? 'bg-rose-100 text-rose-600 shadow-rose-500/20' : 'bg-emerald-100 text-emerald-600 shadow-emerald-500/20'
            }`}>
              <Sparkles size={40} />
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                submittedItem.type === 'LOST' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}>
                {submittedItem.type === 'LOST' ? '🔴 Lost Item Posted' : '🟢 Found Item Posted'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-surface-900">
                Report Submitted Successfully!
              </h2>
              <p className="text-sm text-surface-600 leading-relaxed">
                Your report is now live on the Campus Lost & Found marketplace and synced with AWS DynamoDB.
              </p>
            </div>

            {/* Item Details Brief Summary */}
            <div className="p-5 rounded-2xl bg-surface-50 border border-surface-200/80 text-left space-y-3">
              <h3 className="font-extrabold text-surface-900 text-base">{submittedItem.itemName}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-surface-600">
                <span className="flex items-center gap-1 font-semibold text-surface-800">
                  <Tag size={13} className="text-indigo-600" /> {getCategoryLabel(submittedItem.category)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-surface-800">
                  <MapPin size={13} className="text-indigo-600" /> {getLocationLabel(submittedItem.location)}
                </span>
              </div>
              <p className="text-xs text-surface-500 border-t border-surface-200/60 pt-2.5">
                Reported by <strong className="text-surface-800">{submittedItem.reporterName}</strong> ({submittedItem.reporterEmail})
              </p>
            </div>

            {/* Modal Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate(`/item/${submittedItem.itemId}`)}
                className="btn btn-primary btn-lg w-full font-bold shadow-md shadow-indigo-500/20 text-sm py-4 rounded-2xl"
              >
                View Report Details Page
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/browse')}
                  className="btn btn-secondary font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2"
                >
                  <Search size={16} /> Browse Marketplace
                </button>
                <button
                  onClick={handleReportAnother}
                  className="btn btn-secondary font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2"
                >
                  <PlusCircle size={16} /> Report Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
