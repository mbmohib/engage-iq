import { test, expect, chromium } from "@playwright/test";
import path from "path";

test.describe("Chrome Extension Integration", () => {
  test("should load extension in browser", async () => {
    const extensionPath = path.join(__dirname, "../../dist");

    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });

    const page = await context.newPage();
    await page.goto("about:blank");

    await context.close();
  });
});
