import { describe, it, expect } from 'vitest';
import { cityHash64 } from './cityhash';

describe('CityHash64 Verification against C implementation', () => {
  const testCases = [
    { input: '', expected: 11160318154034397263n },
    { input: 'a', expected: 2603192927274642682n },
    { input: 'abc', expected: 4220206313085259313n },
    { input: 'hello', expected: 2578220239953316063n },
    { input: 'hello world', expected: 12386028635079221413n },
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should match C implementation for "${input}"`, () => {
      const result = cityHash64(input);
      console.log(`"${input}": expected ${expected}, got ${result}`);
      expect(result).toBe(expected);
    });
  });
});