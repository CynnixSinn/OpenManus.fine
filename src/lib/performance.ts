/**
 * Performance monitoring utility for OpenManus
 * 
 * This module provides functions to measure and report performance metrics
 * for critical operations in the application.
 */

// Performance marks prefix to avoid collisions
const MARK_PREFIX = 'openmanus:';

/**
 * Start measuring a performance metric
 * @param name The name of the metric to measure
 */
export function startMeasure(name: string): void {
  if (typeof performance === 'undefined') return;
  
  const markName = `${MARK_PREFIX}${name}:start`;
  performance.mark(markName);
}

/**
 * End measuring a performance metric and log the result
 * @param name The name of the metric to measure
 * @param logToConsole Whether to log the result to console (default: false)
 * @returns The duration in milliseconds
 */
export function endMeasure(name: string, logToConsole = false): number {
  if (typeof performance === 'undefined') return 0;
  
  const startMark = `${MARK_PREFIX}${name}:start`;
  const endMark = `${MARK_PREFIX}${name}:end`;
  
  performance.mark(endMark);
  
  try {
    const measureName = `${MARK_PREFIX}${name}`;
    performance.measure(measureName, startMark, endMark);
    
    const entries = performance.getEntriesByName(measureName, 'measure');
    const duration = entries[0]?.duration || 0;
    
    if (logToConsole) {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    }
    
    // Clean up marks and measures to avoid memory leaks
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);
    
    // Report to analytics in production
    if (import.meta.env.PROD) {
      reportPerformanceMetric(name, duration);
    }
    
    return duration;
  } catch (error) {
    console.error('Error measuring performance:', error);
    return 0;
  }
}

/**
 * Report a performance metric to analytics
 * @param name The name of the metric
 * @param duration The duration in milliseconds
 */
function reportPerformanceMetric(name: string, duration: number): void {
  // In a real app, this would send data to an analytics service
  // For now, we'll just log to console in production
  if (import.meta.env.PROD) {
    console.info(`Performance metric: ${name} = ${duration.toFixed(2)}ms`);
    
    // Example of sending to a hypothetical analytics endpoint
    // fetch('/api/analytics/performance', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, duration, timestamp: Date.now() })
    // }).catch(err => console.error('Failed to report performance metric:', err));
  }
}

/**
 * Measure the execution time of an async function
 * @param name The name of the metric
 * @param fn The async function to measure
 * @param logToConsole Whether to log the result to console
 * @returns The result of the function
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  logToConsole = false
): Promise<T> {
  startMeasure(name);
  try {
    const result = await fn();
    endMeasure(name, logToConsole);
    return result;
  } catch (error) {
    endMeasure(name, logToConsole);
    throw error;
  }
}

/**
 * Measure the execution time of a synchronous function
 * @param name The name of the metric
 * @param fn The function to measure
 * @param logToConsole Whether to log the result to console
 * @returns The result of the function
 */
export function measure<T>(
  name: string,
  fn: () => T,
  logToConsole = false
): T {
  startMeasure(name);
  try {
    const result = fn();
    endMeasure(name, logToConsole);
    return result;
  } catch (error) {
    endMeasure(name, logToConsole);
    throw error;
  }
}

/**
 * Get web vitals metrics
 * This is a simplified version - in a real app, you'd use a library like web-vitals
 */
export function reportWebVitals(): void {
  if (typeof performance === 'undefined') return;
  
  // Wait for the page to fully load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigationEntry) {
        const metrics = {
          // Time to First Byte
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
          
          // DOM Content Loaded
          dcl: navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart,
          
          // Load Event
          loadEvent: navigationEntry.loadEventEnd - navigationEntry.fetchStart,
          
          // First Paint (if available)
          fp: getFirstPaint(),
        };
        
        console.info('Web Vitals:', metrics);
        
        // In production, send these metrics to your analytics service
        if (import.meta.env.PROD) {
          // Example: sendToAnalytics(metrics);
        }
      }
    }, 0);
  });
}

/**
 * Get the First Paint time if available
 */
function getFirstPaint(): number {
  if (typeof performance === 'undefined') return 0;
  
  const paintEntries = performance.getEntriesByType('paint');
  const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
  
  return firstPaint ? firstPaint.startTime : 0;
}