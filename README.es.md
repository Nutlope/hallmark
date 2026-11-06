[English](README.md) | [Português (Brasil)](README.pt-BR.md) | **Español**

> Traducción del [README en inglés](README.md), que es la fuente de verdad. Si ambos difieren, manda el inglés.

# Hallmark

**Una skill de diseño para Claude Code, Codex, Cursor y OpenCode que se niega a parecer generada por IA.**

[usehallmark.com](https://www.usehallmark.com) &nbsp;·&nbsp; cincuenta temas &nbsp;·&nbsp; personalizado bajo pedido &nbsp;·&nbsp; rediseño y auditoría bajo demanda

Hecho por Together AI.

<p align="center">
  <img src="site/OG-hallmark.png" alt="Hallmark, la skill de diseño que acaba con el slop de IA" />
</p>

Hallmark fija un suelo rígido y luego se aparta del camino. Reparte tres temas de un catálogo de cincuenta materiales, construye la página alrededor de aquello que el visitante vino a hacer y pasa el linter al resultado en un navegador real contra los vicios que delatan el trabajo de máquina: el antetítulo sobre cada encabezado, etiquetas en mayúsculas espaciadas, una palabra de color en medio del titular, una página de marcos vacíos o solo de fotografías, un hero que no cabe en la pantalla, un alta de correo al final de cada página, un formulario que da las gracias sin enviar nada. Un revisor con contexto nuevo tiene la última palabra.

Las barreras vienen por niveles. El **Floor** nunca se publica (contraste, foco, movimiento reducido, datos inventados, un diseño roto en el móvil). Las barreras **Reflex** son los automatismos en los que cae un modelo; un build con un motivo puede saltarse una dejando constancia. Las comprobaciones **Finish** son detalle de oficio y nunca bloquean una entrega.

## Novedades de la v2

- **Cincuenta temas.** Cada uno es un material (papel, tipografía, color, superficies, componentes y textura propios) con la imagen de una página terminada, y el build dispone su propia página dentro de él.
- **Construido a partir del trabajo.** Una página de reservas reserva, una tienda vende, un boletín suscribe: la acción va donde la categoría la pone, y la página termina en ella.
- **Personalizado.** Pide una página a medida y Hallmark diseña solo a partir de tu prompt, bajo las mismas reglas y comprobaciones.
- **Tu producto real.** Apúntalo a una URL, a un servidor de desarrollo o a una app y él mismo hace las capturas.
- **Fotografías reales.** 755 fotos con licencia abierta, elegidas por tema y acreditadas en la página.
- **Rediseño y auditoría.** `/hallmark redesign <ruta>` reconstruye una página conservando su contenido y sus conexiones; `/hallmark audit <ruta>` solo informa.

## Temas

<table>
  <tr>
    <td width="20%"><a href="https://www.usehallmark.com/themes/dusk/"><img src="docs/screenshots/dusk.jpg" alt="Tema Dusk: Closewise, conciliación bancaria" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/cobalt/"><img src="docs/screenshots/cobalt.jpg" alt="Tema Cobalt: Relay, una API de webhooks" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/studio/"><img src="docs/screenshots/studio.jpg" alt="Tema Studio: Field Office, un estudio de identidad visual" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/atelier/"><img src="docs/screenshots/atelier.jpg" alt="Tema Atelier: Maison Orla, un taller de perfumería" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/ribbon/"><img src="docs/screenshots/ribbon.jpg" alt="Tema Ribbon: Lull, una app de sonidos para dormir" /></a></td>
  </tr>
  <tr>
    <td><b>Dusk</b><br/><sub>Closewise, conciliación bancaria</sub></td>
    <td><b>Cobalt</b><br/><sub>Relay, una API de webhooks</sub></td>
    <td><b>Studio</b><br/><sub>Field Office, un estudio de identidad visual</sub></td>
    <td><b>Atelier</b><br/><sub>Maison Orla, un taller de perfumería</sub></td>
    <td><b>Ribbon</b><br/><sub>Lull, una app de sonidos para dormir</sub></td>
  </tr>
  <tr>
    <td width="20%"><a href="https://www.usehallmark.com/themes/furrow/"><img src="docs/screenshots/furrow.jpg" alt="Tema Furrow: Fieldbook, registros agrícolas" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/dose/"><img src="docs/screenshots/dose.jpg" alt="Tema Dose: Tandem, una app de medicación familiar" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/refract/"><img src="docs/screenshots/refract.jpg" alt="Tema Refract: Bellwater Lido, una piscina al aire libre" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/vantage/"><img src="docs/screenshots/vantage.jpg" alt="Tema Vantage: Swath, escaneos de obra" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/hedgerow/"><img src="docs/screenshots/hedgerow.jpg" alt="Tema Hedgerow: Five Mile Gin, una destilería" /></a></td>
  </tr>
  <tr>
    <td><b>Furrow</b><br/><sub>Fieldbook, registros agrícolas</sub></td>
    <td><b>Dose</b><br/><sub>Tandem, una app de medicación familiar</sub></td>
    <td><b>Refract</b><br/><sub>Bellwater Lido, una piscina al aire libre</sub></td>
    <td><b>Vantage</b><br/><sub>Swath, escaneos de obra</sub></td>
    <td><b>Hedgerow</b><br/><sub>Five Mile Gin, una destilería</sub></td>
  </tr>
</table>

Diez de los cincuenta. Un tema es un material, no un plan: nunca dice qué contiene una página ni en qué orden, así que dos prompts con un mismo tema dan dos páginas distintas. Cada uno es un archivo de 8 KB como máximo en [`references/themes/`](skills/hallmark/references/themes/) con una imagen al lado; un build lee exactamente uno. Puedes verlos todos en [usehallmark.com](https://www.usehallmark.com).

## Personalizado

Di **custom** y Hallmark deja caer los temas: sin plan, sin componentes, sin receta de paleta, solo el suelo, las barreras y una dirección breve en [`direction.md`](skills/hallmark/references/direction.md) para encontrar la única idea que solo tiene ese cliente y dejar que lleve la página.

## Cómo transcurre un build

1. La comprobación previa lee el proyecto (fuentes, paleta, framework, un `design.md` bloqueado) y pide una sola vez el material: fotos, capturas, cifras reales. No se inventa nada.
2. `scripts/theme.mjs deal` ofrece tres temas que encajan con el prompt y dejan limpio el registro; `draw` reparte la anatomía de la página a partir de su cometido.
3. El hero se construye solo, se renderiza y se revisa en frío antes de que exista el resto de la página.
4. `scripts/sloplint.mjs --render` comprueba la página a ocho anchos y, después, un subagente la revisa con ojos nuevos.

Cada página es HTML y CSS autocontenidos, sellados en su primer comentario CSS con las decisiones que tomó.

## Rediseño

Hallmark nunca empieza sobre un diseño que ya existe a menos que se lo indiques:

```
/hallmark redesign ./src/app
/hallmark audit ./index.html
```

Un rediseño completo conserva el contenido y las conexiones y cambia el sistema y la maquetación; di *keep the layout* para un simple reestilizado o *polish* para tocar solo los vicios. `sloplint --before` registra de antemano cada enlace, campo, handler y encabezado, `sloplint --kept` tumba el rediseño si falta alguno, y la entrega es un antes y después en paralelo.

## Instalación

```
npx skills add nutlope/hallmark -g
```

`-g` instala para todos los proyectos; omítelo para instalar solo en el actual. Necesita Node 18 o superior. Las comprobaciones en navegador (`sloplint --render`, capturas) necesitan además `npm i -g puppeteer-core` y Chrome; sin ellos, las comprobaciones estáticas siguen ejecutándose.

| Harness | Se instala en | Invocación |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/hallmark` | `/hallmark <prompt>` o describe un nuevo build |
| Codex CLI | `~/.agents/skills/hallmark` | `$hallmark <prompt>` o describe un nuevo build |
| Cursor | encuentra las copias de arriba | `/hallmark <prompt>` o describe un nuevo build |
| OpenCode | encuentra las copias de arriba | `/hallmark <prompt>` o describe un nuevo build |

- **Un solo harness:** `npx skills add nutlope/hallmark -g --agent claude-code` (o `codex`, `opencode`, `cursor`, `github-copilot`).
- **Como plugin de Claude Code:** `/plugin marketplace add nutlope/hallmark` y después `/plugin install hallmark@hallmark` (se invoca como `/hallmark:hallmark`).
- **Desde un clon:** `node skills/hallmark/scripts/install.mjs` valida cada tema y cada referencia antes de copiar; `install-hook.mjs` añade a Claude Code una comprobación del Floor en el momento de editar.
- **Linter en cualquier página:** `node skills/hallmark/scripts/sloplint.mjs <archivo-o-directorio> --render`.
- **Si no se activa por su cuenta,** nómbralo: *use hallmark to build ...*.

## Inspirado por

[Impeccable](https://github.com/pbakaus/impeccable) · [frontend-design](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) · [Open Design](https://github.com/nexu-io/open-design) · [Kami](https://github.com/tw93/kami) · [taste-skill](https://github.com/Leonxlnx/taste-skill) · [huashu-design](https://github.com/alchaincyf/huashu-design) · [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) · [las skills de Emil Kowalski](https://github.com/emilkowalski/skills) · [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)

## Licencia

MIT. Úsalo, haz un fork, publícalo.

La biblioteca de fotos (`skills/hallmark/scripts/photos.json`) lista fotografías alojadas en Wikimedia Commons y no guarda ningún archivo de imagen. Cada una conserva su propia licencia (CC0, dominio público, CC BY o CC BY-SA), y Hallmark acredita en la página todas las que usa. No utiliza bancos de imágenes (Unsplash, Pexels, Pixabay), cuyos términos prohíben que las herramientas de IA elijan sus imágenes.
