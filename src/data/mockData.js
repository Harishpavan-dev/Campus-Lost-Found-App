/**
 * Hybrid Data Layer with AWS DynamoDB Real-Time Synchronization
 * Table: CampusLF_Items
 * Region: ap-south-1
 */

import {
  fetchItemsFromDynamoDB,
  saveItemToDynamoDB,
  updateItemStatusInDynamoDB,
} from '../services/itemService';

const STORAGE_KEY = 'campus_lf_items_mvp';

// Standardized Campus Items
const INITIAL_ITEMS = [
  {
    itemId: 'item-101',
    type: 'LOST',
    itemName: 'Casio FX-991EX Scientific Calculator',
    category: 'calculator',
    description: 'Black scientific calculator left on desk in Room 204. Small blue sticker on back cover.',
    date: '2026-09-10',
    location: 'library',
    color: 'Black',
    brand: 'Casio',
    identifyingFeatures: 'Small blue sticker on back cover',
    status: 'ACTIVE',
    reporterName: 'Rahul Sharma',
    reporterContact: 'rahul.s@campus.edu | +91 98765 43210',
    createdAt: '2026-09-10T10:30:00Z',
    updatedAt: '2026-09-10T10:30:00Z',
  },
  {
    itemId: 'item-102',
    type: 'FOUND',
    itemName: 'Student ID Card - CSE Department',
    category: 'id-card',
    description: 'Found student ID card near main entrance stairs. Name on ID: Ananya Roy.',
    date: '2026-09-11',
    location: 'main-building',
    color: 'White/Blue',
    brand: 'University ID',
    identifyingFeatures: 'CSE Department batch 2024-2028',
    status: 'ACTIVE',
    reporterName: 'Priya Verma',
    reporterContact: 'priya.v@campus.edu',
    createdAt: '2026-09-11T14:15:00Z',
    updatedAt: '2026-09-11T14:15:00Z',
  },
  {
    itemId: 'item-103',
    type: 'LOST',
    itemName: 'Navy Blue Jansport Backpack',
    category: 'bags',
    description: 'Contains notebook, water bottle, and charger. Left under table 4 in cafeteria.',
    date: '2026-09-09',
    location: 'cafeteria',
    color: 'Navy Blue',
    brand: 'Jansport',
    identifyingFeatures: 'Silver key chain attached to zipper',
    status: 'ACTIVE',
    reporterName: 'Amit Patel',
    reporterContact: 'amit.p@campus.edu',
    createdAt: '2026-09-09T13:00:00Z',
    updatedAt: '2026-09-09T13:00:00Z',
  },
  {
    itemId: 'item-104',
    type: 'FOUND',
    itemName: 'Apple AirPods Pro (2nd Gen) in White Case',
    category: 'electronics',
    description: 'Found on chair in Computer Lab 3 after afternoon lab session.',
    date: '2026-09-12',
    location: 'computer-lab',
    color: 'White',
    brand: 'Apple',
    identifyingFeatures: 'Clear silicone protective case',
    status: 'ACTIVE',
    reporterName: 'Kavita Singh',
    reporterContact: 'kavita.s@campus.edu',
    createdAt: '2026-09-12T09:45:00Z',
    updatedAt: '2026-09-12T09:45:00Z',
  },
  {
    itemId: 'item-105',
    type: 'LOST',
    itemName: 'Leather Keyring with 3 Keys',
    category: 'keys',
    description: 'Lost house and bike keys on a brown leather keychain near playground.',
    date: '2026-09-08',
    location: 'playground',
    color: 'Brown',
    brand: 'Custom',
    identifyingFeatures: 'Brass ring with Honda key',
    status: 'RESOLVED',
    reporterName: 'Vikram Joshi',
    reporterContact: 'vikram.j@campus.edu',
    createdAt: '2026-09-08T16:20:00Z',
    updatedAt: '2026-09-11T11:00:00Z',
  },
];

// Load items from local storage or seed
export const getAllItems = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading items:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
  return INITIAL_ITEMS;
};

// Sync live items from DynamoDB table "CampusLF_Items"
export const syncWithDynamoDB = async () => {
  try {
    const liveItems = await fetchItemsFromDynamoDB();
    if (liveItems && liveItems.length > 0) {
      // Merge live DynamoDB items with existing local items
      const existing = getAllItems();
      const existingIds = new Set(existing.map((i) => i.itemId));
      const newFromDynamo = liveItems.filter((i) => !existingIds.has(i.itemId));
      const combined = [...newFromDynamo, ...existing];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
      return combined;
    }
  } catch (e) {
    console.warn('DynamoDB sync notice:', e);
  }
  return getAllItems();
};

const saveItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving items:', e);
  }
};

export const getItemById = (id) => {
  const items = getAllItems();
  return items.find((i) => i.itemId === id) || null;
};

export const addItem = (itemData) => {
  const newItem = {
    itemId: `item-${Date.now()}`,
    type: itemData.type ? itemData.type.toUpperCase() : 'LOST',
    itemName: itemData.itemName || '',
    category: itemData.category || 'other',
    description: itemData.description || '',
    date: itemData.date || new Date().toISOString().split('T')[0],
    location: itemData.location || 'main-building',
    color: itemData.color || '',
    brand: itemData.brand || '',
    identifyingFeatures: itemData.identifyingFeatures || '',
    status: 'ACTIVE',
    reporterName: itemData.reporterName || 'Campus Student',
    reporterContact: itemData.reporterContact || 'Contact campus office',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const items = getAllItems();
  const updated = [newItem, ...items];
  saveItems(updated);

  // Asynchronously save to live AWS DynamoDB table
  saveItemToDynamoDB(newItem).catch((err) =>
    console.warn('Background DynamoDB save notice:', err)
  );

  return newItem;
};

export const updateItem = (id, updates) => {
  const items = getAllItems();
  const updated = items.map((item) => {
    if (item.itemId === id) {
      return {
        ...item,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    return item;
  });
  saveItems(updated);

  if (updates.status) {
    updateItemStatusInDynamoDB(id, updates.status).catch((err) =>
      console.warn('Background DynamoDB update notice:', err)
    );
  }

  return updated.find((i) => i.itemId === id);
};

export const deleteItem = (id) => {
  const items = getAllItems();
  const updated = items.filter((i) => i.itemId !== id);
  saveItems(updated);
};

export const getStats = () => {
  const items = getAllItems();
  return {
    totalLost: items.filter((i) => i.type === 'LOST').length,
    totalFound: items.filter((i) => i.type === 'FOUND').length,
    recovered: items.filter((i) => i.status === 'RESOLVED').length,
    active: items.filter((i) => i.status === 'ACTIVE').length,
  };
};

export const getRecentItems = (limit = 6) => {
  const items = getAllItems();
  return items
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};
