# 提交说明 - 修复静态导出问题

## 🔧 修复内容

### 问题
- GitHub Actions 部署失败，因为 API Routes 不支持静态导出（`output: 'export'`）

### 解决方案
- **将 API 逻辑移到客户端**：`match-analyzer.tsx` 现在直接调用 `analyzeMatch` 函数
- **保留 API Routes**：为 Cloudflare Pages 等支持服务器端的平台保留
- **添加 `force-static` 标记**：让 API Routes 在静态导出时被正确处理

## 📝 需要提交的文件

请使用 Git 工具提交以下文件：

### 修改的文件：
- ✅ `src/components/match-analyzer.tsx` - 改用客户端逻辑
- ✅ `src/app/api/heroes/route.ts` - 添加 `force-static`
- ✅ `src/app/api/match/analyze/route.ts` - 添加 `force-static`
- ✅ `package.json` - Cloudflare Pages 构建脚本
- ✅ `package-lock.json` - 依赖锁定文件
- ✅ `next.config.mjs` - 恢复简洁配置
- ✅ `.gitignore` - 添加 .vercel 忽略
- ✅ `.cfignore` - Cloudflare Pages 部署优化

### 新增的文件：
- ✅ `wrangler.toml` - Cloudflare Pages 配置

## 🚀 提交命令

```bash
git add .
git commit -m "fix: use client-side logic for static export compatibility

- Move match analysis logic from API to client-side
- Add force-static to API routes for static export
- Add Cloudflare Pages support with @cloudflare/next-on-pages
- Update dependencies to Next.js 15 and React 18"
git push
```

## ✅ 预期结果

### GitHub Actions (GitHub Pages)
- ✅ 应该成功构建和部署
- ✅ 使用静态导出（`output: 'export'`）
- ✅ 所有功能都在客户端运行

### Cloudflare Pages
配置后应该也能正常工作：
- **Build command**: `npm run pages:build`
- **Build output**: `.vercel/output/static`
- **Node version**: 18

## 🎯 关键改动说明

### match-analyzer.tsx
**之前**：调用 `/api/match/analyze` API
```typescript
const res = await fetch("/api/match/analyze", {
  method: "POST",
  body: JSON.stringify({ heroIds: ... })
});
```

**现在**：直接调用分析函数
```typescript
import { analyzeMatch } from "@/services/match-analysis";
// ...
const data = analyzeMatch(heroIds);
```

这样既支持静态导出（GitHub Pages），又保持了代码的简洁性！

