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
- Decisión B-07, persistencia (Postgres en Neon con Drizzle): https://claude.ai/artifact/2RocVYcGpJAm3gRUHYnD9K
- Decisión B-08, autenticación (Better Auth, sesiones en base de datos, roles en servidor): https://claude.ai/artifact/F1SSF1h6jDbBgve21BKVqk
- Estructura del proyecto (B-09): carpetas, capas y reglas de importación: https://claude.ai/artifact/WoNy7ZUsH2Rt88Zuiuk6V7

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, HeroUI v3, ESLint, Prettier (con `prettier-plugin-tailwindcss`), Vitest y Playwright, despliegue en Vercel.

Decidido en B-07: PostgreSQL en Neon con Drizzle como ORM (Prisma queda descartado; el motivo está en el registro de la decisión).

- Drizzle y sus paquetes se instalan con versión exacta (sin `^`).
- `DATABASE_URL` y `DATABASE_URL_UNPOOLED` son las primeras variables de entorno reales. Viven en Vercel, por entorno, y nunca en el repositorio (ver Despliegue).
- El plan gratuito de Neon suspende el cómputo tras 5 minutos sin uso: la primera petición puede tardar más (arranque en frío). No lo trates como un fallo.
- `src/db/client.ts` importa `server-only`: la base de datos solo se usa desde el servidor.
- Drizzle 0.45 estable con versión exacta (la 1.0 sigue en candidata). Driver `neon-http`, recomendado por Neon para Vercel: `db.transaction()` lanza un error con ese driver; para atomicidad usa `db.batch` o las restricciones de la base. Si hace falta una transacción interactiva (o Better Auth la exige), se cambia a `neon-serverless` solo en `src/db/client.ts`.
- Migraciones con `drizzle-kit generate` y `migrate` (archivos versionados en el repo, revisados en la PR). `push` solo para pruebas desechables. Las migraciones usan la cadena directa de Neon (`DATABASE_URL_UNPOOLED`); la aplicación usa la agrupada (`DATABASE_URL`).
- Las migraciones están en `drizzle/` y las genera `drizzle-kit`: no las edites a mano ni las formatees (Prettier las ignora). `drizzle.config.ts` carga `.env.local`; `.env.example` lista las variables sin valores.
- Esquema (B-10), en `src/db/schema/`: `autenticacion.ts` (`user`, con la forma de Better Auth más la columna `rol`), `categorias.ts` (`categorias_por_defecto` y `categorias`), `movimientos.ts` y `presupuestos.ts`. Las tablas de sesión, cuenta y verificación de Better Auth llegan en la Fase 3 con su CLI.
- Convenciones del esquema: las tablas de Better Auth conservan sus nombres en inglés y las nuestras van en español y en plural; en TypeScript se escribe camelCase y la base guarda snake_case (`casing: "snake_case"` en `drizzle.config.ts` y en `client.ts`). Los ids son `uuid`, salvo `user.id` (texto, de Better Auth).
- Importes siempre en céntimos (`integer`, con `CHECK > 0`). Las fechas son `date` en modo texto. El mes de un presupuesto es una fecha en día 1. El tipo de un movimiento (gasto o ingreso) lo da su categoría.
- Las categorías se archivan (`archivada_en`), no se borran: una categoría con movimientos no se puede eliminar (`restrict`). Borrar un usuario borra todos sus datos (`cascade`).
- Un único presupuesto global por usuario y mes (`categoria_id` vacío) lo garantizan dos índices únicos parciales. Un solo índice no valdría: en SQL, `null` no es igual a `null`.
- Semilla (B-12), en `src/db/seed/`: los generadores (`random.ts`, `meses.ts`, `movimientos.ts`, `presupuestos.ts`) son funciones puras que reciben la fecha de «hoy» y no tocan la base de datos; se prueban con Vitest usando una fecha fija. Solo `run.ts` se conecta, con su propia conexión (no importa `client.ts`, que lleva `server-only`). Nunca vacía tablas: solo borra y recrea el usuario demo (`demo@dunar-pocket.test`), y se niega a ejecutarse con `VERCEL_ENV=production`. Si cambias el nombre de una categoría, cámbialo en el catálogo, en los perfiles de movimientos y en los límites de presupuestos: los tests avisan si quedan desajustes. En la Fase 3, el usuario demo pasará a crearse con Better Auth.
- Un proyecto de Neon con dos ramas: `production` y `development`. Vercel usa `production` en Production y `development` en Preview y Development; tu máquina usa `development` desde `.env.local`.

