import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { addItem } from '../data/mockData';
import { CATEGORIES, LOCATIONS } from '../data/constants';
import { useToast } from '../context/ToastContext';

export default function ReportItemPage() {
  const { type: urlType } = useParams(); // 'lost' or 'found'
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
    reporterContact: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.itemName.trim()) errs.itemName = 'Item name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.reporterName.trim()) errs.reporterName = 'Reporter name is required';
    if (!formData.reporterContact.trim()) errs.reporterContact = 'Reporter contact is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newItem = addItem(formData);
    addToast(
      `${reportType === 'LOST' ? 'Lost' : 'Found'} item reported successfully!`,
      'success'
    );
    navigate(`/item/${newItem.itemId}`);
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="container max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-surface-600 hover:text-surface-900 mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white ${
                reportType === 'LOST' ? 'bg-red-500' : 'bg-emerald-500'
              }`}
            >
              {reportType === 'LOST' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">
                Report {reportType === 'LOST' ? 'Lost' : 'Found'} Item
              </h1>
              <p className="text-xs text-surface-500">Fill in the details below to help campus students identify this item</p>
            </div>
          </div>
        </div>

        {/* Form Box */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-8 shadow-xs space-y-5">
          {/* Report Type Selector */}
          <div>
            <label className="form-label">Report Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                  formData.type === 'LOST'
                    ? 'bg-red-50 text-red-600 border-red-300 ring-2 ring-red-500/20'
                    : 'bg-white text-surface-600 border-surface-200'
                }`}
                onClick={() => setFormData({ ...formData, type: 'LOST' })}
              >
                🔴 Report Lost Item
              </button>
              <button
                type="button"
                className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                  formData.type === 'FOUND'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-300 ring-2 ring-emerald-500/20'
                    : 'bg-white text-surface-600 border-surface-200'
                }`}
                onClick={() => setFormData({ ...formData, type: 'FOUND' })}
              >
                🟢 Report Found Item
              </button>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="form-label">Item Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Casio Scientific Calculator FX-991EX, Blue Student ID Card..."
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              id="item-name-input"
            />
            {errors.itemName && <p className="form-error">{errors.itemName}</p>}
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category *</label>
              <select
                className="form-input"
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
              <label className="form-label">Campus Location *</label>
              <select
                className="form-input"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date Lost/Found *</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                id="date-input"
              />
            </div>

            <div>
              <label className="form-label">Item Color (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Navy Blue, Black, Silver..."
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                id="color-input"
              />
            </div>
          </div>

          {/* Brand */}
          <div>
            <label className="form-label">Brand / Make (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Apple, Casio, Jansport, Dell..."
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              id="brand-input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description *</label>
            <textarea
              rows={3}
              className="form-input"
              placeholder="Provide details about where and how the item was lost or found..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              id="description-input"
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          {/* Identifying Features */}
          <div>
            <label className="form-label">Identifying Features (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Scratch on top cover, keychain attached, initial written inside..."
              value={formData.identifyingFeatures}
              onChange={(e) => setFormData({ ...formData, identifyingFeatures: e.target.value })}
              id="features-input"
            />
          </div>

          {/* Reporter Contact Information */}
          <div className="pt-4 border-t border-surface-100 space-y-4">
            <h3 className="font-bold text-surface-900 text-sm">Reporter Contact Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  id="reporter-name-input"
                />
                {errors.reporterName && <p className="form-error">{errors.reporterName}</p>}
              </div>

              <div>
                <label className="form-label">Email / Phone *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. rahul@campus.edu or +91 9876543210"
                  value={formData.reporterContact}
                  onChange={(e) => setFormData({ ...formData, reporterContact: e.target.value })}
                  id="reporter-contact-input"
                />
                {errors.reporterContact && <p className="form-error">{errors.reporterContact}</p>}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className={`btn btn-lg w-full font-bold text-white ${
                formData.type === 'LOST' ? 'btn-danger' : 'btn-success'
              }`}
              id="submit-report-btn"
            >
              {formData.type === 'LOST' ? 'Report Lost Item' : 'Report Found Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
