import { logger } from './logger';

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