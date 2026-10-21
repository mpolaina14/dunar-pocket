# dunar-pocket

Aplicación web de control de gastos e ingresos para particulares.

## Contexto

El cliente es una fintech ficticia que quiere lanzar su aplicación de finanzas personales, y sus requisitos cambian durante el desarrollo. Todos los datos son simulados.

La aplicación permitirá registrar movimientos, organizarlos por categorías, definir presupuestos (global y por categoría) y gestionar movimientos recurrentes como domiciliaciones y suscripciones.

## Stack

Por ahora el proyecto incluye:

- Next.js (App Router) con React
- TypeScript
- Tailwind CSS v4
- HeroUI v3 (componentes de interfaz)
- ESLint y Prettier (con `prettier-plugin-tailwindcss` para ordenar las clases)
- Vitest (tests unitarios) y Playwright (tests de extremo a extremo)
- pnpm como gestor de paquetes

Se irán incorporando más herramientas por fases. Las decisiones técnicas y su motivo se registran en la documentación del proyecto.

## Requisitos

- Node.js 24 (la versión está fijada en `.nvmrc` y en el campo `engines` de `package.json`; con nvm basta `nvm use`)
- pnpm (la versión exacta está fijada en el campo `packageManager` de `package.json`)

## Cómo arrancarlo en local

1. Clona el repositorio y entra en la carpeta del proyecto.
2. Instala las dependencias: `pnpm install`
3. Arranca el servidor de desarrollo: `pnpm dev`
4. Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts disponibles

| Comando             | Qué hace                                                     |
| ------------------- | ------------------------------------------------------------ |
| `pnpm dev`          | Arranca el servidor de desarrollo                            |
| `pnpm build`        | Genera la versión de producción                              |
| `pnpm start`        | Sirve la versión de producción (requiere `pnpm build` antes) |
| `pnpm lint`         | Ejecuta ESLint sobre el código                               |
| `pnpm format`       | Da formato a todo el proyecto con Prettier                   |
| `pnpm format:check` | Comprueba el formato sin modificar archivos                  |
| `pnpm typecheck`    | Comprueba los tipos de TypeScript                            |
| `pnpm test`         | Ejecuta los tests unitarios una vez (Vitest)                 |
| `pnpm test:watch`   | Ejecuta los tests unitarios y los repite al guardar          |
| `pnpm test:e2e`     | Ejecuta los tests de extremo a extremo (Playwright)          |
| `pnpm test:e2e:ui`  | Abre la interfaz de Playwright para depurar los tests E2E    |
| `pnpm check`        | Ejecuta lint, formato, tipos y tests unitarios seguidos      |

## Estructura del proyecto

El código se organiza por funcionalidades y separa tres capas: interfaz, lógica de negocio (dominio) y acceso a datos.

```text
src/
├── app/                  rutas de Next.js (solo componen)
├── components/ui/        componentes compartidos
├── db/                   esquema (Drizzle) y cliente de base de datos
├── features/
│   └── <funcionalidad>/  transacciones, presupuestos, categorías...
│       ├── components/   interfaz
│       ├── actions.ts    Server Actions (escrituras desde la interfaz)
│       ├── queries.ts    lecturas
│       ├── mutations.ts  escrituras en la base de datos
│       ├── schemas.ts    validación con Zod
│       └── domain/       lógica pura y sus tests
└── lib/                  utilidades (dinero, fechas, textos)
```

Algunas reglas de importación se comprueban con ESLint: el dominio no puede importar Next, React ni la base de datos; la interfaz no accede a la base de datos; y el acceso a datos no depende de la interfaz. El detalle y los motivos están en el documento de estructura (ver Documentación).

## Calidad del código

Antes de abrir una pull request, ejecuta `pnpm check`: debe terminar sin errores.

Además, al hacer `git commit` se ejecuta un hook (Husky con lint-staged) que corrige y revisa con ESLint y Prettier los archivos que vas a confirmar. Si hay un error que no se puede arreglar solo, el commit se cancela.

Este hook es una primera barrera local y se puede saltar. La comprobación obligatoria está en la integración continua (ver la sección siguiente).

## Integración continua

El flujo de CI está en `.github/workflows/ci.yml` (GitHub Actions) y se ejecuta en cada pull request hacia `main` y en cada push a `main`. Tiene dos jobs que corren en paralelo:

- **Calidad:** instala con el lockfile congelado y ejecuta lint, formato, tipos, tests unitarios y `pnpm build`.
- **E2E:** instala Chromium y ejecuta los tests de Playwright. Si fallan, sube el informe como artefacto descargable desde la pestaña Checks.

La ruleset de `main` exige que los dos checks (`Calidad` y `E2E`) pasen antes de poder hacer el merge. Si renombras un job en el workflow, hay que actualizar también la ruleset.

El CI ejecuta los mismos scripts que tienes en local, así que un fallo se reproduce con el comando del paso que falló. `pnpm typecheck` genera antes los tipos de Next (`next typegen`), por eso funciona también en un clon limpio.

## Despliegue

La aplicación se despliega en Vercel, conectado a este repositorio de GitHub:

