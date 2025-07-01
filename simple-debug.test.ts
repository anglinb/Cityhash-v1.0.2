import { describe, it } from 'vitest';
import { cityHash64 } from './cityhash';

describe('Simple Debug', () => {
  it('should just call cityHash64 and see console output', () => {
    console.log('About to call cityHash64("a")');
    const result = cityHash64('a');
    console.log('Result:', result.toString());
  });
});