Decidido en B-08: Better Auth autoalojada en nuestro Postgres, con el adaptador de Drizzle ([registro de la decisión](https://claude.ai/artifact/F1SSF1h6jDbBgve21BKVqk)).

- Sesiones en base de datos con cookie; contraseñas con scrypt (por defecto). Fija la versión exacta de Better Auth al instalarla.
- Los roles (usuario y administrador) van en una columna propia. No se usa el plugin de administración de Better Auth, porque su suplantación de usuarios rompe la regla de que el administrador nunca ve movimientos.
- `proxy.ts` solo redirige según la cookie. La sesión y el rol se validan en el servidor en cada Server Action y en cada consulta, y las consultas filtran siempre por el usuario de la sesión.
- Puntos a verificar al implementar (Fase 3): compatibilidad con `neon-http`, encaje de `proxy.ts` con `cacheComponents`, que el rol no se pueda enviar al registrarse y la protección contra intentos repetidos de inicio de sesión.

Propuestas de la guía técnica, pendientes de confirmar salvo que el tablero o el backlog digan lo contrario:

- Zod para validación compartida, React Hook Form con Zod en formularios.
- pnpm, Husky con lint-staged, Playwright con axe para accesibilidad.
- La librería de gráficos (HeroUI no incluye) se decide en su propio ticket (D-03).

## Arquitectura

- Monolito Next.js. Server Components para lecturas y Server Actions para escrituras.
- Next.js 16 sustituye `middleware.ts` por `proxy.ts`. Aun así, la autorización se comprueba en cada acción y consulta del servidor, no solo en el proxy.
- Estructura por funcionalidades en `src/features/<funcionalidad>` (transacciones, presupuestos, categorías, panel, autenticación, recurrencias). Cada una puede tener:
  - `components/`: interfaz de la funcionalidad.
  - `actions.ts`: Server Actions. Validan con Zod, comprueban la sesión, llaman al dominio y a los datos, y revalidan.
  - `queries.ts`: lecturas. `mutations.ts`: escrituras. Ambos acceden a la base de datos.
  - `schemas.ts`: esquemas Zod.
  - `domain/`: lógica de negocio pura, con sus `*.test.ts` al lado.
- Fuera de las funcionalidades: `src/db/schema/` (esquema central de Drizzle) y `src/db/client.ts`; `src/lib/` (dinero, fechas, textos de interfaz); `src/components/ui/` (componentes compartidos); `src/app/` (rutas finas que solo componen); `e2e/` (tests de extremo a extremo).
- Las pantallas de la aplicación viven en el grupo de rutas `src/app/(app)/`, cuyo `layout.tsx` monta el esqueleto: enlace «Saltar al contenido», cabecera (solo móvil), barra lateral (desde `md`), `<main id="contenido">` y barra inferior (solo móvil). Las páginas no llevan `<main>` propio. Ese esqueleto y su navegación están en `src/components/layout/`; los destinos de la navegación se declaran una sola vez en `enlaces.ts`. `/design-test` queda fuera del grupo a propósito.
- Sin archivos `index.ts` que reexporten (barrels). Alias de importación: `@/*` apunta a `src/*`. Los nombres del dominio van en español.
- Reglas de importación, comprobadas por ESLint (`no-restricted-imports` en `eslint.config.mjs`; si cambias una capa, cambia también la regla):
  - El dominio no importa `next`, `react`, `react-dom`, `@/db`, `drizzle-orm`, `server-only`, ni `queries`, `mutations` o `actions`. Recibe lo que necesita por parámetros.
  - La interfaz (`src/app`, `src/components`, `components/` de cada funcionalidad) no importa `@/db`, `drizzle-orm` ni `mutations`. Lee a través de `queries` y escribe a través de `actions`.
  - El acceso a datos (`queries.ts`, `mutations.ts`, `src/db`) no importa componentes ni `actions`.
  - Entre funcionalidades se puede usar el dominio y las `queries` de otra, nunca sus componentes ni sus acciones (esta regla se revisa en code review, ESLint no la comprueba).
- El dominio es lógica pura, testeable sin Next. Ejemplo de referencia: `src/features/presupuestos/domain/estado-presupuesto.ts` y su test.

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
- `/design-test` es una página para probar tokens y componentes. Solo existe en desarrollo: con `NODE_ENV=production` (build de producción y vistas previas de Vercel) llama a `notFound()` y devuelve un 404, y un test E2E lo comprueba (B-14). No es parte de la aplicación final.

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
- Las acciones se fijan por versión mayor (por ejemplo `@v7`). La versión de Node sale de `.nvmrc` (24) y se repite en `engines` de `package.json`, que es lo que lee Vercel: si la cambias, cámbiala en los dos sitios. pnpm se toma de `packageManager`.
- Permisos mínimos (`contents: read`). No añadas secretos ni permisos de escritura sin una decisión.

## Despliegue

- Vercel, conectado al repositorio. Producción: https://dunar-pocket.vercel.app/ (rama `main`). Cada PR genera una vista previa protegida por login de Vercel.
- Node lo fija `engines` en `package.json` (24.x); Vercel lo lee de ahí, no del panel. Debe coincidir con `.nvmrc` y con el CI.
- Las variables de entorno viven en Vercel, por entorno, y nunca en el repositorio. Si el código necesita una nueva, documéntala en el README sin poner su valor y avisa a Manuel de que debe añadirla en Vercel antes de mergear.
- El check de Vercel no es obligatorio en la ruleset. Lo obligatorio es `Calidad` y `E2E`.
- Un build que pasa en el CI y falla en Vercel suele ser un entorno (variable de entorno, versión de Node): empieza por ahí.

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
