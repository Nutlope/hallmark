[English](README.md) | **Português (Brasil)** | [Español](README.es.md)

# Hallmark

**Uma skill de design para Claude Code, Codex, Cursor e OpenCode que se recusa a parecer gerada por IA.**

[usehallmark.com](https://www.usehallmark.com) &nbsp;·&nbsp; cinquenta temas &nbsp;·&nbsp; personalizado sob encomenda &nbsp;·&nbsp; redesign e auditoria sob demanda

Feito pela Together AI.

<p align="center">
  <img src="site/OG-hallmark.png" alt="Hallmark, a skill de design que acaba com o slop de IA" />
</p>

O Hallmark fixa um piso rígido e depois sai do caminho. Ele distribui três temas de um catálogo de cinquenta materiais, constrói a página em torno daquilo que o visitante veio fazer e faz lint do resultado em um navegador de verdade contra os vícios que denunciam trabalho de máquina: o sobretítulo acima de todo título, rótulos em maiúsculas espaçadas, uma palavra colorida no meio da manchete, uma página de molduras vazias ou só de fotografias, um hero que não cabe na tela, um cadastro de e-mail no fim de toda página, um formulário que agradece sem enviar nada. Um revisor com contexto novo dá a última palavra.

As travas vêm em níveis. O **Floor** nunca vai para produção (contraste, foco, movimento reduzido, fatos inventados, layout quebrado no celular). As travas **Reflex** são os padrões em que um modelo cai por reflexo; um build com justificativa pode derrubar uma delas, deixando o motivo registrado. As verificações **Finish** são acabamento e nunca bloqueiam uma entrega.

## Novidades da v2

- **Cinquenta temas.** Cada um é um material (papel, tipografia, cor, superfícies, componentes e textura próprios) acompanhado da imagem de uma página pronta, e o build monta a própria página dentro dele.
- **Construído a partir do trabalho.** Uma página de reservas reserva, uma loja vende, uma newsletter inscreve: a ação fica onde a categoria manda, e a página termina nela.
- **Personalizado.** Peça uma página sob encomenda e o Hallmark projeta só a partir do seu prompt, sob as mesmas regras e verificações.
- **Seu produto de verdade.** Aponte para uma URL, um servidor de desenvolvimento ou um app e ele mesmo captura as telas.
- **Fotografias reais.** 755 fotos de licença aberta, escolhidas por assunto e creditadas na página.
- **Redesign e auditoria.** `/hallmark redesign <caminho>` reconstrói uma página preservando conteúdo e ligações; `/hallmark audit <caminho>` apenas aponta os problemas.

## Temas

<table>
  <tr>
    <td width="20%"><a href="https://www.usehallmark.com/themes/dusk/"><img src="docs/screenshots/dusk.jpg" alt="Tema Dusk: Closewise, conciliação bancária" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/cobalt/"><img src="docs/screenshots/cobalt.jpg" alt="Tema Cobalt: Relay, uma API de webhooks" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/studio/"><img src="docs/screenshots/studio.jpg" alt="Tema Studio: Field Office, um estúdio de identidade visual" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/atelier/"><img src="docs/screenshots/atelier.jpg" alt="Tema Atelier: Maison Orla, um ateliê de perfumaria" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/ribbon/"><img src="docs/screenshots/ribbon.jpg" alt="Tema Ribbon: Lull, um app de sons para dormir" /></a></td>
  </tr>
  <tr>
    <td><b>Dusk</b><br/><sub>Closewise, conciliação bancária</sub></td>
    <td><b>Cobalt</b><br/><sub>Relay, uma API de webhooks</sub></td>
    <td><b>Studio</b><br/><sub>Field Office, um estúdio de identidade visual</sub></td>
    <td><b>Atelier</b><br/><sub>Maison Orla, um ateliê de perfumaria</sub></td>
    <td><b>Ribbon</b><br/><sub>Lull, um app de sons para dormir</sub></td>
  </tr>
  <tr>
    <td width="20%"><a href="https://www.usehallmark.com/themes/furrow/"><img src="docs/screenshots/furrow.jpg" alt="Tema Furrow: Fieldbook, registros de fazenda" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/dose/"><img src="docs/screenshots/dose.jpg" alt="Tema Dose: Tandem, um app de medicação para a família" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/refract/"><img src="docs/screenshots/refract.jpg" alt="Tema Refract: Bellwater Lido, uma piscina ao ar livre" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/vantage/"><img src="docs/screenshots/vantage.jpg" alt="Tema Vantage: Swath, escaneamento de canteiro de obras" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/hedgerow/"><img src="docs/screenshots/hedgerow.jpg" alt="Tema Hedgerow: Five Mile Gin, uma destilaria" /></a></td>
  </tr>
  <tr>
    <td><b>Furrow</b><br/><sub>Fieldbook, registros de fazenda</sub></td>
    <td><b>Dose</b><br/><sub>Tandem, um app de medicação para a família</sub></td>
    <td><b>Refract</b><br/><sub>Bellwater Lido, uma piscina ao ar livre</sub></td>
    <td><b>Vantage</b><br/><sub>Swath, escaneamento de canteiro de obras</sub></td>
    <td><b>Hedgerow</b><br/><sub>Five Mile Gin, uma destilaria</sub></td>
  </tr>
</table>

Dez dos cinquenta. Um tema é um material, não um plano: ele nunca diz o que a página contém nem em que ordem, então dois prompts no mesmo tema geram duas páginas diferentes. Cada um é um arquivo de no máximo 8 KB em [`references/themes/`](skills/hallmark/references/themes/) com uma imagem ao lado; um build lê exatamente um. Veja todos em [usehallmark.com](https://www.usehallmark.com).

## Personalizado

Diga **custom** e o Hallmark abandona os temas: sem plano, sem componentes, sem receita de paleta, apenas o piso, as travas e uma direção curta em [`direction.md`](skills/hallmark/references/direction.md) para achar a única ideia que só esse cliente tem e deixar que ela conduza a página.

## Como um build acontece

1. O pré-voo lê o projeto (fontes, paleta, framework, um `design.md` travado) e pede uma única vez o material: fotos, capturas de tela, números reais. Nada é inventado.
2. `scripts/theme.mjs deal` oferece três temas que combinam com o prompt e zeram o log; `draw` distribui a anatomia da página a partir do trabalho dela.
3. O hero é construído sozinho, renderizado e revisado a frio antes que o resto da página exista.
4. `scripts/sloplint.mjs --render` confere a página em oito larguras e, em seguida, um subagente a revisa com olhos novos.

Cada página é HTML e CSS autocontidos, carimbados no primeiro comentário CSS com as decisões que tomou.

## Redesign

O Hallmark nunca mexe num design que já existe a menos que você peça:

```
/hallmark redesign ./src/app
/hallmark audit ./index.html
```

Um redesign completo preserva o conteúdo e as ligações e troca o sistema e o layout; diga *keep the layout* para apenas reestilizar ou *polish* para mexer só nos vícios. O `sloplint --before` registra antes cada link, campo, handler e título, o `sloplint --kept` reprova o redesign se algum tiver sumido, e a entrega é um antes e depois lado a lado.

## Instalação

```
npx skills add nutlope/hallmark -g
```

O `-g` instala para todos os projetos; omita para instalar apenas no atual. Requer Node 18 ou superior. As verificações em navegador (`sloplint --render`, capturas de tela) também precisam de `npm i -g puppeteer-core` e do Chrome; sem eles, as verificações estáticas continuam rodando.

| Harness | Instala em | Invocação |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/hallmark` | `/hallmark <prompt>` ou descreva um novo build |
| Codex CLI | `~/.agents/skills/hallmark` | `$hallmark <prompt>` ou descreva um novo build |
| Cursor | encontra as cópias acima | `/hallmark <prompt>` ou descreva um novo build |
| OpenCode | encontra as cópias acima | `/hallmark <prompt>` ou descreva um novo build |

- **Apenas um harness:** `npx skills add nutlope/hallmark -g --agent claude-code` (ou `codex`, `opencode`, `cursor`, `github-copilot`).
- **Como plugin do Claude Code:** `/plugin marketplace add nutlope/hallmark` e depois `/plugin install hallmark@hallmark` (invocado como `/hallmark:hallmark`).
- **A partir de um clone:** `node skills/hallmark/scripts/install.mjs` valida cada tema e referência antes de copiar; o `install-hook.mjs` adiciona ao Claude Code uma verificação do Floor na hora da edição.
- **Lint em qualquer página:** `node skills/hallmark/scripts/sloplint.mjs <arquivo-ou-diretório> --render`.
- **Se ele não disparar sozinho,** chame pelo nome: *use hallmark to build ...*.

## Inspirado por

[Impeccable](https://github.com/pbakaus/impeccable) · [frontend-design](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) · [Open Design](https://github.com/nexu-io/open-design) · [Kami](https://github.com/tw93/kami) · [taste-skill](https://github.com/Leonxlnx/taste-skill) · [huashu-design](https://github.com/alchaincyf/huashu-design) · [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) · [skills do Emil Kowalski](https://github.com/emilkowalski/skills) · [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)

## Licença

MIT. Use, faça fork, publique.

A biblioteca de fotos (`skills/hallmark/scripts/photos.json`) lista fotografias hospedadas no Wikimedia Commons e não guarda nenhum arquivo de imagem. Cada uma mantém a própria licença (CC0, domínio público, CC BY ou CC BY-SA), e o Hallmark credita na página todas as que usa. Ele não usa bancos de imagem (Unsplash, Pexels, Pixabay), cujos termos proíbem ferramentas de IA de escolherem suas imagens.
