// CityHash64 TypeScript Implementation
// Based on Google's CityHash algorithm by Geoff Pike and Jyrki Alakuijala
// https://github.com/google/cityhash

// Constants used by CityHash64
const k0 = 0xc3a5c85c97cb3127n;
const k1 = 0xb492b66fbe98f273n;
const k2 = 0x9ae16a3b2f90404fn;
const k3 = 0xc949d7c7509e6557n;
const MASK64 = 0xffffffffffffffffn;

interface Uint128 {
  first: bigint;
  second: bigint;
}

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

function rotateByAtLeast1(val: bigint, shift: number): bigint {
  val = val & MASK64;
  return ((val >> BigInt(shift)) | (val << BigInt(64 - shift))) & MASK64;
}

function shiftMix(val: bigint): bigint {
  return mask64(val ^ (val >> 47n));
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

function fetch32(data: Uint8Array, offset = 0): bigint {
  let result = 0n;
  for (let i = 0; i < 4; i++) {
    if (offset + i < data.length) {
      result |= BigInt(data[offset + i]) << BigInt(i * 8);
    }
  }
  return result & 0xffffffffn;
}

function hash128to64(x: Uint128): bigint {
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

function hashLen0to16(s: Uint8Array): bigint {
  const len = s.length;
  if (len > 8) {
    const a = fetch64(s);
    const b = fetch64(s, len - 8);
    return (hashLen16(a, rotateByAtLeast1((b + BigInt(len)) & MASK64, len)) ^ b) & MASK64;
  }
  if (len >= 4) {
    const a = fetch32(s);
    return hashLen16((BigInt(len) + (a << 3n)) & MASK64, fetch32(s, len - 4));
  }
  if (len > 0) {
    const a = BigInt(s[0]);
    const b = BigInt(s[len >> 1]);
    const c = BigInt(s[len - 1]);
    const y = mask64(a + (b << 8n));
    const z = mask64(BigInt(len) + (c << 2n));
    return mask64(shiftMix(mask64(y * k2) ^ mask64(z * k3)) * k2);
  }
  return k2;
}

function hashLen17to32(s: Uint8Array): bigint {
  const len = s.length;
  const a = mask64(fetch64(s) * k1);
  const b = fetch64(s, 8);
  const c = mask64(fetch64(s, len - 8) * k2);
  const d = mask64(fetch64(s, len - 16) * k0);
  return hashLen16(
    mask64(rotate(mask64(a - b), 43) + rotate(c, 30) + d),
    mask64(a + rotate(b ^ k3, 20) - c + BigInt(len))
  );
}

function weakHashLen32WithSeeds(
  w: bigint, x: bigint, y: bigint, z: bigint, a: bigint, b: bigint
): Uint128 {
  a = mask64(a + w);
  b = rotate(mask64(b + a + z), 21);
  const c = a;
  a = mask64(a + x);
  a = mask64(a + y);
  b = mask64(b + rotate(a, 44));
  return { first: mask64(a + z), second: mask64(b + c) };
}

function weakHashLen32WithSeedsFromArray(s: Uint8Array, offset: number, a: bigint, b: bigint): Uint128 {
  return weakHashLen32WithSeeds(
    fetch64(s, offset),
    fetch64(s, offset + 8),
    fetch64(s, offset + 16),
    fetch64(s, offset + 24),
    a,
    b
  );
}

function hashLen33to64(s: Uint8Array): bigint {
  const len = s.length;
  const z = fetch64(s, 24);
  let a = mask64(fetch64(s) + mask64((BigInt(len) + fetch64(s, len - 16)) * k0));
  let b = rotate(mask64(a + z), 52);
  let c = rotate(a, 37);
  a = mask64(a + fetch64(s, 8));
  c = mask64(c + rotate(a, 7));
  a = mask64(a + fetch64(s, 16));
  const vf = mask64(a + z);
  const vs = mask64(b + rotate(a, 31) + c);
  a = mask64(fetch64(s, 16) + fetch64(s, len - 32));
  const z2 = fetch64(s, len - 8);
  b = rotate(mask64(a + z2), 52);
  c = rotate(a, 37);
  a = mask64(a + fetch64(s, len - 24));
  c = mask64(c + rotate(a, 7));
  a = mask64(a + fetch64(s, len - 16));
  const wf = mask64(a + z2);
  const ws = mask64(b + rotate(a, 31) + c);
  const r = shiftMix(mask64(mask64(vf + ws) * k2 + mask64(wf + vs) * k0));
  return mask64(shiftMix(mask64(r * k0 + vs)) * k2);
}

/**
 * CityHash64 - Fast, non-cryptographic hash function
 * 
 * Computes a 64-bit hash of the input data using Google's CityHash algorithm.
 * This is a fast, high-quality hash function suitable for hash tables and 
 * other non-cryptographic uses.
 * 
 * @param input - The data to hash (string or Uint8Array)
 * @returns A 64-bit hash value as a BigInt
 * 
 * @example
 * ```typescript
 * import { cityHash64 } from '@anglinb/city-hash';
 * 
 * // Hash a string
 * const hash1 = cityHash64("hello world");
 * console.log(hash1); // 12386028635079221413n
 * 
 * // Hash binary data
 * const data = new Uint8Array([1, 2, 3, 4, 5]);
 * const hash2 = cityHash64(data);
 * ```
 */
export function cityHash64(input: string | Uint8Array): bigint {
  let data: Uint8Array;
  if (typeof input === 'string') {
    data = new TextEncoder().encode(input);
  } else {
    data = input;
  }

  const len = data.length;

  if (len <= 32) {
    if (len <= 16) {
      return hashLen0to16(data);
    } else {
      return hashLen17to32(data);
    }
  } else if (len <= 64) {
    return hashLen33to64(data);
  }

  // For strings over 64 bytes we hash the end first, and then as we
  // loop we keep 56 bytes of state: v, w, x, y, and z.
  let x = fetch64(data);
  let y = mask64(fetch64(data, len - 16) ^ k1);
  let z = mask64(fetch64(data, len - 56) ^ k0);
  let v = weakHashLen32WithSeedsFromArray(data, len - 64, BigInt(len), y);
  let w = weakHashLen32WithSeedsFromArray(data, len - 32, mask64(BigInt(len) * k1), k0);
  z = mask64(z + shiftMix(v.second) * k1);
  x = mask64(rotate(mask64(z + x), 39) * k1);
  y = mask64(rotate(y, 33) * k1);

  // Decrease len to the nearest multiple of 64, and operate on 64-byte chunks.
  let currentLen = (len - 1) & ~63;
  let offset = 0;
  while (currentLen > 0) {
    x = mask64(rotate(mask64(x + y + v.first + fetch64(data, offset + 16)), 37) * k1);
    y = mask64(rotate(mask64(y + v.second + fetch64(data, offset + 48)), 42) * k1);
    x ^= w.second;
    y ^= v.first;
    z = rotate(z ^ w.first, 33);
    v = weakHashLen32WithSeedsFromArray(data, offset, mask64(v.second * k1), mask64(x + w.first));
    w = weakHashLen32WithSeedsFromArray(data, offset + 32, mask64(z + w.second), y);
    [z, x] = [x, z]; // swap
    offset += 64;
    currentLen -= 64;
  }
  return hashLen16(
    hashLen16(v.first, w.first) + mask64(shiftMix(y) * k1) + z,
    hashLen16(v.second, w.second) + x
  );
}

/**
 * CityHash64 truncated to JavaScript's MAX_SAFE_INTEGER
 * 
 * Takes the output of cityHash64 and truncates it to fit within JavaScript's
 * Number.MAX_SAFE_INTEGER (2^53 - 1). This is done by masking off the higher
 * bits, which can be easily reproduced in other systems like ClickHouse.
 * 
 * @param input - The data to hash (string or Uint8Array)
 * @returns A hash value as a number, guaranteed to be <= Number.MAX_SAFE_INTEGER
 * 
 * @example
 * ```typescript
 * import { cityHash64NumMax } from '@anglinb/city-hash';
 * 
 * // Hash a string
 * const hash1 = cityHash64NumMax("hello world");
 * console.log(hash1); // A safe integer
 * 
 * // Reproduce in ClickHouse/SQL:
 * // SELECT cityHash64('hello world') & 0x1FFFFFFFFFFFFF
 * ```
 */
export function cityHash64NumMax(input: string | Uint8Array): number {
  const hash = cityHash64(input);
  // JavaScript's MAX_SAFE_INTEGER is 2^53 - 1 = 0x1FFFFFFFFFFFFF
  const truncated = hash & 0x1FFFFFFFFFFFFFn;
  return Number(truncated);
}