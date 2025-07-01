import { describe, it } from 'vitest';
import { cityHash64 } from './cityhash';

// Let me create a debug version of hashLen0to16
const k2 = 0x9ae16a3b2f90404fn;
const k3 = 0xc949d7c7509e6557n;
const MASK64 = 0xffffffffffffffffn;

function mask64(val: bigint): bigint {
  return val & MASK64;
}

function shiftMix(val: bigint): bigint {
  return (val ^ (val >> 47n)) & MASK64;
}

function debugHashLen0to16(s: Uint8Array): bigint {
  const len = s.length;
  console.log('hashLen0to16 called with len =', len);
  
  if (len > 8) {
    console.log('Taking len > 8 path');
    return 0n; // not relevant for our test
  }
  if (len >= 4) {
    console.log('Taking len >= 4 path');
    return 0n; // not relevant for our test  
  }
  if (len > 0) {
    console.log('Taking len > 0 path');
    const a = BigInt(s[0]);
    const b = BigInt(s[len >> 1]);
    const c = BigInt(s[len - 1]);
    const y = mask64(a + (b << 8n));
    const z = mask64(BigInt(len) + (c << 2n));
    
    console.log('a =', a, 'b =', b, 'c =', c);
    console.log('y =', y, 'z =', z);
    
    const result = mask64(shiftMix(mask64(y * k2) ^ mask64(z * k3)) * k2);
    console.log('hashLen0to16 result =', result);
    return result;
  }
  console.log('Taking default k2 path');
  return k2;
}

describe('Debug Actual Function', () => {
  it('should compare our function vs the real one', () => {
    const input = 'a';
    const data = new TextEncoder().encode(input);
    
    console.log('=== Manual debug function ===');
    const manualResult = debugHashLen0to16(data);
    
    console.log('\n=== Actual cityHash64 function ===');
    const actualResult = cityHash64(input);
    
    console.log('\nManual result:', manualResult.toString());
    console.log('Actual result:', actualResult.toString());
    console.log('Expected:', '2603192927274642682');
    console.log('Manual matches expected?', manualResult === 2603192927274642682n);
    console.log('Actual matches expected?', actualResult === 2603192927274642682n);
  });
});