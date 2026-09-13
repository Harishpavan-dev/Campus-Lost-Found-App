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

// Standardized Campus Items - empty by default, populated live from AWS DynamoDB
const INITIAL_ITEMS = [];

// Load items from local storage cache
export const getAllItems = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error loading items:', e);
  }
  return [];
};

// Sync live items directly from AWS DynamoDB table "CampusLF_Items"
export const syncWithDynamoDB = async () => {
  try {
    const liveItems = await fetchItemsFromDynamoDB();
    if (liveItems && Array.isArray(liveItems)) {
      // Direct update from DynamoDB live table
      localStorage.setItem(STORAGE_KEY, JSON.stringify(liveItems));
      return liveItems;
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
