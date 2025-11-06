# 提交说明

## 需要提交的文件

请使用你的 Git 工具（GitHub Desktop 或其他）提交以下文件：

### 修改的文件：
- `package.json` - 添加了 Cloudflare Pages 构建脚本
- `package-lock.json` - 更新了依赖锁定文件
- `next.config.mjs` - 移除了之前的 Cloudflare 配置
- `.gitignore` - 添加了 .vercel 文件夹忽略
- `.cfignore` - 优化了 Cloudflare Pages 部署文件

### 新增的文件：
- `wrangler.toml` - Cloudflare Pages 配置文件

## 提交信息

```
feat: add Cloudflare Pages support with @cloudflare/next-on-pages

- Install @cloudflare/next-on-pages and wrangler
- Add pages:build script for Cloudflare Pages deployment
- Create wrangler.toml configuration
- Update dependencies to Next.js 15 and React 18
- Optimize .cfignore for deployment
```

## 提交后

Push 到 GitHub，这样：
1. GitHub Actions 会自动部署到 GitHub Pages
2. 你可以配置 Cloudflare Pages 使用新的构建命令

## Cloudflare Pages 构建设置

在 Cloudflare Pages 控制台设置：
- **Framework preset**: Next.js
- **Build command**: `npm run pages:build`
- **Build output directory**: `.vercel/output/static`
- **Node version**: 18

## 环境变量（如果需要）

如果有数据库或其他环境变量，在 Cloudflare Pages 的 Settings → Environment variables 中添加。
