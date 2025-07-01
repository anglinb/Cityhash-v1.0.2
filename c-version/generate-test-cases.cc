#include <iostream>
#include <string>
#include <vector>
#include <iomanip>
#include "city.h"

using namespace CityHash_v1_0_2;

int main() {
    std::vector<std::string> testCases;
    
    // Empty string
    testCases.push_back("");
    
    // Single characters (including special ones)
    testCases.push_back("a");
    testCases.push_back("0");
    testCases.push_back("!");
    testCases.push_back("@");
    testCases.push_back("#");
    testCases.push_back("$");
    testCases.push_back("%");
    testCases.push_back("^");
    testCases.push_back("&");
    testCases.push_back("*");
    testCases.push_back("(");
    testCases.push_back(")");
    testCases.push_back("\n");
    testCases.push_back("\t");
    testCases.push_back(" ");
    
    // Very short strings (2-3 chars)
    testCases.push_back("ab");
    testCases.push_back("01");
    testCases.push_back("!@");
    testCases.push_back("abc");
    testCases.push_back("123");
    testCases.push_back("!@#");
    testCases.push_back("a1!");
    testCases.push_back("   ");
    testCases.push_back("\n\t ");
    
    // Short strings (4-8 chars)
    testCases.push_back("test");
    testCases.push_back("hello");
    testCases.push_back("world");
    testCases.push_back("1234567");
    testCases.push_back("abcdefgh");
    testCases.push_back("!@#$%^&*");
    testCases.push_back("Test123!");
    testCases.push_back("        ");
    
    // Medium strings (9-16 chars)
    testCases.push_back("hello world");
    testCases.push_back("0123456789");
    testCases.push_back("abcdefghijklmnop");
    testCases.push_back("!@#$%^&*()_+-=[]");
    testCases.push_back("Hello, World!");
    testCases.push_back("Test String 123");
    testCases.push_back("Mixed!@#123abc");
    
    // Longer strings (17-32 chars)
    testCases.push_back("This is a test string");
    testCases.push_back("abcdefghijklmnopqrstuvwxyz");
    testCases.push_back("0123456789!@#$%^&*()_+-=[]{}");
    testCases.push_back("The quick brown fox jumps");
    testCases.push_back("!@#$%^&*()_+-=[]{}|;':\",./<>?");
    testCases.push_back("MixedCaseStringWith123Numbers!");
    
    // Strings around 33-64 bytes
    testCases.push_back("This is a longer test string that should trigger the 33-64 byte path");
    testCases.push_back("The quick brown fox jumps over the lazy dog and runs away fast");
    testCases.push_back("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@");
    testCases.push_back("!@#$%^&*()_+-=[]{}|;':\",./<>?`~0123456789abcdefghijklmnopqr");
    
    // Very long strings (65+ bytes, triggers main loop)
    testCases.push_back("This is a very long test string that should definitely trigger the main loop path in the CityHash64 algorithm");
    testCases.push_back("The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog again and again.");
    testCases.push_back("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;':\",./<>?`~0123456789");
    testCases.push_back("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
    testCases.push_back("!@#$%^&*()_+-=[]{}|;':\",./<>?`~!@#$%^&*()_+-=[]{}|;':\",./<>?`~!@#$%^&*()_+-=[]{}|;':\",./<>?`~!@#$%^&*()_+-=[]{}|;':\",./<>?`~");
    
    // Repeated patterns
    testCases.push_back("aaaaaaaaaa");
    testCases.push_back("ababababababab");
    testCases.push_back("123123123123123");
    testCases.push_back("abcabcabcabcabcabc");
    testCases.push_back("testesttestesttestesttest");
    
    // Unicode-like and special byte sequences
    testCases.push_back("\x01\x02\x03\x04\x05");
    testCases.push_back("\xFF\xFE\xFD\xFC");
    testCases.push_back("\x00\x01\x02\x03\x04\x05\x06\x07");
    testCases.push_back("\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89");
    
    // Mixed content
    testCases.push_back("Hello\nWorld\tTest");
    testCases.push_back("Line1\nLine2\nLine3");
    testCases.push_back("Tab\tSeparated\tValues");
    testCases.push_back("Spaces  And   Tabs\t\tMixed");
    
    // JSON-like strings
    testCases.push_back("{\"key\":\"value\"}");
    testCases.push_back("[1,2,3,4,5]");
    testCases.push_back("{\"name\":\"test\",\"value\":123}");
    
    // Path-like strings
    testCases.push_back("/path/to/file.txt");
    testCases.push_back("C:\\Windows\\System32\\file.exe");
    testCases.push_back("../../../etc/passwd");
    
    // URL-like strings
    testCases.push_back("https://example.com/path?param=value");
    testCases.push_back("http://user:pass@host.com:8080/path");
    testCases.push_back("ftp://files.example.com/folder/file.zip");
    
    // Email-like strings
    testCases.push_back("user@example.com");
    testCases.push_back("test.email+tag@domain.co.uk");
    
    // Very long repeated strings
    testCases.push_back(std::string(100, 'a'));
    testCases.push_back(std::string(200, 'x'));
    testCases.push_back(std::string(500, '1'));
    
    // Long mixed content
    std::string longMixed = "";
    for (int i = 0; i < 150; i++) {
        longMixed += char('a' + (i % 26));
        if (i % 10 == 9) longMixed += std::to_string(i);
        if (i % 20 == 19) longMixed += "!@#";
    }
    testCases.push_back(longMixed);
    
    // Binary-like data
    std::string binaryData = "";
    for (int i = 0; i < 100; i++) {
        binaryData += char(i % 256);
    }
    testCases.push_back(binaryData);
    
    // Random patterns
    testCases.push_back("aB3#xY9@mN2$qR8%tU5^wE1&");
    testCases.push_back("ZzYyXxWwVvUuTtSsRrQqPpOoNnMmLlKkJjIiHhGgFfEeDdCcBbAa");
    testCases.push_back("13579!@#$%24680^&*()_+-=");
    
    // Ensure we have exactly 100 test cases
    while (testCases.size() < 100) {
        std::string extra = "extra_test_case_" + std::to_string(testCases.size());
        testCases.push_back(extra);
    }
    
    // Truncate to exactly 100 if we have more
    if (testCases.size() > 100) {
        testCases.resize(100);
    }
    
    std::cout << "// Generated 100 test cases for CityHash64 verification" << std::endl;
    std::cout << "const testCases100 = [" << std::endl;
    
    for (size_t i = 0; i < testCases.size(); i++) {
        const std::string& testCase = testCases[i];
        uint64 result = CityHash64(testCase.c_str(), testCase.length());
        
        std::cout << "  { input: ";
        
        // Escape the string for TypeScript
        std::cout << "\"";
        for (char c : testCase) {
            if (c == '"') {
                std::cout << "\\\"";
            } else if (c == '\\') {
                std::cout << "\\\\";
            } else if (c == '\n') {
                std::cout << "\\n";
            } else if (c == '\t') {
                std::cout << "\\t";
            } else if (c == '\r') {
                std::cout << "\\r";
            } else if ((unsigned char)c < 32 || (unsigned char)c > 126) {
                std::cout << "\\x" << std::hex << std::setfill('0') << std::setw(2) << (unsigned int)(unsigned char)c << std::dec;
            } else {
                std::cout << c;
            }
        }
        std::cout << "\"";
        
        std::cout << ", expected: " << result << "n, description: \"";
        
        // Add description
        if (testCase.empty()) {
            std::cout << "empty string";
        } else if (testCase.length() == 1) {
            std::cout << "single char";
        } else if (testCase.length() <= 4) {
            std::cout << "very short (" << testCase.length() << " chars)";
        } else if (testCase.length() <= 16) {
            std::cout << "short (" << testCase.length() << " chars)";
        } else if (testCase.length() <= 32) {
            std::cout << "medium (" << testCase.length() << " chars)";
        } else if (testCase.length() <= 64) {
            std::cout << "long (" << testCase.length() << " chars)";
        } else {
            std::cout << "very long (" << testCase.length() << " chars)";
        }
        std::cout << "\" }";
        
        if (i < testCases.size() - 1) {
            std::cout << ",";
        }
        std::cout << std::endl;
    }
    
    std::cout << "];" << std::endl;
    
    return 0;
}