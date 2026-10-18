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

Next.js (App Router), TypeScript, Tailwind, HeroUI, ESLint, Prettier, Vitest y Playwright, despliegue en Vercel.

Propuestas de la guía técnica, pendientes de confirmar salvo que el tablero o el backlog digan lo contrario:
- PostgreSQL en Neon, Drizzle como ORM (Prisma como alternativa).
- Better Auth para la autenticación.
- Zod para validación compartida, React Hook Form con Zod en formularios.
- pnpm, Husky con lint-staged, GitHub Actions para CI, Playwright con axe para accesibilidad.
- Versión de HeroUI y librería de gráficos: se deciden en tickets propios (B-03 y D-03).

## Arquitectura

- Monolito Next.js. Server Components para lecturas y Server Actions para escrituras.
- Next.js 16 sustituye `middleware.ts` por `proxy.ts`. Aun así, la autorización se comprueba en cada acción y consulta del servidor, no solo en el proxy.
- Estructura por funcionalidades en `src/features` (transacciones, presupuestos, categorías, panel, autenticación, recurrencias), cada una con sus componentes, acciones, consultas, esquemas y dominio.
- El dominio es lógica pura, testeable sin Next.

## Reglas de negocio ya decididas

- Importes en céntimos enteros, solo euros. Los movimientos guardan solo la fecha; el mes se calcula en Europe/Madrid.
- Un movimiento tiene una sola categoría. El tipo (gasto o ingreso) se deriva de la categoría. Nota de hasta 140 caracteres.
- Sin traspasos entre cuentas: una cuenta por usuario.
- Presupuesto global mensual y presupuestos por categoría. Estados: en rango, cerca del límite (80 % o más) y superado (más del 100 %). El estado nunca se transmite solo con color. Si la suma de los presupuestos por categoría supera el global, se muestra un aviso sin bloquear.
- Categorías por defecto gestionadas por el administrador, que se copian a cada usuario al registrarse. Las categorías del usuario se archivan, no se borran.
- El administrador nunca consulta movimientos ni importes de los usuarios. Esto está cubierto por tests.
- Movimientos recurrentes (US-28, Must): se generan solos al abrir el mes, sin duplicados aunque se repita la operación. Un cambio de importe vale desde el mes indicado y no toca el histórico. Se pueden pausar y borrar. Cada movimiento generado se puede editar o borrar de forma individual.
- Solo español, con textos de interfaz centralizados.
- Sin marca ni guía de estilo: tokens de diseño neutros. El nombre del proyecto, por ahora, es `dunar-pocket`.
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

Fase 1 cerrada. Fase 2 en curso, empezando por B-01 (crear el proyecto y el repositorio). Consulta el tablero para ver el estado de cada ticket.
