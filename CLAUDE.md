# CLAUDE.md

Contexto del proyecto para Claude Code. Léelo entero antes de ayudar.

## Qué es este proyecto

Simulación de trabajo en una empresa: app web de control de gastos e ingresos para particulares, para una fintech ficticia cuyos requisitos cambian por el camino. Todos los datos son simulados. Idioma de trabajo, de commits y de documentación: español.

## Roles y forma de trabajo

- Manuel es el desarrollador y trabaja de forma autónoma. Decide cómo se implementa.
- Claude actúa como PM, tech lead, desarrollador senior de apoyo y revisor.
- No escribas código a menos que Manuel lo pida de forma explícita.
- Palabras clave de Manuel:
  - «bloqueo»: da pistas, no la solución.
  - «review»: revisa su diff o su PR como un code review. Clasifica cada comentario como bloqueante, sugerencia o duda.
  - «decisión»: compara opciones técnicas con pros y contras. Manuel elige y escribe el motivo.
- Al cerrar cada fase se hace una retro corta: qué salió bien, qué mejorar y qué diría en una entrevista.

## Fases

1. Kickoff (cerrada). 2. Base (en curso). 3. Auth y roles. 4. Core (movimientos, categorías, presupuestos, recurrentes). 5. Dashboard y UX. 6. Calidad (tests, accesibilidad, rendimiento). 7. Entrega.

## Documentos de referencia

- Brief (historias US-01 a US-28, criterios, riesgos y registro de cambios): https://claude.ai/code/artifact/3b93c141-bd68-4095-934a-e61d3ecf7831
- Backlog de tickets: https://claude.ai/code/artifact/d95fc1c9-85fb-4490-a4bc-fb2e03175752
- Guía técnica de arranque: https://claude.ai/code/artifact/60230e98-032a-44cd-b8b8-147b549d2878
- Convenciones del proyecto: https://claude.ai/code/artifact/ce0ae0d8-a01f-4b96-a9ee-2ac1b25ba270
- Tablero de seguimiento: https://claude.ai/code/artifact/d44c1c1e-3e14-4499-8f4e-46fe45b045d1
- Bocetos (móvil, escritorio y estados): https://claude.ai/artifact/K9ZWsTUem7i5A7L8UJXdxo

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, HeroUI v3, ESLint, Prettier (con `prettier-plugin-tailwindcss`), Vitest y Playwright, despliegue en Vercel.

Propuestas de la guía técnica, pendientes de confirmar salvo que el tablero o el backlog digan lo contrario:

- PostgreSQL en Neon, Drizzle como ORM (Prisma como alternativa).
- Better Auth para la autenticación.
- Zod para validación compartida, React Hook Form con Zod en formularios.
- pnpm, Husky con lint-staged, Playwright con axe para accesibilidad.
- La librería de gráficos (HeroUI no incluye) se decide en su propio ticket (D-03).

## Arquitectura

- Monolito Next.js. Server Components para lecturas y Server Actions para escrituras.
- Next.js 16 sustituye `middleware.ts` por `proxy.ts`. Aun así, la autorización se comprueba en cada acción y consulta del servidor, no solo en el proxy.
- Estructura por funcionalidades en `src/features` (transacciones, presupuestos, categorías, panel, autenticación, recurrencias), cada una con sus componentes, acciones, consultas, esquemas y dominio.
- El dominio es lógica pura, testeable sin Next.

- `next.config.ts` activa de forma deliberada `cacheComponents`, `partialPrefetching` y `reactCompiler`. No los quites sin una decisión. Con `cacheComponents`, lo dinámico (fechas, datos) exige su límite de carga; si `pnpm build` se queja, es por eso.

## Diseño y estilos

- Los tokens de diseño están en `src/app/globals.css`, en un `:root` sin `@layer` que sobrescribe las variables de HeroUI. Cambia un color o un valor ahí, no en cada componente.
- En los componentes usa clases semánticas (`bg-foreground`, `text-muted`, `bg-success`, `border-border`...) y no colores de la paleta como `bg-slate-900`.
- Paleta: neutros `slate`; estados del presupuesto en teal (en rango), yellow (cerca del límite) y rose (superado).
- El estado nunca se transmite solo con color: va siempre con texto e icono. Los chips de estado usan el color al 10 % de fondo y el mismo color en tono 800 para el texto y el icono (contraste mayor de 6:1).
- Tipografía: Geist. Los títulos `h1` a `h4` y `small` tienen estilo base en `@layer base` de `globals.css`; no repitas esas clases en cada etiqueta. Una clase de Tailwind sigue valiendo para una excepción puntual. El nivel del título lo decide la jerarquía del documento, no el tamaño. Los importes de dinero llevan `tabular-nums`.
- Espaciado y radios: valores por defecto de Tailwind y HeroUI (base de 4 px, radio de 0,5 rem). Objetivo táctil mínimo de 44 px (`min-h-11`).
- Solo modo claro. El modo oscuro queda fuera de alcance.
- HeroUI v3 no usa proveedor: se tematiza con variables CSS. Antes de usar un componente, mira su API real en `node_modules/@heroui/react`, porque v3 cambia respecto a v2.
- `/design-test` es una página temporal para probar tokens y componentes. No es parte de la aplicación final (ver B-14).

