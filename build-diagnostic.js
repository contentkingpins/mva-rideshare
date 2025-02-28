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
  'src/app/page.tsx'
];

console.log('\nChecking for critical files:');
criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`${file}: ${exists ? '✅ Found' : '❌ Missing'}`);
});

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

console.log('\n=== Diagnostic Complete ==='); 