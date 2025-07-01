import { describe, it, expect, beforeAll } from 'vitest';
import { cityHash64, cityHash64WithSeed, cityHash64WithSeeds } from './cityhash';

const k0 = 0xc3a5c85c97cb3127n;
const dataSize = 1 << 10;
const testSize = 300;

let data: Uint8Array;

function setupTestData() {
  data = new Uint8Array(dataSize);
  let a = 9n;
  let b = 777n;
  
  for (let i = 0; i < dataSize; i++) {
    a += b;
    b += a;
    a = (a ^ (a >> 41n)) * k0;
    b = (b ^ (b >> 41n)) * k0 + BigInt(i);
    data[i] = Number(b >> 37n) & 0xFF;
  }
}

describe('CityHash64 TypeScript Implementation', () => {
  beforeAll(() => {
    setupTestData();
  });

  it('should produce consistent results for empty string', () => {
    const result = cityHash64('');
    expect(typeof result).toBe('bigint');
    expect(result).toBe(cityHash64(''));
  });

  it('should produce different results for different strings', () => {
    const result1 = cityHash64('hello');
    const result2 = cityHash64('world');
    expect(result1).not.toBe(result2);
  });

  it('should handle various string lengths', () => {
    const testStrings = [
      '',
      'a',
      'ab',
      'abc',
      'abcd',
      'hello',
      'hello world',
      'The quick brown fox jumps over the lazy dog',
    ];
    
    const results = testStrings.map(str => cityHash64(str));
    
    // All results should be different (except possibly by coincidence)
    const uniqueResults = new Set(results.map(r => r.toString()));
    expect(uniqueResults.size).toBeGreaterThan(testStrings.length / 2);
  });

  it('should handle Uint8Array input', () => {
    const textEncoder = new TextEncoder();
    const stringInput = 'hello world';
    const arrayInput = textEncoder.encode(stringInput);
    
    const stringResult = cityHash64(stringInput);
    const arrayResult = cityHash64(arrayInput);
    
    expect(stringResult).toBe(arrayResult);
  });

  it('should work with seeds', () => {
    const testData = 'hello world';
    const seed1 = 12345n;
    const seed2 = 67890n;
    
    const normal = cityHash64(testData);
    const withSeed = cityHash64WithSeed(testData, seed1);
    const withSeeds = cityHash64WithSeeds(testData, seed1, seed2);
    
    // They should all be different
    expect(normal).not.toBe(withSeed);
    expect(normal).not.toBe(withSeeds);
    expect(withSeed).not.toBe(withSeeds);
  });

  it('should handle edge cases', () => {
    // Test various lengths that trigger different code paths
    const lengths = [0, 1, 4, 8, 16, 17, 32, 33, 64, 65];
    
    for (const len of lengths) {
      const testData = data.slice(0, len);
      const result = cityHash64(testData);
      expect(typeof result).toBe('bigint');
    }
  });

  it('should produce deterministic results', () => {
    const testString = 'test string for deterministic check';
    const result1 = cityHash64(testString);
    const result2 = cityHash64(testString);
    const result3 = cityHash64(testString);
    
    expect(result1).toBe(result2);
    expect(result2).toBe(result3);
  });

  it('should handle long strings correctly', () => {
    // Test with a string longer than 64 bytes to trigger the main loop
    const longString = 'a'.repeat(1000);
    const result = cityHash64(longString);
    expect(typeof result).toBe('bigint');
    
    // Should be different from shorter version
    const shortResult = cityHash64('a'.repeat(100));
    expect(result).not.toBe(shortResult);
  });
});