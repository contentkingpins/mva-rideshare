const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('=== Build Diagnostic Tool ===');
console.log(`Running diagnostic at: ${new Date().toISOString()}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Platform: ${os.platform()} ${os.release()}`);

// Check Node.js and npm versions
console.log(`Node.js version: ${process.version}`);
console.log(`npm version: ${process.env.npm_version || 'unknown'}`);

// Check for critical files
const criticalFiles = [
  'next.config.js',
  'package.json',
  'tsconfig.json',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  '.env.local'
];

console.log('\nChecking for critical files:');
criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`${file}: ${exists ? '✅ Found' : '❌ Missing'}`);
  if (file === '.env.local' && exists) {
    try {
      const envContent = fs.readFileSync('.env.local', 'utf8');
      console.log('\nEnvironment variables in .env.local:');
      envContent.split('\n').forEach(line => {
        if (line.trim()) {
          const [key] = line.split('=');
          console.log(`- ${key}: ${key.includes('SECRET') || key.includes('KEY') ? '[HIDDEN]' : 'Set'}`);
        }
      });
    } catch (error) {
      console.log('Error reading .env.local:', error.message);
    }
  }
});

// Check Amplify environment variables
console.log('\nChecking Amplify environment variables:');
const amplifyVars = ['key_id', 'secret', 'region', 'table_name'];
amplifyVars.forEach(varName => {
  const value = process.env[varName] || (varName === 'table_name' ? process.env['table name'] : null);
  console.log(`- ${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
});

// Ensure AWS credentials are properly mapped
const key_id = process.env.key_id;
const secret = process.env.secret;
const region = process.env.region || 'us-east-1';
const tableName = process.env['table_name'] || process.env['table name'] || 'rideshare-mva';

// Map our custom env vars to standard AWS SDK env vars
if (key_id && !process.env.AWS_ACCESS_KEY_ID) {
  process.env.AWS_ACCESS_KEY_ID = key_id;
  console.log('✅ Mapped key_id to AWS_ACCESS_KEY_ID');
}

if (secret && !process.env.AWS_SECRET_ACCESS_KEY) {
  process.env.AWS_SECRET_ACCESS_KEY = secret;
  console.log('✅ Mapped secret to AWS_SECRET_ACCESS_KEY');
}

if (region && !process.env.AWS_REGION) {
  process.env.AWS_REGION = region;
  console.log('✅ Mapped region to AWS_REGION');
}

if (tableName && !process.env.DYNAMODB_TABLE_NAME) {
  process.env.DYNAMODB_TABLE_NAME = tableName;
  console.log('✅ Mapped table name to DYNAMODB_TABLE_NAME');
}

// Check environment variables
console.log('\nChecking environment variables:');
const requiredEnvVars = [
  'key_id',
  'secret',
  'region',
  'table name'
];

let missingVars = [];
requiredEnvVars.forEach(envVar => {
  const exists = !!process.env[envVar];
  console.log(`${envVar}: ${exists ? '✅ Set' : '❌ Missing'}`);
  if (!exists) missingVars.push(envVar);
});

if (missingVars.length > 0) {
  console.log('\n⚠️ Missing required environment variables:', missingVars.join(', '));
  console.log('Please ensure these variables are set in your Amplify environment settings:');
  console.log('1. Go to AWS Amplify Console');
  console.log('2. Navigate to your Amplify app');
  console.log('3. Go to App settings → Environment variables');
  console.log('4. Add the missing variables');
  // Don't exit with error during build phase
}

// Also check standard AWS SDK env vars
console.log('\nAWS SDK environment variables:');
console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`AWS_REGION: ${process.env.AWS_REGION ? '✅ Set' : '❌ Missing'}`);
console.log(`DYNAMODB_TABLE_NAME: ${process.env.DYNAMODB_TABLE_NAME ? '✅ Set' : '❌ Missing'}`);

// Check package.json configuration
try {
  const packageJson = require('./package.json');
  console.log('\nPackage.json dependencies:');
  console.log('- Next.js:', packageJson.dependencies.next);
  console.log('- React:', packageJson.dependencies.react);
  console.log('- React DOM:', packageJson.dependencies['react-dom']);
  
  console.log('\nBuild script:', packageJson.scripts.build);
} catch (error) {
  console.error('Error reading package.json:', error.message);
}

// Check for potential memory issues
const memoryUsage = process.memoryUsage();
console.log('\nMemory usage:');
Object.entries(memoryUsage).forEach(([key, value]) => {
  console.log(`- ${key}: ${Math.round(value / 1024 / 1024 * 100) / 100} MB`);
});

// Check for TypeScript errors
try {
  const tsConfig = require('./tsconfig.json');
  console.log('\nTypeScript configuration:');
  console.log('- Target:', tsConfig.compilerOptions.target);
  console.log('- Strict mode:', tsConfig.compilerOptions.strict);
  console.log('- JSX:', tsConfig.compilerOptions.jsx);
} catch (error) {
  console.error('Error reading tsconfig.json:', error.message);
}

// Create a .env.test file to force environment variables to be available at build time
try {
  // Only if we have AWS credentials, create a runtime env file to ensure they're available
  if (key_id && secret) {
    const runtimeEnvContent = [
      `# Generated by build-diagnostic.js at ${new Date().toISOString()}`,
      `KEY_ID=${key_id}`,
      `SECRET=${secret}`,
      `REGION=${region}`,
      `TABLE_NAME=${tableName}`,
      `AWS_ACCESS_KEY_ID=${key_id}`,
      `AWS_SECRET_ACCESS_KEY=${secret}`,
      `AWS_REGION=${region}`,
      `DYNAMODB_TABLE_NAME=${tableName}`
    ].join('\n');
    
    fs.writeFileSync(path.join(process.cwd(), '.env.production'), runtimeEnvContent);
    console.log('✅ Created .env.production with AWS credentials for runtime access');
  } else {
    console.warn('⚠️ AWS credentials missing - could not create runtime env file');
    console.warn('Please ensure the following environment variables are set in Amplify:');
    console.warn('- key_id: Your AWS Access Key ID');
    console.warn('- secret: Your AWS Secret Access Key');
  }
} catch (error) {
  console.error('Error creating runtime env file:', error.message);
}

console.log('\n=== Diagnostic Complete ==='); 