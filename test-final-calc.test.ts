import { describe, it } from 'vitest';

const MASK64 = 0xffffffffffffffffn;
const k0 = 0xc3a5c85c97cb3127n;
const k2 = 0x9ae16a3b2f90404fn;

function mask64(x: bigint): bigint {
  return x & MASK64;
}

function shiftMix(val: bigint): bigint {
  return mask64(val ^ (val >> 47n));
}

describe('Test Final Calculation', () => {
  it('should test the final calculation with proper masking', () => {
    const vf = 16661431817790231366n;
    const ws = 5512047834698990023n;
    const wf = 3369773094430344666n;
    const vs = 2811077012040888049n;
    
    console.log(`vf = ${vf}`);
    console.log(`ws = ${ws}`);
    console.log(`wf = ${wf}`);
    console.log(`vs = ${vs}`);
    
    // Test with proper masking of additions
    const vf_plus_ws = mask64(vf + ws);
    const wf_plus_vs = mask64(wf + vs);
    
    console.log(`mask64(vf + ws) = ${vf_plus_ws}`);
    console.log(`mask64(wf + vs) = ${wf_plus_vs}`);
    console.log(`Expected from C: vf + ws = 3726735578779669773`);
    console.log(`Expected from C: wf + vs = 6180850106471232715`);
    
    const term1 = mask64(vf_plus_ws * k2);
    const term2 = mask64(wf_plus_vs * k0);
    console.log(`mask64(vf_plus_ws * k2) = ${term1}`);
    console.log(`mask64(wf_plus_vs * k0) = ${term2}`);
    
    const r = shiftMix(mask64(term1 + term2));
    console.log(`r = shiftMix(mask64(term1 + term2)) = ${r}`);
    
    const final = mask64(mask64(r * k0 + vs) * k2);
    console.log(`final = mask64(mask64(r * k0 + vs) * k2) = ${final}`);
    
    console.log(`Expected from C: 3547079698608021120`);
    console.log(`Match: ${final === 3547079698608021120n}`);
  });
});