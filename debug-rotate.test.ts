import { describe, it } from 'vitest';

const MASK64 = 0xffffffffffffffffn;

function mask64(x: bigint): bigint {
  return x & MASK64;
}

function rotate(val: bigint, shift: number): bigint {
  const s = BigInt(shift & 63);
  return mask64((val << s) | (val >> (64n - s)));
}

describe('Debug Rotate', () => {
  it('should debug the rotate function', () => {
    const val = 6223234837213119349n;
    const shift = 52;
    
    console.log(`Input val: ${val}`);
    console.log(`Input shift: ${shift}`);
    
    const s = BigInt(shift & 63);
    console.log(`s = BigInt(${shift} & 63) = ${s}`);
    
    const leftShift = val << s;
    console.log(`val << s = ${val} << ${s} = ${leftShift}`);
    
    const rightShift = val >> (64n - s);
    console.log(`val >> (64n - s) = ${val} >> ${64n - s} = ${rightShift}`);
    
    const or = leftShift | rightShift;
    console.log(`leftShift | rightShift = ${or}`);
    
    const result = mask64(or);
    console.log(`mask64(or) = ${result}`);
    
    console.log(`Expected from C: 15416327432046073189`);
    console.log(`Match: ${result === 15416327432046073189n}`);
    
    // Alternative approach - let's check if there's an issue with large shift amounts
    const result2 = mask64((val << s) | (val >> (64n - s)));
    console.log(`Direct calculation: ${result2}`);
  });
});