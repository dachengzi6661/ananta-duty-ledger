---
name: 异环勤务录
description: 民国老报纸版式的零氪打卡刊——日/周/月三刊同版，打勾即划线销账
colors:
  paper: "#EFE8D3"
  paper-deep: "#E6DDC2"
  ink: "#1D1A15"
  ink-2: "#5F5A4C"
  ink-3: "#8A836E"
  line: "#D2C9B0"
  red: "#BC2F23"
  red-deep: "#97241A"
typography:
  display:
    fontFamily: "Noto Serif SC, Source Han Serif SC, STZhongsong, SimSun, serif"
    fontWeight: 900
    fontSize: "clamp(2.2rem, 3.8vw, 3rem)"
    lineHeight: "1"
    letterSpacing: "0.16em"
  headline:
    fontFamily: "Noto Serif SC, Source Han Serif SC, STZhongsong, SimSun, serif"
    fontWeight: 900
    fontSize: "clamp(1.95rem, 3.1vw, 2.7rem)"
    lineHeight: "1.3"
    letterSpacing: "0.08em"
  title:
    fontFamily: "Noto Serif SC, Source Han Serif SC, STZhongsong, SimSun, serif"
    fontWeight: 700
    fontSize: "clamp(1.14rem, 1.8vw, 1.62rem)"
    lineHeight: "1.35"
    letterSpacing: "0.03em"
  body:
    fontFamily: "Noto Serif SC, Source Han Serif SC, STZhongsong, SimSun, serif"
    fontWeight: 400
    fontSize: "0.86rem"
    lineHeight: "1.65"
    letterSpacing: "0.02em"
  label:
    fontFamily: "Noto Serif SC, Source Han Serif SC, STZhongsong, SimSun, serif"
    fontWeight: 400
    fontSize: "0.78rem"
    letterSpacing: "0.58em"
  numeral:
    fontFamily: "Georgia, Times New Roman, serif"
    fontStyle: "italic"
    fontWeight: 700
    fontSize: "1.45rem"
  kai:
    fontFamily: "KaiTi, STKaiti, BiauKai, DFKai-SB, Noto Serif SC, serif"
    fontWeight: 400
    fontSize: "0.95rem"
    letterSpacing: "0.4em"
rounded:
  seal: "2px"
---

# Design System: 异环勤务录

## Overview

**Creative North Star: "老报馆日课"**

这一页不是「用了报纸配色的清单」，而是一份每天在老报馆排出来的日课刊：报头即刊名，目录即版面，打勾即划线销账，勾满即盖印付印。所有视觉决策都从「这是一份印刷物」推出——纸有黄褐的陈年色，墨有浓淡三级，朱红只盖在该红的地方，深度靠印刷渗透（mix-blend-mode: multiply）而非投影。

隐喻系统是封闭的：期号 = 年积日（第 272 期即 9 月 29 日）、刊毕倒计时 = 距零点、全勤章 = 日清奖励、凡例 = 产品规则、「内部勤务参考」 = 隐私声明。版面元素同时完成风格与信息两份工作，移除全部内容后仍可辨认为中文报刊目录页。

**Key Characteristics:**
- 通版粗黑外框（2.5px）包裹全部内容，文武线（粗+细双线）分版
- 竖排刊名居右上，楷体落款伴随，朱红小印点睛
- 唯一强调色朱砂红，只属于「完成 / 荣誉 / 焦点」一个语义族
- 钢笔划线 + 墨点 + 合成笔纸声是签名交互，全部长在报刊世界观内

## Colors

纸、墨、朱砂三色体系；墨分三级浓淡承担全部文字层级，朱砂红是唯一强调色。

