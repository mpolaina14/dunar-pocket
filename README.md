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
- pnpm como gestor de paquetes

Se irán incorporando más herramientas por fases. Las decisiones técnicas y su motivo se registran en la documentación del proyecto.

## Requisitos

- Una versión LTS reciente de Node.js
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
| `pnpm check`        | Ejecuta lint, formato y tipos seguidos                       |

## Calidad del código

Antes de abrir una pull request, ejecuta `pnpm check`: debe terminar sin errores.

Además, al hacer `git commit` se ejecuta un hook (Husky con lint-staged) que corrige y revisa con ESLint y Prettier los archivos que vas a confirmar. Si hay un error que no se puede arreglar solo, el commit se cancela.

Este hook es una primera barrera local y se puede saltar. La comprobación obligatoria en cada pull request llegará con la integración continua (ticket B-05).

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
- [Tablero de seguimiento](https://claude.ai/code/artifact/d44c1c1e-3e14-4499-8f4e-46fe45b045d1)
- [Bocetos de baja fidelidad](https://claude.ai/artifact/K9ZWsTUem7i5A7L8UJXdxo)

## Cómo contribuir

- Ramas: `tipo/ID-descripcion` (por ejemplo, `chore/B-01-crear-proyecto`).
- Commits: Conventional Commits, en español.
- Todo cambio llega a `main` mediante una pull request revisada.
- Antes de abrirla, `pnpm check` debe pasar.

El detalle completo está en el documento de convenciones.
