import { describe, expect, it } from "vitest";
import { generateNumberRangeRegex } from "@/lib/GenerateNumberRegex.ts";

// In this codebase `.` in the generated regex stands for "any digit"
// (it gets replaced with `\d` downstream), so mirror that when testing.
const toMatcher = (regex: string) =>
  new RegExp(`^(?:${regex.replace(/\./g, "\\d")})$`);

describe("generateNumberRangeRegex", () => {
  describe("produces compact output", () => {
    const cases: [string, string, string][] = [
      ["23", "27", "2[3-7]"],
      ["20", "29", "2\\d"],
      ["10", "99", "[1-9]\\d"],
      ["15", "42", "(1[5-9]|[2-3]\\d|4[0-2])"],
      ["15", "40", "(1[5-9]|[2-3]\\d|40)"],
      ["19", "30", "(19|2\\d|30)"],
      ["30", "50", "([3-4]\\d|50)"],
      ["30", "59", "[3-5]\\d"],
      ["23", "23", "23"],
      // single-digit ranges
      ["3", "7", "[3-7]"],
      ["5", "5", "5"],
      ["0", "9", "\\d"],
      // ranges spanning single and double digits
      ["5", "20", "([5-9]|1\\d|20)"],
      ["8", "12", "([8-9]|1[0-2])"],
      ["1", "99", "([1-9]|[1-9]\\d)"],
    ];
    it.each(cases)("%s-%s -> %s", (min, max, expected) => {
      expect(generateNumberRangeRegex(min, max, false)).toBe(expected);
    });
  });

  it("matches exactly the integers within the range for every 1-2 digit range", () => {
    for (let lo = 1; lo <= 99; lo++) {
      for (let hi = lo; hi <= 99; hi++) {
        const matcher = toMatcher(
          generateNumberRangeRegex(String(lo), String(hi), false),
        );
        for (let n = 1; n <= 99; n++) {
          expect(matcher.test(String(n))).toBe(n >= lo && n <= hi);
        }
      }
    }
  });

  describe("round10 floors both bounds to the nearest ten", () => {
    it("floors min and max before building the range", () => {
      expect(generateNumberRangeRegex("25", "48", true)).toBe("([2-3]\\d|40)");
    });
    it("collapses to a single value when both round to the same ten", () => {
      expect(generateNumberRangeRegex("25", "29", true)).toBe("20");
    });
  });

  describe("ignores non-digit characters in the input", () => {
    it("parses values out of surrounding text", () => {
      expect(generateNumberRangeRegex("+23%", "27", false)).toBe("2[3-7]");
    });
  });

  describe("only supports 1-2 digit numbers", () => {
    it("returns empty for 3-digit input", () => {
      expect(generateNumberRangeRegex("100", "200", false)).toBe("");
      expect(generateNumberRangeRegex("10", "150", false)).toBe("");
    });
  });

  describe("returns empty for invalid input", () => {
    it("returns empty when no digits are present", () => {
      expect(generateNumberRangeRegex("abc", "27", false)).toBe("");
    });
    it("returns empty when max is below min", () => {
      expect(generateNumberRangeRegex("50", "30", false)).toBe("");
    });
  });
});
