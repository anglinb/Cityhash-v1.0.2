import { cityHash64 } from './cityhash.js';

console.log('Testing simple cases...');

try {
  console.log('Empty string:', cityHash64(''));
  console.log('Single char:', cityHash64('a'));
  console.log('Short string:', cityHash64('hello'));
  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Error during testing:', error);
}