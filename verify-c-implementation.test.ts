import { describe, it, expect } from 'vitest';
import { cityHash64 } from './cityhash';

describe('Verify Against C Implementation', () => {
  it('should match C implementation output exactly', () => {
    // Test cases verified directly against C debug program output
    const testCases = [
      { input: "test", expected: 17703940110308125106n },
      { input: "1234567", expected: 11025202622668490255n }, // C says this is correct
      { input: "abcdefgh", expected: 4864636163090995991n }, // C says this is correct
    ];
    
    for (const testCase of testCases) {
      const result = cityHash64(testCase.input);
      console.log(`Testing "${testCase.input}": expected=${testCase.expected}, got=${result}, match=${result === testCase.expected}`);
      expect(result).toBe(testCase.expected);
    }
  });
});