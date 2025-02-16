'use client';

import { useEffect, useState } from 'react';
import { app } from '@/firebase/config';

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Simple check if Firebase is initialized
    if (app) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Crossword Collab</h1>
        <div className="flex items-center gap-2 justify-center">
          <span>Firebase Status:</span>
          {isConnected === null ? (
            <span>Checking...</span>
          ) : isConnected ? (
            <span className="text-green-600">Connected ✓</span>
          ) : (
            <span className="text-red-600">Not Connected ✗</span>
          )}
        </div>
      </div>
    </main>
  );
}
