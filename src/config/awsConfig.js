/**
 * AWS Configuration & Environment Helper
 * Dynamically switches between AWS Cloud resources and Local Mock Mode.
 */

export const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  cognito: {
    userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID || '',
    clientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID || '',
  },
  dynamoDb: {
    tables: {
      items: import.meta.env.VITE_AWS_DYNAMODB_TABLE_ITEMS || 'CampusLF_Items',
      claims: import.meta.env.VITE_AWS_DYNAMODB_TABLE_CLAIMS || 'CampusLF_Claims',
      messages: import.meta.env.VITE_AWS_DYNAMODB_TABLE_MESSAGES || 'CampusLF_Messages',
      users: import.meta.env.VITE_AWS_DYNAMODB_TABLE_USERS || 'CampusLF_Users',
    },
  },
  s3: {
    bucketName: import.meta.env.VITE_AWS_S3_BUCKET || 'campus-lf-images-prod',
  },
};

/**
 * Returns true if real AWS Cognito credentials are configured in .env
 */
export const isAwsConfigured = () => {
  return (
    Boolean(awsConfig.cognito.userPoolId) &&
    !awsConfig.cognito.userPoolId.includes('example') &&
    Boolean(awsConfig.cognito.clientId) &&
    !awsConfig.cognito.clientId.includes('example')
  );
};
