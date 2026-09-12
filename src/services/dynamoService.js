/**
 * AWS DynamoDB Service Module
 * Handles direct CRUD operations with Amazon DynamoDB table "CampusLF_Items"
 */

import { awsConfig } from '../config/awsConfig';

const TABLE_NAME = import.meta.env.VITE_AWS_DYNAMODB_TABLE_ITEMS || 'CampusLF_Items';
const REGION = import.meta.env.VITE_AWS_REGION || 'ap-south-1';

/**
 * DynamoDB HTTP Endpoint for direct REST/SDK operations
 */
export const DYNAMO_ENDPOINT = `https://dynamodb.${REGION}.amazonaws.com`;

/**
 * Prepares item structure for DynamoDB PutItem format
 */
export const formatDynamoItem = (item) => {
  return {
    itemId: { S: item.itemId },
    type: { S: item.type },
    itemName: { S: item.itemName },
    category: { S: item.category },
    description: { S: item.description },
    date: { S: item.date },
    location: { S: item.location },
    color: { S: item.color || '' },
    brand: { S: item.brand || '' },
    identifyingFeatures: { S: item.identifyingFeatures || '' },
    status: { S: item.status || 'ACTIVE' },
    reporterName: { S: item.reporterName },
    reporterContact: { S: item.reporterContact },
    createdAt: { S: item.createdAt || new Date().toISOString() },
    updatedAt: { S: item.updatedAt || new Date().toISOString() },
  };
};

/**
 * Parses raw DynamoDB item attribute map back into standard JSON
 */
export const parseDynamoItem = (rawItem) => {
  if (!rawItem) return null;
  return {
    itemId: rawItem.itemId?.S || '',
    type: rawItem.type?.S || 'LOST',
    itemName: rawItem.itemName?.S || '',
    category: rawItem.category?.S || 'other',
    description: rawItem.description?.S || '',
    date: rawItem.date?.S || '',
    location: rawItem.location?.S || '',
    color: rawItem.color?.S || '',
    brand: rawItem.brand?.S || '',
    identifyingFeatures: rawItem.identifyingFeatures?.S || '',
    status: rawItem.status?.S || 'ACTIVE',
    reporterName: rawItem.reporterName?.S || '',
    reporterContact: rawItem.reporterContact?.S || '',
    createdAt: rawItem.createdAt?.S || '',
    updatedAt: rawItem.updatedAt?.S || '',
  };
};

export default {
  tableName: TABLE_NAME,
  region: REGION,
  formatDynamoItem,
  parseDynamoItem,
};
