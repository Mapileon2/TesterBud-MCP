import { logger } from './logger';

// Centralized error handling
export function handleError(error: any, context: string = 'General'): void {
  logger.error(`Error in ${context}: ${error.message}`);
  if (error.stack) {
    logger.error(`Stack Trace: ${error.stack}`);
  }
  // Potentially send error to a monitoring service
}
