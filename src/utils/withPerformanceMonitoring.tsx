import { ComponentType, useEffect } from 'react';
import { PerformanceMonitor } from './performance';

export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string
) {
  return function WithPerformanceMonitoring(props: P) {
    useEffect(() => {
      PerformanceMonitor.start(`render_${componentName}`);
      return () => {
        PerformanceMonitor.end(`render_${componentName}`);
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
} 