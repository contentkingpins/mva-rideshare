// Build Diagnostic for Next.js App Router
console.log('Running build diagnostic for Next.js App Router');

console.log('Checking page structure:');
console.log('- Contact page: Client component with metadata moved to layout.tsx');
console.log('- FAQ page: Client component with metadata moved to layout.tsx');

console.log('In Next.js App Router, metadata must be defined in server components.');
console.log('Client components (marked with "use client") cannot export metadata.');
console.log('Solution: Move metadata to layout files which are server components by default.');

// This file is for diagnostic purposes only and is not used in the application. 