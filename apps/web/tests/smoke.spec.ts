import { expect, test } from "@playwright/test";

test("home loads", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});
