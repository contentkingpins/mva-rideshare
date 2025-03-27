'use client';

import { useState, useEffect } from 'react';
import { events } from '@/utils/metaPixel';
import { tiktokEvents } from '@/utils/tiktokPixel';

export default function DebugPage() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [fbInitialized, setFbInitialized] = useState(false);
  const [ttInitialized, setTtInitialized] = useState(false);
  const [eventName, setEventName] = useState('PageView');
  const [eventParams, setEventParams] = useState('{}');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Check consent status
    const storedConsent = localStorage.getItem('marketing_consent');
    setHasConsent(storedConsent === 'true');
    
    // Check if FB Pixel is initialized
    setFbInitialized(typeof window !== 'undefined' && !!window.fbq);
    
    // Check if TikTok Pixel is initialized
    setTtInitialized(typeof window !== 'undefined' && !!window.ttq);
    
    // Add a log
    addLog('Debug page loaded, checking pixel status...');
  }, []);

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toISOString()}] ${message}`, ...prev].slice(0, 20));
  };

  const grantConsent = () => {
    localStorage.setItem('marketing_consent', 'true');
    setHasConsent(true);
    
    // Reload page to initialize pixels
    window.location.reload();
  };

  const revokeConsent = () => {
    localStorage.setItem('marketing_consent', 'false');
    setHasConsent(false);
    
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('consent', 'revoke');
      addLog('Revoked consent for Meta Pixel');
    }
    
    // Reload page to ensure pixels are disabled
    window.location.reload();
  };

  const fireMetaEvent = () => {
    if (!fbInitialized) {
      addLog('Error: Meta Pixel not initialized');
      return;
    }
    
    try {
      const params = JSON.parse(eventParams);
      window.fbq('track', eventName, params);
      addLog(`Fired Meta event: ${eventName} with params: ${eventParams}`);
      
      // Also send to server for diagnostic purposes
      fetch('/api/meta-pixel-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          event: eventName,
          params,
          timestamp: new Date().toISOString(),
        })
      })
      .then(response => response.json())
      .then(data => addLog(`Server response: ${JSON.stringify(data)}`))
      .catch(error => addLog(`Server error: ${error.message}`));
    } catch (e) {
      addLog(`Error parsing event params: ${(e as Error).message}`);
    }
  };

  const fireTikTokEvent = () => {
    if (!ttInitialized) {
      addLog('Error: TikTok Pixel not initialized');
      return;
    }
    
    try {
      const params = JSON.parse(eventParams);
      if (typeof window !== 'undefined' && window.ttq) {
        window.ttq('track', eventName, params);
        addLog(`Fired TikTok event: ${eventName} with params: ${eventParams}`);
      } else {
        addLog('Error: TikTok Pixel unexpectedly not available');
      }
    } catch (e) {
      addLog(`Error parsing event params: ${(e as Error).message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Pixel Debug Page</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Consent Status</h2>
        <div className="flex flex-col space-y-2">
          <div>
            Current consent: {hasConsent === null ? 'Not set' : hasConsent ? 'Granted' : 'Revoked'}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={grantConsent}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Grant Consent
            </button>
            <button 
              onClick={revokeConsent}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Revoke Consent
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Pixel Status</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="w-32">Meta Pixel:</span>
            <span className={`px-2 py-1 rounded text-white ${fbInitialized ? 'bg-green-600' : 'bg-red-600'}`}>
              {fbInitialized ? 'Initialized' : 'Not Initialized'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-32">TikTok Pixel:</span>
            <span className={`px-2 py-1 rounded text-white ${ttInitialized ? 'bg-green-600' : 'bg-red-600'}`}>
              {ttInitialized ? 'Initialized' : 'Not Initialized'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Fire Test Event</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Event Name</label>
            <select 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {Object.entries(events).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Event Parameters (JSON)</label>
            <textarea 
              value={eventParams}
              onChange={(e) => setEventParams(e.target.value)}
              className="w-full p-2 border rounded font-mono text-sm"
              rows={5}
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={fireMetaEvent}
              disabled={!fbInitialized}
              className={`px-4 py-2 rounded text-white ${fbInitialized ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'}`}
            >
              Fire Meta Event
            </button>
            <button 
              onClick={fireTikTokEvent}
              disabled={!ttInitialized}
              className={`px-4 py-2 rounded text-white ${ttInitialized ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'}`}
            >
              Fire TikTok Event
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Logs</h2>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-auto">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
} 