### Primary
- **朱砂红** (#BC2F23)：勾选钮完成态、钢笔划线与墨点、全勤/周讫/月讫印、「音」印、进度归零红字、focus ring、hover 序号。深体 (#97241A) 用于警示文案。朱红是「完成/荣誉/焦点」的专用语义色。

### Neutral
- **陈纸黄褐** (#EFE8D3)：全局纸底。深纸 (#E6DDC2) 备用于分层底色。
- **油墨浓** (#1D1A15)：刊名、条目题名、正文主色、外框与勾选钮描边。
- **油墨中** (#5F5A4C)：条目元信息、栏头注释、日期行、凡例正文——「次要但必须可读」的一级（纸底对比约 5.1:1）。
- **油墨淡** (#8A836E)：大号装饰数字（期号、序号、/4）与静音态「音」印——仅限大字号（≥3:1 大字标准），正文不得使用。
- **界线灰** (#D2C9B0)：条目间 hairline、栏间竖线、页脚顶线。

### Named Rules
**朱红一义 Rule。** 朱砂红只表达「完成 / 荣誉 / 焦点 / 交互」一个语义族；错误与警示用深朱 (#97241A) 且仅限文案。不允许朱红装饰性存在。
**淡墨不上正文 Rule。** 油墨淡 (#8A836E) 只用于 1.4rem 以上的装饰数字，正文级文字（<1rem）至少用油墨中 (#5F5A4C)。

## Typography

**Display/Title/Body Font:** Noto Serif SC（宋体，900/700/500/400 四档，本地分块子集）
**Label/Kai Font:** KaiTi（楷体，仅报头落款）
**Numerals:** Georgia italic（期号、序号、进度大数字、凡例序号以外的所有西文数字）

**Character:** 宋体承担全部中文——900 排刊名与栏头的「报馆刻本」骨架，700 排条目题名的「铅字标题」肌肉，400 排元信息的「正文小注」安静。Georgia italic 数字是版面上唯一的西文声部，像旧刊物里手植的阿拉伯数字。楷体只出现一次：报头的「零氪不抽卡参考刊」落款。

### Hierarchy
- **Display** (900, clamp(2.2–3rem), 竖排 0.16em 字距)：仅报头刊名「异环勤务录」。
- **Headline** (900, clamp(1.95–2.7rem))：今日目录；副刊栏头降一号（clamp(1.5–2rem)）。
- **Title** (700, clamp(1.14–1.62rem))：条目题名；完成态降为油墨中。
- **Body** (400, 0.86rem, 1.65)：条目元信息、凡例。
- **Label** (400, 0.78rem, 0.58em 字距)：栏侧竖标签「刊况」「凡例」——疏排小字是版面气口。
- **Numeral** (Georgia italic, 1.45rem)：条目序号 01–05；进度大数字 700 体。

### Named Rules
**数字归西文 Rule。** 期号、序号、进度数字一律 Georgia italic；日期与倒计时的语义性数字用汉字（「第 272 期」对「约六小时十九分」并存是有意的：期号是刊物事实，时辰是生活语言）。

## Layout

单页报纸式竖排流。容器 min(1240px, 100%) 居中；通版外框 2.5px 实线包裹主内容，内边距 clamp(1.4rem, 3vw, 2.6rem)。首版非对称双栏 minmax(0,1fr) / 300px（约 7:5）：左今日目录，右刊况栏（border-left hairline，桌面端 sticky）。文武线（border-top 2.5px + border-bottom 1px，高 6px）分出第二版：周刊 minmax(0,1.15fr) / 月刊 minmax(0,.85fr)，栏间 hairline。凡例以 border-top hairline 起头，横排「疏排标签 + 条目列表」。断点：980px 以下全部塌单栏、竖线改横线；600px 以下收紧条目栅格（2.6rem 序号列）与报头字号。节奏：条目行距 1.08rem（副刊 .92rem），hairline 分行，无卡片。

## Elevation & Depth

**印刷无影。** 全系统零 box-shadow。深度只来自三种印刷手法：纸张颗粒（fixed 覆层的 SVG feTurbulence 噪点，multiply 混合）、印章的 mix-blend-mode: multiply（像真盖印吃进纸里）、以及墨色浓淡三级本身。朱红元素与纸面同层，绝不悬浮。

### Named Rules
**印刷无影 Rule。** 禁止 box-shadow；需要「盖上去」的感觉用 multiply 混合，需要「凹进去」的感觉用界线灰 hairline。

## Shapes

直角世界。外框、勾选钮、分隔线全部直角；唯一的圆角是印章的 2px（仿石章轻微磨圆）。线分三等：2.5px 文武线（外框、分版）、1.5px 骨线（勾选钮、音印）、1px 界线灰 hairline（行分隔、栏分隔）。印章语言：双框（外 2.5px + 内 1px inset 2px）、-8° 斜盖、900 体、0.22em 字距。

## Components

### 条目行（签名组件）
- **Shape:** 整行 button，无圆角无卡片底；grid 3.6rem 序号列 + 题名区 + 勾选钮，行间 1px hairline。
- **默认态:** 序号 Georgia italic 淡墨；题名 700 油墨浓；元信息 0.86rem 油墨中；右侧 30px 方形勾选钮（1.5px 油墨描边、纸底）。
- **Hover/Focus:** 序号与勾选钮描边变朱红；focus-visible 2px 朱红 outline 包整行。
- **完成态:** 题名降油墨中 + SVG 红笔划线（0.34s 描边动画）末端墨点回弹；勾选钮填朱红打白勾；序号转朱红。meta 保持油墨中（AA）。

### 勾选钮
- **Shape:** 30×30 直角方框，1.5px 描边。
- **State:** active 缩至 0.92；完成填朱红、白勾以 scale 0→1 回弹（cubic-bezier(.34,1.56,.64,1)）。

### 印章（全勤/周讫/月讫/「勤」/「音」）
- **Shape:** 直角双框小印，2.5px 外框 + 1px 内框，-8° 斜盖，0.22em 字距。
- **款识:** 全勤（日清）、周讫、月讫（副刊清讫）、勤（报头钤印）、音（音效开关）。
- **State:** 出现时 stamp-in 动画（scale 1.8→0.94 回落，rotate -22°→-8°）；「音」印关闭态去底改淡墨描边。

### 刊况栏
- **Style:** border-left hairline + 0.58em 疏排「刊况」标签 +「音」印同行；进度大数字 Georgia 700（勾满变朱红 + pulse）；统计行 hairline 分隔，dt 疏排小字 / dd 700。

### 凡例
- **Style:** border-top hairline；「凡例」疏排标签 + 汉字序号（一、二、三、四）条目列表，0.84rem 油墨中。

## Do's and Don'ts

### Do:
- **Do** 用文武线（粗 2.5px + 细 1px）做一切「版」的分隔，hairline (#D2C9B0) 做一切行的分隔。
- **Do** 让每个新元素先回答「它在印刷物里是什么」——是钤印、是栏头、是眉注，而不是 UI 控件。
- **Do** 数字用 Georgia italic，日期时辰用汉字；两种数字系统并存是版面的双语气质。
- **Do** 动效只用 transform/opacity，弹性曲线（cubic-bezier(.34,1.56,.64,1)）只给「盖印/打勾」类瞬间。

### Don't:
- **Don't** 引入第三种色相；纸/墨/朱砂之外没有颜色。
- **Don't** 用卡片、圆角、投影、渐变——这是铅字印刷，不是仪表盘。
- **Don't** 让朱红出现在与「完成/荣誉/焦点/交互」无关的位置。
- **Don't** 用黑体/无衬线；全页只有宋体、楷体（仅落款）与 Georgia 数字。
- **Don't** 打断「划线销账」的即时性：任何确认弹窗、二次点击、加载态都不允许出现在打卡路径上。
