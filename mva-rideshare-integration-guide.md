# MVA Rideshare Integration Guide

This guide documents the integration between the MVA Rideshare claim form application and external services:

1. AWS API Gateway integration
2. ActiveProsper TrustForms integration
3. TrustedForm certificate integration

## Overview

The MVA Rideshare application collects lead information through a multi-step form process. When a user submits the form, the data is:

1. Sent directly to the AWS API Gateway endpoint
2. Submitted to ActiveProsper TrustForms
3. Includes TrustedForm certificates for TCPA compliance

## Integration Details

### AWS API Gateway

The application submits lead data directly to the AWS API Gateway endpoint:

- **API Endpoint**: `https://bnmcip8xp5.execute-api.us-east-1.amazonaws.com/commercial-mva-lead-processor`
- **HTTP Method**: POST
- **Authentication**: None required (configured on the API Gateway side)
- **Content Type**: JSON

Data submitted to the API includes:

- Lead identification (lead_id, source)
- Contact information (firstName, lastName, email, phone)
- MVA-specific details (role, rideshareCompany, accidentDate, etc.)
- Tracking information (submittedAt, pageUrl, trustedFormCertUrl)

### ActiveProsper TrustForms

Form submissions are also sent to ActiveProsper TrustForms:

- **API Key**: Configured in .env.local
- **API Endpoint**: `https://api.activeprosper.com/v1/forms/submit`
- **HTTP Method**: POST
- **Content Type**: JSON

The TrustForms integration ensures leads are properly tracked and processed according to compliance requirements.

### TrustedForm Certificates

TrustedForm is integrated for TCPA compliance:

- TrustedForm script is loaded on the form page
- The certificate URL is captured and included with all form submissions
- The certificate field is named: `xxTrustedFormCertUrl`

## Configuration Files

The integration is configured through several key files:

### 1. Environment Variables (.env.local)

Contains configuration for API endpoints and credentials:

```
# AWS API Gateway Configuration
NEXT_PUBLIC_API_BASE_URL=https://bnmcip8xp5.execute-api.us-east-1.amazonaws.com
NEXT_PUBLIC_API_PATH=/commercial-mva-lead-processor

# ActiveProsper TrustForms Configuration
ACTIVEPROSPER_API_KEY=YOUR_ACTIVEPROSPER_API_KEY
ACTIVEPROSPER_FORM_ID=YOUR_ACTIVEPROSPER_FORM_ID
ACTIVEPROSPER_ENDPOINT=https://api.activeprosper.com/v1/forms/submit

# TrustedForm Configuration
TRUSTEDFORM_FIELD=xxTrustedFormCertUrl
```

### 2. API Utility (src/utils/api.ts)

Handles preparing and submitting lead data to the AWS API Gateway.

### 3. TrustForms Utility (src/utils/trustforms.ts)

Manages the integration with ActiveProsper TrustForms.

### 4. ClaimForm Component (src/components/claim/ClaimForm.tsx)

The main form component that includes:
- TrustedForm script integration
- Form submission logic
- API and TrustForms integration

## Data Flow

1. User fills out the multi-step form
2. On submission, the TrustedForm certificate URL is captured
3. Lead data is prepared with proper formatting
4. Data is submitted to both AWS API Gateway and ActiveProsper TrustForms
5. Success/failure is handled appropriately

## Source Identification

This implementation uses a consistent source identifier `MVA-Rideshare-Website` to distinguish leads from this site from other sites using the same API endpoint.

## Troubleshooting

### Common Issues

1. **API Gateway Errors**: 
   - Check if the endpoint URL is correct
   - Verify the request format matches what the API expects

2. **TrustForms Errors**:
   - Verify the API key is valid
   - Ensure the required fields are included in the submission

3. **TrustedForm Issues**:
   - Check that the TrustedForm script is loading properly
   - Verify the certificate field is being captured correctly

### Debugging

Both the API and TrustForms utilities include comprehensive logging to help troubleshoot issues. Check the browser console for log messages.

## Security Considerations

- API keys and credentials are stored in environment variables
- No sensitive data is exposed in client-side code
- All API requests use HTTPS
- TrustedForm ensures TCPA compliance

## Maintenance

When updating the application, ensure that:

1. The API endpoint URL remains correct
2. The TrustForms API key is valid
3. The source identifier remains consistent
4. TrustedForm integration continues to function properly

## Support

For issues with:
- AWS API: Contact your AWS administrator
- TrustForms: Contact ActiveProsper support
- TrustedForm: Contact ActiveProsper or TrustedForm support
- Application code: Review the integration code in this repository 