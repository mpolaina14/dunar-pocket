import { expect, test } from "@playwright/test";

// A-04: las páginas privadas exigen sesión y el CI no tiene base de datos.
// Se reactiva con el inicio de sesión real en A-10.
test.beforeEach(() => {
  test.fixme(true, "Requiere sesión (se reactiva en A-10)");
});

test("la portada muestra el título de la aplicación", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("DUNAR Pocket");
});
