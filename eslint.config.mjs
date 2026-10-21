import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Artefactos generados por Playwright.
    "playwright-report/**",
    "test-results/**",
  ]),
  // Capas del proyecto (ver «Estructura del proyecto», B-09). Cada bloque cubre
  // archivos distintos, así que no se pisan entre sí.
  // Dominio: lógica pura, sin framework, sin base de datos y sin capas superiores.
  {
    files: ["src/features/*/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "next",
                "next/*",
                "react",
                "react/*",
                "react-dom",
                "react-dom/*",
              ],
              message:
                "El dominio es lógica pura: no puede importar Next ni React.",
            },
            {
              group: [
                "@/db",
                "@/db/*",
                "drizzle-orm",
                "drizzle-orm/*",
                "server-only",
              ],
              message:
                "El dominio no accede a datos: recibe lo que necesita por parámetros.",
            },
            {
              group: ["**/queries", "**/mutations", "**/actions"],
              message: "El dominio no depende de las capas que lo usan.",
            },
          ],
        },
      ],
    },
  },
  // Interfaz: no toca la base de datos ni escribe datos directamente.
  {
    files: [
      "src/app/**/*.{ts,tsx}",
      "src/components/**/*.{ts,tsx}",
      "src/features/*/components/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/db", "@/db/*", "drizzle-orm", "drizzle-orm/*"],
              message:
                "La interfaz no accede a la base de datos: usa las queries de la funcionalidad.",
            },
            {
              group: ["**/mutations"],
              message:
                "La interfaz no llama a las mutaciones: escribe a través de las Server Actions.",
            },
          ],
        },
      ],
    },
  },
  // Acceso a datos: no depende de la interfaz ni de las acciones.
  {
    files: [
      "src/features/*/queries.ts",
      "src/features/*/mutations.ts",
      "src/db/**/*.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/components/**", "**/actions"],
              message:
                "El acceso a datos no depende de la interfaz ni de las acciones.",
            },
          ],
        },
      ],
    },
  },
  // Must stay last: turns off rules that conflict with Prettier.
  prettier,
]);

export default eslintConfig;
