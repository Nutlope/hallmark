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
| `skills/taste-skill/references/app-screens.md` | El archivo completo |
| `skills/taste-skill/references/critique.md` | Solo las pasadas de crítica |

## Vigilancia de cambios

[`.github/workflows/upstream-watch.yml`](.github/workflows/upstream-watch.yml) se ejecuta cada lunes y abre un issue si:

- `Nutlope/hallmark@main` tiene commits que no están en la rama `upstream`.
- Alguno de los archivos de taste-skill de la tabla anterior ha cambiado desde su commit base.

Al adoptar una versión nueva de cualquiera de las dos fuentes, actualiza el commit base aquí **y** en las variables `env` del workflow.

## Modificaciones

| Archivo | Origen | Commit | Cambio |
|---|---|---|---|
