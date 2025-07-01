import { describe, it } from 'vitest';
import { cityHash64 } from './cityhash';

describe('Debug CityHash64', () => {
  it('should debug the "a" case step by step', () => {
    const input = 'a';
    const data = new TextEncoder().encode(input);
    
    console.log('Input:', input);
    console.log('Data bytes:', Array.from(data));
    console.log('Data length:', data.length);
    
    // This should go through hashLen0to16 path since len=1
    const result = cityHash64(input);
    console.log('Final result:', result.toString());
    console.log('Expected:', 2603192927274642682n.toString());
    
    // Let's check what path it takes
    console.log('Should take len <= 16 path, then len > 0 but < 4 path');
  });
});