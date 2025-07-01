import { describe, it } from 'vitest';

// Copy constants locally for debugging
const k0 = 0xc3a5c85c97cb3127n;
const k1 = 0xb492b66fbe98f273n;
const k2 = 0x9ae16a3b2f90404fn;
const k3 = 0xc949d7c7509e6557n;
const MASK64 = 0xffffffffffffffffn;

function mask64(val: bigint): bigint {
  return val & MASK64;
}

function shiftMix(val: bigint): bigint {
  return (val ^ (val >> 47n)) & MASK64;
}

describe('Detailed Debug', () => {
  it('should manually calculate "a" step by step', () => {
    const s = new TextEncoder().encode('a');
    const len = s.length;
    
    console.log('Input "a", len =', len);
    console.log('Bytes:', Array.from(s));
    
    // Manual calculation following the len > 0 path
    const a = BigInt(s[0]);
    const b = BigInt(s[len >> 1]); // s[0] since len >> 1 = 0
    const c = BigInt(s[len - 1]);  // s[0] since len - 1 = 0
    
    console.log('a =', a.toString(), '(s[0])');
    console.log('b =', b.toString(), '(s[0])');  
    console.log('c =', c.toString(), '(s[0])');
    
    const y = mask64(a + (b << 8n));
    const z = mask64(BigInt(len) + (c << 2n));
    
    console.log('y = a + (b << 8) =', a.toString(), '+', (b << 8n).toString(), '=', y.toString());
    console.log('z = len + (c << 2) =', len.toString(), '+', (c << 2n).toString(), '=', z.toString());
    
    console.log('k2 =', k2.toString());
    console.log('k3 =', k3.toString());
    
    const yk2 = mask64(y * k2);
    const zk3 = mask64(z * k3);
    console.log('y * k2 =', yk2.toString());
    console.log('z * k3 =', zk3.toString());
    
    const xor_result = yk2 ^ zk3;
    console.log('(y * k2) ^ (z * k3) =', xor_result.toString());
    
    const shift_mix_result = shiftMix(xor_result);
    console.log('shiftMix(...) =', shift_mix_result.toString());
    
    const final_result = mask64(shift_mix_result * k2);
    console.log('Final result = shiftMix(...) * k2 =', final_result.toString());
    
    console.log('Expected from C:', '2603192927274642682');
    console.log('Match?', final_result === 2603192927274642682n);
  });
});