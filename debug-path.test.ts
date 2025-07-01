import { describe, it } from 'vitest';

describe('Debug Path Selection', () => {
  it('should check which path is taken for len=1', () => {
    const len = 1;
    
    console.log('len =', len);
    console.log('len > 8?', len > 8);
    console.log('len >= 4?', len >= 4);
    console.log('len > 0?', len > 0);
    
    if (len > 8) {
      console.log('Would take: len > 8 path');
    } else if (len >= 4) {
      console.log('Would take: len >= 4 path');
    } else if (len > 0) {
      console.log('Would take: len > 0 path');
    } else {
      console.log('Would take: default return k2 path');
    }
  });
});