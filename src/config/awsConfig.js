/**
 * AWS Configuration & Environment Helper
 */

export const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
  tableName: import.meta.env.VITE_AWS_DYNAMODB_TABLE_ITEMS || 'CampusLF_Items',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
};

export const isAwsConfigured = () => {
  return (
    Boolean(awsConfig.credentials.accessKeyId) &&
    Boolean(awsConfig.credentials.secretAccessKey)
  );
};
