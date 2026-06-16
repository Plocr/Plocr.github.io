---
title: Hello PlocrのBlog
date: 2023-05-11 12:17:00
updated: 2025-05-15
tags: [项目日志]
excerpt: 从 Hexo + Butterfly 到自研 Claude 风格主题 + Vercel 部署，折腾了两年多的博客进化史。
---

## 欢迎来到我的小窝

这是我的第一个博客。从 2023 年开始搭建，断断续续折腾了两年多，才有了现在的样子。

> 一开始只想有个地方放文章，最后变成了一个精装修的 Web 项目。

---

## 博客都用了什么

### 框架

[Hexo](https://hexo.io/)，一个用 Node.js 驱动的静态博客生成器。用 Markdown 写文章，一条命令生成静态网页。

当初选它是因为简单——不用数据库、不用服务器，写完 push 上去就完事。现在回头看这个决策，没选错。

### 主题

最早用的是 **Butterfly** 主题，后来觉得太花哨，删了重写。

现在的主题是照着 Claude 官网的设计语言手搓的：低饱和莫兰迪色系、手绘 SVG 插画、12px 圆角、4px 间距、亮暗双模式。全站字体换了小濑，代码用 Fantasque Sans Mono。

没有用任何现成的 UI 框架，CSS 从零写，JS 从零写。所以细节全都是自己可控的。

### 域名

最开始挂在 `plocr.github.io` 免费域名上。后来买了一枚域名 `plocr.online`，通过阿里云 DNS 解析到 Vercel。

> 墙内访问 GitHub Pages 不太稳定，加一层 Vercel 做反向代理好很多。

### 部署架构

现在有两套并行的部署：

| 线路 | 方式 | 地址 |
|------|------|------|
| 主站 | Vercel 自动部署 | https://www.plocr.online |
| 备用 | GitHub Actions → Pages | https://plocr.github.io |

每次写文章 push 到 `master` 分支，两边会同时更新。主站挂了还有备用，不至于打不开。

### 字体

- **全站文字**：[小濑字体](https://github.com/lxgw/kose-font)，一款手写风格的中文开源字体
- **代码块**：[Fantasque Sans Mono](https://github.com/belluzj/fantasque-sans-mono)

### 评论

用了 [Giscus](https://giscus.app/)，基于 GitHub Discussions，不需要服务器也不需要数据库。只有登录 GitHub 的人才能评论，避免了机器人乱发广告的问题。

### 其他小东西

- 亮/暗模式一键切换，首次打开跟随系统设置
- 手绘 SVG 插画，每篇文章自动分配不同的默认封面
- 一键回到顶部按钮
- 光标跟随光晕
- 响应式适配，手机、平板、桌面各有一套

---

## 关于我

一个喜欢折腾的开发者。对技术保持好奇，对生活保持感知。

写代码、看电影、听歌、偶尔拍照。认为好的工具应该像手写一样自然。

---

## 后续

以后会在这里陆续更新技术笔记、工作流分享和生活记录。关于博客本身的改动也会写在「项目日志」这个分类里。

欢迎常来看看。
