const fs = require('fs');
const path = require('path');

console.log('=== Build Diagnostic Tool ===');

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
          console.log(`- ${key}`);
        }
      });
    } catch (error) {
      console.log('Error reading .env.local:', error.message);
    }
  }
});

// Check environment variables
console.log('\nChecking environment variables:');
const requiredEnvVars = [
  'key_id',
  'secret',
  'region',
  'table_name'
];

let missingVars = [];
requiredEnvVars.forEach(envVar => {
  const exists = !!process.env[envVar];
  console.log(`${envVar}: ${exists ? '✅ Set' : '❌ Missing'}`);
  if (!exists) missingVars.push(envVar);
});

if (missingVars.length > 0) {
  console.log('\n⚠️ Missing required environment variables:', missingVars.join(', '));
  console.log('Please ensure these variables are set in your Amplify environment settings.');
  // Don't exit with error during build phase
}

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

console.log('\n=== Diagnostic Complete ==='); 