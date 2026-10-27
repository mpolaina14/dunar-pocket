import { expect, test } from "@playwright/test";

test("Tab una vez pone el foco en Saltar al contenido", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");

  const enlaceSaltar = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(enlaceSaltar).toBeFocused();

  await page.keyboard.press("Enter");

  await expect(page.locator("#contenido")).toBeFocused();
});

const secciones = [
  { ruta: "/", etiqueta: "Inicio", titulo: "Inicio", pestana: "DUNAR Pocket" },
  {
    ruta: "/movimientos",
    etiqueta: "Movimientos",
    titulo: "Movimientos",
    pestana: "Movimientos | DUNAR Pocket",
  },
  {
    ruta: "/presupuestos",
    etiqueta: "Presupuestos",
    titulo: "Presupuestos",
    pestana: "Presupuestos | DUNAR Pocket",
  },
  {
    ruta: "/categorias",
    etiqueta: "Categorías",
    titulo: "Categorías",
    pestana: "Categorías | DUNAR Pocket",
  },
];

for (const { ruta, etiqueta, titulo } of secciones) {
  test(`la navegación lleva a ${etiqueta} y la marca como activa`, async ({
    page,
  }) => {
    await page.goto("/");

    const enlace = page.getByRole("link", { name: etiqueta, exact: true });
    await enlace.click();

    await expect(page).toHaveURL(ruta);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(titulo);
    await expect(enlace).toHaveAttribute("aria-current", "page");
  });
}

test.describe("a 320 px de ancho", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const { ruta, etiqueta } of secciones) {
    test(`${etiqueta} no tiene scroll horizontal`, async ({ page }) => {
      await page.goto(ruta);

      const desborda = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );

      expect(desborda).toBe(false);
    });
  }

  for (const { ruta, etiqueta, titulo } of secciones) {
    test(`la barra inferior lleva a ${etiqueta} y la marca como activa`, async ({
      page,
    }) => {
      await page.goto("/");

      const barra = page.getByRole("navigation", { name: "Principal" });
      await expect(barra).toBeVisible();

      const enlace = barra.getByRole("link", { name: etiqueta, exact: true });
      await enlace.click();

      await expect(page).toHaveURL(ruta);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(titulo);
      await expect(enlace).toHaveAttribute("aria-current", "page");
    });
  }
});

for (const { ruta, etiqueta, pestana } of secciones) {
  test(`${etiqueta} tiene el título de pestaña correcto`, async ({ page }) => {
    await page.goto(ruta);

    await expect(page).toHaveTitle(pestana);
  });
}
