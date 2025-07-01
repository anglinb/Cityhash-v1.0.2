import { describe, it, expect } from 'vitest';
import { cityHash64 } from './cityhash';

describe('Test Specific Failing Cases', () => {
  it('should match specific cases verified by C', () => {
    const testCases = [
      { input: "The quick brown fox jumps over the lazy dog and runs away fast", expected: 3547079698608021120n },
      { input: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@", expected: 1158246217385016583n },
      { input: "!@#$%^&*()_+-=[]{}|;':\",./<>?`~0123456789abcdefghijklmnopqr", expected: 11468148723890860051n },
      { input: "https://example.com/path?param=value", expected: 9748373709323062071n },
      { input: "http://user:pass@host.com:8080/path", expected: 1684917090589079439n },
      { input: "ftp://files.example.com/folder/file.zip", expected: 11852510145150176097n },
      { input: "ZzYyXxWwVvUuTtSsRrQqPpOoNnMmLlKkJjIiHhGgFfEeDdCcBbAa", expected: 13876918085873819750n },
    ];
    
    for (const testCase of testCases) {
      const result = cityHash64(testCase.input);
      console.log(`Testing "${testCase.input.substring(0, 30)}..." (${testCase.input.length} chars):`);
      console.log(`  Expected: ${testCase.expected}`);
      console.log(`  Got:      ${result}`);
      console.log(`  Match:    ${result === testCase.expected}`);
      expect(result).toBe(testCase.expected);
    }
  });
});