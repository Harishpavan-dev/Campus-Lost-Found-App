import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, RefreshCw, AlertCircle, CheckCircle, SlidersHorizontal } from 'lucide-react';
import ItemCard from '../components/items/ItemCard';
import { getAllItems, syncWithDynamoDB } from '../data/mockData';
import { CATEGORIES, LOCATIONS } from '../data/constants';
import EmptyState from '../components/common/EmptyState';

export default function BrowsePage() {
  const [items, setItems] = useState(() => getAllItems());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    syncWithDynamoDB().then(() => {
      setItems(getAllItems());
      setIsLoading(false);
    });
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (typeFilter !== 'all') {
        if (item.type !== typeFilter.toUpperCase()) return false;
      }
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (locationFilter !== 'all' && item.location !== locationFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.itemName.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesBrand = (item.brand || '').toLowerCase().includes(q);
        const matchesLoc = (item.location || '').toLowerCase().includes(q);
        const matchesColor = (item.color || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesLoc && !matchesColor) {
          return false;
        }
      }

      return true;
    });
  }, [items, searchQuery, typeFilter, categoryFilter, locationFilter, statusFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setLocationFilter('all');
    setStatusFilter('all');
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    locationFilter !== 'all' ||
    statusFilter !== 'all';

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="container py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Browse Lost & Found Reports</h1>
            <p className="text-indigo-100 mt-3 text-sm sm:text-base lg:text-lg leading-relaxed">Search and filter reported items across all campus locations</p>
          </div>
        </div>
      </div>

      <div className="container py-10 sm:py-14">
        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-8 mb-10 shadow-sm space-y-5">
          {/* Search Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <SlidersHorizontal size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-surface-900 text-lg">Search & Filter</h2>
              <p className="text-xs text-surface-500">Narrow down results to find what you're looking for</p>
            </div>
          </div>

          {/* Top Search Input */}
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              className="form-input pl-12 py-4 text-base rounded-2xl"
              placeholder="Search by item name, description, brand, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="search-input"
            />
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="form-label text-xs mb-2">Report Type</label>
              <select
                className="form-input text-sm py-3"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                id="type-filter"
              >
                <option value="all">All Types</option>
                <option value="lost">🔴 Lost Items</option>
                <option value="found">🟢 Found Items</option>
              </select>
            </div>

            <div>
              <label className="form-label text-xs mb-2">Category</label>
              <select
                className="form-input text-sm py-3"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                id="category-filter"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label text-xs mb-2">Location</label>
              <select
                className="form-input text-sm py-3"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                id="location-filter"
              >
                <option value="all">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label text-xs mb-2">Status</label>
              <select
                className="form-input text-sm py-3"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                id="status-filter"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active Reports</option>
                <option value="RESOLVED">Resolved Items</option>
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <div className="flex items-center justify-between pt-4 border-t border-surface-100 text-sm">
              <span className="text-surface-500 font-medium">
                Showing <strong className="text-surface-800">{filteredItems.length}</strong> matching reports
              </span>
              <button
                onClick={resetFilters}
                className="text-primary-600 hover:text-primary-800 font-semibold flex items-center gap-1.5 transition-colors"
                id="reset-filters-btn"
              >
                <RefreshCw size={14} />
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Feed */}
        {isLoading ? (
          <div className="text-center py-24">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-surface-500 font-medium">Loading items from DynamoDB...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="No reports found"
            description={
              isFiltered
                ? 'No items matched your search filters. Try clearing your search.'
                : 'No lost or found items have been reported yet.'
            }
            actionLabel="Reset Search Filters"
            actionOnClick={resetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <ItemCard key={item.itemId} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
