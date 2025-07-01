import { describe, it, expect } from 'vitest';
import { cityHash64 } from './cityhash';

// Import the correct test data that matches C implementation
import { testCases100 } from './test-cases-100';
import { binaryTestCases } from './binary-test-cases';

// Keep this for backup reference of old wrong data
const oldTestCases100 = [
  { input: "", expected: 11160318154034397263n, description: "empty string" },
  { input: "a", expected: 2603192927274642682n, description: "single char" },
  { input: "0", expected: 10408321403207385874n, description: "single char" },
  { input: "!", expected: 673627790127086010n, description: "single char" },
  { input: "@", expected: 18259459913109657050n, description: "single char" },
  { input: "#", expected: 9619561608535196802n, description: "single char" },
  { input: "$", expected: 17420302802669967541n, description: "single char" },
  { input: "%", expected: 8862613152689096224n, description: "single char" },
  { input: "^", expected: 7088919118088809251n, description: "single char" },
  { input: "&", expected: 16335076501581073021n, description: "single char" },
  { input: "*", expected: 3699801200241774939n, description: "single char" },
  { input: "(", expected: 262986500618923875n, description: "single char" },
  { input: ")", expected: 13827064807422042018n, description: "single char" },
  { input: "\n", expected: 10599700700371220778n, description: "single char" },
  { input: "\t", expected: 12478783090956271283n, description: "single char" },
  { input: " ", expected: 14535776232712007899n, description: "single char" },
  { input: "ab", expected: 1725057946192985918n, description: "very short (2 chars)" },
  { input: "01", expected: 10729262491330949055n, description: "very short (2 chars)" },
  { input: "!@", expected: 16598862897671254435n, description: "very short (2 chars)" },
  { input: "abc", expected: 4220206313085259313n, description: "very short (3 chars)" },
  { input: "123", expected: 11844464045149276331n, description: "very short (3 chars)" },
  { input: "!@#", expected: 764451087854328061n, description: "very short (3 chars)" },
  { input: "a1!", expected: 10401333081023520526n, description: "very short (3 chars)" },
  { input: "   ", expected: 14058465113495877698n, description: "very short (3 chars)" },
  { input: "\n\t ", expected: 143201813009191803n, description: "very short (3 chars)" },
  { input: "test", expected: 17703940110308125106n, description: "very short (4 chars)" },
  { input: "hello", expected: 2578220239953316063n, description: "short (5 chars)" },
  { input: "world", expected: 3839149080076100810n, description: "short (5 chars)" },
  { input: "1234567", expected: 5695750988907513070n, description: "short (7 chars)" },
  { input: "abcdefgh", expected: 2314080607849552063n, description: "short (8 chars)" },
  { input: "!@#$%^&*", expected: 3252082734999318783n, description: "short (8 chars)" },
  { input: "Test123!", expected: 13600859892779135804n, description: "short (8 chars)" },
  { input: "        ", expected: 7380468739303570020n, description: "short (8 chars)" },
  { input: "hello world", expected: 12386028635079221413n, description: "short (11 chars)" },
  { input: "0123456789", expected: 2334138125607539021n, description: "short (10 chars)" },
  { input: "abcdefghijklmnop", expected: 11998480024807774423n, description: "short (16 chars)" },
  { input: "!@#$%^&*()_+-=[]", expected: 7425666005932313292n, description: "short (16 chars)" },
  { input: "Hello, World!", expected: 4652373240932897769n, description: "short (13 chars)" },
  { input: "Test String 123", expected: 8671968624386507306n, description: "short (15 chars)" },
  { input: "Mixed!@#123abc", expected: 4451880969455194244n, description: "short (14 chars)" },
  { input: "This is a test string", expected: 3430506936926796457n, description: "medium (21 chars)" },
  { input: "abcdefghijklmnopqrstuvwxyz", expected: 6426495785700406421n, description: "medium (26 chars)" },
  { input: "0123456789!@#$%^&*()_+-=[]{}", expected: 2014009693169179532n, description: "medium (28 chars)" },
  { input: "The quick brown fox jumps", expected: 13338779149047830914n, description: "medium (25 chars)" },
  { input: "!@#$%^&*()_+-=[]{}|;':\",./<>?", expected: 5949653962449163969n, description: "medium (29 chars)" },
  { input: "MixedCaseStringWith123Numbers!", expected: 12825624325401962568n, description: "medium (31 chars)" },
  { input: "This is a longer test string that should trigger the 33-64 byte path", expected: 14695322212679848899n, description: "long (69 chars)" },
  { input: "The quick brown fox jumps over the lazy dog and runs away fast", expected: 9033215439299251951n, description: "long (63 chars)" },
  { input: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@", expected: 12455268364009738071n, description: "long (64 chars)" },
  { input: "!@#$%^&*()_+-=[]{}|;':\",./<>?`~0123456789abcdefghijklmnopqr", expected: 8569954278772568142n, description: "long (58 chars)" },
  { input: "This is a very long test string that should definitely trigger the main loop path in the CityHash64 algorithm", expected: 14746623612639103862n, description: "very long (113 chars)" },
  { input: "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog again and again.", expected: 11419669606433653395n, description: "very long (107 chars)" },
  { input: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;':\",./<>?`~0123456789", expected: 12043949780794193734n, description: "very long (110 chars)" },
  { input: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", expected: 9159023040774324983n, description: "very long (123 chars)" },
  { input: "!@#$%^&*()_+-=[]{}|;':\",./<>?`~!@#$%^&*()_+-=[]{}|;':\",./<>?`~!@#$%^&*()_+-=[]{}|;':\",./<>?`~!@#$%^&*()_+-=[]{}|;':\",./<>?`~", expected: 3717346983919411298n, description: "very long (128 chars)" },
  { input: "aaaaaaaaaa", expected: 1823813893830359635n, description: "short (10 chars)" },
  { input: "ababababababab", expected: 655618838164863951n, description: "short (14 chars)" },
  { input: "123123123123123", expected: 7654959827344896035n, description: "short (15 chars)" },
  { input: "abcabcabcabcabcabc", expected: 11701008428503757090n, description: "short (18 chars)" },
  { input: "testesttestesttestesttest", expected: 6746978006202963764n, description: "medium (25 chars)" },
  { input: "\x01\x02\x03\x04\x05", expected: 11395127670797306619n, description: "short (5 chars)" },
  { input: "\xff\xfe\xfd\xfc", expected: 15607542119153298195n, description: "very short (4 chars)" },
  { input: "\x00\x01\x02\x03\x04\x05\x06\x07", expected: 4080768671459097843n, description: "short (8 chars)" },
  { input: "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89", expected: 14568678139618536996n, description: "short (10 chars)" },
  { input: "Hello\nWorld\tTest", expected: 4406968847481720096n, description: "short (16 chars)" },
  { input: "Line1\nLine2\nLine3", expected: 12901711816778976055n, description: "short (17 chars)" },
  { input: "Tab\tSeparated\tValues", expected: 1844253969051892411n, description: "medium (21 chars)" },
  { input: "Spaces  And   Tabs\t\tMixed", expected: 9090988693877399956n, description: "medium (26 chars)" },
  { input: "{\"key\":\"value\"}", expected: 3686651564399945516n, description: "short (15 chars)" },
  { input: "[1,2,3,4,5]", expected: 1075134727316063570n, description: "short (11 chars)" },
  { input: "{\"name\":\"test\",\"value\":123}", expected: 2992077522079550726n, description: "medium (27 chars)" },
  { input: "/path/to/file.txt", expected: 10159099983688639242n, description: "short (17 chars)" },
  { input: "C:\\Windows\\System32\\file.exe", expected: 8506547669737899823n, description: "medium (29 chars)" },
  { input: "../../../etc/passwd", expected: 6302838734919671242n, description: "short (19 chars)" },
  { input: "https://example.com/path?param=value", expected: 3616431056536726976n, description: "long (36 chars)" },
  { input: "http://user:pass@host.com:8080/path", expected: 15411764423468154158n, description: "long (35 chars)" },
  { input: "ftp://files.example.com/folder/file.zip", expected: 15024936871127746945n, description: "long (39 chars)" },
  { input: "user@example.com", expected: 14925162885334507300n, description: "short (16 chars)" },
  { input: "test.email+tag@domain.co.uk", expected: 14093455133139686037n, description: "medium (28 chars)" },
  { input: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", expected: 14963153923993267031n, description: "very long (100 chars)" },
  { input: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", expected: 13894302336955433444n, description: "very long (200 chars)" },
  { input: "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111", expected: 16766086572459424892n, description: "very long (500 chars)" },
  { input: "abcdefghijklmnopqrstuvwxyz0abcdefghijklmnopqrstuvwxyz10!@#abcdefghijklmnopqrstuvwxyz20!@#abcdefghijklmnopqrstuvwxyz30!@#abcdefghijklmnopqrstuvwxyz40!@#abcdefghijklmnopqr", expected: 17093849473153734970n, description: "very long (175 chars)" },
  { input: "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7f\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x8b\x8c\x8d\x8e\x8f\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9a\x9b\x9c\x9d\x9e\x9f\xa0\xa1\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xab\xac\xad\xae\xaf\xb0\xb1\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xbb\xbc\xbd\xbe\xbf\xc0\xc1\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xcb\xcc\xcd\xce\xcf\xd0\xd1\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xdb\xdc\xdd\xde\xdf\xe0\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xeb\xec\xed\xee\xef\xf0\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xfb\xfc\xfd\xfe\xff", expected: 16715412977039066838n, description: "very long (256 chars)" },
  { input: "aB3#xY9@mN2$qR8%tU5^wE1&", expected: 6885468459470896012n, description: "medium (25 chars)" },
  { input: "ZzYyXxWwVvUuTtSsRrQqPpOoNnMmLlKkJjIiHhGgFfEeDdCcBbAa", expected: 17089945709001652077n, description: "long (52 chars)" },
  { input: "13579!@#$%24680^&*()_+-=", expected: 13414700168996439055n, description: "medium (25 chars)" },
  { input: "extra_test_case_87", expected: 8639302070825851533n, description: "short (18 chars)" },
  { input: "extra_test_case_88", expected: 10951899031540306493n, description: "short (18 chars)" },
  { input: "extra_test_case_89", expected: 13264495992254761453n, description: "short (18 chars)" },
  { input: "extra_test_case_90", expected: 15577092952969216413n, description: "short (18 chars)" },
  { input: "extra_test_case_91", expected: 17889689913683671373n, description: "short (18 chars)" },
  { input: "extra_test_case_92", expected: 1830530857698125845n, description: "short (18 chars)" },
  { input: "extra_test_case_93", expected: 4143127818412580805n, description: "short (18 chars)" },
  { input: "extra_test_case_94", expected: 6455724779127035765n, description: "short (18 chars)" },
  { input: "extra_test_case_95", expected: 8768321739841490725n, description: "short (18 chars)" },
  { input: "extra_test_case_96", expected: 11080918700555945685n, description: "short (18 chars)" },
  { input: "extra_test_case_97", expected: 13393515661270400645n, description: "short (18 chars)" },
  { input: "extra_test_case_98", expected: 15706112621984855605n, description: "short (18 chars)" },
  { input: "extra_test_case_99", expected: 18018709582699310565n, description: "short (18 chars)" }
];

describe('CityHash64 Comprehensive Test Cases Verification', () => {
  testCases100.forEach((testCase, index) => {
    it(`should match C implementation for test case ${index + 1}: ${testCase.description}`, () => {
      const result = cityHash64(testCase.input);
      expect(result).toBe(testCase.expected);
    });
  });

  it('should handle all test cases correctly', () => {
    let passed = 0;
    let failed = 0;
    
    for (const testCase of testCases100) {
      const result = cityHash64(testCase.input);
      if (result === testCase.expected) {
        passed++;
      } else {
        failed++;
        console.log(`FAIL: "${testCase.input}" (${testCase.description})`);
        console.log(`  Expected: ${testCase.expected}`);
        console.log(`  Got:      ${result}`);
      }
    }
    
    console.log(`${testCases100.length} test cases: ${passed} passed, ${failed} failed`);
    expect(failed).toBe(0);
    expect(passed).toBe(testCases100.length);
  });

  it('should handle edge cases correctly', () => {
    // Test some specific edge cases from our 100 test suite
    const edgeCases = [
      testCases100.find(t => t.input === ""), // empty string
      testCases100.find(t => t.input === "\x00\x01\x02\x03\x04\x05\x06\x07"), // binary data
      testCases100.find(t => t.input.length === 500), // very long string
      testCases100.find(t => t.input.includes('\n')), // newlines
      testCases100.find(t => t.input.includes('\t')), // tabs
    ].filter(Boolean);

    for (const testCase of edgeCases) {
      const result = cityHash64(testCase!.input);
      expect(result).toBe(testCase!.expected);
    }
  });

  it('should demonstrate different path coverage', () => {
    // Group test cases by expected path in the algorithm
    const pathGroups = {
      'len0to16_empty': testCases100.filter(t => t.input.length === 0),
      'len0to16_short': testCases100.filter(t => t.input.length > 0 && t.input.length <= 16),
      'len17to32': testCases100.filter(t => t.input.length >= 17 && t.input.length <= 32),
      'len33to64': testCases100.filter(t => t.input.length >= 33 && t.input.length <= 64),
      'mainLoop': testCases100.filter(t => t.input.length > 64)
    };

    console.log('Path coverage:');
    for (const [path, cases] of Object.entries(pathGroups)) {
      console.log(`  ${path}: ${cases.length} test cases`);
      expect(cases.length).toBeGreaterThan(0);
    }

    // Verify each path group
    for (const [path, cases] of Object.entries(pathGroups)) {
      for (const testCase of cases) {
        const result = cityHash64(testCase.input);
        expect(result).toBe(testCase.expected);
      }
    }
  });

  // Test binary data cases separately due to UTF-8 encoding issues
  describe('Binary Data Test Cases', () => {
    binaryTestCases.forEach((testCase, index) => {
      it(`should match C implementation for binary case ${index + 1}: ${testCase.description}`, () => {
        const result = cityHash64(testCase.input);
        expect(result).toBe(testCase.expected);
      });
    });
  });
});