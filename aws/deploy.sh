#!/bin/bash
# MVA-Rideshare AWS Deployment Script

set -e  # Exit on error

# Configuration variables - override with environment variables or command line arguments
ENV=${ENV:-prod}  # Default to prod environment
STACK_NAME=${STACK_NAME:-mva-rideshare-${ENV}}
REGION=${REGION:-us-east-1}
S3_DEPLOYMENT_BUCKET=${S3_DEPLOYMENT_BUCKET:-mva-rideshare-deployment}
LAMBDA_CODE_PATH=${LAMBDA_CODE_PATH:-lambda/processLead.js}
LAMBDA_ZIP_FILE=${LAMBDA_ZIP_FILE:-mva-rideshare-lambda.zip}
TRUSTED_FORM_API_KEY=${TRUSTED_FORM_API_KEY:-ccdd54f8fb4dc3b495d85dd504abd5f3}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --env)
      ENV="$2"
      shift # past argument
      shift # past value
      ;;
    --region)
      REGION="$2"
      shift # past argument
      shift # past value
      ;;
    --bucket)
      S3_DEPLOYMENT_BUCKET="$2"
      shift # past argument
      shift # past value
      ;;
    --trusted-form-key)
      TRUSTED_FORM_API_KEY="$2"
      shift # past argument
      shift # past value
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo "====== MVA-Rideshare Deployment ======"
echo "Environment: $ENV"
echo "Region: $REGION"
echo "Stack Name: $STACK_NAME"
echo "Deployment Bucket: $S3_DEPLOYMENT_BUCKET"

# Ensure AWS CLI is configured
echo "Checking AWS CLI configuration..."
aws configure get aws_access_key_id > /dev/null || {
  echo "AWS CLI not configured. Please run 'aws configure' first."
  exit 1
}

# Ensure deployment bucket exists
echo "Checking if deployment bucket exists..."
if ! aws s3 ls "s3://$S3_DEPLOYMENT_BUCKET" --region $REGION 2>&1 > /dev/null; then
  echo "Creating deployment bucket: $S3_DEPLOYMENT_BUCKET"
  aws s3 mb "s3://$S3_DEPLOYMENT_BUCKET" --region $REGION
  
  # Block public access to the bucket
  aws s3api put-public-access-block \
    --bucket $S3_DEPLOYMENT_BUCKET \
    --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
    --region $REGION
else
  echo "Deployment bucket already exists."
fi

# Package Lambda function
echo "Packaging Lambda function..."
mkdir -p build
echo "Installing dependencies..."
npm install uuid aws-sdk --no-save

# Create the deployment package
echo "Creating Lambda deployment package..."
zip -j "build/$LAMBDA_ZIP_FILE" "$LAMBDA_CODE_PATH" node_modules/**/*.js

# Upload to S3
echo "Uploading Lambda package to S3..."
aws s3 cp "build/$LAMBDA_ZIP_FILE" "s3://$S3_DEPLOYMENT_BUCKET/$LAMBDA_ZIP_FILE" --region $REGION

# Package CloudFormation template
echo "Packaging CloudFormation template..."
aws cloudformation package \
  --template-file cloudformation/mva-rideshare-stack.yaml \
  --s3-bucket $S3_DEPLOYMENT_BUCKET \
  --s3-prefix templates \
  --output-template-file build/packaged-template.yaml \
  --region $REGION

# Deploy the stack
echo "Deploying CloudFormation stack..."
aws cloudformation deploy \
  --template-file build/packaged-template.yaml \
  --stack-name $STACK_NAME \
  --parameter-overrides \
    EnvironmentName=$ENV \
    TrustedFormApiKey=$TRUSTED_FORM_API_KEY \
  --capabilities CAPABILITY_IAM \
  --region $REGION

# Update Lambda code
echo "Updating Lambda function code..."
LAMBDA_FUNCTION_NAME=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query "Stacks[0].Outputs[?OutputKey=='LambdaFunctionName'].OutputValue" \
  --output text \
  --region $REGION)

aws lambda update-function-code \
  --function-name $LAMBDA_FUNCTION_NAME \
  --s3-bucket $S3_DEPLOYMENT_BUCKET \
  --s3-key $LAMBDA_ZIP_FILE \
  --region $REGION

# Display stack outputs
echo "Deployment completed. Stack outputs:"
aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query "Stacks[0].Outputs" \
  --output table \
  --region $REGION

echo "====== Deployment Complete ======"
echo "API URL can be found in the outputs above."
echo "Make sure to update your frontend code to use the new API endpoint." 