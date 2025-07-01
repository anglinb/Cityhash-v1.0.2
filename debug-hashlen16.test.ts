import { describe, it } from 'vitest';

// Import the actual functions to test
const k0 = 0xc3a5c85c97cb3127n;
const k1 = 0xb492b66fbe98f273n;
const k2 = 0x9ae16a3b2f90404fn;
const k3 = 0xc949d7c7509e6557n;
const MASK64 = 0xffffffffffffffffn;

function mask64(val: bigint): bigint {
  return val & MASK64;
}

function hash128to64(x: { first: bigint; second: bigint }): bigint {
  const kMul = 0x9ddfea08eb382d69n;
  let a = ((x.first ^ x.second) * kMul) & MASK64;
  a ^= a >> 47n;
  a = a & MASK64;
  let b = ((x.second ^ a) * kMul) & MASK64;
  b ^= b >> 47n;
  b = (b * kMul) & MASK64;
  return b;
}

function hashLen16(u: bigint, v: bigint): bigint {
  return hash128to64({ first: u, second: v });
}

describe('Debug hashLen16', () => {
  it('should check what hashLen16 does vs direct calculation', () => {
    // For len >= 4 path in hashLen0to16
    const len = 1;
    const a = 97n;  // fetch32 would return 97 for single byte
    
    console.log('Testing len >= 4 path (even though len=1)');
    console.log('This would call: hashLen16(len + (a << 3), fetch32(s, len-4))');
    console.log('But for len=1, len-4 = -3, so this path shouldnt be taken');
    
    // For len > 0 path  
    console.log('\nTesting len > 0 path:');
    const y = 24929n;
    const z = 389n;
    
    const yk2 = mask64(y * k2);
    const zk3 = mask64(z * k3);
    const xor_result = yk2 ^ zk3;
    console.log('(y * k2) ^ (z * k3) =', xor_result.toString());
    
    // The C code does: ShiftMix(y * k2 ^ z * k3) * k2
    // But our code might be doing: hashLen16(something, something)
    
    console.log('Direct calculation gives:', mask64((xor_result ^ (xor_result >> 47n)) * k2).toString());
    console.log('Expected:', '2603192927274642682');
  });
});