import { describe, it } from 'vitest';

describe('Verify Masking', () => {
  it('should verify the a + z calculation', () => {
    const a = 16302165023164031746n;
    const z = 8367813887758639219n;
    const sum = a + z;
    const masked = sum & 0xffffffffffffffffn;
    
    console.log(`a = ${a}`);
    console.log(`z = ${z}`);
    console.log(`a + z = ${sum}`);
    console.log(`(a + z) & MASK64 = ${masked}`);
    console.log(`Expected from C: 6223234837213119349`);
    console.log(`Match: ${masked === 6223234837213119349n}`);
  });
});