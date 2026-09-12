// Fixed categories as per MVP specifications
export const CATEGORIES = [
  { value: 'id-card', label: 'ID Card' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'keys', label: 'Keys' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'books', label: 'Books' },
  { value: 'stationery', label: 'Stationery' },
  { value: 'bags', label: 'Bags' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'water-bottle', label: 'Water Bottle' },
  { value: 'calculator', label: 'Calculator' },
  { value: 'documents', label: 'Documents' },
  { value: 'other', label: 'Other' },
];

// Fixed campus locations
export const LOCATIONS = [
  { value: 'lecture-hall', label: 'Lecture Hall' },
  { value: 'library', label: 'Library' },
  { value: 'computer-lab', label: 'Computer Lab' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'cafeteria', label: 'Cafeteria' },
  { value: 'playground', label: 'Playground' },
  { value: 'parking-area', label: 'Parking Area' },
  { value: 'main-building', label: 'Main Building' },
  { value: 'other', label: 'Other' },
];

// Item Statuses
export const ITEM_STATUSES = {
  ACTIVE: 'ACTIVE',
  RESOLVED: 'RESOLVED',
};

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'RESOLVED', label: 'Resolved' },
];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export const getCategoryLabel = (value) => {
  const cat = CATEGORIES.find((c) => c.value === value);
  return cat ? cat.label : value;
};

export const getLocationLabel = (value) => {
  const loc = LOCATIONS.find((l) => l.value === value);
  return loc ? loc.label : value;
};
