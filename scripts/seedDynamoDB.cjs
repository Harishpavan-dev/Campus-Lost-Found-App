/**
 * DynamoDB Data Seeder Script (CommonJS Version)
 * Pushes sample lost & found items into AWS DynamoDB table "CampusLF_Items"
 */

const { DynamoDBClient, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');

const REGION = process.env.VITE_AWS_REGION || 'ap-south-1';
const TABLE_NAME = process.env.VITE_AWS_DYNAMODB_TABLE_ITEMS || 'CampusLF_Items';

const client = new DynamoDBClient({ region: REGION });

const SAMPLE_ITEMS = [
  {
    itemId: { S: 'item-101' },
    type: { S: 'LOST' },
    itemName: { S: 'Casio FX-991EX Scientific Calculator' },
    category: { S: 'calculator' },
    description: { S: 'Black scientific calculator left on desk in Room 204.' },
    date: { S: '2026-09-10' },
    location: { S: 'library' },
    color: { S: 'Black' },
    brand: { S: 'Casio' },
    status: { S: 'ACTIVE' },
    reporterName: { S: 'Rahul Sharma' },
    reporterContact: { S: 'rahul.s@campus.edu' },
    createdAt: { S: new Date().toISOString() },
    updatedAt: { S: new Date().toISOString() },
  },
  {
    itemId: { S: 'item-102' },
    type: { S: 'FOUND' },
    itemName: { S: 'Student ID Card - CSE Department' },
    category: { S: 'id-card' },
    description: { S: 'Found student ID card near main entrance stairs.' },
    date: { S: '2026-09-11' },
    location: { S: 'main-building' },
    color: { S: 'White/Blue' },
    brand: { S: 'University ID' },
    status: { S: 'ACTIVE' },
    reporterName: { S: 'Priya Verma' },
    reporterContact: { S: 'priya.v@campus.edu' },
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
