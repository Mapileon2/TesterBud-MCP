// Simple logger utility
export const logger = {
  info: (message: string) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  },
  warn: (message: string) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
  },
  error: (message: string) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
  },
  debug: (message: string) => {
    // Only log debug messages if in development mode
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`);
    }
  }
};
