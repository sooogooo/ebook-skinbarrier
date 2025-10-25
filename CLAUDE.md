# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static e-book generator for "皮肤屏障修复 - 从颜值事故到美丽故事" (Skin Barrier Repair: From Beauty Disasters to Beauty Stories), a comprehensive Chinese-language guide on skincare and skin barrier restoration. The project converts 19 structured markdown files into a single-page HTML e-book with fixed sidebar navigation.

**Content Focus**: Medical aesthetics education covering skin barrier science, damage prevention, repair protocols (C.O.R.E. method), and maintenance strategies.

**Company**: 重庆联合丽格科技有限公司 (Chongqing United Lige Technology Co., Ltd.)

## Build System

### Building the E-Book

```bash
node build.js
```

This command:
1. Reads all `.md` files in the root directory
2. Sorts them alphabetically (00_Foreword.md through 18_AppendixC_D_GlossaryAndReferences.md)
3. Extracts chapter titles from the first `# Heading` in each file
4. Converts markdown to HTML using the `marked` library
5. Generates a single `index.html` file with embedded CSS and JavaScript

### Installing Dependencies

```bash
npm install
```

Only dependency: `marked@^16.3.0` for markdown parsing.

### Viewing the E-Book

After building, open `index.html` in a web browser. No web server required - it's a fully self-contained HTML file.

## Content Structure

### Markdown Files

19 numbered markdown files form the complete e-book:

- `00_Foreword.md` - Introduction and self-assessment questionnaire
- `01_SkinBarrierTruth.md` through `03_DamageSignals.md` - Part 1: Understanding (认知篇)
- `04_COREMethod.md` through `10_TimelineAndMentality.md` - Part 2: Practice (实践篇)
- `11_RebootingActives.md` through `15_ProfessionalHelp.md` - Part 3: Advanced (进阶篇)
- `16_AppendixA_Ingredients.md` through `18_AppendixC_D_GlossaryAndReferences.md` - Appendices

**Total content**: ~2,600 lines of markdown text.

### File Naming Convention

Files use numbered prefixes (00-18) to ensure correct alphabetical sorting and chapter ordering in the generated HTML. Do not change file names without updating the entire sequence.

### Content Guidelines

**Language**: All content is in Simplified Chinese. Preserve exact Chinese characters when editing.

**Medical Accuracy**: Content provides evidence-based information about dermatology and skincare. Edits should maintain scientific accuracy.

**Key Framework**: The "C.O.R.E. 四步修复法" (C.O.R.E. Four-Step Repair Method) is the central methodology:
- **C** - Calm (舒缓镇静): Reduce inflammation
- **O** - Optimize (优化环境): Simplify skincare routine
- **R** - Repair (修复结构): Rebuild skin barrier
- **E** - Enhance (增强防护): Strengthen protection

## Generated HTML Structure

The `build.js` script creates `index.html` with:

1. **Fixed sidebar navigation** (`#toc`): 280px wide, contains chapter links with smooth scrolling
2. **Main content area** (`#content`): Left margin 300px, max-width 800px, contains all chapters in sequence
3. **Active chapter highlighting**: JavaScript tracks scroll position and highlights current chapter in sidebar
4. **Embedded styling**: All CSS is inline, no external stylesheets
5. **Responsive typography**: Uses system fonts with Chinese character support

Each markdown file becomes a `<div id="ch-{filename}">` in the HTML, with the filename (minus `.md` extension) as the anchor ID.

## Making Content Changes

1. Edit the relevant `.md` file(s) directly
2. Run `node build.js` to regenerate `index.html`
3. Refresh browser to see changes

**Important**: Always rebuild after editing markdown files. The `index.html` file is the build artifact and should not be edited directly.

## HTML Styling

The build script includes embedded CSS with:
- System font stack for Chinese character rendering
- Fixed sidebar with scroll highlighting
- Responsive layout (though not mobile-optimized)
- Styled tables, code blocks, and images with borders/padding
- Heading underlines and spacing

To modify styles, edit the CSS template in `build.js` lines 20-104.

## Project Context

This is part of a larger collection of medical aesthetics educational projects by 重庆联合丽格科技有限公司. Other related projects include:
- chemicalpeel (Next.js e-book on chemical peels)
- beautiful-mind (MkDocs psychology guide)
- lips-aesthetics (3D WebGL visualization platform)

Each project is independent with its own build system and deployment.
