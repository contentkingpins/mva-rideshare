"use client";

import { useEffect } from 'react';

export default function ClientBoundaryDebug({ componentName }: { componentName: string }) {
  useEffect(() => {
    console.log(`Client Component Mounted: ${componentName}`);
    return () => {
      console.log(`Client Component Unmounted: ${componentName}`);
    };
  }, [componentName]);

  return (
    <div style={{ display: 'none' }} data-testid={`client-boundary-${componentName}`}>
      {/* This component is just for debugging and doesn't render anything visible */}
    </div>
  );
} 