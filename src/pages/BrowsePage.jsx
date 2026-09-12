import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
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

  useEffect(() => {
    syncWithDynamoDB().then(() => {
      setItems(getAllItems());
    });
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type Filter
      if (typeFilter !== 'all') {
        if (item.type !== typeFilter.toUpperCase()) return false;
      }

      // Category Filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      // Location Filter
      if (locationFilter !== 'all' && item.location !== locationFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Search Query
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
    <div className="py-8 animate-fade-in">
      <div className="container">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900">Browse Lost & Found Reports</h1>
          <p className="text-surface-500 mt-1">Search and filter reported items across campus</p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-surface-200/80 p-5 mb-8 shadow-xs space-y-4">
          {/* Top Search Input */}
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              className="form-input pl-10 text-sm"
              placeholder="Search by item name, description, brand, or location (e.g. calculator, library)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="search-input"
            />
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Type Filter */}
            <div>
              <label className="form-label text-xs">Report Type</label>
              <select
                className="form-input text-sm py-2"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                id="type-filter"
              >
                <option value="all">All Types</option>
                <option value="lost">🔴 Lost Items</option>
                <option value="found">🟢 Found Items</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="form-label text-xs">Category</label>
              <select
                className="form-input text-sm py-2"
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

            {/* Location Filter */}
            <div>
              <label className="form-label text-xs">Location</label>
              <select
                className="form-input text-sm py-2"
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

            {/* Status Filter */}
            <div>
              <label className="form-label text-xs">Status</label>
              <select
                className="form-input text-sm py-2"
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
            <div className="flex items-center justify-between pt-2 border-t border-surface-100 text-xs">
              <span className="text-surface-500 font-medium">
                Showing {filteredItems.length} matching reports
              </span>
              <button
                onClick={resetFilters}
                className="text-primary-600 hover:text-primary-800 font-semibold flex items-center gap-1"
                id="reset-filters-btn"
              >
                <RefreshCw size={12} />
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Feed */}
        {filteredItems.length === 0 ? (
          <EmptyState
            title="No reports found"
            description={
              isFiltered
                ? 'No items matched your search filters. Try clearing your search.'
                : 'No lost or found items have been reported yet.'
            }
            actionLabel="Reset Search Filters"
            onAction={resetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.itemId} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
