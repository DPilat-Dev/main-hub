import { describe, it, expect } from "vitest";
import { slugify, formatDate, readingTime } from "./format";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips punctuation and quotes", () => {
    expect(slugify("Building My Hub: Resume & Projects!")).toBe(
      "building-my-hub-resume-projects",
    );
    expect(slugify(`It's a "Test"`)).toBe("its-a-test");
  });

  it("trims leading/trailing separators", () => {
    expect(slugify("  --Edge--  ")).toBe("edge");
  });

  it("collapses repeated separators", () => {
    expect(slugify("a   b___c")).toBe("a-b-c");
  });

  it("caps length at 80 characters", () => {
    const long = "word ".repeat(50);
    expect(slugify(long).length).toBeLessThanOrEqual(80);
  });
});

describe("readingTime", () => {
  it("returns at least 1 minute for short content", () => {
    expect(readingTime("<p>hello world</p>")).toBe("1 min read");
  });

  it("strips HTML tags before counting", () => {
    const html = `<p>${"word ".repeat(400)}</p>`;
    expect(readingTime(html)).toBe("2 min read");
  });

  it("scales with word count", () => {
    const html = `<div>${"word ".repeat(1000)}</div>`;
    expect(readingTime(html)).toBe("5 min read");
  });
});

describe("formatDate", () => {
  it("formats a Date into a long US date", () => {
    expect(formatDate(new Date("2026-01-15T12:00:00Z"))).toContain("2026");
  });

  it("accepts an ISO string", () => {
    expect(formatDate("2026-07-04T00:00:00Z")).toContain("2026");
  });
});
