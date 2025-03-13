#!/usr/bin/env node

/**
 * Pre-deployment check script
 * Run this before deploying to AWS Amplify to ensure credentials are set correctly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for better console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

console.log(`${colors.bold}${colors.cyan}=== AWS Amplify Pre-Deployment Check ===\n${colors.reset}`);

// Check for .env.local file
const envLocalExists = fs.existsSync(path.join(process.cwd(), '.env.local'));
console.log(`${colors.bold}Local Environment File:${colors.reset}`);
console.log(`${envLocalExists ? colors.green + '✓' : colors.red + '✗'} .env.local file exists: ${envLocalExists}`);

if (envLocalExists) {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      envVars[key.trim()] = value;
    }
  });
  
  console.log(`\n${colors.bold}AWS Credentials in .env.local:${colors.reset}`);
  console.log(`${envVars.AWS_ACCESS_KEY_ID ? colors.green + '✓' : colors.red + '✗'} AWS_ACCESS_KEY_ID`);
  console.log(`${envVars.AWS_SECRET_ACCESS_KEY ? colors.green + '✓' : colors.red + '✗'} AWS_SECRET_ACCESS_KEY`);
  console.log(`${envVars.AWS_REGION ? colors.green + '✓' : colors.red + '✗'} AWS_REGION: ${envVars.AWS_REGION || 'not set'}`);
  console.log(`${envVars.DYNAMODB_TABLE_NAME ? colors.green + '✓' : colors.red + '✗'} DYNAMODB_TABLE_NAME: ${envVars.DYNAMODB_TABLE_NAME || 'not set'}`);
}

// Check if .env.local is in .gitignore
const gitignoreExists = fs.existsSync(path.join(process.cwd(), '.gitignore'));
let envLocalIgnored = false;

if (gitignoreExists) {
  const gitignoreContent = fs.readFileSync(path.join(process.cwd(), '.gitignore'), 'utf8');
  const lines = gitignoreContent.split('\n');
  envLocalIgnored = lines.some(line => 
    line.trim() === '.env.local' || 
    line.trim() === '.env*.local' ||
    line.trim() === '*.env.local'
  );
}

console.log(`\n${colors.bold}Security Check:${colors.reset}`);
console.log(`${gitignoreExists ? colors.green + '✓' : colors.red + '✗'} .gitignore file exists: ${gitignoreExists}`);
console.log(`${envLocalIgnored ? colors.green + '✓' : colors.red + '✗'} .env.local is ignored in git: ${envLocalIgnored}`);

if (!envLocalIgnored && gitignoreExists) {
  console.log(`${colors.yellow}⚠️ Warning: .env.local is not in .gitignore. This could expose your AWS credentials!${colors.reset}`);
  console.log(`${colors.yellow}   Consider adding '.env.local' or '.env*.local' to your .gitignore file.${colors.reset}`);
}

// Check AWS Amplify YAML configuration
const amplifyYmlExists = fs.existsSync(path.join(process.cwd(), 'amplify.yml'));
console.log(`\n${colors.bold}AWS Amplify Configuration:${colors.reset}`);
console.log(`${amplifyYmlExists ? colors.green + '✓' : colors.red + '✗'} amplify.yml exists: ${amplifyYmlExists}`);

// Check for critical files
const criticalFiles = [
  'next.config.js',
  'package.json',
  'tsconfig.json'
];

console.log(`\n${colors.bold}Critical Application Files:${colors.reset}`);
criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`${exists ? colors.green + '✓' : colors.red + '✗'} ${file}: ${exists}`);
});

// Check environment variables needed for Amplify
console.log(`\n${colors.bold}Environment Variables for Amplify:${colors.reset}`);
console.log('Make sure the following variables are set in your Amplify environment:');
console.log(`${colors.blue}key_id${colors.reset} - Your AWS Access Key ID`);
console.log(`${colors.blue}secret${colors.reset} - Your AWS Secret Access Key`);
console.log(`${colors.blue}region${colors.reset} - AWS Region (optional, defaults to us-east-1)`);
console.log(`${colors.blue}table_name${colors.reset} - DynamoDB table name (optional, defaults to rideshare-mva)`);

// Test the npm build command
console.log(`\n${colors.bold}Testing build command:${colors.reset}`);
try {
  console.log(`Running 'npm run build --dry-run' to verify build configuration...`);
  execSync('npm run build --dry-run', { stdio: 'pipe' });
  console.log(`${colors.green}✓ Build command looks good!${colors.reset}`);
} catch (error) {
  console.log(`${colors.red}✗ Build command has issues:${colors.reset}`);
  console.log(`${colors.red}${error.message}${colors.reset}`);
}

console.log(`\n${colors.bold}${colors.cyan}=== Pre-Deployment Check Complete ===\n${colors.reset}`);

// Recommendations
console.log(`${colors.bold}${colors.yellow}Recommendations:${colors.reset}`);
console.log('1. Ensure your AWS credentials are set in Amplify environment variables');
console.log('2. Make sure your .env.local file is in .gitignore');
console.log('3. Rotate your AWS credentials if they were ever committed to Git');
console.log('4. Consider using IAM roles instead of access keys for production');
console.log(`\nFor more details, see the ${colors.cyan}amplify-setup-guide.md${colors.reset} and ${colors.cyan}aws-credential-rotation-guide.md${colors.reset} files.`); 