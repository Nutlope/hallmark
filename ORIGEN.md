# Origen

`ms-web-design` es una skill derivada. Este archivo registra de dónde viene cada parte y qué hemos cambiado respecto al original.

## Base: Hallmark

| | |
|---|---|
| Repositorio | [Nutlope/hallmark](https://github.com/Nutlope/hallmark) |
| Commit base | [`4f6a46c`](https://github.com/Nutlope/hallmark/commit/4f6a46c6dc325d40ab268c93e25c7b96676ebccd) (2026-10-29) |
| Rama espejo | `upstream`: copia intacta de `Nutlope/hallmark@main`. Nunca se modifica a mano; solo se avanza a un commit del original. |
| Licencia | Ver [`LICENSE`](LICENSE) |

## Fuente secundaria: taste-skill

| | |
|---|---|
| Repositorio | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| Commit base | [`12af471`](https://github.com/Leonxlnx/taste-skill/commit/12af471f627f866411b4bd785b19646d3672784c) (v2.1.5) |

Archivos que tomamos:

| Archivo en taste-skill | Qué tomamos |
|---|---|
| `skills/taste-skill/references/app-screens.md` | El archivo completo, copiado sin cambios en `skills/ms-web-design/references/vendor/taste-skill/app-screens.md` |
| `skills/taste-skill/references/critique.md` | Solo la sección 1 (las 14 pasadas), copiada sin cambios en `skills/ms-web-design/references/vendor/taste-skill/critique-passes.md` |

Las copias de `vendor/` nunca se editan: así se comparan limpias con el original. Toda adaptación vive en los archivos `ms-*` que las acompañan.

## Vigilancia de cambios

[`.github/workflows/upstream-watch.yml`](.github/workflows/upstream-watch.yml) se ejecuta cada lunes y abre un issue si:

- `Nutlope/hallmark@main` tiene commits que no están en la rama `upstream`.
- Alguno de los archivos de taste-skill de la tabla anterior ha cambiado desde su commit base.

Al adoptar una versión nueva de cualquiera de las dos fuentes, actualiza el commit base aquí **y** en las variables `env` del workflow.

## Modificaciones

| Archivo | Origen | Commit | Cambio |
|---|---|---|---|
| `skills/hallmark/` → `skills/ms-web-design/` | Hallmark | `4f6a46c` | Carpeta renombrada; contenido intacto |
| `skills/ms-web-design/SKILL.md` | Hallmark | `4f6a46c` | `name: hallmark` → `name: ms-web-design` en el frontmatter |
| `.github/workflows/verify.yml` | Hallmark | `4f6a46c` | Rutas `skills/hallmark` → `skills/ms-web-design` |
| `README.md` | Hallmark | `4f6a46c` | Rutas del repo `skills/hallmark` → `skills/ms-web-design` (no las rutas de instalación `~/.claude/skills/hallmark`) |
| `package.json` | Hallmark | `4f6a46c` | `entry` y `references` apuntan a `skills/ms-web-design` |
| `skills/ms-web-design/SKILL.md` | Hallmark | `4f6a46c` | Descripción nueva (activación en webs y pantallas nuevas; rediseño solo por nombre, con aviso); título; bloque de principios de Sergio; excepción de marca de cliente para los ítems 3, 9, 10 y el degradado del 11 de la Floor; `sloplint` → `ms-sloplint` en la Floor, el hero y el paso 7; carga de `ms-app-screens.md`; verbos y prompt con `/ms-web-design`; quitada la línea "Powered by Together AI". Recortado para seguir bajo el límite de 19.000 bytes de `refcheck` |
| `skills/ms-web-design/references/flow.md` | Hallmark | `4f6a46c` | Una línea en § App screens que carga `ms-app-screens.md` |
| `skills/ms-web-design/references/review-finish.md` | Hallmark | `4f6a46c` | Una línea que obliga a hacer las pasadas de `ms-critica.md` antes de puntuar |
| `skills/ms-web-design/scripts/refcheck.mjs` | Hallmark | `4f6a46c` | No recorre `vendor/` (las copias de taste-skill usan sus propios números de gate y archivos) |
| `skills/ms-web-design/scripts/ms-sloplint.mjs` | Propio | — | Nuevo. Ejecuta `sloplint` sin tocarlo y convierte en `MARCA` solo los FAIL de los gates 38i, 54, 67, 63 y 2a declarados con `/* ms · marca · … */` y respaldados por un `design.md` o `brand-spec.md` |
| `skills/ms-web-design/references/ms-app-screens.md` | Propio | — | Nuevo. Precedencia y equivalencias para leer el `app-screens.md` de taste-skill dentro de Hallmark |
| `skills/ms-web-design/references/ms-critica.md` | Propio | — | Nuevo. Cómo aplicar las pasadas de crítica de taste-skill a las capturas de Hallmark |
| `skills/ms-web-design/references/vendor/taste-skill/` | taste-skill | `12af471` | Copias literales (ver arriba) |
| `skills/ms-web-design/scripts/install.mjs` | Hallmark | `4f6a46c` | Instala en `…/skills/ms-web-design` y anuncia `/ms-web-design` |
| `skills/ms-web-design/scripts/install-hook.mjs` | Hallmark | `4f6a46c` | Reconoce el hook tanto en una instalación `hallmark` como `ms-web-design` |
| `.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json` | Hallmark | `4f6a46c` | Nombre `ms-web-design`, autor MagicalScreen y ruta `./ms-web-design` (la de Hallmark apuntaba a la carpeta renombrada y había quedado rota) |
| `skills/ms-web-design/references/ms-arte.md` | Propio | — | Nuevo. Fase de dirección de arte: análisis de referencias por dimensiones, patrones y tensiones, roles (dominante, apoyo, firma), 2 o 3 direcciones, filtro de HTML sin JavaScript; su resultado es el `design.md`. La marca del cliente manda; salir de ella solo a petición expresa |
| `skills/ms-web-design/references/ms-esteticas.md` | Propio | — | Nuevo. Nueve territorios visuales traducidos a géneros, temas y formas de la skill, con lo que cabe en HTML sin JavaScript y lo que es capa |
| `skills/ms-web-design/references/ms-movimiento.md` | Propio | — | Nuevo. Postura `movimiento protagonista`: opcional, la skill la ofrece cuando el material o las referencias son de movimiento |
| `skills/ms-web-design/references/ms-critica.md` | Propio | — | Ampliado: bloque «Ya propio» antes de los hallazgos, formato de cada hallazgo, orden de corrección, pasadas de peaje de navegación, pieza principal y test de intercambio, y el cierre `ship` |
| `skills/ms-web-design/references/design-md.md` | Hallmark | `4f6a46c` | Una línea: el `Origen` y la `## Dirección` de `ms-arte.md` van encima de `## System` |
| `skills/ms-web-design/SKILL.md` | Hallmark | `4f6a46c` | Paso 0 carga `ms-arte.md` con referencias, estética nombrada o petición de dirección o inspiración; paso 3 construye desde la base de `## Dirección`; paso 5 ofrece la fila **Movimiento**; la excepción de marca no vale para un `design.md` nuestro. Para seguir bajo 19.000 bytes: ejemplo del bloque Picks abreviado, quitada la lista de campos del log (`theme.mjs log` ya avisa de los que faltan) y acortada la línea de harnesses |
| `skills/ms-web-design/scripts/ms-sloplint.mjs` | Propio | — | Ampliado: rechaza la marca de un `design.md` con línea `Origen: ms-web-design` sin `## Marca del cliente`; lee la postura de movimiento y pasa F8 a nota; cuatro gates Reflex propios (`ms-hover`, `ms-cursor`, `ms-scroll`, `ms-intro`) con waiver `/* ms · waive · <gate> · <motivo> */` |
| `skills/ms-web-design/scripts/ms-test.mjs`, `scripts/fixtures/ms-*` | Propio | — | Nuevos. Test y fixtures de lo anterior |
| `.github/workflows/verify.yml` | Hallmark | `4f6a46c` | Paso nuevo que ejecuta `ms-test.mjs` |

Notas:

- El sello del CSS y los comentarios de waiver siguen empezando por `Hallmark ·` a propósito: `sloplint` los lee así.
- `site/` y `eval/` se dejan intactos para que las actualizaciones de Hallmark entren sin conflicto. No se instalan con la skill.
- El README sigue describiendo Hallmark (instalación con `npx skills add nutlope/hallmark`); se deja intacto para no generar conflictos. Para instalar `ms-web-design` usa `install.mjs` o el plugin de este repo.

## Influencias sin copia

Ideas y métodos adaptados con redacción propia, sin texto literal, de una fuente sin licencia declarada:

| | |
|---|---|
| Fuente | *The AI Portfolio System for Designers*, de Ioana Teleanu (UX Goodies). Primera versión, exportada de Notion el 2026-11-06 |
| Partes leídas | `SKILL-03-portfolio-art-director`, `BONUS-SKILL-anti-generic-reviewer` y la biblioteca de estéticas de portfolio |
| Licencia | Ninguna declarada. Los originales se guardan fuera de este repo, solo para uso personal |

Qué ideas influyeron y dónde:

- Analizar referencias por dimensiones, separar sistema dominante, ingredientes de apoyo y momentos firma, y combinar referencias por roles: `ms-arte.md`.
- Proponer pocas direcciones con su riesgo y la parte que solo aporta el propietario: `ms-arte.md`.
- Empezar la crítica por lo que ya es propio, corregir en un orden fijo y saber cuándo parar: `ms-critica.md`.
- El vocabulario de territorios para portfolios: `ms-esteticas.md` (nueve; se descartó el de escritorio de sistema operativo por chocar con el Floor). Los ejemplos de la autora no se publican aquí.
- Los patrones de interacción que esconden contenido o secuestran la navegación: gates `ms-hover`, `ms-cursor`, `ms-scroll` e `ms-intro` en `ms-sloplint.mjs`.
- La parte sobre textos (lenguaje genérico, prosa con sabor a IA, seniority inflada, métricas sin contexto, teatro de proceso) no entra en esta skill: queda anotada para `ms-portfolio-content`.
