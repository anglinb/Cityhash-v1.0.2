#include <iostream>
#include <string>
#include "city.h"

using namespace CityHash_v1_0_2;

int main() {
    // Test what the C program actually tested - literal backslash strings
    std::string test1 = "\\xff\\xfe\\xfd\\xfc";
    std::string test2 = "\\x80\\x81\\x82\\x83\\x84\\x85\\x86\\x87\\x88\\x89";
    
    std::cout << "=== Literal backslash strings ===" << std::endl;
    std::cout << "test1: \"" << test1 << "\" (length=" << test1.length() << ")" << std::endl;
    std::cout << "test1 result: " << CityHash64(test1.c_str(), test1.length()) << std::endl;
    
    std::cout << "test2: \"" << test2 << "\" (length=" << test2.length() << ")" << std::endl;
    std::cout << "test2 result: " << CityHash64(test2.c_str(), test2.length()) << std::endl;
    
    std::cout << std::endl;
    
    // Test actual binary data
    char binary1[] = {'\xff', '\xfe', '\xfd', '\xfc', '\0'};
    char binary2[] = {'\x80', '\x81', '\x82', '\x83', '\x84', '\x85', '\x86', '\x87', '\x88', '\x89', '\0'};
    
    std::cout << "=== Actual binary data ===" << std::endl;
    std::cout << "binary1 length: " << strlen(binary1) << std::endl;
    std::cout << "binary1 result: " << CityHash64(binary1, 4) << std::endl;
    
    std::cout << "binary2 length: " << strlen(binary2) << std::endl;
    std::cout << "binary2 result: " << CityHash64(binary2, 10) << std::endl;
    
    return 0;
}