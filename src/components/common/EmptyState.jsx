import { SearchX, FileX, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'Nothing here yet',
  description = 'Try adjusting your search or filters.',
  actionLabel,
  actionTo,
  actionOnClick,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-in">
      <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-surface-100 to-surface-50 flex items-center justify-center mb-7 shadow-inner border border-surface-200/60">
        <Icon size={42} className="text-surface-400" />
      </div>
      <h3 className="text-xl font-bold text-surface-800 mb-2.5">{title}</h3>
      <p className="text-sm text-surface-500 max-w-md mb-8 leading-relaxed">{description}</p>
      {actionLabel && (
        actionTo ? (
          <Link to={actionTo} className="btn btn-primary btn-lg">
            {actionLabel}
          </Link>
        ) : actionOnClick ? (
          <button onClick={actionOnClick} className="btn btn-primary btn-lg">
            {actionLabel}
          </button>
        ) : null
      )}
    </div>
  );
}

export function SearchEmpty() {
  return (
    <EmptyState
      icon={SearchX}
      title="No items found"
      description="Try changing your search query or adjusting the filters."
    />
  );
}

export function NoReports() {
  return (
    <EmptyState
      icon={FileX}
      title="No reports yet"
      description="You haven't posted any reports yet. Start by reporting a lost or found item."
      actionLabel="Report an Item"
      actionTo="/report/lost"
    />
  );
}