## Tests

- Unitarios con Vitest (entorno jsdom): `*.test.ts` junto al código que prueban. Importa `describe`, `it` y `expect` desde `"vitest"`; no hay globals. `vitest.config.mts` solo busca en `src/`.
- Extremo a extremo con Playwright (solo Chromium): `*.spec.ts` en `e2e/`. Corren contra la versión de producción (`pnpm build && pnpm start -p 3100`), no contra `pnpm dev`.
- Locators de Playwright, por orden de preferencia: `getByRole`, `getByLabel`, `getByText` y CSS solo como último recurso. Nada de `waitForTimeout`: usa las esperas automáticas de las aserciones.
- `pnpm check` incluye los tests unitarios, pero no los E2E (`pnpm test:e2e`).
- Los tests de componentes (Testing Library) se añadirán cuando haya un componente real que probar.
- No toques `playwright-report/` ni `test-results/`: son artefactos generados e ignorados por git, ESLint y Prettier.

## Integración continua

- Workflow en `.github/workflows/ci.yml` con dos jobs en paralelo: `Calidad` (lint, formato, tipos, tests unitarios y build) y `E2E` (Playwright). Los nombres de los jobs son los checks que exige la ruleset de `main`: si cambias uno, actualiza también la ruleset.
- El workflow llama a los scripts de `package.json`; no pongas comandos propios que no se puedan repetir en local.
- `pnpm typecheck` ejecuta `next typegen` antes de `tsc`, porque `.next` no existe en un clon limpio ni en CI.
- Las acciones se fijan por versión mayor (por ejemplo `@v7`). Node 22; pnpm se toma de `packageManager`.
- Permisos mínimos (`contents: read`). No añadas secretos ni permisos de escritura sin una decisión.

## Reglas de negocio ya decididas

- Importes en céntimos enteros, solo euros. Los movimientos guardan solo la fecha; el mes se calcula en Europe/Madrid.
- Un movimiento tiene una sola categoría. El tipo (gasto o ingreso) se deriva de la categoría. Nota de hasta 140 caracteres.
- Sin traspasos entre cuentas: una cuenta por usuario.
- Presupuesto global mensual y presupuestos por categoría. Estados: en rango, cerca del límite (80 % o más) y superado (más del 100 %). El estado nunca se transmite solo con color. Si la suma de los presupuestos por categoría supera el global, se muestra un aviso sin bloquear.
- Categorías por defecto gestionadas por el administrador, que se copian a cada usuario al registrarse. Las categorías del usuario se archivan, no se borran.
- El administrador nunca consulta movimientos ni importes de los usuarios. Esto está cubierto por tests.
- Movimientos recurrentes (US-28, Must): se generan solos al abrir el mes, sin duplicados aunque se repita la operación. Un cambio de importe vale desde el mes indicado y no toca el histórico. Se pueden pausar y borrar. Cada movimiento generado se puede editar o borrar de forma individual.
- Solo español, con textos de interfaz centralizados.
- Sin marca ni guía de estilo: tokens de diseño neutros y sobrios. El nombre del proyecto, por ahora, es `dunar-pocket`.
- Todas las pantallas con datos tienen estados de carga, vacío (con acción sugerida) y error (con reintento).

## Convenciones

- Ramas: `tipo/ID-descripcion`.
- Commits: Conventional Commits, en español.
- PR con plantilla; los comentarios de review se clasifican como bloqueantes, sugerencias o dudas.
- Máximo dos tickets en curso a la vez.
- El detalle completo está en el documento de convenciones.

## Definición de hecho

Criterios del ticket cumplidos, tests escritos, lint, formato, tipos y tests en verde, comprobación con teclado y a 320 px, sin secretos en el repo, PR revisada y notas actualizadas.

## Objetivos medibles

Lighthouse 90 o más, cobertura de 80 % o más en lógica de negocio, cero fallos críticos de axe, primer movimiento en menos de 3 minutos y alta de un movimiento en menos de 15 segundos.

## Estado actual

Fase 1 cerrada. Fase 2 (base) en curso. Consulta el tablero para ver el estado de cada ticket.
