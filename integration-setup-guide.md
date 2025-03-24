# MVA Rideshare - Integration Setup Guide

This guide will help you set up the full funnel integration for MVA Rideshare, including AWS DynamoDB and ActiveProsper TrustForms.

## Prerequisites

- AWS account with access to DynamoDB
- ActiveProsper account with access to TrustForms
- Access to the MVA Rideshare codebase

## Step 1: AWS DynamoDB Setup

### Create a DynamoDB Table

1. Login to your AWS Console
2. Navigate to DynamoDB service
3. Click "Create table"
4. Enter the following details:
   - Table name: `mva_rideshare_leads`
   - Partition key: `lead_id` (String)
   - (Optional) Add sort key: `submitted_at` (String)
5. Use default settings for the remaining options
6. Click "Create table"

### Create IAM User for DynamoDB Access

1. Navigate to IAM service in AWS Console
2. Click "Users" and then "Create user"
3. Enter a username (e.g., `mva-rideshare-dynamodb`)
4. Click "Next"
5. Select "Attach policies directly"
6. Search for and select `AmazonDynamoDBFullAccess` (or use a more restrictive policy for production)
7. Click "Next" and then "Create user"
8. On the user details page, go to "Security credentials"
9. Under "Access keys", click "Create access key"
10. Select "Application running outside AWS"
11. Click "Next" and then "Create access key"
12. **Important**: Download the CSV file containing your Access Key ID and Secret Access Key

## Step 2: ActiveProsper TrustForms Setup

1. Login to your ActiveProsper account
2. Navigate to the TrustForms section
3. Create a new form or use an existing form
4. Note the Form ID from the form details page
5. Navigate to API settings and generate an API key
6. Copy the API key for later use

## Step 3: Update Environment Variables

Update your `.env.local` file with the following information:

```
# AWS DynamoDB Configuration
key_id=YOUR_AWS_ACCESS_KEY_ID
secret=YOUR_AWS_SECRET_ACCESS_KEY
region=YOUR_AWS_REGION
table\ name=mva_rideshare_leads

# ActiveProsper TrustForms Configuration
ACTIVEPROSPER_API_KEY=YOUR_ACTIVEPROSPER_API_KEY
ACTIVEPROSPER_FORM_ID=YOUR_ACTIVEPROSPER_FORM_ID
ACTIVEPROSPER_ENDPOINT=https://api.activeprosper.com/v1/forms/submit
```

Replace the placeholder values with your actual credentials.

## Step 4: Deploy Your Application

1. Commit your changes
2. Push to your deployment branch
3. Run your deployment process
4. Verify the deployment was successful

## Step 5: Testing the Integration

### Test the Form Submission

1. Navigate to your claim form page
2. Fill out all required fields
3. Submit the form
4. The form should proceed to the success page

### Verify DynamoDB Data

1. Login to AWS Console
2. Navigate to DynamoDB
3. Select the `mva_rideshare_leads` table
4. Click "Explore table items"
5. You should see your form submission with all data fields

### Verify TrustForms Data

1. Login to your ActiveProsper account
2. Navigate to TrustForms
3. View submissions for your form
4. You should see your form submission with all data fields

## Troubleshooting

### DynamoDB Connection Issues

- Verify your AWS credentials are correct
- Check the region is set correctly
- Ensure your IAM user has appropriate permissions
- Check network connectivity to AWS services

### TrustForms Integration Issues

- Verify your API key is valid and active
- Check that your Form ID is correct
- Ensure the ACTIVEPROSPER_ENDPOINT URL is correct
- Check network connectivity to the TrustForms API

## Support

If you encounter issues with the integration, please contact:

- For AWS DynamoDB issues: AWS Support or your AWS administrator
- For ActiveProsper TrustForms issues: ActiveProsper customer support
- For application-specific issues: Your development team or support contact

---

This integration was implemented by [Your Company Name]. 