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
});
