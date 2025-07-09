# @anglinb/city-hash

A TypeScript implementation of Google's CityHash64 algorithm - a fast, non-cryptographic hash function.

## Installation

```bash
npm install @anglinb/city-hash
```

## Usage

```typescript
import { cityHash64, cityHash64NumMax } from '@anglinb/city-hash';

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

// Get a JavaScript-safe number (truncated to 53 bits)
const safeHash = cityHash64NumMax("hello world");
console.log(safeHash); // 1129659810357413 (safe JavaScript number)
```

## API

### `cityHash64(input: string | Uint8Array): bigint`

Computes a 64-bit hash of the input data using Google's CityHash algorithm.

**Parameters:**
- `input`: The data to hash. Can be either a string or a `Uint8Array`.

**Returns:**
- A 64-bit hash value as a `BigInt`.

### `cityHash64NumMax(input: string | Uint8Array): number`

Computes a CityHash64 hash truncated to JavaScript's `Number.MAX_SAFE_INTEGER` (53 bits).

**Parameters:**
- `input`: The data to hash. Can be either a string or a `Uint8Array`.

**Returns:**
- A hash value as a JavaScript `number`, guaranteed to be ≤ `Number.MAX_SAFE_INTEGER`.

This function is useful when you need to work with hash values in JavaScript contexts that require regular numbers instead of BigInts, such as JSON serialization or certain database operations.

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

## ClickHouse Integration

The `cityHash64NumMax` function is designed to be compatible with ClickHouse database operations. Here's how to reproduce the same truncated hash values in ClickHouse:

### Direct SQL Query

```sql
-- Get the same result as cityHash64NumMax("hello world")
SELECT bitAnd(cityHash64('hello world'), 0x1FFFFFFFFFFFFF);
-- Result: 1129659810357413
```

### Create a ClickHouse Function

You can create a user-defined function in ClickHouse to match `cityHash64NumMax`:

```sql
-- Create a function that matches cityHash64NumMax
CREATE FUNCTION cityHash64NumMax AS (input) -> bitAnd(cityHash64(input), 0x1FFFFFFFFFFFFF);

-- Usage examples
SELECT cityHash64NumMax('hello world');           -- 1129659810357413
SELECT cityHash64NumMax('test string');           -- 7852960286803079
SELECT cityHash64NumMax('another example');       -- 6487172654247519
```

### Use in Table Operations

```sql
-- Create a table with a hash column
CREATE TABLE user_events (
    user_id String,
    event_data String,
    hash_value UInt64 MATERIALIZED cityHash64NumMax(event_data)
) ENGINE = MergeTree()
ORDER BY user_id;

-- Insert data (hash_value will be automatically calculated)
INSERT INTO user_events (user_id, event_data) VALUES 
    ('user1', 'login'),
    ('user2', 'purchase'),
    ('user1', 'logout');

-- Query using the hash
SELECT * FROM user_events WHERE hash_value = cityHash64NumMax('login');
```

### Consistency Verification

You can verify that your JavaScript and ClickHouse implementations produce identical results:

```typescript
// JavaScript
import { cityHash64NumMax } from '@anglinb/city-hash';
const jsResult = cityHash64NumMax('test input');
console.log(jsResult); // e.g., 1234567890123
```

```sql
-- ClickHouse
SELECT bitAnd(cityHash64('test input'), 0x1FFFFFFFFFFFFF);
-- Should return the same value: 1234567890123
```

## Performance

CityHash is designed to be fast on modern processors. This TypeScript implementation maintains good performance while providing the safety and convenience of TypeScript.

## License

MIT

## Credits

Based on the original CityHash algorithm by Geoff Pike and Jyrki Alakuijala at Google.
- Original C implementation: https://github.com/google/cityhash
- Algorithm paper: https://github.com/google/cityhash
