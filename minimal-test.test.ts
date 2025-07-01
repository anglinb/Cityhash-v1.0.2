import { describe, it, expect } from 'vitest';
import { cityHash64 } from './cityhash';

describe('Minimal CityHash64 Test', () => {
  it('should handle empty string without hanging', () => {
    const result = cityHash64('');
    expect(typeof result).toBe('bigint');
    console.log('Empty string result:', result.toString());
  });

  it('should handle single character', () => {
    const result = cityHash64('a');
    expect(typeof result).toBe('bigint');
    console.log('Single char result:', result.toString());
  });
});