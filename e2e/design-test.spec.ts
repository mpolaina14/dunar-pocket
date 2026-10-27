import { expect, test } from "@playwright/test";

test("Comprobar que el test en producción va a una página 404", async ({
  page,
}) => {
  const respuesta = await page.goto("/design-test");
  expect(respuesta?.status()).toBe(404);
});
