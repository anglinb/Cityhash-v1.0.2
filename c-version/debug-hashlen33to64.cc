#include <iostream>
#include <string>
#include "city.h"

using namespace CityHash_v1_0_2;

// Copy constants from city.cc (these should match what's in the header/implementation)
static const uint64 k0 = 0xc3a5c85c97cb3127ULL;
static const uint64 k1 = 0xb492b66fbe98f273ULL;
static const uint64 k2 = 0x9ae16a3b2f90404fULL;
static const uint64 k3 = 0xc949d7c7509e6557ULL;

// Copy helper functions we need
static uint64 Fetch64(const char *p) {
  return *(const uint64*)p;
}

static uint64 Rotate(uint64 val, int shift) {
  return shift == 0 ? val : ((val >> shift) | (val << (64 - shift)));
}

static uint64 ShiftMix(uint64 val) {
  return val ^ (val >> 47);
}

static uint64 HashLen16(uint64 u, uint64 v) {
  const uint64 kMul = 0x9ddfea08eb382d69ULL;
  uint64 a = (u ^ v) * kMul;
  a ^= (a >> 47);
  uint64 b = (v ^ a) * kMul;
  b ^= (b >> 47);
  b *= kMul;
  return b;
}

void debugHashLen33to64(const char *s, size_t len) {
  std::cout << "=== C hashLen33to64 debug ===" << std::endl;
  std::cout << "len = " << len << std::endl;
  
  uint64 z = Fetch64(s + 24);
  std::cout << "z = Fetch64(s + 24) = " << z << std::endl;
  
  uint64 a = Fetch64(s) + (len + Fetch64(s + len - 16)) * k0;
  std::cout << "a = Fetch64(s) + (len + Fetch64(s + len - 16)) * k0" << std::endl;
  std::cout << "  Fetch64(s + 0) = " << Fetch64(s) << std::endl;
  std::cout << "  Fetch64(s + " << (len - 16) << ") = " << Fetch64(s + len - 16) << std::endl;
  std::cout << "  (" << len << " + " << Fetch64(s + len - 16) << ") * k0 = " << ((len + Fetch64(s + len - 16)) * k0) << std::endl;
  std::cout << "  a = " << a << std::endl;
  
  uint64 b = Rotate(a + z, 52);
  std::cout << "b = Rotate(a + z, 52) = Rotate(" << (a + z) << ", 52) = " << b << std::endl;
  
  uint64 c = Rotate(a, 37);
  std::cout << "c = Rotate(a, 37) = " << c << std::endl;
  
  a += Fetch64(s + 8);
  std::cout << "a += Fetch64(s + 8) = " << a << std::endl;
  
  c += Rotate(a, 7);
  std::cout << "c += Rotate(a, 7) = " << c << std::endl;
  
  a += Fetch64(s + 16);
  std::cout << "a += Fetch64(s + 16) = " << a << std::endl;
  
  uint64 vf = a + z;
  std::cout << "vf = a + z = " << vf << std::endl;
  
  uint64 vs = b + Rotate(a, 31) + c;
  std::cout << "vs = b + Rotate(a, 31) + c = " << vs << std::endl;
  
  a = Fetch64(s + 16) + Fetch64(s + len - 32);
  std::cout << "a = Fetch64(s + 16) + Fetch64(s + " << (len - 32) << ") = " << a << std::endl;
  
  z = Fetch64(s + len - 8);
  std::cout << "z = Fetch64(s + " << (len - 8) << ") = " << z << std::endl;
  
  b = Rotate(a + z, 52);
  std::cout << "b = Rotate(a + z, 52) = " << b << std::endl;
  
  c = Rotate(a, 37);
  std::cout << "c = Rotate(a, 37) = " << c << std::endl;
  
  a += Fetch64(s + len - 24);
  std::cout << "a += Fetch64(s + " << (len - 24) << ") = " << a << std::endl;
  
  c += Rotate(a, 7);
  std::cout << "c += Rotate(a, 7) = " << c << std::endl;
  
  a += Fetch64(s + len - 16);
  std::cout << "a += Fetch64(s + " << (len - 16) << ") = " << a << std::endl;
  
  uint64 wf = a + z;
  std::cout << "wf = a + z = " << wf << std::endl;
  
  uint64 ws = b + Rotate(a, 31) + c;
  std::cout << "ws = b + Rotate(a, 31) + c = " << ws << std::endl;
  
  std::cout << "Inputs to final calculation:" << std::endl;
  std::cout << "  vf = " << vf << ", ws = " << ws << ", vf + ws = " << (vf + ws) << std::endl;
  std::cout << "  wf = " << wf << ", vs = " << vs << ", wf + vs = " << (wf + vs) << std::endl;
  std::cout << "  (vf + ws) * k2 = " << ((vf + ws) * k2) << std::endl;
  std::cout << "  (wf + vs) * k0 = " << ((wf + vs) * k0) << std::endl;
  
  uint64 r = ShiftMix((vf + ws) * k2 + (wf + vs) * k0);
  std::cout << "r = ShiftMix((vf + ws) * k2 + (wf + vs) * k0) = " << r << std::endl;
  
  uint64 result = ShiftMix(r * k0 + vs) * k2;
  std::cout << "result = ShiftMix(r * k0 + vs) * k2 = " << result << std::endl;
}

int main() {
    std::string input = "The quick brown fox jumps over the lazy dog and runs away fast";
    
    std::cout << "Input: \"" << input << "\"" << std::endl;
    std::cout << "Length: " << input.length() << std::endl;
    
    uint64 actual = CityHash64(input.c_str(), input.length());
    std::cout << "Actual CityHash64 result: " << actual << std::endl << std::endl;
    
    debugHashLen33to64(input.c_str(), input.length());
    
    return 0;
}