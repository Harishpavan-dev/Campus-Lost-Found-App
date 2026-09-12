import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, CheckCircle, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import { getAllItems, deleteItem, updateItem } from '../data/mockData';
import { formatDate, getTypeColor, getStatusColor } from '../utils/helpers';
import { getCategoryLabel, getLocationLabel } from '../data/constants';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/common/EmptyState';

export default function MyReportsPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState(() => getAllItems());

  const handleMarkResolved = (id) => {
    updateItem(id, { status: 'RESOLVED' });
    setItems(getAllItems());
    addToast('Report marked as RESOLVED!', 'success');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteItem(id);
      setItems(getAllItems());
      addToast('Report deleted successfully.', 'info');
    }
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="container max-w-4xl mx-auto space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-surface-900">My Reports</h1>
            <p className="text-surface-500 text-sm mt-1">Manage and update your reported campus items</p>
          </div>

          <div className="flex gap-2">
            <Link to="/report/lost" className="btn btn-danger btn-sm font-semibold">
              + Report Lost
            </Link>
            <Link to="/report/found" className="btn btn-success btn-sm font-semibold">
              + Report Found
            </Link>
          </div>
        </div>

        {/* List of Reports */}
        {items.length === 0 ? (
          <EmptyState
            title="No reports created yet"
            description="You have not created any lost or found item reports."
            actionLabel="Report an Item Now"
            onAction={() => window.location.href = '/report/lost'}
          />
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.itemId}
                className="bg-white rounded-2xl border border-surface-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${getTypeColor(item.type)} font-bold text-xs`}>
                      {item.type}
                    </span>
                    <span className={`badge ${getStatusColor(item.status)} font-semibold text-xs`}>
                      {item.status}
                    </span>
                    <span className="text-xs text-surface-400">
                      • {formatDate(item.date)}
                    </span>
                  </div>

                  <h3 className="font-bold text-surface-900 text-lg">
                    {item.itemName}
                  </h3>

                  <p className="text-xs text-surface-500 line-clamp-1">
                    {item.description}
                  </p>

                  <div className="text-xs text-surface-600 flex flex-wrap gap-4 pt-1">
                    <span><strong>Category:</strong> {getCategoryLabel(item.category)}</span>
                    <span><strong>Location:</strong> {getLocationLabel(item.location)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-surface-100">
                  <Link
                    to={`/item/${item.itemId}`}
                    className="btn btn-ghost btn-sm text-surface-700 hover:bg-surface-100"
                    title="View Details"
                  >
                    <Eye size={16} />
                    View
                  </Link>

                  {item.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleMarkResolved(item.itemId)}
                      className="btn btn-secondary btn-sm text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                      title="Mark as Resolved"
                    >
                      <CheckCircle size={16} className="text-emerald-600" />
                      Resolve
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item.itemId)}
                    className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50"
                    title="Delete Report"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
