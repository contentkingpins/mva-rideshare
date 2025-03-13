# AWS Amplify Setup Guide

## Environment Variables Setup

To fix the "AWS credentials are not set" error, you need to add the following environment variables to your Amplify app:

1. Log in to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/home)
2. Navigate to your new Amplify app
3. Go to "App settings" → "Environment variables"
4. Add the following environment variables:

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `key_id` | Your AWS Access Key ID | AKIAU5LH5ZMSXXXX |
| `secret` | Your AWS Secret Access Key | 2yZ14egf2jtpwHCGXXXXXX |
| `region` | AWS Region (optional) | us-east-1 |
| `table_name` | DynamoDB table name (optional) | rideshare-mva |

![Amplify Environment Variables Setup](https://docs.aws.amazon.com/images/amplify/latest/userguide/images/amplify-environment-variables.png)

## Security Recommendations

Since your AWS credentials were potentially exposed in your Git repository, it's recommended to:

1. **Rotate your AWS credentials immediately:**
   - Go to [IAM User Security Credentials](https://console.aws.amazon.com/iam/home#/users)
   - Select your IAM user
   - Navigate to the "Security credentials" tab
   - Under "Access keys", find your current key and click "Delete"
   - Click "Create access key" to generate new credentials
   - Update these new credentials in your Amplify environment variables

2. **Use IAM roles instead of access keys when possible:**
   - Consider setting up service roles for Amplify to access your AWS resources instead of using access keys
   - [Learn about Amplify service roles](https://docs.aws.amazon.com/amplify/latest/userguide/how-to-service-role-amplify-console.html)

## Connecting to Your Repository

After setting up environment variables:

1. Go to your Amplify app dashboard
2. Click "Host your web app"
3. Choose your Git provider
4. Authorize Amplify to access your repository
5. Select the repository and branch to deploy
6. Review the build settings (Amplify should auto-detect Next.js)
7. Click "Save and deploy"

## Troubleshooting

If you continue to encounter issues:

1. Check the Amplify build logs for specific errors
2. Verify your AWS credentials have proper permissions for all required services
3. Ensure your `.env.local` file is correctly loaded during the build process
4. Consider using the Amplify CLI for more advanced setup 