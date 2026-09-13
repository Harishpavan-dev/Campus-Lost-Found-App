import { DynamoDBClient, ScanCommand, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { awsConfig } from '../config/awsConfig';
import { formatDynamoItem, parseDynamoItem } from './dynamoService';

const getDynamoClient = () => {
  const accessKeyId = awsConfig.credentials?.accessKeyId;
  const secretAccessKey = awsConfig.credentials?.secretAccessKey;

  const clientConfig = {
    region: awsConfig.region || 'ap-south-1',
  };

  if (accessKeyId && secretAccessKey) {
    clientConfig.credentials = {
      accessKeyId,
      secretAccessKey,
    };
  }

  return new DynamoDBClient(clientConfig);
};

const TABLE_NAME = awsConfig.tableName || 'CampusLF_Items';

export const fetchItemsFromDynamoDB = async () => {
  try {
    const client = getDynamoClient();
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await client.send(command);
    if (response.Items) {
      return response.Items.map(parseDynamoItem);
    }
    return [];
  } catch (error) {
    console.warn('DynamoDB Fetch Notice:', error.message);
    return null;
  }
};

export const saveItemToDynamoDB = async (item) => {
  try {
    const client = getDynamoClient();
    const formatted = formatDynamoItem(item);
    const command = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: formatted,
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.warn('DynamoDB Save Notice:', error.message);
    return false;
  }
};

export const updateItemStatusInDynamoDB = async (itemId, newStatus) => {
  try {
    const client = getDynamoClient();
    const command = new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: { itemId: { S: itemId } },
      UpdateExpression: 'SET #s = :statusVal, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: {
        ':statusVal': { S: newStatus },
        ':updatedAt': { S: new Date().toISOString() },
      },
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.warn('DynamoDB Update Notice:', error.message);
    return false;
  }
};
