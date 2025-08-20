"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Test setup file for Jest
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables for tests
dotenv_1.default.config({ path: '.env.test' });
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
//# sourceMappingURL=setup.js.map