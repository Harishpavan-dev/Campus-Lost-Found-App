/**
 * DynamoDB Data Seeder Script (ESM Version)
 * Pushes sample lost & found items into AWS DynamoDB table "CampusLF_Items"
 */

import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';

const REGION = process.env.VITE_AWS_REGION || 'ap-south-1';
const TABLE_NAME = process.env.VITE_AWS_DYNAMODB_TABLE_ITEMS || 'CampusLF_Items';

const client = new DynamoDBClient({ region: REGION });

const SAMPLE_ITEMS = [
  {
    itemId: { S: 'item-101' },
    type: { S: 'LOST' },
    itemName: { S: 'Casio FX-991EX Scientific Calculator' },
    category: { S: 'calculator' },
    description: { S: 'Black scientific calculator left on desk in Room 204. Has a small blue sticker on the back cover.' },
    date: { S: '2026-09-10' },
    location: { S: 'library' },
    color: { S: 'Black' },
    brand: { S: 'Casio' },
    identifyingFeatures: { S: 'Small blue sticker on back cover' },
    status: { S: 'ACTIVE' },
    reporterName: { S: 'Rahul Sharma' },
    reporterContact: { S: 'rahul.s@campus.edu | +91 98765 43210' },
    createdAt: { S: new Date().toISOString() },
    updatedAt: { S: new Date().toISOString() },
  },
  {
    itemId: { S: 'item-102' },
    type: { S: 'FOUND' },
    itemName: { S: 'Student ID Card - CSE Department' },
    category: { S: 'id-card' },
    description: { S: 'Found a student ID card near the main entrance stairs. Name on ID: Ananya Roy.' },
    date: { S: '2026-09-11' },
    location: { S: 'main-building' },
    color: { S: 'White/Blue' },
    brand: { S: 'University ID' },
    identifyingFeatures: { S: 'CSE Department batch 2024-2028' },
    status: { S: 'ACTIVE' },
    reporterName: { S: 'Priya Verma' },
    reporterContact: { S: 'priya.v@campus.edu' },
    createdAt: { S: new Date().toISOString() },
    updatedAt: { S: new Date().toISOString() },
  },
  {
    itemId: { S: 'item-103' },
    type: { S: 'LOST' },
    itemName: { S: 'Navy Blue Jansport Backpack' },
    category: { S: 'bags' },
    description: { S: 'Contains notebook, water bottle, and laptop charger. Left under table 4 in cafeteria during lunch.' },
    date: { S: '2026-09-09' },
    location: { S: 'cafeteria' },
    color: { S: 'Navy Blue' },
    brand: { S: 'Jansport' },
    identifyingFeatures: { S: 'Silver key chain attached to zipper' },
    status: { S: 'ACTIVE' },
    reporterName: { S: 'Amit Patel' },
    reporterContact: { S: 'amit.p@campus.edu' },
    createdAt: { S: new Date().toISOString() },
    updatedAt: { S: new Date().toISOString() },
  },
  {
    itemId: { S: 'item-104' },
    type: { S: 'FOUND' },
    itemName: { S: 'Apple AirPods Pro (2nd Gen) in White Case' },
    category: { S: 'electronics' },
    description: { S: 'Found on a chair in Computer Lab 3 after afternoon lab session.' },
    date: { S: '2026-09-12' },
    location: { S: 'computer-lab' },
    color: { S: 'White' },
    brand: { S: 'Apple' },
    identifyingFeatures: { S: 'Clear silicone protective case with small scratch on bottom' },
    status: { S: 'ACTIVE' },
    reporterName: { S: 'Kavita Singh' },
    reporterContact: { S: 'kavita.s@campus.edu' },
    createdAt: { S: new Date().toISOString() },
    updatedAt: { S: new Date().toISOString() },
  },
  {
    itemId: { S: 'item-105' },
    type: { S: 'LOST' },
    itemName: { S: 'Leather Keyring with 3 Keys' },
    category: { S: 'keys' },
    description: { S: 'Lost house and bike keys on a brown leather keychain somewhere near the playground.' },
    date: { S: '2026-09-08' },
    location: { S: 'playground' },
    color: { S: 'Brown' },
    brand: { S: 'Custom' },
    identifyingFeatures: { S: 'Brass ring with Honda key and 2 small keys' },
    status: { S: 'RESOLVED' },
    reporterName: { S: 'Vikram Joshi' },
    reporterContact: { S: 'vikram.j@campus.edu' },
    createdAt: { S: new Date().toISOString() },
    updatedAt: { S: new Date().toISOString() },
  },
];

async function seedData() {
  console.log(`🚀 Seeding mock data to DynamoDB table "${TABLE_NAME}" in region "${REGION}"...`);

  const putRequests = SAMPLE_ITEMS.map((Item) => ({
    PutRequest: { Item },
  }));

  const command = new BatchWriteItemCommand({
    RequestItems: {
      [TABLE_NAME]: putRequests,
    },
  });

  try {
    const response = await client.send(command);
    console.log('✅ Successfully seeded DynamoDB table!');
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('❌ Error seeding DynamoDB table:', error.message);
  }
}

seedData();
