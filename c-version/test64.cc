#include <iostream>
#include <string>
#include "city.h"

using namespace CityHash_v1_0_2;

int main() {
    // Test some simple strings
    std::string tests[] = {
        "",
        "a", 
        "abc",
        "hello",
        "hello world"
    };
    
    for (const auto& test : tests) {
        uint64 result = CityHash64(test.c_str(), test.length());
        std::cout << "\"" << test << "\" -> " << result << std::endl;
    }
    
    return 0;
}