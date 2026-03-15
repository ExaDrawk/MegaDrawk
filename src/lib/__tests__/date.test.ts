import { describe, it, expect } from "vitest";
import { formatJaDate } from "@/lib/date";

describe("formatJaDate", () => {
  it("formats ISO date to Japanese locale", () => {
    expect(formatJaDate("2026-03-01")).toContain("2026");
  });

  it("returns a stable non-empty string", () => {
    const value = formatJaDate("2026-02-28");
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });

  it("throws an error on invalid date string", () => {
    expect(() => formatJaDate("invalid-date")).toThrow("Invalid date string provided");
  });
});
