import { describe, it } from 'vitest';

const MASK64 = 0xffffffffffffffffn;

function correctRotate(val: bigint, shift: number): bigint {
  if (shift === 0) {
    return val & MASK64;
  }
  val = val & MASK64;
  return ((val >> BigInt(shift)) | (val << BigInt(64 - shift))) & MASK64;
}

describe('Test Correct Rotation', () => {
  it('should test the correct rotate function', () => {
    const val = 6223234837213119349n;
    const shift = 52;
    
    console.log(`Input val: ${val}`);
    console.log(`Input shift: ${shift}`);
    
    const rightShift = val >> BigInt(shift);
    console.log(`val >> shift = ${val} >> ${shift} = ${rightShift}`);
    
    const leftShift = (val & MASK64) << BigInt(64 - shift);
    console.log(`val << (64 - shift) = ${val} << ${64 - shift} = ${leftShift}`);
    
    const or = rightShift | leftShift;
    console.log(`rightShift | leftShift = ${or}`);
    
    const result = or & MASK64;
    console.log(`result & MASK64 = ${result}`);
    
    const directResult = correctRotate(val, shift);
    console.log(`Direct rotate result: ${directResult}`);
    
    console.log(`Expected from C: 15416327432046073189`);
    console.log(`Match: ${result === 15416327432046073189n}`);
  });
});