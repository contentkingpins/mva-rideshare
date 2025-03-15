import { Component, ErrorInfo, ReactNode } from 'react';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    // In development, also log to console
    if (process.env.NODE_ENV === 'development') {
      const { level, message, context } = entry;
      console[level](message, context || '');
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.addLog(this.formatLog('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.addLog(this.formatLog('warn', message, context));
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.addLog(this.formatLog('error', message, context));
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }
}

export const logger = Logger.getInstance();

// Performance monitoring
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static start(markName: string): void {
    this.marks.set(markName, performance.now());
  }

  static end(markName: string): number | null {
    const startTime = this.marks.get(markName);
    if (startTime === undefined) {
      logger.warn(`No start mark found for "${markName}"`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(markName);

    logger.info(`Performance mark "${markName}" completed`, {
      duration: `${duration.toFixed(2)}ms`,
    });

    return duration;
  }
}

// Error boundary component
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary">
            <h2>Something went wrong</h2>
            <p>Please try refreshing the page</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
} 