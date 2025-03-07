import React from 'react'
import Link from 'next/link'

export default function TestPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">MVA Rideshare System Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Diagnostic Tools</h2>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/api/create-table" 
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                🛠️ Create DynamoDB Table
              </Link>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-red-600">Run this first!</span> Creates the table if it doesn't exist
              </p>
            </li>
            <li>
              <Link 
                href="/api/debug-write" 
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                ✏️ Test Write Operation
              </Link>
              <p className="text-sm text-gray-600">
                Performs direct write test and verifies data was saved
              </p>
            </li>
            <li>
              <Link 
                href="/api/dynamodb-setup" 
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                📋 DynamoDB Setup & Testing
              </Link>
              <p className="text-sm text-gray-600">
                Checks AWS credentials, creates table if needed, tests read/write operations
              </p>
            </li>
            <li>
              <Link 
                href="/api/credentials-check" 
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                🔑 Check AWS Credentials
              </Link>
              <p className="text-sm text-gray-600">
                Verifies your AWS credentials are correctly configured
              </p>
            </li>
            <li>
              <Link 
                href="/api/debug" 
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                🔍 Environment Debug Info
              </Link>
              <p className="text-sm text-gray-600">
                Shows environment variables and basic configuration
              </p>
            </li>
            <li>
              <Link 
                href="/api/test-dynamodb" 
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                🧪 DynamoDB Connection Test
              </Link>
              <p className="text-sm text-gray-600">
                Tests basic DynamoDB operations
              </p>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="text-sm">
            <p><strong>Environment:</strong> <span id="node-env">Loading...</span></p>
            <p><strong>AWS Region:</strong> <span id="aws-region">Loading...</span></p>
            <p><strong>DynamoDB Table:</strong> <span id="table-name">Loading...</span></p>
            <p><strong>Credentials:</strong> <span id="aws-creds">Loading...</span></p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Form Submission</h2>
        <form id="test-form" className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              defaultValue="Test User"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              defaultValue="test@example.com" 
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input 
              type="text" 
              id="phone" 
              name="phone" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              defaultValue="555-123-4567"
              required
            />
          </div>
          
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700">Source</label>
            <input 
              type="text" 
              id="source" 
              name="source" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              defaultValue="test-page"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Test Lead
          </button>
        </form>
        
        <div id="form-result" className="mt-4 p-4 hidden">
          <h3 className="font-medium">Submission Result:</h3>
          <pre id="result-json" className="mt-2 bg-gray-100 p-4 rounded-md overflow-auto text-xs"></pre>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Debug Console</h2>
        <div id="debug-console" className="bg-gray-100 p-4 rounded-md h-48 overflow-auto font-mono text-xs">
          Console messages will appear here...
        </div>
      </div>
      
      <script 
        dangerouslySetInnerHTML={{ 
          __html: `
            // Fetch environment info
            fetch('/api/debug')
              .then(response => response.json())
              .then(data => {
                document.getElementById('node-env').textContent = data.environment['NODE_ENV'] || 'Not set';
                document.getElementById('aws-region').textContent = data.environment['region'] || 'Not set';
                document.getElementById('table-name').textContent = data.environment['table name'] || 'Not set';
                document.getElementById('aws-creds').textContent = 
                  (data.environment['key_id'] && data.environment['secret']) ? 'Present' : 'Missing';
              })
              .catch(error => {
                console.error('Error fetching environment info:', error);
                document.getElementById('node-env').textContent = 'Error fetching data';
              });
              
            // Custom console logger
            const originalConsole = console.log;
            const debugConsole = document.getElementById('debug-console');
            
            console.log = function(...args) {
              originalConsole.apply(console, args);
              const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' ');
              
              debugConsole.innerHTML += \`<div>\${new Date().toISOString().substring(11, 19)} - \${message}</div>\`;
              debugConsole.scrollTop = debugConsole.scrollHeight;
            };
            
            // Form submission
            document.getElementById('test-form').addEventListener('submit', async function(e) {
              e.preventDefault();
              console.log('Submitting test form...');
              
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData.entries());
              
              try {
                console.log('Form data:', data);
                
                const response = await fetch('/api/leads', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });
                
                const result = await response.json();
                console.log('API response:', result);
                
                // Show result
                document.getElementById('form-result').classList.remove('hidden');
                document.getElementById('result-json').textContent = JSON.stringify(result, null, 2);
                
                if (response.ok) {
                  document.getElementById('result-json').classList.add('text-green-600');
                  document.getElementById('result-json').classList.remove('text-red-600');
                } else {
                  document.getElementById('result-json').classList.add('text-red-600');
                  document.getElementById('result-json').classList.remove('text-green-600');
                }
              } catch (error) {
                console.error('Error submitting form:', error);
                document.getElementById('form-result').classList.remove('hidden');
                document.getElementById('result-json').textContent = 'Error: ' + error.message;
                document.getElementById('result-json').classList.add('text-red-600');
              }
            });
            
            console.log('Test page initialized');
          `
        }} 
      />
    </div>
  )
} 