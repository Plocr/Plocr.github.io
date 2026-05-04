# Plocr の 小窝

个人博客，基于 Hexo 构建，Claude 风格自定义主题。

[![Deploy Hexo to GitHub Pages](https://github.com/Plocr/Plocr.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Plocr/Plocr.github.io/actions/workflows/deploy.yml)

## 技术栈

| 层 | 技术 |
|------|------|
| 框架 | [Hexo](https://hexo.io/) v8 — 静态博客生成器 |
| 主题 | `themes/claude/` — 自研 Claude 风格主题 |
| 部署 | GitHub Pages + GitHub Actions |
| 字体 | Ubuntu Mono（标题）、PT Serif（正文）、Inter（UI） |

## 项目结构

```
/
├── source/                  # 博客源码
│   ├── _posts/              # Markdown 文章
│   ├── about/               # 关于页面
│   ├── ai/                  # AI 导航页面
│   ├── img/                 # 图片资源
│   ├── movies/              # 电影页面
│   └── music/               # 音乐页面
├── themes/
│   └── claude/              # 自定义主题
│       ├── _config.yml      # 主题配置
│       ├── layout/          # EJS 模板
│       │   ├── layout.ejs   # 主布局（导航 + 页脚）
│       │   ├── index.ejs    # 首页（全屏 Hero + 文章卡片）
│       │   ├── post.ejs     # 文章详情
│       │   ├── page.ejs     # 静态页面
│       │   ├── archive.ejs  # 文章归档
│       │   └── ai.ejs       # AI 导航
│       └── source/
│           ├── css/claude.css  # 全部样式
│           └── js/claude.js    # 交互逻辑
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions 自动部署
└── _config.yml              # Hexo 主配置
```

## 快速开始

```bash
# 安装依赖
npm install

# 本地预览
npx hexo server
# 访问 http://localhost:4000

# 新建文章
npx hexo new "文章标题"

# 构建静态文件
npx hexo generate
```

## 写文章

在 `source/_posts/` 下创建 `.md` 文件，支持 Front-matter：

```markdown
---
title: 文章标题
date: 2025-05-04
updated: 2025-05-04
cover: https://example.com/cover.jpg  # 封面图（可选）
tags: [标签1, 标签2]                   # 标签（可选）
---

文章正文，支持 Markdown 语法。
```

## 发布流程

```bash
git add -A
git commit -m "新文章"
git push origin source
```

推送 `source` 分支后，GitHub Actions 自动构建并部署到 `master` 分支，更新 [https://plocr.github.io](https://plocr.github.io)。

## 主题特性

- 莫兰迪低饱和色系（暖奶油白 `#F4F1EA` + 珊瑚橙 `#D97757`）
- 100vh 全屏 Hero + 浮动粒子动画
- SVG 手绘插画（feTurbulence 粗糙质感滤镜）
- 亮/暗双模式一键切换
- 滚动触发淡入上浮（IntersectionObserver）
- 卡片 hover 上浮 + 图片视差
- 导航栏滚动隐藏/显示
- 移动端右侧滑出抽屉菜单
- 无封面文章自动分配 5 种手绘默认封面（基于标题 hash 确定）
- AI 导航页面（30+ 主流 AI 工具分类展示）
- 响应式适配（6 级断点：1200+ / 1024+ / 900+ / 768+ / 480+ / <480）

## 页面

| 路径 | 说明 |
|------|------|
| `/` | 首页：全屏 Hero + 文章卡片 + 统计 + 关于 |
| `/archives/` | 文章归档 |
| `/ai/` | AI 工具导航 |
| `/about/` | 关于 |
| `/music/` | 音乐 |
| `/movies/` | 电影 |
