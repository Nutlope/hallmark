# Hallmark

[English](./README.md) | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md)

**Claude Code、Cursor、Codex 向けの、AI が生成したように見えるデザインを拒むデザインスキルです。**

[ライブデモ →](https://www.usehallmark.com) &nbsp;·&nbsp; 20 種類のテーマ &nbsp;·&nbsp; 4 つの動詞 &nbsp;·&nbsp; `T` キーで順番に切り替え。

Together AI が制作しています。

<p align="center">
  <img src="site/OG-hallmark.png" alt="AI が生成したように見えるデザインを拒むデザインスキル Hallmark" />
</p>

Hallmark はブリーフに合わせてマクロ構造を選び、20 種類のテーマのいずれかで仕上げ、57 項目のスロップテストと出力前の自己批評を実行し、あらゆる LLM が学習した分布内の既定パターンを拒みます。異なる 2 つのブリーフから Hallmark が生成したページは、同じテンプレートの色違いではなく、別々のサイトのように見えます。

---

## 4 つの動詞

| 動詞 | 機能 |
| --- | --- |
| *（デフォルト）* | 新しい UI を構築します。マクロ構造を選び、ルールセットを適用し、引き渡す前にスロップテストを実行します。 |
| `hallmark audit <target>` | 既存コードをアンチパターンに照らして評価します。修正は行わず、問題一覧を出力します。 |
| `hallmark redesign <target>` | 構造を捨て、コピー、IA、ブランドを維持しながら、異なるフィンガープリントで再構築します。 |
| `hallmark study <screenshot \| URL>` | 気に入ったデザインから **DNA**（マクロ構造、書体の組み合わせ、色のアンカー）を抽出します。ピクセル単位の複製や有料テンプレートは拒否します。必要に応じて、ほかの AI ツールへ引き継げるポータブルな `design.md` を出力します。 |

---

## ブリーフが違えば、形も変わる

各ページは異なるブリーフから生成されています。このスキルはテンプレートを使うのではなく、それぞれに合うテーマ、構造、仕上げを選びます。

<table>
  <tr>
    <td width="25%"><a href="https://www.usehallmark.com/examples/hum-07/"><img src="docs/screenshots/hero-hum-07.jpg" alt="Bubble のガイド付きサワードウアプリのヒーロー" /></a></td>
    <td width="25%"><a href="https://www.usehallmark.com/examples/cobalt-01/"><img src="docs/screenshots/hero-cobalt-01.jpg" alt="Distil コンテンツ抽出 API のヒーロー" /></a></td>
    <td width="25%"><a href="https://www.usehallmark.com/examples/carnival-01/"><img src="docs/screenshots/hero-carnival-01.jpg" alt="Cold Snap レコードレーベルの EP ヒーロー" /></a></td>
    <td width="25%"><a href="https://www.usehallmark.com/examples/lumen-01/"><img src="docs/screenshots/hero-lumen-01.jpg" alt="Cinder AI 推論ツールのヒーロー" /></a></td>
  </tr>
  <tr>
    <td><b>Bubble</b><br/><sub>サワードウアプリ · Hum</sub></td>
    <td><b>Distil</b><br/><sub>抽出 API · Cobalt</sub></td>
    <td><b>Cold Snap</b><br/><sub>レコードレーベル · Carnival</sub></td>
    <td><b>Cinder</b><br/><sub>AI ツール · Lumen</sub></td>
  </tr>
  <tr>
    <td><a href="https://www.usehallmark.com/examples/custom-03/"><img src="docs/screenshots/hero-custom-03.jpg" alt="Ferns and Fathom のティーメニューのヒーロー" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/garden-01/"><img src="docs/screenshots/hero-garden-01.jpg" alt="Hollowback Apiary の養蜂場のヒーロー" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/riso-01/"><img src="docs/screenshots/hero-riso-01.jpg" alt="Off-Register リソグラフ印刷フェアのヒーロー" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/press-01/"><img src="docs/screenshots/hero-press-01.jpg" alt="Press Quaternary 書体スタジオのヒーロー" /></a></td>
  </tr>
  <tr>
    <td><b>Ferns &amp; Fathom</b><br/><sub>ティーメニュー · Custom</sub></td>
    <td><b>Hollowback Apiary</b><br/><sub>養蜂場 · Garden</sub></td>
    <td><b>Off-Register</b><br/><sub>印刷フェア · Riso</sub></td>
    <td><b>Press Quaternary</b><br/><sub>書体スタジオ · Custom</sub></td>
  </tr>
  <tr>
    <td><a href="https://www.usehallmark.com/examples/tally/"><img src="docs/screenshots/hero-tally.jpg" alt="Tally SaaS 製品ページのヒーロー" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/wayfare/"><img src="docs/screenshots/hero-wayfare.jpg" alt="Wayfare 旅行予約のヒーロー" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/najm/"><img src="docs/screenshots/hero-najm.jpg" alt="NAJM モロッコのファッションブランドのヒーロー" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/hyperlane/"><img src="docs/screenshots/hero-hyperlane.jpg" alt="Hyperlane 開発者インフラのヒーロー" /></a></td>
  </tr>
  <tr>
    <td><b>Tally</b><br/><sub>SaaS · modern-minimal</sub></td>
    <td><b>Wayfare</b><br/><sub>旅行 · atmospheric</sub></td>
    <td><b>NAJM</b><br/><sub>ファッションブランド</sub></td>
    <td><b>Hyperlane</b><br/><sub>開発インフラ</sub></td>
  </tr>
</table>

各ページは自己完結した HTML + CSS で、CSS コメントにマクロ構造が記されています。すべてのページは [usehallmark.com](https://www.usehallmark.com) または [`site/_tests/`](site/_tests/) 以下で閲覧できます。

---

## Custom <sup>新機能</sup>

カタログ内のどのテーマにも当てはまらない創造的な意図をブリーフが持つ場合、Hallmark は **Custom** に切り替え、ページをゼロからデザインします。配色、書体、レイアウトはすべてオーダーメイドです。同じ 57 項目のスロップテストを通過し、基礎にテンプレートはありません。

<table>
  <tr>
    <td width="50%"><a href="https://www.usehallmark.com/examples/custom-02/"><img src="docs/screenshots/hero-custom-02.jpg" alt="The Cascadia Nightjar 寝台列車チケットのヒーロー" /></a></td>
    <td width="50%"><a href="https://www.usehallmark.com/examples/custom-04/"><img src="docs/screenshots/hero-custom-04.jpg" alt="The Mend Assembly リペアカフェのブロードシートのヒーロー" /></a></td>
  </tr>
  <tr>
    <td><b>The Cascadia Nightjar</b><br/><sub>寝台列車チケット · Custom</sub></td>
    <td><b>The Mend Assembly</b><br/><sub>リペアカフェのブロードシート · Custom</sub></td>
  </tr>
</table>

これは目立たない分岐として保たれ、通常のブリーフから呼び出されることはありません。プロトコルは [`custom-theme.md`](skills/hallmark/references/custom-theme.md) にあります。

---

## インストール

```
npx skills add nutlope/hallmark
```

更新するにはいつでも再実行してください。または、[`SKILL.md`](skills/hallmark/SKILL.md) と [`references/`](skills/hallmark/references/) を次の場所へコピーします。

- **Claude Code**：`~/.claude/skills/hallmark/`
- **Cursor**：`.cursor/rules/hallmark.mdc`（`SKILL.md` の本文。frontmatter は除く）
- **Codex**：`~/.codex/skills/hallmark/`（個人用）または `.codex/skills/hallmark/`（プロジェクト用）

ルールセットは [`SKILL.md`](skills/hallmark/SKILL.md) と [`references/`](skills/hallmark/references/) にあります。実例は [`docs/recipes.md`](docs/recipes.md) と [`docs/study-examples.md`](docs/study-examples.md) にあります。

---

## ライセンス

MIT。自由に使い、フォークし、公開してください。
