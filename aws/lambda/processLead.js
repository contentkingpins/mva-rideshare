// Lead processing Lambda function
const AWS = require('aws-sdk');
const https = require('https');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS services
const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE || 'rideshare-mva';
const S3_BUCKET = process.env.S3_BUCKET || 'mva-rideshare-leads';
const TRUSTEDFORM_API_KEY = process.env.TRUSTEDFORM_API_KEY || 'ccdd54f8fb4dc3b495d85dd504abd5f3';

/**
 * Claims a TrustedForm certificate
 * @param {string} certUrl - The TrustedForm certificate URL
 * @param {object} leadData - Lead data for the claim
 * @returns {Promise<object>} - The claim result
 */
async function claimTrustedFormCertificate(certUrl, leadData) {
  return new Promise((resolve, reject) => {
    try {
      console.log('[TrustedForm] Claiming certificate:', certUrl);
      
      if (!certUrl) {
        console.error('[TrustedForm] No certificate URL provided');
        return resolve({ 
          success: false, 
          message: 'No certificate URL provided' 
        });
      }
      
      // Extract the certificate ID from the URL
      const certMatch = certUrl.match(/([a-f0-9]{32})/i);
      if (!certMatch) {
        console.error('[TrustedForm] Invalid certificate URL format');
        return resolve({ 
          success: false, 
          message: 'Invalid certificate URL format' 
        });
      }
      
      const certId = certMatch[0];
      const options = {
        hostname: 'cert.trustedform.com',
        path: `/certificates/${certId}/claim`,
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(TRUSTEDFORM_API_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      const postData = new URLSearchParams({
        'reference': leadData.lead_id || uuidv4(),
        'vendor': 'MVA-rideshare',
        'email': leadData.email || '',
        'phone_1': leadData.phone || '',
        'first_name': leadData.firstName || '',
        'last_name': leadData.lastName || '',
        'tc_policy_url': 'https://mva-rideshare.com/terms',
      }).toString();
      
      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const claimData = JSON.parse(data);
              console.log('[TrustedForm] Claim successful:', claimData);
              resolve({ 
                success: true, 
                data: claimData,
                certificateUrl: certUrl
              });
            } catch (e) {
              console.error('[TrustedForm] Error parsing JSON response:', e);
              resolve({ 
                success: false, 
                message: 'Error parsing TrustedForm API response',
                statusCode: res.statusCode,
                raw: data
              });
            }
          } else {
            console.error('[TrustedForm] API error:', data);
            resolve({ 
              success: false, 
              message: `Failed to claim certificate: ${res.statusCode}`,
              details: data
            });
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('[TrustedForm] Request error:', error);
        resolve({ 
          success: false, 
          message: 'Error claiming certificate',
          error: error.message
        });
      });
      
      req.write(postData);
      req.end();
    } catch (error) {
      console.error('[TrustedForm] Error claiming certificate:', error);
      resolve({ 
        success: false, 
        message: 'Error claiming certificate',
        error: error.message
      });
    }
  });
}

/**
 * Saves lead data to S3 bucket with date-based folder structure
 * @param {object} leadData - The lead data to save
 * @returns {Promise<object>} - The S3 upload result
 */
async function saveLeadToS3(leadData) {
  try {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    
    // Create folder structure: funnelType/leadType/adCategory/YYYY/MM/DD/
    const funnelType = leadData.funnelType || 'default';
    const leadType = leadData.leadType || 'default';
    const adCategory = leadData.adCategory || 'default';
    
    const key = `funnelType=${funnelType}/leadType=${leadType}/adCategory=${adCategory}/${year}/${month}/${day}/${leadData.lead_id}.json`;
    
    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Body: JSON.stringify(leadData, null, 2),
      ContentType: 'application/json'
    };
    
    const uploadResult = await s3.putObject(params).promise();
    
    console.log('[S3] Lead saved successfully:', key);
    return {
      success: true,
      location: `s3://${S3_BUCKET}/${key}`,
      result: uploadResult
    };
  } catch (error) {
    console.error('[S3] Error saving lead:', error);
    return {
      success: false,
      message: 'Error saving lead to S3',
      error: error.message
    };
  }
}

