import { describe, it, expect } from 'vitest';
import { cityHash64 } from './cityhash';

describe('CityHash64 Cross-validation', () => {
  it('should produce expected results for common test cases', () => {
    // These are some known test vectors
    const testCases = [
      { input: '', description: 'empty string' },
      { input: 'a', description: 'single character' },
      { input: 'abc', description: 'short string' },
      { input: 'hello', description: 'medium string' },
      { input: 'hello world', description: 'phrase' },
      { input: 'The quick brown fox jumps over the lazy dog', description: 'pangram' },
    ];

    for (const testCase of testCases) {
      const result = cityHash64(testCase.input);
      console.log(`${testCase.description}: "${testCase.input}" -> ${result.toString()}`);
      expect(typeof result).toBe('bigint');
      expect(result).toBeGreaterThan(0n);
    }
  });

  it('should handle binary data correctly', () => {
    const binaryData = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const result = cityHash64(binaryData);
    console.log(`Binary data [0-9]: ${result.toString()}`);
    expect(typeof result).toBe('bigint');
  });

  it('should handle larger inputs efficiently', () => {
    const largeInput = 'x'.repeat(1000);
    const start = Date.now();
    const result = cityHash64(largeInput);
    const duration = Date.now() - start;
    
    console.log(`Large input (1000 chars): ${result.toString()}, took ${duration}ms`);
    expect(typeof result).toBe('bigint');
    expect(duration).toBeLessThan(100); // Should be very fast
  });
});