- **Producción:** [dunar-pocket.vercel.app](https://dunar-pocket.vercel.app/). Se actualiza sola cada vez que se hace merge en `main`. La portada es todavía provisional.
- **Vista previa:** cada pull request genera su propia URL. El enlace aparece en un comentario de Vercel en la PR. Las vistas previas están protegidas: hay que iniciar sesión en Vercel para abrirlas.
- **Node:** Vercel toma la versión del campo `engines` de `package.json` (24), la misma que `.nvmrc` y el CI.
- **Variables de entorno:** se configuran en Vercel (Settings, Environment Variables), separadas por entorno (Production, Preview y Development). No se suben al repositorio. Por ahora no hay ninguna.

Vercel hace su propio build, independiente del CI de GitHub Actions. Su check aparece en las PR, pero no es obligatorio: lo que bloquea el merge son `Calidad` y `E2E`.

## Tests

- **Unitarios (Vitest):** archivos `*.test.ts` junto al código que prueban. Se ejecutan con `pnpm test` y forman parte de `pnpm check`.
- **Extremo a extremo (Playwright):** archivos `*.spec.ts` en la carpeta `e2e/`. Se ejecutan con `pnpm test:e2e`, solo con Chromium. No forman parte de `pnpm check`.

La primera vez que los ejecutes en una máquina, descarga el navegador de Playwright: `pnpm exec playwright install chromium`.

`pnpm test:e2e` compila la versión de producción y la sirve en el puerto 3100, así que tarda más que los unitarios. Si ya hay un servidor en ese puerto fuera de CI, lo reutiliza. Los informes se generan en `playwright-report/` y `test-results/`, que no se suben al repositorio.

## Diseño y estilos

Los estilos se apoyan en Tailwind CSS y en HeroUI v3, que se tematiza con variables CSS y no necesita proveedor. Los tokens de diseño propios están en `src/app/globals.css`:

- **Colores:** neutros de la paleta `slate` de Tailwind, y teal, yellow y rose para los estados del presupuesto (en rango, cerca del límite y superado). Los estados siempre se indican con texto e icono, nunca solo con color. Los chips de estado usan el color al 10% de fondo y el mismo tono 800 para el texto y el icono.
- **Tipografía:** Geist. Los títulos `h1` a `h4`, el texto pequeño (`small`) y el cuerpo tienen un tamaño y un peso base definidos en `globals.css`, así que no hace falta añadir clases a cada etiqueta. Una clase de Tailwind (`text-lg`, `font-bold`...) sigue sirviendo para una excepción puntual.
- **Espaciado y radios:** se usan los valores por defecto de Tailwind y HeroUI (base de 4px y radio de 0,5 rem).
- **Solo modo claro:** el modo oscuro queda fuera del alcance por ahora.

La ruta `/design-test` es una página temporal que reúne títulos, botones, campos, estados de presupuesto y esqueletos de carga. Sirve para comprobar visualmente los tokens y los componentes, y no forma parte de la aplicación final.

## Estado del proyecto

El trabajo se organiza en siete fases: kickoff, base, autenticación y roles, núcleo (movimientos, categorías, presupuestos y recurrentes), panel y experiencia de usuario, calidad y entrega.

Situación actual: fase 1 (kickoff) cerrada y fase 2 (base) en curso. El seguimiento de tickets está en el tablero del proyecto.

## Documentación

Los documentos del proyecto están alojados fuera del repositorio y son privados, por lo que solo abren a quien tenga acceso:

- [Brief del proyecto](https://claude.ai/code/artifact/3b93c141-bd68-4095-934a-e61d3ecf7831): historias de usuario, criterios de aceptación, riesgos y registro de cambios
- [Backlog de tickets](https://claude.ai/code/artifact/d95fc1c9-85fb-4490-a4bc-fb2e03175752)
- [Guía técnica de arranque](https://claude.ai/code/artifact/60230e98-032a-44cd-b8b8-147b549d2878)
- [Convenciones del proyecto](https://claude.ai/code/artifact/ce0ae0d8-a01f-4b96-a9ee-2ac1b25ba270)
- [Estructura del proyecto (B-09)](https://claude.ai/artifact/WoNy7ZUsH2Rt88Zuiuk6V7): carpetas, capas y reglas de importación
- [Decisión de persistencia (B-07)](https://claude.ai/artifact/2RocVYcGpJAm3gRUHYnD9K): Postgres en Neon con Drizzle
- [Tablero de seguimiento](https://claude.ai/code/artifact/d44c1c1e-3e14-4499-8f4e-46fe45b045d1)
- [Bocetos de baja fidelidad](https://claude.ai/artifact/K9ZWsTUem7i5A7L8UJXdxo)

## Cómo contribuir

- Ramas: `tipo/ID-descripcion` (por ejemplo, `chore/B-01-crear-proyecto`).
- Commits: Conventional Commits, en español.
- Todo cambio llega a `main` mediante una pull request revisada.
- Antes de abrirla, `pnpm check` debe pasar.

El detalle completo está en el documento de convenciones.