/**
 * Saves lead data to DynamoDB
 * @param {object} leadData - The lead data to save
 * @returns {Promise<object>} - The DynamoDB put result
 */
async function saveLeadToDynamoDB(leadData) {
  try {
    // Ensure all undefined values are removed
    const sanitizedData = JSON.parse(JSON.stringify(leadData));
    
    const params = {
      TableName: DYNAMODB_TABLE,
      Item: sanitizedData
    };
    
    await dynamoDB.put(params).promise();
    
    console.log('[DynamoDB] Lead saved successfully:', leadData.lead_id);
    return {
      success: true,
      message: 'Lead saved to DynamoDB'
    };
  } catch (error) {
    console.error('[DynamoDB] Error saving lead:', error);
    return {
      success: false,
      message: 'Error saving lead to DynamoDB',
      error: error.message
    };
  }
}

/**
 * Main Lambda handler function
 */
exports.handler = async (event, context) => {
  console.log('=== MVA Rideshare Lead Processing Lambda ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Parse request body from API Gateway event
    let data;
    
    try {
      if (event.body) {
        data = JSON.parse(event.body);
      } else if (event.Records && event.Records[0] && event.Records[0].s3) {
        // Handle S3 event trigger (if used)
        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        const s3Object = await s3.getObject({ Bucket: bucket, Key: key }).promise();
        data = JSON.parse(s3Object.Body.toString());
      } else {
        // Direct invocation (e.g. for testing)
        data = event;
      }
      
      console.log('1. Parsed lead data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('Failed to parse data:', parseError);
      return formatResponse(400, {
        success: false,
        error: 'Invalid request data'
      });
    }
    
    // Generate a unique lead_id if not provided
    if (!data.lead_id) {
      data.lead_id = uuidv4();
      console.log('2. Generated lead_id:', data.lead_id);
    }
    
    // Add submitted_at timestamp if not provided
    if (!data.submitted_at) {
      data.submitted_at = new Date().toISOString();
    }
    
    // Claim TrustedForm certificate if URL provided
    if (data.trustedFormCertUrl) {
      console.log('3. TrustedForm certificate URL found, claiming certificate');
      const claimResult = await claimTrustedFormCertificate(data.trustedFormCertUrl, data);
      
      // Store claim result data with the lead
      if (claimResult.success && claimResult.data) {
        data.trustedFormClaimResult = claimResult.data;
      } else {
        console.warn('TrustedForm claim was not successful:', claimResult.message);
        data.trustedFormClaimError = claimResult.message;
      }
    } else {
      console.warn('3. No TrustedForm certificate URL provided');
    }
    
    console.log('4. Saving lead to S3...');
    const s3Result = await saveLeadToS3(data);
    if (s3Result.success) {
      data.s3Location = s3Result.location;
    } else {
      console.error('Failed to save lead to S3:', s3Result.message);
    }
    
    console.log('5. Saving lead to DynamoDB...');
    const dynamoResult = await saveLeadToDynamoDB(data);
    
    if (!dynamoResult.success) {
      console.error('Failed to save lead to DynamoDB:', dynamoResult.message);
      // Still return success if S3 save worked
      if (s3Result.success) {
        return formatResponse(201, {
          success: true,
          warning: 'Lead saved to S3 but not to DynamoDB',
          lead_id: data.lead_id,
          s3Location: s3Result.location
        });
      }
      
      return formatResponse(500, {
        success: false,
        error: 'Failed to save lead to both S3 and DynamoDB',
        lead_id: data.lead_id
      });
    }
    
    console.log('6. Lead processing completed successfully');
    return formatResponse(201, {
      success: true,
      message: 'Lead submission created successfully',
      lead_id: data.lead_id,
      s3Location: s3Result.success ? s3Result.location : null
    });
    
  } catch (error) {
    console.error('=== Lead Processing Error ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return formatResponse(500, {
      success: false,
      error: 'Internal server error',
      details: error.message,
      type: error.constructor.name
    });
  }
};

/**
 * Formats the Lambda response for API Gateway
 * @param {number} statusCode - HTTP status code
 * @param {object} body - Response body
 * @returns {object} - Formatted response
 */
function formatResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
      'Access-Control-Allow-Methods': 'OPTIONS,POST'
    },
    body: JSON.stringify(body)
  };
} 