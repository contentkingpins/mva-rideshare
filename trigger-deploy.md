# Deployment Trigger

This file exists to trigger new deployments when needed.

## Latest Deployment
- Date: March 14, 2023
- Purpose: Fix form navigation issues in Step2Involvement component
- Changes: 
  - Fixed role validation in ClaimForm schema
  - Enhanced validation logic for guest role information
  - Improved form navigation after selecting role option

## Previous Deployment
- Date: March 6, 2023
- Purpose: Update AWS credentials and fix DynamoDB connectivity
- Changes: 
  - Added new IAM user credentials
  - Enhanced error handling
  - Improved diagnostic tools

## Notes
- The application should now connect to DynamoDB successfully
- Form submissions should be stored in the DynamoDB table
- Test using the /test page 