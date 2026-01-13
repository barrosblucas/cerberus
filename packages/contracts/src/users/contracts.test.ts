import { describe, expect, it } from "vitest";
import { CreateUserInputSchema } from "./contracts";

describe("users contracts", () => {
  it("validates create user input", () => {
    const parsed = CreateUserInputSchema.parse({ email: "a@b.com", name: "Alice" });
    expect(parsed.email).toBe("a@b.com");
  });
});
