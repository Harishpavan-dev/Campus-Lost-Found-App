/**
 * Live AWS DynamoDB Data Service for "CampusLF_Items" Table
 * Region: ap-south-1
 * Table ARN: arn:aws:dynamodb:ap-south-1:224888985730:table/CampusLF_Items
 */

import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';

const REGION = import.meta.env.VITE_AWS_REGION || 'ap-south-1';
const TABLE_NAME = import.meta.env.VITE_AWS_DYNAMODB_TABLE_ITEMS || 'CampusLF_Items';
const ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID || '';
const SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '';

// Initialize AWS DynamoDB Client with credentials if available
const client = new DynamoDBClient({
  region: REGION,
  ...(ACCESS_KEY_ID && SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: ACCESS_KEY_ID,
          secretAccessKey: SECRET_ACCESS_KEY,
        },
      }
    : {}),
});

/**
 * Parses raw DynamoDB item attribute map ({ itemId: { S: '...' } }) into standard JSON object
 */
export const unmarshallItem = (rawItem) => {
  if (!rawItem) return null;
  return {
    itemId: rawItem.itemId?.S || '',
    type: rawItem.type?.S || 'LOST',
    itemName: rawItem.itemName?.S || '',
    category: rawItem.category?.S || 'other',
    description: rawItem.description?.S || '',
    date: rawItem.date?.S || new Date().toISOString().split('T')[0],
    location: rawItem.location?.S || 'main-building',
    color: rawItem.color?.S || '',
    brand: rawItem.brand?.S || '',
    identifyingFeatures: rawItem.identifyingFeatures?.S || '',
    status: rawItem.status?.S || 'ACTIVE',
    reporterName: rawItem.reporterName?.S || 'Campus Student',
    reporterContact: rawItem.reporterContact?.S || 'Contact via campus office',
    createdAt: rawItem.createdAt?.S || new Date().toISOString(),
    updatedAt: rawItem.updatedAt?.S || new Date().toISOString(),
  };
};

/**
 * Converts standard JSON object into DynamoDB attribute format
 */
export const marshallItem = (item) => {
  return {
    itemId: { S: String(item.itemId) },
    type: { S: String(item.type || 'LOST').toUpperCase() },
    itemName: { S: String(item.itemName || '') },
    category: { S: String(item.category || 'other') },
    description: { S: String(item.description || '') },
    date: { S: String(item.date || new Date().toISOString().split('T')[0]) },
    location: { S: String(item.location || 'main-building') },
    color: { S: String(item.color || '') },
    brand: { S: String(item.brand || '') },
    identifyingFeatures: { S: String(item.identifyingFeatures || '') },
    status: { S: String(item.status || 'ACTIVE').toUpperCase() },
    reporterName: { S: String(item.reporterName || 'Student') },
    reporterContact: { S: String(item.reporterContact || 'campus@edu') },
    createdAt: { S: String(item.createdAt || new Date().toISOString()) },
    updatedAt: { S: String(item.updatedAt || new Date().toISOString()) },
  };
};

/**
 * Fetch all items directly from DynamoDB table "CampusLF_Items"
 */
export const fetchItemsFromDynamoDB = async () => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });
    const response = await client.send(command);
    if (response.Items && response.Items.length > 0) {
      return response.Items.map(unmarshallItem);
    }
  } catch (error) {
    console.warn('DynamoDB Live Scan Warning (Falling back to local storage cache):', error.message);
  }
  return null;
};

/**
 * Save new item report directly to DynamoDB table "CampusLF_Items"
 */
export const saveItemToDynamoDB = async (itemData) => {
  const newItem = {
    itemId: `item-${Date.now()}`,
    type: (itemData.type || 'LOST').toUpperCase(),
    itemName: itemData.itemName || '',
    category: itemData.category || 'other',
    description: itemData.description || '',
    date: itemData.date || new Date().toISOString().split('T')[0],
    location: itemData.location || 'main-building',
    color: itemData.color || '',
    brand: itemData.brand || '',
    identifyingFeatures: itemData.identifyingFeatures || '',
    status: 'ACTIVE',
    reporterName: itemData.reporterName || 'Student',
    reporterContact: itemData.reporterContact || 'Contact campus office',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const command = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshallItem(newItem),
    });
    await client.send(command);
  } catch (error) {
    console.warn('DynamoDB Live Put Warning:', error.message);
  }

  return newItem;
};

/**
 * Update item status to RESOLVED directly in DynamoDB
 */
export const updateItemStatusInDynamoDB = async (itemId, newStatus = 'RESOLVED') => {
  try {
    const command = new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: {
        itemId: { S: itemId },
      },
      UpdateExpression: 'SET #st = :s, updatedAt = :u',
      ExpressionAttributeNames: {
        '#st': 'status',
      },
      ExpressionAttributeValues: {
        ':s': { S: newStatus },
        ':u': { S: new Date().toISOString() },
      },
    });
    await client.send(command);
  } catch (error) {
    console.warn('DynamoDB Live Update Warning:', error.message);
  }
};
