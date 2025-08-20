// Test setup file for Jest
import dotenv from 'dotenv';

// Load environment variables for tests
dotenv.config({ path: '.env.test' });

// Global test setup
beforeAll(() => {
  // Setup any global test configurations
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Cleanup after tests
});

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};