import { Link } from 'react-router-dom';
import {
  AlertCircle, CheckCircle, Clock, CheckSquare, PlusCircle,
  Search, ArrowRight, Eye, MessageCircle, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getItemsByUser, getClaimsByUser, getMessagesByUser } from '../data/mockData';
import { formatDate, getTypeColor, getStatusColor } from '../utils/helpers';
import { getCategoryLabel, getLocationLabel } from '../data/constants';

export default function DashboardPage() {
  const { user } = useAuth();

  const userItems = getItemsByUser(user?.userId || '');
  const userClaims = getClaimsByUser(user?.userId || '');
  const userMessages = getMessagesByUser(user?.userId || '');

  const lostCount = userItems.filter((i) => i.type === 'lost').length;
  const foundCount = userItems.filter((i) => i.type === 'found').length;
  const pendingClaimsCount = userClaims.filter((c) => c.status === 'pending').length;
  const recoveredCount = userItems.filter((i) => i.status === 'resolved').length;

  const recentItems = [...userItems]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="py-8 animate-fade-in">
      <div className="container">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary-200 mb-1">
                Student Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome back, {user?.fullName || 'Student'}! 👋
              </h1>
              <p className="text-primary-100/80 text-sm mt-1 max-w-lg">
                Manage your reported items, check claim statuses, and view in-app messages.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/report/lost" className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none shadow-md">
                <AlertCircle size={15} />
                Report Lost
              </Link>
              <Link to="/report/found" className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-none shadow-md">
                <CheckCircle size={15} />
                Report Found
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-surface-200/80 p-5 card-hover">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-3">
              <AlertCircle size={20} />
            </div>
            <div className="text-2xl font-bold text-surface-900">{lostCount}</div>
            <div className="text-sm text-surface-500">My Lost Reports</div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-200/80 p-5 card-hover">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mb-3">
              <CheckCircle size={20} />
            </div>
            <div className="text-2xl font-bold text-surface-900">{foundCount}</div>
            <div className="text-sm text-surface-500">My Found Reports</div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-200/80 p-5 card-hover">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
              <Clock size={20} />
            </div>
            <div className="text-2xl font-bold text-surface-900">{pendingClaimsCount}</div>
            <div className="text-sm text-surface-500">Pending Claims</div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-200/80 p-5 card-hover">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3">
              <CheckSquare size={20} />
            </div>
            <div className="text-2xl font-bold text-surface-900">{recoveredCount}</div>
            <div className="text-sm text-surface-500">Recovered Items</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-surface-200/80 p-6 mb-8">
          <h2 className="text-lg font-bold text-surface-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/report/lost"
              className="p-4 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-700 flex items-center gap-3 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Report Lost Item</p>
                <p className="text-xs text-red-500/80">Lost something on campus?</p>
              </div>
              <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              to="/report/found"
              className="p-4 rounded-xl border border-green-200 bg-green-50/50 hover:bg-green-50 text-green-700 flex items-center gap-3 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Report Found Item</p>
                <p className="text-xs text-green-500/80">Found an item on campus?</p>
              </div>
              <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              to="/browse"
              className="p-4 rounded-xl border border-primary-200 bg-primary-50/50 hover:bg-primary-50 text-primary-700 flex items-center gap-3 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                <Search size={20} className="text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Browse All Items</p>
                <p className="text-xs text-primary-600/80">Search recent reports</p>
              </div>
              <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* Dashboard Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-surface-900">My Recent Reports</h2>
              <Link to="/my-reports" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {recentItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-surface-200/80 p-8 text-center">
                <FileText size={36} className="text-surface-400 mx-auto mb-3" />
                <h3 className="font-semibold text-surface-800 text-sm mb-1">No reports posted yet</h3>
                <p className="text-xs text-surface-500 mb-4">Report your lost or found items to get started.</p>
                <Link to="/report/lost" className="btn btn-primary btn-sm">Report Lost Item</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="bg-white rounded-2xl border border-surface-200/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-hover"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        item.type === 'lost' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                      }`}>
                        {item.type === 'lost' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-surface-900 text-sm">{item.itemName}</h3>
                          <span className={`badge ${getTypeColor(item.type)} text-[10px]`}>
                            {item.type}
                          </span>
                          <span className={`badge ${getStatusColor(item.status)} text-[10px]`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-surface-500">
                          <span>{getCategoryLabel(item.category)}</span>
                          <span>•</span>
                          <span>{getLocationLabel(item.location)}</span>
                          <span>•</span>
                          <span>{formatDate(item.date)}</span>
                        </div>
                      </div>
                    </div>

                    <Link to={`/item/${item.itemId}`} className="btn btn-secondary btn-sm shrink-0">
                      <Eye size={14} />
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* In-App Messages / Claims */}
          <div>
            <h2 className="text-lg font-bold text-surface-900 mb-4">Messages & Claims</h2>
            <div className="bg-white rounded-2xl border border-surface-200/80 p-5 space-y-4">
              {userMessages.length === 0 ? (
                <div className="text-center py-6">
                  <MessageCircle size={32} className="text-surface-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-surface-600">No messages yet</p>
                  <p className="text-xs text-surface-400 mt-1">
                    Messages regarding your reported items will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userMessages.map((msg) => (
                    <div key={msg.messageId} className="p-3 bg-surface-50 rounded-xl border border-surface-200/60 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-surface-800">{msg.senderName}</span>
                        <span className="text-surface-400">{formatDate(msg.createdAt)}</span>
                      </div>
                      <p className="text-surface-600 leading-relaxed line-clamp-2">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
