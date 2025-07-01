import { describe, it } from 'vitest';

function fetch32Debug(data: Uint8Array, offset = 0): bigint {
  let result = 0n;
  console.log(`fetch32Debug: data.length=${data.length}, offset=${offset}`);
  for (let i = 0; i < 4; i++) {
    if (offset + i < data.length) {
      const byte = data[offset + i];
      const contribution = BigInt(byte) << BigInt(i * 8);
      console.log(`  byte[${offset + i}] = ${byte}, contribution = ${contribution}`);
      result |= contribution;
    } else {
      console.log(`  byte[${offset + i}] = OUT_OF_BOUNDS`);
    }
  }
  const final = result & 0xffffffffn;
  console.log(`  fetch32Debug result: ${final}`);
  return final;
}

describe('Debug fetch32', () => {
  it('should debug fetch32 for len=7 case', () => {
    const input = "1234567";
    const data = new TextEncoder().encode(input);
    console.log('Input:', input);
    console.log('Data bytes:', Array.from(data));
    
    console.log('\nfetch32(data, 0):');
    const a = fetch32Debug(data, 0);
    
    console.log('\nfetch32(data, len-4) = fetch32(data, 3):');
    const b = fetch32Debug(data, data.length - 4);
    
    // Manual calculation for comparison
    const len = BigInt(data.length);
    const hashLen16Input1 = (len + (a << 3n)) & 0xffffffffffffffffn;
    const hashLen16Input2 = b;
    
    console.log(`\nInputs to hashLen16: ${hashLen16Input1}, ${hashLen16Input2}`);
  });

  it('should debug fetch32 for len=8 case', () => {
    const input = "abcdefgh";
    const data = new TextEncoder().encode(input);
    console.log('Input:', input);
    console.log('Data bytes:', Array.from(data));
    
    console.log('\nfetch32(data, 0):');
    const a = fetch32Debug(data, 0);
    
    console.log('\nfetch32(data, len-4) = fetch32(data, 4):');
    const b = fetch32Debug(data, data.length - 4);
    
    // Manual calculation for comparison
    const len = BigInt(data.length);
    const hashLen16Input1 = (len + (a << 3n)) & 0xffffffffffffffffn;
    const hashLen16Input2 = b;
    
    console.log(`\nInputs to hashLen16: ${hashLen16Input1}, ${hashLen16Input2}`);
  });
});