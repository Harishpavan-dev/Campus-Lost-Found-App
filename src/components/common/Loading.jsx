import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeMap = { sm: 16, md: 24, lg: 32, xl: 48 };
  return (
    <Loader2 
      size={sizeMap[size] || 24} 
      className={`animate-spin text-primary-600 ${className}`} 
    />
  );
}

export function LoadingPage({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-surface-500 text-sm animate-pulse">{message}</p>
    </div>
  );
}

export function LoadingCards({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-surface-200/80 overflow-hidden">
          <div className="h-40 skeleton" />
          <div className="p-4 space-y-3">
            <div className="h-5 skeleton w-3/4" />
            <div className="h-4 skeleton w-1/2" />
            <div className="h-4 skeleton w-2/3" />
            <div className="h-4 skeleton w-full" />
            <div className="h-9 skeleton w-full mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingButton({ children, loading, className = '', ...props }) {
  return (
    <button className={className} disabled={loading} {...props}>
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
