# @anglinb/city-hash

A TypeScript implementation of Google's CityHash64 algorithm - a fast, non-cryptographic hash function.

## Installation

```bash
npm install @anglinb/city-hash
```

## Usage

```typescript
import { cityHash64 } from '@anglinb/city-hash';

// Hash a string
const hash1 = cityHash64("hello world");
console.log(hash1); // 12386028635079221413n

// Hash binary data
const data = new Uint8Array([1, 2, 3, 4, 5]);
const hash2 = cityHash64(data);
console.log(hash2); // 8996017160742164057n

// The result is always a BigInt
const hash3 = cityHash64("The quick brown fox jumps over the lazy dog");
console.log(hash3.toString()); // "16697807905646383735"
```

## API

### `cityHash64(input: string | Uint8Array): bigint`

Computes a 64-bit hash of the input data using Google's CityHash algorithm.

**Parameters:**
- `input`: The data to hash. Can be either a string or a `Uint8Array`.

**Returns:**
- A 64-bit hash value as a `BigInt`.

## Features

- **Fast**: Optimized for speed and designed for hash tables
- **High Quality**: Produces well-distributed hash values with low collision rates
- **TypeScript**: Full TypeScript support with proper type definitions
- **Compatible**: Produces identical output to the original C implementation
- **Flexible**: Accepts both strings and binary data (Uint8Array)

## About CityHash

CityHash is a family of hash functions created by Google for use in hash tables and other applications where speed is more important than cryptographic security. CityHash64 specifically produces 64-bit hash values.

This implementation:
- Matches the behavior of the original C implementation exactly
- Handles both string and binary input data
- Uses BigInt for proper 64-bit arithmetic in JavaScript
- Is thoroughly tested with comprehensive test coverage

## Performance

CityHash is designed to be fast on modern processors. This TypeScript implementation maintains good performance while providing the safety and convenience of TypeScript.

## License

MIT

## Credits

Based on the original CityHash algorithm by Geoff Pike and Jyrki Alakuijala at Google.
- Original C implementation: https://github.com/google/cityhash
- Algorithm paper: https://github.com/google/cityhash
