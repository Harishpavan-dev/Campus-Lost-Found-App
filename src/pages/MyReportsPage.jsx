import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { getAllItems, syncWithDynamoDB } from '../data/mockData';
import { formatDate, getTypeColor, getStatusColor } from '../utils/helpers';
import { getCategoryLabel, getLocationLabel } from '../data/constants';
import EmptyState from '../components/common/EmptyState';

export default function MyReportsPage() {
  const [items, setItems] = useState(() => getAllItems());

  useEffect(() => {
    syncWithDynamoDB().then(() => {
      setItems(getAllItems());
    });
  }, []);

  const activeCount = items.filter(i => i.status === 'ACTIVE').length;
  const resolvedCount = items.filter(i => i.status === 'RESOLVED').length;

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 text-white">
        <div className="container py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Manage Campus Reports</h1>
              <p className="text-slate-300 text-sm sm:text-base mt-2">View all lost & found item reports posted across campus</p>
            </div>

            <div className="flex gap-3">
              <Link to="/report/lost" className="btn btn-danger font-bold shadow-lg">
                <AlertCircle size={16} /> Report Lost
              </Link>
              <Link to="/report/found" className="btn btn-success font-bold shadow-lg">
                <CheckCircle size={16} /> Report Found
              </Link>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-md">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl font-black">{items.length}</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Total</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl font-black text-emerald-400">{activeCount}</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Active</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl font-black text-indigo-400">{resolvedCount}</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Resolved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10 sm:py-14 max-w-4xl mx-auto">
        {/* List of Reports */}
        {items.length === 0 ? (
          <EmptyState
            title="No reports posted yet"
            description="No lost or found items have been reported yet across campus."
            actionLabel="Report an Item Now"
            actionOnClick={() => window.location.href = '/report/lost'}
          />
        ) : (
          <div className="space-y-5">
            {items.map((item, index) => (
              <div
                key={item.itemId}
                className="bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5 card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`badge ${getTypeColor(item.type)} font-bold text-xs`}>
                      {item.type}
                    </span>
                    <span className={`badge ${getStatusColor(item.status)} font-semibold text-xs`}>
                      {item.status}
                    </span>
                    <span className="text-xs text-surface-400 ml-1">
                      • {formatDate(item.date)}
                    </span>
                  </div>

                  <h3 className="font-bold text-surface-900 text-lg sm:text-xl">
                    {item.itemName}
                  </h3>

                  <p className="text-sm text-surface-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="text-xs text-surface-600 flex flex-wrap gap-5 pt-1">
                    <span><strong>Category:</strong> {getCategoryLabel(item.category)}</span>
                    <span><strong>Location:</strong> {getLocationLabel(item.location)}</span>
                    <span><strong>Reporter:</strong> {item.reporterName}</span>
                  </div>
                </div>

                {/* Actions - View Button ONLY */}
                <div className="flex items-center shrink-0 pt-4 sm:pt-0 border-t sm:border-0 border-surface-100">
                  <Link
                    to={`/item/${item.itemId}`}
                    className="btn btn-primary btn-sm font-bold shadow-xs flex items-center gap-1.5"
                    title="View Item Details"
                  >
                    <Eye size={16} />
                    View Details
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
