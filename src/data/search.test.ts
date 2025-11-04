import { describe, expect, it } from "vitest";

import { searchHeroes } from "./search";

const toIds = (query: string) => searchHeroes(query).map((hero) => hero.id);

describe("searchHeroes", () => {
  it("支持中文外号匹配", () => {
    expect(toIds("艾希")).toContain("ashe");
    expect(toIds("拉克丝")).toContain("lux");
  });

  it("支持中文拼音匹配", () => {
    expect(toIds("aixi")).toContain("ashe");
    expect(toIds("lakesi")).toContain("lux");
  });

  it("支持拼音首字母缩写", () => {
    expect(toIds("ax")).toContain("ashe");
    expect(toIds("lk")).toContain("lux");
  });
});
