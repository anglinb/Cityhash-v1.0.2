#include <iostream>
#include <string>
#include "city.h"

using namespace CityHash_v1_0_2;

int main() {
    // Generate fresh test cases with the exact strings that are failing
    const char* testStrings[] = {
        "The quick brown fox jumps over the lazy dog and runs away fast", // 63 chars
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@", // 64 chars  
        "!@#$%^&*()_+-=[]{}|;':\",./<>?`~0123456789abcdefghijklmnopqr", // 58 chars
        "\\xff\\xfe\\xfd\\xfc", // 4 chars with escape sequences
        "\\x80\\x81\\x82\\x83\\x84\\x85\\x86\\x87\\x88\\x89", // 10 chars
        "https://example.com/path?param=value", // 36 chars
        "http://user:pass@host.com:8080/path", // 35 chars
        "ftp://files.example.com/folder/file.zip", // 39 chars
        "ZzYyXxWwVvUuTtSsRrQqPpOoNnMmLlKkJjIiHhGgFfEeDdCcBbAa", // 52 chars
    };
    
    std::cout << "// Fresh test cases generated from C implementation" << std::endl;
    
    int numStrings = sizeof(testStrings) / sizeof(testStrings[0]);
    for (int i = 0; i < numStrings; i++) {
        std::string input(testStrings[i]);
        uint64 result = CityHash64(input.c_str(), input.length());
        std::cout << "{ input: \"" << input << "\", expected: " << result << "n, description: \"" 
                  << input.length() << " chars\" }," << std::endl;
    }
    
    return 0;
}