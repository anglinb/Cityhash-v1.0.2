import { describe, it } from 'vitest';
import { cityHash64 } from './cityhash';

describe('Debug Failing Cases', () => {
  it('should debug the len=4 case', () => {
    const input = "test"; // 4 chars - should go through len >= 4 path in hashLen0to16
    const expected = 17703940110308125106n;
    const result = cityHash64(input);
    
    console.log('Input:', input);
    console.log('Length:', input.length);
    console.log('Expected:', expected.toString());
    console.log('Got:', result.toString());
    console.log('Match:', result === expected);
  });

  it('should debug the len=7 case', () => {
    const input = "1234567"; // 7 chars - should go through len >= 4 path in hashLen0to16
    const expected = 5695750988907513070n;
    const result = cityHash64(input);
    
    console.log('Input:', input);
    console.log('Length:', input.length);
    console.log('Expected:', expected.toString());
    console.log('Got:', result.toString());
    console.log('Match:', result === expected);
  });

  it('should debug the len=8 case', () => {
    const input = "abcdefgh"; // 8 chars - should go through len >= 4 path in hashLen0to16
    const expected = 2314080607849552063n;
    const result = cityHash64(input);
    
    console.log('Input:', input);
    console.log('Length:', input.length);
    console.log('Expected:', expected.toString());
    console.log('Got:', result.toString());
    console.log('Match:', result === expected);
  });

  it('should debug the len=17 case', () => {
    const input = "This is a test string"; // 21 chars - should go through hashLen17to32
    const expected = 3430506936926796457n;
    const result = cityHash64(input);
    
    console.log('Input:', input);
    console.log('Length:', input.length);
    console.log('Expected:', expected.toString());
    console.log('Got:', result.toString());
    console.log('Match:', result === expected);
  });
});