import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Users, FileText, AlertCircle, CheckCircle, Clock,
  Trash2, Eye, Flag, Search, X, CheckSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getAllItems, getAllUsers, deleteItem, updateItem } from '../data/mockData';
import { formatDate, getTypeColor, getStatusColor } from '../utils/helpers';
import { getCategoryLabel, getLocationLabel } from '../data/constants';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [items, setItems] = useState(() => getAllItems());
  const [users, setUsers] = useState(() => getAllUsers());
  const [activeTab, setActiveTab] = useState('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const totalUsers = users.length;
  const totalReports = items.length;
  const lostReports = items.filter((i) => i.type === 'lost').length;
  const foundReports = items.filter((i) => i.type === 'found').length;
  const resolvedReports = items.filter((i) => i.status === 'resolved').length;
  const claimedReports = items.filter((i) => i.status === 'claimed').length;

  const filteredItems = items.filter(
    (i) =>
      i.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteReport = (itemId) => {
    deleteItem(itemId);
    setItems((prev) => prev.filter((i) => i.itemId !== itemId));
    setDeleteId(null);
    toast.success('Inappropriate report deleted by Admin');
  };

  const handleFlagReview = (itemId) => {
    updateItem(itemId, { status: 'closed' });
    setItems((prev) =>
      prev.map((i) => (i.itemId === itemId ? { ...i, status: 'closed' } : i))
    );
    toast.warning('Report marked as closed/flagged');
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="bg-gradient-to-r from-surface-900 via-surface-800 to-primary-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Admin Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-surface-300 text-sm mt-1">
            System overview, content moderation, and user reports management.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-surface-200/80 p-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <Users size={18} />
            </div>
            <div className="text-xl font-bold text-surface-900">{totalUsers}</div>
            <div className="text-xs text-surface-500">Total Users</div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-200/80 p-4">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <FileText size={18} />
            </div>
            <div className="text-xl font-bold text-surface-900">{totalReports}</div>
            <div className="text-xs text-surface-500">Total Reports</div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-200/80 p-4">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-2">
              <AlertCircle size={18} />
            </div>
            <div className="text-xl font-bold text-surface-900">{lostReports}</div>
            <div className="text-xs text-surface-500">Lost Reports</div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-200/80 p-4">
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-2">
              <CheckCircle size={18} />
            </div>
            <div className="text-xl font-bold text-surface-900">{foundReports}</div>
            <div className="text-xs text-surface-500">Found Reports</div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-200/80 p-4">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <Clock size={18} />
            </div>
            <div className="text-xl font-bold text-surface-900">{claimedReports}</div>
            <div className="text-xs text-surface-500">Pending Claims</div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-200/80 p-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
              <CheckSquare size={18} />
            </div>
            <div className="text-xl font-bold text-surface-900">{resolvedReports}</div>
            <div className="text-xs text-surface-500">Resolved</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-surface-200/80 mb-6">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'reports'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-surface-500 hover:text-surface-800'
            }`}
          >
            Manage Reports ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-surface-500 hover:text-surface-800'
            }`}
          >
            User Accounts ({users.length})
          </button>
        </div>

        {/* Reports Management */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search reports or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 text-sm"
              />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-surface-200/80 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-50 border-b border-surface-200/80 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Item Name</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Posted By</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200/60 text-sm">
                    {filteredItems.map((item) => (
                      <tr key={item.itemId} className="hover:bg-surface-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-surface-900 max-w-[200px] truncate">
                          {item.itemName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`badge ${getTypeColor(item.type)} text-[10px]`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-surface-600">{item.userName}</td>
                        <td className="py-3.5 px-4 text-surface-500">{getCategoryLabel(item.category)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`badge ${getStatusColor(item.status)} text-[10px]`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-surface-500 text-xs">{formatDate(item.createdAt)}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/item/${item.itemId}`}
                              className="btn btn-ghost btn-icon text-surface-500 hover:text-surface-800"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </Link>
                            <button
                              onClick={() => handleFlagReview(item.itemId)}
                              className="btn btn-ghost btn-icon text-amber-600 hover:text-amber-700"
                              title="Mark for Review / Close"
                            >
                              <Flag size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteId(item.itemId)}
                              className="btn btn-ghost btn-icon text-red-600 hover:text-red-700"
                              title="Delete Inappropriate Report"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-surface-200/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200/80 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">User ID</th>
                    <th className="py-3.5 px-4">Full Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200/60 text-sm">
                  {users.map((u) => (
                    <tr key={u.userId} className="hover:bg-surface-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs text-surface-500">{u.userId}</td>
                      <td className="py-3.5 px-4 font-semibold text-surface-900">{u.fullName}</td>
                      <td className="py-3.5 px-4 text-surface-600">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`badge ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-surface-100 text-surface-700'
                          } text-[10px]`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-surface-500 text-xs">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setDeleteId(null)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-md p-6 text-center animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-surface-900 mb-2">Remove Inappropriate Report?</h3>
              <p className="text-sm text-surface-500 mb-6">
                As an Admin, you are deleting this report. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteReport(deleteId)}
                  className="btn btn-danger flex-1"
                  id="confirm-admin-delete"
                >
                  Delete Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
