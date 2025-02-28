const fs = require('fs');
const path = require('path');

// Directories to check
const directories = [
  path.join(process.cwd(), 'src/components'),
  path.join(process.cwd(), 'src/app')
];

// Patterns that indicate client-side code
const clientPatterns = [
  'useState',
  'useEffect',
  'useRef',
  'useCallback',
  'useMemo',
  'useContext',
  'useReducer',
  'useLayoutEffect',
  'motion',
  'AnimatePresence',
  'framer-motion',
  'onClick',
  'onChange',
  'onSubmit',
  'addEventListener'
];

console.log('=== Client Component Checker ===');

// Function to check if a file might need "use client" directive
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasClientCode = clientPatterns.some(pattern => content.includes(pattern));
    const hasUseClientDirective = content.includes('"use client"') || content.includes("'use client'");
    
    if (hasClientCode && !hasUseClientDirective) {
      console.log(`⚠️ ${filePath} might need "use client" directive`);
      return false;
    } else if (hasClientCode && hasUseClientDirective) {
      console.log(`✅ ${filePath} correctly has "use client" directive`);
      return true;
    }
    return true;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return false;
  }
}

// Recursively check all files in directories
function checkDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        checkDirectory(filePath);
      } else if (stats.isFile() && 
                (filePath.endsWith('.tsx') || 
                 filePath.endsWith('.jsx') || 
                 filePath.endsWith('.ts') || 
                 filePath.endsWith('.js'))) {
        checkFile(filePath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

// Check all directories
directories.forEach(dir => {
  console.log(`\nChecking directory: ${dir}`);
  checkDirectory(dir);
});

console.log('\n=== Client Component Check Complete ==='); 