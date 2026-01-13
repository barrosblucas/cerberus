import { describe, expect, it } from "vitest";
import { err, ok } from "./index";

describe("utils result helpers", () => {
  it("wraps ok values", () => {
    const result = ok(123);
    expect(result).toEqual({ ok: true, value: 123 });
  });

  it("wraps error values", () => {
    const result = err("boom");
    expect(result).toEqual({ ok: false, error: "boom" });
  });
});
