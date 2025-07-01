import { describe, it, expect } from 'vitest';
import { cityHash64 } from './cityhash';

describe('Test Correct Binary Data', () => {
  it('should test with actual binary byte arrays', () => {
    // Test case 1: [0xff, 0xfe, 0xfd, 0xfc] as raw bytes
    const bytes1 = new Uint8Array([0xff, 0xfe, 0xfd, 0xfc]);
    const expected1 = 7113325962445230361n;
    const result1 = cityHash64(bytes1);
    
    console.log('=== Test case 1: [0xff, 0xfe, 0xfd, 0xfc] ===');
    console.log(`Input bytes: [${Array.from(bytes1).map(b => '0x' + b.toString(16)).join(', ')}]`);
    console.log(`Length: ${bytes1.length}`);
    console.log(`Expected: ${expected1}`);
    console.log(`Got:      ${result1}`);
    console.log(`Match:    ${result1 === expected1}`);
    
    expect(result1).toBe(expected1);
    
    console.log('');
    
    // Test case 2: [0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89] as raw bytes  
    const bytes2 = new Uint8Array([0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89]);
    const expected2 = 16471604915186768179n;
    const result2 = cityHash64(bytes2);
    
    console.log('=== Test case 2: [0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89] ===');
    console.log(`Input bytes: [${Array.from(bytes2).map(b => '0x' + b.toString(16)).join(', ')}]`);
    console.log(`Length: ${bytes2.length}`);
    console.log(`Expected: ${expected2}`);
    console.log(`Got:      ${result2}`);
    console.log(`Match:    ${result2 === expected2}`);
    
    expect(result2).toBe(expected2);
  });
});