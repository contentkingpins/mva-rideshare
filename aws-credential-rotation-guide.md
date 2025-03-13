# AWS Credential Rotation Guide

Since AWS credentials were potentially exposed in your Git repository, it's crucial to rotate them immediately. Follow this guide to create new, secure credentials and update them in your Amplify app.

## Step 1: Create New AWS Credentials

1. Log in to the [AWS Management Console](https://console.aws.amazon.com/)
2. Navigate to the IAM service
3. Select "Users" from the left navigation pane
4. Find and select your IAM user
5. Go to the "Security credentials" tab
6. Under "Access keys", locate your current access key (ID starting with `AKIAU5LH5Z...`)
7. **Do not delete the old key until you have verified the new one works**
8. Click "Create access key"
9. In the popup, select "Application running outside AWS" as the use case
10. Click "Next" and then "Create access key"
11. **IMPORTANT**: Download the CSV file or copy both the Access key ID and Secret access key to a secure location. This is the only time you'll be able to view the secret key.

## Step 2: Update Credentials in AWS Amplify

1. Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/home)
2. Select your application
3. Navigate to "App settings" → "Environment variables"
4. Find the variables `key_id` and `secret`
5. Update them with your new credentials:
   - `key_id`: Your new AWS Access Key ID
   - `secret`: Your new AWS Secret Access Key
6. Click "Save"
7. Redeploy your application to verify that the new credentials work

## Step 3: Update Local Environment

1. Update your `.env.local` file with the new credentials:
   ```
   AWS_ACCESS_KEY_ID=your-new-access-key
   AWS_SECRET_ACCESS_KEY=your-new-secret-key
   AWS_REGION=us-east-1
   ```
2. Make sure `.env.local` is in your `.gitignore` file to prevent accidental commits

## Step 4: Deactivate and Delete Old Credentials

After verifying that your application works with the new credentials:

1. Return to the IAM console
2. Select your user and go to "Security credentials"
3. Find your old access key
4. Click "Deactivate" to temporarily disable it
5. Wait 24-48 hours to ensure everything still works
6. Return and click "Delete" to permanently remove the exposed key

## Security Best Practices

1. **Never commit credentials to Git repositories**:
   - Always use environment variables or AWS parameter store
   - Add sensitive files to `.gitignore`

2. **Use least privilege principle**:
   - Ensure your IAM user only has permissions necessary for your application
   - Consider using separate credentials for development and production

3. **Consider using IAM roles**:
   - For Amplify, use service roles instead of access keys
   - [Amplify Service Role Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/how-to-service-role-amplify-console.html)

4. **Enable MFA for your IAM users**:
   - Adds an extra layer of security
   - Protects against unauthorized access even if credentials are compromised

5. **Regularly rotate credentials**:
   - Change access keys every 90 days
   - Use AWS Organizations SCPs to enforce rotation 