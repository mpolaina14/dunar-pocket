import { expect, test } from "@playwright/test";

test("la portada muestra el título de la aplicación", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("DUNAR Pocket");
});
