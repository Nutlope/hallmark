# Hallmark

[English](./README.md) | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md)

**一项面向 Claude Code、Cursor 和 Codex 的设计技能，拒绝呈现“AI 生成感”。**

[在线演示 →](https://www.usehallmark.com) &nbsp;·&nbsp; 二十种主题 &nbsp;·&nbsp; 四个动词 &nbsp;·&nbsp; 按 `T` 循环切换。

由 Together AI 制作。

<p align="center">
  <img src="site/OG-hallmark.png" alt="Hallmark：拒绝呈现 AI 生成感的设计技能" />
</p>

Hallmark 会根据需求简报选择宏观结构，为其套用二十种主题之一，运行五十七道俗套测试关卡并在生成前进行自我审查，同时拒绝每个 LLM 在训练中习得的分布内默认模式。Hallmark 针对两份不同需求简报生成的两个页面，会像两个不同的网站，而不是同一模板的换色版本。

---

## 四个动词

| 动词 | 功能 |
| --- | --- |
| *（默认）* | 构建新 UI。选择宏观结构、应用规则集，并在交付前运行俗套测试。 |
| `hallmark audit <target>` | 根据反模式为现有代码评分。输出问题清单，不做修改。 |
| `hallmark redesign <target>` | 丢弃原有结构，保留文案、IA 和品牌，以不同的指纹特征重新构建。 |
| `hallmark study <screenshot \| URL>` | 从你欣赏的设计中提取 **DNA**：宏观结构、字体搭配和色彩锚点。拒绝像素级克隆和付费模板。还可选择生成便携的 `design.md`，用于移交给其他 AI 工具。 |

---

## 不同的需求，不同的形态

每个页面都由不同的需求简报生成。这项技能会选择适合各自需求的主题、结构和工艺，而不是套用模板。

<table>
  <tr>
    <td width="25%"><a href="https://www.usehallmark.com/examples/hum-07/"><img src="docs/screenshots/hero-hum-07.jpg" alt="Bubble 引导式酸面包应用首屏" /></a></td>
    <td width="25%"><a href="https://www.usehallmark.com/examples/cobalt-01/"><img src="docs/screenshots/hero-cobalt-01.jpg" alt="Distil 内容提取 API 首屏" /></a></td>
    <td width="25%"><a href="https://www.usehallmark.com/examples/carnival-01/"><img src="docs/screenshots/hero-carnival-01.jpg" alt="Cold Snap 唱片厂牌 EP 首屏" /></a></td>
    <td width="25%"><a href="https://www.usehallmark.com/examples/lumen-01/"><img src="docs/screenshots/hero-lumen-01.jpg" alt="Cinder AI 推理工具首屏" /></a></td>
  </tr>
  <tr>
    <td><b>Bubble</b><br/><sub>酸面包应用 · Hum</sub></td>
    <td><b>Distil</b><br/><sub>提取 API · Cobalt</sub></td>
    <td><b>Cold Snap</b><br/><sub>唱片厂牌 · Carnival</sub></td>
    <td><b>Cinder</b><br/><sub>AI 工具 · Lumen</sub></td>
  </tr>
  <tr>
    <td><a href="https://www.usehallmark.com/examples/custom-03/"><img src="docs/screenshots/hero-custom-03.jpg" alt="Ferns and Fathom 茶饮菜单首屏" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/garden-01/"><img src="docs/screenshots/hero-garden-01.jpg" alt="Hollowback Apiary 蜂蜜农场首屏" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/riso-01/"><img src="docs/screenshots/hero-riso-01.jpg" alt="Off-Register 孔版印刷展会首屏" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/press-01/"><img src="docs/screenshots/hero-press-01.jpg" alt="Press Quaternary 字体工作室首屏" /></a></td>
  </tr>
  <tr>
    <td><b>Ferns &amp; Fathom</b><br/><sub>茶饮菜单 · Custom</sub></td>
    <td><b>Hollowback Apiary</b><br/><sub>蜂蜜农场 · Garden</sub></td>
    <td><b>Off-Register</b><br/><sub>印刷展会 · Riso</sub></td>
    <td><b>Press Quaternary</b><br/><sub>字体工作室 · Custom</sub></td>
  </tr>
  <tr>
    <td><a href="https://www.usehallmark.com/examples/tally/"><img src="docs/screenshots/hero-tally.jpg" alt="Tally SaaS 产品页面首屏" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/wayfare/"><img src="docs/screenshots/hero-wayfare.jpg" alt="Wayfare 旅行预订首屏" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/najm/"><img src="docs/screenshots/hero-najm.jpg" alt="NAJM 摩洛哥时尚品牌首屏" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/hyperlane/"><img src="docs/screenshots/hero-hyperlane.jpg" alt="Hyperlane 开发者基础设施首屏" /></a></td>
  </tr>
  <tr>
    <td><b>Tally</b><br/><sub>SaaS · modern-minimal</sub></td>
    <td><b>Wayfare</b><br/><sub>旅行 · atmospheric</sub></td>
    <td><b>NAJM</b><br/><sub>时尚品牌</sub></td>
    <td><b>Hyperlane</b><br/><sub>开发基础设施</sub></td>
  </tr>
</table>

每个页面都是独立的 HTML + CSS，并在 CSS 注释中标明其宏观结构。你可以在 [usehallmark.com](https://www.usehallmark.com) 浏览完整集合，也可以在 [`site/_tests/`](site/_tests/) 下查看。

---

## Custom <sup>新功能</sup>

当需求简报带有目录中任何主题都无法满足的创意意图时，Hallmark 会切换到 **Custom**，从零开始设计页面：量身定制配色、字体和布局。仍然经过相同的 57 道俗套测试关卡，底层不使用任何模板。

<table>
  <tr>
    <td width="50%"><a href="https://www.usehallmark.com/examples/custom-02/"><img src="docs/screenshots/hero-custom-02.jpg" alt="The Cascadia Nightjar 卧铺列车车票首屏" /></a></td>
    <td width="50%"><a href="https://www.usehallmark.com/examples/custom-04/"><img src="docs/screenshots/hero-custom-04.jpg" alt="The Mend Assembly 维修咖啡馆大报版面首屏" /></a></td>
  </tr>
  <tr>
    <td><b>The Cascadia Nightjar</b><br/><sub>卧铺列车车票 · Custom</sub></td>
    <td><b>The Mend Assembly</b><br/><sub>维修咖啡馆大报版面 · Custom</sub></td>
  </tr>
</table>

它会保持为一条低调的分支；常规需求简报永远不会触发它。相关协议位于 [`custom-theme.md`](skills/hallmark/references/custom-theme.md)。

---

## 安装

```
npx skills add nutlope/hallmark
```

随时重新运行即可更新。或者将 [`SKILL.md`](skills/hallmark/SKILL.md) 和 [`references/`](skills/hallmark/references/) 复制到：

- **Claude Code**：`~/.claude/skills/hallmark/`
- **Cursor**：`.cursor/rules/hallmark.mdc`（使用 `SKILL.md` 的正文，不含 frontmatter）
- **Codex**：`~/.codex/skills/hallmark/`（个人级）或 `.codex/skills/hallmark/`（项目级）

规则集位于 [`SKILL.md`](skills/hallmark/SKILL.md) 和 [`references/`](skills/hallmark/references/) 中。完整示例位于 [`docs/recipes.md`](docs/recipes.md) 和 [`docs/study-examples.md`](docs/study-examples.md) 中。

---

## 许可证

MIT。使用、复刻并发布它。
