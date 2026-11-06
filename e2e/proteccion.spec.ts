import { expect, test } from "@playwright/test";

const cookieFalsa = "better-auth.session_token=cualquier-valor";

test.describe("sin sesión", () => {
  for (const ruta of ["/", "/movimientos", "/presupuestos", "/categorias"]) {
    test(`${ruta} redirige a /login`, async ({ page }) => {
      await page.goto(ruta);

      await expect(page).toHaveURL("/login");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Iniciar sesión",
      );
    });
  }

  for (const { ruta, titulo } of [
    { ruta: "/login", titulo: "Iniciar sesión" },
    { ruta: "/registro", titulo: "Crear cuenta" },
  ]) {
    test(`${ruta} es accesible`, async ({ page }) => {
      await page.goto(ruta);

      await expect(page).toHaveURL(ruta);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(titulo);
    });
  }
});

test.describe("con cookie de sesión", () => {
  for (const ruta of ["/login", "/registro"]) {
    test(`${ruta} redirige al panel`, async ({ request }) => {
      const respuesta = await request.get(ruta, {
        headers: { cookie: cookieFalsa },
        maxRedirects: 0,
      });

      expect(respuesta.status()).toBe(307);
      const destino = new URL(
        respuesta.headers()["location"] ?? "",
        respuesta.url(),
      );
      expect(destino.pathname).toBe("/");
    });
  }
});
