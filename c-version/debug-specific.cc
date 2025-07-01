#include <iostream>
#include <string>
#include "city.h"

using namespace CityHash_v1_0_2;

void debugCase(const std::string& input) {
    std::cout << "=== Debugging: \"" << input << "\" (len=" << input.length() << ") ===" << std::endl;
    
    uint64 result = CityHash64(input.c_str(), input.length());
    std::cout << "Final result: " << result << std::endl;
    
    // Let's manually trace what should happen for len >= 4 case in hashLen0to16
    if (input.length() >= 4 && input.length() <= 16) {
        std::cout << "Should take hashLen0to16 len >= 4 path:" << std::endl;
        
        // Simulate fetch32(s, 0)
        uint32 a = 0;
        for (int i = 0; i < 4 && i < (int)input.length(); i++) {
            a |= ((uint32)(unsigned char)input[i]) << (i * 8);
        }
        std::cout << "fetch32(s, 0) = " << a << std::endl;
        
        // Simulate fetch32(s, len-4)
        uint32 b = 0;
        int offset = input.length() - 4;
        for (int i = 0; i < 4; i++) {
            if (offset + i >= 0 && offset + i < (int)input.length()) {
                b |= ((uint32)(unsigned char)input[offset + i]) << (i * 8);
            }
        }
        std::cout << "fetch32(s, len-4) = " << b << std::endl;
        
        // Inputs to HashLen16
        uint64 input1 = input.length() + ((uint64)a << 3);
        uint64 input2 = b;
        std::cout << "HashLen16 inputs: " << input1 << ", " << input2 << std::endl;
        
        // Manual HashLen16 calculation
        uint64 kMul = 0x9ddfea08eb382d69ULL;
        uint64 hash_a = (input1 ^ input2) * kMul;
        hash_a ^= (hash_a >> 47);
        uint64 hash_b = (input2 ^ hash_a) * kMul;
        hash_b ^= (hash_b >> 47);
        hash_b *= kMul;
        std::cout << "Manual HashLen16 result: " << hash_b << std::endl;
    }
    
    std::cout << std::endl;
}

int main() {
    debugCase("test");     // len=4, should work
    debugCase("1234567");  // len=7, failing
    debugCase("abcdefgh"); // len=8, failing
    
    return 0;
}