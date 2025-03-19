# MVA-Rideshare AWS Integration

This directory contains the AWS infrastructure setup for the MVA-Rideshare lead capture system.

## System Architecture

The MVA-Rideshare lead capture system uses the following AWS services:

1. **API Gateway**: Provides an HTTP API endpoint for form submissions.
2. **Lambda**: Processes form submissions, claims TrustedForm certificates, and stores data.
3. **S3**: Stores lead data in JSON format with date-based organization.
4. **DynamoDB**: Provides a database for quick access to lead records.
5. **CloudWatch**: Logs all lead processing activity for tracking and debugging.

## Directory Structure

- `lambda/`: Contains the Lambda function code.
- `api-gateway/`: Contains the API Gateway configuration.
- `cloudformation/`: Contains the CloudFormation template for deploying all resources.
- `deploy.sh`: A shell script to automate deployment.

## Deployment

### Prerequisites

- AWS CLI installed and configured with appropriate permissions
- Node.js and npm installed

### Deployment Steps

1. Configure AWS CLI with your AWS account credentials:
   ```
   aws configure
   ```

2. Update the configuration variables in `deploy.sh` if needed or provide them as environment variables or command line arguments.

3. Run the deployment script:
   ```
   cd aws
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. The script will:
   - Create a deployment S3 bucket if it doesn't exist
   - Package and upload the Lambda function
   - Deploy the CloudFormation stack with all required resources
   - Update the Lambda function code
   - Display the outputs including the API URL

5. Update the `.env.local` file in the root of the project with the new API Gateway endpoint URL.

## Configuration

The following environment variables can be set to customize the deployment:

- `ENV`: The environment to deploy to (default: prod)
- `REGION`: The AWS region to deploy to (default: us-east-1)
- `S3_DEPLOYMENT_BUCKET`: The S3 bucket to use for deployment artifacts (default: mva-rideshare-deployment)
- `TRUSTED_FORM_API_KEY`: The TrustedForm API key to use for claiming certificates

These can also be provided as command line arguments:

```
./deploy.sh --env staging --region us-west-2 --bucket my-deployment-bucket --trusted-form-key your-api-key
```

## Data Structure

Lead data is stored in both S3 and DynamoDB:

### S3 Storage

Leads are stored in JSON format with the following folder structure:

```
s3://mva-rideshare-leads-{env}/funnelType={funnelType}/leadType={leadType}/adCategory={adCategory}/{YYYY}/{MM}/{DD}/{lead_id}.json
```

This structure allows for easy querying by funnel type, lead type, ad category, and date.

### DynamoDB Storage

Leads are stored in DynamoDB with a `lead_id` as the primary key. This allows for quick lookups of individual leads.

## TrustedForm Integration

The Lambda function automatically claims TrustedForm certificates when a lead is submitted. The TrustedForm certificate URL is stored with the lead data, and the claim result is also stored for auditing purposes.

## CloudWatch Logs

All lead processing activity is logged to CloudWatch Logs. Log groups are organized by Lambda function name:

```
/aws/lambda/mva-rideshare-lead-processor-{env}
```

Logs include detailed information about each step of the lead processing workflow, including TrustedForm certificate claiming results, S3 storage, and DynamoDB storage.

## Security Considerations

- All API Gateway endpoints use HTTPS
- All S3 buckets have public access blocked
- All DynamoDB tables are encrypted at rest
- The Lambda function uses IAM roles with least privilege
- Environment variables are used for sensitive data like the TrustedForm API key
- CloudFormation parameters with `NoEcho` are used for sensitive values 