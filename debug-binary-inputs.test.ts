import { describe, it } from 'vitest';
import { cityHash64 } from './cityhash';

describe('Debug Binary Inputs', () => {
  it('should test the binary input cases', () => {
    // Test case 1: 4-byte binary data
    const input1 = "\xff\xfe\xfd\xfc";
    const expected1 = 7113325962445230361n;
    const result1 = cityHash64(input1);
    
    console.log('=== Test case 1: \\xff\\xfe\\xfd\\xfc ===');
    console.log(`Input string: "${input1}"`);
    console.log(`Input length: ${input1.length}`);
    
    // Check what bytes we actually get
    const bytes1 = new TextEncoder().encode(input1);
    console.log(`Encoded bytes: [${Array.from(bytes1).map(b => '0x' + b.toString(16)).join(', ')}]`);
    console.log(`Byte values: [${Array.from(bytes1).join(', ')}]`);
    
    console.log(`Expected: ${expected1}`);
    console.log(`Got:      ${result1}`);
    console.log(`Match:    ${result1 === expected1}`);
    
    console.log('');
    
    // Test case 2: 10-byte binary data  
    const input2 = "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89";
    const expected2 = 16471604915186768179n;
    const result2 = cityHash64(input2);
    
    console.log('=== Test case 2: \\x80\\x81\\x82\\x83\\x84\\x85\\x86\\x87\\x88\\x89 ===');
    console.log(`Input string: "${input2}"`);
    console.log(`Input length: ${input2.length}`);
    
    // Check what bytes we actually get
    const bytes2 = new TextEncoder().encode(input2);
    console.log(`Encoded bytes: [${Array.from(bytes2).map(b => '0x' + b.toString(16)).join(', ')}]`);
    console.log(`Byte values: [${Array.from(bytes2).join(', ')}]`);
    
    console.log(`Expected: ${expected2}`);
    console.log(`Got:      ${result2}`);
    console.log(`Match:    ${result2 === expected2}`);
  });
});