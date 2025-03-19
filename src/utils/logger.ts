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