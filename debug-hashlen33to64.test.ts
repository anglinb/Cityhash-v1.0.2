import { describe, it } from 'vitest';

// Copy constants and helper functions from our implementation
const k0 = 0xc3a5c85c97cb3127n;
const k1 = 0xb492b66fbe98f273n;
const k2 = 0x9ae16a3b2f90404fn;
const k3 = 0xc949d7c7509e6557n;
const MASK64 = 0xffffffffffffffffn;

function mask64(x: bigint): bigint {
  return x & MASK64;
}

function rotate(val: bigint, shift: number): bigint {
  if (shift === 0) {
    return val & MASK64;
  }
  val = val & MASK64;
  return ((val >> BigInt(shift)) | (val << BigInt(64 - shift))) & MASK64;
}

function fetch64(data: Uint8Array, offset = 0): bigint {
  let result = 0n;
  for (let i = 0; i < 8; i++) {
    if (offset + i < data.length) {
      result |= BigInt(data[offset + i]) << BigInt(i * 8);
    }
  }
  return result & MASK64;
}

function shiftMix(val: bigint): bigint {
  return mask64(val ^ (val >> 47n));
}

function hash128to64(x: { first: bigint; second: bigint }): bigint {
  const kMul = 0x9ddfea08eb382d69n;
  let a = mask64((x.first ^ x.second) * kMul);
  a ^= (a >> 47n);
  let b = mask64((x.second ^ a) * kMul);
  b ^= (b >> 47n);
  b = mask64(b * kMul);
  return b;
}

function hashLen16(u: bigint, v: bigint): bigint {
  return hash128to64({ first: u, second: v });
}

function debugHashLen33to64(s: Uint8Array): bigint {
  console.log('=== hashLen33to64 debug ===');
  const len = s.length;
  console.log(`len = ${len}`);
  
  const z = fetch64(s, 24);
  console.log(`z = fetch64(s, 24) = ${z}`);
  
  let a = mask64(fetch64(s) + mask64((BigInt(len) + fetch64(s, len - 16)) * k0));
  console.log(`a = fetch64(s) + (len + fetch64(s, len-16)) * k0`);
  console.log(`  fetch64(s, 0) = ${fetch64(s)}`);
  console.log(`  fetch64(s, ${len - 16}) = ${fetch64(s, len - 16)}`);
  console.log(`  (${len} + ${fetch64(s, len - 16)}) * k0 = ${mask64((BigInt(len) + fetch64(s, len - 16)) * k0)}`);
  console.log(`  a = ${a}`);
  
  let b = rotate(mask64(a + z), 52);
  console.log(`b = rotate(mask64(a + z), 52) = rotate(${mask64(a + z)}, 52) = ${b}`);
  
  let c = rotate(a, 37);
  console.log(`c = rotate(a, 37) = ${c}`);
  
  a = mask64(a + fetch64(s, 8));
  console.log(`a += fetch64(s, 8) = ${a}`);
  
  c = mask64(c + rotate(a, 7));
  console.log(`c += rotate(a, 7) = ${c}`);
  
  a = mask64(a + fetch64(s, 16));
  console.log(`a += fetch64(s, 16) = ${a}`);
  
  const vf = mask64(a + z);
  console.log(`vf = a + z = ${vf}`);
  
  const vs = mask64(b + rotate(a, 31) + c);
  console.log(`vs = b + rotate(a, 31) + c = ${b} + ${rotate(a, 31)} + ${c} = ${vs}`);
  
  a = mask64(fetch64(s, 16) + fetch64(s, len - 32));
  console.log(`a = fetch64(s, 16) + fetch64(s, ${len - 32}) = ${a}`);
  
  const z2 = fetch64(s, len - 8);
  console.log(`z2 = fetch64(s, ${len - 8}) = ${z2}`);
  
  b = rotate(mask64(a + z2), 52);
  console.log(`b = rotate(mask64(a + z2), 52) = rotate(${mask64(a + z2)}, 52) = ${b}`);
  
  c = rotate(a, 37);
  console.log(`c = rotate(a, 37) = ${c}`);
  
  a = mask64(a + fetch64(s, len - 24));
  console.log(`a += fetch64(s, ${len - 24}) = ${a}`);
  
  c = mask64(c + rotate(a, 7));
  console.log(`c += rotate(a, 7) = ${c}`);
  
  a = mask64(a + fetch64(s, len - 16));
  console.log(`a += fetch64(s, ${len - 16}) = ${a}`);
  
  const wf = mask64(a + z2);
  console.log(`wf = a + z2 = ${wf}`);
  
  const ws = mask64(b + rotate(a, 31) + c);
  console.log(`ws = b + rotate(a, 31) + c = ${b} + ${rotate(a, 31)} + ${c} = ${ws}`);
  
  console.log(`Inputs to final calculation:`);
  console.log(`  vf = ${vf}, ws = ${ws}, vf + ws = ${vf + ws}`);
  console.log(`  wf = ${wf}, vs = ${vs}, wf + vs = ${wf + vs}`);
  console.log(`  (vf + ws) * k2 = ${mask64((vf + ws) * k2)}`);
  console.log(`  (wf + vs) * k0 = ${mask64((wf + vs) * k0)}`);
  
  const r = shiftMix(mask64(mask64((vf + ws) * k2) + mask64((wf + vs) * k0)));
  console.log(`r = shiftMix((vf + ws) * k2 + (wf + vs) * k0) = ${r}`);
  
  const result = mask64(mask64(r * k0 + vs) * k2);
  console.log(`result = (r * k0 + vs) * k2 = ${result}`);
  
  return result;
}

describe('Debug hashLen33to64', () => {
  it('should debug the failing 62-char string', () => {
    const input = "The quick brown fox jumps over the lazy dog and runs away fast";
    const data = new TextEncoder().encode(input);
    
    console.log(`Input: "${input}"`);
    console.log(`Length: ${input.length}`);
    console.log(`Expected from C: 3547079698608021120`);
    
    const result = debugHashLen33to64(data);
    console.log(`\nOur result: ${result}`);
    console.log(`Expected:   3547079698608021120`);
    console.log(`Match:      ${result === 3547079698608021120n}`);
  });
});