import { describe, it, expect } from "vitest";
import { PROJECTS } from "../projects";

describe("PROJECTS configuration", () => {
  it("defines personal projects list", () => {
    expect(PROJECTS.length).toBeGreaterThanOrEqual(3);
  });

  it("contains どこでも六法 with valid link", () => {
    const roppo = PROJECTS.find((p) => p.name === "どこでも六法");
    expect(roppo).toBeDefined();
    expect(roppo?.platform).toBe("Androidアプリ");
    expect(roppo?.href).toContain("play.google.com");
  });

  it("contains Multi-Subtitles for YouTube with valid link", () => {
    const multiSub = PROJECTS.find((p) => p.name === "Multi-Subtitles for YouTube");
    expect(multiSub).toBeDefined();
    expect(multiSub?.platform).toBe("Chrome拡張機能");
    expect(multiSub?.href).toContain("chromewebstore.google.com");
  });

  it("contains 条文スコープ with valid link", () => {
    const jobun = PROJECTS.find((p) => p.name === "条文スコープ");
    expect(jobun).toBeDefined();
    expect(jobun?.platform).toBe("Chrome拡張機能");
    expect(jobun?.href).toContain("chromewebstore.google.com");
  });
});